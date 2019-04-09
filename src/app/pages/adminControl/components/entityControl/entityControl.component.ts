import {Component, OnInit, ViewChild, Input, AfterViewInit} from '@angular/core';
import {Translation} from 'src/app/models/translate.model';
import {
  MatDialogConfig,
  MatDialog,
  MatTableDataSource,
  MatPaginator
} from '@angular/material';
import {CreateEntityComponent} from '../createEntityModal/createEntity.component';
import {JoinEntityModalComponent} from '../joinEntityModal/joinEntityModal.component';
import {AdminControlService} from '../../services/adminControl.service';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {AlertModalComponent} from '../entityCodeModal/entityCodeModal.component';
import {EntityControl} from '../../../../models/adminControl/entityControl.model';

@Component({
  selector: 'app-entityControl',
  templateUrl: './entityControl.component.html',
  styleUrls: ['./entityControl.component.scss']
})
export class EntityControlComponent implements OnInit, AfterViewInit {
  entitySelectedRole: string;
  dialogConfig = new MatDialogConfig();
  displayedColumns: string[] = ['name', 'headOffice', 'role', 'administrator', 'symbol'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  entityControl: EntityControl = <EntityControl>{};

  constructor(
    public dialog: MatDialog,
    public adminServices: AdminControlService,
    public helperService: HelperService,
    private navService: NavigationService
  ) {
    this.initialize();
    this.entityControl.translated = this.helperService.translation;
    this.entityControl.appIcons = this.helperService.constants.appIcons;
    this.helperService.appLogger(
      this.helperService.constants.status.SUCCESS,
      this.entityControl.translated.LOGGER.MESSAGES.ENTITYCONTROL
    );
  }

  ngOnInit() {
    this.viewAllEntities();
    this.creationEnable();
  }

  initialize() {
    this.entityControl.empty = false;
    this.entityControl.createEntityOption = false;
  }

  ngAfterViewInit() {
  }

  createEntity() {
    this.helperService.createModal(CreateEntityComponent);
  }

  joinEntity() {
    this.helperService.createModal(JoinEntityModalComponent);
  }

  entityCode(code, name) {
    this.helperService.createModal(AlertModalComponent, {data: {name: name, code: code}});
  }

  viewAllEntities() {
    this.entityControl.empty = true;
    let data = {
      'moduleName': 'Safetybeat'
    };
    this.navService.data.subscribe((res) => {
      this.entityControl.entitiesList = res;
      this.entityControl.allEntitiesData = this.entityControl.entitiesList.entities;
      this.entityControl.empty = false;
      this.entityControl.dataSource = new MatTableDataSource(this.entityControl.allEntitiesData);
      this.entityControl.dataSource.paginator = this.paginator;
    }, error => {
      this.entityControl.empty = false;
      this.helperService.logoutError(error.status);
    });

  }

  creationEnable() {
    this.navService.currentRole.subscribe((res) => {
      this.entitySelectedRole = res;
      if (this.entitySelectedRole === 'Owner') {
        this.entityControl.createEntityOption = true;
      } else {
        this.entityControl.createEntityOption = false;
      }
    });
  }
}
