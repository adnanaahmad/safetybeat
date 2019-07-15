import { Component, OnInit } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { HelperService } from 'src/app/services/common/helperService/helper.service';

@Component({
  selector: 'app-changeAccessLevel',
  templateUrl: './changeAccessLevel.component.html',
  styleUrls: ['./changeAccessLevel.component.scss']
})
export class ChangeAccessLevelComponent implements OnInit {

  constructor(
    public helperService: HelperService
  ) { }

  ngOnInit() {
  }

}
