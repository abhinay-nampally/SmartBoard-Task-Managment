import { Component ,OnInit} from '@angular/core';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

declare const google:any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
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
  // OTP BOXES
otpDigits: string[] = ["", "", "", "", "", ""];


// RESEND TIMER
timer: number = 30;
canResend: boolean = false;

// PASSWORD STRENGTH
passwordStrength: string = '';
passwordStrengthWidth: number = 0;

  // Forgot password
  
  constructor(
  private router: Router,
  private authService: AuthService
  
) {}






  ngOnInit(){

  setTimeout(() => {

    google.accounts.id.initialize({
      client_id: "64348922218-bkpuvpe04bmq2h0sd3htuhedt9sqahr1.apps.googleusercontent.com",
      callback: (response:any)=>{

        const payload = JSON.parse(atob(response.credential.split('.')[1]));

        const googleUser = {
          name: payload.name,
          email: payload.email,
          password: "google_login"
        };

        localStorage.setItem(
          'currentUser',
          JSON.stringify(googleUser)
        );

        this.router.navigate(['/board']);

      }
    });

    google.accounts.id.renderButton(
      document.getElementById("googleButton"),
      {
        theme: "outline",
        size: "large",
        width: 250
      }
    );

  }, 500);

}

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
 Swal.fire({
  icon: 'success',
  title: 'OTP Sent',
  text: 'Check your email for the verification code',
  confirmButtonText: 'Got it',
  confirmButtonColor: '#5b86e5',
  background: '#ffffff',
  width: '380px',
  padding: '2em',
  showClass: {
    popup: 'animate__animated animate__zoomIn'
  },
  hideClass: {
    popup: 'animate__animated animate__zoomOut'
  }
});
  this.otpSent = true;
  this.startTimer();
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
     Swal.fire({
  icon: 'error',
  title: 'Invalid OTP',
  text: 'The code you entered is incorrect',
  confirmButtonColor: '#ff4d4f',
  width: '360px'
});
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
      Swal.fire({
  icon: 'success',
  title: 'Password Reset',
  text: 'Your password has been updated successfully',
  confirmButtonText: 'Login Now',
  confirmButtonColor: '#36d1dc',
  width: '360px',
  padding: '2em',
  backdrop: `
    rgba(0,0,0,0.6)
  `,
  showClass: {
    popup: 'animate__animated animate__zoomIn'
  }
});
      this.showForgotModal = false;
    });

  });

}



startTimer() {

  this.timer = 30;
  this.canResend = false;

  const interval = setInterval(() => {

    this.timer--;

    if (this.timer <= 0) {
      this.canResend = true;
      clearInterval(interval);
    }

  }, 1000);

}
checkPasswordStrength() {

  const password = this.newPassword;

  let strength = 0;

  if(password.length >= 6) strength++;
  if(/[A-Z]/.test(password)) strength++;
  if(/[0-9]/.test(password)) strength++;
  if(/[!@#$%^&*]/.test(password)) strength++;

  if(strength <= 1){
    this.passwordStrength = "Weak";
    this.passwordStrengthWidth = 25;
  }
  else if(strength == 2){
    this.passwordStrength = "Medium";
    this.passwordStrengthWidth = 60;
  }
  else{
    this.passwordStrength = "Strong";
    this.passwordStrengthWidth = 100;
  }

  
}
moveOtp(event: KeyboardEvent, index: number) {

  const input = event.target as HTMLInputElement;
  const boxes = document.querySelectorAll('.otp-box') as NodeListOf<HTMLInputElement>;

  // Allow only numbers
  if (!/^[0-9]$/.test(input.value) && event.key !== "Backspace") {
    this.otpDigits[index] = '';
    return;
  }

  // Move forward
  if (input.value && index < boxes.length - 1) {
    boxes[index + 1].focus();
  }

  // Move backward on backspace
  if (event.key === "Backspace" && index > 0 && !input.value) {
    boxes[index - 1].focus();
  }

  // Combine OTP
  this.enteredOTP = this.otpDigits.join('');
}
formatOtp() {
  // allow numbers only
  this.enteredOTP = this.enteredOTP.replace(/[^0-9]/g, '');

  // limit to 6 digits
  if (this.enteredOTP.length > 6) {
    this.enteredOTP = this.enteredOTP.slice(0, 6);
  }
}




}
