import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NotificationMessage } from '../notification.model';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.html',
  styleUrl: './notification.scss',
})
export class Notification {
  @Input({ required: true }) notification!: NotificationMessage;
  @Output() readonly dismiss = new EventEmitter<number>();
}
