import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { OrganizationService } from "../../services/organization.service";
import { map } from "rxjs/operators";
import { Breakpoints, BreakpointObserver } from "@angular/cdk/layout";
import { Translation } from "src/app/models/translate.model";
import { TranslateService } from "@ngx-translate/core";
import { LoggingService } from "src/app/shared/logging/logging.service";
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit, OnDestroy {
  translated: Translation;
  constructor(
    private org: OrganizationService,
    private route: Router,
    private breakpointObserver: BreakpointObserver,
    public translate: TranslateService,
    private logging: LoggingService
  ) {
    translate
      .get(["AUTH", "BUTTONS", "MESSAGES", "LOGGER"])
      .subscribe(values => {
        this.translated = values;
        this.logging.appLogger(
          this.translated.LOGGER.STATUS.SUCCESS,
          this.translated.LOGGER.MESSAGES.DASHBOARD_COMPONENT
        );
      });
  }

  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: "Graph 1", cols: 2, rows: 1 },
          { title: "Graph 2", cols: 2, rows: 1 },
          { title: "Graph 3", cols: 2, rows: 1 },
          { title: "Graph 4", cols: 2, rows: 1 }
        ];
      }

      return [
        { title: "Graph 1", cols: 1, rows: 1 },
        { title: "Graph 2", cols: 1, rows: 1 },
        { title: "Graph 3", cols: 1, rows: 1 },
        { title: "Graph 4", cols: 1, rows: 1 }
      ];
    })
  );

  ngOnInit() {}
  ngOnDestroy() {
    this.logging.hideAllAppLoggers();
  }
}
