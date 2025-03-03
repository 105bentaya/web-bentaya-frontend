import {Component} from '@angular/core';
import {PanelModule} from "primeng/panel";
import {Divider} from "primeng/divider";

@Component({
  selector: 'app-asociacion',
  imports: [
    PanelModule,
    Divider
  ],
  templateUrl: './asociacion.component.html',
  styleUrl: './asociacion.component.scss'
})
export class AsociacionComponent {

  protected scoutGroups: {src: string; name: string; link: string; color: string}[] = [
    {
      src: "",
      name: "COLONIA",
      link: "",
      color: "#4AD1EE"
    },
    {
      src: "",
      name: "MANADAS",
      link: "",
      color: "#EFD134"
    },
    {
      src: "",
      name: "TROPAS",
      link: "",
      color: "#29CA4D"
    },
    {
      src: "",
      name: "UNIDAD",
      link: "",
      color: "#8C5D32"
    },
    {
      src: "",
      name: "CLAN",
      link: "",
      color: "#DA1B1B"
    },
    {
      src: "",
      name: "KRAAL",
      link: "",
      color: "#8135c8"
    }
  ];

  protected scoutMethodItems = [
    {
      label: 'Educación en Valores',
      info: 'Los niños, niñas y jóvenes asumen un compromiso personal que trasciende lo individual, abrazando responsabilidades ' +
        'sociales, éticas y personales. Este compromiso se sintetiza en la Promesa y la Ley Scout, pilares de su crecimiento como ' +
        'ciudadanos comprometidos.',
      selected: true
    },
    {
      label: 'Aprender haciendo',
      info: 'La mejor forma de aprender es vivir la experiencia. A través de la observación, la experimentación y la acción directa, las educandas ' +
        'exploran, crean y descubren. La metodología del proyecto permite soñar, jugar, imaginar y transformar ideas en realidades, convirtiendo cada ' +
        'experiencia en una oportunidad única de crecimiento.',
      selected: false
    },
    {
      label: 'La vida en pequeños grupos',
      info:
        'Pequeños equipos, grandes aprendizajes. Estos grupos fomentan la confianza, el conocimiento mutuo y el sentido de pertenencia. Son el ' +
        'espacio perfecto para aprender a colaborar, asumir responsabilidades y crecer en un ambiente de apoyo y compañerismo.',
      selected: false
    },
    {
      label: 'Con la ayuda de adultos',
      info: 'Guiadas por adultas voluntarias (scouters), los niños, niñas y jóvenes encuentran el apoyo necesario para explorar su potencial. Las scouters ' +
        'no solo orientan y proponen, sino que también inspiran al grupo a alcanzar su mejor versión mediante el diálogo y la cooperación.',
      selected: false
    },
    {
      label: 'Tomar responsabilidad por tu propio crecimiento',
      info: 'El camino hacia el compromiso empieza asumiendo retos personales y colectivos. Participar en actividades y aceptar responsabilidades fomenta el ' +
        'crecimiento individual, cimentando el éxito del equipo y el desarrollo personal.',
      selected: false
    },
    {
      label: 'La formación autogestionada',
      info: 'Cada una es protagonista de su propio aprendizaje. A través de un programa educativo estructurado, asumen un rol activo en su desarrollo, marcando ' +
        'el ritmo y los objetivos de su progreso.',
      selected: false
    }
  ];

  selectedItem = this.scoutMethodItems.find(item => item.selected);

  selectItem(item: any) {
    this.scoutMethodItems.forEach(i => (i.selected = false));

    item.selected = true;
    this.selectedItem = item;
  }
}
