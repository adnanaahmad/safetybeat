import {Component, OnInit, ViewChild, Compiler, AfterViewInit} from '@angular/core';
import {Translation} from 'src/app/models/translate.model';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {
  MatDialogConfig,
  MatDialog,
  MatTableDataSource,
  MatPaginator
} from '@angular/material';
import {BehaviorSubject} from 'rxjs';
import {AdminControlService} from 'src/app/pages/adminControl/services/adminControl.service';
import {SitesInfo} from 'src/app/models/site.model';
import {CompilerProvider} from 'src/app/shared/compiler/compiler';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {AddSiteModalComponent} from 'src/app/pages/adminControl/components/addSiteModal/addSiteModal.component';

@Component({
  selector: 'app-siteCenter',
  templateUrl: './siteCenter.component.html',
  styleUrls: ['./siteCenter.component.scss']
})
export class SiteCenterComponent implements OnInit {

  translated: Translation;
  dialogConfig = new MatDialogConfig();
  dataSource: any = [];
  appIcons: any;
  sitesList: any;
  sitesData: SitesInfo[];
  displayedColumns: string[] = ['name', 'location', 'safeZone', 'createdBy', 'symbol'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  entityData: any;
  entityId: any;

  constructor(
    public dialog: MatDialog,
    public helperService: HelperService,
    public adminServices: AdminControlService,
    public compiler: CompilerProvider,
    private navService: NavigationService,
  ) {
    this.translated = this.helperService.translation;
    this.appIcons = this.helperService.constants.appIcons;
    this.navService.selectedEntityData.subscribe((res) => {
      this.entityData = res;
      this.entityId = this.entityData.entityInfo.id;
    });

  }

  ngOnInit() {
     this.viewAllSites();
  }

  /**
   * this function is used to display all the sites of a particular entity
   */
  viewAllSites() {
    this.adminServices.siteObserver.subscribe((res) => {
      if (res === 1) {
        let data = {
          'entityId': this.entityId
        };
        this.adminServices.viewSites(data).subscribe((res) => {
          this.sitesList = res;
          this.sitesData = this.compiler.constructSiteData(this.sitesList);
          this.adminServices.changeSites(this.sitesData);
          this.dataSource = new MatTableDataSource(this.sitesData);
          this.dataSource.paginator = this.paginator;
        });
      } else {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;

      }
    });
  }

  /**
   * this function is used to create Add Site Dialog
   */
  addSite() {
    this.helperService.createDialog(AddSiteModalComponent);
  }


}
