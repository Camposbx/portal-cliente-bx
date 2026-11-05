import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { PersonasInvolucradasService } from '../personas-involucradas.service';
import { AnalisisLayout } from './analisis-layout';

@Component({ template: '' })
class RegistroPersonaDePrueba {}

describe('Integración del panel de análisis', () => {
  let fixture: ComponentFixture<AnalisisLayout>;
  let service: PersonasInvolucradasService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalisisLayout],
      providers: [provideRouter([
        { path: 'analisis/registro-persona', component: RegistroPersonaDePrueba },
      ])],
    }).compileComponents();
    service = TestBed.inject(PersonasInvolucradasService);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(AnalisisLayout);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('muestra el estado vacío y conserva el enlace a personas involucradas', async () => {
    const link = fixture.nativeElement.querySelector('[aria-label="Ver personas involucradas"]');
    expect(link.getAttribute('href')).toBe('/analisis/personas-involucradas');
    expect(fixture.nativeElement.querySelector('[aria-label="Personas registradas"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('.people-empty-state').textContent).toContain(
      'Registra las personas involucradas',
    );
    expect(service.personas()).toHaveLength(0);
    expect(fixture.nativeElement.querySelector('[aria-label="Ver personas involucradas"]')).toBeTruthy();
  });

  it('conserva el orden por nivel y la selección de personas y solicitante', async () => {
    service.agregar('Segundo nivel', '', ['aval'], 'fisica', { nivel: 2 });
    service.agregar('Primer nivel', '', ['garante'], 'moral', { nivel: 1 });
    fixture.detectChanges();
    await fixture.whenStable();

    const people: HTMLAnchorElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('[aria-label="Personas registradas"] a'),
    );
    expect(people).toHaveLength(2);
    expect(people[0].textContent).toContain('Primer nivel');
    people[0].click();
    fixture.detectChanges();
    expect(service.selectedName()).toBe('Primer nivel');
    expect(people[0].getAttribute('aria-current')).toBe('true');

    fixture.componentInstance.seleccionarSolicitante();
    expect(service.selectedName()).toBe(service.nombreSolicitante);
  });

  it('muestra las personas anidadas y cada vínculo abre la edición de esa persona', async () => {
    service.agregar('Persona principal', '', ['aval'], 'moral');
    const principalId = service.personas()[0].id;
    service.agregar('Persona vinculada', '', ['apoderado'], 'fisica', {
      vinculadaConId: principalId,
      nivel: 1,
    });
    const vinculadaId = service.personas()[1].id;
    service.agregar('Persona del tercer nivel', '', ['accionista'], 'fisica', {
      vinculadaConId: vinculadaId,
      nivel: 2,
    });
    fixture.detectChanges();
    await fixture.whenStable();

    const examples: HTMLElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('[aria-label="Personas registradas"] a.involved-person'),
    );
    expect(examples).toHaveLength(3);
    expect(examples[0].textContent).toContain('Persona principal');
    expect(examples[1].textContent).toContain('Persona vinculada');
    expect(examples[2].textContent).toContain('Persona del tercer nivel');
    expect(examples[0].getAttribute('href')).toContain(`editar=${principalId}`);
    expect(examples[1].getAttribute('href')).toContain(`editar=${vinculadaId}`);

    examples[1].click();
    await fixture.whenStable();
    expect(router.url).toBe(`/analisis/registro-persona?editar=${vinculadaId}`);
    expect(service.selectedName()).toBe('Persona vinculada');
  });
});
