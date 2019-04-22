import {Component, OnInit, ViewChild} from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {MemberCenterService} from 'src/app/pages/adminControl/modules/memberCenter/services/member-center.service';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {CompilerProvider} from 'src/app/shared/compiler/compiler';
import {MatTableDataSource, MatPaginator} from '@angular/material';
import {MemberCenter} from 'src/app/models/adminControl/memberCenter/memberCenter.model';
import {AddConnectionsComponent} from 'src/app/pages/adminControl/modules/memberCenter/dialogs/addConnections/addConnections.component';
import {ViewConnectionsComponent} from 'src/app/pages/adminControl/modules/memberCenter/dialogs/viewConnections/viewConnections.component';
import {RemoveConnectionsComponent} from 'src/app/pages/adminControl/modules/memberCenter/dialogs/removeConnections/removeConnections.component';
import {ChangeAccessLevelComponent} from 'src/app/pages/adminControl/modules/memberCenter/dialogs/changeAccessLevel/changeAccessLevel.component';
import {ConfirmationModalComponent} from 'src/app/Dialogs/conformationModal/confirmationModal.component';


@Component({
  selector: 'app-memberCenter',
  templateUrl: './memberCenter.component.html',
  styleUrls: ['./memberCenter.component.scss']
})
export class MemberCenterComponent implements OnInit {
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
              public compiler: CompilerProvider) {
    this.navService.selectedEntityData.subscribe((res) => {
      if (res !== 1) {
        this.memberCenter.entityData = res;
        this.getAllUsers({entityId: this.memberCenter.entityData.entityInfo.id})
      }
    })
  }


  ngOnInit() {

  }


  getAllUsers(data) {
    this.memberService.entityUsers(data).subscribe((res) => {
      this.memberCenter.elements = this.compiler.entityUser(res);
      this.memberCenter.dataSource = new MatTableDataSource(this.memberCenter.elements);
      this.memberCenter.dataSource.paginator = this.paginator;
    })
  }

  connections(type) {
    switch (type) {
      case this.helperService.appConstants.connections.view:
        this.helperService.createDialog(ViewConnectionsComponent, {});
        break;
      case this.helperService.appConstants.connections.add:
        this.helperService.createDialog(AddConnectionsComponent, {});
        break;
      case this.helperService.appConstants.connections.remove:
        this.helperService.createDialog(RemoveConnectionsComponent, {});
        break;
      default:
        break;
    }
  }

  accessLevel() {
    this.helperService.createDialog(ChangeAccessLevelComponent, {});
  }

  deactivateUsers(userId) {
    this.helperService.createDialog(ConfirmationModalComponent);
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
    this.helperService.createDialog(ConfirmationModalComponent);
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      if (res === this.helperService.appConstants.yes) {
        let data = {id: userId};
        this.memberService.activateUser(data).subscribe((res) => {
          this.getAllUsers({entityId: this.memberCenter.entityData.entityInfo.id})
        })
      }
    });
  }
}
