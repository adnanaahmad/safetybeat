import {User} from 'src/app/models/user.model';
import {Subscription} from 'rxjs';

export interface Documents {
  subscription: Subscription;
  docResponse: any;
  dataSource: any;
  docList: DocList[];

}

export interface DocList {
  document: DocumentObj;
  folder: Folder;
}

export interface DocumentObj {
  title: string,
  file: any,
  uploadedBy: any,
  folder: any,
  id: any,

}
export interface Folders {
  title: string
}
export interface NewDoc {
  fileName: string,
  folders?: string
}
export interface UploadDocForm {
  file: any,
  entityId: number,
  folderList: any[],
  uploadDocForm: any
}

export interface Folder {
  id: number,
  name: string,
  entity: number
}

