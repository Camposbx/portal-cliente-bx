import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { vi } from 'vitest';
import { ContrasenaDialog } from './contrasena-dialog';
import { MiCuenta } from './mi-cuenta';

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
