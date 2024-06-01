// login.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { jwtDecode } from 'jwt-decode';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        (response) => {
          console.log('Login successful', response);
          this.saveUserNameToLocalStorage(response);
          this.router.navigate(['/home']);
        },
        (error) => {
          console.error('Login error', error);
          this.errorMessage = 'Invalid email or password. Please try again.';
          this.openMessageDialog(this.errorMessage);
        }
      );
    }
    else {
      Object.values(this.loginForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }

  openMessageDialog(message: string): void {
    this.dialog.open(MessageDialogComponent, {
      data: { message: message },
    });
  }
  saveUserNameToLocalStorage(response: any): void {
    const token = response.token; 
    const decodedToken: any = jwtDecode(token); 
    localStorage.setItem('userName', decodedToken.userName); 
    localStorage.setItem('token',token);
  }
  get email() {
    return this.loginForm.get('email');
  }
  get password()
  {
    return this.loginForm.get('password');
  }

}
