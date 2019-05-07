import {FormGroup} from '@angular/forms';

export interface HazardModel {
  id: number;
  dataSource: any;
  displayedColumns: string[];
}
 export interface AddHazardModel {
   addHazardForm: FormGroup;
}

export interface NewHazard {
  title: string,
  risk: number,
  description: string
}
