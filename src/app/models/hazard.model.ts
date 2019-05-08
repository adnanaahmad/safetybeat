import {FormGroup} from '@angular/forms';

export interface HazardModel {
  id: number;
  dataSource: any;
  displayedColumns: string[];
}

export interface AddHazardModel {
  image: File;
  addHazardForm: FormGroup;
}

export interface NewHazard {
  title: string,
  risk: string,
  description: string
}
