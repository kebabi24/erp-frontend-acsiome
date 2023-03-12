import { array } from '@amcharts/amcharts4/core';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDropdownConfig, NgbModal, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"
import { AngularGridInstance, Column, FieldType, GridOption, OnEventArgs, GridService, Editors, thousandSeparatorFormatted, Formatters } from 'angular-slickgrid';

import { BehaviorSubject, Observable } from 'rxjs';
import { LayoutUtilsService, MessageType } from 'src/app/core/_base/crud';
import { MobileServiceService, MobileService, RoleService, ItineraryService,LoadRequestService } from "../../../../core/erp"
import {   MobileSettingsService} from "../../../../core/erp"
@Component({
  selector: 'kt-transfer-charge-demande-delivery',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './transfer-charge-demande-delivery.component.html',
  styleUrls: ['./transfer-charge-demande-delivery.component.scss']
})
export class TransferChargeDemandeToDeliveryComponent implements OnInit {
  service: MobileService
  validationForm: FormGroup
  hasFormErrors = false
  isExist = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  
  roles: any[] = []
  role_code : any
  loadRequests: any[] = []
  load_request_code : any
  loadRequestData: any[] = []
  selectedLoadRequests :any[] = []
  selectedLoadRequest :any
  loadRequestDetails: any[] = []

  // GRID 
  columnDefinitions: Column[] = []
  columnDefinitions2: Column[] = []
  gridOptions: GridOption = {}
  gridOptions2: GridOption = {}
  gridObj: any
  angularGrid: AngularGridInstance
  gridService: GridService
  message: any
  column : Column
  grid: any
  dataView: any

  constructor(
    config: NgbDropdownConfig,
        private profileFB: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private loadRequestService : LoadRequestService,
        private layoutUtilsService: LayoutUtilsService,
        private modalService: NgbModal
  ) { 
        config.autoClose = true   
        this.prepareGrid()
        this.prepareGridTwo()
  }
 

  ngOnInit(): void {
        this.loading$ = this.loadingSubject.asObservable()
        this.loadingSubject.next(false)
        this.prepareRoles()
        this.createForm()
        
  }

  open(content) {
  
    this.loadRequestService.getLoadRequest20Details(this.selectedLoadRequest).subscribe(
      
      (response: any) => {
        console.log(response.data)
        this.loadRequestDetails = response.data
        this.dataView.setItems(this.loadRequestDetails)
      },
      (error) => {
          this.loadRequestDetails = []
      },
      () => {}
    )
    this.modalService.open(content, { size: "lg" })
  }

  onSubmit() {

    this.loadRequestService.updateLoadRequestsStatus40(this.selectedLoadRequests).subscribe(

      (response: any) => {
        console.log(response)
      },
      (error) => {
        // this.loadRequestData = []
        console.log(error)
      },
      () => {
        this.layoutUtilsService.showActionNotification(
            "Load requests status updated to 40",
            MessageType.Create,
            10000,
            true,
            true
        )
        this.loadingSubject.next(false)
        // this.router.navigateByUrl("/customers-mobile/cluster-create")
    }
    )

  }

  goBack() {
    this.loadingSubject.next(false)
    const url = `/service`
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}

prepareRoles(){
  this.loadRequestService.getRoles('administrateur').subscribe(
      
      (response: any) => {
        this.roles = response.data
      },
      (error) => {
        this.roles = []
      },
      () => {}
  )
}

// prepare load requests for grid
prepareLoadRequestData(load_request_data){
  this.loadRequestService.getLoadRequest20Details(load_request_data).subscribe(

      (response: any) => {
        this.loadRequestData = response.data
        console.log(response.data)
      },
      (error) => {
        this.loadRequestData = []
      },
      () => {}
  )
}

// prepare load requests for dropdown
prepareLoadRequets(role_code){
  this.loadRequestService.getLoadRequests20().subscribe(
      
    (response: any) => {
      console.log(Object.keys(response.data))
      this.loadRequests = response.data
      this.dataView.setItems(this.loadRequests)
    },
    (error) => {
        this.loadRequests = []
    },
    () => {}
  )
}

onSelectRole(role_code){
  this.role_code = role_code
  this.prepareLoadRequets(role_code)
}

onSelectLoadRequest(load_request_code){
  this.prepareLoadRequestData(load_request_code)
  this.load_request_code = load_request_code
}


createForm() {
  this.loadingSubject.next(false)
  this.validationForm = this.profileFB.group({
    role_code :[this.role_code],
    load_request_code:[this.load_request_code]
  })
}

// GRID STUFF
gridReady(angularGrid: AngularGridInstance) {
  this.angularGrid = angularGrid;
  this.dataView = angularGrid.dataView;
  this.grid = angularGrid.slickGrid;
  this.gridService = angularGrid.gridService;
}

angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;
    this.gridService = angularGrid.gridService;
    this.dataView.getItemMetadata = this.updateItemMetadata(this.dataView.getItemMetadata);
    this.grid.invalidate();
    this.grid.render();
}

updateItemMetadata(previousItemMetadata: any) {
  const newCssClass = 'highlight-bg';
  return (rowNumber: number) => {
    const item = this.dataView.getItem(rowNumber);
    let meta = {
      cssClasses: ''
    };
    if (typeof previousItemMetadata === 'object') {
      meta = previousItemMetadata(rowNumber);
    }

    if (meta && item && item.etat_service) {
      const state = item.etat_service;
      if (state === "true") {
        meta.cssClasses = (meta.cssClasses || '') + ' ' + newCssClass;
      }
    }

    return meta;
  };
}

prepareGrid() {
  this.columnDefinitions = [
            {
              id: 'delete',
              field: 'id',
              excludeFromColumnPicker: true,
              excludeFromGridMenu: true,
              excludeFromHeaderMenu: true,
              formatter: Formatters.infoIcon,
              minWidth: 30,
              maxWidth: 30,
              onCellClick: (e: Event, args: OnEventArgs) => {
                const loadRequestCode = this.gridService.getDataItemByRowIndex(args.row).load_request_code
                this.selectedLoadRequest= loadRequestCode
                let element: HTMLElement = document.getElementById(
                  "detailsGrid"
                  ) as HTMLElement;
                  element.click();
            
              }
              
            },
            {
                id: "load_request_code",
                name: "load Request Code",
                field: "load_request_code",
                sortable: true,
                minWidth: 100,
                maxWidth: 300,
                filterable: true,
                type: FieldType.string,

            },
            {
                id: "date_creation",
                name: "Creation Date",
                field: "date_creation",
                sortable: true,
                minWidth: 100,
                maxWidth: 300,
                filterable: true,
                type: FieldType.date, 
            },
            {
              id: "role_code",
              name: "Role Code",
              field: "role_code",
              sortable: true,
              minWidth: 70,
              maxWidth: 100,
              filterable: true,  
              type: FieldType.string, 
            }, 
            {
              id: "user_mobile_code",
              name: "User Mobile Code",
              field: "user_mobile_code",
              sortable: true,
              minWidth: 70,
              maxWidth: 100,
              filterable: true,  
              type: FieldType.string, 
            }, 
            {
              id: "role_loc",
              name: "Role Loc",
              field: "role_loc",
              sortable: true,
              minWidth: 70,
              maxWidth: 100,
              filterable: true,  
              type: FieldType.string, 
            },
            {
              id: "role_site",
              name: "Role Site",
              field: "role_site",
              sortable: true,
              minWidth: 70,
              maxWidth: 100,
              filterable: true,  
              type: FieldType.string, 
            },
      ]

      this.gridOptions = {
        asyncEditorLoading: false,
        editable: true,
        enableColumnPicker: true,
        enableCellNavigation: true,
        enableRowSelection: true,
        enableCheckboxSelector: true,
        rowSelectionOptions: {
          selectActiveRow: false
        }
      };

      this.loadRequestService.getLoadRequests20().subscribe(
      
        (response: any) => {
          console.log(Object.keys(response.data))
          this.loadRequests = response.data
          this.dataView.setItems(this.loadRequests)
        },
        (error) => {
            this.loadRequests = []
        },
        () => {}
      )


}

prepareGridTwo() {
  this.columnDefinitions2 = [
            {
                id: "product_code",
                name: "Product Code",
                field: "product_code",
                sortable: true,
                minWidth: 100,
                maxWidth: 300,
                filterable: true,
                type: FieldType.string, 
            },
            {
              id: "product_name",
              name: "Product Name",
              field: "product_name",
              sortable: true,
              minWidth: 100,
              maxWidth: 300,
              filterable: true,  
              type: FieldType.string, 
            }, 
            {
              id: "pt_price",
              name: "Product Price",
              field: "pt_price",
              sortable: true,
              minWidth: 70,
              maxWidth: 100,
              filterable: true,  
              type: FieldType.float, 
            }, 
            {
              id: "qt_effected",
              name: "Qty Affected",
              field: "qt_effected",
              sortable: true,
              minWidth: 70,
              maxWidth: 100,
              filterable: true,  
              type: FieldType.float , 
            },
            {
              id: "lot",
              name: "Lot",
              field: "lot",
              sortable: true,
              minWidth: 70,
              maxWidth: 100,
              filterable: true,  
              type: FieldType.string, 
            },

            {
              id: "date_experation",
              name: "Exp Date",
              field: "date_experation",
              sortable: true,
              minWidth: 70,
              maxWidth: 100,
              filterable: true,  
              type: FieldType.date, 
            },
      ]

      this.gridOptions2 = {
        asyncEditorLoading: false,
        editable: true,
        enableColumnPicker: true,
        enableCellNavigation: true,
        
      };
}

onSelectedRowsChanged(e, args) {
  // console.log('indexs', args.rows);
  const indexes = args.rows;
  this.selectedLoadRequests = []
  indexes.forEach(index => {
    const load_request_code = this.gridService.getDataItemByRowIndex(index).load_request_code
    this.selectedLoadRequests.push(load_request_code)
  });
  console.log(this.selectedLoadRequests)
}

}
