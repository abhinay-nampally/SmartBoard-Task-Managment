import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  error: string = '';
  showPassword: boolean = false;
  successMessage: string = '';
  passwordStrength: string = '';
  isLoading: boolean = false;
  name:string = '';


  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  register() {

  this.error = '';
  this.successMessage = '';
  this.isLoading = true;

  if (!this.name.trim() || !this.email.trim() || !this.password.trim() || !this.confirmPassword.trim()) {
    this.error = "All fields are required";
    this.isLoading=false;
    return;
  }

  if (!this.email.includes('@')) {
    this.error = "Enter a valid email";
    return;
  }

  const strongPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!strongPassword.test(this.password)) {
    this.error =
      "Password must contain at least 8 characters, including uppercase, lowercase, number and special character";
    return;
  }

  if (this.password !== this.confirmPassword) {
    this.error = "Passwords do not match";
    return;
  }

  // 🔎 Check if user already exists
  this.authService.checkUser(this.email).subscribe(users => {

    if (users.length > 0) {
      this.error = "Email already registered";
      return;
    }

    // ✅ If email does not exist → register user
    this.authService.register({
  name: this.name,
  email: this.email,
  password: this.password,
  isLoggedIn: false
}).subscribe({
      next: () => {
        this.successMessage = "Registration successful ✅";
        this.isLoading = false;
        this.email = '';
        this.name='';
this.password = '';
this.confirmPassword = '';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: () => {
        this.error = "Registration failed";
        this.isLoading = false;
      }
    });

  });

}
goToLogin() {
  this.router.navigate(['/login']);
}
checkPasswordStrength() {
  const password = this.password;

  if (password.length < 6) {
    this.passwordStrength = 'Weak';
  } else if (
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)
  ) {
    this.passwordStrength = 'Medium';
  }

  if (
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)
  ) {
    this.passwordStrength = 'Strong';
  }
}
}