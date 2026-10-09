import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiEjecutivo } from './mi-ejecutivo';

describe('MiEjecutivo', () => {
  let component: MiEjecutivo;
  let fixture: ComponentFixture<MiEjecutivo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiEjecutivo],
    }).compileComponents();

    fixture = TestBed.createComponent(MiEjecutivo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
