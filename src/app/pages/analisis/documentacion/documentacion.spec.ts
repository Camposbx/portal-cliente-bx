import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Documentacion } from './documentacion';
import { ModalVistaPrevia } from './modal-vista-previa/modal-vista-previa';

describe('Documentacion', () => {
  let component: Documentacion;
  let fixture: ComponentFixture<Documentacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Documentacion],
    }).compileComponents();

    fixture = TestBed.createComponent(Documentacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open the preview dialog with the selected PDF as Base64', () => {
    const dialog = fixture.debugElement.injector.get(MatDialog);
    const dialogSpy = vi.spyOn(dialog, 'open');
    const document = component.documents[1];
    const fileBase64 = 'JVBERi0xLjQ=';
    document.fileBase64 = fileBase64;

    fixture.detectChanges();
    const previewButton: HTMLButtonElement =
      fixture.nativeElement.querySelector('.preview-file-button');
    previewButton.click();

    expect(dialogSpy).toHaveBeenCalledWith(
      ModalVistaPrevia,
      expect.objectContaining({
        data: {
          documentName: document.name,
          fileBase64,
          fileName: document.selectedFileName,
          previewError: null,
        },
        panelClass: 'modal-vista-previa',
      }),
    );
  });
});
