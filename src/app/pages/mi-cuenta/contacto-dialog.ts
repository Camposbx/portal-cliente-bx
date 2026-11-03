import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export type ContactType = 'email' | 'phone';

export interface ContactData {
  type: ContactType;
  label: string;
  value: string;
}

export interface ContactDialogData {
  type: ContactType;
  mode: 'add' | 'edit';
  contact?: ContactData;
}

@Component({
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  selector: 'app-contacto-dialog',
  styleUrl: './contacto-dialog.scss',
  templateUrl: './contacto-dialog.html',
})
export class ContactoDialog {
  private readonly formBuilder = inject(FormBuilder).nonNullable;
  readonly data = inject<ContactDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ContactoDialog, ContactData>);

  readonly contactForm = this.formBuilder.group({
    label: [
      this.data.contact?.label ?? (this.data.type === 'phone' ? '' : 'Correo alterno'),
      this.data.type === 'phone' ? Validators.required : [],
    ],
    value: [
      this.data.contact?.value ?? '',
      this.data.type === 'email'
        ? [Validators.required, Validators.email]
        : [Validators.required, Validators.pattern(/^[+()\d\s.-]{7,20}(?:\s*ext\.?\s*\d{1,6})?$/i)],
    ],
  });

  get title(): string {
    const action = this.data.mode === 'add' ? 'Agregar' : 'Editar';
    const isAlternateEmail =
      this.data.type === 'email' &&
      this.data.mode === 'edit' &&
      this.data.contact?.label !== 'Correo principal';
    return `${action} ${this.data.type === 'phone' ? 'teléfono' : 'correo'}${isAlternateEmail ? ' alterno' : ''}`;
  }

  get description(): string {
    return this.data.type === 'phone'
      ? 'Se suma a los que ya tienes. Tu ejecutivo lo usa para localizarte.'
      : 'Es el correo donde también podemos localizarte.';
  }

  get valueLabel(): string {
    return this.data.type === 'phone' ? 'Número' : 'Correo electrónico';
  }

  get submitLabel(): string {
    if (this.data.mode === 'edit') {
      return 'Guardar cambios';
    }
    return `Agregar ${this.data.type === 'phone' ? 'teléfono' : 'correo'}`;
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  guardar(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    const { label, value } = this.contactForm.getRawValue();
    this.dialogRef.close({
      type: this.data.type,
      label:
        this.data.type === 'phone' ? label.trim() : (this.data.contact?.label ?? 'Correo alterno'),
      value: value.trim(),
    });
  }
}
