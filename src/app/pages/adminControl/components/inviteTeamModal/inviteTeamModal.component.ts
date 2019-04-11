import {Component, Inject, ViewChild, ElementRef} from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
} from '@angular/material';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormControl} from '@angular/forms';
import {startWith, map} from 'rxjs/operators';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {AdminControlService} from 'src/app/pages/adminControl/services/adminControl.service';
import {InviteTeamModel} from 'src/app/models/inviteTeam.model';

@Component({
  selector: 'app-inviteTeamModal',
  templateUrl: './inviteTeamModal.component.html',
  styleUrls: ['./inviteTeamModal.component.scss']
})
export class InviteTeamModalComponent {
  inviteTeamModel: InviteTeamModel = <InviteTeamModel>{};

  @ViewChild('userInput') userInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    public dialogRef: MatDialogRef<InviteTeamModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private adminServices: AdminControlService,
    private helperService: HelperService
  ) {
    this.inviteTeamModel.removable = true;
    this.inviteTeamModel.separatorKeysCodes = [ENTER, COMMA];
    this.inviteTeamModel.users = [];
    this.inviteTeamModel.allUsers = [];
    this.inviteTeamModel.userCtrl = new FormControl();
    this.inviteTeamModel.translated = this.helperService.translated;
    this.inviteTeamModel.loading = false;

    this.inviteTeamModel.allUsers = this.data.inviteTeamData.usersData ? this.data.inviteTeamData.usersData.map(x =>
      Object.assign({}, x)
    ) : [];
    this.inviteTeamModel.filteredUsers = this.inviteTeamModel.userCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: any | null) => {
        return fruit ? this._filter(fruit) : this.inviteTeamModel.allUsers.slice();
      })
    );
  }

  remove(fruit: any): void {
    const index = this.inviteTeamModel.users.indexOf(fruit);
    if (index >= 0) {
      this.inviteTeamModel.users.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    let index = this.helperService.findIndex(this.inviteTeamModel.users, function (obj) {
      return obj.first_name === event.option.value.first_name;
    });
    if (index === -1) {
      this.inviteTeamModel.users.push(event.option.value);
    }
    this.userInput.nativeElement.value = '';
    this.inviteTeamModel.userCtrl.setValue(null);
  }

  private _filter(value: any): any[] {
    const filterValue =
      value && value.first_name
        ? value.first_name.toLowerCase()
        : value.toLowerCase();
    return this.inviteTeamModel.allUsers.filter(fruit => {
      return fruit.first_name.toLowerCase().indexOf(filterValue) === 0;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  inviteTeam() {
    let userEmails: any = [];
    this.helperService.iterations(this.inviteTeamModel.users, function (obj) {
      userEmails.push(obj.email);
    });
    let inviteTeamData = {
      email: userEmails,
      entityCode: this.data.inviteTeamData.entityData
    };
    this.inviteTeamModel.loading = true;
    this.adminServices.inviteTeam(inviteTeamData).subscribe((res) => {
      let responseData = res;
      if (responseData.responseDetails.code === 103) {
        this.helperService.createSnack(responseData.responseDetails.message,
          this.inviteTeamModel.translated.MESSAGES.INVITETEAMSUCCESS, this.helperService.constants.status.SUCCESS);
        this.onNoClick();
      } else {
        this.helperService.createSnack(responseData.responseDetails.message,
          this.inviteTeamModel.translated.MESSAGES.INVITETEAMFAIL, this.helperService.constants.status.ERROR);
        this.onNoClick();
      }
      this.inviteTeamModel.loading = false;
    }, (error) => {
      this.inviteTeamModel.loading = false;
      this.helperService.handleError(error);
    });
  }
}
