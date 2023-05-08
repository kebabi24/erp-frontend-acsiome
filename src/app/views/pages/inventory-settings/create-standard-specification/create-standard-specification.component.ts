import { Component, OnInit } from "@angular/core"
import {
    NgbDropdownConfig,
    NgbTabChangeEvent,
    NgbTabsetConfig,
    NgbModal,
} from "@ng-bootstrap/ng-bootstrap"

// Angular slickgrid
import {
    Column,
    GridOption,
    Formatter,
    Editor,
    Editors,
    AngularGridInstance,
    FieldType, GridService
} from "angular-slickgrid"

import { FormGroup, FormBuilder, Validators } from "@angular/forms"
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

import { Site, SiteService, AccountService , InventoryStatusService, EntityService , QualityControlService} from "../../../../core/erp"

@Component({
    selector: "kt-create-standard-specification",
    templateUrl: "./create-standard-specification.component.html",
    styleUrls: ["./create-standard-specification.component.scss"],
    providers: [NgbDropdownConfig, NgbTabsetConfig],
})
export class CreateStrandardSpecificationComponent implements OnInit {
    site: Site
    specificationForm: FormGroup
    hasFormErrors = false
    loadingSubject = new BehaviorSubject<boolean>(true)
    loading$: Observable<boolean>
    isExist = false
    error = false;
    msg: String;

    // NEW 
    doc_code : String ;
    doc_desc : String ;
  
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

  details: any = []; // dataset
    

    


    constructor(
        config: NgbDropdownConfig,
        private siteFB: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private layoutUtilsService: LayoutUtilsService,
        private modalService: NgbModal,
        private siteService: SiteService,
        private qualityControlService: QualityControlService
    ) {
        config.autoClose = true
    }

    ngOnInit(): void {
        this.loading$ = this.loadingSubject.asObservable()
        this.loadingSubject.next(false)
        this.createForm()
        this.prepareGrid()
    }
    //create form
    createForm() {
      this.loadingSubject.next(false)
        const date = new Date()
        this.site = new Site()
        this.specificationForm = this.siteFB.group({
            doc_code: [this.doc_code, Validators.required],
            doc_desc: [this.doc_desc],
            validity_date: [{
              year:date.getFullYear(),
              month: date.getMonth()+1,
              day: date.getDate()
            }],
            

        })
    }
    
    onChangeCode() {
        const controls = this.specificationForm.controls
        this.qualityControlService
            .findSpecificationByCode(
              controls.doc_code.value
            )
            .subscribe((response: any) => {
                if (response.data.length) {
                    this.isExist = true
                    console.log(response.data.length)
                } else {
                    controls.doc_desc.enable()
                    controls.validity_date.enable()
                }
               
         })
       
      }


      
    
    //reste form
    reset() {
        this.site = new Site()
        this.createForm()
        this.hasFormErrors = false
    }
    // save data
    onSubmit() {
        this.hasFormErrors = false
        const controls = this.specificationForm.controls
        /** check form */
        if (this.specificationForm.invalid) {
            Object.keys(controls).forEach((controlName) =>
                controls[controlName].markAsTouched()
            )

            this.hasFormErrors = true
            return
        }

        // tslint:disable-next-line:prefer-const
        // let site = this.prepareSite()
        let doc_code = controls.doc_code.value
        let doc_desc = controls.doc_desc.value
        let date = controls.validity_date.value
        const validity_date = date.year + '-' + date.month + '-' + date.day

        let specificationHeader = {
          mp_nbr : doc_code,
          mp_desc : doc_desc,
          mp_expire : validity_date
        }

        let specificationDetails = []
        this.details.forEach(element => {
          specificationDetails.push({
            mpd_nbr : doc_code,
            mpd_label : element.code_param,
            mpd_type : element.nb_line,
            mpd_tol:element.val,
            mpd_tol_type : element.measure_unit,
            mpd_chr01 : element.test_method ,
            mpd_chr02 : element.val_type,
            mpd_dec01: element.max,
            mpd_dec02: element.min
          })
        });

        
        this.qualityControlService.createStandardSpecification(specificationHeader,specificationDetails).subscribe(
          (reponse) => console.log("response", Response),
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
                  "Ajout avec succès",
                  MessageType.Create,
                  10000,
                  true,
                  true
              )
              this.loadingSubject.next(false)
              // this.router.navigateByUrl("/")
              this.details=[]
              this.createForm()
          }
      )
        // this.addSite(site)
    }
    /**
     * Returns object for saving
     */
    prepareSite(): Site {
        const controls = this.specificationForm.controls
        const _site = new Site()
        _site.si_site = controls.si_site.value
        _site.si_desc= controls.si_desc.value
        _site.si_entity= controls.si_entity.value
        _site.si_default= controls.si_default.value
        _site.si_status= controls.si_status.value
        _site.si_xfer_cc= controls.si_xfer_cc.value
        _site.si_xfer_sub= controls.si_xfer_sub.value
        _site.si_xfer_acct= controls.si_xfer_acct.value
        _site.si_auto_loc= controls.si_auto_loc.value
        _site.si_xfer_ownership= controls.si_xfer_ownership.value
        return _site
    }
    /**
     * Add code
     *
     * @param _code: CodeModel
     */
    addSite(_site: Site) {
        this.loadingSubject.next(true)
        this.siteService.add(_site).subscribe(
            (reponse) => console.log("response", Response),
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
                    "Ajout avec succès",
                    MessageType.Create,
                    10000,
                    true,
                    true
                )
                this.loadingSubject.next(false)
                this.router.navigateByUrl("/")
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
                    id: "nb_line",
                    name: "Numero",
                    field: "nb_line",
                    sortable: true,
                    minWidth: 100,
                    maxWidth: 300,
                    filterable: true,
                    type: FieldType.string,
                    editor: {model: Editors.text}
    
                },
    
                {
                    id: "code_param",
                    name: "code paramètre",
                    field: "code_param",
                    sortable: true,
                    minWidth: 100,
                    maxWidth: 300,
                    filterable: true,
                    type: FieldType.string, 
                    editor: {model: Editors.text}
                },
                {
                  id: "measure_unit",
                  name: "unité de mesure",
                  field: "measure_unit",
                  sortable: true,
                  minWidth: 100,
                  maxWidth: 300,
                  filterable: true,
                  type: FieldType.string, 
                  editor: {model: Editors.text}
                },
    
                
                {
                    id: "test_method",
                    name: "méthode de test",
                    field: "test_method",
                    sortable: true,
                    minWidth: 100,
                    maxWidth: 300,
                    filterable: true,
                    type: FieldType.string, 
                    editor: {model: Editors.text}
                },
                {
                  id: "val_type",
                  name: "Type de valeur",
                  field: "val_type",
                  sortable: true,
                  minWidth: 100,
                  maxWidth: 300,
                  filterable: true,
                  type: FieldType.string, 
                  editor: {model: Editors.text}
                },
    
                {
                  id: "max",
                  name: "Max",
                  field: "max",
                  sortable: true,
                  minWidth: 100,
                  maxWidth: 300,
                  filterable: true,
                  type: FieldType.string, 
                  editor: {model: Editors.text}
                },
                {
                  id: "min",
                  name: "Min",
                  field: "min",
                  sortable: true,
                  minWidth: 100,
                  maxWidth: 300,
                  filterable: true,
                  type: FieldType.string, 
                  editor: {model: Editors.text}
                },
                {
                  id: "val",
                  name: "Valeur",
                  field: "val",
                  sortable: true,
                  minWidth: 100,
                  maxWidth: 300,
                  filterable: true,
                  type: FieldType.string, 
                  editor: {model: Editors.text}
                }
                
          ]
    
          this.gridOptions = {
            asyncEditorLoading: false,
            editable: true,
            enableAddRow:true,
            enableColumnPicker: true,
            enableCellNavigation: true,
            enableRowSelection: true,
            enableCheckboxSelector: true,
            rowSelectionOptions: {
              selectActiveRow: false
            }
          };
    
    
    
    }
    
    addNewItem( ) {
      this.gridService.addItem(
        {
          id: this.details.length + 1,
    
          nb_line: "",
          code_param: "",
          measure_unit: "",
          test_method: "",
          val_type: "",
          max: "",
          min: "",
          
        },
        { position: "bottom" }
      );
    }
    

   

}
