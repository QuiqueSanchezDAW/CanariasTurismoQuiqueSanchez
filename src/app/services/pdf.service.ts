import { Injectable } from '@angular/core';
import { PdfMakeWrapper, Table, Txt } from 'pdfmake-wrapper';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Sitio } from './sitios.service';

PdfMakeWrapper.setFonts(pdfFonts as any);

@Injectable({
    providedIn: 'root'
})
export class PdfService {

    async generateLocationsPdf(sitios: Sitio[]) {
        console.log('Generando PDF para', sitios.length, 'sitios');
        const pdf = new PdfMakeWrapper();

        pdf.add(
            new Txt('Informe de Localizaciones')
            .bold()
            .fontSize(16)
            .margin([0, 0, 0, 20])
            .alignment('center')
            .end
        );

        const tableBody = [
            [
                { text: 'Nombre', style: 'tableHeader' },
                { text: 'Descripción', style: 'tableHeader' },
                { text: 'Ubicación', style: 'tableHeader' },
                { text: 'Puntuación', style: 'tableHeader' }
            ],
            ...sitios.map(sitio => {
                const row = [
                    sitio.name || '',
                    sitio.description || '',
                    sitio.location || '',
                    this.getAverageRating(sitio.rating) || ''
                ];
                return row;
            })
        ];

        pdf.add(
            new Table(tableBody)
            .layout('lightHorizontalLines')
            .end
        );

        pdf.styles({
            tableHeader: {
                bold: true,
                fontSize: 12,
                color: 'black'
            }
        });

        pdf.pageSize('A4');
        pdf.pageMargins([40, 60, 40, 60]);

        pdf.create().download('localizaciones.pdf');
    }

    private getAverageRating(ratings: number[]): string {
        if (ratings.length === 0) return '0.0';
        const average = ratings.reduce((a, b) => a + b, 0) / ratings.length;
        return average.toFixed(1);
    }
}