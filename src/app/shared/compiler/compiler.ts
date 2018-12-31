import { UserProfile } from 'src/app/features/profile/profile.model';
import { Injectable } from '@angular/core';
import { ConstantService } from 'src/app/shared/constant/constant.service';

@Injectable()
export class CompilerProvider {
    constructor() {

    }

    constructUserData(profileApiResponse: any) {
        let user = {
            username: profileApiResponse.username,
            first_name: profileApiResponse.first_name,
            last_name: profileApiResponse.last_name,
            email: profileApiResponse.email,
            mobile_no: profileApiResponse.mobile_no
        }
        return user;
    }



}


