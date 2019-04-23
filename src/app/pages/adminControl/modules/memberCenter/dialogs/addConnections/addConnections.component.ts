import { Component, OnInit } from '@angular/core';
import { HelperService } from 'src/app/shared/helperService/helper.service';

@Component({
  selector: 'app-addConnections',
  templateUrl: './addConnections.component.html',
  styleUrls: ['./addConnections.component.scss']
})
export class AddConnectionsComponent implements OnInit {

  constructor(
    public helperService: HelperService
  ) { }

  ngOnInit() {
  }

}
