import { Injectable } from "@angular/core";
import { ConstantService } from "src/app/shared/constant/constant.service";
import { EntityUserData, Entity } from "src/app/models/userEntityData.model";
import forEach from "lodash/forEach";

@Injectable()
export class CompilerProvider {
  constructor() {}
  /**
   * @param event
   * To check if the input is number or not
   */
  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.key;
    return !(
      charCode > 31 &&
      (charCode < 48 || charCode > 57) &&
      charCode !== 43
    );
  }
  constructUserData(profileApiResponse: any) {
    let user = {
      username: profileApiResponse.username,
      first_name: profileApiResponse.first_name,
      last_name: profileApiResponse.last_name,
      email: profileApiResponse.email,
      mobile_no: profileApiResponse.mobile_no
    };
    return user;
  }

  constructProfileData(loginApiResponse: any) {
    let profileData = {
      userid: loginApiResponse.userId,
      orgid: loginApiResponse.orgId,
      role: loginApiResponse.role
    };

    return profileData;
  }

  constructUserEntityData(loginApiResponse: any): EntityUserData {
    let allEntities: Entity[] = [];
    forEach(loginApiResponse.result, function(entity) {
      let data: Entity = {
        entityInfo: entity.entity,
        permissions: entity.permissions,
        reportAccess: entity.reportAccess
      };
      allEntities.push(data);
    });
    let userEntityData: EntityUserData = {
      user: loginApiResponse.user,
      entities: allEntities
    };
    return userEntityData;
  }
}
