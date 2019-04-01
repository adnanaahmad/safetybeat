import { Component, OnInit, ViewChild, Input, AfterViewInit } from '@angular/core';
import { Translation } from 'src/app/models/translate.model';
import {
  MatDialogConfig,
  MatDialog,
  MatTableDataSource,
  MatPaginator
} from '@angular/material';
import { CreateEntityComponent } from '../createEntityModal/createEntity.component';
import { JoinEntityModalComponent } from '../joinEntityModal/joinEntityModal.component';
import { AdminControlService } from '../../services/adminControl.service';
import { HelperService } from 'src/app/shared/helperService/helper.service';
import { NavigationService } from 'src/app/pages/navigation/services/navigation.service';
import { AlertModalComponent } from '../entityCodeModal/entityCodeModal.component';

@Component({
  selector: 'app-entityControl',
  templateUrl: './entityControl.component.html',
  styleUrls: ['./entityControl.component.scss']
})
export class EntityControlComponent implements OnInit,AfterViewInit{
  entitySelectedRole:string;
  dialogConfig = new MatDialogConfig();
  displayedColumns: string[] = ['name', 'headOffice','role','administrator', 'symbol'];
  dataSource: any = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  translated: Translation;
  appIcons: any;
  joinEntityData: any;
  allEntitiesData: any = [];
  entitiesList: any = [];
  empty: boolean = false;
  createEntityOption:boolean=false;
  constructor(
    public dialog: MatDialog,
    public adminServices: AdminControlService,
    public helperService: HelperService,
    private navService : NavigationService
  ) {
    this.translated = this.helperService.translation;
    this.appIcons = this.helperService.constants.appIcons;
    this.helperService.appLogger(
      this.helperService.constants.status.SUCCESS,
      this.translated.LOGGER.MESSAGES.ENTITYCONTROL
    );
  }

  ngOnInit() {
    this.viewAllEntities();
    this.creationEnable();
  }

  ngAfterViewInit(){
  }
  createEntity() {
    this.helperService.createModal(CreateEntityComponent)
  }
  joinEntity() {
    this.helperService.createModal(JoinEntityModalComponent)
  }
  entityCode(code, name) {
    this.helperService.createModal(AlertModalComponent, { data: { name: name, code: code } });
  }
  viewAllEntities() {
    this.empty = true;
    var data = {
      'moduleName': 'Safetybeat'
    };
    this.navService.data.subscribe((res)=>{
      this.entitiesList = res;
      this.allEntitiesData = this.entitiesList.entities;
      this.empty = false;
      this.dataSource = new MatTableDataSource(this.allEntitiesData);
      this.dataSource.paginator = this.paginator;
    }, error => {
      this.empty = false;
      this.helperService.logoutError(error.status);
    });

  }
  creationEnable(){
    this.navService.currentRole.subscribe((res)=>{
      this.entitySelectedRole = res;
      if(this.entitySelectedRole==='Owner'){
        this.createEntityOption = true;
      } else{
        this.createEntityOption = false;
      }
    })
  }
}
