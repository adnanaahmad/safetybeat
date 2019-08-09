import {Site} from './site.model';
import { EntityInfo} from './userEntityData.model';

export interface SiteCodeModel {
  site: Site,
  permissions: boolean
}

export interface EntityCodeModel {
  entity: EntityInfo,
  permissions: boolean
}
