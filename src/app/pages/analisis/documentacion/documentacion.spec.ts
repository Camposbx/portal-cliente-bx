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

  it('shows a non-interactive digital-signature indicator only on documents that require it', () => {
    fixture.detectChanges();

    const tableHeaders: HTMLTableCellElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('thead th'),
    );
    const rows: HTMLTableRowElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('tbody tr'),
    );
    const indicatedDocuments = rows
      .filter((row) => row.querySelector('.signature-indicator'))
      .map((row) => row.querySelector('.doc-name')?.textContent?.trim());

    expect(tableHeaders).toHaveLength(5);
    expect(tableHeaders.some((header) => header.textContent?.includes('Firma digital'))).toBe(
      false,
    );
    expect(indicatedDocuments).toEqual([
      'Estados financieros parciales',
      'Identificación oficial',
      'Estados financieros anualito penúltimo cierre',
      'Relación analítica de las principales cuentas analíticas de las principales cuentas',
      'Detalle de pasivos',
    ]);
    expect(fixture.nativeElement.querySelector('.signature-indicator').tagName).toBe('SPAN');
    expect(fixture.nativeElement.querySelector('.signature-indicator').getAttribute('role')).toBe(
      'img',
    );
    expect(fixture.nativeElement.querySelectorAll('.signature-button')).toHaveLength(0);
    expect(fixture.nativeElement.textContent).not.toContain('Req. firma digital');
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

  it('opens a separate conversation for each document and sends messages to the active chat', () => {
    fixture.detectChanges();

    const conversationButtons: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('.conversation-button'),
    );
    expect(conversationButtons[0].closest('td')?.querySelector('.status-badge')).toBeTruthy();
    conversationButtons[0].click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.conversation-document').textContent).toContain(
      component.documents[0].name,
    );

    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('#conversation-message');
    input.value = '¿Debo incluir el último trimestre?';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const form: HTMLFormElement = fixture.nativeElement.querySelector('.conversation-composer');
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(component.documents[0].messages.at(-1)?.text).toBe(
      '¿Debo incluir el último trimestre?',
    );
    expect(component.documents[1].messages).toHaveLength(3);

    const closeButton: HTMLButtonElement =
      fixture.nativeElement.querySelector('.conversation-close');
    closeButton.click();
    conversationButtons[1].click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.conversation-document').textContent).toContain(
      component.documents[1].name,
    );
    expect(fixture.nativeElement.querySelector('.conversation-messages').textContent).not.toContain(
      '¿Debo incluir el último trimestre?',
    );
  });

  it('closes the conversation with Escape', () => {
    fixture.detectChanges();
    const conversationButton: HTMLButtonElement =
      fixture.nativeElement.querySelector('.conversation-button');
    conversationButton.click();
    fixture.detectChanges();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeNull();
  });
});
