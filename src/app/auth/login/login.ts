import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ANALISIS_TUTORIAL_STORAGE_KEY } from '../../shared/analisis-tutorial';
import { ModalPortalUso } from './modal/modal-portal-uso';

@Component({
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
})
export class Login implements OnInit {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  readonly loginBackgroundImage = `url("${new URL('bg-login-bx+.jpg', this.document.baseURI).href}")`;
  hidePassword = true;

  constructor(
    private readonly dialog: MatDialog,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.document.defaultView?.localStorage.removeItem(ANALISIS_TUTORIAL_STORAGE_KEY);
  }

  ingresar(): void {
    this.dialog
      .open(ModalPortalUso, {
        ariaLabelledBy: 'modal-portal-uso-title',
        backdropClass: 'modal-portal-uso-backdrop',
        maxWidth: 'calc(100vw - 32px)',
        panelClass: 'modal-portal-uso',
        width: '520px',
      })
      .afterClosed()
      .subscribe((accepted) => {
        if (accepted) {
          this.router.navigate(['/inicio']);
        }
      });
  }
}
