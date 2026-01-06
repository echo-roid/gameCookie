import http from "../http-common";
import { Toast } from '../components/Toast.jsx';

class AuthService {

  //...login
  login(email, role, type) {
    return http
      .post("/auth/login", {
        email,
        role,
        type
      })
      .then(response => {
        
        // console.log('check email', response)

        return response;
      });
  }

  //...verify OTP
  loginOtp(email, otp) {
    return http
      .post("/auth/otpLogin", {
        email,
        otp
      })
      .then(response => {
        if (response.data.access_token) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        // console.log('check otp', response)

        return response;
      });
  }



  //...get Refresh Token
  getRefreshToken(email, otp) {
    return http
      .post("/auth/refreshToken")
      .then(response => {
        if (response.data.access_token) {
          localStorage.setItem("user", JSON.stringify(response.data));

          return response.data.access_token;
        }
        // console.log('check otp', response)

        return false;
      });
  }

  //...logout
  logout() {
    localStorage.removeItem("user");
    Toast('success', 'User logout successfully');
  }

  //...current user
  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

}

export default new AuthService();