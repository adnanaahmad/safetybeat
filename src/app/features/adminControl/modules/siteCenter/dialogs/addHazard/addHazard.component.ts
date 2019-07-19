import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AddHazardData, AddHazardModel, NewHazard, RiskType} from 'src/app/models/hazard.model';
import {AdminControlService} from 'src/app/features/adminControl/services/adminControl.service';
import {NavigationService} from '../../../../../navigation/services/navigation.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-addHazard',
  templateUrl: './addHazard.component.html',
  styleUrls: ['./addHazard.component.scss']
})
export class AddHazardComponent implements OnInit {
  @ViewChild('gmap') gMapElement: ElementRef;
  hazardObj: AddHazardModel = <AddHazardModel>{};
  hazardInfo: any;
  public url: any;
  private risks: Array<RiskType>;
  siteName: any;
  siteLocation: any;
  msg: any;
  private subscription: Subscription;
  private entityName: string;

  constructor(
    public formBuilder: FormBuilder,
    public helperService: HelperService,
    public service: AdminControlService,
    public navService: NavigationService,
    public dialogRef: MatDialogRef<AddHazardComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.hazardObj.editModal = data.Modal;
    this.hazardInfo = data.hazardInfo;
    this.url = helperService.appConstants.noHazard;
  }

  ngOnInit() {
    this.subscription = this.navService.selectedEntityData.subscribe((res) => {
      if (res !== 1) {
        this.entityName =  res.entityInfo.name;
      }
    });
    this.siteName = this.data.siteName;
    this.siteLocation = this.data.location;
    this.msg = 'is ' + this.entityName + ',responsible to manage this hazard?';
    this.hazardObj.addHazardFormFirst = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      risk: ['', Validators.required],
      note: ['', Validators.required]
    });
    this.hazardObj.addHazardFormSecond = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      risk: ['']
    });
    this.getRisks();
    if (this.hazardObj.editModal) {
      this.viewHazardInfo();
    }

  }



  viewHazardInfo() {
    if (this.hazardInfo.image) {
      this.url = this.hazardInfo.image;
    }
    this.hazardObj.addHazardForm = this.formBuilder.group({
      title: this.hazardInfo.title,
      description: this.hazardInfo.description,
      risk: this.hazardInfo.risk.id
    });
  }

  getRisks() {
    this.service.getRisks().subscribe((res) => {
        this.risks = res;
      }, (error) => {
        this.hazardObj.addHazardForm.disable();
        this.helperService.createSnack(this.helperService.translated.MESSAGES.HAZARD_LIST_FAIL,
          this.helperService.constants.status.ERROR);
      }
    );
  }

  hazardFormSubmit({value}: { value: NewHazard }) {
    this.hazardObj.editModal ? this.editHazard(value) : this.addHazard(value);
  }

  get addHazardControls() {
    return this.hazardObj.addHazardFormFirst.controls;
  }

  onFileSelected(file: FileList) {
    this.hazardObj.removeImage = 'False';
    this.hazardObj.image = file.item(0);
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.url = event.target.result;
    };
    reader.readAsDataURL(this.hazardObj.image);
  }


  removePicture() {
    this.url = this.helperService.appConstants.noHazard;
    this.hazardObj.removeImage = 'True';
  }

  generateHazardData(value, editHazard): FormData {
    let formData = new FormData();
    formData.append('title', value.title);
    formData.append('description', value.description);
    formData.append('risk', value.risk);
    formData.append('removeImage', this.hazardObj.removeImage);
    if (this.hazardObj.image) {
      let blob = new Blob([this.hazardObj.image], {type: 'application/image'});
      formData.append('image', blob, this.hazardObj.image.name);
    }
    if (editHazard) {
      formData.append('site', this.hazardInfo.site.id);
      formData.append('addedBy', this.hazardInfo.addedBy.id);
    } else {
      formData.append('site', this.data.siteId);
    }
    return formData;
  }

  addHazard(value: AddHazardData) {
    this.service.addHazard(this.generateHazardData(value, false)).subscribe((res) => {
        if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
          this.onNoClick();
          this.helperService.createSnack(this.helperService.translated.MESSAGES.HAZARD_ADDED,
            this.helperService.constants.status.SUCCESS);
        } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
          this.onNoClick();
          this.helperService.createSnack(this.helperService.translated.MESSAGES.HAZARD_NOT_ADDED,
            this.helperService.constants.status.ERROR);
        }
      }, (error) => {
        this.onNoClick();
        this.helperService.createSnack(this.helperService.translated.MESSAGES.HAZARD_NOT_ADDED,
          this.helperService.constants.status.ERROR);
      }
    );
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  editHazard(value) {
    this.service.editHazard(this.hazardInfo.id, this.generateHazardData(value, true)).subscribe((res) => {
        if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
          this.onNoClick();
          this.helperService.createSnack(this.helperService.translated.MESSAGES.HAZARD_EDIT_SUCCESS,
            this.helperService.constants.status.SUCCESS);
        } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
          this.onNoClick();
          this.helperService.createSnack(this.helperService.translated.MESSAGES.HAZARD_EDIT_FAILURE,
            this.helperService.constants.status.ERROR);
        }
      }, (error) => {
        this.onNoClick();
        this.helperService.createSnack(this.helperService.translated.MESSAGES.HAZARD_EDIT_FAILURE,
          this.helperService.constants.status.ERROR);
      }
    );
  }
}
