import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  imports: [
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  selector: 'app-usuario-secundario-dialog',
  styleUrls: ['./contacto-dialog.scss', './usuario-secundario-dialog.scss'],
  templateUrl: './usuario-secundario-dialog.html',
})
export class UsuarioSecundarioDialog {
  private readonly formBuilder = inject(FormBuilder).nonNullable;
  private readonly dialogRef = inject(MatDialogRef<UsuarioSecundarioDialog>);

  readonly puestos = [
    'Director General',
    'Director CEO',
    'Director Finanzas',
    'Tesorero',
    'Contador',
    'Accionista',
    'Otro',
  ];

  readonly userForm = this.formBuilder.group({
    nombre: ['', [Validators.required, Validators.pattern(/\S/)]],
    apellidoPaterno: ['', [Validators.required, Validators.pattern(/\S/)]],
    apellidoMaterno: [''],
    puesto: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    aceptaTerminos: [false, Validators.requiredTrue],
  });

  cancelar(): void {
    this.dialogRef.close();
  }

  guardar(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    // The account page does not yet have a secondary-user invitation service.
    this.dialogRef.close();
  }
}
