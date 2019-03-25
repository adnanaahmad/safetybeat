import { Component, OnInit, ViewChild } from '@angular/core';
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
import * as _ from 'lodash';
import { share } from 'rxjs/operators';
import { AlertModalComponent } from '../alert-modal/alert-modal.component';

@Component({
  selector: 'app-entityControl',
  templateUrl: './entityControl.component.html',
  styleUrls: ['./entityControl.component.scss']
})
export class EntityControlComponent implements OnInit {
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
  constructor(
    public dialog: MatDialog,
    public translate: TranslateService,
    private logging: LoggingService,
    public adminServices: AdminControlService
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
    this.entitiesList = JSON.parse(localStorage.getItem('entityUserData'));
    this.allEntitiesData = this.entitiesList.entities;
      this.dataSource = new MatTableDataSource(this.allEntitiesData);
      this.dataSource.paginator = this.paginator;
  }
}
