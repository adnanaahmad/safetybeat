import { Component, OnInit } from '@angular/core';
import { HelperService } from 'src/app/shared/helperService/helper.service';

@Component({
  selector: 'app-viewConnections',
  templateUrl: './viewConnections.component.html',
  styleUrls: ['./viewConnections.component.scss']
})
export class ViewConnectionsComponent implements OnInit {

  constructor(
    public helperService: HelperService
  ) { }

  ngOnInit() {
  }

}
