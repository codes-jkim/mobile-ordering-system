import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { InitialFocusDirective } from '../../../../shared/directives/initial-focus';
import { CategoryManagement } from './category-management/category-management';
import { ChangePassword } from './change-password/change-password';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    InitialFocusDirective,
    MatButtonModule,
    ChangePassword,
    CategoryManagement,
    MatListModule,
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {
  selectedItem = signal('change-password');
}
