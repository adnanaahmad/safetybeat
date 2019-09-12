import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {HazardList, HazardModel} from 'src/app/models/hazard.model';
import {HazardDetailsComponent} from 'src/app/features/adminControl/modules/hazardCenter/dialogs/hazardDetails/hazardDetails.component';
import {AdminControlService} from 'src/app/features/adminControl/services/adminControl.service';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {AddHazardComponent} from 'src/app/features/adminControl/modules/siteCenter/dialogs/addHazard/addHazard.component';
import {ConfirmationModalComponent} from 'src/app/dialogs/conformationModal/confirmationModal.component';
import {ImageLightboxComponent} from 'src/app/dialogs/imageLightbox/imageLightbox.component';
import {PaginationData} from 'src/app/models/site.model';
import {AdvanceSearchComponent} from 'src/app/features/adminControl/modules/siteCenter/dialogs/advanceSearch/advanceSearch.component';
import {ArchivedHazardsComponent} from 'src/app/features/adminControl/modules/hazardCenter/dialogs/archived-hazards/archived-hazards.component';


@Component({
  selector: 'app-hazardCenter',
  templateUrl: './hazardCenter.component.html',
  styleUrls: ['./hazardCenter.component.scss']
})
export class HazardCenterComponent implements OnInit, OnDestroy {
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
    this.hazardTable.subscription = this.navService.selectedEntityData.subscribe((res) => {
      if (res !== 1) {
        this.hazardTable.entityId = res.entityInfo.id;
        this.getHazardList(this.firstIndex, this.search);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.hazardTable.subscription !== null && this.hazardTable.subscription !== undefined) {
      this.hazardTable.subscription.unsubscribe();
    }
  }

  /**
   * this function is used for initializing all the variables if we have to insert values into it when component is loaded
   */

  initialize() {
    this.hazardTable.displayedColumns = ['site', 'title', 'resolved', 'dateTime', 'Image', 'actions'];
    this.editorDeleteEnable();
    this.search = '';
    this.firstIndex = 0;
    this.pageSize = 10;
    this.dataSource = null;
    this.hazardTable.loading = false;
    this.hazardTable.dataSource = null;
  }

  /**
   * this function is used for viewing the particular hazard's information
   * @params hazard
   */

  viewHazard(hazard: HazardList) {
    this.helperService.createDialog(HazardDetailsComponent, {
      disableClose: true,
      data: hazard
    });
  }

  /**
   * this function is used for getting all the hazards list and then it renders to the html after assigning the response to dataSource.
   * @params pageIndex
   * @params search
   */
  getHazardList(pageIndex, search) {
    this.pageCount = 0;
    let entityData = {
      'entityId': this.hazardTable.entityId
    };
    let paginationData: PaginationData = {
      limit: this.helperService.constants.appConstant.paginationLimit,
      offset: pageIndex * this.helperService.constants.appConstant.paginationLimit,
      search: search
    };
    this.hazardTable.loading = true;
    this.adminControlService.allHazards(entityData, paginationData).subscribe((res) => {
      if (res && res.responseDetails && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.pageCount = res.data.pageCount;
        this.hazardTable.loading = false;
        this.hazardTable.hazardsData = this.compiler.constructAllHazardsData(res.data.hazardList);
        this.hazardTable.dataSource = new MatTableDataSource(res.data.hazardList);
      } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[3]) {
        this.hazardTable.dataSource = null;
        this.hazardTable.loading = false;
      } else {
        this.hazardTable.loading = false;
      }
    }, (error) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
      this.hazardTable.loading = false;
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

  /**
   * this function is used for editing hazards
   * @params hazard
   */
  editHazard(hazard: HazardList) {
    this.helperService.createDialog(AddHazardComponent, {
      disableClose: false,
      data: {Modal: true, hazardInfo: hazard}
    });
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      if (res && res === this.helperService.appConstants.yes) {
        this.getHazardList(this.firstIndex, this.search);
      }
    });
  }

  /**
   * this function is called when we have to delete hazard ifn the user press yes then do delete otherwise cancel
   * @params id
   */

  confirmationModal(id: number) {
    this.helperService.createDialog(ConfirmationModalComponent,
      {data: {message: this.helperService.translated.CONFIRMATION.ARCHIVE_HAZARD}});
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      if (res && res === this.helperService.appConstants.yes) {
        this.helperService.toggleLoader(true);
        this.archiveHazard(id);
      }
    });
  }

  /**
   * this function is used for archive the hazard
   * @params id
   */

  archiveHazard(id: number) {
    this.adminControlService.deleteHazard(id).subscribe((res) => {
        if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
          this.getHazardList(this.firstIndex, this.search);
          this.helperService.createSnack(this.helperService.translated.MESSAGES.HAZARD_ARCHIVE_SUCCESS,
            this.helperService.constants.status.SUCCESS);
        } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
          this.helperService.createSnack(this.helperService.translated.MESSAGES.HAZARD_ARCHIVE_FAILURE,
            this.helperService.constants.status.ERROR);
        } else {
          this.helperService.createSnack(this.helperService.translated.MESSAGES.HAZARD_ARCHIVE_FAILURE,
            this.helperService.constants.status.ERROR);
        }
      }, (error) => {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.HAZARD_ARCHIVE_FAILURE,
          this.helperService.constants.status.ERROR);
      }
    );
  }

  getArchivedHazards() {
    this.helperService.createDialog(ArchivedHazardsComponent, {
      disableClose: true,
      data: {Modal: false, 'hazardsData': this.hazardTable.hazardsData}
    });
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      this.getHazardList(this.paginator.pageIndex, this.search);
    });
  }

  /**
   * this function is used for viewing the image
   * @params image
   */

  testingFunc(image) {
    if (image) {
      this.helperService.createDialog(ImageLightboxComponent,
        {
          data:
            {
              image: image
            }
        });
    }
  }
}
