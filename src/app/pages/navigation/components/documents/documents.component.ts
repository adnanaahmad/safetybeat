import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {MatDialog, MatDialogConfig, MatPaginator} from '@angular/material';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {Documents} from 'src/app/models/navigation/documents.model';
import {CompilerProvider} from 'src/app//shared/compiler/compiler';
import {UploadDocComponent} from 'src/app/pages/navigation/dialogs/uploadDoc/uploadDoc.component';
import {CreateFolderComponent} from 'src/app/pages/navigation/dialogs/createFolder/createFolder.component';
import {ViewDocComponent} from '../../dialogs/viewDoc/viewDoc.component';


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

  constructor(
    public dialog: MatDialog,
    public helperService: HelperService,
    private navService: NavigationService,
    public compiler: CompilerProvider,
  ) {
    this.documentsData.documentExit = true;
    this.documentsData.folderExist = true;
  }

  ngOnInit() {

    this.allDocumentsData();
    this.getAllFolders();
  }

  ngOnDestroy(): void {
  }

  getAllFolders() {
    let entityID = JSON.parse(this.helperService.decrypt(localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
      this.helperService.appConstants.key));
    this.navService.allFolders({entityId: entityID}).subscribe((res) => {
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
      'entityId': JSON.parse(this.helperService.decrypt(localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
        this.helperService.appConstants.key)),
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
    if (this.documentsData.docResponse.data.length !== 0) {
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
    this.helperService.createDialog(CreateFolderComponent, {disableClose: true});
    this.helperService.dialogRef.afterClosed().subscribe((res) => {
      this.getAllFolders();
      this.documentsData.folderExist = true;
    });
  }

  deleteDoc(id) {
    this.navService.deleteDoc(id).subscribe((res) => {
      this.allDocumentsData();
      this.getAllFolders();
    });
  }

  viewDoc(doc) {
     this.helperService.createDialog(ViewDocComponent, {data: doc, disableClose: true});
  }
}
