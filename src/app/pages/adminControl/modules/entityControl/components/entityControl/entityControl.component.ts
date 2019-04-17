import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {MatDialogConfig, MatDialog, MatTableDataSource, MatPaginator} from '@angular/material';
import {CreateEntityComponent} from 'src/app/pages/adminControl/modules/entityControl/dialogs/createEntityModal/createEntity.component';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {AlertModalComponent} from 'src/app/pages/adminControl/modules/entityControl/dialogs/entityCodeModal/entityCodeModal.component';
import {InviteTeamModalComponent} from 'src/app/pages/adminControl/modules/entityControl/dialogs/inviteTeamModal/inviteTeamModal.component';
import {ProfileService} from 'src/app/pages/profile/services/profile.service';
import {share} from 'rxjs/operators';
import {ConfirmationModalComponent} from 'src/app/Dialogs/conformationModal/confirmationModal.component';
import {AdminControlService} from 'src/app/pages/adminControl/services/adminControl.service';
import {CompilerProvider} from '../../../../../../shared/compiler/compiler';
import {EntityControl} from '../../../../../../models/adminControl/entityControl.model';
import {JoinEntityModalComponent} from '../../dialogs/joinEntityModal/joinEntityModal.component';

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
    private userService: ProfileService,
    private compiler: CompilerProvider
  ) {
    this.initialize();
    this.helperService.toggleLoader(true)
    this.helperService.appLogger(
      this.helperService.constants.status.SUCCESS,
      this.helperService.translated.LOGGER.MESSAGES.ENTITYCONTROL
    );
    this.userService.usersData.subscribe(res => {
      if (res === 1) {
        this.getUsers();
      } else {
        this.entityControl.allUsersList = res;
        this.helperService.toggleLoader(false)
      }
    });
  }

  ngOnInit() {
    this.viewAllEntities();
    this.creationEnable();
    this.joinEnable();
  }

  initialize() {
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
    this.helperService.displayLoader.subscribe((res) => {
      this.entityControl.displayLoader = res;
    })
  }

  /**
   * this funnction is used to create Create Entity Dialog
   */
  createEntity() {
    this.helperService.createDialog(CreateEntityComponent, {disableClose: true});
  }

  confirmationModal(entityId: number) {
    this.helperService.createDialog(ConfirmationModalComponent);
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      if (res === this.helperService.appConstants.yes) {
        this.helperService.toggleLoader(true);
        this.deleteEntity(entityId);
      }
    });
  }

  /**
   * this function is used to create Join Entity Dialog
   */
  joinEntity() {
    this.helperService.createDialog(JoinEntityModalComponent, {disableClose: true});
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
    this.helperService.toggleLoader(true)
    let data = {
      moduleName: 'Safetybeat'
    };
    this.navService.data.subscribe(
      res => {
        if (res === 1) {
          this.helperService.toggleLoader(true);
          this.viewEntitiesApiCall();
        } else {
          this.helperService.toggleLoader(false);
          this.entityControl.displayLoader = false;
          this.entityControl.entitiesList = res;
          this.entityControl.allEntitiesData = this.entityControl.entitiesList.entities;
          this.entityControl.dataSource = new MatTableDataSource(this.entityControl.allEntitiesData);
          this.entityControl.dataSource.paginator = this.paginator;
        }
      },
      error => {
        this.helperService.toggleLoader(false)
        this.helperService.logoutError(error.status);
      }
    );
  }

  /**
   * this function is used to....
   */
  creationEnable() {
    this.navService.currentRole.subscribe(res => {
      this.entityControl.entitySelectedRole = res;
      if (this.entityControl.entitySelectedRole === this.helperService.appConstants.roles.owner) {
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
        this.entityControl.entitySelectedRole === this.helperService.appConstants.roles.owner ||
        this.entityControl.entitySelectedRole === this.helperService.appConstants.roles.teamLead ||
        this.entityControl.entitySelectedRole === this.helperService.appConstants.roles.entityManager
      ) {
        this.entityControl.joinOption = true;
      } else {
        this.entityControl.joinOption = false;
      }
    });
  }

  getUsers() {
    this.helperService.toggleLoader(true)
    this.entityControl.allUsers = this.userService.getAllUsers().pipe(share());
    this.entityControl.allUsers.subscribe(
      result => {
        this.helperService.toggleLoader(false);
        this.entityControl.allUsersList = result.data;
        this.userService.updateUsers(this.entityControl.allUsersList);
      },
      error => {
        this.helperService.logoutError(error.status);
        this.helperService.toggleLoader(false)
      }
    );
  }

  inviteTeam(entityData: any) {
    if (this.entityControl.allUsersList.length !== 0) {
      let inviteTeamData = {
        entityData: entityData.entityInfo.code,
        usersData: this.entityControl.allUsersList
      };
      this.helperService.createDialog(InviteTeamModalComponent, {
        data: {inviteTeamData},
        disableClose: true
      });
    } else {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.NOUSER,
        this.helperService.translated.MESSAGES.NOUSERTITLE, this.helperService.translated.LOGGER.STATUS.ERROR);
    }
  }

  viewEntitiesApiCall() {
    this.entityControl.displayLoader = true;
    let data = {
      moduleName: 'Safetybeat'
    };
    this.adminServices.viewEntities(data).subscribe((res) => {
      this.helperService.toggleLoader(false);
      this.helperService.displayLoader.subscribe((resp) => {
        this.entityControl.displayLoader = resp;
        this.entityControl.entitiesList = res;
        let entityUserData = this.compiler.constructUserEntityData(this.entityControl.entitiesList.data);
        this.navService.changeEntites(entityUserData);
      })
    });
  }

  deleteEntity(entityId: any) {
    this.helperService.toggleLoader(true);
    this.adminServices.deleteEntity(entityId).subscribe(res => {
      this.viewEntitiesApiCall();
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ENTITY_DELETE,
        this.helperService.translated.MESSAGES.ENTITY_DELETE_TITLE,
        this.helperService.translated.STATUS.SUCCESS);
      this.helperService.toggleLoader(false);
    }, (error) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ENTITY_DELETE_FAIL,
        this.helperService.translated.MESSAGES.ENTITY_DELETE_FAIL_TITLE, this.helperService.translated.STATUS.ERROR);
      this.helperService.toggleLoader(false);
    });
  }
}
