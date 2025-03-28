import {Component, inject, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {DividerModule} from 'primeng/divider';
import {UpperCasePipe} from '@angular/common';
import {GalleriaModule} from "primeng/galleria";
import {ScoutCenterService} from "../scout-center/scout-center.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    DividerModule,
    RouterLink,
    UpperCasePipe,
    GalleriaModule
  ]
})
export class HomeComponent implements OnInit {

  protected readonly formButtons: {
    subtitle: string;
    link: string;
    description: string;
    title: string;
    imgSrc: string
  }[] = [
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

  protected readonly groupStrips: { stripClass: string; text: string; svg: string }[] = [
    {stripClass: "strip-lis", text: "Vida en Pequeños Grupos", svg: "assets/home/lis.svg"},
    {stripClass: "strip-hands", text: "Educación en Valores", svg: "assets/home/hand-greeting.svg"},
    {stripClass: "strip-salute", text: "Aprender Jugando", svg: "assets/home/salute.svg"},
    {stripClass: "strip-tent", text: "Actividades al Aire Libre", svg: "assets/home/tent.svg"}
  ];

  protected readonly cards: { id: string; title: string; description: string; link: string; target?: string }[] = [
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


  protected scoutCenterImages: { src: string; alt: string }[] = [];

  private readonly scoutCenterService = inject(ScoutCenterService);

  ngOnInit() {
    this.scoutCenterService.getAllInformation().subscribe(result =>
      this.scoutCenterImages = result
        .filter(center => center.mainPhoto)
        .map(center => ({
          src: this.scoutCenterService.getPhotoUrl(center.mainPhoto!.uuid!),
          alt: center.name
        }))
    );
  }
}
