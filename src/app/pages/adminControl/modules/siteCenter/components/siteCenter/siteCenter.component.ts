import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {MatDialogConfig, MatDialog, MatTableDataSource, MatPaginator} from '@angular/material';
import {AdminControlService} from 'src/app/pages/adminControl/services/adminControl.service';
import {CompilerProvider} from 'src/app/shared/compiler/compiler';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {AddSiteModalComponent} from 'src/app/pages/adminControl/modules/siteCenter/dialogs/addSiteModal/addSiteModal.component';
import {SiteCentre} from 'src/app/models/adminControl/siteCentre.model';
import {ImportSiteModalComponent} from 'src/app/pages/adminControl/modules/siteCenter/dialogs/ImportSiteModal/ImportSiteModal.component';
import {SitesInfo} from 'src/app/models/site.model';
import {AddHazardComponent} from 'src/app/pages/adminControl/modules/siteCenter/dialogs/addHazard/addHazard.component';
import {ConfirmationModalComponent} from 'src/app/Dialogs/conformationModal/confirmationModal.component';
import {SiteMapComponent} from '../../dialogs/siteMap/siteMap.component';

@Component({
  selector: 'app-siteCenter',
  templateUrl: './siteCenter.component.html',
  styleUrls: ['./siteCenter.component.scss']
})
export class SiteCenterComponent implements OnInit, OnDestroy {

  dialogConfig = new MatDialogConfig();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  siteCentreObj: SiteCentre = <SiteCentre>{};
  displayedColumns: string[] = ['name', 'location', 'safeZone', 'createdBy', 'siteSafetyManager', 'symbol'];


  constructor(
    public dialog: MatDialog,
    public helperService: HelperService,
    public adminServices: AdminControlService,
    public compiler: CompilerProvider,
    private navService: NavigationService
  ) {
    this.initialize();
  }


  /**
   * this function is used to initialize the global variables that we have made in the models.
   */
  initialize() {
    this.siteCentreObj.empty = false;
  }

  /**
   * in this function we have subscribed the selectedEntity observable so that whenever the selectedEntity is changed,
   * we should get the changed entity id.
   */

  ngOnInit() {
    this.siteCentreObj.subscription = this.navService.selectedEntityData.subscribe(() => {
      this.viewSitesData();
    });
    this.siteAddorImportEnable();
  }

  /**
   * this function is used for unsubscription of the subscribed observables.
   */

  ngOnDestroy() {
    this.siteCentreObj.subscription.unsubscribe();
  }

  /**
   * this function is used to view all the sites data against the particular entity id.
   */


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
        if (res !== 1 && res.length !== 0) {
          this.siteCentreObj.dataSource = new MatTableDataSource(res);
          this.siteCentreObj.dataSource.paginator = this.paginator;
        } else if (res.length === 0) {
          this.siteCentreObj.dataSource = 0;
        }
      });
    });
  }

  /**
   * this function is used to create Add Site Dialog and when the dialog is closed we again call the view all sites api.
   */
  addSite() {
    this.helperService.createDialog(AddSiteModalComponent, {disableClose: true, data: {Modal: true, siteId: ''}});
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      this.viewSitesData();
    });
  }

  /**
   * this function is used to create import sites modal dialog in which the user would be able to import the csv files.
   * and after closing of this modal viewAllSites api calls so that we can see the updated list of sites.
   */

  importSite() {
    this.helperService.createDialog(ImportSiteModalComponent, {disableClose: true});
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      this.viewSitesData();
    });
  }

  /**
   * this function is used to create edit site modal dialog in which the user would be able to edit site.
   * and after closing of this modal viewAllSites api calls so that we can see the updated list of sites.
   * @param: siteInfo
   */

  editSite(siteInfo: SitesInfo) {
    this.helperService.createDialog(AddSiteModalComponent, {
      disableClose: true,
      data: {Modal: false, site: siteInfo.site, createdBy: siteInfo.createdBy, siteSafetyManager: siteInfo.siteSafetyManager}
    });
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      this.viewSitesData();
    });
  }

  /**
   * this function allows specific user to have permission to add or import site
   */

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

  /**
   * this function is called when the user clicks on the view site button and then this function navigates the users
   * to the view site component in which all the details of the particular site is shown.
   */

  goToViewSite(id) {
    let encryptedId = this.helperService.encrypt(JSON.stringify(id), this.helperService.appConstants.key);
    this.helperService.navigateTo(['/home/adminControl/siteCenter/viewSite', {data: encryptedId}]);
  }

  addHazard(id: any) {
    this.helperService.createDialog(AddHazardComponent, {
      disableClose: true,
      data: {Modal: false, siteId: id}
    });
  }

  confirmationModal(siteId: number) {
    this.helperService.createDialog(ConfirmationModalComponent, {data: {message: this.helperService.translated.CONFIRMATION.DELETE_SITE}});
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      if (res === this.helperService.appConstants.yes) {
        this.helperService.toggleLoader(true);
        this.deleteSite(siteId);
      }
    });
  }

  deleteSite(siteId) {
    this.adminServices.deleteSite(siteId).subscribe((res) => {
      this.viewSitesData();
      this.helperService.appLogger(this.helperService.constants.status.SUCCESS, this.helperService.translated.MESSAGES.DELETE_SITE_SUCCESS);

    }, (error) => {
      this.helperService.appLogger(this.helperService.constants.status.ERROR, this.helperService.translated.MESSAGES.DELETE_SITE_FAILURE);

    });
  }

  viewMap() {
    let siteList = this.siteCentreObj.sitesList;
    let sitedata = siteList.data;
    console.log(sitedata);
    this.helperService.createDialog(SiteMapComponent, {disableClose: true, height: '75%', width: '80%',  data: {'siteData': sitedata, type : false}});
  }
}
