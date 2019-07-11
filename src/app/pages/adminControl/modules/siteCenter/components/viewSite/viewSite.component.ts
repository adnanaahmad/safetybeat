import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { AdminControlService } from 'src/app/pages/adminControl/services/adminControl.service';
import { CompilerProvider } from 'src/app//shared/compiler/compiler';
import { ViewSite } from 'src/app/models/adminControl/viewSite.model';
import { HelperService } from 'src/app//shared/helperService/helper.service';
import { NavigationService } from 'src/app/pages/navigation/services/navigation.service';
import { ConfirmationModalComponent } from 'src/app/Dialogs/conformationModal/confirmationModal.component';
import { ProfileService } from 'src/app/pages/profile/services/profile.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

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
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Activity', cols: 2, rows: 1 },
          { title: 'Information', cols: 2, rows: 1 },
          { title: 'Hazards', cols: 2, rows: 1 },
          { title: 'Location', cols: 2, rows: 1 }
        ];
      } else {
        return [
          { title: 'Activity', cols: 1, rows: 1 },
          { title: 'Information', cols: 1, rows: 1 },
          { title: 'Hazards', cols: 1, rows: 1 },
          { title: 'Location', cols: 1, rows: 1 }
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
    public profileService: ProfileService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.route.params.subscribe((site) => {
      this.viewSiteObj.siteId = JSON.parse(this.helperService.decrypt(site.data,
        this.helperService.appConstants.key));
    });
  }



  ngOnInit() {
    this.viewSiteInfo();
    this.siteDeleteEnable();
  }

  viewSiteInfo() {
    this.adminServices.viewSiteInfo(this.viewSiteObj.siteId).subscribe((res) => {
      this.viewSiteObj.siteInfo = this.compiler.constructorSiteInfo(res);
      this.viewUser(this.viewSiteObj.siteInfo.siteSafetyManager);
      this.helperService.setLocationGeocode(this.viewSiteObj.siteInfo.location, this.helperService.createMap(this.gMapElement));
       // let cityCircle = new google.maps.Circle({
       //    strokeColor: '#FF0000',
       //    strokeOpacity: 0.8,
       //    strokeWeight: 2,
       //    fillColor: '#FF0000',
       //    fillOpacity: 0.35,
       //    map: this.helperService.createMap(this.gMapElement),
       //    radius: 30
       //  });
      this.helperService.appLogger(this.helperService.constants.status.SUCCESS, this.helperService.translated.MESSAGES.VIEW_SITE_SUCCESS);
    }, (error) => {
      this.helperService.appLogger(this.helperService.constants.status.ERROR, this.helperService.translated.MESSAGES.VIEW_SITE_FAILURE);
    });
  }

  siteDeleteEnable() {
    this.navService.currentRole.subscribe(res => {
      this.viewSiteObj.entitySelectedRole = res;
      if (
        this.viewSiteObj.entitySelectedRole === this.helperService.appConstants.roles.owner ||
        this.viewSiteObj.entitySelectedRole === this.helperService.appConstants.roles.teamLead ||
        this.viewSiteObj.entitySelectedRole === this.helperService.appConstants.roles.entityManager
      ) {
        this.viewSiteObj.siteOption = true;
      } else {
        this.viewSiteObj.siteOption = false;
      }
    });
  }

  confirmationModal(siteId: number) {
    this.helperService.createDialog(ConfirmationModalComponent, { data: { message: this.helperService.translated.CONFIRMATION.DELETE_SITE } });
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      if (res === this.helperService.appConstants.yes) {
        this.helperService.toggleLoader(true);
        this.deleteSite(siteId);
      }
    });
  }

  deleteSite(siteId) {
    this.adminServices.deleteSite(siteId).subscribe((res) => {
      this.helperService.navigateTo(['/home/adminControl/siteCenter/']);
      this.helperService.appLogger(this.helperService.constants.status.SUCCESS, this.helperService.translated.MESSAGES.DELETE_SITE_SUCCESS);

    }, (error) => {
      this.helperService.appLogger(this.helperService.constants.status.ERROR, this.helperService.translated.MESSAGES.DELETE_SITE_FAILURE);

    });
  }

  viewUser(userId) {
    this.profileService.userInfo(userId).subscribe((res) => {
      this.viewSiteObj.siteSafetyManager = this.compiler.constructUserInfo(res);
      this.helperService.appLogger(this.helperService.constants.status.SUCCESS, this.helperService.translated.MESSAGES.USERDETAILS_MSG);
    }, (error) => {
      this.helperService.appLogger(this.helperService.constants.status.ERROR, this.helperService.translated.MESSAGES.USER_NOT_FOUND);

    })
  }

}
