import {Component, Inject, ViewChild, ElementRef, OnInit} from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatAutocomplete,
  MatAutocompleteSelectedEvent
} from '@angular/material';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormControl} from '@angular/forms';
import {startWith, map} from 'rxjs/operators';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {AdminControlService} from 'src/app/features/adminControl/services/adminControl.service';
import {InviteTeamModel, InviteTeamModelData} from 'src/app/models/adminControl/inviteTeam.model';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {User} from 'src/app/models/user.model';

@Component({
  selector: 'app-inviteTeamModal',
  templateUrl: './inviteTeamModal.component.html',
  styleUrls: ['./inviteTeamModal.component.scss']
})
export class InviteTeamModalComponent implements OnInit {
  inviteTeamModel: InviteTeamModel = <InviteTeamModel>{};

  @ViewChild('userInput') userInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    public dialogRef: MatDialogRef<InviteTeamModalComponent>,
    public helperService: HelperService,
    private adminServices: AdminControlService,
    private navService: NavigationService,
    @Inject(MAT_DIALOG_DATA) public data: InviteTeamModelData,
  ) {
    this.initialize();
    this.inviteTeamModel.allUsers = this.data.inviteTeamData.usersData
      ? this.data.inviteTeamData.usersData.map(x => Object.assign({}, x))
      : [];
    this.inviteTeamModel.filteredUsers = this.inviteTeamModel.userCtrl.valueChanges.pipe(
      startWith(null),
      map((user: User | null) => {
        return user
          ? this._filter(user)
          : this.inviteTeamModel.allUsers.slice();
      })
    );
  }

  ngOnInit() {
  }

  /**
   * this function is used to give the initial values to the global variables that we are getting from
   * model.
   */
  initialize() {
    this.inviteTeamModel.removable = true;
    this.inviteTeamModel.separatorKeysCodes = [ENTER, COMMA];
    this.inviteTeamModel.users = [];
    this.inviteTeamModel.allUsers = [];
    this.inviteTeamModel.userCtrl = new FormControl();
    this.helperService.translated = this.helperService.translated;
    this.inviteTeamModel.loading = false;
  }

  /**
   * this function is used in the material chips form when we select the multiple or single user to be invited and we want
   * him/her to remove from the list then we will use this function.
   * @params user
   */

  remove(user: User): void {
    const index = this.inviteTeamModel.users.indexOf(user);
    if (index >= 0) {
      this.inviteTeamModel.users.splice(index, 1);
    }
  }

  /**
   * this function is called when we select any of the users from the list then the first_name of that user
   * is shown in the input field and when nothing is selected then this function sets the value of null and
   * input fields remain empty.
   * @params event
   */

  selected(event: MatAutocompleteSelectedEvent): void {
    let index = this.helperService.findIndex(
      this.inviteTeamModel.users,
      function (obj) {
        return obj.first_name === event.option.value.first_name;
      }
    );
    if (index === -1) {
      this.inviteTeamModel.users.push(event.option.value);
    }
    this.userInput.nativeElement.value = '';
    this.inviteTeamModel.userCtrl.setValue(null);
  }

  /**
   *this function is used for filtering out the users from the list using search bar.
   * @params value
   */

  private _filter(value): Array<User> {
    const filterValue = value && value.first_name
      ? value.first_name.toLowerCase()
      : value.toLowerCase();
    return this.inviteTeamModel.allUsers.filter(user => {
      return user.first_name.toLowerCase().indexOf(filterValue) === 0;
    });
  }

  /**
   * this function is used for closing the modal dialog.
   */

  onNoClick(): void {
    this.dialogRef.close();
  }

  /**
   * this function is used when we select the users to invite and then hit on invite button then all the data of the users
   * is sent to the api and then api makes them added in the particular team.
   */

  inviteTeam() {
    let userEmails: Array<string> = [];
    this.helperService.iterations(this.inviteTeamModel.users, function (obj) {
      userEmails.push(obj.email);
    });
    let inviteTeamData = {
      email: userEmails,
      entityCode: this.data.inviteTeamData.entityData
    };
    this.inviteTeamModel.loading = true;
    this.adminServices.inviteTeam(inviteTeamData).subscribe(
      res => {
        if (res.responseDetails.code === this.helperService.appConstants.codeValidations[3]) {
          this.helperService.createSnack(
            res.responseDetails.message,
            this.helperService.constants.status.SUCCESS
          );
          this.inviteTeamModel.loading = false;
          this.onNoClick();
        } else {
          this.helperService.createSnack(
            res.responseDetails.message,
            this.helperService.constants.status.ERROR
          );
          this.onNoClick();
          this.inviteTeamModel.loading = false;
        }
      },
      (error) => {
        this.onNoClick();
        this.inviteTeamModel.loading = false;
        this.helperService.handleError(error, this);
      }
    );
  }
}
