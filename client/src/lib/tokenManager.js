export const tokenManager = {
  token: null,
  setToken(value) {
    this.token = value;
  },
  getToken() {
    return this.token;
  },
  clear() {
    this.token = null;
  },
};

