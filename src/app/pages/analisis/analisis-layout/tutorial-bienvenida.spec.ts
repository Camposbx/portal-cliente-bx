import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { provideRouter } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ANALISIS_TUTORIAL_STORAGE_KEY } from '../../../shared/analisis-tutorial';
import { AnalisisLayout } from './analisis-layout';

describe('Tutorial de Análisis y autorización', () => {
  const storageKey = ANALISIS_TUTORIAL_STORAGE_KEY;
  const previousStorageKey = 'analisis-tutorial-intro-completado';
  let fixture: ComponentFixture<AnalisisLayout>;
  let dialog: MatDialog;

  beforeEach(async () => {
    localStorage.removeItem(storageKey);
    localStorage.setItem(previousStorageKey, 'true');
    await TestBed.configureTestingModule({
      imports: [AnalisisLayout],
      providers: [provideRouter([])],
    }).compileComponents();
    dialog = TestBed.inject(MatDialog);
  });

  afterEach(() => {
    dialog.closeAll();
    localStorage.removeItem(storageKey);
    localStorage.removeItem(previousStorageKey);
  });

  it('recorre los pasos del tutorial, permite regresar y lo completa al final', async () => {
    fixture = TestBed.createComponent(AnalisisLayout);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(dialog.openDialogs).toHaveLength(1);
    expect(document.body.textContent).toContain('Te presentamos el módulo de');
    expect(document.body.textContent).toContain('Análisis y autorización');

    const bienvenidaCerrada = firstValueFrom(dialog.openDialogs[0].afterClosed());
    const nextButton = document.querySelector<HTMLButtonElement>('.tutorial-next');
    expect(nextButton).toBeTruthy();
    nextButton?.click();
    expect(await bienvenidaCerrada).toBe('next');
    await fixture.whenStable();
    expect(dialog.openDialogs).toHaveLength(1);
    expect(document.body.textContent).toContain('Acreditado');
    expect(document.body.textContent).toContain('1/4');
    const spotlight = document.querySelector<HTMLElement>('.analysis-tutorial-backdrop--spotlight');
    expect(spotlight?.style.getPropertyValue('--spot-width')).not.toBe('');

    const pasoAcreditadoCerrado = firstValueFrom(dialog.openDialogs[0].afterClosed());
    document.querySelector<HTMLButtonElement>('.tutorial-back')?.click();
    expect(await pasoAcreditadoCerrado).toBe('back');
    await fixture.whenStable();
    expect(document.body.textContent).toContain('Te presentamos el módulo de');

    const bienvenidaDeRegresoCerrada = firstValueFrom(dialog.openDialogs[0].afterClosed());
    document.querySelector<HTMLButtonElement>('.tutorial-next')?.click();
    expect(await bienvenidaDeRegresoCerrada).toBe('next');
    await fixture.whenStable();
    expect(document.body.textContent).toContain('Acreditado');

    const segundoPasoCerrado = firstValueFrom(dialog.openDialogs[0].afterClosed());
    const carpetas = document.createElement('div');
    carpetas.className = 'document-tabs';
    fixture.nativeElement.querySelector('main')?.append(carpetas);
    document.querySelector<HTMLButtonElement>('.tutorial-next')?.click();
    expect(await segundoPasoCerrado).toBe('next');
    await fixture.whenStable();
    expect(dialog.openDialogs).toHaveLength(1);
    expect(document.body.textContent).toContain('Carpetas');
    expect(document.body.textContent).toContain('2/4');
    const folderSpotlight = document.querySelector<HTMLElement>('.analysis-tutorial-backdrop--spotlight');
    expect(folderSpotlight?.style.getPropertyValue('--spot-width')).not.toBe('');

    const tercerPasoCerrado = firstValueFrom(dialog.openDialogs[0].afterClosed());
    document.querySelector<HTMLButtonElement>('.tutorial-back')?.click();
    expect(await tercerPasoCerrado).toBe('back');
    await fixture.whenStable();
    expect(document.body.textContent).toContain('Acreditado');

    const segundoPasoAlAvanzar = firstValueFrom(dialog.openDialogs[0].afterClosed());
    document.querySelector<HTMLButtonElement>('.tutorial-next')?.click();
    expect(await segundoPasoAlAvanzar).toBe('next');
    await fixture.whenStable();
    expect(document.body.textContent).toContain('Carpetas');

    const uploadArea = document.createElement('div');
    uploadArea.className = 'document-upload-area';
    fixture.nativeElement.querySelector('main')?.append(uploadArea);
    const cuartoPasoTrasRegresar = firstValueFrom(dialog.openDialogs[0].afterClosed());
    document.querySelector<HTMLButtonElement>('.tutorial-next')?.click();
    expect(await cuartoPasoTrasRegresar).toBe('next');
    await fixture.whenStable();
    expect(dialog.openDialogs).toHaveLength(1);
    expect(document.body.textContent).toContain('Carga de documentos');
    expect(document.body.textContent).toContain('3/4');
    const uploadSpotlight = document.querySelector<HTMLElement>('.analysis-tutorial-backdrop--spotlight');
    expect(uploadSpotlight?.style.getPropertyValue('--spot-width')).not.toBe('');

    const cuartoPasoCerrado = firstValueFrom(dialog.openDialogs[0].afterClosed());
    document.querySelector<HTMLButtonElement>('.tutorial-back')?.click();
    expect(await cuartoPasoCerrado).toBe('back');
    await fixture.whenStable();
    expect(document.body.textContent).toContain('Carpetas');

    const tercerPasoAlAvanzar = firstValueFrom(dialog.openDialogs[0].afterClosed());
    document.querySelector<HTMLButtonElement>('.tutorial-next')?.click();
    expect(await tercerPasoAlAvanzar).toBe('next');
    await fixture.whenStable();
    expect(document.body.textContent).toContain('Carga de documentos');

    const peopleCard = document.createElement('section');
    peopleCard.className = 'people-card';
    fixture.nativeElement.querySelector('aside')?.append(peopleCard);
    const cuartoPasoAlAvanzar = firstValueFrom(dialog.openDialogs[0].afterClosed());
    document.querySelector<HTMLButtonElement>('.tutorial-next')?.click();
    expect(await cuartoPasoAlAvanzar).toBe('next');
    await fixture.whenStable();
    expect(document.body.textContent).toContain('Registro de personas');
    expect(document.body.textContent).toContain('4/4');
    const peopleSpotlight = document.querySelector<HTMLElement>('.analysis-tutorial-backdrop--spotlight');
    expect(peopleSpotlight?.style.getPropertyValue('--spot-width')).not.toBe('');

    const ultimoPasoCerrado = firstValueFrom(dialog.openDialogs[0].afterClosed());
    document.querySelector<HTMLButtonElement>('.tutorial-back')?.click();
    expect(await ultimoPasoCerrado).toBe('back');
    await fixture.whenStable();
    expect(document.body.textContent).toContain('Carga de documentos');

    const pasoCargaReabierto = firstValueFrom(dialog.openDialogs[0].afterClosed());
    document.querySelector<HTMLButtonElement>('.tutorial-next')?.click();
    expect(await pasoCargaReabierto).toBe('next');
    await fixture.whenStable();
    expect(document.body.textContent).toContain('Registro de personas');

    const tutorialCompletado = firstValueFrom(dialog.openDialogs[0].afterClosed());
    document.querySelector<HTMLButtonElement>('.tutorial-next')?.click();
    expect(await tutorialCompletado).toBe('next');
    expect(localStorage.getItem(storageKey)).toBe('true');

    fixture.destroy();
    fixture = TestBed.createComponent(AnalisisLayout);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(dialog.openDialogs).toHaveLength(0);
  });
});
