import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PersonasInvolucradasService } from '../personas-involucradas.service';
import { Documentos } from './documentos';

describe('Documentos', () => {
  it('permite agregar una persona vinculada solo cuando se selecciona una persona de nivel 1', async () => {
    await TestBed.configureTestingModule({
      imports: [Documentos],
      providers: [provideRouter([])],
    }).compileComponents();

    const service = TestBed.inject(PersonasInvolucradasService);
    service.agregar('Persona de nivel 1', '', ['aval'], 'moral');
    const idNivel1 = service.personas()[0].id;
    service.agregar('Persona de nivel 2', '', ['apoderado'], 'fisica', {
      vinculadaConId: idNivel1,
      nivel: 1,
    });
    const idNivel2 = service.personas()[1].id;

    const fixture = TestBed.createComponent(Documentos);
    fixture.detectChanges();

    const applicantEditLink: HTMLAnchorElement = fixture.nativeElement.querySelector('.edit-button');
    expect(applicantEditLink.getAttribute('href')).toBe('/analisis/perfil');
    expect(fixture.nativeElement.querySelector('[aria-label="Agregar persona"]')).toBeNull();

    service.seleccionarPersona('Persona de nivel 1', idNivel1);
    fixture.detectChanges();
    const editLink: HTMLAnchorElement = fixture.nativeElement.querySelector('.edit-button');
    expect(editLink.getAttribute('href')).toContain(`/analisis/registro-persona?editar=${idNivel1}`);

    const addLink: HTMLAnchorElement = fixture.nativeElement.querySelector('[aria-label="Agregar persona"]');
    expect(addLink).not.toBeNull();
    expect(addLink.getAttribute('href')).toContain(`vinculadaCon=${idNivel1}`);

    service.seleccionarPersona('Persona de nivel 2', idNivel2);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[aria-label="Agregar persona"]')).toBeNull();
  });
});
