import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { PersonasInvolucradasService } from '../personas-involucradas.service';

type PersonType = 'fisica' | 'moral';
type CaptureMethod = 'manual' | 'automatic';

@Component({
  imports: [
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  selector: 'app-registro-persona',
  styleUrl: './registro-persona.scss',
  templateUrl: './registro-persona.html',
})
export class RegistroPersona {
  private readonly formBuilder = inject(FormBuilder).nonNullable;
  private readonly router = inject(Router);
  private readonly personasInvolucradas = inject(PersonasInvolucradasService);

  readonly personForm = this.formBuilder.group({
    nombre1: [''],
    nombre2: [''],
    nombre3: [''],
    primerApellido: [''],
    segundoApellido: [''],
    razonSocial: [''],
    tipoSociedad: [''],
    nacionalidad: ['', Validators.required],
    curp: [''],
    rfc: [''],
    estadoCivil: [''],
    regimenMatrimonial: [''],
    correo: ['', Validators.email],
    participacion: [''],
  });

  personType: PersonType | null = null;
  captureMethod: CaptureMethod | null = null;
  readonly roles = [
    { id: 'aval', label: 'Aval (AV)' },
    { id: 'apoderado', label: 'Apoderado Legal (AL)' },
    { id: 'accionista', label: 'Accionista (AC)' },
    { id: 'garante', label: 'Garante (GA)' },
    { id: 'depositario', label: 'Depositario legal (DL)' },
  ];
  selectedRoles: string[] = [];

  selectPersonType(personType: PersonType): void {
    this.personType = personType;
    this.captureMethod = null;
    this.selectedRoles = [];
    this.personForm.controls.nombre1.setValidators(
      personType === 'fisica' ? Validators.required : [],
    );
    this.personForm.controls.primerApellido.setValidators(
      personType === 'fisica' ? Validators.required : [],
    );
    this.personForm.controls.razonSocial.setValidators(
      personType === 'moral' ? Validators.required : [],
    );
    this.personForm.controls.tipoSociedad.setValidators(
      personType === 'moral' ? Validators.required : [],
    );
    this.personForm.controls.nombre1.updateValueAndValidity();
    this.personForm.controls.primerApellido.updateValueAndValidity();
    this.personForm.controls.razonSocial.updateValueAndValidity();
    this.personForm.controls.tipoSociedad.updateValueAndValidity();
    this.personForm.reset();
  }

  selectCaptureMethod(method: CaptureMethod): void {
    this.captureMethod = method;
    this.selectedRoles = [];
  }

  toggleRole(roleId: string, selected: boolean): void {
    this.selectedRoles = selected
      ? [...this.selectedRoles, roleId]
      : this.selectedRoles.filter((role) => role !== roleId);
  }

  volver(): void {
    if (this.captureMethod) {
      this.captureMethod = null;
      this.selectedRoles = [];
      return;
    }

    this.personType = null;
    this.personForm.reset();
  }

  cancelar(): void {
    this.personType = null;
    this.captureMethod = null;
    this.selectedRoles = [];
    this.personForm.reset();
  }

  finalizarRegistro(): void {
    if (this.selectedRoles.length === 0 || this.personForm.invalid) {
      this.personForm.markAllAsTouched();
      return;
    }

    const datos = this.personForm.getRawValue();
    const nombre =
      this.personType === 'fisica'
        ? [datos.nombre1, datos.nombre2, datos.nombre3, datos.primerApellido, datos.segundoApellido]
            .filter((parte) => parte.trim())
            .join(' ')
        : datos.razonSocial;

    this.personasInvolucradas.agregar(nombre, datos.correo, this.selectedRoles);
    void this.router.navigateByUrl('/analisis/documentos');
  }
}
