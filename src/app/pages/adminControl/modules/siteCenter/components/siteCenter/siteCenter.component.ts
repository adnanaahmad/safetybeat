import {Component, OnInit, ViewChild} from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {MatDialogConfig, MatDialog, MatTableDataSource, MatPaginator} from '@angular/material';
import {AdminControlService} from 'src/app/pages/adminControl/services/adminControl.service';
import {CompilerProvider} from 'src/app/shared/compiler/compiler';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {AddSiteModalComponent} from 'src/app/pages/adminControl/modules/siteCenter/dialogs/addSiteModal/addSiteModal.component';
import {SiteCentre} from 'src/app/models/adminControl/siteCentre.model';
import {ImportSiteModalComponent} from 'src/app/pages/adminControl/modules/siteCenter/dialogs/ImportSiteModal/ImportSiteModal.component';

@Component({
  selector: 'app-siteCenter',
  templateUrl: './siteCenter.component.html',
  styleUrls: ['./siteCenter.component.scss']
})
export class SiteCenterComponent implements OnInit {

  dialogConfig = new MatDialogConfig();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  siteCentreObj: SiteCentre = <SiteCentre>{};
  displayedColumns: string[] = ['name', 'location', 'safeZone', 'createdBy', 'symbol'];

  constructor(
    public dialog: MatDialog,
    public helperService: HelperService,
    public adminServices: AdminControlService,
    public compiler: CompilerProvider,
    private navService: NavigationService,
  ) {
    this.initialize();
    this.navService.selectedEntityData.subscribe((res) => {
      this.siteCentreObj.entityData = res;
      this.siteCentreObj.entityId = this.siteCentreObj.entityData.entityInfo.id;
    });

  }


  initialize() {
    this.siteCentreObj.empty = false;
  }

  ngOnInit() {
    this.viewAllSites();
    this.siteAddorImportEnable();
  }

  /**
   * this function is used to display all the sites of a particular entity
   */
  viewAllSites() {
    this.adminServices.siteObserver.subscribe((res) => {
      if (res === 1) {
        let data = {
          'entityId': this.siteCentreObj.entityId
        };
        this.adminServices.viewSites(data).subscribe((res) => {
          this.siteCentreObj.sitesList = res;
          if (this.siteCentreObj.sitesList.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
            this.siteCentreObj.sitesData = this.compiler.constructSiteData(this.siteCentreObj.sitesList);
            this.adminServices.changeSites(this.siteCentreObj.sitesData);
            this.siteCentreObj.dataSource = new MatTableDataSource(this.siteCentreObj.sitesData);
            this.siteCentreObj.dataSource.paginator = this.paginator;
          } else {
            this.siteCentreObj.dataSource = 0;
          }
        });
      } else {
        if (res === '') {
          this.siteCentreObj.dataSource = 0;
        } else {
          this.siteCentreObj.dataSource = new MatTableDataSource(res);
          this.siteCentreObj.dataSource.paginator = this.paginator;
        }

      }
    });
    this.siteCentreObj.empty = true;
  }

  /**
   * this function is used to create Add Site Dialog
   */
  addSite() {
    this.helperService.createDialog(AddSiteModalComponent, {disableClose: true});
  }

  importSite() {
    this.helperService.createDialog(ImportSiteModalComponent, {disableClose: true});
  }

  siteAddorImportEnable() {
    this.navService.currentRole.subscribe(res => {
      this.siteCentreObj.entitySelectedRole = res;
      if (
        this.siteCentreObj.entitySelectedRole === this.helperService.appConstants.roles.owner ||
        this.siteCentreObj.entitySelectedRole === this.helperService.appConstants.roles.teamLead ||
        this.siteCentreObj.entitySelectedRole === this.helperService.appConstants.roles.entityManager
      ) {
        this.siteCentreObj.siteOption = true;
      } else {
        this.siteCentreObj.siteOption = false;
      }
    });
  }

}
