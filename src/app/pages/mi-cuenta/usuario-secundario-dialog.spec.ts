import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { vi } from 'vitest';
import { UsuarioSecundarioDialog } from './usuario-secundario-dialog';

describe('UsuarioSecundarioDialog', () => {
  const close = vi.fn();

  beforeEach(async () => {
    close.mockReset();
    await TestBed.configureTestingModule({
      imports: [UsuarioSecundarioDialog],
      providers: [{ provide: MatDialogRef, useValue: { close } }],
    }).compileComponents();
  });

  it('renders the requested fields and consent information', () => {
    const fixture = TestBed.createComponent(UsuarioSecundarioDialog);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('#secondary-user-dialog-title')?.textContent).toContain(
      'Registrar usuario secundario',
    );
    expect(element.textContent).toContain('110954 INMOBILIARIA PIÑON');
    expect(element.textContent).toContain('IPI070426-B');
    expect(element.textContent).toContain('ABRAHAM EDITH TAMAYA COHEN HAMUI');
    expect(element.querySelectorAll('mat-form-field.app-form-field').length).toBe(5);
    expect(element.querySelector('#secondary-user-terms')?.textContent).toContain(
      'responsable por el uso',
    );
    expect(element.querySelector('mat-checkbox')?.textContent).toContain('Acepto términos y condiciones');
  });

  it('offers the requested positions and updates the form when one is selected', () => {
    const fixture = TestBed.createComponent(UsuarioSecundarioDialog);
    fixture.detectChanges();
    const select: MatSelect = fixture.debugElement.query(By.directive(MatSelect)).componentInstance;

    expect(select.options.map((option) => option.value)).toEqual([
      'Director General',
      'Director CEO',
      'Director Finanzas',
      'Tesorero',
      'Contador',
      'Accionista',
      'Otro',
    ]);
    expect(fixture.componentInstance.userForm.controls.puesto.invalid).toBe(true);
    select.options.last.select();
    expect(fixture.componentInstance.userForm.controls.puesto.value).toBe('Otro');
    expect(fixture.componentInstance.userForm.controls.puesto.valid).toBe(true);
  });

  it('requires valid user details and accepted terms before enabling save', () => {
    const fixture = TestBed.createComponent(UsuarioSecundarioDialog);
    const form = fixture.componentInstance.userForm;
    fixture.detectChanges();
    const save: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(save.disabled).toBe(true);

    form.patchValue({
      nombre: 'Ana',
      apellidoPaterno: 'Pérez',
      puesto: 'Director General',
      correo: 'ana@example.com',
    });
    fixture.detectChanges();
    expect(save.disabled).toBe(true);

    form.controls.aceptaTerminos.setValue(true);
    fixture.detectChanges();
    expect(save.disabled).toBe(false);
    expect(form.controls.apellidoMaterno.value).toBe('');

    form.controls.correo.setValue('correo-invalido');
    fixture.detectChanges();
    expect(save.disabled).toBe(true);
    form.controls.correo.setValue('ana@example.com');
    form.controls.nombre.setValue('   ');
    fixture.detectChanges();
    expect(save.disabled).toBe(true);
  });

  it('does not close for an invalid form and closes without a result after valid submission', () => {
    const fixture = TestBed.createComponent(UsuarioSecundarioDialog);
    const component = fixture.componentInstance;
    component.guardar();
    expect(close).not.toHaveBeenCalled();
    expect(component.userForm.touched).toBe(true);

    component.userForm.setValue({
      nombre: 'Ana',
      apellidoPaterno: 'Pérez',
      apellidoMaterno: 'López',
      puesto: 'Contador',
      correo: 'ana@example.com',
      aceptaTerminos: true,
    });
    component.guardar();
    expect(close).toHaveBeenCalledOnce();
    expect(close).toHaveBeenCalledWith();
  });

  it('closes without saving when cancelled', () => {
    const fixture = TestBed.createComponent(UsuarioSecundarioDialog);
    fixture.detectChanges();
    const cancel: HTMLButtonElement = fixture.nativeElement.querySelector('.dialog-cancel');
    cancel.click();
    expect(close).toHaveBeenCalledOnce();
    expect(close).toHaveBeenCalledWith();
  });
});
