import http from './http';

class LoginService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async login() {
    return http.get('/auth/github');
  }
}

const loginService = new LoginService();
export default loginService;
