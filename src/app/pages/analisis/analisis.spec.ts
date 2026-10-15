import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AnalisisLayout } from './layouts/analisis-layout/analisis-layout';

describe('AnalisisLayout', () => {
  let component: AnalisisLayout;
  let fixture: ComponentFixture<AnalisisLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalisisLayout],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalisisLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a child route outlet', () => {
    expect(fixture.nativeElement.querySelector('router-outlet')).toBeTruthy();
  });
});
