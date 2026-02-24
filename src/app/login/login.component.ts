import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  error:string='';
  

  constructor(private router: Router) {}

  login() {

    if (!this.email || !this.password) {
      alert('Please enter email and password');
      return;
    }

    localStorage.setItem('loggedUser', this.email);

    this.router.navigate(['/board']);
  }
}