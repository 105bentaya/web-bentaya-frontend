import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {DividerModule} from 'primeng/divider';
import {NgClass, NgOptimizedImage, UpperCasePipe} from '@angular/common';
import {GalleriaModule} from "primeng/galleria";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    DividerModule,
    NgClass,
    RouterLink,
    UpperCasePipe,
    GalleriaModule,
    NgOptimizedImage
  ]
})
export class HomeComponent {

  protected images: {src: string; alt: string}[] = [
    {
      src: "/assets/centros-scout/palmital/menu.png",
      alt: "Aula de la Naturaleza El Palmital"
    },
    {
      src: "/assets/centros-scout/terreno/menu.jpg",
      alt: "Campamento Bentaya"
    },
    {
      src: "/assets/centros-scout/refugio/menu.jpg",
      alt: "Refugio Luis Martín"
    },
    {
      src: "/assets/centros-scout/tejeda/menu.jpg",
      alt: "Refugio Bentayga"
    }
  ];

  protected formButtons: { subtitle: string; link: string; description: string; title: string; imgSrc: string }[] = [
    {
      link: '/colaboraciones',
      imgSrc: 'assets/home/forms/colaboraciones.jpg',
      title: 'Colaboraciones',
      subtitle: 'Ser Solidaria',
      description: 'Para realizar alguna actividad conjunta, escríbenos aquí'
    },
    {
      link: '/donaciones',
      imgSrc: 'assets/home/forms/donaciones.jpg',
      title: 'Donaciones',
      subtitle: 'Ser Amiga',
      description: 'Si deseas hacer alguna aportación, este es tu portal'
    },
    {
      link: '/ser-scout',
      imgSrc: 'assets/home/forms/ser-scout.jpg',
      title: 'Preinscripciones',
      subtitle: 'Ser Scout',
      description: 'Si quieres ser Scout entra aquí'
    },
    {
      link: '/ser-scouter',
      imgSrc: 'assets/home/forms/voluntariado.jpg',
      title: 'Voluntariado',
      subtitle: 'Ser Scouter',
      description: '¿Quieres hacer voluntariado? ¡Este es tu sitio!'
    },
    {
      link: '/seccion-senior',
      imgSrc: 'assets/home/forms/siempre-scout.jpg',
      title: 'Sección Senior',
      subtitle: 'Siempre Scout',
      description: 'Para continuar siendo parte activa del grupo, únete aquí'
    }
  ];

  protected  cards: { id: string; title: string; description: string; link: string; target?: string }[] = [
    {
      id: '01',
      title: 'Transparencia',
      description: 'Accede aquí a nuestro portal de transparencia.',
      link: '/transparencia',
    },
    {
      id: '02',
      title: 'Ética Scout',
      description: 'Lee el código ético de Scouts de España, al que nosotros nos acogemos como asociación perteneciente.',
      link: '/assets/archivos/codigo-etico-scouts-de-españa.pdf',
      target: '_blank',
    },
    {
      id: '03',
      title: 'Centros Scout',
      description: '¿Piensas en educación al aire libre? Reserva uno de nuestros centros scout.',
      link: '/centros-scout/informacion',
    },
    {
      id: '04',
      title: 'Igualdad',
      description: 'En nuestro portal de igualdad podrás encontrar nuestros planes y protocolos.',
      link: '/igualdad',
    },
    {
      id: '05',
      title: 'Calidad',
      description: 'Protección, buen gobierno y buen trato, ese es nuestro mayor compromiso.',
      link: '/calidad',
    }
  ];
}
