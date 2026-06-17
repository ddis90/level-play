// Main Bicep for the Levelplay portal — provisions everything azd needs.
// One template serves both dev and prd; SKUs scale via the `environmentName`.
targetScope = 'resourceGroup'

@minLength(1)
@description('Name of the azd environment (e.g. dev, prd). Drives naming and sizing.')
param environmentName string

@minLength(1)
@description('Primary location for all resources.')
param location string = resourceGroup().location

@description('PostgreSQL administrator login.')
param postgresAdminUser string = 'lpadmin'

@secure()
@description('PostgreSQL administrator password. Provided by azd (prompted/stored in env).')
param postgresAdminPassword string

@description('Session signing secret for the app.')
@secure()
param sessionSecret string

// Resource token keeps names unique and stable per environment.
var resourceToken = toLower(uniqueString(subscription().id, environmentName, location))
var prefix = 'lp-${environmentName}'
var isProd = environmentName == 'prd'

// Production gets larger SKUs; dev stays cheap for the POC.
var appCpu = isProd ? 1 : json('0.5')
var appMemory = isProd ? '2.0Gi' : '1.0Gi'
var appMinReplicas = isProd ? 1 : 0
var pgSku = isProd ? 'Standard_D2s_v3' : 'Standard_B1ms'
var pgTier = isProd ? 'GeneralPurpose' : 'Burstable'
var pgStorageGb = isProd ? 64 : 32

var tags = {
  'azd-env-name': environmentName
  application: 'levelplay-portal'
}

// --- Observability -----------------------------------------------------------
resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: '${prefix}-logs-${resourceToken}'
  location: location
  tags: tags
  properties: {
    sku: { name: 'PerGB2018' }
    retentionInDays: 30
  }
}

// --- Key Vault (secrets) -----------------------------------------------------
resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: take('${prefix}-kv-${resourceToken}', 24)
  location: location
  tags: tags
  properties: {
    sku: { family: 'A', name: 'standard' }
    tenantId: subscription().tenantId
    enableRbacAuthorization: true
    enableSoftDelete: true
  }
}

// --- Storage (Blob for media uploads in prod) --------------------------------
resource storage 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: take('lp${environmentName}${resourceToken}', 24)
  location: location
  tags: tags
  sku: { name: isProd ? 'Standard_GRS' : 'Standard_LRS' }
  kind: 'StorageV2'
  properties: {
    allowBlobPublicAccess: false
    minimumTlsVersion: 'TLS1_2'
  }
}

resource blobService 'Microsoft.Storage/storageAccounts/blobServices@2023-05-01' = {
  parent: storage
  name: 'default'
}

resource mediaContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-05-01' = {
  parent: blobService
  name: 'media'
  properties: { publicAccess: 'None' }
}

// --- PostgreSQL Flexible Server ---------------------------------------------
resource postgres 'Microsoft.DBforPostgreSQL/flexibleServers@2023-06-01-preview' = {
  name: '${prefix}-pg-${resourceToken}'
  location: location
  tags: tags
  sku: { name: pgSku, tier: pgTier }
  properties: {
    version: '16'
    administratorLogin: postgresAdminUser
    administratorLoginPassword: postgresAdminPassword
    storage: { storageSizeGB: pgStorageGb }
    backup: {
      backupRetentionDays: isProd ? 14 : 7
      geoRedundantBackup: isProd ? 'Enabled' : 'Disabled'
    }
    highAvailability: { mode: isProd ? 'ZoneRedundant' : 'Disabled' }
  }
}

resource postgresDb 'Microsoft.DBforPostgreSQL/flexibleServers/databases@2023-06-01-preview' = {
  parent: postgres
  name: 'levelplay'
}

// Allow Azure services (e.g. the Container App) to reach the DB.
resource pgFirewallAzure 'Microsoft.DBforPostgreSQL/flexibleServers/firewallRules@2023-06-01-preview' = {
  parent: postgres
  name: 'AllowAllAzureServices'
  properties: { startIpAddress: '0.0.0.0', endIpAddress: '0.0.0.0' }
}

var databaseUrl = 'postgresql://${postgresAdminUser}:${postgresAdminPassword}@${postgres.properties.fullyQualifiedDomainName}:5432/levelplay?sslmode=require'

// --- Container Apps environment + app ---------------------------------------
resource containerEnv 'Microsoft.App/managedEnvironments@2024-03-01' = {
  name: '${prefix}-env-${resourceToken}'
  location: location
  tags: tags
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalytics.properties.customerId
        sharedKey: logAnalytics.listKeys().primarySharedKey
      }
    }
  }
}

resource containerApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: '${prefix}-web-${resourceToken}'
  location: location
  // azd matches this service by the azd-service-name tag.
  tags: union(tags, { 'azd-service-name': 'web' })
  identity: { type: 'SystemAssigned' }
  properties: {
    managedEnvironmentId: containerEnv.id
    configuration: {
      ingress: {
        external: true
        targetPort: 3000
        transport: 'auto'
      }
      secrets: [
        { name: 'database-url', value: databaseUrl }
        { name: 'session-secret', value: sessionSecret }
      ]
    }
    template: {
      containers: [
        {
          name: 'web'
          // Placeholder image; azd replaces it with the built app image on deploy.
          image: 'mcr.microsoft.com/azuredocs/containerapps-helloworld:latest'
          resources: { cpu: appCpu, memory: appMemory }
          env: [
            { name: 'DATABASE_URL', secretRef: 'database-url' }
            { name: 'SESSION_SECRET', secretRef: 'session-secret' }
            { name: 'APP_ENV', value: environmentName }
            { name: 'AZURE_STORAGE_ACCOUNT', value: storage.name }
          ]
        }
      ]
      scale: {
        minReplicas: appMinReplicas
        maxReplicas: isProd ? 5 : 2
      }
    }
  }
}

// --- Outputs (consumed by azd / app) ----------------------------------------
output AZURE_LOCATION string = location
output WEB_URI string = 'https://${containerApp.properties.configuration.ingress.fqdn}'
output POSTGRES_FQDN string = postgres.properties.fullyQualifiedDomainName
output STORAGE_ACCOUNT string = storage.name
output KEY_VAULT_NAME string = keyVault.name
