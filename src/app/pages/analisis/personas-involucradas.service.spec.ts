import { DatosPersona, PersonasInvolucradasService } from './personas-involucradas.service';

describe('PersonasInvolucradasService', () => {
  let service: PersonasInvolucradasService;

  beforeEach(() => {
    service = new PersonasInvolucradasService();
  });

  it('conserva tipo, datos, vínculo y nivel sin duplicar registros', () => {
    const datos: DatosPersona = {
      nombre1: 'Ana', nombre2: '', nombre3: '', primerApellido: 'Pérez', segundoApellido: '',
      razonSocial: '', tipoSociedad: '', nacionalidad: 'Mexicana', curp: '', rfc: '',
      estadoCivil: '', regimenMatrimonial: '', correo: 'ana@ejemplo.mx', participacion: '',
    };
    expect(service.agregar('Principal', '', ['garante'], 'moral')).toBe(true);
    expect(service.agregar(' Ana Pérez ', ' ana@ejemplo.mx ', ['aval'], 'fisica', {
      vinculadaConId: 0, datos, nivel: 2.8,
    })).toBe(true);

    expect(service.personas()).toHaveLength(2);
    expect(service.personas()[1]).toMatchObject({
      id: 1, nombre: 'Ana Pérez', correo: 'ana@ejemplo.mx', tipo: 'fisica',
      tipoPersona: 'fisica', vinculadaConId: 0, nivel: 2, datos,
    });
    expect(service.personas()[1].datos).not.toBe(datos);

    service.seleccionarPersona('Ana Pérez');
    expect(service.actualizar(1, 'Ana actualizada', '', ['garante'], 'moral', datos)).toBe(true);
    expect(service.personas()[1]).toMatchObject({
      id: 1, nombre: 'Ana actualizada', tipo: 'moral', tipoPersona: 'moral',
      vinculadaConId: 0, nivel: 2,
    });
    expect(service.selectedName()).toBe('Ana actualizada');
  });

  it('rechaza nombres y vínculos inválidos y conserva la llamada numérica anterior', () => {
    expect(service.agregar(' ', '', [], 'fisica')).toBe(false);
    expect(service.agregar('Sin padre', '', ['aval'], 'fisica', { vinculadaConId: 99 })).toBe(false);
    expect(service.personas()).toHaveLength(0);
    service.agregar('Principal', '', ['aval'], 'fisica');
    expect(service.agregar('Vinculada', '', ['aval'], 'fisica', 0)).toBe(true);
    expect(service.personas()[1]).toMatchObject({ vinculadaConId: 0, nivel: 0 });
  });

  it('normaliza niveles inválidos y admite registros sin tipo', () => {
    service.agregar('Sin tipo', '', ['aval']);
    service.agregar('Negativo', '', ['aval'], 'fisica', { nivel: -3 });
    service.agregar('No finito', '', ['aval'], 'fisica', { nivel: Infinity });
    expect(service.personas()[0]).toMatchObject({ tipo: undefined, tipoPersona: undefined, nivel: 0 });
    expect(service.personas().map((persona) => persona.nivel)).toEqual([0, 0, 0]);
  });

  it('elimina una persona y todos sus descendientes, y limpia la selección si fue eliminada', () => {
    service.agregar('Principal', '', ['aval'], 'fisica');
    const idPrincipal = service.personas()[0].id;
    service.agregar('Vinculada', '', ['aval'], 'fisica', { vinculadaConId: idPrincipal, nivel: 1 });
    const idVinculada = service.personas()[1].id;
    service.agregar('Descendiente', '', ['aval'], 'fisica', { vinculadaConId: idVinculada, nivel: 2 });
    service.agregar('Otra raíz', '', ['garante'], 'moral');
    service.seleccionarPersona('Vinculada', idVinculada);

    expect(service.eliminar(idVinculada)).toBe(true);
    expect(service.personas().map((persona) => persona.nombre)).toEqual(['Principal', 'Otra raíz']);
    expect(service.selectedName()).toBe(service.nombreSolicitante);
    expect(service.selectedPersonaId()).toBeNull();
    expect(service.eliminar(999)).toBe(false);
  });
});
