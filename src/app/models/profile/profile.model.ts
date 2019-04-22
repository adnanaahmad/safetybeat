import {FormGroup} from '@angular/forms';
import {Translation} from '../translate.model';
import {MatTableDataSource} from '@angular/material';
import {Subscription} from 'rxjs';

export interface ProfileModel {
  subscription: Subscription;
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  entityName: string;
  role: string;
  userData: any;
  profileForm: FormGroup;
  translated: Translation;
  profileData: any;
  userId: number;
  username: string;
  firstname: string;
  lastname: string;
  contactNo: string;
  dataRecieved: any;
  disabled: boolean;
  password1: string;
  password2: string;
  appIcons: any;
  appConstants: any;
  entitiesList: any;
  email: any;
  profileFeatures: ProfileFeatures;
}


export interface ProfileFeatures {
  general: boolean;
  entities: boolean;
  leaves: boolean;
  profile: boolean;
  changePassword: boolean;
}
