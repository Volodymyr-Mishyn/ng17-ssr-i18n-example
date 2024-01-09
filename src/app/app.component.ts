import { Component, Inject, LOCALE_ID, isDevMode } from '@angular/core';
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
  public activeLocale: 'en-US' | 'uk' = 'en-US';
  constructor(
    private _registerIconsService: RegisterIconsService,
    @Inject(LOCALE_ID) private _locale: string
  ) {
    this._registerIconsService.registerIcons(['trident']);
    this.activeLocale = this._locale as 'en-US' | 'uk';
  }
  public changeLanguage(language: string): void {
    const pathArray = window.location.pathname.split('/');
    const currentLanguage = pathArray[1];
    if (currentLanguage !== language) {
      pathArray[1] = language;
      const newPath = pathArray.join('/');
      window.location.href = newPath;
    }
  }

  public isLanguageChangeAvailable(): boolean {
    return !isDevMode();
  }
}
