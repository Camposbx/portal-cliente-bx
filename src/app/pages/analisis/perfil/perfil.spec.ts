import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Perfil } from './perfil';

describe('Perfil', () => {
  let fixture: ComponentFixture<Perfil>;
  let component: Perfil;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Perfil],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Perfil);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('initializes text fields in uppercase and keeps the email unchanged', () => {
    expect(component.profileForm.controls.razonSocial.value).toBe('EL PATITO SA DE CV');
    expect(component.profileForm.controls.nombre1.value).toBe('JUAN');
    expect(component.profileForm.controls.curp.value).toBe('PEGJ870344HDFRRN08');
    expect(component.profileForm.controls.calle.value).toBe('ALLENDE');
    expect(component.profileForm.controls.correo.value).toBe('info@altamiracapital.com');
  });

  it('stores edited text fields in uppercase without changing email casing', () => {
    component.editar();
    component.profileForm.controls.nombre1.setValue('maría josé');
    component.profileForm.controls.correo.setValue('Maria.Jose@Example.mx');

    expect(component.profileForm.controls.nombre1.value).toBe('MARÍA JOSÉ');
    expect(component.profileForm.controls.correo.value).toBe('Maria.Jose@Example.mx');
  });
});
