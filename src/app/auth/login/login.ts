import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
})
export class Login {
  hidePassword = true;

  constructor(private readonly router: Router) {}

  ingresar(): void {
    this.router.navigate(['/inicio']);
  }
}
