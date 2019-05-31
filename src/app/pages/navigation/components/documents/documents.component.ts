import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {MatDialog, MatDialogConfig, MatPaginator} from '@angular/material';
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
  @ViewChild(MatPaginator) paginator: MatPaginator;
  documentsData: Documents = <Documents>{};
  panelOpenState = false;
  folderList: any;
  private entityID: any;

  constructor(
    public dialog: MatDialog,
    public helperService: HelperService,
    private navService: NavigationService,
    public compiler: CompilerProvider
  ) {
    this.documentsData.documentExist = true;
    this.documentsData.folderExist = true;
  }

  ngOnInit() {
    this.navService.selectedEntityData.subscribe((res) => {
      if (res !== 1) {
        this.entityID = res.entityInfo.id;
        this.getAllFolders(this.entityID);
        this.allDocumentsData(this.entityID);
      }
    });
  }

  ngOnDestroy(): void {
  }

  getAllFolders(entityID: number) {
    this.navService.allFolders({entityId: entityID}).subscribe((res) => {
      if (res.responseDetails.code === 104) {
        this.documentsData.folderExist = false;
        console.log('no folders');
      } else {
        this.folderList = res.data;
        console.log(this.folderList)
        if (this.folderList.length === 0) {
          this.documentsData.folderExist = false;
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
      if (this.documentsData.docResponse.data.length !== 0) {
        this.documentsData.documentExist = true;
      } else if (this.documentsData.docResponse.data.length === 0) {
        this.documentsData.documentExist = false;
      }
      this.documentsData.docList = this.compiler.constructAllDocumentsData(this.documentsData.docResponse);
    });
  }

  checkDoc(folderId): boolean {
    if (this.documentsData.docResponse.responseDetails.code !== 104) {
      for (let j = 0; j < this.documentsData.docResponse.data.documents.length; j++) {
        let temp = this.documentsData.docResponse.data.documents[j];
        if (temp.Document.folder === folderId) {
          return true;
        }
      }
    }
    return false;
  }

  uploadDoc() {
    this.helperService.createDialog(UploadDocComponent, {disableClose: true});
    this.helperService.dialogRef.afterClosed().subscribe((res) => {
      this.allDocumentsData(this.entityID);
      this.getAllFolders(this.entityID);
    });
  }

  newFolder() {
    this.helperService.createDialog(CreateFolderComponent, {disableClose: true, data: {type: true, id: this.entityID}});
    this.helperService.dialogRef.afterClosed().subscribe((res) => {
      this.getAllFolders(this.entityID);
      this.documentsData.folderExist = true;
    });
  }

  deleteDoc(id) {
    this.helperService.createDialog(ConfirmationModalComponent,
      {data: {message: this.helperService.translated.CONFIRMATION.DELETE_DOCUMENT}});
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      if (res === this.helperService.appConstants.yes) {
        this.helperService.toggleLoader(true);
        this.navService.deleteDoc(id).subscribe((res) => {
          this.allDocumentsData(this.entityID);
          this.getAllFolders(this.entityID);
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
          this.allDocumentsData(this.entityID);
          this.getAllFolders(this.entityID);
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
      this.getAllFolders(this.entityID);
      this.allDocumentsData(this.entityID);
      this.documentsData.folderExist = true;
    });
  }

}
