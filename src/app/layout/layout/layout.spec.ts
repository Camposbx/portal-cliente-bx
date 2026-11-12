import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Layout } from './layout';

describe('Layout', () => {
  let component: Layout;
  let fixture: ComponentFixture<Layout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Layout],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Layout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('opens the notification drawer from the bell button and closes it from the close button', () => {
    fixture.detectChanges();

    const notificationButton: HTMLButtonElement =
      fixture.nativeElement.querySelector('.notification-button');
    notificationButton.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('.notification-item')).toHaveLength(2);

    const closeButton: HTMLButtonElement =
      fixture.nativeElement.querySelector('.notification-close');
    closeButton.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeNull();
  });

  it('dismisses a notification without closing the drawer', () => {
    fixture.detectChanges();
    const notificationButton: HTMLButtonElement =
      fixture.nativeElement.querySelector('.notification-button');
    notificationButton.click();
    fixture.detectChanges();

    const dismissButton: HTMLButtonElement =
      fixture.nativeElement.querySelector('.notification-dismiss');
    dismissButton.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.notification-item')).toHaveLength(1);
    expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeTruthy();
  });
});
