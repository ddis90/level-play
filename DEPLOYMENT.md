# Levelplay Deployment - Windows Workaround Solutions

The Azure CLI on Windows has Unicode display issues preventing us from seeing build errors. Here are **3 efficient solutions** to deploy from Azure:

---

## ✅ OPTION 1: Azure Cloud Shell (RECOMMENDED - 5 minutes)

**Easiest and fastest - no setup required!**

### Steps:

1. **Open Azure Cloud Shell**
   - Go to: https://shell.azure.com
   - Or click the `>_` icon in Azure Portal top bar
   - Choose "Bash" when prompted

2. **Upload your code**
   ```bash
   # In Cloud Shell, upload the web folder
   # Click "Upload/Download files" button (folder with arrow icon)
   # Select the entire 'web' folder from your machine
   ```

3. **Run the deployment script**
   ```bash
   cd web
   chmod +x deploy-cloudshell.sh
   ./deploy-cloudshell.sh
   ```

4. **Done!** Your app will be live at:
   https://lp-dev-web-kopp3c4slv3eg.delightfulpebble-1cfc730a.eastus.azurecontainerapps.io

---

## ✅ OPTION 2: GitHub Actions (BEST for CI/CD - 10 minutes)

**Best for automated deployments on every code change**

### Steps:

1. **Push code to GitHub**
   ```bash
   cd C:\Users\A962251\hm\wip\personal\ruflo\web
   git init  # if not already a repo
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/levelplay.git
   git push -u origin main
   ```

2. **Create Azure Service Principal**
   ```bash
   az ad sp create-for-rbac --name "levelplay-github" \
     --role contributor \
     --scopes /subscriptions/738826d4-0935-48a2-b402-670d99728697/resourceGroups/rg-levelplay-dev \
     --sdk-auth
   ```
   Copy the entire JSON output

3. **Add GitHub Secret**
   - Go to your GitHub repo → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `AZURE_CREDENTIALS`
   - Value: Paste the JSON from step 2

4. **Trigger deployment**
   - Go to Actions tab → "Build and Deploy to Azure" → Run workflow
   - Or push any change to main branch

---

## ✅ OPTION 3: Azure DevOps Pipelines (BEST for enterprise - 15 minutes)

**Best for organizations already using Azure DevOps**

### Steps:

1. **Create Azure DevOps project**
   - Go to: https://dev.azure.com
   - Create new project: "Levelplay"

2. **Push code to Azure Repos**
   ```bash
   cd C:\Users\A962251\hm\wip\personal\ruflo\web
   git remote add azure https://dev.azure.com/YOUR_ORG/levelplay/_git/levelplay
   git push azure main
   ```

3. **Create Service Connection**
   - Project Settings → Service connections
   - New service connection → Azure Resource Manager
   - Service principal (automatic)
   - Subscription: Select your subscription
   - Resource group: rg-levelplay-dev
   - Name: Azure-Service-Connection

4. **Create Pipeline**
   - Pipelines → New pipeline
   - Azure Repos Git → Select your repo
   - Existing Azure Pipelines YAML file → /azure-pipelines.yml
   - Run

---

## 🔧 OPTION 4: Manual Cloud Shell Commands (Fastest for one-time)

If you just want to deploy once quickly:

1. Go to https://shell.azure.com
2. Upload web folder
3. Run these commands:

```bash
cd web
az account set --subscription 738826d4-0935-48a2-b402-670d99728697

# Build
az acr build \
  --registry lpdevregistry848e7b \
  --image levelplay-web:latest \
  --file ./Dockerfile \
  .

# Deploy
az containerapp update \
  --name lp-dev-web-kopp3c4slv3eg \
  --resource-group rg-levelplay-dev \
  --image lpdevregistry848e7b.azurecr.io/levelplay-web:latest
```

---

## 📊 Comparison

| Option | Time | Complexity | Best For | Auto-Deploy |
|--------|------|------------|----------|-------------|
| Cloud Shell | 5 min | ⭐ Easy | Quick fixes | ❌ No |
| GitHub Actions | 10 min | ⭐⭐ Medium | Open source, CI/CD | ✅ Yes |
| Azure DevOps | 15 min | ⭐⭐⭐ Medium | Enterprise, private repos | ✅ Yes |
| Manual Commands | 3 min | ⭐ Easy | One-time deploy | ❌ No |

---

## 🎯 My Recommendation

**Start with Cloud Shell (Option 1 or 4)** to get it working immediately, then set up **GitHub Actions (Option 2)** for automated deployments going forward.

---

## ✅ Current Status

- **URL**: https://lp-dev-web-kopp3c4slv3eg.delightfulpebble-1cfc730a.eastus.azurecontainerapps.io
- **Status**: ✅ Working (test container on port 3000)
- **Database**: ✅ Ready with demo data
- **ACR**: ✅ Configured with credentials
- **Issue**: Windows Azure CLI Unicode bug blocking build visibility

All infrastructure is ready - we just need to build from Linux environment!

---

## 📝 Files Created

- `.github/workflows/deploy.yml` - GitHub Actions workflow
- `azure-pipelines.yml` - Azure DevOps pipeline
- `deploy-cloudshell.sh` - Cloud Shell deployment script

Choose your preferred option and you'll have the full app deployed in minutes! 🚀
