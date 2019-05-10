import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {Hazard, HazardModel} from 'src/app/models/hazard.model';
import {HazardDetailsComponent} from 'src/app/pages/adminControl/modules/hazardCenter/dialogs/hazardDetails/hazardDetails.component';
import {AdminControlService} from 'src/app/pages/adminControl/services/adminControl.service';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {CompilerProvider} from 'src/app/shared/compiler/compiler';
import {AddHazardComponent} from '../../../siteCenter/dialogs/addHazard/addHazard.component';
import {environment} from 'src/environments/environment';

@Component({
  selector: 'app-hazardCenter',
  templateUrl: './hazardCenter.component.html',
  styleUrls: ['./hazardCenter.component.scss']
})
export class HazardCenterComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  hazardTable: HazardModel = <HazardModel>{};
  displayedColumns = ['site', 'title', 'resolved', 'dateTime', 'Image', 'actions'];
  serverUrl = environment.serverUrl;


  constructor(
    public helperService: HelperService,
    private navService: NavigationService,
    private compiler: CompilerProvider,
    private adminControlService: AdminControlService) {
  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.getHazardList();
  }

  openDetailsDialog(data) {
    this.helperService.createDialog(HazardDetailsComponent, {
      disableClose: true,
      data: {data: data}
    });
  }

  getHazardList() {
    let entityData = {
      'entityId': JSON.parse(this.helperService.decrypt(localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
        this.helperService.appConstants.key)),
    };
    this.adminControlService.allHazards(entityData).subscribe((res) => {
      if (res !== 1 && res !== '') {
        this.hazardTable.dataSource = new MatTableDataSource(this.compiler.constructHazardArray(res));
        this.hazardTable.dataSource.paginator = this.paginator;
      } else if (res === '') {
        this.hazardTable.dataSource = 0;
      }
    });
  }

  editHazard(hazard: Hazard) {
    console.log(hazard);
    this.helperService.createDialog(AddHazardComponent, {
      disableClose: true,
      data: {Modal: true, hazardInfo: hazard}
    });
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      this.getHazardList();
    });
  }
}
