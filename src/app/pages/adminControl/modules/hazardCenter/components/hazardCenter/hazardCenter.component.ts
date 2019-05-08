import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {HelperService} from '../../../../../../shared/helperService/helper.service';
import {HazardModel, NewHazard} from '../../../../../../models/hazard.model';
import {HazardDetailsComponent} from '../../dialogs/hazardDetails/hazardDetails.component';
import {AdminControlService} from '../../../../services/adminControl.service';
import {NavigationService} from '../../../../../navigation/services/navigation.service';
import {CompilerProvider} from '../../../../../../shared/compiler/compiler';

@Component({
  selector: 'app-hazardCenter',
  templateUrl: './hazardCenter.component.html',
  styleUrls: ['./hazardCenter.component.scss']
})
export class HazardCenterComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  hazardTable: HazardModel = <HazardModel>{};
  displayedColumns = ['site', 'title', 'resolved', 'dateTime', 'actions'];

  constructor(
    public helperService: HelperService,
    private navService: NavigationService,
    private compiler: CompilerProvider,
    public adminControlService: AdminControlService) {
  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.navService.selectedEntityData.subscribe((res) => {
      if (res !== 1) {
        let data = res.entityInfo;
        console.log(data.id);
        this.hazardTable.entityId = data.id;
        let entityId = {
          'entityId': this.hazardTable.entityId
        };
        this.getHazardList(entityId);
      }
    });
  }

  openDialog(data) {
    this.helperService.createDialog(HazardDetailsComponent, {
      disableClose: true,
      width: '250px',
      data: {data: data}
    });
  }

  getHazardList(entityId) {
    this.adminControlService.allHazards(entityId).subscribe((res) => {
      let temp = this.compiler.constructHazardArray(res);
      this.hazardTable.dataSource = new MatTableDataSource(temp);
      this.hazardTable.dataSource.paginator = this.paginator;
    });
  }
}
