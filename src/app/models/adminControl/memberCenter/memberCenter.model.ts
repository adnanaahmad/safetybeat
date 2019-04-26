import {Subscription} from 'rxjs';

export interface MemberCenter {
  subscription: Subscription;
  displayLoader: boolean;
  dialogConfig: any;
  displayedColumns: string[];
  dataSource: any;
  entityData: any;
  elements: Array<PeriodicElement>;
}

export interface PeriodicElement {
  name: string;
  email: string;
  contact: number;
  photos: string;
  accessLevel: string;
}
