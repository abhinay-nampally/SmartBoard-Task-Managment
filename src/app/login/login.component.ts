import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  showForgotModal: boolean = false;
showOTPInput: boolean = false;
showResetPassword: boolean = false;

enteredOTP: string = '';
generatedOTP: string = '';

resetEmail: string = '';
otpSent: boolean = false;

newPassword: string = '';

  emailError: string = '';
  passwordError: string = '';

  showPassword: boolean = false;

  // Forgot password
  
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  togglePassword(){
    this.showPassword = !this.showPassword;
  }

  login() {

    this.emailError = '';
    this.passwordError = '';

    if (!this.email) {
      this.emailError = "Email is required";
      return;
    }

    if (!this.password) {
      this.passwordError = "Password is required";
      return;
    }

    this.authService.login(this.email).subscribe(users => {

      if (users.length === 0) {
        this.emailError = "Email not registered";
        return;
      }

      const user = users[0];

      if (user.password !== this.password) {
        this.passwordError = "Wrong password";
        return;
      }

      localStorage.setItem('currentUser', JSON.stringify(user));
      this.router.navigate(['/board']);

    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  /* ================= FORGOT PASSWORD ================= */

  openForgotModal(){
    this.showForgotModal = true;
  }

  
  sendOTP() {
    console.log("Send OTP clicked");

  fetch("http://localhost:5000/send-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: this.resetEmail
    })
  })
  .then(res => res.json())
  .then(data => {
    alert("OTP sent to your email");
    this.otpSent = true;
  });

}
verifyOTP() {

  fetch("http://localhost:5000/verify-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: this.resetEmail,
      otp: this.enteredOTP
    })
  })
  .then(res => res.json())
  .then(data => {

    if(data.success){
      this.showResetPassword = true;
    }
    else{
      alert("Invalid OTP");
    }

  });

}
resetPassword() {

  fetch("http://localhost:3000/users?email=" + this.resetEmail)
  .then(res => res.json())
  .then(users => {

    if(users.length === 0){
      alert("User not found");
      return;
    }

    const user = users[0];

    fetch("http://localhost:3000/users/" + user.id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        password: this.newPassword
      })
    })
    .then(() => {
      alert("Password reset successful");
      this.showForgotModal = false;
    });

  });

}

}
