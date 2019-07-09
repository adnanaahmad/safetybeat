import {FormGroup} from '@angular/forms';
import {Translation} from '../translate.model';
import {MatTableDataSource} from '@angular/material';
import {Subscription} from 'rxjs';
import {TeamList} from '../adminControl/myTeam.model';

export interface ProfileModel {
  teamsData: TeamList;
  noTeam: boolean;
  connectionCount: number;
  entityCount: number;
  noEntity: boolean;
  imageFile: File;
  profileImage: Blob;
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
  name: string;
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
  receivedData: any;
  currentUserProfile: boolean;
  allConnectionsData: any;
  allConnectionsRes: any;
  recentActivities: any;
  noActivity: boolean;
  duration: string;
  noConnection: boolean;
  noRecords: boolean;
}


export interface ProfileFeatures {
  general: boolean;
  entities: boolean;
  leaves: boolean;
  profile: boolean;
  changePassword: boolean;
}

export interface recentActivities {
  checkInCheckOut: checkInCheckOut;
  site: siteData;
  duration: string
}

export interface checkInCheckOut {
  checkInType: any;
  checkedInAt: any;
  checkedOutAt: any;
  checkedOutType: any;
  id: number;
  site: number;
  user: number
}
 export interface siteData {
   createdBy: number;
   entity: number;
   gpsTrackEnabled: any;
   id: number;
   latitude: any;
   location: string;
   longitude: any;
   name: string;
   radius: any;
   safeZone: boolean;
   siteSafetyManager: any;
   siteSafetyPlan: string;
 }
