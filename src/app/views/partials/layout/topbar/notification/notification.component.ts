// Angular
import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, Observer } from 'rxjs';
import { LayoutUtilsService, MessageType } from 'src/app/core/_base/crud';

import {AuthService,
} from "../../../../../core/auth"
import { ActivatedRoute, Router } from "@angular/router"
@Component({
  selector: 'kt-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['notification.component.scss']
})
export class NotificationComponent {

  // Show dot on top of the icon
  @Input() dot: string;

  // Show pulse on icon
  @Input() pulse: boolean;

  @Input() pulseLight: boolean;

  // Set icon class name
  @Input() icon = 'flaticon2-bell-alarm-symbol';
  @Input() iconType: '' | 'success';

  // Set true to icon as SVG or false as icon class
  @Input() useSVG: boolean;

  // Set bg image path
  @Input() bgImage: string;

  // Set skin color, default to light
  @Input() skin: 'light' | 'dark' = 'light';

  @Input() type: 'brand' | 'success' = 'success';

  /**
   * Component constructor
   *
   * @param sanitizer: DomSanitizer
   */


  notifications : any = [];
  orders : any = []

  notifications_nb : any = 0
  notificationExist : Boolean = false;

  time = new Observable<string>((observer: Observer<string>) => {
    setInterval(() => {
      observer.next("");
    }, 100);
  });

  constructor(
    private sanitizer: DomSanitizer,
    private router: Router,
    private activatedRoute: ActivatedRoute,
   
    private authService : AuthService,
    private layoutUtilsService: LayoutUtilsService,
  ) {
      setInterval(()=> { this.updateNotifications() }, 1000000);
    }

    ngOnInit(): void {
      this.updateNotifications();
    
    }


  backGroundStyle(): string {
    if (!this.bgImage) {
      return 'none';
    }

    return 'url(' + this.bgImage + ')';
  }

  updateNotifications(){
    this.authService.getNewNotifications().subscribe(
      (response) => {
        console.log(response)
        if (response["data"].length != 0) {
          this.notifications = response["data"].purchase_orders
          this.orders = response["data"].reqs
          // this.notifications_nb = response["data"].purchase_orders.length + response["data"].orders.length 
          this.notificationExist = true
          
        }else{
          this.notifications_nb = 0
          this.notificationExist = false
        }
      },
      (error) => {
        this.layoutUtilsService.showActionNotification(
          "Erreur lors de la récupération des données du backend",
          MessageType.Create,
          10000,
          true,
          true
        );
      }
    );

    
  }
  rqmLink(id) {
    console.log("here",id)
    const url = `/purchasing/list-approval/${id}`;
    console.log(url)
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
   
  }


  poLink(id) {
    console.log("here",id)
    const url = `/purchasing/po-list/${id}`;
    console.log(url)
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
   
  }



 
  


}
