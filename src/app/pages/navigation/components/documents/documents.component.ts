import {Component, OnInit, ViewChild} from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {MatDialog, MatDialogConfig, MatPaginator, MatTableDataSource} from '@angular/material';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {DocumentObj, Documents} from 'src/app/models/navigation/documents.model';
import {CompilerProvider} from 'src/app//shared/compiler/compiler';


@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {
  dialogConfig = new MatDialogConfig();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['file', 'uploadedBy', 'actions'];
  documentsObj: DocumentObj = <DocumentObj>{};
  documentsData: Documents = <Documents>{};
  panelOpenState = false;

  constructor(
    public dialog: MatDialog,
    public helperService: HelperService,
    private navService: NavigationService,
    public compiler: CompilerProvider,
  ) {

  }

  ngOnInit() {
    this.allDocumentsData()
  }

  uploadDocuments(event) {
    let entityId = JSON.parse(this.helperService.decrypt(localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
      this.helperService.appConstants.key))
    this.documentsObj.file = <File>event.target.files[0];
    let blob = new Blob([this.documentsObj.file]);
    let formData = new FormData();
    formData.append('file', blob, this.documentsObj.file.name);
    formData.append('entity', entityId);
    this.navService.uploadDocuments(formData).subscribe((res) => {
      console.log(res)
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
        console.log(this.documentsData.docList);
        this.documentsData.dataSource = new MatTableDataSource(this.documentsData.docList);
        this.documentsData.dataSource.paginator = this.paginator;
      } else if (this.documentsData.docResponse.data === '') {
        this.documentsData.dataSource = 0;
      }
    });
  }


}
