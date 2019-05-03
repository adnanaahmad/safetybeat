import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatTableDataSource} from '@angular/material';
import {HelperService} from '../../../../../../shared/helperService/helper.service';
import {HazardModel} from '../../../../../../models/hazard.model';
import {AddHazardComponent} from '../../dialogs/add-hazard/add-hazard.component';

@Component({
  selector: 'app-hazardCenter',
  templateUrl: './hazardCenter.component.html',
  styleUrls: ['./hazardCenter.component.scss']
})
export class HazardCenterComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  hazard: HazardModel = <HazardModel>{};

  constructor(public dialog: MatDialog,
    public helperService: HelperService
  ) {
  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {
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


  addHazard() {
    let dialogRef = this.helperService.createDialog(AddHazardComponent, {disableClose: false,  width: '250px'});

  }
}
