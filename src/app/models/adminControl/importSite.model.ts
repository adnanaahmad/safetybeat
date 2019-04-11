import {Translation} from '../translate.model';
import {FormGroup} from '@angular/forms';

export interface ImportSite {
  entityId: number;
  entityData: any;
  importSiteForm: FormGroup;
  appConstants: any;
  translated: Translation;
  loading: boolean;
  csvFile: File;
}
