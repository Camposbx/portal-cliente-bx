import { TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { vi } from 'vitest';
import { ContrasenaDialog } from './contrasena-dialog';

describe('ContrasenaDialog', () => {
  const close = vi.fn();

  beforeEach(async () => {
    close.mockReset();
    await TestBed.configureTestingModule({
      imports: [ContrasenaDialog],
      providers: [{ provide: MatDialogRef, useValue: { close } }],
    }).compileComponents();
  });

  it('keeps save disabled until all password requirements are met', () => {
    const fixture = TestBed.createComponent(ContrasenaDialog);
    const form = fixture.componentInstance.passwordForm;
    fixture.detectChanges();
    const save: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');

    expect(save.disabled).toBe(true);
    form.patchValue({ currentPassword: 'actual', newPassword: 'password', confirmPassword: 'password' });
    fixture.detectChanges();
    expect(save.disabled).toBe(true);

    form.patchValue({ newPassword: 'Password1!', confirmPassword: 'distinta' });
    fixture.detectChanges();
    expect(form.controls.confirmPassword.hasError('mismatch')).toBe(true);
    expect(save.disabled).toBe(true);

    form.controls.confirmPassword.setValue('Password1!');
    fixture.detectChanges();
    expect(save.disabled).toBe(false);

    form.controls.newPassword.setValue('Password2!');
    fixture.detectChanges();
    expect(form.controls.confirmPassword.hasError('mismatch')).toBe(true);
    expect(save.disabled).toBe(true);
  });

  it('checks each requirement for the new password', () => {
    const fixture = TestBed.createComponent(ContrasenaDialog);
    const control = fixture.componentInstance.passwordForm.controls.newPassword;

    for (const value of ['Short1!', 'password1!', 'PASSWORD!', 'Password1', 'Password1é']) {
      control.setValue(value);
      expect(control.invalid).toBe(true);
    }
    control.setValue('Contraseña1!');
    expect(control.valid).toBe(true);
  });

  it('toggles each password field independently', () => {
    const fixture = TestBed.createComponent(ContrasenaDialog);
    fixture.detectChanges();
    const inputs: NodeListOf<HTMLInputElement> = fixture.nativeElement.querySelectorAll('input');
    const toggle: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[aria-label="Mostrar nueva contraseña"]',
    );

    toggle.click();
    fixture.detectChanges();

    expect(Array.from(inputs, (input) => input.type)).toEqual(['password', 'text', 'password']);
    expect(toggle.getAttribute('aria-label')).toBe('Ocultar nueva contraseña');
    expect(toggle.getAttribute('aria-pressed')).toBe('true');
  });

  it('closes on cancel without passing password values', () => {
    const fixture = TestBed.createComponent(ContrasenaDialog);
    fixture.detectChanges();
    const cancel: HTMLButtonElement = fixture.nativeElement.querySelector('.dialog-cancel');
    cancel.click();
    expect(close).toHaveBeenCalledOnce();
    expect(close).toHaveBeenCalledWith();
  });

  it('does not close an invalid form and closes a valid form without exposing passwords', () => {
    const fixture = TestBed.createComponent(ContrasenaDialog);
    const component = fixture.componentInstance;
    component.guardar();
    expect(close).not.toHaveBeenCalled();
    expect(component.passwordForm.touched).toBe(true);

    component.passwordForm.setValue({
      currentPassword: 'actual',
      newPassword: 'Password1!',
      confirmPassword: 'Password1!',
    });
    component.guardar();
    expect(close).toHaveBeenCalledOnce();
    expect(close).toHaveBeenCalledWith();
  });
});
