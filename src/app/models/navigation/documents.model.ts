import {User} from '../user.model';

export interface Documents {
  docResponse: any;
  dataSource: any;
  docList: DocumentObj[];

}

export interface DocList {
  document: DocumentObj;
  uploadedBy: User;
}

export interface DocumentObj {
  id: number,
  file: any,
  uploadedBy: any,
  entity: any
}
