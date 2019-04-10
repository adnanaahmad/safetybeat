import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import {Translation} from 'src/app/models/translate.model';
import {
  MatDialogConfig,
  MatDialog,
  MatTableDataSource,
  MatPaginator
} from '@angular/material';
import {CreateEntityComponent} from 'src/app/pages/adminControl/components/createEntityModal/createEntity.component';
import {JoinEntityModalComponent} from 'src/app/pages/adminControl/components/joinEntityModal/joinEntityModal.component';
import {AdminControlService} from 'src/app/pages/adminControl/services/adminControl.service';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {AlertModalComponent} from 'src/app/pages/adminControl/components/entityCodeModal/entityCodeModal.component';
import {InviteTeamModalComponent} from 'src/app/pages/adminControl/components/inviteTeamModal/inviteTeamModal.component';
import {ProfileService} from 'src/app/pages/profile/services/profile.service';
import {share} from 'rxjs/operators';
import {EntityControl} from '../../../../models/adminControl/entityControl.model';

@Component({
  selector: 'app-entityControl',
  templateUrl: './entityControl.component.html',
  styleUrls: ['./entityControl.component.scss']
})
export class EntityControlComponent implements OnInit, AfterViewInit {

  entityControl: EntityControl = <EntityControl>{};
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public dialog: MatDialog,
    public adminServices: AdminControlService,
    public helperService: HelperService,
    private navService: NavigationService,
    private userService: ProfileService
  ) {
    this.initialize();
    this.entityControl.translated = this.helperService.translation;
    this.entityControl.appIcons = this.helperService.constants.appIcons;
    this.helperService.appLogger(
      this.helperService.constants.status.SUCCESS,
      this.entityControl.translated.LOGGER.MESSAGES.ENTITYCONTROL
    );
    this.userService.usersData.subscribe(res => {
      if (res === 1) {
        this.getUsers();
      } else {
        this.entityControl.allUsersList = res;
      }
    });
  }

  ngOnInit() {
    this.viewAllEntities();
    this.creationEnable();
    this.joinEnable();
  }

  initialize() {
    this.entityControl.empty = false;
    this.entityControl.createEntityOption = false;
    this.entityControl.dialogConfig = new MatDialogConfig();
    this.entityControl.dataSource = [];
    this.entityControl.allEntitiesData = [];
    this.entityControl.entitiesList = [];
    this.entityControl.empty = false;
    this.entityControl.createEntityOption = false;
    this.entityControl.joinOption = false;
    this.entityControl.displayedColumns = [
      'name',
      'headOffice',
      'role',
      'administrator',
      'symbol'
    ];
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
    this.helperService.createModal(AlertModalComponent, {
      data: {name: name, code: code}
    });
  }

  viewAllEntities() {
    this.entityControl.empty = true;
    let data = {
      moduleName: 'Safetybeat'
    };
    this.navService.data.subscribe(
      res => {
        this.entityControl.entitiesList = res;
        this.entityControl.allEntitiesData = this.entityControl.entitiesList.entities;
        this.entityControl.empty = false;
        this.entityControl.dataSource = new MatTableDataSource(this.entityControl.allEntitiesData);
        this.entityControl.dataSource.paginator = this.paginator;
      },
      error => {
        this.entityControl.empty = false;
        this.helperService.logoutError(error.status);
      }
    );
  }

  creationEnable() {
    this.navService.currentRole.subscribe(res => {
      this.entityControl.entitySelectedRole = res;
      if (this.entityControl.entitySelectedRole === 'Owner') {
        this.entityControl.createEntityOption = true;
      } else {
        this.entityControl.createEntityOption = false;
      }
    });
  }

  joinEnable() {
    this.navService.currentRole.subscribe(res => {
      this.entityControl.entitySelectedRole = res;
      if (
        this.entityControl.entitySelectedRole === 'Owner' ||
        this.entityControl.entitySelectedRole === 'TeamLead' ||
        this.entityControl.entitySelectedRole === 'EntityManager'
      ) {
        this.entityControl.joinOption = true;
      } else {
        this.entityControl.joinOption = false;
      }
    });
  }

  getUsers() {
    this.entityControl.allUsers = this.userService.getAllUsers().pipe(share());
    this.entityControl.allUsers.subscribe(
      result => {
        this.entityControl.empty = true;
        this.entityControl.allUsersList = result.data;
        this.userService.updateUsers(this.entityControl.allUsersList);
      },
      error => {
        this.helperService.logoutError(error.status);
      }
    );
  }

  inviteTeam(entityData: any) {
    if (this.entityControl.allUsersList.length !== 0) {
      let inviteTeamData = {
        entityData: entityData.entityInfo.code,
        usersData: this.entityControl.allUsersList
      };
      this.helperService.createModal(InviteTeamModalComponent, {
        data: {inviteTeamData}
      });
    } else {
      this.helperService.createSnack(this.entityControl.translated.MESSAGES.NOUSER,
        this.helperService.translation.MESSAGES.NOUSERTITLE, this.helperService.translation.LOGGER.STATUS.ERROR);
    }
  }
}
