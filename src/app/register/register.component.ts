import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  error: string = '';

  constructor(private router: Router) {}

  register() {
  if (!this.email || !this.password || !this.confirmPassword) {
    alert('Fill all fields');
    return;
  }

  if (this.password !== this.confirmPassword) {
    alert('Passwords do not match');
    return;
  }

  const users = JSON.parse(localStorage.getItem('users') || '[]');

  const userExists = users.find((u: any) => u.email === this.email);

  if (userExists) {
    alert('User already exists');
    return;
  }

  users.push({
    email: this.email,
    password: this.password
  });

  localStorage.setItem('users', JSON.stringify(users));

  alert('Registration successful');

  this.router.navigate(['/login']);
}
goToLogin() {
  this.router.navigate(['/login']);
}
}