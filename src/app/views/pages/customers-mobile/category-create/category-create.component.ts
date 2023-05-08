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


import { CustomerMobileService} from "../../../../core/erp"
import { takeUntil } from "rxjs/operators"
import { Category } from "src/app/core/erp/_models/category.model"

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
    selector: "kt-create-category",
    templateUrl: "./category-create.component.html",
    styleUrls: ["./category-create.component.scss"],
})
export class CategoryCreateComponent implements OnInit {
    category: Category
    categoryForm: FormGroup
    hasFormErrors = false
    isExist = false
    loadingSubject = new BehaviorSubject<boolean>(true)
    loading$: Observable<boolean>

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
    confirmDelete: any
    
   
    constructor(
        config: NgbDropdownConfig,
        private profileFB: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private layoutUtilsService: LayoutUtilsService,
        private customerMobileService : CustomerMobileService,
    ) {
        config.autoClose = true
        this.prepareGrid()
       
    }
    ngOnInit(): void {
        this.loading$ = this.loadingSubject.asObservable()
        this.loadingSubject.next(true)
        this.createForm()
    }
 

    //create form
    createForm() {
        this.loadingSubject.next(false)

        this.category = new Category()
        this.categoryForm = this.profileFB.group({
          category_code: [this.category.category_code, Validators.required],
          description: [this.category.description, Validators.required],
        })
    }
  
    reset() {
        this.category = new Category()
        this.createForm()
        this.hasFormErrors = false
    }


    onChangeCode() {
        const controls = this.categoryForm.controls
        const category_code = controls.category_code.value
        this.customerMobileService.getCategoryByCode({code : category_code}).subscribe(
            (res: any) => {
              console.log("response " + Object.keys(res.data.category));
           
              if (res.data.category) {
                alert("Ce code catégorie existe déjà")
                this.isExist = true
                document.getElementById("category").focus();
                controls.description.disable()
              } else {
                controls.description.enable()
            }
                   
        })
    
      }

      

    

    // save data
    onSubmit() {
        this.hasFormErrors = false
        const controls = this.categoryForm.controls

        /** check form */
        if (this.categoryForm.invalid) {
            Object.keys(controls).forEach((controlName) =>
                controls[controlName].markAsTouched()
            )

            this.hasFormErrors = true
            return
        }

        // tslint:disable-next-line:prefer-const
        let category = this.prepareCategory()
        this.addCategory(category)
        //console.log(this.selectedMenus)
    }


    /**
     * Returns object for saving
     */


    prepareCategory(): Category {
        const controls = this.categoryForm.controls
        const _category = new Category()
        _category.category_code = controls.category_code.value
        _category.description = controls.description.value
        

        return _category
    }



    /**
     * Add profile
     *
     * @param _category: CategoryModel
     */
    addCategory(_category: Category) {
        
        this.loadingSubject.next(true)
        this.customerMobileService.createCategory({category:_category}).subscribe(
            (response) => {
              // console.log(Object.keys(response['data']))
              this.dataset.push(response['data'].category)
              this.dataView.setItems(this.dataset)
              this.reset()
              this.category = new Category()
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
                    "Catégorie ajout avec succès",
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

    deleteCategory(categoryId : Number){
      this.customerMobileService.deleteCategory({categoryId:categoryId}).subscribe(
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
                "Catégorie supprimé avec succès",
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
        this.customerMobileService.getAllCategories().subscribe(
          (response: any) => {
            console.log(response.data)
            this.dataset = response.data.categories
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
              this.alertWarning = `Deleting: ${args.dataContext.category_code}`;
              this.deleteCategory(args.dataContext.id)
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
                editor: {
                  model: Editors.text,
                },
                minWidth: 100,
                maxWidth: 300,
                filterable: true,
                type: FieldType.string,
            },
        ]
    
        this.gridOptions = {
          editable: true,
          // enableAddRow:true,
          enableSorting: true,
          // enableCellNavigation: true,
          // enableExcelCopyBuffer: true,
          enableFiltering: true,
          // enableRowSelection: true,
          // enableCheckboxSelector: true,
          autoEdit: false,  
          autoHeight: false,
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
