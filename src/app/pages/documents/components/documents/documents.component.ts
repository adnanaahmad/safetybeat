import { Component, OnInit } from '@angular/core';
import { HelperService } from 'src/app/shared/helperService/helper.service';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'MyDocument', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'YourDocument', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'HerDocument', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'HisDocument', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'TheirDocument', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'NoOnesDocument', weight: 12.0107, symbol: 'C' },
];

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;

  constructor(
    public helperService: HelperService
  ) {
    this.helperService.toggleLoader(true)
    this.helperService.appLogger(
      this.helperService.constants.status.SUCCESS,
      this.helperService.translated.LOGGER.MESSAGES.ENTITYCONTROL
    );
  }

  ngOnInit() {
  }
}