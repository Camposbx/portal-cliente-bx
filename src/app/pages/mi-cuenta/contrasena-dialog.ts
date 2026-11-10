import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

const passwordsMatch: ValidatorFn = (control) => {
  const newPassword = control.parent?.get('newPassword')?.value;
  return control.value && newPassword && control.value !== newPassword ? { mismatch: true } : null;
};

@Component({
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  selector: 'app-contrasena-dialog',
  styleUrls: ['./contacto-dialog.scss', './contrasena-dialog.scss'],
  templateUrl: './contrasena-dialog.html',
})
export class ContrasenaDialog {
  private readonly formBuilder = inject(FormBuilder).nonNullable;
  private readonly dialogRef = inject(MatDialogRef<ContrasenaDialog>);

  readonly passwordForm = this.formBuilder.group({
    currentPassword: ['', Validators.required],
    newPassword: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*\p{Lu})(?=.*[0-9])(?=.*[^\p{L}\p{N}\s]).*$/u),
      ],
    ],
    confirmPassword: ['', [Validators.required, passwordsMatch]],
  });

  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;

  constructor() {
    this.passwordForm.controls.newPassword.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.passwordForm.controls.confirmPassword.updateValueAndValidity());
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  guardar(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.dialogRef.close();
  }
}
