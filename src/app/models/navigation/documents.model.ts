import {Subscription} from 'rxjs';
import {FormGroup} from '@angular/forms';

export interface Documents {
  folderLength: number;
  subscription: Subscription;
  docList: DocumentObj[];
  rootDocs: DocumentObj[];
  documentExist: boolean;
  folderExist: boolean;
  folderList: Folder[];
  entityID: number;
  folderForm: FormGroup;
  modalType: boolean;
  panelOpenState: boolean;
  loader: boolean;
  folderDoc: boolean;
  folderId: number;
}

export interface DocList {
  document: DocumentObj[];
  folder: Folder;
}

export interface DocumentObj {
  editable?: boolean
  title: string,
  file: File,
  uploadedBy: number,
  folder: number,
  id: number,

}

export interface Folders {
  title: string
}

export interface NewDoc {
  fileName: string,
  folders?: string
}

export interface UploadDocForm {
  disableButton: boolean;
  fileName: string;
  isEnabled: boolean;
  modalType: boolean;
  docList: DocumentObj[];
  file: File,
  entityId: number,
  folderList: Folder[],
  uploadDocForm: FormGroup
}

export interface Folder {
  id: number,
  name: string,
  entity: number
}

