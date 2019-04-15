import {Translation} from '../translate.model';
import {NavItem} from '../navItems.model';
import {EntityUserData} from '../userEntityData.model';

export interface NavigationModel {
  translated: Translation;
  appIcons: any;
  empty: boolean;
  navLinks: NavItem[];
  entitiesList: any;
  allEntitiesData: any;
  defaultList: NavItem[];
  entityUserData: EntityUserData;
  selectedEntity: any;
  Entity: any;
}
