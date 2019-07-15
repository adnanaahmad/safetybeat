import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {MemberCenterService} from 'src/app/features/adminControl/modules/memberCenter/services/member-center.service';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {MatTableDataSource, MatPaginator} from '@angular/material';
import {MemberCenter} from 'src/app/models/adminControl/memberCenter/memberCenter.model';
import {ChangeAccessLevelComponent} from 'src/app/features/adminControl/modules/memberCenter/dialogs/changeAccessLevel/changeAccessLevel.component';
import {ConfirmationModalComponent} from 'src/app/dialogs/conformationModal/confirmationModal.component';
import {ProfileService} from 'src/app/features/profile/services/profile.service';
import {InviteUserModalComponent} from 'src/app/dialogs/inviteUserModal/inviteUserModal.component';
import {PermissionsModel} from 'src/app/models/adminControl/permissions.model';


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
    this.initialize();
  }


  ngOnInit() {
    this.userService.getUser().subscribe(res => {
      this.memberCenter.user = res;
      this.memberCenter.userId = this.memberCenter.user.data.user.id;
    });
    this.navService.selectedEntityData.subscribe((res) => {
      this.memberCenter.currentRole = res.role;
    });
    this.navService.entityPermissions.subscribe((data: PermissionsModel) => {
      if (data) {
        this.memberCenter.permissions = data;
      }
    });
    this.getAllUsers(this.memberCenter.firstIndex, this.memberCenter.search);
  }

  ngOnDestroy() {
  }

  initialize() {
    this.memberCenter.firstIndex = 0;
    this.memberCenter.search = '';
    this.memberCenter.entityId = JSON.parse(this.helperService.decrypt(
      localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
      this.helperService.appConstants.key));
    this.memberCenter.pageSize = 10;
  }


  getAllUsers(pageIndex, search) {
    let data = {
      search: search,
      offset: pageIndex * this.helperService.appConstants.paginationLimit,
      limit: this.helperService.appConstants.paginationLimit
    };
    let entityId = {
      entityId: this.memberCenter.entityId,
    };
    this.memberService.entityUsers(entityId, data).subscribe((res) => {
      this.memberCenter.pageCount = res.data.pageCount;
      if (pageIndex === 0) {
        this.paginator.pageIndex = 0;
      }
      this.memberCenter.elements = this.compiler.entityUser(res.data.allUser);
      this.memberService.changeEntityUsers(this.memberCenter.elements);
      this.memberCenter.dataSource = new MatTableDataSource(this.memberCenter.elements);
      this.memberCenter.dataSource.paginator = this.paginator;
    }, error => {
      this.helperService.createSnack(error.error, this.helperService.constants.status.ERROR);
    });
  }

  viewProfile(element) {
    this.helperService.navigateWithData([this.helperService.appConstants.paths.profile,
      {data: JSON.stringify(element)}], {skipLocationChange: true});
  }

  /**
   * this function is used for calling  the functions on the basis of adding removing connections
   */

  connections(userObj: any) {
    (userObj.pendingConnection) ? ((userObj.nature) ? this.confirmConnections(userObj.id) :
      this.removeConnections(userObj.id)) : ((userObj.nature) ? this.addConnections(userObj.id) : this.removeConnections(userObj.id));
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
            this.getAllUsers(this.memberCenter.firstIndex, this.memberCenter.search);
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
            this.getAllUsers(this.memberCenter.firstIndex, this.memberCenter.search);
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
        this.getAllUsers(this.memberCenter.firstIndex, this.memberCenter.search);
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
        this.getAllUsers(this.memberCenter.firstIndex, this.memberCenter.search);
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
        this.getAllUsers(this.memberCenter.firstIndex, this.memberCenter.search);
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