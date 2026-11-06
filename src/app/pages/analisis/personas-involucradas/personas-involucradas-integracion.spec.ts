import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { PersonasInvolucradasService } from '../personas-involucradas.service';
import { PersonasInvolucradas } from './personas-involucradas';

describe('Integración del árbol de personas involucradas', () => {
  it('abre la pestaña del árbol y resalta la persona seleccionada desde el panel', async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([
        { path: 'analisis/personas-involucradas', component: PersonasInvolucradas },
      ])],
    }).compileComponents();

    const service = TestBed.inject(PersonasInvolucradasService);
    service.agregar('Persona principal', '', ['aval'], 'moral');
    const idPersona = service.personas()[0].id;
    service.agregar('Persona vinculada', '', ['apoderado'], 'fisica', {
      vinculadaConId: idPersona,
      nivel: 1,
    });

    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl(
      `/analisis/personas-involucradas?vista=arbol&seleccionada=${idPersona}`,
      PersonasInvolucradas,
    );
    harness.detectChanges();

    expect(component.selectedTab()).toBe(1);
    expect(component.personaSeleccionadaId()).toBe(idPersona);
    const seleccionada = harness.routeNativeElement?.querySelector('.tree-card--selected');
    expect(seleccionada?.textContent).toContain('Persona principal');
    expect(seleccionada?.getAttribute('aria-current')).toBe('true');
    expect(
      harness.routeNativeElement?.querySelector(
        '[aria-label="Añadir persona vinculada con Persona principal"]',
      ),
    ).not.toBeNull();
    expect(
      harness.routeNativeElement?.querySelector(
        '[aria-label="Añadir persona vinculada con Persona vinculada"]',
      ),
    ).toBeNull();
  });
});
