import { Component, inject } from '@angular/core';
import { NotificationService } from '../notification.service';
import { Notification } from '../notification/notification';

@Component({
  imports: [Notification],
  selector: 'app-notification-container',
  templateUrl: './notification-container.html',
  styleUrl: './notification-container.scss',
})
export class NotificationContainer {
  protected readonly notificationService = inject(NotificationService);
}
