import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-second',
  standalone: true,
  imports: [CommonModule],
  template: ` <h1 i18n>Second page</h1>
    <p i18n>some second page information</p>`,
  styleUrl: './second.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecondComponent {}
