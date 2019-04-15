import {FormGroup} from '@angular/forms';

export interface ImportSite {
  entityId: number;
  entityData: any;
  importSiteForm: FormGroup;
  loading: boolean;
  csvFile: File;
  type: 'multipart/form-data';
}
