// Angular
import { Component } from "@angular/core";
import { LayoutConfigService } from "../../../../core/_base/layout";

@Component({
  selector: "kt-topbar",
  templateUrl: "./topbar.component.html",
  styleUrls: ["./topbar.component.scss"],
})
export class TopbarComponent {
  searchDisplay = true;
  notificationsDisplay = true;
  quickActionsDisplay = true;
  cartDisplay = true;
  quickPanelDisplay = true;
  languagesDisplay = true;
  userDisplay = true;
  dateDisplay = true;
  userLayout = "offcanvas";
  userDropdownStyle = "light";
  today: Date = new Date();
  todayString: string = "";
  user:any;
  domain: String= ""

  constructor(private layoutConfigService: LayoutConfigService) {
    this.searchDisplay = this.layoutConfigService.getConfig(
      "extras.search.display"
    );
    this.notificationsDisplay = this.layoutConfigService.getConfig(
      "extras.notifications.display"
    );
    this.quickActionsDisplay = this.layoutConfigService.getConfig(
      "extras.quick-actions.display"
    );
    this.cartDisplay = this.layoutConfigService.getConfig(
      "extras.cart.display"
    );
    this.quickPanelDisplay = this.layoutConfigService.getConfig(
      "extras.quick-panel.display"
    );
    this.languagesDisplay = this.layoutConfigService.getConfig(
      "extras.languages.display"
    );
    this.dateDisplay = this.layoutConfigService.getConfig(
      "extras.date.display"
    );
    this.userDisplay = this.layoutConfigService.getConfig(
      "extras.user.display"
    );
    this.userLayout = this.layoutConfigService.getConfig("extras.user.layout");
    this.userDropdownStyle = this.layoutConfigService.getConfig(
      "extras.user.dropdown.style"
    );
  }
  ngOnInit() {
    this.user =  JSON.parse(localStorage.getItem('user'))
this.domain = this.user.usrd_domain
    this.todayString = `${this.today.getDate()}/${
      this.today.getMonth() + 1
    }/${this.today.getFullYear()}`;
  }
}
