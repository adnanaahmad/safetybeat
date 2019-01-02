import { Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { ConstantService } from '../constant/constant.service';
@Injectable({
    providedIn: 'root'
})
export class LoggingService {
    constructor(private notifier: NotifierService,
        // public constants : 
    ) {
        this.notifier = notifier;
    }
    appLogger(type: string, message: any): void {
        if (ConstantService.config.devMode) {
            this.notifier.notify(type, message);
            console.log(message)
        } else {
            console.log(message)
        }
    }
}
