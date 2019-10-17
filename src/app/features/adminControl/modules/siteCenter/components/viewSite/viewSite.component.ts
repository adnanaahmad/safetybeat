import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {AdminControlService} from 'src/app/features/adminControl/services/adminControl.service';
import {ViewSite} from 'src/app/models/adminControl/viewSite.model';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {map} from 'rxjs/operators';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {PaginationData} from 'src/app/models/site.model';
import {ImageLightboxComponent} from 'src/app/dialogs/imageLightbox/imageLightbox.component';
import {SubSink} from 'subsink';

@Component({
  selector: 'app-ViewSite',
  templateUrl: './viewSite.component.html',
  styleUrls: ['./viewSite.component.scss']
})
export class ViewSiteComponent implements OnInit, OnDestroy {
  @ViewChild('hazardMatPage') hazardPaginator: MatPaginator;
  @ViewChild('activityMatPage') activityPaginator: MatPaginator;
  @ViewChild('gmap') gMapElement: ElementRef;
  viewSiteObj: ViewSite = <ViewSite>{};
  private subs = new SubSink();

  constructor(
    private route: ActivatedRoute,
    public adminServices: AdminControlService,
    public compiler: CompilerProvider,
    public helperService: HelperService,
    private navService: NavigationService,
    private router: Router
  ) {
    /**
     * site id is passed when we want to view any site here and in the following we are getting the siteId that is in form of
     * site.data
     */
    this.subs.add(
      this.route.params.subscribe((site) => {
        if (site.data) {
          this.viewSiteObj.siteInfo = JSON.parse(this.helperService.decrypt(site.data,
            this.helperService.appConstants.key))
        }
      }));
    this.initialize();
  }

  initialize() {
    this.viewSiteObj.hazardColumns = ['title', 'resolved', 'dateTime', 'Image'];
    this.viewSiteObj.hazardTable = null;
    this.viewSiteObj.hazardLoading = false;
    this.viewSiteObj.activityColumns = ['Name', 'Check-In', 'Check-Out', 'Duration'];
    this.viewSiteObj.activityTable = null;
    this.viewSiteObj.activityLoading = false;
    this.viewSiteObj.search = '';
    this.viewSiteObj.firstIndex = 0;
    this.viewSiteObj.pageSize = 6;
  }

  /**
   * this function is called after constructor as we want to call these funcitons after getting siteId in the constructor
   */
  ngOnInit() {
    this.helperService.setLocationGeocode(this.viewSiteObj.siteInfo.location,
      this.helperService.createMap(this.gMapElement), this.viewSiteObj.siteInfo.radius);
    this.viewSiteHazards(this.viewSiteObj.firstIndex, this.viewSiteObj.search);
    this.viewSiteActivities(this.viewSiteObj.firstIndex, this.viewSiteObj.search);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  /**
   * this function is used for viewing all hazards belonging to a site.
   */
  viewSiteHazards(pageIndex, search) {
    this.viewSiteObj.hazardLoading = true;
    let data = {
      'siteId': this.viewSiteObj.siteInfo.id
    };
    let paginationData: PaginationData = {
      limit: this.helperService.appConstants.paginationLimitForViewSite,
      offset: pageIndex * this.helperService.appConstants.paginationLimitForViewSite,
      search: search
    };
    this.subs.add(
      this.adminServices.siteHazards(data, paginationData).subscribe((res) => {
        if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
          this.viewSiteObj.hazardPageCount = res.data.pageCount;
          this.viewSiteObj.hazardTable = new MatTableDataSource(res.data.hazardList);
          this.viewSiteObj.hazardLoading = false;
        } else {
          this.viewSiteObj.hazardLoading = false;
          this.viewSiteObj.hazardTable = null;
        }
      }, (error) => {
        this.viewSiteObj.hazardLoading = false;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
      }));
  }

  /**
   * this function is used for viewing all activity logs belonging to a site.
   */
  viewSiteActivities(pageIndex, search) {
    this.viewSiteObj.activityLoading = true;
    let data = {
      'siteId': this.viewSiteObj.siteInfo.id
    };
    let paginationData: PaginationData = {
      limit: this.helperService.appConstants.paginationLimitForViewSite,
      offset: pageIndex * this.helperService.appConstants.paginationLimitForViewSite,
      search: search
    };
    this.subs.add(
      this.adminServices.siteActivities(data, paginationData).subscribe((res) => {
        if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
          this.viewSiteObj.activityPageCount = res.data.pageCount;
          this.viewSiteObj.activityTable = new MatTableDataSource(res.data.siteLogs);
          this.viewSiteObj.activityLoading = false;
        } else {
          this.viewSiteObj.activityLoading = false;
          this.viewSiteObj.activityTable = null;
        }
      }, (error) => {
        this.viewSiteObj.activityLoading = false;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
      }));
  }

  goBack() {
    this.router.navigate(['/home/adminControl/siteCenter']);
  }

  /**
   * this function is used for viewing the image
   * @params image
   */

  testingFunc(image) {
    if (image) {
      this.helperService.createDialog(ImageLightboxComponent,
        {
          data:
            {
              image: image
            }
        });
    }
  }
}
