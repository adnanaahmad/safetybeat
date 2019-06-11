import {Subscription} from 'rxjs';

export interface Documents {
  folderLength: number;
  subscription: Subscription;
  docResponse: any;
  dataSource: any;
  docList: DocList[];
  documentExist: boolean;
  folderExist: boolean;
  folderList: any;
  entityID: number;
  rootOnly: boolean;
  folderForm: any;
  modalType: boolean;
  panelOpenState: boolean;
  loader: boolean;
}

export interface DocList {
  document: DocumentObj[];
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
  docList: any;
  documentExist: boolean;
  docResponse: any;
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

