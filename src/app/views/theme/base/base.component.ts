// Angular
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
// RxJS
import { Observable, Subscription } from 'rxjs';
// Object-Path
import * as objectPath from 'object-path';
// Layout
import { LayoutConfigService, MenuConfigService, PageConfigService } from '../../../core/_base/layout';
import { HtmlClassService } from '../html-class.service';
import { LayoutConfig } from '../../../core/_config/layout.config';
import { MenuConfig } from '../../../core/_config/menu.config';
import { MenuTrConfig } from '../../../core/_config/menuTr.config';
import { MenuDDConfig } from '../../../core/_config/menuDD.config';
import { PageConfig } from '../../../core/_config/page.config';
// User permissions
import { NgxPermissionsService } from 'ngx-permissions';
import { currentUserPermissions, Permission } from '../../../core/auth';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../core/reducers';
import { environment } from "../../../../environments/environment";
var app = environment.App;
  
@Component({
  selector: 'kt-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BaseComponent implements OnInit, OnDestroy {
  // Public variables
  selfLayout = 'default';
  asideSelfDisplay: false;
  contentClasses = '';
  contentContainerClasses = '';
  subheaderDisplay = true;
  contentExtended: false;
  // Private properties
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  private currentUserPermissions$: Observable<Permission[]>;


  /**
   * Component constructor
   *
   * param layoutConfigService: LayoutConfigService
   * param menuConfigService: MenuConfigService
   * param pageConfigService: PageConfigService
   * param htmlClassService: HtmlClassService
   * param store
   * param permissionsService
   */
  constructor(
    private layoutConfigService: LayoutConfigService,
    private menuConfigService: MenuConfigService,
    private pageConfigService: PageConfigService,
    private htmlClassService: HtmlClassService,
    private store: Store<AppState>,
    private permissionsService: NgxPermissionsService) {
    this.loadRolesWithPermissions();

    // register configs by demos
    this.layoutConfigService.loadConfigs(new LayoutConfig().configs);
   // this.menuConfigService.loadConfigs(new MenuConfig().configs);
  
       
    (app=="RH") ? this.menuConfigService.loadConfigs(new MenuTrConfig().configs):  (app=="ERP") ?  this.menuConfigService.loadConfigs(new MenuConfig().configs) : this.menuConfigService.loadConfigs(new MenuDDConfig().configs)
    console.log("this.menuConfigService",this.menuConfigService)
    this.pageConfigService.loadConfigs(new PageConfig().configs);

    // setup element classes
    this.htmlClassService.setConfig(this.layoutConfigService.getConfig());

    const subscription = this.layoutConfigService.onConfigUpdated$.subscribe(layoutConfig => {
      // reset body class based on global and page level layout config, refer to html-class.service.ts
      document.body.className = '';
      this.htmlClassService.setConfig(layoutConfig);
    });
    this.unsubscribe.push(subscription);
  }

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit(): void {
    const config = this.layoutConfigService.getConfig();
    // Load UI from Layout settings
    this.selfLayout = objectPath.get(config, 'self.layout');
    this.asideSelfDisplay = objectPath.get(config, 'aside.self.display');
    this.subheaderDisplay = objectPath.get(config, 'subheader.display');
    this.contentClasses = this.htmlClassService.getClasses('content', true).toString();
    this.contentContainerClasses = this.htmlClassService.getClasses('content_container', true).toString();
    this.contentExtended = objectPath.get(config, 'content.extended');

    // let the layout type change
    const subscription = this.layoutConfigService.onConfigUpdated$.subscribe(cfg => {
      setTimeout(() => {
        this.selfLayout = objectPath.get(cfg, 'self.layout');
      });
    });
    this.unsubscribe.push(subscription);
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    this.unsubscribe.forEach(sb => sb.unsubscribe());
    // https://www.npmjs.com/package/ngx-permissions
    this.permissionsService.flushPermissions();
  }

  /**
   * NGX Permissions, init roles
   */
  loadRolesWithPermissions() {
    this.currentUserPermissions$ = this.store.pipe(select(currentUserPermissions));
    const subscription = this.currentUserPermissions$.subscribe(res => {
      if (!res || res.length === 0) {
        return;
      }

      this.permissionsService.flushPermissions();
      res.forEach((pm: Permission) => this.permissionsService.addPermission(pm.name));
    });
    this.unsubscribe.push(subscription);
  }
}
