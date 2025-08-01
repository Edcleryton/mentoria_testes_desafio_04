window.AuthUtils = {
	getToken() {
		return localStorage.getItem('authToken');
	},

	parseJwt(token) {
		try {
			return JSON.parse(atob(token.split('.')[1]));
		} catch (e) {
			return null;
		}
	},

	getUserInfo() {
		const token = this.getToken();
		if (!token) return null;
		return this.parseJwt(token);
	},

	requireRole(requiredRole, redirectTo = '/dashboard.html') {
		const user = this.getUserInfo();
		if (!user || user.role.toLowerCase() !== requiredRole.toLowerCase()) {
			window.location.replace(redirectTo);
			return false;
		}
		return true;
	},

	isLoggedIn() {
		return !!this.getToken();
	},

	hasRole(expectedRole) {
		const user = this.getUserInfo();
		return user && user.role.toLowerCase() === expectedRole.toLowerCase();
	},
};
