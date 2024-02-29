import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-live-app',
  standalone: true,
  imports: [CommonModule],
  templateUrl: `./live-app.component.html`,
  styleUrl: './live-app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiveAppComponent {
  public isLoading: boolean = true;

  public iframeLoaded(): void {
    console.log('iframe loaded');
    this.isLoading = false;
  }
}
