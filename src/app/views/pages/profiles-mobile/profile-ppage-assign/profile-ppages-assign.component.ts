import { Component, OnInit } from "@angular/core"
// Angular slickgrid
import {
    Column,
    GridOption,
    Formatter,
    Formatters,
    Editor,
    Editors,
    FieldType,
    OnEventArgs,
    AngularGridInstance,
    GridService,
} from "angular-slickgrid"
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms"
import { Observable, BehaviorSubject, Subscription, of } from "rxjs"
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

import { ProfileMobile, MobileSettingsService ,UsersMobileService,CustomerMobileService   , ItemService} from "../../../../core/erp"
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'kt-profiles-list',
  templateUrl: './profile-ppages-assign.component.html',
  styleUrls: ['./profile-ppages-assign.component.scss']
})
export class ProfileProductsPagesAssignComponent implements OnInit {

  // slick grid
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []
  profiles: any[] = []
  profileForm: FormGroup
  hasFormErrors = false
  gridObj: any
  angularGrid: AngularGridInstance
  loading$: Observable<boolean>
  gridService: GridService
  message: any
  column : Column
  grid: any
  dataView: any
  profile_code : any
  selectedIndexes : any[]
  pagesCodes : any [] = []

  // items: [];
  columnDefinitions4: Column[] = [];
  gridOptions4: GridOption = {};
  gridObj4: any;
  angularGrid4: AngularGridInstance;
  dataView4: any
  grid4: any;
  row_number;
  
  selectedIndexes2: any[];
  pageEdit: any
  selectedItems: number[] = [];
  items: any[] = [];

  loadingSubject = new BehaviorSubject<boolean>(true)
  constructor(
      private activatedRoute: ActivatedRoute,
      private profileFB: FormBuilder,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private mobileSettingsService: MobileSettingsService,
      private itemService : ItemService,
      private usersMobileService: UsersMobileService,
      private modalService: NgbModal,
  ) 
  {
      this.prepareProfiles()
      this.prepareGrid()
  }

  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable()
    this.loadingSubject.next(true)
    this.prepareProfiles()
    this.createForm()
  }

  createCode() {
      this.router.navigateByUrl("profiles-mobile/create-profile-mobile")
  }

  prepareGrid() {
      this.columnDefinitions = [
        {
          id: "id",
          field: "id",
          excludeFromHeaderMenu: true,
          formatter: Formatters.deleteIcon,
          minWidth: 30,
          maxWidth: 30,
          onCellClick: (e: Event, args: OnEventArgs) => {
            if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
              this.angularGrid.gridService.deleteItem(args.dataContext);
            }
          },
        },
          {
              id: "id",
              name: "id",
              field: "id",
              sortable: true,
              minWidth: 80,
              maxWidth: 80,
          },
         
          {
              id: "product_page_code",
              name: "Code Page Produits",
              field: "product_page_code",
              sortable: true,
              filterable: true,
              type: FieldType.string,
              maxWidth: 200,
              editor: {
                model: Editors.text,
              },
            },
            {
              id: "description",
              name: "Description",
              field: "description",
              sortable: true,
              filterable: true,
              type: FieldType.string,
              maxWidth: 200,
            },   
            {
              id: "rank",
              name: "Rang",
              field: "rank",
              sortable: true,
              filterable: true,
              type: FieldType.integer,
              maxWidth: 50,
              editor: {
                model: Editors.integer,
              },
            },  
             

      ]

      this.gridOptions = {
          enableSorting: true,
          editable:true,
          enableCellNavigation: true,
          enableExcelCopyBuffer: true,
          enableFiltering: true,
          autoEdit: true,
          autoHeight: false,

          
      }
      // fill the dataset with your data
      this.dataset = []
      
      
      // this.gridService.setSelectedRows([2])
  }

  

  prepareProfiles(){
    this.usersMobileService.getAllProfiles().subscribe(
        
        (response: any) => {
          this.profiles = response.data
        
        },
        (error) => {
            this.profiles = []
        },
        () => {}
    )
  }

  createForm() {
    this.loadingSubject.next(false)

    this.profileForm = this.profileFB.group({
      profile_code: [this.profile_code],
    })
  }

  // save data
  onSubmit() {
    this.hasFormErrors = false
    const controls = this.profileForm.controls

    /** check form */
    if (this.profileForm.invalid) {
        Object.keys(controls).forEach((controlName) =>
            controls[controlName].markAsTouched()
        )

        this.hasFormErrors = true
        return
    }

   
  
    console.log(controls.profile_code.value)
    //console.log(this.pagesCodes)
    this.updateProfilePages(controls.profile_code.value,this.dataset)
  }

  updateProfilePages(profile_code, pagesCodes) {
        
    this.loadingSubject.next(true)
    this.itemService.updateProfileProductPages({profile_code},{pagesCodes}).subscribe(
        (reponse) => {
          // this.dataView.setItems(this.dataset)
          this.reset()
          this.createForm()
          this.hasFormErrors = false
        },
        (error) => {
            this.layoutUtilsService.showActionNotification(
                "Erreur verifier les informations",
                MessageType.Create,
                10000,
                true,
                true
            )
            this.loadingSubject.next(false)
        },
        () => {
            this.layoutUtilsService.showActionNotification(
                "Mise a jour des pages avec succès",
                MessageType.Create,
                10000,
                true,
                true
            )
            this.loadingSubject.next(false)
            this.reset()
            this.router.navigateByUrl("/profiles-mobile/assign-profile-products-pages")
        }
    )
}

  reset() {
    this.createForm()
    this.dataset=[]
    this.hasFormErrors = false
    
  }

  goBack() {
    this.loadingSubject.next(false)
    const url = `/`
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;
    this.gridService = angularGrid.gridService;
  
  }

  onSelectProfile(){
    const controls = this.profileForm.controls
const profile_code = controls.profile_code.value
    this.mobileSettingsService.GetProfileProductPage({profile_code:profile_code}).subscribe(
      (response: any) => {
        console.log(response.data)
        this.dataset = response.data
        this.dataView.setItems(this.dataset)
      
      },
      (error) => {
          // this.dataset = []
      },
      () => {}
    )
   
    this.gridService.setSelectedRows([1,2])
  }
  addNewItem(content4) {
    this.prepareGrid4();
    this.modalService.open(content4, {backdrop: 'static',  size: "lg" });
  }
  addpage() {
    // this.itinerary.push({})
    var l: any[] = [];
    let i = 0
    console.log(this.selectedIndexes)
    this.selectedIndexes.forEach((index) => {
      console.log(index)
      let ind = this.dataset.findIndex((page)=>{return page.product_page_code === this.items[index].product_page_code})
      console.log(ind)
      if (ind < 0) {
       this.gridService.addItem(
         {
           id: this.dataset.length + 1,
           product_page_code: this.items[index].product_page_code,
           description : this.items[index].description,
         },
         { position: "bottom" }
       );
      } 
     
    });
    // console.log("lllllllll",l)
 

    this.dataView.setItems(this.dataset);
  }
  handleSelectedRowsChanged4(e, args) {
   
    this.selectedIndexes = [];
    this.selectedIndexes = args.rows;
  }
  angularGridReady4(angularGrid: AngularGridInstance) {
    
    this.angularGrid4 = angularGrid;
    this.gridObj4 = (angularGrid && angularGrid.slickGrid) || {};
    this.dataView4 = angularGrid.dataView;
    this.grid4 = angularGrid.slickGrid;
   // this.dataView4.getIdxById(itemss)
  }

  prepareGrid4() {
    this.columnDefinitions4 = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
    },
   
    {
        id: "product_page_code",
        name: "Code Page Produits",
        field: "product_page_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        maxWidth: 200,
      },
      {
        id: "description",
        name: "Description",
        field: "description",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        maxWidth: 200,
      }, 
    ];
  

    this.gridOptions4 = {
      enableSorting: true,
      enableCellNavigation: true,
      enableExcelCopyBuffer: true,
      enableFiltering: true,
      autoEdit: false,
      autoHeight: false,
      frozenColumn: 0,
      frozenBottom: true,
      enableRowSelection: true,
      enableCheckboxSelector: true,
      editable: true,
      checkboxSelector: {
        // optionally change the column index position of the icon (defaults to 0)
        // columnIndexPosition: 1,

        // remove the unnecessary "Select All" checkbox in header when in single selection mode
        hideSelectAllCheckbox: true,

        // you can override the logic for showing (or not) the expand icon
        // for example, display the expand icon only on every 2nd row
        // selectableOverride: (row: number, dataContext: any, grid: any) => (dataContext.id % 2 === 1)
      },
      multiSelect: true,
      rowSelectionOptions: {
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: false,
      },
      presets: {

        sorters: [{ columnId: "id", direction: "ASC" }],
      }
    };

    // fill the dataset with your data
    this.itemService.getAllProductPages().subscribe(
      (response: any) => {
        this.items = response.data
        this.dataView.setItems(this.dataset)
      
      },
      (error) => {
          // this.dataset = []
      },
      () => {}
    )
  }
 
  open4(content) {
    this.prepareGrid4();
    this.modalService.open(content, { size: "lg" });
  }
}
