import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { InitialFocusDirective } from '../../../../shared/directives/initial-focus';
import { CategoryManagement } from './category-management/category-management';
import { ChangePassword } from './change-password/change-password';

@Component({
  selector: 'app-settings',
  imports: [
    MatIconModule,
    InitialFocusDirective,
    MatButtonModule,
    ChangePassword,
    CategoryManagement,
    MatListModule,
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Settings {
  selectedItem = signal('change-password');
}
