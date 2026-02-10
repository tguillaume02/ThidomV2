import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Room } from '@core/models/models';

const ROOM_ICONS = [
  'meeting_room', 'living', 'bed', 'kitchen', 'bathroom', 'garage',
  'deck', 'balcony', 'stairs', 'roofing', 'warehouse', 'home',
  'cottage', 'other_houses', 'night_shelter', 'storefront',
];

const ROOM_COLORS = [
  '#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336',
  '#00BCD4', '#FF5722', '#607D8B', '#E91E63', '#009688',
];

@Component({
  selector: 'app-room-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './room-dialog.component.html',
  styleUrl: './room-dialog.component.scss',
})
export class RoomDialogComponent {
  name: string;
  icon: string;
  color: string;
  parentId: number | null;

  icons = ROOM_ICONS;
  colors = ROOM_COLORS;
  availableParents: Room[];
  isEdit: boolean;

  constructor(
    public dialogRef: MatDialogRef<RoomDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { room: Room | null; rooms: Room[] }
  ) {
    this.isEdit = !!data.room;
    this.name = data.room?.name || '';
    this.icon = data.room?.icon || 'meeting_room';
    this.color = data.room?.color || '#4CAF50';
    this.parentId = data.room?.parent_id || null;
    this.availableParents = data.rooms || [];
  }

  save(): void {
    if (!this.name.trim()) return;
    this.dialogRef.close({
      name: this.name.trim(),
      icon: this.icon,
      color: this.color,
      parent_id: this.parentId,
    });
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
