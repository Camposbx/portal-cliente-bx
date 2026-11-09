import { DOCUMENT, isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ANALISIS_TUTORIAL_STORAGE_KEY } from '../../../shared/analisis-tutorial';
import { PersonaInvolucrada, PersonasInvolucradasService } from '../personas-involucradas.service';
import { TutorialBienvenida, TutorialBienvenidaData } from './tutorial-bienvenida';
import { MessageDialogService } from '../../../shared/dialogs/message-dialog.service';

interface PersonaArbolVisual extends PersonaInvolucrada {
  hijos: PersonaArbolVisual[];
}

@Component({
  imports: [MatButtonModule, MatDialogModule, MatIconModule, NgTemplateOutlet, RouterLink, RouterOutlet],
  selector: 'app-analisis-layout',
  styleUrl: './analisis-layout.scss',
  templateUrl: './analisis-layout.html',
})
export class AnalisisLayout implements OnInit {
  private readonly personasService = inject(PersonasInvolucradasService);
  private readonly dialog = inject(MatDialog);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  readonly nombreSolicitante = this.personasService.nombreSolicitante;
  readonly personas = this.personasService.personas;
  readonly arbolPersonas = computed(() => {
    const nodos = new Map<number, PersonaArbolVisual>(
      this.personas().map((persona) => [
        persona.id,
        { ...persona, hijos: [] },
      ]),
    );
    const raices: PersonaArbolVisual[] = [];

    for (const nodo of nodos.values()) {
      const padre = nodo.vinculadaConId === undefined ? undefined : nodos.get(nodo.vinculadaConId);
      if (padre) padre.hijos.push(nodo);
      else raices.push(nodo);
    }
    const ordenar = (personas: PersonaArbolVisual[]): void => {
      personas.sort((a, b) => (a.nivel ?? 0) - (b.nivel ?? 0));
      for (const persona of personas) ordenar(persona.hijos);
    };
    ordenar(raices);
    return raices;
  });
  readonly selectedName = this.personasService.selectedName;
  readonly selectedPersonaId = this.personasService.selectedPersonaId;
  private readonly messageDialog = inject(MessageDialogService);

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const storage = this.document.defaultView?.localStorage;
    if (!storage || storage.getItem(ANALISIS_TUTORIAL_STORAGE_KEY)) return;

    this.abrirTutorial(1);
/* 
    this.messageDialog.open({
      type: 'success',
      title: 'Invitación enviada',
      message: 'La invitación está pendiente.',
      confirmText: 'Entendido',
    }).subscribe();

    this.messageDialog.open({
      type: 'question',
      title: '¿Eliminar este teléfono?',
      message: `Vas a quitar «». Podrás volver a agregarlo cuando quieras.`,
      confirmText: 'Eliminar teléfono',
      cancelText: 'Cancelar',
    }).subscribe((aceptado) => {
      if (!aceptado) return;

    });

    this.messageDialog.open({
      type: 'warning',
      title: '¿Salir sin guardar?',
      message: 'Los cambios que hiciste se perderán.',
      confirmText: 'Salir',
      cancelText: 'Seguir editando',
    }).subscribe((aceptado) => {
      if (!aceptado) return;

      // Navegar o salir del formulario.
    });

    this.messageDialog.open({
      type: 'error',
      title: 'No se pudo completar la operación',
      message: 'Ocurrió un problema. Inténtalo nuevamente.',
      confirmText: 'Entendido',
    }).subscribe();

    this.messageDialog.open({
      type: 'info',
      title: 'Invitación pendiente',
      message: 'La invitación aparecerá como pendiente hasta que la persona ingrese.',
      confirmText: 'De acuerdo',
    }).subscribe();
 */
  }

  private abrirTutorial(step: TutorialBienvenidaData['step']): void {
    const dialogRef = this.dialog.open(TutorialBienvenida, {
      ariaLabelledBy: 'analysis-tutorial-title',
      backdropClass: step === 1
        ? 'analysis-tutorial-backdrop'
        : ['analysis-tutorial-backdrop', 'analysis-tutorial-backdrop--spotlight'],
      data: { step },
      disableClose: true,
      maxWidth: 'calc(100vw - 32px)',
      panelClass: [
        'analysis-tutorial-panel',
        ...(step === 4 ? ['analysis-tutorial-panel--step-4'] : []),
      ],
      width: step === 1 ? '440px' : step === 4 ? '320px' : '360px',
    });
    dialogRef.afterClosed().subscribe((action) => {
      if (step === 1 && action === 'next') {
        this.abrirTutorial(2);
      } else if (step === 2 && action === 'back') {
        this.abrirTutorial(1);
      } else if (step === 2 && action === 'next') {
        this.abrirTutorial(3);
      } else if (step === 3 && action === 'back') {
        this.abrirTutorial(2);
      } else if (step === 3 && action === 'next') {
        this.abrirTutorial(4);
      } else if (step === 4 && action === 'back') {
        this.abrirTutorial(3);
      } else if (step === 4 && action === 'next') {
        this.abrirTutorial(5);
      } else if (step === 5 && action === 'back') {
        this.abrirTutorial(4);
      } else if (step === 5 && action === 'next') {
        this.document.defaultView?.localStorage.setItem(ANALISIS_TUTORIAL_STORAGE_KEY, 'true');
      }
    });
  }

  seleccionarSolicitante(): void {
    this.personasService.seleccionarSolicitante();
  }

  seleccionarPersona(persona: PersonaInvolucrada): void {
    this.personasService.seleccionarPersona(persona.nombre, persona.id);
  }

  etiquetaRoles(roles: string[]): string {
    const etiquetas: Record<string, string> = {
      aval: 'Aval (AV)',
      apoderado: 'Apoderado Legal (AL)',
      accionista: 'Accionista (AC)',
      garante: 'Garante (GA)',
      depositario: 'Depositario legal (DL)',
    };

    return roles.map((rol) => etiquetas[rol] ?? rol).join(', ');
  }

}
