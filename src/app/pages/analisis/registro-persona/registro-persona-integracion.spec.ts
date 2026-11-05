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
    component.toggleRole('aval', true);
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
});
