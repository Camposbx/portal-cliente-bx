import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PersonasInvolucradasService } from '../personas-involucradas.service';
import { AnalisisLayout } from './analisis-layout';

describe('Integración del panel de análisis', () => {
  let fixture: ComponentFixture<AnalisisLayout>;
  let service: PersonasInvolucradasService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalisisLayout],
      providers: [provideRouter([])],
    }).compileComponents();
    service = TestBed.inject(PersonasInvolucradasService);
    fixture = TestBed.createComponent(AnalisisLayout);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('mantiene el enlace y muestra u oculta ejemplos sin registrarlos', async () => {
    const link = fixture.nativeElement.querySelector('[aria-label="Ver personas involucradas"]');
    const toggle: HTMLButtonElement = fixture.nativeElement.querySelector('.examples-toggle');
    expect(link.getAttribute('href')).toBe('/analisis/personas-involucradas');
    expect(fixture.nativeElement.querySelector('#people-examples')).toBeNull();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');

    toggle.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(fixture.nativeElement.querySelectorAll('#people-examples .involved-person')).toHaveLength(6);
    expect(service.personas()).toHaveLength(0);
    expect(fixture.nativeElement.querySelector('[aria-label="Ver personas involucradas"]')).toBeTruthy();

    toggle.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#people-examples')).toBeNull();
  });

  it('conserva el orden por nivel y la selección de personas y solicitante', async () => {
    service.agregar('Segundo nivel', '', ['aval'], 'fisica', { nivel: 2 });
    service.agregar('Primer nivel', '', ['garante'], 'moral', { nivel: 1 });
    fixture.detectChanges();
    await fixture.whenStable();

    const people: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('[aria-label="Personas registradas"] button'),
    );
    expect(people).toHaveLength(2);
    expect(people[0].textContent).toContain('Primer nivel');
    people[0].click();
    fixture.detectChanges();
    expect(service.selectedName()).toBe('Primer nivel');
    expect(people[0].getAttribute('aria-pressed')).toBe('true');

    fixture.componentInstance.seleccionarSolicitante();
    expect(service.selectedName()).toBe(service.nombreSolicitante);
  });
});
