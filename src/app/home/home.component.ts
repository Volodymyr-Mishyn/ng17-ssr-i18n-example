import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `<h1 i18n>Home</h1>
    <p i18n>Angular 17 application with ssr and i18n</p>
    <div [innerHTML]="readmeContent" class="info mat-elevation-z4"></div>`,
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  public readmeContent: SafeHtml | null = null;
  constructor(
    private _http: HttpClient,
    private _sanitizer: DomSanitizer,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this._http
      .get('assets/README.md', { responseType: 'text' })
      .subscribe((data) => {
        const markedData = marked(data).toString();
        this.readmeContent =
          this._sanitizer.bypassSecurityTrustHtml(markedData);
        this._cdr.detectChanges();
      });
  }
}
