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
  
  errorMessage: string = '';
showPopup: boolean = false;
  

  constructor(private router: Router) {}
login() {
  console.log("LOGIN FUNCTION CALLED");

  const users = JSON.parse(localStorage.getItem('users') || '[]');

  if (!this.email || !this.password) {
    this.errorMessage = "Please enter email and password";
    this.showPopup = true;
    return;
  }

  const user = users.find((u: any) => u.email === this.email);

  if (!user) {
    this.errorMessage = "Email not registered!";
    this.showPopup = true;
    return;
  }

  if (user && user.password !== this.password) {
    this.errorMessage = "Wrong password!";
    this.showPopup = true;
    return;
  }

  localStorage.setItem('currentUser', JSON.stringify(user));
console.log("User saved:", localStorage.getItem('currentUser'));

this.router.navigate(['/board']);

}
goToRegister() {
  console.log("Register clicked")
  this.router.navigate(['/register']);
}
closePopup() {
  this.showPopup = false;
}
}