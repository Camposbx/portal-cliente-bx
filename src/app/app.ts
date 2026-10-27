import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationContainer } from './shared/notifications/notification-container/notification-container';

@Component({
  imports: [NotificationContainer, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {}
