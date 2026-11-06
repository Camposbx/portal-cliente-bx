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
  secondLevelParentId: number | null = null;
  esperandoAccionSegundoNivel = false;
  private secondLevelSourceRoles: string[] = [];
  secondLevelRoleOptions: string[] = [];
  readonly roles = [
    { id: 'aval', label: 'Aval (AV)' },
    { id: 'apoderado', label: 'Apoderado Legal (AL)' },
    { id: 'accionista', label: 'Accionista (AC)' },
    { id: 'garante', label: 'Garante (GA)' },
    { id: 'depositario', label: 'Depositario legal (DL)' },
  ];
  selectedRoles: string[] = [];

  get isSecondLevel(): boolean {
    return this.secondLevelParentId !== null || this.vinculoSolicitado() !== null;
  }

  get tiposPersonaDisponibles(): PersonType[] {
    if (!this.isSecondLevel) return ['fisica', 'moral'];
    return (['fisica', 'moral'] as const).filter((tipo) => this.rolesSegundoNivel(tipo).length > 0);
  }

  get rolesDisponiblesSegundoNivel(): typeof this.roles {
    return this.roles.filter((role) => this.secondLevelRoleOptions.includes(role.id));
  }

  get rolesDisponiblesPrimerNivel(): typeof this.roles {
    const rolesPermitidos = this.personType === 'moral'
      ? ['aval', 'accionista', 'garante']
      : this.roles.map((role) => role.id);
    return this.roles.filter((role) => rolesPermitidos.includes(role.id));
  }

  nombrePersonaSegundoNivel(): string {
    const persona = this.personasInvolucradas.personas().find((item) => item.id === this.secondLevelParentId)
      ?? this.personaVinculada();
    return persona?.nombre ?? '';
  }

  get cantidadPersonasSegundoNivel(): number {
    const parentId = this.secondLevelParentId ?? this.personaVinculada()?.id;
    if (parentId === undefined || parentId === null) return 0;
    return this.personasInvolucradas.personas()
      .filter((persona) => persona.vinculadaConId === parentId).length;
  }

  constructor() {
    this.route.queryParamMap.pipe(
      map((params) => params.get('editar')),
      distinctUntilChanged(),
      takeUntilDestroyed(),
    ).subscribe((id) => this.cargarPersona(id));
  }

  private cargarPersona(id: string | null): void {
    this.personType = null;
    this.captureMethod = null;
    this.selectedRoles = [];
    this.personForm.reset();
    const persona = this.buscarPersona(id);
    if (!persona) return;

    const tipo = persona.tipo
      ?? persona.tipoPersona
      ?? (persona.datos?.razonSocial.trim() ? 'moral' : 'fisica');
    this.configurarTipo(tipo);
    this.captureMethod = 'manual';
    this.selectedRoles = [...persona.roles];
    if (persona.datos) {
      this.personForm.patchValue({
        ...persona.datos,
        participacion: persona.datos.participacion == null ? '' : String(persona.datos.participacion),
      });
      return;
    }

    // Older in-memory records contain only the full name; do not guess its individual parts.
    this.personForm.patchValue({
      nombre1: tipo === 'fisica' ? persona.nombre : '',
      razonSocial: tipo === 'moral' ? persona.nombre : '',
      correo: persona.correo,
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
      this.personForm.reset();
      this.secondLevelRoleOptions = this.isSecondLevel ? this.rolesSegundoNivel(personType) : [];
      this.selectedRoles = [];
    }
  }

  private rolesSegundoNivel(personType: PersonType): string[] {
    const rolesPorTipo: Record<PersonType, Record<string, string>> = {
      fisica: { aval: 'apoderado', accionista: 'accionista', garante: 'apoderado' },
      moral: { accionista: 'accionista' },
    };
    return [...new Set(
      this.rolesOrigenSegundoNivel
        .map((role) => rolesPorTipo[personType][role])
        .filter((role): role is string => role !== undefined),
    )];
  }

  private get rolesOrigenSegundoNivel(): string[] {
    if (this.secondLevelParentId !== null) return this.secondLevelSourceRoles;
    return this.personaVinculada()?.roles ?? [];
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
    if (!this.isSecondLevel) this.selectedRoles = [];
  }

  selectSecondLevelRole(roleId: string): void {
    if (this.secondLevelRoleOptions.includes(roleId)) this.selectedRoles = [roleId];
  }

  toggleRole(roleId: string, selected: boolean): void {
    if (!this.rolesDisponiblesPrimerNivel.some((role) => role.id === roleId)) return;
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
    this.selectedRoles = [];
    this.secondLevelRoleOptions = [];
  }

  cancelar(): void {
    if (this.isSecondLevel) {
      void this.router.navigateByUrl(
        this.desdePersonas() ? '/analisis/personas-involucradas' : '/analisis/documentos',
      );
      return;
    }
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

  registrarOtraPersonaSegundoNivel(): void {
    this.personType = null;
    this.captureMethod = null;
    this.selectedRoles = [];
    this.secondLevelRoleOptions = [];
    this.personForm.reset();
    this.esperandoAccionSegundoNivel = false;
  }

  terminarRegistroSegundoNivel(): void {
    this.esperandoAccionSegundoNivel = false;
    const ultimaPersona = this.personasInvolucradas.personas()
      .filter((persona) => persona.vinculadaConId === this.secondLevelParentId)
      .at(-1);
    if (ultimaPersona) {
      this.personasInvolucradas.seleccionarPersona(ultimaPersona.nombre, ultimaPersona.id);
      void this.router.navigate(['/analisis/personas-involucradas'], {
        queryParams: { vista: 'arbol', seleccionada: ultimaPersona.id },
      });
      return;
    }

    void this.router.navigateByUrl(
      this.desdePersonas() ? '/analisis/personas-involucradas' : '/analisis/documentos',
    );
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

    const personaVinculada = this.secondLevelParentId !== null
      ? this.personasInvolucradas.personas().find((persona) => persona.id === this.secondLevelParentId)
      : this.personaVinculada();
    const agregada = this.personasInvolucradas.agregar(
      nombre,
      datos.correo,
      this.selectedRoles,
      this.personType,
      {
        vinculadaConId: personaVinculada?.id,
        datos,
        nivel: personaVinculada ? (personaVinculada.nivel ?? 0) + 1 : 0,
      },
    );
    if (!agregada) return;

    if (this.secondLevelParentId !== null) {
      this.esperandoAccionSegundoNivel = true;
      this.personType = null;
      this.captureMethod = null;
      this.selectedRoles = [];
      this.secondLevelRoleOptions = [];
      this.personForm.reset();
      return;
    }

    if (!this.isSecondLevel) {
      const rolesOrigen = this.selectedRoles.filter((role) => ['aval', 'accionista', 'garante'].includes(role));
      if (rolesOrigen.length > 0) {
        const personaGuardada = this.personasInvolucradas.personas().at(-1);
        if (personaGuardada) {
          this.secondLevelParentId = personaGuardada.id;
          this.secondLevelSourceRoles = rolesOrigen;
          this.personType = null;
          this.captureMethod = null;
          this.selectedRoles = [];
          this.secondLevelRoleOptions = [];
          this.personForm.reset();
          return;
        }
      }
    }

    void this.router.navigateByUrl(
      this.desdePersonas() ? '/analisis/personas-involucradas' : '/analisis/documentos',
    );
  }
}
