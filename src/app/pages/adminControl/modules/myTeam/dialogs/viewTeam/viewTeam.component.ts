import {Component, Inject, OnInit} from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {MAT_DIALOG_DATA} from '@angular/material';
import {TeamList} from 'src/app/models/adminControl/myTeam.model';

@Component({
  selector: 'app-view-team',
  templateUrl: './viewTeam.component.html',
  styleUrls: ['./viewTeam.component.scss']
})
export class ViewTeamComponent implements OnInit {
  private team: TeamList[];

  constructor(public helperService: HelperService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.team = data;
  }

  ngOnInit() {
  }

}
