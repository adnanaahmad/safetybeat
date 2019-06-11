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
    public compiler: CompilerProvider
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
        this.allDocumentsData(this.documentsData.entityID);
      }
    });
    this.documentsData.subscription = this.navService.newDoc.subscribe((res) => {
      if (res !== 1) {
        this.documentsData.docList = res;
        this.documentsData.documentExist = true;
      } else {
        this.documentsData.documentExist = false;
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
      if (res.responseDetails.code !== 100) {
        this.documentsData.folderExist = false;
        this.documentsData.folderList = res.data;
      } else {
        this.documentsData.folderList = res.data;
        if (this.documentsData.folderList.length === 0) {
          this.documentsData.folderExist = false;
        } else if (this.documentsData.folderList.length === 1) {
          if (this.documentsData.folderList[0].name === 'root') {
            this.documentsData.folderExist = false;
          } else {
            this.documentsData.folderExist = true;
            this.navService.updateFolder(this.documentsData.folderList);
          }
        }
      }
    });
  }

  allDocumentsData(entityID: number) {
    let entityData = {
      'entityId': entityID,
    };
    this.navService.viewAllDocuments(entityData).subscribe((res) => {
      this.documentsData.docResponse = res;
      console.log(this.documentsData.docResponse);
      if (this.documentsData.docResponse.data.length !== 0) {
          this.documentsData.documentExist = true;
        if (this.documentsData.docResponse.data.folder !== []) {
          if (this.documentsData.docResponse.data.length === 1 &&  this.documentsData.docResponse.data[0].folder.name === 'root') {
            this.documentsData.folderExist = false;
          } else {
            this.documentsData.folderExist = true;
          }
        }

      } else if (this.documentsData.docResponse.data.length === 0) {
        this.documentsData.documentExist = false;
        this.documentsData.folderExist = false;
      }
      this.documentsData.docList = this.compiler.constructAllDocumentsData(this.documentsData.docResponse);
      console.log(this.documentsData.docList);
      this.navService.updateDocument(this.documentsData.docList);
    });
  }

  uploadDoc() {
    this.helperService.createDialog(UploadDocComponent, {disableClose: true, data: {folders: this.documentsData.folderList}});
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      this.allDocumentsData(this.documentsData.entityID);
    });
  }

  newFolder() {
    this.helperService.createDialog(CreateFolderComponent, {disableClose: true, data: {type: true, id: this.documentsData.entityID}});
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      this.allDocumentsData(this.documentsData.entityID);
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
          this.allDocumentsData(this.documentsData.entityID);
          this.getAllFolders(this.documentsData.entityID);
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
          this.allDocumentsData(this.documentsData.entityID);
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
      this.allDocumentsData(this.documentsData.entityID);
      this.documentsData.folderExist = true;
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
}
