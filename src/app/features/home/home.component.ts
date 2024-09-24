import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {DividerModule} from 'primeng/divider';
import {NgClass, UpperCasePipe} from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    DividerModule,
    NgClass,
    RouterLink,
    UpperCasePipe
  ]
})
export class HomeComponent {

  carouselSlides = {image: "quienes-somos.webp", alt: "Qué hacemos", link: "/asociacion/quienes-somos"};

  protected formButtons: { subtitle: string; link: string; description: string; title: string; imgSrc: string }[] = [
    {
      link: '/colaboraciones',
      imgSrc: 'assets/home/colaboraciones.png',
      title: 'Colaboraciones',
      subtitle: 'Ser Solidaria',
      description: 'Para realizar alguna actividad conjunta, escríbenos aquí'
    },
    {
      link: '/donaciones',
      imgSrc: 'assets/home/donaciones.png',
      title: 'Donaciones',
      subtitle: 'Ser Amiga',
      description: 'Si deseas hacer alguna aportación, este es tu portal'
    },
    {
      link: '/ser-scout',
      imgSrc: 'assets/home/ser-scout.png',
      title: 'Preinscripciones',
      subtitle: 'Ser Scout',
      description: 'Si quieres ser Scout entra aquí'
    },
    {
      link: '/ser-scouter',
      imgSrc: 'assets/home/ser-scouter.png',
      title: 'Voluntariado',
      subtitle: 'Ser Scouter',
      description: '¿Quieres hacer voluntariado? ¡Este es tu sitio!'
    },
    {
      link: '/seccion-senior',
      imgSrc: 'assets/home/senior.png',
      title: 'Sección Senior',
      subtitle: 'Siempre Scout',
      description: 'Para continuar siendo parte activa del grupo, únete aquí'
    }
  ];

  protected infoButtons: { link: string; description: string; title: string; imgSrc: string, target?: string }[] = [
    {
      link: '/transparencia',
      imgSrc: 'assets/home/transparencia.png',
      title: 'Transparencia',
      description: 'Accede aquí a nuestro portal de transparencia'
    },
    {
      link: '/assets/archivos/codigo-etico-scouts-de-españa.pdf',
      target: '_blank',
      imgSrc: 'assets/home/etica.png',
      title: 'Ética',
      description: 'Lea el código ético de Scouts de España, al que nosotros nos acogemos como asociación perteneciente'
    },
    {
      link: '/centros-scout/informacion',
      imgSrc: 'assets/home/centros-scout.png',
      title: 'Centros Scout',
      description: 'Un hogar en la naturaleza. Haz tu reserva aquí'
    },
    {
      link: '/igualdad',
      imgSrc: 'assets/home/igualdad.png',
      title: 'Igualdad',
      description: 'Este es nuestro portal de Igualdad'
    },
    {
      link: '/calidad',
      imgSrc: 'assets/home/calidad.png',
      title: 'Calidad',
      description: 'Protección, buen gobierno y buen trato'
    },
  ];
}
