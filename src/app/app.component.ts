import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { RegisterIconsService } from './services/register-icons.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public title = $localize`SSR&i18n Angular application`;
  public icon = 'assets/img/flag_with_trident.svg';
  constructor(private _registerIconsService: RegisterIconsService) {
    this._registerIconsService.registerIcons(['trident']);
  }
}
