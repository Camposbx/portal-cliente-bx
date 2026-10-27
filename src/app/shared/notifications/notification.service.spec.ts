import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  it('should add notifications for each supported type and dismiss them', () => {
    const errorId = service.error('Error', 0);
    const warningId = service.warning('Advertencia', 0);
    const successId = service.success('Correcto', 0);
    const infoId = service.info('Información', 0);

    expect(service.notifications().map(({ type }) => type)).toEqual([
      'error',
      'warning',
      'success',
      'info',
    ]);

    service.dismiss(warningId);

    expect(service.notifications().map(({ id }) => id)).toEqual([errorId, successId, infoId]);
  });
});
