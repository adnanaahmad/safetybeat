import {Translation} from '../translate.model';
import {NavItem} from '../navItems.model';
import {EntityUserData} from '../userEntityData.model';
import {Subscription} from 'rxjs';
import {PermissionsModel} from '../adminControl/permissions.model';

export interface NavigationModel {
  permissions: PermissionsModel;
  navItems: NavItem[];
  showEntitySwitcher: boolean;
  logoutDisable: boolean;
  logoutResponse: any;
  translated: Translation;
  appIcons: any;
  empty: boolean;
  navLinks: NavData;
  entitiesList: any;
  allEntitiesData: any;
  defaultList: NavItem[];
  entityUserData: EntityUserData;
  selectedEntity: any;
  Entity: any;
  subscription: Subscription;
  navStyle: any;
}

export interface NavData {
  defaultNav: NavItem[];
  reportsNav: NavItem[];
  settingsNav: NavItem[];
}
