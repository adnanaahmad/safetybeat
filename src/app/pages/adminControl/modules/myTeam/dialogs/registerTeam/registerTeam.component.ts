import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { HelperService } from 'src/app/shared/helperService/helper.service';
import { RegisterTeamModel } from 'src/app/models/adminControl/registerTeam.model';
import { EntityInfo } from 'src/app/models/userEntityData.model';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { CompilerProvider } from 'src/app/shared/compiler/compiler';
import { MAT_DIALOG_DATA, MatAutocomplete, MatAutocompleteSelectedEvent, MatDialogRef } from '@angular/material';
import { map, startWith } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AdminControlService } from 'src/app/pages/adminControl/services/adminControl.service';
import { NavigationService } from '../../../../../navigation/services/navigation.service';


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

  toppings = new FormControl();
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

  constructor(public dialogRef: MatDialogRef<RegisterTeamComponent>,
    public helperService: HelperService,
    public formBuilder: FormBuilder,
    public compiler: CompilerProvider,
    private navService: NavigationService,
    private adminServices: AdminControlService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.initialize();
    this.registerTeamObj.editTeam = data.Modal;
    this.editOrRegister();

  }

  ngOnInit() {
    this.registerTeamObj.registerTeamForm = this.formBuilder.group({
      title: ['', Validators.required],
      teamLead: ['', Validators.required],
      team: [''],
    });
    if (this.registerTeamObj.editTeam) {
      this.registerTeamObj.registerTeamForm = this.formBuilder.group({
        title: this.data.teamList.team.title,
        teamLead: this.registerTeamObj.teamInfo.teamLead.id,
        team: [''],
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  initialize() {
    this.registerTeamObj.removeUsers = [];
    this.registerTeamObj.addedUsers = [];
    this.registerTeamObj.valid = false;
    this.registerTeamObj.loading = false;
    this.registerTeamObj.users = [];
    this.registerTeamObj.allUsers = [];
    this.registerTeamObj.removable = true;
    this.registerTeamObj.userCtrl = new FormControl();
    this.registerTeamObj.separatorKeysCodes = [ENTER, COMMA];
  }

  get formValidation() {
    if (this.registerTeamObj.users.length === 0) {
      this.registerTeamObj.valid = false;
    } else {
      this.registerTeamObj.valid = true;
    }
    return this.registerTeamObj.registerTeamForm.controls;
  }


  teamFormSubmit({ value, valid }: { value: any; valid: boolean }) {
    this.registerTeamObj.editTeam ? this.editTeam(value) : this.registerTeam(value);
  }

  generateTeamData(value) {
    let teamMembersIds: any = [];
    this.helperService.iterations(this.registerTeamObj.users, function (obj) {
      teamMembersIds.push(obj.id);
    });
    let team: any = {
      entity: JSON.parse(this.helperService.decrypt(localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
        this.helperService.appConstants.key)),
      title: value.title,
      teamLead: value.teamLead,
      teamMembers: teamMembersIds,
    }
    return team;
  }

  editTeam(value) {
    this.registerTeamObj.loading = true;
    this.adminServices.editTeam(this.data.teamList.team.id, this.generateTeamData(value)).subscribe(res => {
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

  registerTeam(value) {
    this.registerTeamObj.loading = true;
    this.adminServices.registerTeam(this.generateTeamData(value)).subscribe(res => {
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

  private editOrRegister() {
    if (this.registerTeamObj.editTeam === true) {
      this.registerTeamObj.teamInfo = this.data.teamList;
      this.registerTeamObj.userInfo = this.compiler.constructDataForTeams(this.data.teamList.users);
      this.registerTeamObj.users = this.registerTeamObj.userInfo;
    }
    this.registerTeamObj.allUsersList = this.data.allUsersOfTeam ? this.data.allUsersOfTeam.map(
      x => Object.assign({}, x))
      : [];
    this.registerTeamObj.filteredUsers = this.registerTeamObj.userCtrl.valueChanges.pipe(
      startWith(null),
      map((user: any | null) => {
        return user
          ? this.helperService._filter(user, this.registerTeamObj.allUsersList)
          : this.registerTeamObj.allUsersList.slice();
      })
    );
  }
}

