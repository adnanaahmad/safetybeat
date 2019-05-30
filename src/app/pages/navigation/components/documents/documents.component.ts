import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {MatDialog, MatDialogConfig, MatPaginator} from '@angular/material';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {Documents} from 'src/app/models/navigation/documents.model';
import {CompilerProvider} from 'src/app//shared/compiler/compiler';
import {UploadDocComponent} from 'src/app/pages/navigation/dialogs/uploadDoc/uploadDoc.component';
import {CreateFolderComponent} from 'src/app/pages/navigation/dialogs/createFolder/createFolder.component';
import {ConfirmationModalComponent} from '../../../../Dialogs/conformationModal/confirmationModal.component';
import {DomSanitizer} from '@angular/platform-browser';


@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit, OnDestroy {
  dialogConfig = new MatDialogConfig();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['file', 'uploadedBy', 'actions'];
  documentsData: Documents = <Documents>{};
  panelOpenState = false;
  folderList: any;
  length;
  fileUrl: any;
  private entityID: any;

  constructor(
    public dialog: MatDialog,
    public helperService: HelperService,
    private navService: NavigationService,
    public compiler: CompilerProvider,
    private sanitizer: DomSanitizer
  ) {
    this.documentsData.documentExit = true;
    this.documentsData.folderExist = true;
  }

  ngOnInit() {
    // const data = 'some text';
    // const blob = new Blob([data], { type: 'application/octet-stream' });
    // this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
    this.entityID = JSON.parse(this.helperService.decrypt(localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
      this.helperService.appConstants.key));
    this.allDocumentsData();
    this.getAllFolders();
  }

  ngOnDestroy(): void {
  }

  getAllFolders() {
    this.navService.allFolders({entityId: this.entityID}).subscribe((res) => {
      if (res.responseDetails.code === 104) {
        this.documentsData.folderExist = false;
      } else {
        this.folderList = res.data;
        if (this.folderList.length === 0) {
          this.documentsData.folderExist = false;
        }
      }
    });
  }

  allDocumentsData() {
    let entityData = {
      'entityId': this.entityID,
    };
    this.navService.viewAllDocuments(entityData).subscribe((res) => {
      this.documentsData.docResponse = res;
      if (this.documentsData.docResponse.data.length !== 0) {
        this.documentsData.documentExit = true;
      } else if (this.documentsData.docResponse.data.length === 0) {
        this.documentsData.documentExit = false;
      }
        this.length = this.documentsData.docResponse.data.length;
        this.documentsData.docList = this.compiler.constructAllDocumentsData(this.documentsData.docResponse);
    });
  }

  checkDoc(folderId): boolean {
    if (this.documentsData.docResponse.responseDetails.code !== 104) {
      for (let j = 0; j < this.documentsData.docResponse.data.documents.length ; j++) {
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
      this.allDocumentsData();
      this.getAllFolders();
    });
  }

  newFolder() {
    this.helperService.createDialog(CreateFolderComponent, {disableClose: true, data: {type: true}});
    this.helperService.dialogRef.afterClosed().subscribe((res) => {
      this.getAllFolders();
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
          this.allDocumentsData();
          this.getAllFolders();
        });
      }
    });
  }

  viewDoc(route) {
    // this.helperService.createDialog(ViewDocComponent, {data: doc, disableClose: true});
    // this.navService.downloadPDF(url).subscribe(res => {
    //   const fileURL = URL.createObjectURL(res);
    //   window.open(fileURL, '_blank');
    // });
    let response = this.helperService.appConstants.serverUrl + route;
    const blob = new Blob([route], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    window.open(url);
  }

  deleteFolder(id) {
    this.helperService.createDialog(ConfirmationModalComponent,
      {data: {message: this.helperService.translated.CONFIRMATION.DELETE_FOLDER}});
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      if (res === this.helperService.appConstants.yes) {
        this.helperService.toggleLoader(true);
        this.navService.deleteFolder(id).subscribe((res) => {
          this.allDocumentsData();
          this.getAllFolders();
        });
      }
    });
  }

  renameFolder(folderInfo) {
    this.helperService.createDialog(CreateFolderComponent, {disableClose: true,
      data: {type: false, id: folderInfo.id, name: folderInfo.name}});
    this.helperService.dialogRef.afterClosed().subscribe((res) => {
      this.getAllFolders();
      this.documentsData.folderExist = true;
    });
  }
}
