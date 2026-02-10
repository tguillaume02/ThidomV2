import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RoomService } from '@core/services/room.service';
import { DeviceService } from '@core/services/device.service';
import { Room, Device } from '@core/models/models';
import { RoomDialogComponent } from './room-dialog/room-dialog.component';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatMenuModule,
    MatTooltipModule,
  ],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.scss',
})
export class RoomsComponent implements OnInit {
  rooms: Room[] = [];
  allDevices: Device[] = [];
  loading = true;

  constructor(
    private roomService: RoomService,
    private deviceService: DeviceService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.loading = true;
    this.roomService.getRooms().subscribe({
      next: (rooms) => {
        this.rooms = rooms;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Erreur de chargement des pièces', 'Fermer', { duration: 3000 });
      }
    });
    this.deviceService.getDevices().subscribe({
      next: (devices) => {
        this.allDevices = devices;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getDeviceCount(roomId: number): number {
    return this.allDevices.filter(d => d.room_id === roomId).length;
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(RoomDialogComponent, {
      width: '480px',
      data: { room: null, rooms: this.rooms },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.roomService.createRoom(result).subscribe({
          next: () => {
            this.loadRooms();
            this.snackBar.open('Pièce créée avec succès', 'OK', { duration: 3000 });
          },
          error: () => this.snackBar.open('Erreur lors de la création', 'Fermer', { duration: 3000 })
        });
      }
    });
  }

  openEditDialog(room: Room): void {
    const dialogRef = this.dialog.open(RoomDialogComponent, {
      width: '480px',
      data: { room, rooms: this.rooms.filter(r => r.id !== room.id) },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.roomService.updateRoom(room.id, result).subscribe({
          next: () => {
            this.loadRooms();
            this.snackBar.open('Pièce modifiée', 'OK', { duration: 3000 });
          },
          error: () => this.snackBar.open('Erreur lors de la modification', 'Fermer', { duration: 3000 })
        });
      }
    });
  }

  deleteRoom(room: Room): void {
    if (confirm(`Supprimer la pièce "${room.name}" et tous ses appareils ?`)) {
      this.roomService.deleteRoom(room.id).subscribe({
        next: () => {
          this.loadRooms();
          this.snackBar.open('Pièce supprimée', 'OK', { duration: 3000 });
        },
        error: () => this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 })
      });
    }
  }

  getParentName(parentId: number | null): string {
    if (!parentId) return '';
    return this.rooms.find(r => r.id === parentId)?.name || '';
  }

  getChildCount(roomId: number): number {
    return this.rooms.filter(r => r.parent_id === roomId).length;
  }
}
