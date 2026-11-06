import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { PersonasInvolucradasService } from '../personas-involucradas.service';
import { PersonasInvolucradas } from '../personas-involucradas/personas-involucradas';
import { AnalisisLayout } from './analisis-layout';

@Component({ template: '' })
class PaginaDePrueba {}

describe('Integración del panel de análisis', () => {
  let fixture: ComponentFixture<AnalisisLayout>;
  let service: PersonasInvolucradasService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalisisLayout],
      providers: [provideRouter([
        { path: 'analisis/documentos', component: PaginaDePrueba },
        { path: 'analisis/personas-involucradas', component: PersonasInvolucradas },
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
      fixture.nativeElement.querySelectorAll('.people-tree a.involved-person'),
    );
    expect(people).toHaveLength(2);
    expect(people[0].textContent).toContain('Primer nivel');
    expect(people[0].querySelector('.involved-person-avatar')).toBeNull();
    expect(people[0].getAttribute('href')).toBe('/analisis/documentos');
    const treeLink = fixture.nativeElement.querySelector(
      '[aria-label="Ver Primer nivel en el árbol de personas"]',
    );
    expect(treeLink.getAttribute('href')).toBe(
      '/analisis/personas-involucradas?vista=arbol&seleccionada=1',
    );
    expect(fixture.nativeElement.querySelector('[aria-label="Editar Primer nivel"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('[aria-label="Añadir persona vinculada con Primer nivel"]'))
      .toBeNull();

    people[0].click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(service.selectedName()).toBe('Primer nivel');
    expect(service.selectedPersonaId()).toBe(1);
    expect(fixture.nativeElement.querySelector('.involved-person-row--selected .person-name').textContent)
      .toContain('Primer nivel');
    expect(router.url).toBe('/analisis/documentos');

    fixture.componentInstance.seleccionarSolicitante();
    expect(service.selectedName()).toBe(service.nombreSolicitante);
    expect(service.selectedPersonaId()).toBeNull();
  });

  it('abre documentación al tocar la tarjeta y el ojo abre el árbol seleccionado', async () => {
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

    const peopleLinks: HTMLAnchorElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('.people-tree a.involved-person'),
    );
    expect(peopleLinks).toHaveLength(3);
    expect(peopleLinks[0].textContent).toContain('Persona principal');
    expect(peopleLinks[1].textContent).toContain('Persona vinculada');
    expect(peopleLinks[2].textContent).toContain('Persona del tercer nivel');
    expect(peopleLinks[0].getAttribute('href')).toBe('/analisis/documentos');
    expect(peopleLinks[1].getAttribute('href')).toBe('/analisis/documentos');
    const treeLink: HTMLAnchorElement = fixture.nativeElement.querySelector(
      '[aria-label="Ver Persona vinculada en el árbol de personas"]',
    );
    expect(treeLink.getAttribute('href')).toContain(`seleccionada=${vinculadaId}`);
    expect(fixture.nativeElement.querySelector('[aria-label^="Editar "]')).toBeNull();
    expect(fixture.nativeElement.querySelector('[aria-label^="Añadir persona vinculada"]')).toBeNull();

    peopleLinks[1].click();
    await fixture.whenStable();
    expect(router.url).toBe('/analisis/documentos');
    expect(service.selectedName()).toBe('Persona vinculada');

    treeLink.click();
    await fixture.whenStable();
    expect(router.url).toBe(`/analisis/personas-involucradas?vista=arbol&seleccionada=${vinculadaId}`);
  });
});
