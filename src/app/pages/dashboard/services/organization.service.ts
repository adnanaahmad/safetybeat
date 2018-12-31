import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { ConstantService } from '../../../shared/constant/constant.service';

@Injectable({ providedIn: 'root' })
export class OrganizationService {
    constructor(private http: HttpClient) {
    }

    
}
