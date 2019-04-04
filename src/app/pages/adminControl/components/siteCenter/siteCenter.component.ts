import { Component, OnInit, ViewChild, Compiler, AfterViewInit } from '@angular/core';
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
import { SitesInfo } from '../../../../models/site.model';
import { CompilerProvider } from '../../../../shared/compiler/compiler';
import { NavigationService } from '../../../navigation/services/navigation.service';
import { AddSiteModalComponent } from '../addSiteModal/addSiteModal.component';

@Component({
  selector: 'app-siteCenter',
  templateUrl: './siteCenter.component.html',
  styleUrls: ['./siteCenter.component.scss']
})
export class SiteCenterComponent implements OnInit{

  translated: Translation;
  dialogConfig = new MatDialogConfig();
  dataSource: any = [];
  appIcons: any;
  sitesList: any;
  sitesData: SitesInfo[];
  displayedColumns: string[] = ['name', 'location','safeZone','createdBy', 'symbol'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  entityData: any;
  entityId: any;
  constructor(
    public dialog: MatDialog,
    public helperService: HelperService,
    public adminServices: AdminControlService,
    public compiler: CompilerProvider,
    private navService:NavigationService
  ) { 
    this.translated = this.helperService.translation;
    this.appIcons = this.helperService.constants.appIcons;
    this.navService.selectedEntityData.subscribe((res)=>{
      this.entityData = res;
      this.entityId = this.entityData.entityInfo.id;
    });
  }

  ngOnInit() {
    this.viewAllSites();
  }

  viewAllSites() {
    var data = {
      'entityId': this.entityId
    };
    this.adminServices.viewSites(data).subscribe((res)=>{
      this.sitesList = res;
      this.sitesData = this.compiler.constructSiteData(this.sitesList)
      this.dataSource = new MatTableDataSource(this.sitesData);
      this.dataSource.paginator = this.paginator;
      this.adminServices.changeSites(this.sitesData);
    });
  }
  
  addSite() {
    this.helperService.createModal(AddSiteModalComponent)
  }
  

}
