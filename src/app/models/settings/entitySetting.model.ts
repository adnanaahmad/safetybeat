import {FormGroup} from '@angular/forms';
import {EntityInfo} from '../userEntityData.model';

export interface EntitySetting {
  entityForm: FormGroup;
  disabled: boolean;
  entitiesData: EntityInfo;
}
