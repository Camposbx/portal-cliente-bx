import { DOCUMENT } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ModalPortalUso } from './modal/modal-portal-uso';

@Component({
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
})
export class Login {
  readonly loginBackgroundImage = `url("${new URL('bg-login-bx+.jpg', inject(DOCUMENT).baseURI).href}")`;
  hidePassword = true;

  constructor(
    private readonly dialog: MatDialog,
    private readonly router: Router,
  ) {}

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
