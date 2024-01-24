import { Component, OnInit } from "@angular/core"
import { NgbDropdownConfig,NgbModal, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"


// Angular slickgrid
import {
  Column,
  GridOption,
  Formatter,
  Editor,
  Editors,
  AngularGridInstance,
  EditorValidator,
  EditorArgs,
  GridService,
  Formatters,
  FieldType,
  OnEventArgs,
} from "angular-slickgrid";
import { FormGroup, FormBuilder, Validators } from "@angular/forms"
import { Observable, BehaviorSubject, Subscription, of, Observer } from "rxjs"
import { ActivatedRoute, Router } from "@angular/router"
// Layout
import {
    SubheaderService,
    LayoutConfigService,
} from "../../../../core/_base/layout"
// CRUD
import {
    LayoutUtilsService,
    TypesUtilsService,
    MessageType,
} from "../../../../core/_base/crud"
import { MatDialog } from "@angular/material/dialog"

import { InventoryManagementService,InventoryTransactionService,LocationService,RoleService,UnloadRequestService } from "../../../../core/erp"

@Component({
  selector: 'kt-unloading-vans',
  templateUrl: './unloading-vans.component.html',
  styleUrls: ['./unloading-vans.component.scss']
})
export class UnloadingVansComponent implements OnInit {

  chargeForm: FormGroup
  productLotForm:FormGroup
  hasFormErrors = false
  isExist = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>

  role_code : any
  role : any 
  unload_request_code : any
  roles: any[] = []
  unloadRequests: any[] = []
  unloadRequestData: any[] = []
  displayData = false

  loadRequest : any 
  lots: any[] = []
  selectedLotsIndexes: any[] = []
  selected_lot_code :any 

  currentPageCode : any
  currentPageIndex : any
  currentProductCode: any 
  selectedLotCode : any

  pageCodeToAddIn : any 
  productCodeToAdd: any

  // GRID
  angularGrid: AngularGridInstance;
  grid: any;
  gridService: GridService;
  dataView: any;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];

  showSpinner : Boolean =  false;

  locData : any ;
  stat : any;


  constructor(
      config: NgbDropdownConfig,
      private tagFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private inventoryManagementService: InventoryManagementService,
      private inventoryTransactionService: InventoryTransactionService,
      private unloadRequestService: UnloadRequestService,
      private roleService: RoleService,
      private modalService: NgbModal,
      private locationService: LocationService
  ) {
      config.autoClose = true
  }
  ngOnInit(): void {
      this.loading$ = this.loadingSubject.asObservable()
      this.loadingSubject.next(false)
      this.prepareRoles()
      this.createForm()
  }

  //create form
  createForm() {
      this.loadingSubject.next(false)

      this.chargeForm = this.tagFB.group({
        role_code :[this.role_code],
        unload_request_code:[this.unload_request_code]
      })
  }

  time = new Observable<string>((observer: Observer<string>) => {
    setInterval(() => {
      observer.next("");
    }, 1000);
  });

 

  //reste form
  reset() {
      this.createForm()
      this.hasFormErrors = false
  }
  // save data
  onSubmit() {
    let nlot = this.unload_request_code
    let it ={
      tr_site : this.loadRequest.role_site,
      tr_loc : this.role.role_loc, // loc from , for unload : loc 
      tr_ref_site : this.loadRequest.role_site, 
      tr_ref_loc : this.role.role_loc_from, // loc , for unload : loc from
      tr_effdate : new Date(),
      tr_nbr : nlot,
    }
    console.log( "this.role.role_loc_from" , this.loadRequest.role_site,this.role.role_loc_from)

    this.stat = this.getLdStatus(this.loadRequest.role_site, this.role.role_loc_from)
    console.log( " this.locData" , this.locData)

    // the data in comments is not available 
    let details = [] , i = 1 ; 
    this.unloadRequestData.forEach(product => {
      details.push({
        tr_line : i,
        tr_part : product.product_code,
        tr_serial : product.lot,
        tr_qty_loc : product.qt_effected, 
        tr_um : product.pt_um,
        tr_status : this.locData,
        tr_expire : product.date_expiration,
        tr_um_conv : 1, 
        tr_ref : null
      })
      i++
    });

    let detail = details;
    this.unloadRequestService.updateUnloadRequestStatus20(this.unload_request_code, this.unloadRequestData).subscribe(

      (response: any) => {
        this.inventoryTransactionService.addTr({ nlot, it, detail }).subscribe(
          (response: any) => {},
          (error) => {
            // this.loadRequestData = []
            console.log(error);
          },
          () => {
            this.layoutUtilsService.showActionNotification("Load Request Details Updated", MessageType.Create, 10000, true, true);
            this.loadingSubject.next(false);
            // this.router.navigateByUrl("/customers-mobile/cluster-create")
          }
        );
        // addTr
        // this.inventoryTransactionService.addTr({nlot , it ,details}).subscribe(

        //   (response: any) => {
        //     console.log(response)
        //   },
        //   (error) => {
        //     // this.loadRequestData = []
        //     console.log(error)
        //   },
        //   () => {
        //     this.layoutUtilsService.showActionNotification(
        //         "Load Request Details Updated",
        //         MessageType.Create,
        //         10000,
        //         true,
        //         true
        //     )
        //     this.loadingSubject.next(false)
        //     // this.router.navigateByUrl("/customers-mobile/cluster-create")
        // }
        // ) 


        this.unloadRequestData = []
        this.unload_request_code = ""
        this.role_code = ""
        this.createForm()
        this.displayData = false
      },
      (error) => {
        // this.loadRequestData = []
        console.log(error)
      },
      () => {
        this.layoutUtilsService.showActionNotification(
            "unload Request updated",
            MessageType.Create,
            10000,
            true,
            true
        )
        this.loadingSubject.next(false)
    }
    )

  }

  
  
  goBack() {
      this.loadingSubject.next(false)
      const url = `/`
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }
 
 

  // FORMS DATA FUNCTIONS 
  prepareUnloadRequestData(unload_request_code){
    this.showSpinner = true
    this.unloadRequestService.getUnloadRequestData(unload_request_code).subscribe(

        (response: any) => {
          this.unloadRequestData = response.unloadRequestData
          this.loadRequest = response.data
          this.showSpinner = false
          this.displayData = true
        },
        (error) => {
          this.unloadRequestData = []
        },
        () => {}
    )
  }

  onInputChanged(p_code, lot,value){
    console.log('value:' + value)
    const indexProduct = this.unloadRequestData.findIndex(detail=>{
      return detail.product_code  === p_code && detail.lot === lot
    })
    this.unloadRequestData[indexProduct].qt_effected = value
    console.log(this.unloadRequestData[indexProduct])
  }

  onSelectUnloadRequest(unload_request_code){
    this.showSpinner = true
    this.prepareUnloadRequestData(unload_request_code)
    this.unload_request_code = unload_request_code
  }

  prepareRoles(){
    this.unloadRequestService.getRoles('administrateur').subscribe(
        
        (response: any) => {
          this.roles = response.data
        },
        (error) => {
          this.roles = []
        },
        () => {}
    )
  }

  prepareUnloadRequests(role_code){
    this.unloadRequestService.getUnloadRequests10(role_code).subscribe(
        (response: any) => {
          this.unloadRequests = response.data
        },
        (error) => {
            this.unloadRequests = []
        },
        () => {}
    )
  }

  onSelectRole(role_code){
    this.prepareUnloadRequests(role_code)
    this.roleService.getByOne({role_code : role_code}).subscribe(

      (response: any) => {
        this.role = response.data
     
      },
      (error) => {
       console.log("error")
      },
      () => {}
  )
 }

 getLdStatus(site , loc_ref){
  this.locationService.getByOne({loc_site : site , loc_loc : loc_ref }).subscribe(

    (response: any) => {
      this.locData = response.data.loc_status
   console.log(this.locData)
   return this.locData
    },
    (error) => {
     console.log("error")
    },
    () => {}

    )

 }

 




}
