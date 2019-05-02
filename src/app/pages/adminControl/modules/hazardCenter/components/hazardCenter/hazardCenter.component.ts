import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {ProfileService} from '../../../../../profile/services/profile.service';
import {HelperService} from '../../../../../../shared/helperService/helper.service';
import {HazardModel} from '../../../../../../models/hazard.model';

@Component({
  selector: 'app-hazardCenter',
  templateUrl: './hazardCenter.component.html',
  styleUrls: ['./hazardCenter.component.scss']
})
export class HazardCenterComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  hazard: HazardModel = <HazardModel>{};

  constructor(
    public userService: ProfileService,
    public helperService: HelperService
  ) {
  }

  ngOnInit() {
    this.hazard.displayedColumns = [
      'Site',
      'Title',
      'Risk',
      'Resolved',
      'Date_Time',
      'Resolved_by',
      'Added_by',
      'Actions'
    ];
    this.hazard.dataSource = [{site: 'Blue sky', title: 'BSS', risk: 'N/A', resolved: 'H', date: '3Nov', resolved_by: 'Tehreem',
      added_by: 'Tehreem123'}];

  }


}
