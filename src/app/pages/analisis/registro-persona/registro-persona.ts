import { Component, computed, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { distinctUntilChanged, map } from 'rxjs';
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
  private readonly route = inject(ActivatedRoute);
  private readonly personasInvolucradas = inject(PersonasInvolucradasService);
  private readonly queryParams = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  readonly edicionSolicitada = computed(() => this.queryParams().get('editar'));
  readonly modoEdicion = computed(() => this.edicionSolicitada() !== null);
  readonly personaEditada = computed(() => this.buscarPersona(this.edicionSolicitada()));
  readonly edicionInvalida = computed(() => this.modoEdicion() && !this.personaEditada());
  readonly vinculoSolicitado = computed(() => this.modoEdicion() ? null : this.queryParams().get('vinculadaCon'));
  readonly desdePersonas = computed(
    () => this.modoEdicion() || this.vinculoSolicitado() !== null || this.queryParams().get('volver') === 'personas',
  );
  readonly personaVinculada = computed(() => this.buscarPersona(this.vinculoSolicitado()));
  readonly vinculoInvalido = computed(
    () => this.vinculoSolicitado() !== null && !this.personaVinculada(),
  );

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

  constructor() {
    this.route.queryParamMap.pipe(
      map((params) => params.get('editar')),
      distinctUntilChanged(),
      takeUntilDestroyed(),
    ).subscribe((id) => {
      this.personType = null;
      this.captureMethod = null;
      this.selectedRoles = [];
      this.personForm.reset();
      const persona = this.buscarPersona(id);
      if (!persona) return;

      if (persona.tipo) this.configurarTipo(persona.tipo);
      this.captureMethod = 'manual';
      this.selectedRoles = [...persona.roles];
      if (persona.datos) {
        this.personForm.patchValue({
          ...persona.datos,
          participacion: persona.datos.participacion == null ? '' : String(persona.datos.participacion),
        });
      } else {
        // Older in-memory records contain only the full name; do not guess its individual parts.
        this.personForm.patchValue({
          nombre1: persona.tipo !== 'moral' ? persona.nombre : '',
          razonSocial: persona.tipo !== 'fisica' ? persona.nombre : '',
          correo: persona.correo,
        });
      }
    });
  }

  private buscarPersona(id: string | null) {
    if (id === null || !/^(0|[1-9]\d*)$/.test(id)) return undefined;
    const numero = Number(id);
    return Number.isSafeInteger(numero)
      ? this.personasInvolucradas.personas().find((persona) => persona.id === numero)
      : undefined;
  }

  selectPersonType(personType: PersonType): void {
    this.configurarTipo(personType);
    if (!this.modoEdicion()) {
      this.captureMethod = null;
      this.selectedRoles = [];
      this.personForm.reset();
    }
  }

  private configurarTipo(personType: PersonType): void {
    this.personType = personType;
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
    if (this.modoEdicion()) {
      this.volverAlArbol();
      return;
    }
    if (this.captureMethod) {
      this.captureMethod = null;
      this.selectedRoles = [];
      return;
    }

    this.personType = null;
    this.personForm.reset();
  }

  cancelar(): void {
    if (this.modoEdicion()) {
      this.volverAlArbol();
      return;
    }
    if (this.desdePersonas()) {
      void this.router.navigateByUrl('/analisis/personas-involucradas');
      return;
    }

    this.personType = null;
    this.captureMethod = null;
    this.selectedRoles = [];
    this.personForm.reset();
  }

  private volverAlArbol(): void {
    void this.router.navigate(['/analisis/personas-involucradas'], { queryParams: { vista: 'arbol' } });
  }

  finalizarRegistro(): void {
    if (!this.personType || this.vinculoInvalido() || this.edicionInvalida() || this.selectedRoles.length === 0 || this.personForm.invalid) {
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

    if (this.modoEdicion()) {
      const persona = this.personaEditada();
      if (persona && this.personasInvolucradas.actualizar(persona.id, nombre, datos.correo, this.selectedRoles, this.personType, datos)) {
        this.volverAlArbol();
      }
      return;
    }

    const agregada = this.personasInvolucradas.agregar(
      nombre,
      datos.correo,
      this.selectedRoles,
      this.personType,
      { vinculadaConId: this.personaVinculada()?.id, datos },
    );
    if (agregada) {
      void this.router.navigateByUrl(
        this.desdePersonas() ? '/analisis/personas-involucradas' : '/analisis/documentos',
      );
    }
  }
}
