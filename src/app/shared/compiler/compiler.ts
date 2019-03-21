import { Injectable } from '@angular/core';
import { ConstantService } from 'src/app/shared/constant/constant.service';

@Injectable()
export class CompilerProvider {
    constructor() {

    }
    insertSpaces(string) {
        string = string.replace(/([a-z])([A-Z])/g, '$1 $2');
        string = string.replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
        return string;
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

}
