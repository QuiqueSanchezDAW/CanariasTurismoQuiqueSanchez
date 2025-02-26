import { Component, OnInit } from '@angular/core';
import { SitiosService, Sitio } from '../services/sitios.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { NavbarComponent } from "../components/navbar/navbar.component";
import { PdfService } from '../services/pdf.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  imports: [MatCardModule, MatButtonModule, CommonModule, FormsModule, NavbarComponent]
})
export class AdminComponent implements OnInit {
  newSite: Sitio = {
    id: '',
    name: '',
    description: '',
    location: '',
    imageUrl: '',
    parrafo1: '',
    parrafo2: '',
    imageGallery: [],
    rating: [],
    comments: [],
    commentUser: []
  };

  sitios: Sitio[] = [];

  constructor(
    private sitiosService: SitiosService,
    private snackBar: MatSnackBar,
    private pdfService: PdfService
  ) {}

  ngOnInit() {
    this.loadSitios();
  }

  addNewSite(): void {
    if (this.newSite.name && this.newSite.description && this.newSite.location && this.newSite.imageUrl && this.newSite.parrafo1 && this.newSite.parrafo2) {
      const newSiteWithId = {
        ...this.newSite,
        id: uuidv4()
      };
      this.sitiosService.addNewSite(newSiteWithId).subscribe(
        (response) => {
          this.snackBar.open('Sitio añadido con éxito', 'Cerrar', { duration: 3000 });
          this.loadSitios();
          this.resetForm();
        },
        (error) => {
          this.snackBar.open('Error al añadir el sitio', 'Cerrar', { duration: 3000 });
        }
      );
    } else {
      this.snackBar.open('Por favor, completa todos los campos.', 'Cerrar', { duration: 3000 });
    }
  }

  loadSitios(): void {
    this.sitiosService.getSitios().subscribe(sitios => {
      this.sitios = sitios;
      console.log('Sitios cargados:', this.sitios);
    });
  }

  resetForm(): void {
    this.newSite = {
      id: '',
      name: '',
      description: '',
      location: '',
      imageUrl: '',
      parrafo1: '',
      parrafo2: '',
      imageGallery: [],
      rating: [],
      comments: [],
      commentUser: []
    };
  }

  deleteSite(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar este sitio?')) {
      this.sitiosService.deleteSite(id).subscribe(
        () => {
          this.snackBar.open('Sitio eliminado con éxito', 'Cerrar', { duration: 3000 });
          this.loadSitios();
        },
        (error) => {
          this.snackBar.open('Error al eliminar el sitio', 'Cerrar', { duration: 3000 });
        }
      );
    }
  }

  generatePdf() {
    if (this.sitios.length > 0) {
      this.pdfService.generateLocationsPdf(this.sitios);
    } else {
      this.snackBar.open('No hay sitios para generar el PDF', 'Cerrar', { duration: 3000 });
    }
  }
}