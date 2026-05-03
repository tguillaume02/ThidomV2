import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { User } from '@core/models/models';

export interface UserDialogData {
  user?: User;
}

export interface UserDialogResult {
  username: string;
  email: string;
  full_name: string;
  password: string;
  is_active: boolean;
  is_admin: boolean;
}

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
  ],
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.scss',
})
export class UserDialogComponent {
  isEdit: boolean;
  username = '';
  email = '';
  fullName = '';
  password = '';
  isActive = true;
  isAdmin = false;
  hidePassword = true;

  constructor(
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserDialogData,
  ) {
    this.isEdit = !!data?.user;
    if (data?.user) {
      this.username = data.user.username;
      this.email = data.user.email;
      this.fullName = data.user.full_name || '';
      this.isActive = data.user.is_active;
      this.isAdmin = data.user.is_admin;
    }
  }

  get isValid(): boolean {
    if (this.isEdit) {
      return !!this.email;
    }
    return !!this.username && !!this.email && !!this.password;
  }

  save(): void {
    if (!this.isValid) return;
    const result: UserDialogResult = {
      username: this.username,
      email: this.email,
      full_name: this.fullName,
      password: this.password,
      is_active: this.isActive,
      is_admin: this.isAdmin,
    };
    this.dialogRef.close(result);
  }
}
