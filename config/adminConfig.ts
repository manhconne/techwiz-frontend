export const ADMIN_CONFIG = {
  bypassAdminRoleCheck: 'off' as 'off' | 'on',
};

export function isBypassAdminEnabled(): boolean {
  return ADMIN_CONFIG.bypassAdminRoleCheck === 'on';
}
