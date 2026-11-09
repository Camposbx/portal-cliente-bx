import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { vi } from 'vitest';
import { ContactoDialog } from './contacto-dialog';

describe('ContactoDialog', () => {
  it('closes without saving when the close button is clicked', async () => {
    const close = vi.fn();
    await TestBed.configureTestingModule({
      imports: [ContactoDialog],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { type: 'email', mode: 'add' } },
        { provide: MatDialogRef, useValue: { close } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(ContactoDialog);
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.dialog-close');
    expect(getComputedStyle(button).zIndex).toBe('1');
    button.click();

    expect(close).toHaveBeenCalledOnce();
    expect(close).toHaveBeenCalledWith();
  });
});
