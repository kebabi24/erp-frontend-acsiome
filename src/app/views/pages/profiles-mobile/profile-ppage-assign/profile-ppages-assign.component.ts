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

import { ProfileMobile, UsersMobileService ,CustomerMobileService   , ItemService} from "../../../../core/erp"

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

  loadingSubject = new BehaviorSubject<boolean>(true)
  constructor(
      private activatedRoute: ActivatedRoute,
      private profileFB: FormBuilder,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private usersMobileService: UsersMobileService,
      private itemService : ItemService,
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
      ]

      this.gridOptions = {
          enableSorting: true,
          enableCellNavigation: true,
          enableExcelCopyBuffer: true,
          enableFiltering: true,
          autoEdit: false,
          autoHeight: true,
          frozenColumn: 0,
          frozenBottom: true,
          enableRowSelection: true,
          enableCheckboxSelector: true,
          multiSelect: true,
          rowSelectionOptions: {
            selectActiveRow: false
          },
      }
      // fill the dataset with your data
      this.dataset = []
      this.itemService.getAllProductPages().subscribe(
        (response: any) => {
          this.dataset = response.data
          this.dataView.setItems(this.dataset)
          this.gridObj.setSelecteRows([1,2,3])
          this.gridService.setSelectedRows([1,2])
        },
        (error) => {
            // this.dataset = []
        },
        () => {}
      )
      
      // this.gridService.setSelectedRows([2])
  }

  onSelectedRowsChanged(e, args) {
    // console.log('indexs', args.rows);
    this.selectedIndexes =[]
    this.selectedIndexes = args.rows;
    // console.log('indexs', Object.keys(args));
    // console.log('indexs', args.changedSelectedRows);
    // console.log(this.gridService.getDataItemByRowIndex(args.changedSelectedRows[0]))
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

    console.log(this.selectedIndexes)
    this.pagesCodes=[]
    this.selectedIndexes.forEach(index => {
       this.pagesCodes.push(this.gridService.getDataItemByRowIndex(index).product_page_code)
    });
    console.log(controls.profile_code.value)
    console.log(this.pagesCodes)
    this.updateProfilePages(controls.profile_code.value,this.pagesCodes)
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
            this.router.navigateByUrl("/profiles-mobile/assign-profile-products-pages")
        }
    )
}

  reset() {
    this.createForm()
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
}
