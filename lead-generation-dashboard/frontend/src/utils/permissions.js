const PERMISSIONS = {
    ADMIN: {
        users: ['create', 'read', 'update', 'delete'],
        profiles: ['create', 'read', 'update', 'delete'],
        targets: ['create', 'read', 'update', 'delete'],
        reports: ['create', 'read', 'export'],
        stats: ['read', 'export'],
    },
    MANAGER: {
        users: ['read'],
        profiles: ['read'],
        targets: ['create', 'read', 'update'],
        reports: ['create', 'read', 'export'],
        stats: ['read', 'export'],
        employees: ['read', 'update'],
    },
    EMPLOYEE: {
        targets: ['read', 'update'],
        stats: ['read'],
        profile: ['read', 'update'],
    },
};

export const hasPermission = (role, resource, action) => {
    if (!role || !resource || !action) return false;
    
    const rolePermissions = PERMISSIONS[role.toUpperCase()];
    if (!rolePermissions) return false;

    const resourcePermissions = rolePermissions[resource];
    if (!resourcePermissions) return false;

    return resourcePermissions.includes(action.toLowerCase());
};

export const getResourceActions = (role, resource) => {
    if (!role || !resource) return [];
    
    const rolePermissions = PERMISSIONS[role.toUpperCase()];
    if (!rolePermissions) return [];

    return rolePermissions[resource] || [];
};

export const ROLES = {
    ADMIN: 'ADMIN',
    MANAGER: 'MANAGER',
    EMPLOYEE: 'EMPLOYEE',
};

export default PERMISSIONS;
