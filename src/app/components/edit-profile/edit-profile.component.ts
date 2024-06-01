import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { ConfirmDeleteDialogComponent } from '../message-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  editProfileForm!: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.editProfileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      currentPassword: [''],
      newPassword: ['', [Validators.minLength(6)]]
    });

    const token = localStorage.getItem('token');
    if (token) {
      this.authService.getCurrentUser(token).subscribe(
        (user) => {
          this.editProfileForm.patchValue({
            name: user.name
          });
        },
        (error) => {
          console.error('Error fetching current user:', error);
        }
      );
    } else {
      console.error('No token found in local storage.');
    }
  }

  onSubmit(): void {
    if (this.editProfileForm.valid) {
      const formValue = this.editProfileForm.value;
      const updateData: any = {
        name: formValue.name
      };

      if (formValue.currentPassword && formValue.newPassword) {
        updateData.currentPassword = formValue.currentPassword;
        updateData.newPassword = formValue.newPassword;
      }

      this.authService.updateProfile(updateData).subscribe(
        response => {
          this.successMessage = 'Profile updated successfully!';
          this.openMessageDialog(this.successMessage);
          localStorage.setItem("userName",updateData.name);
          this.router.navigate(['/home']);
        },
        error => {
          this.errorMessage = 'Update failed. Please try again.';
          this.openMessageDialog(this.errorMessage);
        }
      );
    } else {
      Object.values(this.editProfileForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }

  onDeleteAccount(): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.deleteAccount().subscribe(
          response => {
            this.successMessage = 'Account deleted successfully!';
            this.openMessageDialog(this.successMessage);
            localStorage.removeItem("userName");
            localStorage.removeItem("token");
            this.router.navigate(['/home']);
          },
          error => {
            this.errorMessage = 'Account deletion failed. Please try again.';
            this.openMessageDialog(this.errorMessage);
          }
        );
      }
    });
  }

  openMessageDialog(message: string): void {
    this.dialog.open(MessageDialogComponent, {
      data: { message: message },
    });
  }

  get name() {
    return this.editProfileForm.get('name');
  }

  get currentPassword() {
    return this.editProfileForm.get('currentPassword');
  }

  get newPassword() {
    return this.editProfileForm.get('newPassword');
  }
}
