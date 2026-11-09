import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { vi } from 'vitest';
import { PersonasInvolucradasService } from '../personas-involucradas.service';
import { PersonasInvolucradas } from './personas-involucradas';

@Component({ template: '' })
class DocumentacionDePrueba {}

describe('Integración del árbol de personas involucradas', () => {
  it('muestra el árbol y resalta la persona seleccionada desde el panel', async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([
        { path: 'analisis/personas-involucradas', component: PersonasInvolucradas },
        { path: 'analisis/documentos', component: DocumentacionDePrueba },
      ])],
    }).compileComponents();

    const service = TestBed.inject(PersonasInvolucradasService);
    service.agregar('Persona principal', '', ['aval'], 'moral');
    const idPersona = service.personas()[0].id;
    service.agregar('Persona vinculada', '', ['apoderado'], 'fisica', {
      vinculadaConId: idPersona,
      nivel: 1,
    });
    const idVinculada = service.personas()[1].id;
    service.agregar('Persona descendiente', '', ['accionista'], 'fisica', {
      vinculadaConId: idVinculada,
      nivel: 2,
    });

    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl(
      `/analisis/personas-involucradas?vista=arbol&seleccionada=${idPersona}`,
      PersonasInvolucradas,
    );
    harness.detectChanges();

    expect(component.personaSeleccionadaId()).toBe(idPersona);
    expect(harness.routeNativeElement?.querySelector('mat-tab-group')).toBeNull();
    expect(harness.routeNativeElement?.querySelector('table')).toBeNull();
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

    const confirmarEliminacion = vi.spyOn(window, 'confirm').mockReturnValue(false);
    const botonEliminarVinculada = harness.routeNativeElement?.querySelector<HTMLButtonElement>(
      '[aria-label="Eliminar Persona vinculada"]',
    );
    botonEliminarVinculada?.click();
    expect(service.personas()).toHaveLength(3);

    confirmarEliminacion.mockReturnValue(true);
    botonEliminarVinculada?.click();
    expect(service.personas().map((persona) => persona.nombre)).toEqual(['Persona principal']);
    expect(TestBed.inject(Router).url).toContain('/analisis/personas-involucradas');
    confirmarEliminacion.mockRestore();

    const tarjetaPersona = harness.routeNativeElement?.querySelector('.tree-card:not(.applicant-tree-card)');
    tarjetaPersona?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await harness.fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe('/analisis/documentos');
    expect(service.selectedName()).toBe('Persona principal');
    expect(service.selectedPersonaId()).toBe(idPersona);
  });
});
