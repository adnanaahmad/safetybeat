import { Component, OnInit, ViewChild } from '@angular/core';
import { Translation } from 'src/app/models/translate.model';
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
import { share } from 'rxjs/operators';
import { AlertModalComponent } from '../alert-modal/alert-modal.component';
import { HelperService } from 'src/app/shared/helperService/helper.service';

@Component({
  selector: "app-entityControl",
  templateUrl: "./entityControl.component.html",
  styleUrls: ["./entityControl.component.scss"]
})
export class EntityControlComponent implements OnInit {
  dialogConfig = new MatDialogConfig();
  displayedColumns: string[] = ["id", "name", "headOffice", "symbol"];
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
    private logging: LoggingService,
    public adminServices: AdminControlService,
    public helperService: HelperService
  ) {
    this.translated = this.helperService.translation;
    this.appIcons = ConstantService.appIcons;
    this.logging.appLoggerForDev(
      this.translated.LOGGER.STATUS.SUCCESS,
      this.translated.LOGGER.MESSAGES.ENTITYCONTROL
    );
  }

  ngOnInit() {
    this.viewAllEntities();
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
    this.joinEntityData = {
      moduleName: this.translated.BUTTONS.SAFETYBEAT
    };
    this.allEntitiesData = this.adminServices
      .viewEntities(this.joinEntityData)
      .pipe(share());
    this.allEntitiesData.subscribe(result => {
      this.empty = true;
      this.entitiesList = result.data;
      localStorage.setItem("entities", JSON.stringify(this.entitiesList));
      this.dataSource = new MatTableDataSource(this.entitiesList);
      this.dataSource.paginator = this.paginator;
    }, error => {
      this.helperService.logoutError(error.status)
    });
  }
}
