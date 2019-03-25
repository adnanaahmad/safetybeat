import { Component, OnInit, ViewChild, Input, AfterViewInit } from '@angular/core';
import { Translation } from 'src/app/models/translate.model';
import { TranslateService } from '@ngx-translate/core';
import { ConstantService } from 'src/app/shared/constant/constant.service';
import {
  MatDialogConfig,
  MatDialog,
  MatTableDataSource,
  MatPaginator
} from '@angular/material';
import { CreateEntityComponent } from '../createEntityModal/createEntity.component';
import { JoinEntityModalComponent } from '../joinEntityModal/joinEntityModal.component';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { AdminControlService } from '../../services/adminControl.service';
import { AlertModalComponent } from '../alert-modal/alert-modal.component';
import { NavigationComponent } from 'src/app/pages/navigation/components/navigation/navigation.component';
import { NavigationService } from 'src/app/pages/navigation/services/navigation.service';

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
  @ViewChild(NavigationComponent) navBar;
  translated: Translation;
  appIcons: any;
  joinEntityData: any;
  allEntitiesData: any = [];
  entitiesList: any = [];
  empty: boolean = false;
  createEntityOption:boolean=false;
  constructor(
    public dialog: MatDialog,
    public translate: TranslateService,
    private logging: LoggingService,
    public adminServices: AdminControlService,
    private navService:NavigationService
  ) {
    translate
      .get([
        'AUTH',
        'BUTTONS',
        'MESSAGES',
        'LOGGER',
        'STRINGS',
        'ICONS',
        'SITETITLE',
        'TABLEHEADINGS'
      ])
      .subscribe(values => {
        this.translated = values;
        this.appIcons = ConstantService.appIcons;
      });
    this.logging.appLoggerForDev(
      this.translated.LOGGER.STATUS.SUCCESS,
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
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.closeOnNavigation = false;
    this.dialog.open(CreateEntityComponent);
  }
  joinEntity() {
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.closeOnNavigation = false;
    this.dialog.open(JoinEntityModalComponent);
  }
  entityCode(code, name) {
    const dialogRef = this.dialog.open(AlertModalComponent, {
      data: { name: name, code: code }
    });
  }
  viewAllEntities() {
    var data = {
      'moduleName': 'Safetybeat'
    };
    this.navService.data.subscribe((res)=>{
      debugger;
      console.log(res);
      this.entitiesList = res;
      this.allEntitiesData = this.entitiesList.entities;
      this.dataSource = new MatTableDataSource(this.allEntitiesData);
      this.dataSource.paginator = this.paginator;
    })

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
