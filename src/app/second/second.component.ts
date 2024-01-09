import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-second',
  standalone: true,
  imports: [CommonModule],
  template: ` <h1>Second page</h1>
    <p>some second page information</p>`,
  styleUrl: './second.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecondComponent {}
