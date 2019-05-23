import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {MatDialog, MatDialogConfig, MatPaginator, MatTableDataSource} from '@angular/material';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {DocumentObj, Documents} from 'src/app/models/navigation/documents.model';
import {CompilerProvider} from 'src/app//shared/compiler/compiler';
import {UploadDocComponent} from '../../dialogs/uploadDoc/uploadDoc.component';
import {CreateFolderComponent} from '../../dialogs/createFolder/createFolder.component';


@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit, OnDestroy {
  dialogConfig = new MatDialogConfig();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['file', 'uploadedBy', 'actions'];
  documentsObj: DocumentObj = <DocumentObj>{};
  documentsData: Documents = <Documents>{};
  panelOpenState = false;
  private folderList: any;

  constructor(
    public dialog: MatDialog,
    public helperService: HelperService,
    private navService: NavigationService,
    public compiler: CompilerProvider,
  ) {

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

      } else {
        this.folderList = res.data;
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
      if (this.documentsData.docResponse.data) {
        this.documentsData.docList = this.compiler.constructAllDocumentsData(this.documentsData.docResponse);
        this.documentsData.dataSource = new MatTableDataSource(this.documentsData.docList);
        this.documentsData.dataSource.paginator = this.paginator;
      } else if (this.documentsData.docResponse.data === '') {
        this.documentsData.dataSource = 0;
      }
    });
  }


  uploadDoc() {
    this.helperService.createDialog(UploadDocComponent, {disableClose: true});
    this.helperService.dialogRef.afterClosed().subscribe((res) => {
      this.allDocumentsData();
    });
  }

  newFolder() {
    this.helperService.createDialog(CreateFolderComponent, {disableClose: true});
    this.helperService.dialogRef.afterClosed().subscribe((res) => {
      this.getAllFolders();
    });
  }
}
