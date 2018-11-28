import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'

@Injectable({ providedIn: 'root' })
export class RegistrationService {
    constructor(private http: HttpClient) { }

    registerUser(data) {
        return this.http.post(`${environment.apiUrl}/rest-auth/registration/`, data);
    }
}