import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-first',
  standalone: true,
  imports: [CommonModule],
  template: `<h1 i18n>First page</h1>
    <p i18n>some first page information</p>`,
  styleUrl: './first.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FirstComponent {}
