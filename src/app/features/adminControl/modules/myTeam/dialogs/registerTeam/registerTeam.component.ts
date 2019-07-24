import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {RegisterTeamModel} from 'src/app/models/adminControl/registerTeam.model';
import {FormBuilder, Validators} from '@angular/forms';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AdminControlService} from 'src/app/features/adminControl/services/adminControl.service';

@Component({
  selector: 'app-register-team',
  templateUrl: './registerTeam.component.html',
  styleUrls: ['./registerTeam.component.scss']
})
export class RegisterTeamComponent implements OnInit {

  registerTeamObj: RegisterTeamModel = <RegisterTeamModel>{};
  @ViewChild('userInput') userInput: ElementRef<HTMLInputElement>;


  constructor(public dialogRef: MatDialogRef<RegisterTeamComponent>,
              public helperService: HelperService,
              public formBuilder: FormBuilder,
              public compiler: CompilerProvider,
              private adminServices: AdminControlService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.initialize();

  }

  ngOnInit() {
    this.registerTeamObj.registerTeamForm = this.formBuilder.group({
      title: ['', Validators.required],

    });
    if (this.registerTeamObj.editTeam) {
      this.getFormControls['title'].setValue(this.data.teamList.team.title);
      this.registerTeamObj.teamLeadID = this.data.teamList.teamLead.id;
      this.registerTeamObj.selectedUsers = this.compiler.constructUserDataOfTeam(this.data.teamList.users);
      this.registerTeamObj.filteredSelectedList = Array.from(this.registerTeamObj.selectedUsers)
    }
  }

  get getFormControls() {
    return this.registerTeamObj.registerTeamForm.controls;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  initialize() {
    this.registerTeamObj.editTeam = this.data.Modal;
    this.registerTeamObj.allUsersList = this.data.allUsersOfTeam;
    this.registerTeamObj.filteredSelectedList = [];
    this.registerTeamObj.teamLeadID = null;
    this.registerTeamObj.selectedUsers = [];
    this.registerTeamObj.valid = false;
    this.registerTeamObj.loading = false;
    this.registerTeamObj.allUsers = this.data.allUsersOfTeam;
  }

  teamFormSubmit({value, valid}: { value: any; valid: boolean }) {
    if (this.registerTeamObj.teamLeadID === null) {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.SELECT_TEAMLEAD, this.helperService.constants.status.WARNING);
    } else {
      this.registerTeamObj.editTeam ? this.editTeam(value) : this.registerTeam(value);
    }
  }

  filterAllUserList(value) {
    let filterValue = value.toLowerCase();
    this.registerTeamObj.allUsers = this.registerTeamObj.allUsersList.filter(
      user => user.name.toLowerCase().startsWith(filterValue));
  }

  editTeam(value) {
    this.registerTeamObj.loading = true;
    this.adminServices.editTeam(this.data.teamList.team.id, this.teamData(value)).subscribe(res => {
      if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.registerTeamObj.loading = false;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.TEAM_UPDATED,
          this.helperService.constants.status.SUCCESS);
        this.onNoClick();
      } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
        this.registerTeamObj.loading = false;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.TEAM_UPDATED,
          this.helperService.constants.status.ERROR);
      }
    }, (error) => {
      this.registerTeamObj.loading = false;
      this.helperService.createSnack(this.helperService.translated.MESSAGES.TEAM_UPDATE_FAILED,
        this.helperService.constants.status.ERROR);
    });
  }

  /**
   * this function takes data of selected user and team lead and registers the team
   * @params value
   */

  registerTeam(value) {
    this.registerTeamObj.loading = true;
    this.adminServices.registerTeam(this.teamData(value)).subscribe(res => {
        if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
          this.registerTeamObj.loading = false;
          this.helperService.createSnack(this.helperService.translated.MESSAGES.TEAM_REGISTERED,
            this.helperService.constants.status.SUCCESS);
          this.onNoClick();
        } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[5]) {
          this.onNoClick();
          this.registerTeamObj.loading = false;
          this.helperService.createSnack(this.helperService.translated.MESSAGES.TEAM_ALREADY_EXIST,
            this.helperService.constants.status.ERROR);
        } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
          this.onNoClick();
          this.registerTeamObj.loading = false;
          this.helperService.createSnack(this.helperService.translated.MESSAGES.TEAM_REGISTRATION_FAILED,
            this.helperService.constants.status.ERROR);
        }
      }, (error) => {
        this.onNoClick();
        this.registerTeamObj.loading = false;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.TEAM_REGISTRATION_FAILED,
          this.helperService.constants.status.ERROR);
      }
    );
  }

  /**
   * this function pushes selected user's info to the array
   * @params user
   */
  addToSelected(user) {
    this.registerTeamObj.selectedUsers.push(user);
    this.registerTeamObj.filteredSelectedList.push(user);
  }

  /**
   *this function removes the user from list on remove button
   * @params selectedUser
   */
  removeFromSelected(selectedUser: any) {
    if (selectedUser.id === this.registerTeamObj.teamLeadID) {
      this.registerTeamObj.teamLeadID = null;
    }
    let index: number = this.registerTeamObj.selectedUsers.indexOf(selectedUser);
    if (index !== -1) {
      this.registerTeamObj.selectedUsers.splice(index, 1);
    }
    let index2: number = this.registerTeamObj.filteredSelectedList.indexOf(selectedUser);
    if (index2 !== -1) {
      this.registerTeamObj.filteredSelectedList.splice(index2, 1);
    }
  }

  /**
   * this function pushes the selected user's info to a variable.
   * @params user
   */

  makeTeamLead(user: any) {
    this.registerTeamObj.teamLeadID = user.id;
  }

  /**
   * this function takes the selected users list, title and team lead information to generate team data
   * @params value
   */
  teamData(value) {
    let teamMembersIds: any = [];
    this.helperService.iterations(this.registerTeamObj.selectedUsers, function (obj) {
      teamMembersIds.push(obj.id);
    });
    let team: any = {
      entity: JSON.parse(this.helperService.decrypt(localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
        this.helperService.appConstants.key)),
      title: value.title,
      teamLead: this.registerTeamObj.teamLeadID,
      teamMembers: teamMembersIds,
    };
    return team;
  }

  /**
   * this function checks if the user in the list is added to selected list or not
   * @params user
   */
  alreadyAddedCheck(user: any) {
    for (let i = 0; i < this.registerTeamObj.filteredSelectedList.length; i++) {
      if (this.registerTeamObj.filteredSelectedList[i].id === user.id) {
        return true;
      }
    }
    return false;
  }

  removeTeamLead() {
    this.registerTeamObj.teamLeadID = null;
  }

  filterSelectedUserList(value) {
    let filterValue = value.toLowerCase();
    this.registerTeamObj.filteredSelectedList = this.registerTeamObj.selectedUsers.filter(
      user => user.name.toLowerCase().startsWith(filterValue));
  }
}

