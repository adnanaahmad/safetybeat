import { Component, OnInit, ViewChild, Input, AfterViewInit } from '@angular/core';
import { Translation } from 'src/app/models/translate.model';
import {
  MatDialogConfig,
  MatDialog,
  MatTableDataSource,
  MatPaginator
} from '@angular/material';
import { CreateEntityComponent } from '../../../../Dialogs/createEntityModal/createEntity.component';
import { JoinEntityModalComponent } from '../../../../Dialogs/joinEntityModal/joinEntityModal.component';
import { AdminControlService } from '../../services/adminControl.service';
import { HelperService } from 'src/app/shared/helperService/helper.service';
import { NavigationService } from 'src/app/pages/navigation/services/navigation.service';
import { AlertModalComponent } from '../../../../Dialogs/entityCodeModal/entityCodeModal.component';

@Component({
  selector: 'app-entityControl',
  templateUrl: './entityControl.component.html',
  styleUrls: ['./entityControl.component.scss']
})
export class EntityControlComponent implements OnInit, AfterViewInit {
  entitySelectedRole: string;
  dialogConfig = new MatDialogConfig();
  displayedColumns: string[] = ['name', 'headOffice', 'role', 'administrator', 'symbol'];
  dataSource: any = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  translated: Translation;
  appIcons: any;
  joinEntityData: any;
  allEntitiesData: any = [];
  entitiesList: any = [];
  empty: boolean = false;
  createEntityOption: boolean = false;

  constructor(
    public dialog: MatDialog,
    public adminServices: AdminControlService,
    public helperService: HelperService,
    private navService: NavigationService
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

  ngAfterViewInit() {
  }

  /**
   * this funnction is used to create Create Entity Dialog
   */
  createEntity() {
    this.helperService.createDialog(CreateEntityComponent)
  }

  /**
   * this function is used to create Join Entity Dialog
   */
  joinEntity() {
    this.helperService.createDialog(JoinEntityModalComponent)
  }

  /**
   * this function is used to create Alert Modal Dialog
   * @params code
   * @params name
   */
  entityCode(code, name) {
    this.helperService.createDialog(AlertModalComponent, { data: { name: name, code: code } });
  }

  /**
   * this function is used to show all the existing entities
   */
  viewAllEntities() {
    this.empty = true;
    let data = {
      'moduleName': 'Safetybeat'
    };
    this.navService.data.subscribe((res) => {
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

  /**
   * this function is used to....
   */
  creationEnable() {
    this.navService.currentRole.subscribe((res) => {
      this.entitySelectedRole = res;
      if (this.entitySelectedRole === 'Owner') {
        this.createEntityOption = true;
      } else {
        this.createEntityOption = false;
      }
    })
  }
}
