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


import { CustomerMobileService   } from "../../../../core/erp"
import { takeUntil } from "rxjs/operators"
import { Cluster } from "src/app/core/erp/_models/cluster.model"

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
    templateUrl: "./cluster-create.component.html",
    styleUrls: ["./cluster-create.component.scss"],
})
export class ClusterCreateComponent implements OnInit {
    cluster: Cluster
    clusterForm: FormGroup
    hasFormErrors = false
    isExist = false
    loadingSubject = new BehaviorSubject<boolean>(true)
    loading$: Observable<boolean>
    confirmDelete = false

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
    alertWarning: any
    
   
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

        this.cluster = new Cluster()
        this.clusterForm = this.profileFB.group({
          cluster_code: [this.cluster.cluster_code, Validators.required],
          description: [this.cluster.description, Validators.required],
        })
    }
  
    reset() {
        this.cluster = new Cluster()
        this.createForm()
        this.hasFormErrors = false
    }


    onChangeCode() {
        const controls = this.clusterForm.controls
        const cluster_code = controls.cluster_code.value
        this.customerMobileService.getClusterByCode({code : cluster_code}).subscribe(
            (res: any) => {
              console.log("response " + Object.keys(res.data.cluster));
           
              if (res.data.cluster) {
                alert("Ce code cluster existe déjà")
                this.isExist = true
                document.getElementById("cluster").focus();
                controls.description.disable()
              } else {
                controls.description.enable()
            }
                   
        })
    
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
            cluster_code:"", 
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

    prepareGrid() {
    
        // this.dataset = await mobileSettingsService.getAllVisitResult() 
        this.customerMobileService.getAllClusters().subscribe(
          (response: any) => {
            this.dataset = response.data.clusters
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
                this.alertWarning = `Deleting: ${args.dataContext.cluster_code}`;
                this.deleteCluster(args.dataContext.id)
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
                id: "cluster_code",
                name: "Code Cluster",
                field: "cluster_code",
                sortable: true,
                minWidth: 100,
                maxWidth: 300,
                editor: {
                  model: Editors.text,
                },
                // filterable: true,
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
                // filterable: true,
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
      

    

    // save data
    onSubmit() {
        this.hasFormErrors = false
        const controls = this.clusterForm.controls

        /** check form */
        if (this.clusterForm.invalid) {
            Object.keys(controls).forEach((controlName) =>
                controls[controlName].markAsTouched()
            )

            this.hasFormErrors = true
            return
        }

        // tslint:disable-next-line:prefer-const
        let cluster = this.prepareCluster()
        console.log('cluster' + Object.keys(cluster))
        console.log('cluster' + Object.values(cluster))
        this.addCluster(cluster)
    }


    /**
     * Returns object for saving
     */


    prepareCluster(): Cluster {
        const controls = this.clusterForm.controls
        const _cluster = new Cluster()
        _cluster.cluster_code = controls.cluster_code.value
        _cluster.description = controls.description.value
        

        return _cluster
    }



    /**
     * Add profile
     *
     * @param _cluster: ClusterModel
     */
    addCluster(_cluster: Cluster) {
        
        this.loadingSubject.next(true)
        this.customerMobileService.createCluster({cluster:_cluster}).subscribe(
            (reponse) => {
              this.dataset.push(reponse['data'].cluster)
              this.dataView.setItems(this.dataset)
              this.reset()
              this.cluster = new Cluster()
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
                    "Cluster ajout avec succès",
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

    deleteCluster(clusterId : Number){
      this.customerMobileService.deleteCluster({clusterId:clusterId}).subscribe(
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
                "Cluster supprimé avec succès",
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
    
    
}
