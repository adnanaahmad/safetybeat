import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialogRef, MatPaginator, MatTableDataSource} from '@angular/material';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {HazardModel} from 'src/app/models/hazard.model';
import {AdminControlService} from 'src/app/features/adminControl/services/adminControl.service';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {PaginationData} from 'src/app/models/site.model';

@Component({
  selector: 'app-archived-hazards',
  templateUrl: './archived-hazards.component.html',
  styleUrls: ['./archived-hazards.component.scss']
})
export class ArchivedHazardsComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  hazardTable: HazardModel = <HazardModel>{};
  search: string;
  firstIndex: number;
  pageSize: number;
  dataSource: any;
  pageCount: number;

  constructor(public helperService: HelperService,
              private navService: NavigationService,
              private compiler: CompilerProvider,
              private adminControlService: AdminControlService,
              public dialogRef: MatDialogRef<ArchivedHazardsComponent>) {

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
    this.hazardTable.subscription.unsubscribe();
  }

  /**
   * this function is used for initializing all the variables if we have to insert values into it when component is loaded
   */

  initialize() {
    this.hazardTable.displayedColumns = ['site', 'title', 'resolved', 'dateTime', 'Image', 'actions'];
    this.search = '';
    this.firstIndex = 0;
    this.pageSize = 6;
    this.dataSource = null;
    this.hazardTable.loading = false;
    this.hazardTable.dataSource = null;
  }

  /**
   * this function is used for getting all the hazards list and then it renders to the html after assigning the response to dataSource.
   * @params pageIndex
   * @params search
   */
  getHazardList(pageIndex, search) {
    this.pageCount = 0;
    let entityData = {
      'entityId': this.hazardTable.entityId,
      archived: true
    };
    let paginationData: PaginationData = {
      limit: this.helperService.constants.appConstant.paginationLimitForArchive,
      offset: pageIndex * this.helperService.constants.appConstant.paginationLimitForArchive,
      search: search
    };
    if (typeof (search) === 'string' && search.length === 0) {
      this.hazardTable.loading = true;
    }
    this.adminControlService.allHazards(entityData, paginationData).subscribe((res) => {
      if (res && res.responseDetails && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.pageCount = res.data.pageCount;
        this.hazardTable.hazardsData = this.compiler.constructAllArchivedHazardsData(res.data.hazardList);
        this.hazardTable.dataSource = new MatTableDataSource(this.hazardTable.hazardsData);
        if (this.hazardTable.hazardsData.length === 0 && this.paginator.pageIndex !== 0) {
          this.goToPreviousTable();
        }
      } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[3]) {
        this.hazardTable.dataSource = null;
      }
      this.hazardTable.loading = false;
    }, (error) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
      this.hazardTable.loading = false;
    });
  }

  /**
   * Unarchive hazard
   * @params hazardData
   */
  unarchiveHazard(hazardData: any) {
    this.adminControlService.unarchiveHazard(hazardData.id).subscribe((res) => {
        if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
          this.getHazardList(this.paginator.pageIndex, this.search);
          this.helperService.createSnack(this.helperService.translated.MESSAGES.HAZARD_UNARCHIVE_SUCCESS,
            this.helperService.constants.status.SUCCESS);
          this.dialogRef.close();
        } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
          this.helperService.createSnack(this.helperService.translated.MESSAGES.HAZARD_UNARCHIVE_FAILURE,
            this.helperService.constants.status.ERROR);
          this.dialogRef.close();
        } else {
          this.helperService.createSnack(this.helperService.translated.MESSAGES.HAZARD_UNARCHIVE_FAILURE,
            this.helperService.constants.status.ERROR);
          this.dialogRef.close();
        }
      }, (error) => {
        this.dialogRef.close();
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG,
          this.helperService.constants.status.ERROR);
      }
    );
  }

  /**
   * this function is used to navigate user to previous table if current table is empty.
   */
  goToPreviousTable() {
    this.paginator.pageIndex = this.paginator.pageIndex - 1;
    this.getHazardList(this.paginator.pageIndex, this.search);
  }

}
