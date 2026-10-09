import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Operacion } from './operacion';

describe('Operacion', () => {
  let component: Operacion;
  let fixture: ComponentFixture<Operacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Operacion],
    }).compileComponents();

    fixture = TestBed.createComponent(Operacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
