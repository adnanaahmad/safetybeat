import {Component, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {MatDialogRef, MatTableDataSource, MatPaginator, MatDialog} from '@angular/material';
import {AdminControlService} from 'src/app/features/adminControl/services/adminControl.service';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {SiteCentre} from 'src/app/models/adminControl/siteCentre.model';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {PaginationData, ViewAllSiteArchivedData} from 'src/app/models/site.model';
import {HttpErrorResponse} from '@angular/common/http';
import {PermissionsModel} from 'src/app/models/adminControl/permissions.model';

@Component({
  selector: 'app-archivedSites',
  templateUrl: './archivedSites.component.html',
  styleUrls: ['./archivedSites.component.scss']
})
export class ArchivedSitesComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  archivedSitesObj: SiteCentre = <SiteCentre>{};
  displayedColumns: string[] = ['name', 'location', 'safeZone', 'createdBy', 'siteSafetyManager', 'symbol'];


  constructor(
    public helperService: HelperService,
    public adminServices: AdminControlService,
    public dialogRef: MatDialogRef<ArchivedSitesComponent>,
    public compiler: CompilerProvider,
    private render: Renderer2,
    private navService: NavigationService,
    public dialog: MatDialog
  ) {
    this.archivedSitesObj.loading = true;
    this.initialize();
    this.archivedSitesObj.subscription = this.navService.selectedEntityData.subscribe((res) => {
      if (res && res !== 1) {
        this.archivedSitesObj.entityId = res.entityInfo.id;
        this.getSitesData(this.archivedSitesObj.firstIndex, this.archivedSitesObj.search);
      }
    });
    this.archivedSitesObj.subscription = this.navService.currentUserData.subscribe((res) => {
      if (res) {
        this.archivedSitesObj.currentUserData = res;
      }
    });
  }

  /**
   * this function is used to initialize the global variables that we have made in the models.
   */
  initialize() {
    this.archivedSitesObj.search = '';
    this.archivedSitesObj.firstIndex = 0;
    this.archivedSitesObj.pageSize = 10;
    this.archivedSitesObj.dataSource = null;
    this.archivedSitesObj.allUsersList = [];
    this.archivedSitesObj.loading = false;
  }

  /**
   * this function is called on the initialization of this component and is used to create the map from where user can see the
   * entered address on the map and in this function we also have created the addSiteForm in which all the input fields are declared
   * here that we need in the addSiteForm.
   */

  ngOnInit() {
    this.archivedSitesObj.subscription = this.navService.entityPermissions.subscribe((data: PermissionsModel) => {
      if (data) {
        this.archivedSitesObj.permissions = data;
      }
    });
  }

  /**
   * this function is called when the component is destroyed and it removes the assigned body class to this particular
   * component so that this would not affect the other components and this function is also used for hiding the debugging messages.
   */
  ngOnDestroy() {
    if (this.archivedSitesObj.subscription !== null && this.archivedSitesObj.subscription !== undefined) {
      this.archivedSitesObj.subscription.unsubscribe();
    }
  }

  /**
   * this function is used to view all the sites data against the particular entity id.
   */
  getSitesData(pageIndex, search) {
    this.archivedSitesObj.pageCount = 0;
    let entityData: ViewAllSiteArchivedData = {
      entityId: this.archivedSitesObj.entityId,
      archived: true
    };
    let paginationData: PaginationData = {
      offset: pageIndex * this.helperService.appConstants.paginationLimit,
      limit: this.helperService.appConstants.paginationLimit,
      search: search
    };
    if (typeof (search) === 'string' && search.length === 0) {
      this.archivedSitesObj.loading = true;
    }
    this.adminServices.viewArchivedSites(entityData, paginationData).subscribe((res) => {
      if (res && res.responseDetails && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.archivedSitesObj.pageCount = res.data.pageCount;
        this.archivedSitesObj.sitesData = this.compiler.constructAllSitesArchivedData(res.data.sitesList);
        this.adminServices.changeSites(this.archivedSitesObj.sitesData);
        this.archivedSitesObj.dataSource = new MatTableDataSource(this.archivedSitesObj.sitesData);
        this.archivedSitesObj.loading = false;
      } else if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[3]) {
        this.archivedSitesObj.dataSource = null;
        this.archivedSitesObj.loading = false;
      } else {
        this.archivedSitesObj.dataSource = null;
        this.archivedSitesObj.loading = false;
      }
    }, (error: HttpErrorResponse) => {
      this.onNoClick();
      this.archivedSitesObj.dataSource = null;
      this.archivedSitesObj.loading = false;
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG,
        this.helperService.constants.status.ERROR);
    });
  }

  /**
   * Unarchive site
   * @params siteData
   */
  unarchiveSite(siteData: any) {
    this.adminServices.unarchiveSite(siteData.id).subscribe((res) => {
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.getSitesData(this.archivedSitesObj.firstIndex, this.archivedSitesObj.search);
        this.helperService.createSnack(this.helperService.translated.MESSAGES.SITE_UNARCHIVE_SUCCESS,
          this.helperService.constants.status.SUCCESS);
      } else {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.SITE_UNARCHIVE_FAILURE,
          this.helperService.constants.status.ERROR);
      }
    }, (error) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);

    });
  }

  /**
   * this function is used to close the dialog when the user clicks on the cancel button.
   */
  onNoClick(): void {
    this.dialogRef.close();
  }
}
