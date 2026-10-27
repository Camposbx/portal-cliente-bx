import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalVistaPrevia } from './modal-vista-previa';

describe('ModalVistaPrevia', () => {
  let component: ModalVistaPrevia;
  let fixture: ComponentFixture<ModalVistaPrevia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalVistaPrevia],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            documentName: 'Identificación oficial',
            file: null,
            fileName: 'identificacion_oficial.pdf',
          },
        },
        { provide: MatDialogRef, useValue: { close: () => undefined } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalVistaPrevia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should explain when the file is not available in the current session', () => {
    expect(fixture.nativeElement.textContent).toContain(
      'todavía no se recibió su contenido PDF en Base64',
    );
  });
});
