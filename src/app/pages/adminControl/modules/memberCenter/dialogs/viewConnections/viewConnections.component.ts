import {Component, OnInit} from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {AdminControlService} from '../../../../services/adminControl.service';

@Component({
  selector: 'app-viewConnections',
  templateUrl: './viewConnections.component.html',
  styleUrls: ['./viewConnections.component.scss']
})
export class ViewConnectionsComponent implements OnInit {

  connections = [];

  constructor(
    public helperService: HelperService,
    private adminService: AdminControlService
  ) {
  }

  ngOnInit() {
    this.adminService.allConnections().subscribe(res => {
      this.connections = res.data;
    });
  }

}
