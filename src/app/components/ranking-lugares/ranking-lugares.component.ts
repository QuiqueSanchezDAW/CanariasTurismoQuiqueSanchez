import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { SitiosService, Sitio } from '../../services/sitios.service';

@Component({
  selector: 'app-ranking-lugares',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule],
  templateUrl: './ranking-lugares.component.html',
  styleUrls: ['./ranking-lugares.component.scss']
})
export class RankingLugaresComponent implements OnInit {
[x: string]: any;
  lugaresMejorValorados: Sitio[] = [];

  constructor(private sitiosService: SitiosService) { }

  ngOnInit(): void {
    this.sitiosService.getSitios().subscribe(sitios => {
      this.lugaresMejorValorados = this.getLugaresMejorValorados(sitios);
    });
  }

  getLugaresMejorValorados(sitios: Sitio[]): Sitio[] {
    return sitios
      .filter(sitio => sitio.rating.length > 0)
      .sort((a, b) => this.getAverageRating(b.rating) - this.getAverageRating(a.rating))
      .slice(0, 5);
  }

  getAverageRating(ratings: number[]): number {
    return ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
  }  
}