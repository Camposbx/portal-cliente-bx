export type NotificationType = 'error' | 'warning' | 'success' | 'info';

export interface NotificationMessage {
  id: number;
  type: NotificationType;
  message: string;
}
