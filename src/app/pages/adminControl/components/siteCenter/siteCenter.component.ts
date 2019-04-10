import {Component, OnInit, ViewChild} from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {
  MatDialogConfig,
  MatDialog,
  MatTableDataSource,
  MatPaginator
} from '@angular/material';
import {AdminControlService} from 'src/app/pages/adminControl/services/adminControl.service';
import {CompilerProvider} from 'src/app/shared/compiler/compiler';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {AddSiteModalComponent} from 'src/app/pages/adminControl/components/addSiteModal/addSiteModal.component';
import {SiteCentre} from 'src/app/models/adminControl/siteCentre.model';

@Component({
  selector: 'app-siteCenter',
  templateUrl: './siteCenter.component.html',
  styleUrls: ['./siteCenter.component.scss']
})
export class SiteCenterComponent implements OnInit {

  dialogConfig = new MatDialogConfig();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  siteCentreModel: SiteCentre = <SiteCentre>{};
  displayedColumns: string[] = ['name', 'location', 'safeZone', 'createdBy', 'symbol'];

  constructor(
    public dialog: MatDialog,
    public helperService: HelperService,
    public adminServices: AdminControlService,
    public compiler: CompilerProvider,
    private navService: NavigationService,
  ) {
    this.initialize();
    this.siteCentreModel.translated = this.helperService.translation;
    this.siteCentreModel.appIcons = this.helperService.constants.appIcons;
    this.navService.selectedEntityData.subscribe((res) => {
      this.siteCentreModel.entityData = res;
      this.siteCentreModel.entityId = this.siteCentreModel.entityData.entityInfo.id;
    });

  }


  initialize() {
    this.siteCentreModel.empty = false;
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
          'entityId': this.siteCentreModel.entityId
        };
        this.adminServices.viewSites(data).subscribe((res) => {
          this.siteCentreModel.sitesList = res;
          this.siteCentreModel.sitesData = this.compiler.constructSiteData(this.siteCentreModel.sitesList);
          this.adminServices.changeSites(this.siteCentreModel.sitesData);
          this.siteCentreModel.dataSource = new MatTableDataSource(this.siteCentreModel.sitesData);
          this.siteCentreModel.dataSource.paginator = this.paginator;
        });
      } else {
        this.siteCentreModel.dataSource = new MatTableDataSource(res);
        this.siteCentreModel.dataSource.paginator = this.paginator;

      }
    });
    this.siteCentreModel.empty = true;
  }

  /**
   * this function is used to create Add Site Dialog
   */
  addSite() {
    this.helperService.createDialog(AddSiteModalComponent);
  }


}
