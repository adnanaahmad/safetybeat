import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { HelperService } from '../../../../../../shared/helperService/helper.service';
import { HazardModel } from '../../../../../../models/hazard.model';
import { HazardDetailsComponent } from '../../dialogs/hazardDetails/hazardDetails.component';
import { AdminControlService } from '../../../../services/adminControl.service';

@Component({
  selector: 'app-hazardCenter',
  templateUrl: './hazardCenter.component.html',
  styleUrls: ['./hazardCenter.component.scss']
})
export class HazardCenterComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  hazard: HazardModel = <HazardModel>{};

  constructor(
    public helperService: HelperService,
    public service: AdminControlService) {
  }

  ngOnInit() {
    this.initialize();
    this.getHazardList();
  }

  initialize() {
    this.hazard.displayedColumns = [
      'Site',
      'Title',
      'Resolved',
      'Date_Time',
      'Actions'
    ];
    // this.hazard.dataSource = [{
    //   site: 'Blue sky', title: 'BSS', risk: 'N/A', resolved: 'H', date: '3Nov', resolved_by: 'Tehreem',
    //   added_by: 'Tehreem123'
    // }];

  }

  openDialog() {
    let dialogRef = this.helperService.createDialog(HazardDetailsComponent, {
      disableClose: true,
      width: '250px',
      data: { name: 'Tehreem', resolvedBy: 'khadija', risk: 'fire' }
    });
  }

  getHazardList() {
    this.service.allHazards().subscribe((res) => {
      console.log(res);
      this.hazard.dataSource = res;
    });
  }
}
