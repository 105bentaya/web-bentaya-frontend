import {Component} from '@angular/core';
import {ChartModule} from 'primeng/chart';
import {BasicLoadingInfoComponent} from "../../../../shared/components/basic-loading-info/basic-loading-info.component";
import {RouterLink} from "@angular/router";
import {Tab, TabList, TabPanel, TabPanels, Tabs} from "primeng/tabs";

@Component({
  selector: 'app-gestion-economica',
  templateUrl: './gestion-economica.component.html',
  styleUrls: ['./gestion-economica.component.scss'],
  imports: [
    ChartModule,
    BasicLoadingInfoComponent,
    RouterLink,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel
  ]
})
export class GestionEconomicaComponent {

  protected data: {
    year: number,
    inData: { data: any, options: any },
    outData: { data: any, options: any },
    file: string
  }[] = [
    {
      year: 2022,
      inData: {
        data: this.generateInData([103870.52, 44773.83, 21836, 77983.87, 2535]),
        options: this.generateOptions("250.999,22€", true)
      },
      outData: {
        data: this.generateOutData([164565.31, 494.16, 1622.72, 2705.36]),
        options: this.generateOptions("169.387,55€", false)
      },
      file: "Cuentas_Anuales_UP_21-22_Scouts_105_Bentaya.pdf",
    },
    {
      year: 2021,
      inData: {
        data: this.generateInData([49866.16, 9248.08, 24241, 30293.18, 2250]),
        options: this.generateOptions("115.898,42€", true)
      },
      outData: {
        data: this.generateOutData([149789.79, 176.40, 1622.72, 2322.17]),
        options: this.generateOptions("153.911,08€", false)
      },
      file: "Cuentas_Anuales_UP_20-21_Scouts_105_Bentaya.pdf"
    }
  ];

  private generateOptions(total: string, isIncome: boolean) {
    return {
      locale: "es",
      plugins: {
        title: {
          display: true,
          text: isIncome ? 'INGRESOS' : 'GASTOS',
        },
        subtitle: {
          display: true,
          text: total,
        },
        legend: {
          position: "bottom",
          align: "start"
        },
        tooltip: {
          callbacks: {
            label: (context: any) => context.formattedValue + '€'
          }
        }
      }
    };
  }

  private generateInData(numbers: number[]): { labels: string[], datasets: [{ data: number[] }] } {
    return {
      labels: [
        'Cuotas',
        'Aportaciones',
        'Promociones, patrocinios y colaboraciones',
        'Subvenciones',
        'Donaciones y legados'
      ],
      datasets: [{
        data: numbers
      }]
    };
  }

  private generateOutData(numbers: number[]): { labels: string[], datasets: [{ data: number[] }] } {
    return {
      labels: [
        'Gastos de explotación',
        'Gastos del órgano de gobierno',
        'Amortización inmovilizado',
        'Gastos financieros'
      ],
      datasets: [{
        data: numbers
      }]
    };
  }
}
