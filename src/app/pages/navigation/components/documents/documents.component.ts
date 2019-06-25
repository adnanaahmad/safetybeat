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

  initialize() {
    this.documentsData.documentExist = false;
    this.documentsData.folderExist = false;
    this.documentsData.panelOpenState = false;
  }

  ngOnInit() {
    this.documentsData.subscription = this.navService.selectedEntityData.subscribe((res) => {
      if (res !== 1) {
        this.documentsData.entityID = res.entityInfo.id;
        this.getAllFolders(this.documentsData.entityID);
        this.getRootDocuments(this.documentsData.entityID);
      }
    });
  }
  ngOnDestroy(): void {
    this.documentsData.subscription.unsubscribe();
  }


  getAllFolders(entityID: number) {
    this.navService.allFolders({entityId: entityID}).subscribe((res) => {
      if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.documentsData.folderExist = true;
        this.documentsData.folderList = res.data;
        this.navService.updateFolder(this.documentsData.folderList);
      } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
        this.documentsData.folderExist = false;
      } else {
        this.documentsData.folderExist = false;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.GET_FOLDER_FAILURE,
          this.helperService.constants.status.ERROR);
      }
    });
  }

  getRootDocuments(entityId) {
    this.documentsData.rootDocs = [];
    let data = {'entityId': entityId};
    this.navService.getRootDocuments(data).subscribe((res) => {
      if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.documentsData.documentExist = true;
        this.documentsData.rootDocs = this.compiler.constructDocuments(res);
        this.navService.updateDocument(this.documentsData.docList);
      } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
          this.documentsData.documentExist = false;
      } else {
        this.documentsData.documentExist = false;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.GET_DOCUMENT_FAILURE,
          this.helperService.constants.status.ERROR);
      }
    });
  }

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
  newFolder() {
    this.helperService.createDialog(CreateFolderComponent, {disableClose: true, data: {type: true, id: this.documentsData.entityID}});
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      this.getAllFolders(this.documentsData.entityID);
    });
  }

  deleteDoc(id) {
    this.helperService.createDialog(ConfirmationModalComponent,
      {data: {message: this.helperService.translated.CONFIRMATION.DELETE_DOCUMENT}});
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      if (res === this.helperService.appConstants.yes) {
        this.helperService.toggleLoader(true);
        this.navService.deleteDoc(id).subscribe((res) => {
          this.getAllFolders(this.documentsData.entityID);
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
          this.getAllFolders(this.documentsData.entityID);
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
// this function opens another component to show a folder's file
  showDocs(folderId: number) {
    this.router.navigate(['/home/viewDocs', {folderId: JSON.stringify(folderId),
      entityId: JSON.stringify(this.documentsData.entityID)}], {skipLocationChange: false});
  }
}
