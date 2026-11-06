import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { PersonasInvolucradasService } from '../personas-involucradas.service';
import { RegistroPersona } from './registro-persona';

@Component({ template: '' })
class DocumentosDePrueba {}

describe('Registro de persona desde análisis', () => {
  it('registra una sola persona con tipo y datos y vuelve a documentos', async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([
        { path: 'analisis/registro-persona', component: RegistroPersona },
        { path: 'analisis/documentos', component: DocumentosDePrueba },
      ])],
    }).compileComponents();

    const service = TestBed.inject(PersonasInvolucradasService);
    const router = TestBed.inject(Router);
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/analisis/registro-persona', RegistroPersona);
    component.selectPersonType('fisica');
    component.selectCaptureMethod('manual');
    component.toggleRole('depositario', true);
    component.personForm.patchValue({ nombre1: 'Ana', primerApellido: 'Pérez', nacionalidad: 'Mexicana' });
    component.finalizarRegistro();
    await harness.fixture.whenStable();

    expect(service.personas()).toHaveLength(1);
    expect(service.personas()[0]).toMatchObject({
      nombre: 'Ana Pérez', tipo: 'fisica', tipoPersona: 'fisica', nivel: 0,
      datos: { nombre1: 'Ana', primerApellido: 'Pérez', nacionalidad: 'Mexicana' },
    });
    expect(router.url).toBe('/analisis/documentos');
  });

  it('después de guardar una persona moral aval muestra el formulario PF como apoderado', async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([
        { path: 'analisis/registro-persona', component: RegistroPersona },
        { path: 'analisis/documentos', component: DocumentosDePrueba },
      ])],
    }).compileComponents();

    const service = TestBed.inject(PersonasInvolucradasService);
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/analisis/registro-persona', RegistroPersona);
    component.selectPersonType('moral');
    component.selectCaptureMethod('manual');
    component.toggleRole('aval', true);
    component.personForm.patchValue({
      razonSocial: 'Empresa ejemplo',
      tipoSociedad: 'S.A. de C.V.',
      nacionalidad: 'Mexicana',
    });
    component.finalizarRegistro();

    expect(component.isSecondLevel).toBe(true);
    expect(component.tiposPersonaDisponibles).toEqual(['fisica']);

    component.selectPersonType('fisica');
    component.selectCaptureMethod('manual');
    expect(component.rolesDisponiblesSegundoNivel.map((role) => role.id)).toEqual(['apoderado']);
    component.selectSecondLevelRole('apoderado');
    expect(component.selectedRoles).toEqual(['apoderado']);
    component.personForm.patchValue({
      nombre1: 'Ana',
      primerApellido: 'Pérez',
      nacionalidad: 'Mexicana',
    });
    component.finalizarRegistro();
    await harness.fixture.whenStable();

    expect(service.personas()).toHaveLength(2);
    expect(service.personas()[1]).toMatchObject({
      nombre: 'Ana Pérez',
      tipo: 'fisica',
      roles: ['apoderado'],
      vinculadaConId: service.personas()[0].id,
      nivel: 1,
      datos: { nombre1: 'Ana', primerApellido: 'Pérez', nacionalidad: 'Mexicana' },
    });
  });

  it('permite registrar una persona moral accionista como accionista de segundo nivel', async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([
        { path: 'analisis/registro-persona', component: RegistroPersona },
        { path: 'analisis/documentos', component: DocumentosDePrueba },
      ])],
    }).compileComponents();

    const service = TestBed.inject(PersonasInvolucradasService);
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/analisis/registro-persona', RegistroPersona);
    component.selectPersonType('moral');
    component.selectCaptureMethod('manual');
    component.toggleRole('accionista', true);
    component.personForm.patchValue({
      razonSocial: 'Empresa matriz',
      tipoSociedad: 'S.A. de C.V.',
      nacionalidad: 'Mexicana',
    });
    component.finalizarRegistro();

    expect(component.tiposPersonaDisponibles).toEqual(['fisica', 'moral']);
    component.selectPersonType('moral');
    component.selectCaptureMethod('manual');
    expect(component.rolesDisponiblesSegundoNivel.map((role) => role.id)).toEqual(['accionista']);
    component.selectSecondLevelRole('accionista');
    expect(component.selectedRoles).toEqual(['accionista']);
    component.personForm.patchValue({
      razonSocial: 'Empresa accionista',
      tipoSociedad: 'S.A. de C.V.',
      nacionalidad: 'Mexicana',
    });
    component.finalizarRegistro();
    await harness.fixture.whenStable();

    expect(service.personas()).toHaveLength(2);
    expect(service.personas()[1]).toMatchObject({
      tipo: 'moral',
      roles: ['accionista'],
      vinculadaConId: service.personas()[0].id,
      nivel: 1,
    });
  });

  it('limita los roles del primer nivel de una PM a aval, accionista y garante', async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([
        { path: 'analisis/registro-persona', component: RegistroPersona },
        { path: 'analisis/documentos', component: DocumentosDePrueba },
      ])],
    }).compileComponents();

    const component = await (await RouterTestingHarness.create())
      .navigateByUrl('/analisis/registro-persona', RegistroPersona);
    component.selectPersonType('moral');

    expect(component.rolesDisponiblesPrimerNivel.map((role) => role.id))
      .toEqual(['aval', 'accionista', 'garante']);

    component.toggleRole('apoderado', true);
    component.toggleRole('depositario', true);
    expect(component.selectedRoles).toEqual([]);
  });

  it('asigna accionista y apoderado al segundo nivel PF según los roles de la persona moral', async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([
        { path: 'analisis/registro-persona', component: RegistroPersona },
        { path: 'analisis/documentos', component: DocumentosDePrueba },
      ])],
    }).compileComponents();

    const component = await (await RouterTestingHarness.create())
      .navigateByUrl('/analisis/registro-persona', RegistroPersona);
    component.selectPersonType('moral');
    component.selectCaptureMethod('manual');
    component.toggleRole('aval', true);
    component.toggleRole('accionista', true);
    component.toggleRole('garante', true);
    component.personForm.patchValue({
      razonSocial: 'Empresa ejemplo',
      tipoSociedad: 'S.A. de C.V.',
      nacionalidad: 'Mexicana',
    });
    component.finalizarRegistro();
    component.selectPersonType('fisica');
    component.selectCaptureMethod('manual');

    expect(component.rolesDisponiblesSegundoNivel.map((role) => role.id)).toEqual(['apoderado', 'accionista']);
    expect(component.selectedRoles).toEqual([]);
    component.selectSecondLevelRole('accionista');
    expect(component.selectedRoles).toEqual(['accionista']);
  });

  it('muestra las relaciones de segundo nivel correspondientes a los roles de una PF', async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([
        { path: 'analisis/registro-persona', component: RegistroPersona },
        { path: 'analisis/documentos', component: DocumentosDePrueba },
      ])],
    }).compileComponents();

    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/analisis/registro-persona', RegistroPersona);
    component.selectPersonType('fisica');
    component.selectCaptureMethod('manual');
    component.toggleRole('aval', true);
    component.toggleRole('accionista', true);
    component.toggleRole('apoderado', true);
    component.toggleRole('garante', true);
    component.toggleRole('depositario', true);
    component.personForm.patchValue({
      nombre1: 'Ana',
      primerApellido: 'Pérez',
      nacionalidad: 'Mexicana',
    });
    component.finalizarRegistro();

    expect(component.isSecondLevel).toBe(true);
    expect(component.tiposPersonaDisponibles).toEqual(['fisica', 'moral']);

    component.selectPersonType('fisica');
    component.selectCaptureMethod('manual');
    expect(component.rolesDisponiblesSegundoNivel.map((role) => role.id)).toEqual(['apoderado', 'accionista']);

    component.selectPersonType('moral');
    component.selectCaptureMethod('manual');
    expect(component.rolesDisponiblesSegundoNivel.map((role) => role.id)).toEqual(['accionista']);
  });

  it('al terminar selecciona la última persona vinculada que se registró', async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([
        { path: 'analisis/registro-persona', component: RegistroPersona },
        { path: 'analisis/documentos', component: DocumentosDePrueba },
        { path: 'analisis/personas-involucradas', component: DocumentosDePrueba },
      ])],
    }).compileComponents();

    const service = TestBed.inject(PersonasInvolucradasService);
    const router = TestBed.inject(Router);
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/analisis/registro-persona', RegistroPersona);
    component.selectPersonType('moral');
    component.selectCaptureMethod('manual');
    component.toggleRole('aval', true);
    component.personForm.patchValue({
      razonSocial: 'Empresa principal',
      tipoSociedad: 'S.A. de C.V.',
      nacionalidad: 'Mexicana',
    });
    component.finalizarRegistro();

    component.selectPersonType('fisica');
    component.selectCaptureMethod('manual');
    component.selectSecondLevelRole('apoderado');
    component.personForm.patchValue({
      nombre1: 'Ana',
      primerApellido: 'Pérez',
      nacionalidad: 'Mexicana',
    });
    component.finalizarRegistro();
    expect(component.esperandoAccionSegundoNivel).toBe(true);
    expect(component.cantidadPersonasSegundoNivel).toBe(1);

    component.registrarOtraPersonaSegundoNivel();
    component.selectPersonType('fisica');
    component.selectCaptureMethod('manual');
    component.selectSecondLevelRole('apoderado');
    component.personForm.patchValue({
      nombre1: 'Luis',
      primerApellido: 'García',
      nacionalidad: 'Mexicana',
    });
    component.finalizarRegistro();

    expect(component.cantidadPersonasSegundoNivel).toBe(2);
    expect(service.personas().slice(1)).toMatchObject([
      { nombre: 'Ana Pérez', vinculadaConId: service.personas()[0].id, nivel: 1 },
      { nombre: 'Luis García', vinculadaConId: service.personas()[0].id, nivel: 1 },
    ]);

    component.terminarRegistroSegundoNivel();
    await harness.fixture.whenStable();
    const ultimaPersona = service.personas()[2];
    expect(router.url).toBe(
      `/analisis/personas-involucradas?vista=arbol&seleccionada=${ultimaPersona.id}`,
    );
    expect(service.selectedName()).toBe('Luis García');
    expect(service.selectedPersonaId()).toBe(ultimaPersona.id);
  });

  it('agrega una persona desde el árbol al segundo nivel sin abrir un tercer nivel', async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([
        { path: 'analisis/registro-persona', component: RegistroPersona },
        { path: 'analisis/personas-involucradas', component: DocumentosDePrueba },
      ])],
    }).compileComponents();

    const service = TestBed.inject(PersonasInvolucradasService);
    service.agregar('Empresa principal', '', ['aval'], 'moral');
    const idPrincipal = service.personas()[0].id;
    service.agregar('Persona vinculada existente', '', ['apoderado'], 'fisica', {
      vinculadaConId: idPrincipal,
      nivel: 1,
    });

    const router = TestBed.inject(Router);
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl(
      `/analisis/registro-persona?vinculadaCon=${idPrincipal}`,
      RegistroPersona,
    );

    expect(component.isSecondLevel).toBe(true);
    component.selectPersonType('fisica');
    expect(component.rolesDisponiblesSegundoNivel.map((role) => role.id)).toEqual(['apoderado']);
    component.selectCaptureMethod('manual');
    component.selectSecondLevelRole('apoderado');
    component.personForm.patchValue({
      nombre1: 'Nueva',
      primerApellido: 'Persona',
      nacionalidad: 'Mexicana',
    });
    component.finalizarRegistro();
    await harness.fixture.whenStable();

    expect(component.esperandoAccionSegundoNivel).toBe(false);
    expect(service.personas()).toHaveLength(3);
    expect(service.personas()[1].nombre).toBe('Persona vinculada existente');
    expect(service.personas()[2]).toMatchObject({
      nombre: 'Nueva Persona',
      vinculadaConId: idPrincipal,
      nivel: 1,
    });
    expect(router.url).toBe('/analisis/personas-involucradas');
  });

  it('carga los datos existentes al abrir la edición y actualiza sin duplicar la persona', async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([
        { path: 'analisis/registro-persona', component: RegistroPersona },
        { path: 'analisis/personas-involucradas', component: DocumentosDePrueba },
      ])],
    }).compileComponents();

    const service = TestBed.inject(PersonasInvolucradasService);
    const datos = {
      nombre1: 'Ana',
      nombre2: 'María',
      nombre3: '',
      primerApellido: 'Pérez',
      segundoApellido: 'López',
      razonSocial: '',
      tipoSociedad: '',
      nacionalidad: 'Mexicana',
      curp: 'PELA900101MDFRPN01',
      rfc: 'PELA900101AB1',
      estadoCivil: 'Casado',
      regimenMatrimonial: 'SociedadConyugal',
      correo: 'ana@example.mx',
      participacion: '25',
    };
    service.agregar(
      'Ana María Pérez López',
      datos.correo,
      ['accionista'],
      'fisica',
      { datos },
    );

    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/analisis/registro-persona?editar=0', RegistroPersona);

    expect(component.personType).toBe('fisica');
    expect(component.captureMethod).toBe('manual');
    expect(component.selectedRoles).toEqual(['accionista']);
    expect(component.personForm.getRawValue()).toEqual(datos);
    expect(
      harness.fixture.nativeElement.querySelector('[formControlName="nombre1"]').value,
    ).toBe('Ana');
    expect(
      harness.fixture.nativeElement.querySelector('[formControlName="curp"]').value,
    ).toBe(datos.curp);

    component.personForm.controls.nombre2.setValue('Elena');
    component.finalizarRegistro();
    await harness.fixture.whenStable();

    expect(service.personas()).toHaveLength(1);
    expect(service.personas()[0]).toMatchObject({
      nombre: 'Ana Elena Pérez López',
      roles: ['accionista'],
      datos: { ...datos, nombre2: 'Elena' },
    });
  });

  it('abre en modo edición los registros antiguos que no tienen tipo ni datos detallados', async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([
        { path: 'analisis/registro-persona', component: RegistroPersona },
        { path: 'analisis/personas-involucradas', component: DocumentosDePrueba },
      ])],
    }).compileComponents();

    const service = TestBed.inject(PersonasInvolucradasService);
    service.agregar('Nombre de registro anterior', '', ['aval']);

    const component = await (await RouterTestingHarness.create())
      .navigateByUrl('/analisis/registro-persona?editar=0', RegistroPersona);

    expect(component.personType).toBe('fisica');
    expect(component.captureMethod).toBe('manual');
    expect(component.selectedRoles).toEqual(['aval']);
    expect(component.personForm.controls.nombre1.value).toBe('Nombre de registro anterior');
  });
});
