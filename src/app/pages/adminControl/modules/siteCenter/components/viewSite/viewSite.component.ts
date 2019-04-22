import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {AdminControlService} from '../../../../services/adminControl.service';
import {CompilerProvider} from '../../../../../../shared/compiler/compiler';
import {ViewSite} from '../../../../../../models/adminControl/viewSite.model';
import {HelperService} from '../../../../../../shared/helperService/helper.service';
import {NavigationService} from '../../../../../navigation/services/navigation.service';
import {ConfirmationModalComponent} from '../../../../../../Dialogs/conformationModal/confirmationModal.component';

@Component({
  selector: 'app-ViewSite',
  templateUrl: './viewSite.component.html',
  styleUrls: ['./viewSite.component.scss']
})
export class ViewSiteComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  viewSiteObj: ViewSite = <ViewSite>{};
  @ViewChild('gmap') gMapElement: ElementRef;

  constructor(
    private route: ActivatedRoute,
    public adminServices: AdminControlService,
    public compiler: CompilerProvider,
    public helperService: HelperService,
    private navService: NavigationService
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
      this.helperService.setLocationGeocode(this.viewSiteObj.siteInfo.location, this.helperService.createMap(this.gMapElement));
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
    this.helperService.createDialog(ConfirmationModalComponent);
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

}


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  {position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na'},
  {position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg'},
  {position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al'},
  {position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si'},
  {position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P'},
  {position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S'},
  {position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl'},
  {position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar'},
  {position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K'},
  {position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca'},
];
