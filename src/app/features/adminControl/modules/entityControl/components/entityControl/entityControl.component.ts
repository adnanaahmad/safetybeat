import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {MatDialog, MatTableDataSource, MatPaginator} from '@angular/material';
import {CreateEntityComponent} from 'src/app/features/adminControl/modules/entityControl/dialogs/createEntityModal/createEntity.component';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {EntityCodeModalComponent} from 'src/app/features/adminControl/modules/entityControl/dialogs/entityCodeModal/entityCodeModal.component';
import {InviteTeamModalComponent} from 'src/app/features/adminControl/modules/entityControl/dialogs/inviteTeamModal/inviteTeamModal.component';
import {ProfileService} from 'src/app/features/profile/services/profile.service';
import {ConfirmationModalComponent} from 'src/app/dialogs/conformationModal/confirmationModal.component';
import {AdminControlService} from 'src/app/features/adminControl/services/adminControl.service';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {EntityControl, InviteTeamData} from 'src/app/models/adminControl/entityControl.model';
import {JoinEntityModalComponent} from 'src/app/features/adminControl/modules/entityControl/dialogs/joinEntityModal/joinEntityModal.component';
import {PermissionsModel} from 'src/app/models/adminControl/permissions.model';
import {Entity} from 'src/app/models/userEntityData.model';
import {MemberCenterService} from 'src/app/features/adminControl/modules/memberCenter/services/member-center.service';

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
    private compiler: CompilerProvider,
    private memberService: MemberCenterService,
  ) {
    this.initialize();
    this.helperService.toggleLoader(true);

    this.entityControl.subscription = this.navService.currentUserData.subscribe((res) => {
      if (res) {
        this.entityControl.currentUserData = res;
      }
    });
  }

  /**
   * this function is used to calling the functions that we need to be called on the
   * initialization of the component.
   */
  ngOnInit() {
    this.viewAllEntities();
    this.entityControl.entityId = this.helperService.getEntityId();
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
    this.navService.entityPermissions.subscribe((data: PermissionsModel) => {
      if (data) {
        this.entityControl.permissions = data;
      }
    });
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
  entityCode(entityData: Entity) {
    this.helperService.createDialog(EntityCodeModalComponent, {
      data: {
        entity: entityData.entityInfo,
        permissions: this.entityControl.permissions.refreshEntityCode
      }
    });
  }

  /**
   * this function is used to show all the existing entities
   */
  viewAllEntities() {
    this.helperService.toggleLoader(true);
    this.entityControl.displayLoader = true;
    this.entityControl.subscription = this.navService.data.subscribe((res) => {
      if (res && res !== 1) {
        this.entityControl.displayLoader = false;
        this.helperService.toggleLoader(false);
        this.entityControl.allEntitiesData = res.entities;
        this.entityControl.dataSource = new MatTableDataSource(this.entityControl.allEntitiesData);
        this.entityControl.dataSource.paginator = this.paginator;
      } else {
        this.viewEntitiesApiCall();
      }
    }, (error) => {
      this.entityControl.displayLoader = false;
      this.helperService.toggleLoader(false);
      this.helperService.createSnack(error.error, this.helperService.constants.status.ERROR);
    });
  }

  /**
   *  this function will be used when we will make the teams of the users and in that team we will add the users.
   * @params entityData
   */

  inviteTeam(entityData: InviteTeamData) {
    let self = this;
    this.memberService.allEntityUsers({entityId: this.entityControl.entityId}).subscribe((res) => {
      if (res) {
        let users = this.helperService.remove(this.compiler.constructDataForTeams(res.data), function (user) {
          return user.email !== self.entityControl.currentUserData.email;
        });
        let inviteTeamData = {
          entityData: entityData.entityInfo.code,
          usersData: users
        }
        this.helperService.createDialog(InviteTeamModalComponent, {
          data: {inviteTeamData},
          disableClose: true
        });
      }
    }, (error) => {
      this.helperService.createSnack(error.error, this.helperService.constants.status.ERROR);
    });
  }

  /**
   * this function is used to get the entities info regarding the user from the api call.
   */

  viewEntitiesApiCall() {
    this.helperService.toggleLoader(true);
    let data = {
      moduleName: 'Safetybeat'
    };
    this.entityControl.displayLoader = true;
    this.adminServices.viewEntities(data).subscribe((res) => {
      if (res) {
        this.entityControl.displayLoader = false;
        this.helperService.toggleLoader(false);
        let entityUserData = this.compiler.constructUserEntityData(res.data);
        this.navService.changeEntites(entityUserData);
      }
    }, (error) => {
      this.entityControl.displayLoader = false;
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
