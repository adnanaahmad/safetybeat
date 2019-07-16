import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {MatDialog, MatTableDataSource, MatPaginator} from '@angular/material';
import {AdminControlService} from 'src/app/features/adminControl/services/adminControl.service';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {AddSiteModalComponent} from 'src/app/features/adminControl/modules/siteCenter/dialogs/addSiteModal/addSiteModal.component';
import {SiteCentre} from 'src/app/models/adminControl/siteCentre.model';
import {ImportSiteModalComponent} from 'src/app/features/adminControl/modules/siteCenter/dialogs/ImportSiteModal/ImportSiteModal.component';
import {PaginationData, Site, SitesInfo, ViewAllSiteEntityData} from 'src/app/models/site.model';
import {AddHazardComponent} from 'src/app/features/adminControl/modules/siteCenter/dialogs/addHazard/addHazard.component';
import {ConfirmationModalComponent} from 'src/app/dialogs/conformationModal/confirmationModal.component';
import {SiteMapComponent} from 'src/app/features/adminControl/modules/siteCenter/dialogs/siteMap/siteMap.component';
import {HttpErrorResponse} from '@angular/common/http';
import {AdvanceSearchComponent} from 'src/app/features/adminControl/modules/siteCenter/dialogs/advanceSearch/advanceSearch.component';
import {PermissionsModel} from 'src/app/models/adminControl/permissions.model';
import {SendSiteCodeComponent} from '../../dialogs/sendEntityCode/sendSiteCode.component';
import {MemberCenterService} from 'src/app/features/adminControl/modules/memberCenter/services/member-center.service';
import {ShowSiteCodeComponent} from 'src/app/features/adminControl/modules/siteCenter/dialogs/showSiteCode/showSiteCode.component';

@Component({
  selector: 'app-siteCenter',
  templateUrl: './siteCenter.component.html',
  styleUrls: ['./siteCenter.component.scss']
})
export class SiteCenterComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  siteCentreObj: SiteCentre = <SiteCentre>{};
  displayedColumns: string[] = ['name', 'location', 'safeZone', 'createdBy', 'siteSafetyManager', 'symbol'];
  private dataSource: MatTableDataSource<any>;


  constructor(
    public dialog: MatDialog,
    public helperService: HelperService,
    public adminServices: AdminControlService,
    public compiler: CompilerProvider,
    private navService: NavigationService,
    private memberCenterService: MemberCenterService
  ) {
    this.initialize();
    this.siteCentreObj.subscription = this.navService.selectedEntityData.subscribe((res) => {
      if (res && res !== 1) {
        this.getAllUsers(res.entityInfo.id);
        this.siteCentreObj.entityId = res.entityInfo.id;
        this.getSitesData(this.siteCentreObj.firstIndex, this.siteCentreObj.search);
      }
    });
    this.siteCentreObj.subscription = this.navService.currentUserData.subscribe((res) => {
      if (res) {
        this.siteCentreObj.currentUserData = res;
      }
    });
  }


  /**
   * this function is used to initialize the global variables that we have made in the models.
   */
  initialize() {
    this.siteCentreObj.search = '';
    this.siteCentreObj.firstIndex = 0;
    this.siteCentreObj.pageSize = 10;
    this.siteCentreObj.dataSource = null;
    this.siteCentreObj.allUsersList = [];
    this.siteCentreObj.loading = false;
  }

  /**
   * in this function we have subscribed the selectedEntity observable so that whenever the selectedEntity is changed,
   * we should get the changed entity id.
   */

  ngOnInit() {
    this.navService.entityPermissions.subscribe((data: PermissionsModel) => {
      if (data) {
        this.siteCentreObj.permissions = data;
      }
    });

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

  getSitesData(pageIndex, search) {
    let entityData: ViewAllSiteEntityData = {
      entityId: this.siteCentreObj.entityId,
    };
    let paginationData: PaginationData = {
      offset: pageIndex * this.helperService.appConstants.paginationLimit,
      limit: this.helperService.appConstants.paginationLimit,
      search: search
    };
    this.siteCentreObj.loading = true;
    this.adminServices.viewSites(entityData, paginationData).subscribe((res) => {
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.siteCentreObj.pageCount = res.data.pageCount;
        this.siteCentreObj.sitesData = this.compiler.constructAllSitesData(res.data.sitesList);
        this.adminServices.changeSites(this.siteCentreObj.sitesData);
        this.siteCentreObj.dataSource = new MatTableDataSource(this.siteCentreObj.sitesData);
        this.siteCentreObj.loading = false;
      } else if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[3]) {
        this.siteCentreObj.dataSource = null;
        this.siteCentreObj.loading = false;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ALL_SITES_FAILURE,
          this.helperService.constants.status.ERROR);
      }
    }, (error: HttpErrorResponse) => {
      this.siteCentreObj.dataSource = null;
      this.siteCentreObj.loading = false;
      this.helperService.createSnack(error.error,
        this.helperService.constants.status.ERROR);
    });
  }

  /**
   * this function is used to create Add Site Dialog and when the dialog is closed we again call the view all sites api.
   */
  addSite() {
    this.helperService.createDialog(AddSiteModalComponent, {disableClose: true, data: {Modal: true, siteId: ''}});
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      this.getSitesData(this.paginator.pageIndex, this.siteCentreObj.search);
    });
  }

  /**
   * this function is used to create import sites modal dialog in which the user would be able to import the csv files.
   * and after closing of this modal viewAllSites api calls so that we can see the updated list of sites.
   */

  importSite() {
    this.helperService.createDialog(ImportSiteModalComponent, {disableClose: true});
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      this.getSitesData(this.paginator.pageIndex, this.siteCentreObj.search);
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
      data: {Modal: false, site: siteInfo}
    });
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      this.getSitesData(this.paginator.pageIndex, this.siteCentreObj.search);
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

  /**
   * this function navigates to advance search dialog when we click on advance search anchor
   */
  advanceSearch() {
    this.helperService.createDialog(AdvanceSearchComponent, {
      data: {disableClose: true}
    });
  }


  /**
   * this function is used to open add hazard dialog.
   */
  addHazard(id: any) {
    this.helperService.createDialog(AddHazardComponent, {
      disableClose: true,
      data: {Modal: false, siteId: id}
    });
  }

  /**
   * this function is used to open delete dialog.
   */
  confirmationModal(siteId: number) {
    this.helperService.createDialog(ConfirmationModalComponent, {data: {message: this.helperService.translated.CONFIRMATION.DELETE_SITE}});
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      if (res === this.helperService.appConstants.yes) {
        this.helperService.toggleLoader(true);
        this.deleteSite(siteId);
      }
    });
  }

  /**
   * this function is used to call the api for deleting the site.
   */
  deleteSite(siteId) {
    this.adminServices.deleteSite(siteId).subscribe((res) => {
      this.getSitesData(this.paginator.pageIndex, this.siteCentreObj.search);
      this.helperService.createSnack(this.helperService.translated.MESSAGES.DELETE_SITE_SUCCESS,
        this.helperService.constants.status.SUCCESS);

    }, (error) => {
      this.helperService.createSnack(error.error, this.helperService.constants.status.ERROR);

    });
  }

  /**
   * this function is used to open the viewMap dialog.
   */
  viewMap() {
    this.helperService.createDialog(SiteMapComponent,
      {disableClose: true, height: '75%', width: '80%', data: {'siteData': this.siteCentreObj.sitesData, type: false}});
  }

  getAllUsers(entityId: number) {
    let entityData = {
      entityId: entityId
    };
    this.memberCenterService.allEntityUsers(entityData).subscribe((res) => {
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.siteCentreObj.allUsersList = res.data;
        let self = this;
        self.siteCentreObj.allUsersData = [];
        this.helperService.iterations(self.siteCentreObj.allUsersList, function (res) {
          if (res && res.email !== self.siteCentreObj.currentUserData.email) {
            self.siteCentreObj.allUsersData.push(res);
          }
        });
      } else {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.NOUSER, this.helperService.translated.LOGGER.STATUS.ERROR);
      }
    }, (error) => {
      this.helperService.createSnack(error.error, this.helperService.constants.status.ERROR);
    })
  }

  shareSiteCode(siteData: any) {
    let inviteSiteCodeData = {
      siteCodeData: siteData.code,
      usersData: this.siteCentreObj.allUsersData
    };
    this.helperService.createDialog(SendSiteCodeComponent, {
      data: {inviteSiteCodeData},
      disableClose: true
    });
  }

  SiteCode(siteData: Site) {
    this.helperService.createDialog(ShowSiteCodeComponent, {data: siteData});
  }
}

