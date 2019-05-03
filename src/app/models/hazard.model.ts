import {FormGroup} from '@angular/forms';

export interface HazardModel {
  id: number;
  dataSource: any;
  displayedColumns: string[];
}
 export interface AddHazardModel {
   addHazardForm: FormGroup;
}
