import {Component, OnInit, ViewChild} from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {MatDialog, MatDialogConfig, MatPaginator, MatTableDataSource} from '@angular/material';
import {NavigationService} from '../../services/navigation.service';
import {SiteCentre} from '../../../../models/adminControl/siteCentre.model';
import {Documents} from '../../../../models/navigation/documents.model';
import {CompilerProvider} from '../../../../shared/compiler/compiler';


@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {
  dialogConfig = new MatDialogConfig();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['file', 'uploadedBy', 'actions'];
  documentsObj: Documents = <Documents>{};

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

  allDocumentsData() {
    let entityData = {
      'entityId': JSON.parse(this.helperService.decrypt(localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
        this.helperService.appConstants.key)),
    };
    this.navService.viewAllDocuments(entityData).subscribe((res) => {
    console.log(res);
    //   this.documentsObj.docList = res;
    //   this.documentsObj.docData = this.compiler.constructAllSitesData(this.documentsObj.docList);
    //   if (res) {
    //     this.documentsObj.dataSource = new MatTableDataSource(res);
    //     this.documentsObj.dataSource.paginator = this.paginator;
    //   } else if (res === '') {
    //     this.documentsObj.dataSource = 0;
    //   }
    });
  }


}
