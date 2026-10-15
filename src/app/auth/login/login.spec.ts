import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let router: Router;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    dialog = TestBed.inject(MatDialog);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open the portal acceptance dialog when ingresar is called', () => {
    const dialogSpy = vi.spyOn(dialog, 'open');

    component.ingresar();

    expect(dialogSpy).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        backdropClass: 'modal-portal-uso-backdrop',
        panelClass: 'modal-portal-uso',
      }),
    );
  });

  it('should navigate to inicio after the acceptance dialog is accepted', async () => {
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.ingresar();

    const dialogRef = dialog.openDialogs[0];
    const closed = firstValueFrom(dialogRef.afterClosed());
    dialogRef.close(true);
    await closed;

    expect(navigateSpy).toHaveBeenCalledWith(['/inicio']);
  });

  it('should not navigate to inicio when the acceptance dialog is cancelled', async () => {
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.ingresar();

    const dialogRef = dialog.openDialogs[0];
    const closed = firstValueFrom(dialogRef.afterClosed());
    dialogRef.close(false);
    await closed;

    expect(navigateSpy).not.toHaveBeenCalled();
  });
});
