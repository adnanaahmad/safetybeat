import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {MemberCenterService} from 'src/app/pages/adminControl/modules/memberCenter/services/member-center.service';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {CompilerProvider} from 'src/app/shared/compiler/compiler';
import {MatTableDataSource, MatPaginator} from '@angular/material';
import {MemberCenter} from 'src/app/models/adminControl/memberCenter/memberCenter.model';
import {ChangeAccessLevelComponent} from 'src/app/pages/adminControl/modules/memberCenter/dialogs/changeAccessLevel/changeAccessLevel.component';
import {ConfirmationModalComponent} from 'src/app/Dialogs/conformationModal/confirmationModal.component';
import {ProfileService} from 'src/app/pages/profile/services/profile.service';
import {InviteUserModalComponent} from 'src/app/Dialogs/inviteUserModal/inviteUserModal.component';


@Component({
  selector: 'app-memberCenter',
  templateUrl: './memberCenter.component.html',
  styleUrls: ['./memberCenter.component.scss']
})
export class MemberCenterComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  memberCenter: MemberCenter = <MemberCenter>{};
  displayedColumns: string[] = [
    'photos',
    'name',
    'email',
    'accessLevel',
    'symbol'
  ];

  constructor(public helperService: HelperService,
              public memberService: MemberCenterService,
              public navService: NavigationService,
              public compiler: CompilerProvider,
              public userService: ProfileService) {
    this.memberCenter.userStatus = false;
  }


  ngOnInit() {
    this.userService.getUser().subscribe(res => {
      this.memberCenter.user = res;
      this.memberCenter.userId = this.memberCenter.user.data.user.id;
    });
    this.navService.selectedEntityData.subscribe((res) => {
      this.memberCenter.currentRole = res.role;
    });
    this.memberCenter.subscription = this.memberService.entityUserObserver.subscribe((res) => {
      if (res !== 1) {
        this.memberCenter.dataSource = res;
      } else {
        this.getUsers();
      }
    });
  }

  ngOnDestroy() {
    this.memberCenter.subscription.unsubscribe();
  }

  getUsers() {
    this.memberCenter.subscription = this.navService.selectedEntityData.subscribe((res) => {
      if (res !== 1) {
        this.memberCenter.entityData = res;
        this.getAllUsers({entityId: this.memberCenter.entityData.entityInfo.id});
      }
    });
  }


  getAllUsers(data) {
    this.memberService.entityUsers(data).subscribe((res) => {
      this.memberCenter.elements = this.compiler.entityUser(res);
      this.memberService.changeEntityUsers(this.memberCenter.elements);
      this.memberCenter.dataSource = new MatTableDataSource(this.memberCenter.elements);
      this.memberCenter.dataSource.paginator = this.paginator;
    });
  }

  viewProfile(element) {
    this.helperService.navigateWithData([this.helperService.appConstants.paths.profile,
      {data: JSON.stringify(element)}], {skipLocationChange: true});
  }

  /**
   * this function is used for calling  the functions on the basis of adding removing connections
   */

  connections(type, params?: any) {
    switch (type) {
      case this.helperService.appConstants.connections.add:
        this.addConnections(params.userId);

        break;
      case this.helperService.appConstants.connections.remove:
        this.helperService.createDialog(ConfirmationModalComponent, {
          data: {
            message: this.helperService.translated.CONFIRMATION.REMOVE_CONNECTION
          }
        });
        this.helperService.dialogRef.afterClosed().subscribe(res => {
          if (res === this.helperService.appConstants.yes) {
            this.removeConnections(params.userId);
          }
        });
        break;
      case this.helperService.appConstants.connections.confirm:
        this.helperService.createDialog(ConfirmationModalComponent, {
          data: {
            message: this.helperService.translated.CONFIRMATION.CONFIRM_CONNECTION
          }
        });
        this.helperService.dialogRef.afterClosed().subscribe(res => {
          if (res === this.helperService.appConstants.yes) {
            this.confirmConnections(params.userId);
          }
        });
        break;
      default:
        break;
    }
  }

  accessLevel() {
    this.helperService.createDialog(ChangeAccessLevelComponent, {});
  }

  /**
   * this function is used for deactivating the users
   * userId  id of the selected user.
   * @params userId
   */

  deactivateUsers(userId) {
    this.helperService.createDialog(ConfirmationModalComponent, {
      data: {
        message: this.helperService.translated.CONFIRMATION.DEACTIVATE_USER
      }
    });
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      if (res === this.helperService.appConstants.yes) {
        let data = {id: userId};
        this.memberService.deactivateUser(data).subscribe((res) => {
          this.memberCenter.responseObj = res;
          if (this.memberCenter.responseObj.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
            this.getAllUsers({entityId: this.memberCenter.entityData.entityInfo.id});
          }
        });
      }
    });
  }

  /**
   * this function is used for activating the users
   * userId  id of the selected user.
   * @params userId
   */

  activateUsers(userId) {
    this.helperService.createDialog(ConfirmationModalComponent, {
      data: {
        message: this.helperService.translated.CONFIRMATION.ACTIVATE_USER
      }
    });
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      if (res === this.helperService.appConstants.yes) {
        let data = {id: userId};
        this.memberService.activateUser(data).subscribe((res) => {
          this.memberCenter.responseObj = res;
          if (this.memberCenter.responseObj.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
            this.getAllUsers({entityId: this.memberCenter.entityData.entityInfo.id});
          }
        });
      }
    });
  }

  /**
   * this function is used for adding connections
   * receivedBy  id of the selected user.
   * @params receivedBy
   */

  addConnections(sentToUserId: number) {
    this.memberService.addConnection({receivedBy: sentToUserId}).subscribe((res) => {
      if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ADD_CONNECTION_SUCCESS,
          this.helperService.constants.status.SUCCESS);
        this.getAllUsers({entityId: this.memberCenter.entityData.entityInfo.id});
      } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ADD_CONNECTION_FAILURE,
          res.responseDetails.message);
      }

    }, (error) => {
      this.helperService.appLogger(this.helperService.constants.status.ERROR, error);
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ADD_CONNECTION_FAILURE,
        this.helperService.constants.status.ERROR);
    });

  }

  /**
   * this function is used for removing connections
   * receivedBy  id of the selected user to remove.
   * @params receivedBy
   */

  removeConnections(sentToUserId: number) {
    this.memberService.removeConnection({receivedBy: sentToUserId}).subscribe((res) => {
      if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.REMOVE_CONNECTION_SUCCESS,
          this.helperService.constants.status.SUCCESS);
        this.getAllUsers({entityId: this.memberCenter.entityData.entityInfo.id});
      } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.REMOVE_CONNECTION_FAILURE,
          res.responseDetails.message);
      }

    }, (error) => {
      this.helperService.appLogger(this.helperService.constants.status.ERROR, error);
      this.helperService.createSnack(this.helperService.translated.MESSAGES.REMOVE_CONNECTION_FAILURE,
        this.helperService.constants.status.ERROR);
    });

  }

  confirmConnections(receivedFrom: number) {
    this.memberService.confirmConnection({sentBy: receivedFrom}).subscribe((res) => {
      if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.CONFIRM_CONNECTION_SUCCESS,
          this.helperService.constants.status.SUCCESS);
        this.getAllUsers({entityId: this.memberCenter.entityData.entityInfo.id});
      } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.CONFIRM_CONNECTION_FAILURE,
          res.responseDetails.message);
      }

    }, (error) => {
      this.helperService.appLogger(this.helperService.constants.status.ERROR, error);
      this.helperService.createSnack(this.helperService.translated.MESSAGES.CONFIRM_CONNECTION_FAILURE,
        this.helperService.constants.status.ERROR);
    });

  }

  /**
   * this function is used for creating the modal dialog of invite user and with this modal we also attach the all roles and
   * entity id of the selected entity.
   * @params entityId
   */
  inviteUser() {
    this.navService.getRoles().subscribe((roles) => {
      let entityId = JSON.parse(this.helperService.decrypt(localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
        this.helperService.appConstants.key));
      this.helperService.createDialog(InviteUserModalComponent, {data: {'role': roles, 'entityId': entityId}});
    });
  }
}
