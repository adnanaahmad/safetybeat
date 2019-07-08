import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { HelperService } from 'src/app/shared/helperService/helper.service';
import { Hazard, HazardModel } from 'src/app/models/hazard.model';
import { HazardDetailsComponent } from 'src/app/pages/adminControl/modules/hazardCenter/dialogs/hazardDetails/hazardDetails.component';
import { AdminControlService } from 'src/app/pages/adminControl/services/adminControl.service';
import { NavigationService } from 'src/app/pages/navigation/services/navigation.service';
import { CompilerProvider } from 'src/app/shared/compiler/compiler';
import { AddHazardComponent } from 'src/app/pages/adminControl/modules/siteCenter/dialogs/addHazard/addHazard.component';
import { ConfirmationModalComponent } from 'src/app/Dialogs/conformationModal/confirmationModal.component';
import { ImageLightboxComponent } from 'src/app/Dialogs/imageLightbox/imageLightbox.component';

@Component({
  selector: 'app-hazardCenter',
  templateUrl: './hazardCenter.component.html',
  styleUrls: ['./hazardCenter.component.scss']
})
export class HazardCenterComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  hazardTable: HazardModel = <HazardModel>{};
  displayedColumns = ['site', 'title', 'resolved', 'dateTime', 'Image', 'actions'];


  constructor(
    public helperService: HelperService,
    private navService: NavigationService,
    private compiler: CompilerProvider,
    private adminControlService: AdminControlService) {
  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.getHazardList();
    this.editorDeleteEnable();
  }

  viewHazard(hazard) {
    this.helperService.createDialog(HazardDetailsComponent, {
      disableClose: true,
      data: hazard
    });
  }

  getHazardList() {
    let entityData = {
      'entityId': JSON.parse(this.helperService.decrypt(localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
        this.helperService.appConstants.key)),
    };
    this.adminControlService.allHazards(entityData).subscribe((res) => {
      if (res !== 1 && res.data.length !== 0) {
        this.hazardTable.dataSource = new MatTableDataSource(this.compiler.constructHazardArray(res));
        this.hazardTable.dataSource.paginator = this.paginator;
      } else if (res.data.length === 0) {
        this.hazardTable.dataSource = 0;
      }
    });
  }

  editorDeleteEnable() {
    this.navService.currentRole.subscribe(res => {
      this.hazardTable.entitySelectedRole = res;
      if (
        this.hazardTable.entitySelectedRole === this.helperService.appConstants.roles.owner ||
        this.hazardTable.entitySelectedRole === this.helperService.appConstants.roles.teamLead ||
        this.hazardTable.entitySelectedRole === this.helperService.appConstants.roles.entityManager
      ) {
        this.hazardTable.hazardOption = true;
      } else {
        this.hazardTable.hazardOption = false;
      }
    });
  }

  editHazard(hazard: Hazard) {
    this.helperService.createDialog(AddHazardComponent, {
      disableClose: true,
      data: { Modal: true, hazardInfo: hazard }
    });
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      this.getHazardList();
    });
  }

  confirmationModal(id) {
    this.helperService.createDialog(ConfirmationModalComponent,
      { data: { message: this.helperService.translated.CONFIRMATION.DELETE_HAZARD } });
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      if (res === this.helperService.appConstants.yes) {
        this.helperService.toggleLoader(true);
        this.deleteHazard(id);
      }
    });
  }

  deleteHazard(id) {
    this.adminControlService.deleteHazard(id).subscribe((res) => {
      this.getHazardList();
      if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.HAZARD_DELETE_SUCCESS,
          this.helperService.constants.status.SUCCESS);
      } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.HAZARD_DELETE_FAILURE,
          this.helperService.constants.status.ERROR);
      }
    }, (error) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.HAZARD_DELETE_FAILURE,
        this.helperService.constants.status.ERROR);
    }
    );
  }
  testingFunc(image) {
    console.log(image)
    this.helperService.createDialog(ImageLightboxComponent,
      {
        data:
        {
          message: this.helperService.translated.CONFIRMATION.DELETE_HAZARD,
          imageData: image
        }
      });
  }
}
