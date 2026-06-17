import type { RoleName, Visibility } from '@prisma/client';

// --- Role catalog ------------------------------------------------------------
// These role names are the single source of truth. When migrating to Entra ID,
// each maps 1:1 to an Azure AD group (store the group object id on Role.azureAdGroupId).

export const ROLE_LABELS: Record<RoleName, string> = {
  CLIENT: 'Client',
  ADMIN: 'Administrator',
  PROJECT_ADMIN: 'Project Admin',
  PROJECT_OWNER: 'Project Owner',
  PROJECT_INCHARGE: 'Project In-charge',
  ENGINEER: 'Engineer',
  ARCHITECT: 'Architect',
  WORKER: 'Worker',
};

// Roles considered "internal staff" (everyone except the client).
export const INTERNAL_ROLES: RoleName[] = [
  'ADMIN',
  'PROJECT_ADMIN',
  'PROJECT_OWNER',
  'PROJECT_INCHARGE',
  'ENGINEER',
  'ARCHITECT',
  'WORKER',
];

// Roles with administrative reach over a project.
export const ADMIN_ROLES: RoleName[] = ['ADMIN', 'PROJECT_ADMIN'];

// --- Visibility rules --------------------------------------------------------
// Which document visibility levels a set of roles is allowed to see.
//   CLIENT_VISIBLE -> everyone on the project
//   INTERNAL       -> staff only
//   ADMIN_ONLY     -> admins / project admins only
export function visibleLevelsFor(roles: RoleName[]): Visibility[] {
  const isAdmin = roles.some((r) => ADMIN_ROLES.includes(r));
  const isInternal = roles.some((r) => INTERNAL_ROLES.includes(r));

  if (isAdmin) return ['CLIENT_VISIBLE', 'INTERNAL', 'ADMIN_ONLY'];
  if (isInternal) return ['CLIENT_VISIBLE', 'INTERNAL'];
  return ['CLIENT_VISIBLE']; // client and anyone else
}

// Which visibility levels a user may ASSIGN when uploading. Clients can only
// publish client-visible items; staff can mark internal; admins can mark admin-only.
export function assignableLevelsFor(roles: RoleName[]): Visibility[] {
  const isAdmin = roles.some((r) => ADMIN_ROLES.includes(r));
  const isInternal = roles.some((r) => INTERNAL_ROLES.includes(r));

  if (isAdmin) return ['CLIENT_VISIBLE', 'INTERNAL', 'ADMIN_ONLY'];
  if (isInternal) return ['CLIENT_VISIBLE', 'INTERNAL'];
  return ['CLIENT_VISIBLE'];
}

// --- Coarse capability checks ------------------------------------------------
export function hasAnyRole(userRoles: RoleName[], allowed: RoleName[]): boolean {
  return userRoles.some((r) => allowed.includes(r));
}

export function isStaff(userRoles: RoleName[]): boolean {
  return hasAnyRole(userRoles, INTERNAL_ROLES);
}

export function isAdmin(userRoles: RoleName[]): boolean {
  return hasAnyRole(userRoles, ADMIN_ROLES);
}

// Can this set of roles manage payments? (admins + owners; others read-only)
export function canManagePayments(userRoles: RoleName[]): boolean {
  return hasAnyRole(userRoles, ['ADMIN', 'PROJECT_ADMIN', 'PROJECT_OWNER']);
}
