import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {MatDialogConfig, MatDialog, MatTableDataSource, MatPaginator} from '@angular/material';
import {CreateEntityComponent} from 'src/app/pages/adminControl/modules/entityControl/dialogs/createEntityModal/createEntity.component';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {EntityCodeModalComponent} from 'src/app/pages/adminControl/modules/entityControl/dialogs/entityCodeModal/entityCodeModal.component';
import {InviteTeamModalComponent} from 'src/app/pages/adminControl/modules/entityControl/dialogs/inviteTeamModal/inviteTeamModal.component';
import {ProfileService} from 'src/app/pages/profile/services/profile.service';
import {ConfirmationModalComponent} from 'src/app/Dialogs/conformationModal/confirmationModal.component';
import {AdminControlService} from 'src/app/pages/adminControl/services/adminControl.service';
import {CompilerProvider} from 'src/app/shared/compiler/compiler';
import {EntityControl, InviteTeamData} from 'src/app/models/adminControl/entityControl.model';
import {JoinEntityModalComponent} from 'src/app/pages/adminControl/modules/entityControl/dialogs/joinEntityModal/joinEntityModal.component';

@Component({
  selector: 'app-entityControl',
  templateUrl: './entityControl.component.html',
  styleUrls: ['./entityControl.component.scss']
})
export class EntityControlComponent implements OnInit, OnDestroy {

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
    this.helperService.toggleLoader(true);
    this.helperService.appLogger(
      this.helperService.constants.status.SUCCESS,
      this.helperService.translated.LOGGER.MESSAGES.ENTITYCONTROL
    );

    this.entityControl.subscription = this.navService.currentUserData.subscribe((res) => {
      this.entityControl.currentUserData = res;
    });
    this.entityControl.subscription = this.userService.usersData.subscribe(res => {
      if (res === 1) {
        this.getUsers();
      } else {
        this.entityControl.allUsersList = res;
        this.helperService.toggleLoader(false);
      }
    });
  }

  /**
   * this function is used to calling the functions that we need to be called on the
   * initialization of the component.
   */
  ngOnInit() {
    this.viewAllEntities();
    this.creationEnable();
    this.joinEnable();
  }

  /**
   * this function is used for unsubscription of the observables that we have subscribed using behavior subjects.
   * and this unsubscription will be called when the component will be destroyed.
   */
  ngOnDestroy() {
    this.entityControl.subscription.unsubscribe();
  }

  /**
   * this function is used for initialization of all the global varibales that we have made in the model
   * file.
   */

  initialize() {
    this.entityControl.createEntityOption = false;
    this.entityControl.allEntitiesData = [];
    this.entityControl.empty = false;
    this.entityControl.createEntityOption = false;
    this.entityControl.joinOption = false;
    this.entityControl.allUsersData = [];
    this.entityControl.displayedColumns = [
      'name',
      'headOffice',
      'role',
      'managedBy',
      'administrator',
      'symbol'
    ];
  }

  /**
   * this funnction is used to create createEntity Dialog and also we have assigned this disableClose true
   * so that the user would not be able to close the dialog until he/she clicks on the cancel button.
   */
  createEntity() {
    this.helperService.createDialog(CreateEntityComponent, {disableClose: true});
  }

  /**
   * this function is used for creating confirmation modal dialog in which the user will confirm while he/she
   * wants to proceed for the selected functionality or not by clicking on yes/no buttons.
   * @params entityId
   */

  confirmationModal(entityId: number) {
    this.helperService.createDialog(ConfirmationModalComponent,
      {data: {message: this.helperService.translated.CONFIRMATION.DELETE_ENTITY}});
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
   * this function is used to create entityCode Modal Dialog in which the entity code will be
   * shown on the modal dialog.
   * @params code
   * @params name
   */
  entityCode(code, name) {
    this.helperService.createDialog(EntityCodeModalComponent, {data: {name: name, code: code}});
  }

  /**
   * this function is used to show all the existing entities
   */
  viewAllEntities() {
    this.helperService.toggleLoader(true);
    this.entityControl.subscription = this.navService.data.subscribe((res) => {
      if (res && res !== 1) {
        this.helperService.toggleLoader(false);
        this.entityControl.allEntitiesData = res.entities;
        this.entityControl.dataSource = new MatTableDataSource(this.entityControl.allEntitiesData);
        this.entityControl.dataSource.paginator = this.paginator;
      } else {
        this.viewEntitiesApiCall();
      }
    }, (error) => {
      this.helperService.toggleLoader(false);
      this.helperService.createSnack(error.error, this.helperService.constants.status.ERROR);
    });
  }

  /**
   * this function is used to enable the create entity button on the basis of role
   * because in our case, owner will be allowed to create the entity.
   */
  creationEnable() {
    this.entityControl.subscription = this.navService.currentRole.subscribe(res => {
      this.entityControl.entitySelectedRole = res;
      if (this.entityControl.entitySelectedRole === this.helperService.appConstants.roles.owner) {
        this.entityControl.createEntityOption = true;
      } else {
        this.entityControl.createEntityOption = false;
      }
    });
  }

  /**
   * this function is used to enable the join entity button on the basis of roles because the owner,teamlead and
   * entity manager are allowed to join the entity and the user will not be able to join the entity of others.
   */

  joinEnable() {
    this.entityControl.subscription = this.navService.currentRole.subscribe(res => {
      this.entityControl.entitySelectedRole = res;
      if (
        this.entityControl.entitySelectedRole !== this.helperService.appConstants.roles.owner
      ) {
        this.entityControl.joinOption = true;
      } else {
        this.entityControl.joinOption = false;
      }
    });
  }

  /**
   * this function is used for getting all the users who are being invited to that particular entity.
   */

  getUsers() {
    this.helperService.toggleLoader(true);
    this.userService.getAllUsers().subscribe(
      result => {
        this.helperService.toggleLoader(false);
        this.userService.updateUsers(result.data);
      },
      (error) => {
        this.helperService.toggleLoader(false);
      }
    );
  }

  /**
   *  this function will be used when we will make the teams of the users and in that team we will add the users.
   * @params entityData
   */

  inviteTeam(entityData: InviteTeamData) {
    if (this.entityControl.allUsersList.length !== 0) {
      let self = this;
      this.helperService.iterations(this.entityControl.allUsersList, function (value) {
        if (value.email !== self.entityControl.currentUserData.email) {
          self.entityControl.allUsersData.push(value);
        }
      });
      let inviteTeamData = {
        entityData: entityData.entityInfo.code,
        usersData: this.entityControl.allUsersData
      };
      this.helperService.createDialog(InviteTeamModalComponent, {
        data: {inviteTeamData},
        disableClose: true
      });
    } else {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.NOUSER, this.helperService.translated.LOGGER.STATUS.ERROR);
    }
  }

  /**
   * this function is used to get the entities info regarding the user from the api call.
   */

  viewEntitiesApiCall() {
    this.helperService.toggleLoader(true);
    let data = {
      moduleName: 'Safetybeat'
    };
    this.adminServices.viewEntities(data).subscribe((res) => {
      this.helperService.toggleLoader(false);
      let entityUserData = this.compiler.constructUserEntityData(res.data);
      this.navService.changeEntites(entityUserData);
    }, (error) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ENTITY_DELETE_FAIL, this.helperService.translated.STATUS.ERROR);
    });
  }

  /**
   * this function is used for deleting the entities using their entity ids.
   * @params entityId
   */

  deleteEntity(entityId: number) {
    this.helperService.toggleLoader(true);
    this.adminServices.deleteEntity(entityId).subscribe(res => {
      this.viewEntitiesApiCall();
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ENTITY_DELETE, this.helperService.translated.STATUS.SUCCESS);
      this.helperService.toggleLoader(false);
    }, (error) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ENTITY_DELETE_FAIL, this.helperService.translated.STATUS.ERROR);
      this.helperService.toggleLoader(false);
    });
  }
}
