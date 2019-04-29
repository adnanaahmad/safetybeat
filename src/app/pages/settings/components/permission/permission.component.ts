import { Component, OnInit } from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss']
})
export class PermissionComponent implements OnInit {

  constructor(
    public helperService: HelperService
  ) {}

  ngOnInit() {
  }

}
