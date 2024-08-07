import { Subscription } from "rxjs";
// Angular
import {
  ChangeDetectionStrategy,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
// Layout
import {
  LayoutConfigService,
  SplashScreenService,
  TranslationService,
} from "./core/_base/layout";
// language list
import { locale as enLang } from "./core/_config/i18n/en";
import { locale as chLang } from "./core/_config/i18n/ch";
import { locale as esLang } from "./core/_config/i18n/es";
import { locale as jpLang } from "./core/_config/i18n/jp";
import { locale as deLang } from "./core/_config/i18n/de";
import { locale as frLang } from "./core/_config/i18n/fr";
import { NgbDateParserFormatter } from "@ng-bootstrap/ng-bootstrap";
import { NgbDateCustomParserFormatter } from "./dateformat";
import { PosCategoryService } from "./core/erp";
@Component({
  // tslint:disable-next-line:component-selector
  selector: "body[kt-root]",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter },
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  // Public properties
  title = "Acsiome Technologies";
  loader: boolean;
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  /**
   * Component constructor
   *
   * @param translationService: TranslationService
   * @param router: Router
   * @param layoutConfigService: LayoutConfigService
   * @param splashScreenService: SplashScreenService
   */
  constructor(
    private translationService: TranslationService,
    private router: Router,
    private layoutConfigService: LayoutConfigService,
    private splashScreenService: SplashScreenService,
    private posCategoryService: PosCategoryService,
    private zone: NgZone
  ) {
    // register translations
    this.translationService.loadTranslations(
      enLang,
      chLang,
      esLang,
      jpLang,
      deLang,
      frLang
    );
  }

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit(): void {
    // enable/disable loader
    this.loader = this.layoutConfigService.getConfig("page-loader.type");
    const routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // hide splash screen

        // scroll to top on every route change
        window.scrollTo(0, 0);
        // to display back the body content
        setTimeout(() => {
          document.body.classList.add("page-loaded");
        }, 500);
        // this.posCategoryService.synchro().subscribe((res: any) => {
        //   if (res.data) {
        //     document.body.classList.add("page-loaded");
        //   } else {
        //     console.log("data is not synchronized yet! please wait");
        //   }
        // });
        this.splashScreenService.hide();
      }
    });
    // var myPeerConnection =
    //   window.RTCPeerConnection || window.webkitRTCPeerConnection;
    // console.log(myPeerConnection);
    this.unsubscribe.push(routerSubscription);
  }

  /**
   * On Destroy
   */
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
