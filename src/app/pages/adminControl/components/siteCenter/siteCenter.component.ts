import { Component, OnInit } from '@angular/core';
import { Translation } from '../../../../models/translate.model';
import { HelperService } from '../../../../shared/helperService/helper.service';
import {
  MatDialogConfig,
  MatDialog,
  MatTableDataSource,
  MatPaginator
} from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { AdminControlService } from '../../services/adminControl.service';

@Component({
  selector: 'app-siteCenter',
  templateUrl: './siteCenter.component.html',
  styleUrls: ['./siteCenter.component.scss']
})
export class SiteCenterComponent implements OnInit {

  translated: Translation;
  dialogConfig = new MatDialogConfig();
  appIcons: any;
  sitesList: any;
  sitesData: any;
  constructor(
    public dialog: MatDialog,
    public helperService: HelperService,
    public adminServices: AdminControlService,
  ) { 
    this.translated = this.helperService.translation;
    this.appIcons = this.helperService.constants.appIcons;
  }

  ngOnInit() {
    this.viewAllSites();
  }

  viewAllSites() {
    var data = {
      entityId: 27
    };
    this.adminServices.viewSites(data).subscribe((res)=>{
      debugger
      this.sitesList = res;
      this.sitesData = this.sitesList.data;
      this.adminServices.changeSites(this.sitesData);
    });
  }
  
  

}
