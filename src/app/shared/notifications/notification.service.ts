import { Injectable, signal } from '@angular/core';
import { NotificationMessage, NotificationType } from './notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  readonly notifications = signal<NotificationMessage[]>([]);

  private nextId = 0;
  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();

  show(type: NotificationType, message: string, durationMs = 5000): number {
    const id = ++this.nextId;
    this.notifications.update((current) => [...current, { id, type, message }]);

    if (durationMs > 0) {
      this.timers.set(id, setTimeout(() => this.dismiss(id), durationMs));
    }

    return id;
  }

  error(message: string, durationMs = 5000): number {
    return this.show('error', message, durationMs);
  }

  warning(message: string, durationMs = 5000): number {
    return this.show('warning', message, durationMs);
  }

  success(message: string, durationMs = 5000): number {
    return this.show('success', message, durationMs);
  }

  info(message: string, durationMs = 5000): number {
    return this.show('info', message, durationMs);
  }

  dismiss(id: number): void {
    const timer = this.timers.get(id);

    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }

    this.notifications.update((current) => current.filter((notification) => notification.id !== id));
  }
}
