import { Component, OnInit } from '@angular/core';
import { HelperService } from 'src/app/services/common/helperService/helper.service';

@Component({
  selector: 'app-group-setting',
  templateUrl: './groupSetting.component.html',
  styleUrls: ['./groupSetting.component.scss']
})
export class GroupSettingComponent implements OnInit {

  constructor(
    public helperService: HelperService
  ) { }

  ngOnInit() {
  }

}
