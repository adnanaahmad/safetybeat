import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {MatDialogConfig, MatDialog, MatTableDataSource, MatPaginator} from '@angular/material';
import {AdminControlService} from 'src/app/pages/adminControl/services/adminControl.service';
import {CompilerProvider} from 'src/app/shared/compiler/compiler';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {AddSiteModalComponent} from 'src/app/pages/adminControl/modules/siteCenter/dialogs/addSiteModal/addSiteModal.component';
import {SiteCentre} from 'src/app/models/adminControl/siteCentre.model';
import {ImportSiteModalComponent} from 'src/app/pages/adminControl/modules/siteCenter/dialogs/ImportSiteModal/ImportSiteModal.component';
import {EditSiteModalComponent} from '../../dialogs/editSite/editSiteModal.component';

@Component({
  selector: 'app-siteCenter',
  templateUrl: './siteCenter.component.html',
  styleUrls: ['./siteCenter.component.scss']
})
export class SiteCenterComponent implements OnInit, OnDestroy {

  dialogConfig = new MatDialogConfig();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  siteCentreObj: SiteCentre = <SiteCentre>{};
  displayedColumns: string[] = ['name', 'location', 'safeZone', 'createdBy', 'symbol'];

  constructor(
    public dialog: MatDialog,
    public helperService: HelperService,
    public adminServices: AdminControlService,
    public compiler: CompilerProvider,
    private navService: NavigationService
  ) {
    this.initialize();
  }


  initialize() {
    this.siteCentreObj.empty = false;
  }

  ngOnInit() {
    this.siteCentreObj.subscription = this.navService.selectedEntityData.subscribe(() => {
      this.viewSitesData();
    });
    this.siteAddorImportEnable();
  }

  ngOnDestroy() {
    this.siteCentreObj.subscription.unsubscribe();
  }


  viewSitesData() {
    let entityData = {
      'entityId': JSON.parse(this.helperService.decrypt(localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
        this.helperService.appConstants.key)),
    };
    this.adminServices.viewSites(entityData).subscribe((res) => {
      this.siteCentreObj.sitesList = res;
      this.siteCentreObj.sitesData = this.compiler.constructAllSitesData(this.siteCentreObj.sitesList);
      this.adminServices.changeSites(this.siteCentreObj.sitesData);
      this.adminServices.siteObserver.subscribe((res) => {
        if (res !== 1 && res !== '') {
          this.siteCentreObj.dataSource = new MatTableDataSource(res);
          this.siteCentreObj.dataSource.paginator = this.paginator;
        } else if (res === '') {
          this.siteCentreObj.dataSource = 0;
        }
      });
    });
  }

  /**
   * this function is used to create Add Site Dialog
   */
  addSite() {
    this.helperService.createDialog(AddSiteModalComponent, {disableClose: true});
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      this.viewSitesData();
    });
  }

  importSite() {
    this.helperService.createDialog(ImportSiteModalComponent, {disableClose: true});
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      this.viewSitesData();
    });
  }

  editSite(siteId: number) {
    this.helperService.createDialog(EditSiteModalComponent, {disableClose: true});
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      this.viewSitesData();
    });
  }

  goToViewSite(id) {
    let encryptedId = this.helperService.encrypt(JSON.stringify(id), this.helperService.appConstants.key)
    this.helperService.navigateTo(['/home/adminControl/siteCenter/viewSite', {data: encryptedId}]);
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
