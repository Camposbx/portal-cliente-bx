import { A11yModule } from '@angular/cdk/a11y';
import { Component, HostListener, input, output } from '@angular/core';

export interface ChatMessage {
  id: number;
  sender: 'executive' | 'client';
  text: string;
  time: string;
  day: string;
}

@Component({
  imports: [A11yModule],
  selector: 'app-document-chat',
  styleUrl: './document-chat.scss',
  templateUrl: './document-chat.html',
})
export class DocumentChat {
  readonly documentName = input.required<string>();
  readonly messages = input.required<ChatMessage[]>();
  readonly closed = output<void>();
  readonly messageSent = output<string>();

  protected draftMessage = '';

  protected onMessageInput(event: Event): void {
    this.draftMessage = (event.target as HTMLInputElement).value;
  }

  protected sendMessage(event: Event): void {
    event.preventDefault();
    const message = this.draftMessage.trim();
    if (!message) {
      return;
    }

    this.messageSent.emit(message);
    this.draftMessage = '';
  }

  protected close(): void {
    this.closed.emit();
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.close();
  }

  protected getCurrentTime(): string {
    return new Intl.DateTimeFormat('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date());
  }
}
