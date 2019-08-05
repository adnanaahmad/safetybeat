import {Component, OnInit, Inject, OnDestroy} from '@angular/core';
import {InviteUser, inviteUserData} from 'src/app/models/adminControl/inviteUser.model';
import {Validators, FormBuilder} from '@angular/forms';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {AdminControlService} from 'src/app/features/adminControl/services/adminControl.service';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {EntityInfo} from 'src/app/models/userEntityData.model';
import {ProfileService} from 'src/app/features/profile/services/profile.service';
import {MemberCenterService} from 'src/app/features/adminControl/modules/memberCenter/services/member-center.service';
import {PaginationData} from 'src/app/models/site.model';

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
      team: ['']
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
        if (this.inviteUserModal.success.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
          group.controls.email.setErrors({exists: true});
        }
      }, err => {
        this.helperService.logoutError(err.status);
      });
    }
  }


  /**
   * this function is used to register a user by taking information from Invite User form and checks if the
   * user is successfully invited or not
   * @params value
   * @params valid
   */
  inviteUser({value, valid}: { value: inviteUserData; valid: boolean }): void {
    this.inviteUserModal.loading = true;
    this.inviteUserModal.InviteUserData = {
      first_name: value.first_name,
      last_name: value.last_name,
      email: value.email,
      invitation: true,
      roleId: value.role.id,
      contactNo: '545535456',
      moduleName: 'Safetybeat',
      entityId: this.inviteUserModal.entityID,
      siteId: value.sites,
      teamId: value.team
    };
    if (!valid) {
      this.inviteUserModal.loading = false;
      this.helperService.createSnack(this.helperService.translated.LOGGER.MESSAGES.INVITEUSER_ERROR,
        this.helperService.constants.status.ERROR);
      return;
    }
    this.inviteUserModal.loading = true;
    this.navigationService.inviteUser(this.inviteUserModal.InviteUserData).subscribe((res) => {
      if (res) {
        this.inviteUserModal.loading = false;
        this.dialogRef.close();
        this.helperService.createSnack(this.helperService.translated.MESSAGES.INVITE_SUCCESS, this.helperService.constants.status.SUCCESS);
      }
    }, (err) => {
      this.inviteUserModal.loading = false;
      this.dialogRef.close();
      // this.helperService.createSnack(err.error, this.helperService.constants.status.ERROR,);
    });
  }

  changeSelection(role: any) {
    this.inviteUserModal.showSites = role.name === this.helperService.appConstants.roles.siteSafetyManager ? true : false;
    this.inviteUserModal.showTeams = role.name === this.helperService.appConstants.roles.teamLead ? true : false;
  }

  viewSitesData() {
    let entityData = {
      'entityId': this.helperService.getEntityId(),
    };
    let paginationData: PaginationData = {
      offset: null,
      limit: null,
      search: ''
    };
    this.adminServices.viewSites(entityData, paginationData).subscribe((res) => {
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.inviteUserModal.siteList = this.compiler.constructAllSitesData(res.data.sitesList);
        this.inviteUserModal.selectedSite = this.inviteUserModal.siteList[0];
        this.formValidation['sites'].setValue(this.inviteUserModal.selectedSite.id);
      } else {
        this.removeRole(this.helperService.appConstants.roles.siteSafetyManager);
      }
    });
  }

  viewTeamsData() {
    let entityData = {
      'entityId': this.helperService.getEntityId(),
    };
    let paginationData: PaginationData = {
      offset: null,
      limit: null,
      search: ''
    };
    this.adminServices.allTeamsData(entityData, paginationData).subscribe((res) => {
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.inviteUserModal.teamsList = res.data.teamsList;
        this.inviteUserModal.selectedTeam = this.inviteUserModal.teamsList[0].team;
        this.formValidation['team'].setValue(this.inviteUserModal.selectedTeam.id);
      } else {
        this.removeRole(this.helperService.appConstants.roles.teamLead);
      }
    });
  }

  removeRole(roleName) {
    this.helperService.remove(this.inviteUserModal.roleList,
      {name: roleName});

  }
}
