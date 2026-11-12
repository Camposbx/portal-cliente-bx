import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  private readonly uppercaseTextFields = [
    'razonSocial',
    'nombre1',
    'nombre2',
    'nombre3',
    'primerApellido',
    'segundoApellido',
    'curp',
    'rfc',
    'tin',
    'codigoPostal',
    'calle',
    'numeroExterior',
    'numeroInterior',
  ] as const;

  private readonly formBuilder = inject(FormBuilder).nonNullable;

  readonly profileForm = this.formBuilder.group({
    razonSocial: 'El Patito SA de CV',
    tipoSociedad: 'Sociedad Anónima de Capital Variable',
    nombre1: 'Juan',
    nombre2: '',
    nombre3: '',
    primerApellido: 'Pérez',
    segundoApellido: 'García',
    nacionalidad: 'Mexicana',
    curp: 'PEGJ870344HDFRRN08',
    rfc: 'PAEL870344PQ3',
    tin: '',
    estadoCivil: 'Casado',
    sociedadConyugal: 'SociedadConyugal',
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

  personaMoral = true;
  editing = false;
  private savedValues = this.profileForm.getRawValue();

  constructor() {
    this.profileForm.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      for (const field of this.uppercaseTextFields) {
        const control = this.profileForm.controls[field];
        const value = control.value;
        const uppercaseValue = value.toUpperCase();
        if (value !== uppercaseValue) {
          control.setValue(uppercaseValue, { emitEvent: false });
        }
      }
    });

    for (const field of this.uppercaseTextFields) {
      const control = this.profileForm.controls[field];
      control.setValue(control.value.toUpperCase(), { emitEvent: false });
    }

    this.profileForm.disable();
  }

  editar(): void {
    this.editing = true;
    this.profileForm.enable();
  }

  alternarTipoPersona(): void {
    this.personaMoral = !this.personaMoral;
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
