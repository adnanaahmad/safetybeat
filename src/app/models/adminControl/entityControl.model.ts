import {Translation} from '../translate.model';
import {MatDialogConfig} from '@angular/material';

export interface EntityControl {
  entitySelectedRole: string;
  dialogConfig: any;
  displayedColumns: string[];
  dataSource: any;
  translated: Translation;
  appIcons: any;
  allEntitiesData: any;
  entitiesList: any;
  empty: boolean;
  createEntityOption: boolean;
  joinOption: boolean;
  allUsers: any;
  allUsersList: any;
}
