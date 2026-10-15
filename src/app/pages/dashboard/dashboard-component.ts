import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  styleUrl: './dashboard-component.scss',
  templateUrl: './dashboard-component.html',
})
export class Dashboard {
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
