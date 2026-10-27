import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalCargaDocs } from './modal-carga-docs';

describe('ModalCargaDocs', () => {
  let component: ModalCargaDocs;
  let fixture: ComponentFixture<ModalCargaDocs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCargaDocs],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { documentName: 'Estados financieros parciales' } },
        { provide: MatDialogRef, useValue: { close: () => undefined } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalCargaDocs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
