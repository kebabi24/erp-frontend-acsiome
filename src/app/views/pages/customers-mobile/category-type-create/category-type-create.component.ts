import { Component, OnInit, OnChanges } from "@angular/core"
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"

// Angular slickgrid
import {
    Column,
    GridOption,
    Formatter,
    Editor,
    Editors,
    AngularGridInstance,
    GridService,
    FieldType,
    Formatters,
    OnEventArgs,
} from "angular-slickgrid"
import { FormGroup, FormBuilder, Validators } from "@angular/forms"
import { Observable, BehaviorSubject, Subscription, of } from "rxjs"
import { ActivatedRoute, Router } from "@angular/router"
import { MenuMobileConfig } from '../../../../core/_config/menuMobile.config'

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
import { IActionMapping, ITreeOptions, TREE_ACTIONS } from '@circlon/angular-tree-component';


import { CategoryType , CustomerMobileService} from "../../../../core/erp"
import { takeUntil } from "rxjs/operators"
// import { Cluster } from "src/app/core/erp/_models/cluster.model"

const actionMapping: IActionMapping = {
    mouse: {
      click: (tree, node, $event) => {
        console.log(node);
        $event.shiftKey
          ? TREE_ACTIONS.TOGGLE_ACTIVE_MULTI(tree, node, $event)
          : TREE_ACTIONS.TOGGLE_ACTIVE(tree, node, $event);
      }
    }
  };
@Component({
    selector: "kt-create-cluster",
    templateUrl: "./category-type-create.component.html",
    styleUrls: ["./category-type-create.component.scss"],
})
export class CategoryTypeCreateComponent implements OnInit {
    categoryType: CategoryType
    categoryTypeForm: FormGroup
    hasFormErrors = false
    isExist = false
    loadingSubject = new BehaviorSubject<boolean>(true)
    loading$: Observable<boolean>
    public nodes = [
      
    ];
    public categories = [];

    // grid stuff
    dataset: any[] = []
    columnDefinitions: Column[] = []
    gridOptions: GridOption = {}
    gridObj: any
    angularGrid: AngularGridInstance
    gridService: GridService
    message: any
    column : Column
    grid: any
    dataView: any
    selectedRow: any
    isSelected = false
    alertWarning: string
    confirmDelete: boolean
    
   
    constructor(
        config: NgbDropdownConfig,
        private profileFB: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private layoutUtilsService: LayoutUtilsService,
        private customerMobileService : CustomerMobileService
    ) {
        config.autoClose = true
        this.prepareCategories()
        this.prepareGrid()
       
    }
    ngOnInit(): void {
        this.loading$ = this.loadingSubject.asObservable()
        this.loadingSubject.next(true)
        console.log(this.categories)
        this.createForm()
    }
 

    //create form
    createForm() {
        this.loadingSubject.next(false)

        this.categoryType = new CategoryType()
        this.categoryTypeForm = this.profileFB.group({
          category_type_code: [this.categoryType.category_type_code, Validators.required],
          description: [this.categoryType.description, Validators.required],
          category_code :[this.categoryType.category_code],
        })
        
    }
  
    reset() {
        this.categoryType = new CategoryType()
        this.createForm()
        this.hasFormErrors = false
        
    }


    onChangeCode() {
        const controls = this.categoryTypeForm.controls
        const category_type_code = controls.category_type_code.value
        this.customerMobileService.getCategoryByCode({code : category_type_code}).subscribe(
            (res: any) => {
              console.log("response " + Object.keys(res.data.categoryType));
           
              if (res.data.categoryType) {
                alert("Ce code catégorie type existe déjà")
                this.isExist = true
                document.getElementById("categoryType").focus();
                controls.description.disable()
              } else {
                controls.description.enable()
            }
                   
        })
    
    }

    prepareCategories() {

        // fill the dataset with your data
        this.customerMobileService.getAllCategories().subscribe(
            
            (response: any) => {
            this.categories = response.data.categories
            this.nodes = this.categories.map((item) => {
                const node : any = {
                    id: item.id,
                    category_code: item.category_code,
                    description: item.description,
                };
                return node;
              });
            
            },
            (error) => {
                this.categories = []
            },
            () => {}
        )
        //console.log(this.nodes)
    }
      

    

    // save data
    onSubmit() {
        this.hasFormErrors = false
        const controls = this.categoryTypeForm.controls

        /** check form */
        if (this.categoryTypeForm.invalid) {
            Object.keys(controls).forEach((controlName) =>
                controls[controlName].markAsTouched()
            )

            this.hasFormErrors = true
            return
        }

        // tslint:disable-next-line:prefer-const
        let categoryType = this.prepareCategoryType()
        this.addCategoryType(categoryType)
    }


    /**
     * Returns object for saving
     */


    prepareCategoryType(): CategoryType {
        const controls = this.categoryTypeForm.controls
        const categoryType = new CategoryType()
        categoryType.category_type_code = controls.category_type_code.value
        categoryType.category_code = controls.category_code.value
        categoryType.description = controls.description.value
        console.log(controls.category_type_code.value)
        console.log(controls.category_code.value)
        console.log(controls.description.value)
    
        return categoryType
    }



    /**
     * Add category type 
     *
     * @param _categoryType: CategoryTypeModel
     */
    addCategoryType(_categoryType: CategoryType) {
        
        this.loadingSubject.next(true)
        this.customerMobileService.createCategoryType({category_type:_categoryType}).subscribe(
            (reponse) => {
              this.dataView.setItems(this.dataset)
              this.reset()
              this.categoryType = new CategoryType()
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
                    "Catégorie Type ajout avec succès",
                    MessageType.Create,
                    10000,
                    true,
                    true
                )
                this.loadingSubject.next(false)
                // this.router.navigateByUrl("/customers-mobile/category-type-create")
            }
        )
    }

    deleteCategoryType(categoryTypeId : Number){
      this.customerMobileService.deleteCategoryType({categoryTypeId:categoryTypeId}).subscribe(
        (reponse) => {
          console.log(reponse)
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
                "Catégorie Type supprimé avec succès",
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

    /**
     * Go back to the list
     *
     */
    goBack() {
        this.loadingSubject.next(false)
        const url = `/`
        this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
    }

    prepareGrid() {
    
        // this.dataset = await mobileSettingsService.getAllVisitResult() 
        this.customerMobileService.getAllCategoriesTypes().subscribe(
          (response: any) => {
            console.log(response.data)
            this.dataset = response.data.categoriesTypes
            this.dataView.setItems(this.dataset)
        },
          (error) => {
            this.dataset = []
          },
          () => {}
          )
    
         // this.mobileSettingsService.getAllVisitResult()
        
        this.columnDefinitions = [
          {
            id: 'edit',
            field: 'id',
            excludeFromColumnPicker: true,
            excludeFromGridMenu: true,
            excludeFromHeaderMenu: true,
            formatter: Formatters.infoIcon,
            minWidth: 30,
            maxWidth: 30,
            onCellClick: (e: Event, args: OnEventArgs) => {
              console.log(args);
              this.alertWarning = `Editing: ${args.dataContext.title}`;
            }
          },

          {
            id: 'delete',
            field: 'id',
            excludeFromColumnPicker: true,
            excludeFromGridMenu: true,
            excludeFromHeaderMenu: true,
            formatter: Formatters.deleteIcon,
            minWidth: 30,
            maxWidth: 30,
            onCellClick: (e: Event, args: OnEventArgs) => {
              this.confirmDelete = true
              console.log(args.dataContext);
              this.alertWarning = `Deleting: ${args.dataContext.category_type_code}`;
              this.deleteCategoryType(args.dataContext.id)
              this.dataset = this.dataset.filter(function(value, index, arr){ 
                return value.id != args.dataContext.id;
              })
              this.dataView.setItems(this.dataset)
            }
            
          },
          {
              id: "id",
              name: "id",
              field: "id",
              excludeFromHeaderMenu: true,
              minWidth: 40,
              maxWidth: 60,
              sortable:true,
          },
            {
                id: "category_type_code",
                name: "Catégorie type code",
                field: "category_type_code",
                sortable: true,
                minWidth: 100,
                maxWidth: 300,
                editor: {
                  model: Editors.text,
                },
                filterable: true,
                type: FieldType.string,
            },
            {
                id: "category_code",
                name: "Catégorie code",
                field: "category_code",
                sortable: true,
                minWidth: 100,
                maxWidth: 300,
                editor: {
                  model: Editors.text,
                },
                filterable: true,
                type: FieldType.string,
            },
            {
                id: "description",
                name: "Description",
                field: "description",
                sortable: true,
                minWidth: 100,
                maxWidth: 300,
                editor: {
                  model: Editors.text,
                },
                width: 100,
                filterable: true,
                type: FieldType.string,
            },
        ]
    
        this.gridOptions = {
          editable: true,
          enableSorting: true,
          autoEdit: false,  
          autoHeight: false,
          enableFiltering: true,
          // enableAddRow:true,
          // enableCellNavigation: true,
          // enableExcelCopyBuffer: true,
          // enableRowSelection: true,
          // enableCheckboxSelector: true,
          // frozenColumn: 0,
          // frozenBottom: true,
          checkboxSelector: {
            hideSelectAllCheckbox: true,
          },
            multiSelect: false,
            rowSelectionOptions: {
                selectActiveRow: true,
          },
    
          
        }
    
        // fill the dataset with your data
        // this.dataset = [
        //   {
        //     id:"1",
        //     category_type_code:"code cat",
        //     category_code:"10", 
        //     description: "Magasin Fermé", 
        //   },
        // ]
    
        
    
      }

      handleSelectedRowsChanged(e, args) {
        if (Array.isArray(args.rows) && this.grid) {
            args.rows.map((idx) => {
                const item = this.grid.getDataItem(idx)
                item.etat_service = false
                this.selectedRow = item
                console.log(item)
            })
        }
        this.isSelected = true
        this.createForm()
      }

    addNewItem() {
        this.angularGrid.gridService.addItem(
          {
            id: this.dataset.length + 1,
            category_code:"", 
            description: "", 
            
          },
          { position: "bottom" }
        );
      }

    angularGridReady(angularGrid: AngularGridInstance) {
        this.angularGrid = angularGrid;
          this.dataView = angularGrid.dataView;
          this.grid = angularGrid.slickGrid;
      
          // if you want to change background color of Duration over 50 right after page load,
          // you would put the code here, also make sure to re-render the grid for the styling to be applied right away
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
