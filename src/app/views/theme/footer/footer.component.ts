// Angular
import { Component, OnInit } from '@angular/core';
// Layout
import { HtmlClassService } from '../html-class.service';
// Object-Path
import * as objectPath from 'object-path';
import { Observable } from 'rxjs';
import { currentUser, Logout, User } from '../../../core/auth';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../core/reducers';
// State
@Component({
  selector: 'kt-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent implements OnInit {
  // Public properties
  today: number = Date.now();
  footerClasses = '';
  footerContainerClasses = '';
  user$: Observable<User>;
  userd:any;
  /**
   * Component constructor
   *
   * @param uiClasses: HtmlClassService
   */
  constructor(private uiClasses: HtmlClassService,
    private store: Store<AppState>,) {
  }

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  /**
	 * Component constructor
	 *
	 * @param store: Store<AppState>
	 */

	
  ngOnInit(): void {
    this.footerClasses = this.uiClasses.getClasses('footer', true).toString();
    this.footerContainerClasses = this.uiClasses.getClasses('footer_container', true).toString();
    this.user$ = JSON.parse(localStorage.getItem('user'))
    this.userd = JSON.parse(localStorage.getItem('user'))
		console.log(this.user$,"gggg")
  }
}
