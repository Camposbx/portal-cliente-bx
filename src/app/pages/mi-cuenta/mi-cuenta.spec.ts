import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { vi } from 'vitest';
import { ContrasenaDialog } from './contrasena-dialog';
import { MiCuenta } from './mi-cuenta';
import { UsuarioSecundarioDialog } from './usuario-secundario-dialog';

describe('MiCuenta password dialog', () => {
  it('opens the dialog from the change-password button', async () => {
    const open = vi.fn();
    await TestBed.configureTestingModule({
      imports: [MiCuenta],
      providers: [{ provide: MatDialog, useValue: { open } }],
    }).compileComponents();

    const fixture = TestBed.createComponent(MiCuenta);
    fixture.detectChanges();
    const section: HTMLElement = fixture.nativeElement.querySelector('[aria-labelledby="password-title"]');
    section.querySelector('button')?.click();

    expect(open).toHaveBeenCalledWith(
      ContrasenaDialog,
      expect.objectContaining({ ariaLabelledBy: 'password-dialog-title', width: '456px' }),
    );
  });
});

describe('MiCuenta secondary user dialog', () => {
  it('opens the same dialog from both invitation buttons', async () => {
    const open = vi.fn();
    await TestBed.configureTestingModule({
      imports: [MiCuenta],
      providers: [{ provide: MatDialog, useValue: { open } }],
    }).compileComponents();

    const fixture = TestBed.createComponent(MiCuenta);
    fixture.detectChanges();
    const page: HTMLElement = fixture.nativeElement;
    page.querySelector<HTMLButtonElement>('[aria-labelledby="secondary-capacity-title"] button')?.click();
    page.querySelector<HTMLButtonElement>('[aria-labelledby="users-title"] .section-heading button')?.click();

    expect(open).toHaveBeenCalledTimes(2);
    expect(open).toHaveBeenCalledWith(
      UsuarioSecundarioDialog,
      expect.objectContaining({ ariaLabelledBy: 'secondary-user-dialog-title', width: '720px' }),
    );
  });
});
