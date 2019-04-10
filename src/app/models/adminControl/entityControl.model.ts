import {Translation} from '../translate.model';

export interface EntityControl {
  dataSource: any;
  translated: Translation;
  appIcons: any;
  joinEntityData: any;
  allEntitiesData: any;
  entitiesList: any;
  empty: boolean;
  createEntityOption: boolean;
}
