import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-global-loader',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './global-loader.html',
  styleUrls: ['./global-loader.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalLoader {
  loadingService = inject(LoadingService);
}
