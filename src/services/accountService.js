export default {
  getAuthToken() {
    let result = null;
    const authToken = localStorage.getItem('serviceToken');
    if (authToken) {
      result = authToken;
    }
    return result;
  },
  removeAuthToken() {
    localStorage.removeItem('serviceToken');
  },
  getAccessToken() {
    let result = null;
    const authToken = this.getAuthToken();
    if (authToken) {
      result = authToken;
    }
    return result;
  }
};
