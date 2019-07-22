import {Component, OnInit} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {MatBottomSheetRef} from '@angular/material';

@Component({
    selector: 'app-advanceSearch',
    templateUrl: './advanceSearch.component.html',
    styleUrls: ['./advanceSearch.component.scss']
})
export class AdvanceSearchComponent implements OnInit {

    constructor(
        public helperService: HelperService,
        private _bottomSheetRef: MatBottomSheetRef<AdvanceSearchComponent>
    ) {
    }

    ngOnInit() {
    }

    onNoClick() {
        this._bottomSheetRef.dismiss();
    }
}
