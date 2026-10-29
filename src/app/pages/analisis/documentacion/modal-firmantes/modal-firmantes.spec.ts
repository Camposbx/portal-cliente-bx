import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalFirmantes } from './modal-firmantes';

describe('ModalFirmantes', () => {
  let component: ModalFirmantes;
  let fixture: ComponentFixture<ModalFirmantes>;
  let close: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    close = vi.fn();

    await TestBed.configureTestingModule({
      imports: [ModalFirmantes],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            personas: [
              { id: 1, nombre: 'Salma Hayek', correo: 'salma@example.com' },
              { id: 2, nombre: 'Juan Pérez', correo: 'juan@example.com' },
              { id: 3, nombre: 'Ana López', correo: 'ana@example.com' },
            ],
          },
        },
        { provide: MatDialogRef, useValue: { close } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalFirmantes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('limits signer selection to two people and returns the selection', () => {
    component.togglePersona(1, true);
    component.togglePersona(2, true);
    component.togglePersona(3, true);
    component.enviar();

    expect(component.selectedIds).toEqual([1, 2]);
    expect(close).toHaveBeenCalledWith([1, 2]);
  });

  it('does not send when no signer is selected', () => {
    component.enviar();

    expect(close).not.toHaveBeenCalled();
  });
});
