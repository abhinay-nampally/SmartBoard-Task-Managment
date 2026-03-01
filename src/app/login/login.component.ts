import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  
 emailError: string = '';
passwordError: string = '';

  constructor(private router: Router) {}
login() {

  this.emailError = '';
  this.passwordError = '';

  // 🔹 Empty field validation
  if (!this.email && !this.password) {
    this.emailError = "Email is required";
    this.passwordError = "Password is required";
    return;
  }

  if (!this.email) {
    this.emailError = "Email is required";
    return;
  }

  if (!this.password) {
    this.passwordError = "Password is required";
    return;
  }

  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find((u: any) => u.email === this.email);

  // 🔹 Email not registered
  if (!user) {
    this.emailError = "Email not registered";
    return;
  }

  // 🔹 Wrong password
  if (user.password !== this.password) {
    this.passwordError = "Wrong password";
    return;
  }

  // 🔹 SUCCESS
  localStorage.setItem('currentUser', JSON.stringify(user));
  this.router.navigate(['/board']);
}
goToRegister() {
  console.log("Register clicked")
  this.router.navigate(['/register']);
}

}