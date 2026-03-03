import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  register(user: any): Observable<any> {
    return this.http.post(this.baseUrl, user);
  }
  checkUser(email: string) {
  return this.http.get<any[]>(
    `http://localhost:3000/users?email=${email}`
  );
}

  login(email: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}?email=${email}`);
  }
  logout(userId: number) {
  return this.http.patch(
    `http://localhost:3000/users/${userId}`,
    { isLoggedIn: false }
  );
}
}
