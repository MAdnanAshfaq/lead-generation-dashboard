export const logout = () => {
    // Clear all auth-related data
    localStorage.clear();
    sessionStorage.clear();
    
    // Remove any cached data
    if (window.caches) {
        caches.keys().then(names => {
            names.forEach(name => {
                caches.delete(name);
            });
        });
    }
    
    // Force reload to clear any in-memory state
    window.location.href = '/login';
};

export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
}; 