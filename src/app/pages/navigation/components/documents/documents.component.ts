import {Component, OnDestroy, OnInit} from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {Documents} from 'src/app/models/navigation/documents.model';
import {CompilerProvider} from 'src/app//shared/compiler/compiler';
import {UploadDocComponent} from 'src/app/pages/navigation/dialogs/uploadDoc/uploadDoc.component';
import {CreateFolderComponent} from 'src/app/pages/navigation/dialogs/createFolder/createFolder.component';
import {ConfirmationModalComponent} from 'src/app/Dialogs/conformationModal/confirmationModal.component';
import {ViewDocComponent} from 'src/app/pages/navigation/dialogs/viewDoc/viewDoc.component';
import {ShowDocumentsComponent} from '../showDocuments/showDocuments.component';
import {Router} from '@angular/router';


@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit, OnDestroy {
  dialogConfig = new MatDialogConfig();
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
        //   this.allDocumentsData(this.documentsData.entityID);
        this.getRootDocuments(this.documentsData.entityID);
      }
    });
    this.documentsData.subscription = this.navService.newDoc.subscribe((res) => {
      if (res !== 1) {
        this.documentsData.docList = res;
        //      this.documentsData.documentExist = true;
      } else {
        //     this.documentsData.documentExist = false;
      }
    });
    this.documentsData.subscription = this.navService.allFoldersList.subscribe((res) => {
      if (res !== 1) {
        this.documentsData.folderList = res;
        this.documentsData.folderExist = true;
      } else {
        this.documentsData.folderExist = false;
      }
    });


  }

  ngOnDestroy(): void {
    this.documentsData.subscription.unsubscribe();
  }

  getAllFolders(entityID: number) {
    this.navService.allFolders({entityId: entityID}).subscribe((res) => {
      if (res.responseDetails.code !== this.helperService.appConstants.codeValidations[0]) {
        this.documentsData.folderExist = false;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.GET_FOLDER_FAILURE,
          this.helperService.constants.status.ERROR);
      } else {
        if (res.data.length === 0) {
          this.documentsData.folderExist = false;
        } else {
          this.documentsData.folderExist = true;
          this.documentsData.folderList = res.data;
          this.navService.updateFolder(this.documentsData.folderList);
        }
      }
    });
  }

  docsOfFolder(folderID: number) {
    this.documentsData.docList = [];
    this.documentsData.panelOpenState = true;
    let data = {
      'folderId': folderID
    };
    this.navService.getDocuments(data).subscribe((res) => {
      if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.documentsData.folderDoc = true;
        this.documentsData.docList = this.compiler.constructAllDocumentsData(res);
        this.navService.updateDocument(this.documentsData.docList);
      } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
        this.documentsData.folderDoc = false;
      } else {
        this.documentsData.folderDoc = false;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.GET_DOCUMENT_FAILURE,
          this.helperService.constants.status.ERROR);
      }
    });
  }

  getRootDocuments(entityId) {
    this.documentsData.rootDocs = [];
    let data = {'entityId': entityId};
    this.navService.getRootDocuments(data).subscribe((res) => {
      if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        if (res.data.length === 0) {
          this.documentsData.documentExist = false;
        } else {
          this.documentsData.documentExist = true;
          this.documentsData.rootDocs = this.compiler.constructDocuments(res);
          this.navService.updateDocument(this.documentsData.docList);
        }
      } else {
        this.documentsData.documentExist = false;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.GET_DOCUMENT_FAILURE,
          this.helperService.constants.status.ERROR);
      }
    });
  }

  // allDocumentsData(entityID: number) {
  //   let entityData = {
  //     'entityId': entityID,
  //   };
  //   this.navService.viewAllDocuments(entityData).subscribe((res) => {
  //     this.documentsData.docResponse = res;
  //     if (this.documentsData.docResponse.data.length !== 0) {
  //         this.documentsData.documentExist = true;
  //       if (this.documentsData.docResponse.data.folder !== []) {
  //         if (this.documentsData.docResponse.data.length === 1 &&  this.documentsData.docResponse.data[0].folder.name === 'root') {
  //           this.documentsData.folderExist = false;
  //         } else {
  //           this.documentsData.folderExist = true;
  //         }
  //       }
  //
  //     } else if (this.documentsData.docResponse.data.length === 0) {
  //       this.documentsData.documentExist = false;
  //       this.documentsData.folderExist = false;
  //     }
  //     this.documentsData.docList = this.compiler.constructAllDocumentsData(this.documentsData.docResponse);
  //     this.navService.updateDocument(this.documentsData.docList);
  //   });
  // }

  uploadDoc() {
    this.helperService.createDialog(UploadDocComponent, {
      disableClose: true, data: {
        folders: this.documentsData.folderList,
        entityID: this.documentsData.entityID
      }
    });
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      //  this.allDocumentsData(this.documentsData.entityID);
      this.getRootDocuments(this.documentsData.entityID);
    });
  }

  newFolder() {
    this.helperService.createDialog(CreateFolderComponent, {disableClose: true, data: {type: true, id: this.documentsData.entityID}});
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      //    this.allDocumentsData(this.documentsData.entityID);
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

  viewDoc(doc: any) {
    this.helperService.createDialog(ViewDocComponent, {data: doc, disableClose: true});
  }

  deleteFolder(id) {
    this.helperService.createDialog(ConfirmationModalComponent,
      {data: {message: this.helperService.translated.CONFIRMATION.DELETE_FOLDER}});
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      if (res === this.helperService.appConstants.yes) {
        this.helperService.toggleLoader(true);
        this.navService.deleteFolder(id).subscribe((res) => {
          //        this.allDocumentsData(this.documentsData.entityID);
          this.getAllFolders(this.documentsData.entityID);
        });
      }
    });
  }

  renameFolder(folderInfo) {
    this.helperService.createDialog(CreateFolderComponent, {
      disableClose: true,
      data: {type: false, folderId: folderInfo.id, name: folderInfo.name}
    });
    this.helperService.dialogRef.afterClosed().subscribe((res) => {
      this.getAllFolders(this.documentsData.entityID);
      //    this.allDocumentsData(this.documentsData.entityID);
      //    this.documentsData.folderExist = true;
    });
  }

  checkDoc(docs: any[]) {
    for (let i = 0; i < (docs.length); i++) {
      if (docs[i].documents.length !== 0) {
        return true;
      }
    }
    return false;
  }

  showDocs(folderId: number) {
    this.router.navigate(['/home/viewDocs', {data: JSON.stringify(folderId)}], {skipLocationChange: false});
  }
}
