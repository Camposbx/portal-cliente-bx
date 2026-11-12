import { A11yModule } from '@angular/cdk/a11y';
import { Component, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

interface NotificationItem {
  id: number;
  title: string;
  tiempo: string;
  description: string;
  persona: string;
}

@Component({
  imports: [A11yModule, RouterLink, RouterLinkActive, RouterOutlet],
  selector: 'app-layout',
  styleUrl: './layout.scss',
  templateUrl: './layout.html',
})
export class Layout {
  protected notificationsOpen = false;

  protected readonly newNotifications: NotificationItem[] = [
    {
      id: 1,
      title: 'título de la notificación ',
      tiempo: 'tiempo de la notificación',
      description: 'texto de la notificación',
      persona: 'personas o solicitante',
    },
    {
      id: 2,
      title: 'título de la notificación',
      tiempo: 'tiempo de la notificación',
      description: 'texto de la notificación',
      persona: 'personas o solicitante',
    },
  ];

  protected readonly previousNotifications: NotificationItem[] = [];

  constructor(private readonly router: Router) {}

  protected readonly navigation = [
    { label: 'Inicio', path: '/inicio', icon: 'icons/home.svg' },
    { label: 'Análisis', path: '/analisis', icon: 'icons/document_search.svg' },
/*     { label: 'Contratación', path: '/contratacion', icon: 'icons/documet_check.svg' },
    { label: 'Operación', path: '/operacion', icon: 'icons/folder.svg' }, */
    { label: 'Mi ejecutivo', path: '/mi-ejecutivo', icon: 'icons/document_edit.svg' },
    { label: 'Ayuda', path: '/ayuda', icon: 'icons/question.svg' },
  ];

  protected openNotifications(): void {
    this.notificationsOpen = true;
  }

  protected closeNotifications(): void {
    this.notificationsOpen = false;
  }

  protected dismissNotification(notification: NotificationItem, isPrevious: boolean): void {
    const notifications = isPrevious ? this.previousNotifications : this.newNotifications;
    const index = notifications.indexOf(notification);
    if (index !== -1) {
      notifications.splice(index, 1);
    }
  }

  protected openNotification(): void {
    this.closeNotifications();
    void this.router.navigateByUrl('/analisis/documentos');
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.closeNotifications();
  }
}
