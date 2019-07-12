import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {Hazard, HazardModel} from 'src/app/models/hazard.model';
import {HazardDetailsComponent} from 'src/app/pages/adminControl/modules/hazardCenter/dialogs/hazardDetails/hazardDetails.component';
import {AdminControlService} from 'src/app/pages/adminControl/services/adminControl.service';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {CompilerProvider} from 'src/app/shared/compiler/compiler';
import {AddHazardComponent} from 'src/app/pages/adminControl/modules/siteCenter/dialogs/addHazard/addHazard.component';
import {ConfirmationModalComponent} from 'src/app/Dialogs/conformationModal/confirmationModal.component';
import {ImageLightboxComponent} from 'src/app/Dialogs/imageLightbox/imageLightbox.component';
import {PaginationData} from 'src/app/models/site.model';
import {AdvanceSearchComponent} from '../../../siteCenter/dialogs/advanceSearch/advanceSearch.component';

@Component({
  selector: 'app-hazardCenter',
  templateUrl: './hazardCenter.component.html',
  styleUrls: ['./hazardCenter.component.scss']
})
export class HazardCenterComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  hazardTable: HazardModel = <HazardModel>{};
  search: string;
  firstIndex: number;
  pageSize: number;
  dataSource: any;
  pageCount: number;


  constructor(
    public helperService: HelperService,
    private navService: NavigationService,
    private compiler: CompilerProvider,
    private adminControlService: AdminControlService) {
  }

  ngOnInit() {
    this.initialize();
    this.getHazardList(this.firstIndex, this.search);

  }

  initialize() {
    this.hazardTable.displayedColumns = ['site', 'title', 'resolved', 'dateTime', 'Image', 'actions'];
    this.editorDeleteEnable();
    this.search = '';
    this.firstIndex = 0;
    this.pageSize = 10;
    this.dataSource = null;
  }

  viewHazard(hazard: Hazard) {
    this.helperService.createDialog(HazardDetailsComponent, {
      disableClose: true,
      data: hazard
    });
  }

  getHazardList(pageIndex, search) {
    let entityData = {
      'entityId': JSON.parse(this.helperService.decrypt(localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
        this.helperService.appConstants.key)),
    };
    let paginationData: PaginationData = {
      limit: this.helperService.constants.appConstant.paginationLimit,
      offset: pageIndex * this.helperService.constants.appConstant.paginationLimit,
      search: search
    };
    this.adminControlService.allHazards(entityData, paginationData).subscribe((res) => {
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.pageCount = res.data.pageCount;
        this.hazardTable.dataSource = new MatTableDataSource(res.data.hazardList);
        this.hazardTable.dataSource.paginator = this.paginator;
      } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[3]) {
        this.hazardTable.dataSource = null;
      }
    }, (error) => {
      this.helperService.createSnack(error.error, this.helperService.constants.status.ERROR);
    });
  }

  /**
   * this function navigates to advance search dialog when we click on advance search anchor
   */
  advanceSearch() {
    this.helperService.createDialog(AdvanceSearchComponent, {
      data: {disableClose: true}
    });
  }

  editorDeleteEnable() {
    this.navService.currentRole.subscribe(res => {
      if (res &&
        res === this.helperService.appConstants.roles.owner ||
        res === this.helperService.appConstants.roles.teamLead ||
        res === this.helperService.appConstants.roles.entityManager
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
      data: {Modal: true, hazardInfo: hazard}
    });
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      if (res && res === this.helperService.appConstants.yes) {
        this.getHazardList(this.firstIndex, this.search);
      }
    });
  }

  confirmationModal(id: number) {
    this.helperService.createDialog(ConfirmationModalComponent,
      {data: {message: this.helperService.translated.CONFIRMATION.DELETE_HAZARD}});
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      if (res && res === this.helperService.appConstants.yes) {
        this.helperService.toggleLoader(true);
        this.deleteHazard(id);
      }
    });
  }

  deleteHazard(id: number) {
    this.adminControlService.deleteHazard(id).subscribe((res) => {
        if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
          this.getHazardList(this.firstIndex, this.search);
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
