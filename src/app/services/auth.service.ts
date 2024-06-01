import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:4242';
  private userName = new BehaviorSubject<string>('Guest');
  private isLogged?: boolean;
  constructor(private http: HttpClient, private router: Router) {
    
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.userName.next(decodedToken.userName);
      
    } else {
      this.isLogged= false;
      this.userName.next('Guest');
    }
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
  // get isLoggedIn() {
  //   return this.isLogged;
  // }

  get currentUserName() {
    return this.userName.asObservable();
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }
  getCurrentUser(token:string): Observable<any> {
    console.log(token);
    return this.http.get(`${this.apiUrl}/getCurrent/user/`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    });
  }
  updateProfile(profileData: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put(`${this.apiUrl}/update/user`, profileData, {
      headers: new HttpHeaders().set('authorization', `Bearer ${token}`)
    });
  }

  deleteAccount(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(`${this.apiUrl}/delete/user`, {
      headers: new HttpHeaders().set('authorization', `Bearer ${token}`)
    });
  }

  logout() {
    this.isLogged=false;
    this.userName.next('Guest');
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('logged');
  }


}
