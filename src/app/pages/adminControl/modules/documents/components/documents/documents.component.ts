import {Component, OnDestroy, OnInit} from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {MatDialog} from '@angular/material';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {Documents} from 'src/app/models/navigation/documents.model';
import {CompilerProvider} from 'src/app//shared/compiler/compiler';
import {UploadDocComponent} from 'src/app/pages/navigation/dialogs/uploadDoc/uploadDoc.component';
import {CreateFolderComponent} from 'src/app/pages/navigation/dialogs/createFolder/createFolder.component';
import {ConfirmationModalComponent} from 'src/app/Dialogs/conformationModal/confirmationModal.component';
import {ViewDocComponent} from 'src/app/pages/navigation/dialogs/viewDoc/viewDoc.component';
import {Router} from '@angular/router';


@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit, OnDestroy {
  documentsData: Documents = <Documents>{};

  constructor(
    public dialog: MatDialog,
    public helperService: HelperService,
    private navService: NavigationService,
    public compiler: CompilerProvider,
    private router: Router
  ) {
    this.initialize();
  }
// this function initializes the values of variables
  initialize() {
    this.documentsData.documentExist = false;
    this.documentsData.folderExist = false;
    this.documentsData.panelOpenState = false;
  }

  ngOnInit() {
    this.documentsData.subscription = this.navService.selectedEntityData.subscribe((res) => {
      if (res && res !== 1) {
        this.documentsData.entityID = res.entityInfo.id;
        this.getAllFolders(this.documentsData.entityID);
        this.getRootDocuments(this.documentsData.entityID);
      } else {
        // do something here
      }
    });
  }
  ngOnDestroy(): void {
    this.documentsData.subscription.unsubscribe();
  }

// this function returns the list of all folders in an entity
  getAllFolders(entityID: number) {
    this.documentsData.folderList = [];
    this.navService.allFolders({entityId: entityID}).subscribe((res) => {
      if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        if (res.data.length === 0) {
          this.documentsData.folderExist = false;
        } else {
          this.documentsData.folderExist = true;
          this.documentsData.folderList = res.data;
        }
      } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
        this.documentsData.folderExist = false;
      } else {
        this.documentsData.folderExist = false;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.GET_FOLDER_FAILURE,
          this.helperService.constants.status.ERROR);
      }
    }, (error) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.GET_FOLDER_FAILURE,
        this.helperService.constants.status.ERROR);
    });
  }

  // this function gets all the documents that are saved in root folder
  getRootDocuments(entityId) {
    this.documentsData.rootDocs = [];
    let data = {'entityId': entityId};
    this.navService.getRootDocuments(data).subscribe((res) => {
      if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.documentsData.documentExist = true;
        this.documentsData.rootDocs = this.compiler.constructDocuments(res);
      } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
          this.documentsData.documentExist = false;
      } else {
        this.documentsData.documentExist = false;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.GET_DOCUMENT_FAILURE,
          this.helperService.constants.status.ERROR);
      }
    }, (error) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.GET_DOCUMENT_FAILURE,
        this.helperService.constants.status.ERROR);
    });
  }

  // this function opens a dialog to upload file
  uploadDoc() {
    this.helperService.createDialog(UploadDocComponent, {
      disableClose: true, data: {
        folders: this.documentsData.folderList,
        entityID: this.documentsData.entityID,
        modalType: true
      }
    });
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      this.getRootDocuments(this.documentsData.entityID);
      this.getAllFolders(this.documentsData.entityID);
    });
  }
  // this function is used to create new folder
  newFolder() {
    this.helperService.createDialog(CreateFolderComponent, {disableClose: true, data: {type: true, id: this.documentsData.entityID}});
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      this.getAllFolders(this.documentsData.entityID);
    });
  }

  // this function first asks for confirmation and then deletes a document
  deleteDoc(id) {
    this.helperService.createDialog(ConfirmationModalComponent,
      {data: {message: this.helperService.translated.CONFIRMATION.DELETE_DOCUMENT}});
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      if (res === this.helperService.appConstants.yes) {
        this.helperService.toggleLoader(true);
        this.navService.deleteDoc(id).subscribe((res) => {
          this.getRootDocuments(this.documentsData.entityID);
        });
      }
    });
  }
// this function opens and shows a document in a dialog
  viewDoc(doc: any) {
    this.helperService.createDialog(ViewDocComponent, {data: doc, disableClose: true});
  }
// this function is used to delete the existing folder
  deleteFolder(id) {
    this.helperService.createDialog(ConfirmationModalComponent,
      {data: {message: this.helperService.translated.CONFIRMATION.DELETE_FOLDER}});
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      if (res === this.helperService.appConstants.yes) {
        this.helperService.toggleLoader(true);
        this.navService.deleteFolder(id).subscribe((res) => {
          this.helperService.createSnack(this.helperService.translated.MESSAGES.FOLDER_DELETED,
            this.helperService.constants.status.SUCCESS);
          this.getAllFolders(this.documentsData.entityID);
        }, (error) => {
          this.helperService.createSnack(this.helperService.translated.MESSAGES.FOLDER_DEL_FAIL, this.helperService.constants.status.ERROR);
        });
      }
    });
  }
// this function opens dialog to rename folder
  renameFolder(folderInfo) {
    this.helperService.createDialog(CreateFolderComponent, {
      disableClose: true,
      data: {type: false, folderId: folderInfo.id, name: folderInfo.name}
    });
    this.helperService.dialogRef.afterClosed().subscribe((res) => {
      this.getAllFolders(this.documentsData.entityID);
    });
  }
// this function opens another component to show a folder's files/documents
  showDocs(folderId: number) {
    this.router.navigate(['/home/adminControl/documents/viewDocs', {folderId: JSON.stringify(folderId),
      entityId: JSON.stringify(this.documentsData.entityID)}], {skipLocationChange: false});
  }

  renameDoc(doc) {
    doc.editable = true;
  }

  editedValue(value, doc) {
    doc.editable = false;
    value = value + '.' + (doc.title.split('.'))[1];
    let blob = new Blob([doc.file]);
    let formData = new FormData();
    formData.append('title' , value);
    formData.append('file', blob);
    formData.append('uploadedBy', doc.uploadedBy);
    this.navService.renameDocument(doc.id, formData).subscribe((res) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.DOCUMENT_RENAMED, this.helperService.constants.status.SUCCESS);
      this.getRootDocuments(this.documentsData.entityID);
    }, (error) => {
      this.helperService.appLogger(this.helperService.constants.status.ERROR, this.helperService.translated.MESSAGES.DOC_RENAME_FAIL);
    });
  }

  downloadFile() {

  }
}
