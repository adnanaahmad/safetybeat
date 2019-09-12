import {Component, OnInit, ViewChild, OnDestroy, AfterViewInit} from '@angular/core';
import {MatDialog, MatTableDataSource, MatPaginator} from '@angular/material';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {ProfileService} from 'src/app/features/profile/services/profile.service';
import {AdminControlService} from 'src/app/features/adminControl/services/adminControl.service';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {EntityControl} from 'src/app/models/adminControl/entityControl.model';
import {PaginationData} from 'src/app/models/site.model';

@Component({
  selector: 'app-archived-entity',
  templateUrl: './archived-entity.component.html',
  styleUrls: ['./archived-entity.component.scss']
})
export class ArchivedEntityComponent implements OnInit, OnDestroy, AfterViewInit {

  entityControl: EntityControl = <EntityControl>{};
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public dialog: MatDialog,
    public adminServices: AdminControlService,
    public helperService: HelperService,
    private navService: NavigationService,
    private userService: ProfileService,
    private compiler: CompilerProvider,
  ) {
    this.initialize();
    this.helperService.toggleLoader(true);
    this.entityControl.subscription = this.navService.selectedEntityData.subscribe((res) => {
      if (res && res !== 1) {
        this.entityControl.entityId = res.entityInfo.id;
      }
    })
  }
  /**
   * this function is used to calling the functions that we need to be called on the
   * initialization of the component.
   */
  ngOnInit() {
    this.viewEntitiesApiCall(this.entityControl.firstIndex, this.entityControl.search);
    //this.viewAllEntities();
  }

  /**
   * this function is used for unsubscription of the observables that we have subscribed using behavior subjects.
   * and this unsubscription will be called when the component will be destroyed.
   */
  ngOnDestroy() {
    if (this.entityControl.subscription !== null && this.entityControl.subscription !== undefined) {
      this.entityControl.subscription.unsubscribe();
    }
  }

  /**
   * this function is called when the view of this component is successfully loaded
   */

  ngAfterViewInit(): void {
    if (this.entityControl.dataSource !== undefined) {
      this.entityControl.dataSource.paginator = this.paginator;
    }
  }
  initialize() {
    this.entityControl.search = '';
    this.entityControl.firstIndex = 0;
    this.entityControl.pageSize = 10;
    this.entityControl.pageCount = 0;
    this.entityControl.createEntityOption = false;
    this.entityControl.allEntitiesData = [];
    this.entityControl.empty = false;
    this.entityControl.createEntityOption = false;
    this.entityControl.joinOption = false;
    this.entityControl.allUsersData = [];
    this.entityControl.displayedColumns = [
      'name',
      'headOffice',
      'role',
      'managedBy',
      'administrator',
      'symbol',
    ];
  }
  viewEntitiesApiCall(pageIndex, search) {
    let data = {
      moduleName: 'Safetybeat',
      archived: true
    };
    let paginationData: PaginationData = {
      offset: pageIndex * this.helperService.appConstants.paginationLimit,
      limit: this.helperService.appConstants.paginationLimit,
      search: search
    };
    this.entityControl.displayLoader = true;
    this.adminServices.viewAllEntitiesWithPagination(data, paginationData).subscribe((res) => {
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.entityControl.pageCount = res.data.pageCount;
        let entityUserData = this.compiler.constructUserEntityData(res.data.allEntities);
        this.entityControl.allEntitiesData = entityUserData.entities;
        this.entityControl.dataSource = new MatTableDataSource(this.entityControl.allEntitiesData);
        this.entityControl.displayLoader = false;
      } else {
        this.entityControl.displayLoader = false;
      }
    }, (error) => {
      this.entityControl.displayLoader = false;
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
    });
  }
}
