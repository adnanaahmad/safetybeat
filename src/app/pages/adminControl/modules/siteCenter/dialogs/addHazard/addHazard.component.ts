import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HelperService} from '../../../../../../shared/helperService/helper.service';
import {MAT_DIALOG_DATA} from '@angular/material';
import {AddHazardModel, NewHazard} from '../../../../../../models/hazard.model';
import {AdminControlService} from '../../../../services/adminControl.service';

@Component({
  selector: 'app-addHazard',
  templateUrl: './addHazard.component.html',
  styleUrls: ['./addHazard.component.scss']
})
export class AddHazardComponent implements OnInit {
  private addHazardForm: FormGroup;
  hazardObj: AddHazardModel = <AddHazardModel>{};
  risks: string[];

  constructor(public formBuilder: FormBuilder,
              public helperService: HelperService,
              public service: AdminControlService,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.addHazardForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      risk: ['']
    });
    this.service.getHazards().subscribe((res) => {
      this.risks = res;
      }, (error) => {
        this.addHazardForm.disable();
        this.helperService.createSnack('Hazard list could not be added',
          this.helperService.constants.status.ERROR);
      }
    );
  }

  get addHazardControls() {
    return this.addHazardForm.controls;
  }

  onFileSelected(event) {
    this.hazardObj.image = <File>event.target.files[0];
  }

  addHazard({value, valid}: { value: NewHazard; valid: boolean }): void {
    let blob = new Blob([this.hazardObj.image], {type: 'application/image'});
    let formData = new FormData();
    formData.append('image', blob, this.hazardObj.image.name);
    formData.append('title', value.title);
    formData.append('description', value.description);
    formData.append('site', this.data.id);
    formData.append('risk', value.risk);

    // let data = {
    //     //   title: value.title,
    //     //   risk: value.risk,
    //     //   description: value.description,
    //     //   site: this.data.id,
    //     //   image: blob
    //     // };
    if (!valid) {
      this.helperService.appLogger(this.helperService.translated.STATUS.ERROR, this.helperService.translated.MESSAGES.INVALID_DATA);
      return;
    }
    this.service.addNewHazard(formData).subscribe((res) => {
        this.helperService.createSnack('Hazard Added', this.helperService.constants.status.SUCCESS);
      }, (error) => {
        this.helperService.createSnack('Hazard could not be added',
          this.helperService.constants.status.ERROR);
      }
    );
  }

}
