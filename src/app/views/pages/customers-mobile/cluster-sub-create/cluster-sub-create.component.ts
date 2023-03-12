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
    OnEventArgs,
    Formatters,
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


import {  SubCluster  , CustomerMobileService} from "../../../../core/erp"
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
    templateUrl: "./cluster-sub-create.component.html",
    styleUrls: ["./cluster-sub-create.component.scss"],
})
export class SubClusterCreateComponent implements OnInit {
    subCluster: SubCluster
    subClusterForm: FormGroup
    hasFormErrors = false
    isExist = false
    loadingSubject = new BehaviorSubject<boolean>(true)
    loading$: Observable<boolean>
    public nodes = [
      
    ];
    public clusters = [];

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
    confirmDelete: boolean
    alertWarning: any
    
   
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
        this.prepareClusters()
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

        this.subCluster = new SubCluster()
        this.subClusterForm = this.profileFB.group({
          sub_cluster_code: [this.subCluster.sub_cluster_code, Validators.required],
          description: [this.subCluster.description, Validators.required],
          cluster_code :[this.subCluster.cluster_code]
        })
        
    }
  
    reset() {
        this.subCluster = new SubCluster()
        this.createForm()
        this.hasFormErrors = false
        
    }


    onChangeCode() {
        const controls = this.subClusterForm.controls
        const sub_cluster_code = controls.sub_cluster_code.value
        this.customerMobileService.getSubClusterByCode({code : sub_cluster_code}).subscribe(
            (res: any) => {
              console.log("response " + Object.keys(res.data.subCluster));
           
              if (res.data.subCluster) {
                alert("Ce code sub cluster existe déjà")
                this.isExist = true
                document.getElementById("subCluster").focus();
                controls.description.disable()
              } else {
                controls.description.enable()
            }
                   
        })
    
    }

    prepareClusters() {

        // fill the dataset with your data
        this.customerMobileService.getAllClusters().subscribe(
            
            (response: any) => {
            this.clusters = response.data.clusters
            this.nodes = this.clusters.map((item) => {
                const node : any = {
                    id: item.id,
                    cluster_code: item.cluster_code,
                    description: item.description,
                };
                return node;
              });
            
            },
            (error) => {
                this.clusters = []
            },
            () => {}
        )
        //console.log(this.nodes)
    }
      

    

    // save data
    onSubmit() {
        this.hasFormErrors = false
        const controls = this.subClusterForm.controls

        /** check form */
        if (this.subClusterForm.invalid) {
            Object.keys(controls).forEach((controlName) =>
                controls[controlName].markAsTouched()
            )

            this.hasFormErrors = true
            return
        }

        // tslint:disable-next-line:prefer-const
        let sub_cluster = this.prepareSubCluster()
        console.log('sub cluster' + Object.keys(sub_cluster))
        console.log('sub cluster' + Object.values(sub_cluster))
        this.addSubCluster(sub_cluster)
        //console.log(this.selectedMenus)
    }


    /**
     * Returns object for saving
     */


    prepareSubCluster(): SubCluster {
        const controls = this.subClusterForm.controls
        const _sub_cluster = new SubCluster()
        _sub_cluster.sub_cluster_code = controls.sub_cluster_code.value
        _sub_cluster.cluster_code = controls.cluster_code.value
        _sub_cluster.description = controls.description.value
        

        return _sub_cluster
    }



    /**
     * Add profile
     *
     * @param _subCluster: SubClusterModel
     */
    addSubCluster(_subCluster: SubCluster) {
        
        this.loadingSubject.next(true)
        this.customerMobileService.createSubCluster({sub_cluster:_subCluster}).subscribe(
            (response) => {
              this.dataset.push(response['data'].subCluster)
              this.dataView.setItems(this.dataset)
              this.reset()
              this.subCluster = new SubCluster()
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
                    "Sub Cluster ajout avec succès",
                    MessageType.Create,
                    10000,
                    true,
                    true
                )
                this.loadingSubject.next(false)
                // this.router.navigateByUrl("/customers-mobile/cluster-sub-create")
            }
        )
    }

    deleteSubCluster(subClusterId : Number){
      this.customerMobileService.deleteSubCluster({subClusterId:subClusterId}).subscribe(
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
                "Sub Cluster supprimé avec succès",
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
        this.customerMobileService.getAllSubClusters().subscribe(
          (response: any) => {
            console.log(response.data)
            this.dataset = response.data.subClusters
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
                this.alertWarning = `Deleting: ${args.dataContext.sub_cluster_code}`;
                this.deleteSubCluster(args.dataContext.id)
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
                id: "sub_cluster_code",
                name: "Sub Cluster Code ",
                field: "sub_cluster_code",
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
                id: "cluster_code",
                name: "Code Cluster",
                field: "cluster_code",
                sortable: true,
                editor: {
                  model: Editors.text,
                },
                minWidth: 100,
                maxWidth: 300,
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
