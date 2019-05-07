import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {MemberCenterService} from 'src/app/pages/adminControl/modules/memberCenter/services/member-center.service';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {CompilerProvider} from 'src/app/shared/compiler/compiler';
import {MatTableDataSource, MatPaginator} from '@angular/material';
import {MemberCenter} from 'src/app/models/adminControl/memberCenter/memberCenter.model';
import {ViewConnectionsComponent} from 'src/app/pages/adminControl/modules/memberCenter/dialogs/viewConnections/viewConnections.component';
import {ChangeAccessLevelComponent} from 'src/app/pages/adminControl/modules/memberCenter/dialogs/changeAccessLevel/changeAccessLevel.component';
import {ConfirmationModalComponent} from 'src/app/Dialogs/conformationModal/confirmationModal.component';
import {ProfileService} from '../../../../../profile/services/profile.service';


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
    'contact',
    'accessLevel',
    'symbol'
  ];

  constructor(public helperService: HelperService,
              public memberService: MemberCenterService,
              public navService: NavigationService,
              public compiler: CompilerProvider,
              public userService: ProfileService) {
  }


  ngOnInit() {
    this.memberCenter.subscription = this.navService.selectedEntityData.subscribe((res) => {
      if (res !== 1) {
        this.memberCenter.entityData = res;
        this.getAllUsers({entityId: this.memberCenter.entityData.entityInfo.id});
      }
    });
    this.userService.getUser().subscribe(res => {
      this.memberCenter.user = res;
      this.memberCenter.userId = this.memberCenter.user.data.user.id;
    });
    this.navService.selectedEntityData.subscribe((res) => {
      this.memberCenter.currentRole = res.role ;
    });

  }

  ngOnDestroy() {
    this.memberCenter.subscription.unsubscribe();
  }


  getAllUsers(data) {
    this.memberService.entityUsers(data).subscribe((res) => {
      this.memberCenter.elements = this.compiler.entityUser(res);
      this.memberCenter.dataSource = new MatTableDataSource(this.memberCenter.elements);
      this.memberCenter.dataSource.paginator = this.paginator;
    })
  }

  viewProfile(element) {
    this.helperService.navigateWithData([this.helperService.appConstants.paths.profile, {data: JSON.stringify(element)}],
      {skipLocationChange: true});
  }

  connections(type, params?: any) {
    switch (type) {
      case this.helperService.appConstants.connections.view:
        this.helperService.createDialog(ViewConnectionsComponent, {});
        break;
      case this.helperService.appConstants.connections.add:
        this.helperService.createDialog(ConfirmationModalComponent, {
          data: {
            message: this.helperService.translated.CONFIRMATION.ADD_CONNECTION
          }
        });
        this.helperService.dialogRef.afterClosed().subscribe(res => {
          if (res === this.helperService.appConstants.yes) {
            this.addConnections(params.userId);
          }
        });
        break;
      case this.helperService.appConstants.connections.remove:
        // this.helperService.createDialog(RemoveConnectionsComponent, {});
        this.helperService.createDialog(ConfirmationModalComponent, {
          data: {
            message: this.helperService.translated.CONFIRMATION.REMOVE_CONNECTION
          }
        });
        this.helperService.dialogRef.afterClosed().subscribe(res => {
          if (res === this.helperService.appConstants.yes) {
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
          this.getAllUsers({entityId: this.memberCenter.entityData.entityInfo.id})
        })
      }
    });
  }

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
          this.getAllUsers({entityId: this.memberCenter.entityData.entityInfo.id})
        })
      }
    });
  }


  addConnections(sentToUserId: number) {
    let connectionAddingData = {
      'receivedBy': sentToUserId
    };

    this.memberService.addConnection(connectionAddingData).subscribe((res) => {
      if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ADD_CONNECTION_SUCCESS,
          this.helperService.constants.status.SUCCESS);
      } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ADD_CONNECTION_FAILURE,
          res.responseDetails.message);
      }

    }, (error) => {
      this.helperService.appLogger(this.helperService.constants.status.ERROR, error);
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ADD_CONNECTION_FAILURE,
        this.helperService.constants.status.ERROR);
    })

  }
}
