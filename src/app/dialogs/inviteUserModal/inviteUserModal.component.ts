import {Component, OnInit, Inject, OnDestroy} from '@angular/core';
import {InviteUser, inviteUserData} from 'src/app/models/adminControl/inviteUser.model';
import {Validators, FormBuilder} from '@angular/forms';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {AdminControlService} from '../../features/adminControl/services/adminControl.service';
import {CompilerProvider} from '../../services/common/compiler/compiler';
import {EntityInfo} from '../../models/userEntityData.model';
import {share} from 'rxjs/operators';
import {ProfileService} from '../../features/profile/services/profile.service';
import {MemberCenterService} from '../../features/adminControl/modules/memberCenter/services/member-center.service';
import {PaginationData} from '../../models/site.model';

@Component({
  selector: 'app-inviteUserModal',
  templateUrl: './inviteUserModal.component.html',
  styleUrls: ['./inviteUserModal.component.scss']
})
export class InviteUserModalComponent implements OnInit, OnDestroy {
  inviteUserModal: InviteUser = <InviteUser>{};
  selectedEntity: EntityInfo;

  constructor(
    public dialogRef: MatDialogRef<InviteUserModalComponent>,
    public formBuilder: FormBuilder,
    private navigationService: NavigationService,
    public helperService: HelperService,
    public compiler: CompilerProvider,
    private userService: ProfileService,
    public adminServices: AdminControlService,
    private navService: NavigationService,
    public memberService: MemberCenterService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.helperService.appLoggerDev(this.helperService.constants.status.SUCCESS,
      this.helperService.translated.LOGGER.MESSAGES.CREATEENTITY);
    this.inviteUserModal.roleList = Object.assign([], this.data.role);
    this.inviteUserModal.entityID = this.data.entityId;
    this.inviteUserModal.selectedRole = this.inviteUserModal.roleList[0];
    this.changeSelection(this.inviteUserModal.selectedRole);
  }

  /**
   * this function is called after constructor and in this function we make a form named as inviteUserForm
   * and we assign all the input fields over here that we have to use to invite the users.
   */

  ngOnInit() {
    this.initialize();
    this.inviteUserModal.subscription = this.navService.selectedEntityData.subscribe(res => {
      this.selectedEntity = res.entityInfo;
    });
    this.inviteUserModal.inviteUserForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      sites: [''],
      teams: ['']
    });
    this.formValidation['role'].setValue(this.inviteUserModal.selectedRole);
    this.viewSitesData();
    this.viewTeamsData();
  }

  initialize() {
  }

  ngOnDestroy(): void {
    this.inviteUserModal.subscription.unsubscribe();
  }

  /**
   * This function is used to validate Invite User form and shows error if the form field is invalid
   */
  get formValidation() {
    return this.inviteUserModal.inviteUserForm.controls;
  }

  /**
   * this function is used to check if the email is valid or already exists
   * @params group
   */
  checkEmail(group) {
    this.inviteUserModal.email = this.formBuilder.group({
      'email': [group.value.email, Validators.email]
    });
    if (this.inviteUserModal.email.status === this.helperService.appConstants.emailValid) {
      const email = {email: group.value.email};
      this.navigationService.checkEmail(email).pipe().subscribe((res) => {
        this.inviteUserModal.success = res;
        if (this.inviteUserModal.success.responseDetails.code === this.helperService.appConstants.codeValidations[1]) {
          group.controls.email.setErrors({exists: true});
        }
      }, err => {
        this.helperService.logoutError(err.status);
      });
    }
  }

  /**
   * this function is used to call the get All user again and need to update observable so that when new user
   * comes after invitation then all users page will automatically be updated.
   */
  getAllUsers() {
    this.inviteUserModal.allUsers = this.userService.getAllUsers().pipe(share());
    this.inviteUserModal.allUsers.subscribe(
      result => {
        this.inviteUserModal.allUsersList = result.data;
        this.userService.updateUsers(this.inviteUserModal.allUsersList);
      },
      (error) => {
      }
    );
  }


  /**
   *
   */

  getAllEntityUsers(data) {
    this.memberService.entityUsers(data).subscribe((res) => {
      this.inviteUserModal.elements = this.compiler.entityUser(res);
      this.memberService.changeEntityUsers(this.inviteUserModal.elements);
    });
  }


  /**
   * this function is used to register a user by taking information from Invite User form and checks if the
   * user is successfully invited or not
   * @params value
   * @params valid
   */
  inviteUser({value, valid}: { value: inviteUserData; valid: boolean }): void {
    this.inviteUserModal.InviteUserData = {
      first_name: value.first_name,
      last_name: value.last_name,
      email: value.email,
      invitation: true,
      roleId: value.role.id,
      contactNo: '545535456',
      moduleName: 'Safetybeat',
      entityId: this.inviteUserModal.entityID,
      siteId: value.sites
    };
    if (!valid) {
      this.inviteUserModal.loading = false;
      this.helperService.appLoggerDev(this.helperService.constants.status.WARNING, valid);
      this.helperService.appLogger(this.helperService.constants.status.ERROR,
        this.helperService.translated.LOGGER.MESSAGES.INVITEUSER_ERROR);
      return;
    }
    this.inviteUserModal.loading = true;
    this.helperService.appLoggerDev(this.helperService.constants.status.INFO, valid);
    this.helperService.appLogger(this.helperService.constants.status.INFO, JSON.stringify(value));
    this.navigationService.inviteUser(this.inviteUserModal.InviteUserData).subscribe((res) => {
      this.getAllUsers();
      this.getAllEntityUsers({entityId: this.inviteUserModal.entityID});
      this.dialogRef.close();
      this.helperService.appLogger(this.helperService.constants.status.SUCCESS, this.helperService.translated.MESSAGES.INVITE_SUCCESS);
    }, (err) => {
      this.inviteUserModal.loading = false;
      this.helperService.appLogger(this.helperService.constants.status.ERROR, this.helperService.translated.MESSAGES.INVITE_FAILURE);
      this.dialogRef.close();
      this.helperService.logoutError(err.status);
    });
  }

  changeSelection(role: any) {
    this.inviteUserModal.showSites = role.name === this.helperService.appConstants.roles.siteSafetyManager ? true : false;
    this.inviteUserModal.showTeams = role.name === this.helperService.appConstants.roles.teamLead ? true : false;
  }

  viewSitesData() {
    let entityData = {
      'entityId': JSON.parse(this.helperService.decrypt(localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
        this.helperService.appConstants.key)),
    };
    let paginationData: PaginationData = {
      offset: null,
      limit: null,
      search: ''
    };
    this.adminServices.viewSites(entityData, paginationData).subscribe((res) => {
      this.inviteUserModal.siteList = this.compiler.constructAllSitesData(res.data.sitesList);
      // this.removeRole();
      this.inviteUserModal.selectedSite = this.inviteUserModal.siteList[0];
      this.formValidation['sites'].setValue(this.inviteUserModal.selectedSite.id);
    });
  }

  viewTeamsData() {
    let entityData = {
      'entityId': JSON.parse(this.helperService.decrypt(localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
        this.helperService.appConstants.key)),
    };
    let paginationData: PaginationData = {
      offset: null,
      limit: null,
      search: ''
    };
    this.adminServices.allTeamsData(entityData, paginationData).subscribe((res) => {
      this.inviteUserModal.teamsList = this.compiler.constructAllTeamsData(res);
      // this.removeRole();
      this.inviteUserModal.selectedTeam = this.inviteUserModal.teamsList[0];
      this.formValidation['teams'].setValue(this.inviteUserModal.selectedTeam.team.id);
    });
  }

  // removeRole() {
  //   if (this.inviteUserModal.siteList.length === 0) {
  //     this.helperService.remove(this.inviteUserModal.roleList,
  //       {name: this.helperService.appConstants.roles.siteSafetyManager});
  //   }
  // }
}
