import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-receipt',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, MatDialogModule, MatButtonModule, MatListModule, MatIconModule],
  templateUrl: './receipt.html',
  styleUrls: ['./receipt.scss'],
})
export class Receipt {
  dialogRef = inject(MatDialogRef<Receipt>);
  data = inject(MAT_DIALOG_DATA);

  close(): void {
    this.dialogRef.close();
  }
}
