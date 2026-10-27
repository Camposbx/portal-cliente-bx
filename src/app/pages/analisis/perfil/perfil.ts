import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  imports: [
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  selector: 'app-perfil',
  styleUrl: './perfil.scss',
  templateUrl: './perfil.html',
})
export class Perfil {
  private readonly formBuilder = inject(FormBuilder).nonNullable;

  readonly profileForm = this.formBuilder.group({
    razonSocial: 'El Patito SA de CV',
    tipoSociedad: 'Sociedad Anónima de Capital Variable',
    nacionalidad: 'Mexicana',
    rfc: 'PAEL870344PQ3',
    correo: 'info@altamiracapital.com',
    tipoDomicilio: this.formBuilder.control('Fiscal', Validators.required),
    codigoPostal: '04100',
    entidad: 'Ciudad de México (CDMX)',
    municipio: 'Coyoacán',
    colonia: 'Copilco El Alto',
    calle: 'Allende',
    numeroExterior: '24',
    numeroInterior: '',
    direccionPrincipal: true,
  });

  editing = false;
  private savedValues = this.profileForm.getRawValue();

  constructor() {
    this.profileForm.disable();
  }

  editar(): void {
    this.editing = true;
    this.profileForm.enable();
  }

  cancelar(): void {
    this.profileForm.reset(this.savedValues);
    this.profileForm.disable();
    this.editing = false;
  }

  guardar(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.savedValues = this.profileForm.getRawValue();
    this.profileForm.disable();
    this.editing = false;
  }
}
