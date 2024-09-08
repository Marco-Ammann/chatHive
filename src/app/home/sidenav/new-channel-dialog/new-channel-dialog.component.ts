import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-channel-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './new-channel-dialog.component.html',
  styleUrls: ['./new-channel-dialog.component.scss'],
})
export class NewChannelDialogComponent {
  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });

  constructor(public dialogRef: MatDialogRef<NewChannelDialogComponent>) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onCreate(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
