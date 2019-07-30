import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {AdminControlService} from 'src/app/features/adminControl/services/adminControl.service';
import {ViewSite} from 'src/app/models/adminControl/viewSite.model';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {HelperService} from 'src/app/services/common/helperService/helper.service';

@Component({
  selector: 'app-ViewSite',
  templateUrl: './viewSite.component.html',
  styleUrls: ['./viewSite.component.scss']
})
export class ViewSiteComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  viewSiteObj: ViewSite = <ViewSite>{};
  @ViewChild('gmap') gMapElement: ElementRef;
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({matches}) => {
      if (matches) {
        return [
          {title: 'activity', cols: 2, rows: 1},
          {title: 'information', cols: 2, rows: 1},
          {title: 'hazards', cols: 2, rows: 1},
          {title: 'location', cols: 2, rows: 1}
        ];
      } else {
        return [
          {title: 'activity', cols: 1, rows: 1},
          {title: 'information', cols: 1, rows: 1},
          {title: 'hazards', cols: 1, rows: 1},
          {title: 'location', cols: 1, rows: 1}
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
    private breakpointObserver: BreakpointObserver
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
  }

  /**
   * this function is called after constructor as we want to call these funcitons after getting siteId in the constructor
   */
  ngOnInit() {
    this.viewSiteInfo();
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
      this.helperService.createSnack(error.error, this.helperService.constants.status.ERROR);
    });
  }

}
