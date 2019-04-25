import { Component, OnInit } from '@angular/core';
import { HelperService } from 'src/app/shared/helperService/helper.service';

@Component({
  selector: 'app-removeConnections',
  templateUrl: './removeConnections.component.html',
  styleUrls: ['./removeConnections.component.scss']
})
export class RemoveConnectionsComponent implements OnInit {

  constructor(
    public helperService: HelperService
  ) { }

  ngOnInit() {
  }

}
