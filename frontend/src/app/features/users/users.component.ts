import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserService, UserCreateRequest, UserUpdateRequest } from '@core/services/user.service';
import { AuthService } from '@core/services/auth.service';
import { User } from '@core/models/models';
import { UserDialogComponent, UserDialogResult } from './user-dialog/user-dialog.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatTooltipModule,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  loading = true;
  displayedColumns = ['username', 'email', 'full_name', 'status', 'role', 'actions'];
  currentUserId: number | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(u => {
      this.currentUserId = u?.id ?? null;
    });
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAll().subscribe({
      next: users => { this.users = users; this.loading = false; },
      error: () => {
        this.snackBar.open('Erreur lors du chargement des utilisateurs', 'Fermer', { duration: 4000 });
        this.loading = false;
      },
    });
  }

  openCreateDialog(): void {
    const ref = this.dialog.open(UserDialogComponent, {
      width: '480px',
      data: {},
    });
    ref.afterClosed().subscribe((result: UserDialogResult) => {
      if (!result) return;
      const req: UserCreateRequest = {
        username: result.username,
        email: result.email,
        password: result.password,
        full_name: result.full_name || undefined,
      };
      this.userService.create(req).subscribe({
        next: () => {
          this.snackBar.open('Utilisateur créé', 'OK', { duration: 3000 });
          this.loadUsers();
        },
        error: err => this.snackBar.open(err.error?.detail || 'Erreur', 'Fermer', { duration: 4000 }),
      });
    });
  }

  openEditDialog(user: User): void {
    const ref = this.dialog.open(UserDialogComponent, {
      width: '480px',
      data: { user },
    });
    ref.afterClosed().subscribe((result: UserDialogResult) => {
      if (!result) return;
      const req: UserUpdateRequest = {
        email: result.email,
        full_name: result.full_name,
        is_active: result.is_active,
        is_admin: result.is_admin,
      };
      if (result.password) {
        req.password = result.password;
      }
      this.userService.update(user.id, req).subscribe({
        next: () => {
          this.snackBar.open('Utilisateur modifié', 'OK', { duration: 3000 });
          this.loadUsers();
        },
        error: err => this.snackBar.open(err.error?.detail || 'Erreur', 'Fermer', { duration: 4000 }),
      });
    });
  }

  deleteUser(user: User): void {
    if (!confirm(`Supprimer l'utilisateur "${user.username}" ?`)) return;
    this.userService.delete(user.id).subscribe({
      next: () => {
        this.snackBar.open('Utilisateur supprimé', 'OK', { duration: 3000 });
        this.loadUsers();
      },
      error: err => this.snackBar.open(err.error?.detail || 'Erreur', 'Fermer', { duration: 4000 }),
    });
  }
}
