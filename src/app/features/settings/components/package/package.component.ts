import {Component, OnInit} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';

@Component({
    selector: 'app-package-settings',
    templateUrl: './package.component.html',
    styleUrls: ['./package.component.scss']
})
export class PackageComponent implements OnInit {

    constructor(
        public helperService: HelperService
    ) {
    }
    ngOnInit() {
    }

}
