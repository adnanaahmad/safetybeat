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
  MatPaginator, MatDialogRef
} from '@angular/material';
import {CreateEntityComponent} from 'src/app/Dialogs/createEntityModal/createEntity.component';
import {JoinEntityModalComponent} from 'src/app/Dialogs/joinEntityModal/joinEntityModal.component';
import {AdminControlService} from '../../services/adminControl.service';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {AlertModalComponent} from 'src/app/Dialogs/entityCodeModal/entityCodeModal.component';
import {InviteTeamModalComponent} from 'src/app/pages/adminControl/components/inviteTeamModal/inviteTeamModal.component';
import {ProfileService} from 'src/app/pages/profile/services/profile.service';
import {share} from 'rxjs/operators';
import {ConfirmationModalComponent} from 'src/app/Dialogs/conformationModal/confirmationModal.component';

@Component({
  selector: 'app-entityControl',
  templateUrl: './entityControl.component.html',
  styleUrls: ['./entityControl.component.scss']
})
export class EntityControlComponent implements OnInit, AfterViewInit {
  entitySelectedRole: string;
  dialogConfig = new MatDialogConfig();
  displayedColumns: string[] = [
    'name',
    'headOffice',
    'role',
    'administrator',
    'symbol'
  ];
  dataSource: any = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  translated: Translation;
  appIcons: any;
  allEntitiesData: any = [];
  entitiesList: any = [];
  empty: boolean = false;
  createEntityOption: boolean = false;
  joinOption: boolean = false;
  allUsers: any;
  allUsersList: any;

  constructor(
    public dialog: MatDialog,
    public adminServices: AdminControlService,
    public helperService: HelperService,
    private navService: NavigationService,
    private userService: ProfileService
  ) {
    this.initialize();
    this.translated = this.helperService.translation;
    this.appIcons = this.helperService.constants.appIcons;
    this.helperService.appLogger(
      this.helperService.constants.status.SUCCESS,
      this.translated.LOGGER.MESSAGES.ENTITYCONTROL
    );
    this.userService.usersData.subscribe(res => {
      if (res === 1) {
        this.getUsers();
      } else {
        this.allUsersList = res;
      }
    });
  }

  ngOnInit() {
    this.viewAllEntities();
    this.creationEnable();
    this.joinEnable();
  }

  initialize() {
    this.empty = false;
    this.createEntityOption = false;
  }

  ngAfterViewInit() {
  }

  /**
   * this funnction is used to create Create Entity Dialog
   */
  createEntity() {
    this.helperService.createDialog(CreateEntityComponent)
  }

  confirmationModal() {
    this.helperService.createDialog(ConfirmationModalComponent);
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      console.log(res)
    })
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
    this.helperService.createDialog(AlertModalComponent, {data: {name: name, code: code}});
  }

  /**
   * this function is used to show all the existing entities
   */
  viewAllEntities() {
    this.empty = true;
    let data = {
      moduleName: 'Safetybeat'
    };
    this.navService.data.subscribe(
      res => {
        this.entitiesList = res;
        this.allEntitiesData = this.entitiesList.entities;
        this.empty = false;
        this.dataSource = new MatTableDataSource(this.allEntitiesData);
        this.dataSource.paginator = this.paginator;
      },
      error => {
        this.empty = false;
        this.helperService.logoutError(error.status);
      }
    );
  }

  /**
   * this function is used to....
   */
  creationEnable() {
    this.navService.currentRole.subscribe(res => {
      this.entitySelectedRole = res;
      if (this.entitySelectedRole === 'Owner') {
        this.createEntityOption = true;
      } else {
        this.createEntityOption = false;
      }
    });
  }

  joinEnable() {
    this.navService.currentRole.subscribe(res => {
      this.entitySelectedRole = res;
      if (
        this.entitySelectedRole === 'Owner' ||
        this.entitySelectedRole === 'TeamLead' ||
        this.entitySelectedRole === 'EntityManager'
      ) {
        this.joinOption = true;
      } else {
        this.joinOption = false;
      }
    });
  }

  getUsers() {
    this.allUsers = this.userService.getAllUsers().pipe(share());
    this.allUsers.subscribe(
      result => {
        this.empty = true;
        this.allUsersList = result.data;
        this.userService.updateUsers(this.allUsersList);
      },
      error => {
        this.helperService.logoutError(error.status);
      }
    );
  }

  inviteTeam(entityData: any) {
    let inviteTeamData = {
      entityData: entityData.entityInfo.code,
      usersData: this.allUsersList
    };
    this.helperService.createDialog(InviteTeamModalComponent, {
      data: {inviteTeamData}
    });
  }
}
