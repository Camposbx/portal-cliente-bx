import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-dashboard',
  styleUrl: './dashboard-component.scss',
  templateUrl: './dashboard-component.html',
})
export class Dashboard {
  protected readonly modules = [
    {
      number: 1,
      title: 'Análisis y autorización',
      description:
        'Aquí puedes integrar el expediente para el análisis y autorización del crédito.',
      image: '/baners/card-analisis.png',
      route: '/analisis',
      disabled: false,
      progress: 0,
    },
    {
      number: 2,
      title: 'Contratación',
      description:
        'Aquí puedes integrar el expediente para la contratación del crédito.',
      image: '/baners/card-contratacion.png',
      route: '/contratacion',
      disabled: true,
      progress: 0,
    },
    {
      number: 3,
      title: 'Operación',
      description: 'Aquí puedes solicitar tus documentos para operar.',
      image: '/baners/card-operacion.png',
      route: '/operacion',
      disabled: false,
      progress: 0,
    },
  ];

  protected readonly banners = [
    {
      src: '/baners/Banner.png',
      alt: 'Oficina Digital de Crédito BX+. Consulta y da seguimiento a tu crédito empresarial desde un solo lugar.',
    },
  ];

  protected currentBannerIndex = 0;

  protected get currentBanner() {
    return this.banners[this.currentBannerIndex];
  }

  protected showBanner(index: number): void {
    this.currentBannerIndex = index;
  }

  protected showPreviousBanner(): void {
    this.currentBannerIndex =
      (this.currentBannerIndex - 1 + this.banners.length) % this.banners.length;
  }

  protected showNextBanner(): void {
    this.currentBannerIndex = (this.currentBannerIndex + 1) % this.banners.length;
  }
}
