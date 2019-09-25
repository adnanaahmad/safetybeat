import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {AdminControlService} from 'src/app/features/adminControl/services/adminControl.service';
import {ViewSite} from 'src/app/models/adminControl/viewSite.model';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {PaginationData} from 'src/app/models/site.model';
import {ImageLightboxComponent} from 'src/app/dialogs/imageLightbox/imageLightbox.component';

@Component({
  selector: 'app-ViewSite',
  templateUrl: './viewSite.component.html',
  styleUrls: ['./viewSite.component.scss']
})
export class ViewSiteComponent implements OnInit {
  @ViewChild('hazardMatPage') hazardPaginator: MatPaginator;
  @ViewChild('activityMatPage') activityPaginator: MatPaginator;
  @ViewChild('gmap') gMapElement: ElementRef;
  viewSiteObj: ViewSite = <ViewSite>{};
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({matches}) => {
      if (matches) {
        return [
          {title: 'location', cols: 2, rows: 1},
          {title: 'information', cols: 2, rows: 1},
          {title: 'hazards', cols: 2, rows: 1},
          {title: 'activity', cols: 2, rows: 1},
        ];
      } else {
        return [
          {title: 'location', cols: 1, rows: 1},
          {title: 'information', cols: 1, rows: 1},
          {title: 'hazards', cols: 1, rows: 1},
          {title: 'activity', cols: 1, rows: 1}
        ];
      }
    })
  );

  constructor(
    private route: ActivatedRoute,
    public adminServices: AdminControlService,
    public compiler: CompilerProvider,
    public helperService: HelperService,
    private navService: NavigationService,
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ) {
    /**
     * site id is passed when we want to view any site here and in the following we are getting the siteId that is in form of
     * site.data
     */
    this.route.params.subscribe((site) => {
      if (site.data) {
        this.viewSiteObj.siteId = JSON.parse(this.helperService.decrypt(site.data,
          this.helperService.appConstants.key));
      }
    });
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
    this.viewSiteObj.pageSize = 3;
  }

  /**
   * this function is called after constructor as we want to call these funcitons after getting siteId in the constructor
   */
  ngOnInit() {
    this.viewSiteInfo();
    this.viewSiteHazards(this.viewSiteObj.firstIndex, this.viewSiteObj.search);
    this.viewSiteActivities(this.viewSiteObj.firstIndex, this.viewSiteObj.search);
  }

  /**
   * this function is used for viewing site information that is then rendered to the html and we see all the info related to
   * the site on the view site page
   */
  viewSiteInfo() {
    this.adminServices.viewSiteInfo(this.viewSiteObj.siteId).subscribe((res) => {
      if (res) {
        this.viewSiteObj.siteInfo = this.compiler.constructorSiteInfo(res);
        this.viewSiteObj.siteSafetyManager = res.siteSafetyManager;
        this.helperService.setLocationGeocode(this.viewSiteObj.siteInfo.location,
          this.helperService.createMap(this.gMapElement), res.radius);
      } else {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.VIEW_SITE_FAILURE, this.helperService.constants.status.ERROR);
      }
    }, (error) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
    });
  }
  /**
   * this function is used for viewing all hazards belonging to a site.
   */
  viewSiteHazards(pageIndex, search) {
    this.viewSiteObj.hazardLoading = true;
    let data = {
      'siteId': this.viewSiteObj.siteId
    };
    let paginationData: PaginationData = {
      limit: this.helperService.appConstants.paginationLimitForViewSite,
      offset: pageIndex * this.helperService.appConstants.paginationLimitForViewSite,
      search: search
    };
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
    });
  }
  /**
   * this function is used for viewing all activity logs belonging to a site.
   */
  viewSiteActivities (pageIndex, search) {
    this.viewSiteObj.activityLoading = true;
    let data = {
      'siteId': this.viewSiteObj.siteId
    };
    let paginationData: PaginationData = {
      limit: this.helperService.appConstants.paginationLimitForViewSite,
      offset: pageIndex * this.helperService.appConstants.paginationLimitForViewSite,
      search: search
    };
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
    });
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
