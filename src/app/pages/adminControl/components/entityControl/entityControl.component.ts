import { Component, OnInit } from '@angular/core';
import { Translation } from 'src/app/models/translate.model';
import { TranslateService } from '@ngx-translate/core';
import { ConstantService } from 'src/app/shared/constant/constant.service';

export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {position: 'BlueSky', name: 'Hydrogen', weight: 'Asad Fiaz a.fiaz@optergy.com', symbol: 'H'},
  {position: 'RedSky', name: 'Helium', weight: 'Asad Fiaz a.fiaz@optergy.com', symbol: 'He'},
  {position: 'PinkSky', name: 'Lithium', weight: 'Asad Fiaz a.fiaz@optergy.com', symbol: 'Li'},
  {position: 'MaroonSky', name: 'Beryllium', weight: 'Asad Fiaz a.fiaz@optergy.com', symbol: 'Be'},
  {position: 'YellowSky', name: 'Boron', weight: 'Asad Fiaz a.fiaz@optergy.com', symbol: 'B'},
  {position: 'BlackSky', name: 'Carbon', weight: 'Asad Fiaz a.fiaz@optergy.com', symbol: 'C'},
  {position: 'GraySky', name: 'Nitrogen', weight: 'Asad Fiaz a.fiaz@optergy.com', symbol: 'N'},
  {position: 'ThisSky', name: 'Oxygen', weight: 'Asad Fiaz a.fiaz@optergy.com', symbol: 'O'},
  {position: 'ThatSky', name: 'Fluorine', weight: 'Asad Fiaz a.fiaz@optergy.com', symbol: 'F'},
  {position: 'NoSky', name: 'Neon', weight: 'Asad Fiaz a.fiaz@optergy.com', symbol: 'Ne'},
];
@Component({
  selector: 'app-entityControl',
  templateUrl: './entityControl.component.html',
  styleUrls: ['./entityControl.component.scss']
})
export class EntityControlComponent{
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
  translated: Translation;
  appIcons:any;
  constructor(

    public translate: TranslateService,
  ) {
    translate.get(['AUTH', 'BUTTONS', 'MESSAGES', 'LOGGER', 'STRINGS', 'ICONS']).subscribe((values) => {
      this.translated = values;
    this.appIcons = ConstantService.appIcons;
    });
  }
}
