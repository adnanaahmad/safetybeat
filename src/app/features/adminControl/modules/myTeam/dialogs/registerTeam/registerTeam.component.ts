import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {RegisterTeamModel} from 'src/app/models/adminControl/registerTeam.model';
import {EntityInfo} from 'src/app/models/userEntityData.model';
import {FormBuilder, Validators} from '@angular/forms';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {MAT_DIALOG_DATA, MatAutocomplete, MatAutocompleteSelectedEvent, MatDialogRef} from '@angular/material';
import {AdminControlService} from 'src/app/features/adminControl/services/adminControl.service';

@Component({
  selector: 'app-register-team',
  templateUrl: './registerTeam.component.html',
  styleUrls: ['./registerTeam.component.scss']
})
export class RegisterTeamComponent implements OnInit {

  registerTeamObj: RegisterTeamModel = <RegisterTeamModel>{};
  selectedEntity: EntityInfo;
  @ViewChild('userInput') userInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;


  constructor(public dialogRef: MatDialogRef<RegisterTeamComponent>,
              public helperService: HelperService,
              public formBuilder: FormBuilder,
              public compiler: CompilerProvider,
              private adminServices: AdminControlService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.initialize();
    this.registerTeamObj.editTeam = data.Modal;
  }

  ngOnInit() {
    this.registerTeamObj.registerTeamForm = this.formBuilder.group({
      title: ['', Validators.required]
    });
    if (this.registerTeamObj.editTeam) {
      this.getFormControls['title'].setValue(this.data.teamList.team.title);
      this.registerTeamObj.teamLeadID =  this.data.teamList.teamLead.id;
      this.registerTeamObj.selectedUsers = this.compiler.constructUserDataOfTeam(this.data.teamList.users);
    }
  }

  get getFormControls() {
    return this.registerTeamObj.registerTeamForm.controls;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  initialize() {
    this.registerTeamObj.selectedUsers = [];
    this.registerTeamObj.teamLead = null;
    this.registerTeamObj.valid = false;
    this.registerTeamObj.loading = false;
  }

  // get formValidation() {
  //   if (this.registerTeamObj.users.length === 0) {
  //     this.registerTeamObj.valid = false;
  //   } else {
  //     this.registerTeamObj.valid = true;
  //   }
  //   return this.registerTeamObj.registerTeamForm.controls;
  // }


  teamFormSubmit({value, valid}: { value: any; valid: boolean }) {
    if (this.registerTeamObj.teamLead === null) {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.SELECT_TEAMLEAD, this.helperService.constants.status.WARNING)
    } else {
      this.registerTeamObj.editTeam ? this.editTeam(value) : this.registerTeam(value);
    }
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
          this.registerTeamObj.loading = false;
          this.helperService.createSnack(this.helperService.translated.MESSAGES.TEAM_ALREADY_EXIST,
            this.helperService.constants.status.ERROR);
        } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
          this.registerTeamObj.loading = false;
          this.helperService.createSnack(this.helperService.translated.MESSAGES.TEAM_REGISTRATION_FAILED,
            this.helperService.constants.status.ERROR);
        }
      }, (error) => {
        this.registerTeamObj.loading = false;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.TEAM_REGISTRATION_FAILED,
          this.helperService.constants.status.ERROR);
      }
    );
  }

  selected(event: MatAutocompleteSelectedEvent, users: any[]): void {
    this.helperService.selected(event, users);
    this.userInput.nativeElement.value = '';
    this.registerTeamObj.userCtrl.setValue(null);
  }

  /**
   * this function pushes selected user's info to the array
   * @params user
   */
  addToSelected(user) {
    this.registerTeamObj.selectedUsers.push(user);
  }

  /**
   *this function removes the user from list on remove button
   * @params selectedUser
   */
  removeFromSelected(selectedUser: any) {
    let index: number = this.registerTeamObj.selectedUsers.indexOf(selectedUser);
    if (index !== -1) {
      this.registerTeamObj.selectedUsers.splice(index, 1);
    }
  }

  /**
   * this function pushes the selected user's info to a variable.
   * @params user
   */

  makeTeamLead(user: any) {
    this.registerTeamObj.teamLead = user;
    this.registerTeamObj.teamLeadID = user.id;
  }

  /**
   * this function takes the selected users list, title and team lead information to generate team data
   * @params value
   */
  teamData (value) {
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
    for (let i = 0; i < this.registerTeamObj.selectedUsers.length; i++) {
      if (this.registerTeamObj.selectedUsers[i].id === user.id) {
        return true;
      }
    }
    return false;
  }

  removeTeamLead() {
    this.registerTeamObj.teamLead = null;
  }
}

