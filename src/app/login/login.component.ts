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

  emailError: string = '';
  passwordError: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

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

      // Save session only
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.router.navigate(['/board']);
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}