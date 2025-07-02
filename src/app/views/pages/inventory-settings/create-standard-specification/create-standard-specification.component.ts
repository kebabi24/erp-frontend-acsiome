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
    FieldType, GridService, OnEventArgs, Formatters
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
    
    specificationForm: FormGroup
    popupForm: FormGroup
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

    clickedRowIndex : any ;

    valueIsBool = false;
    valueIsMinMax = false;
    valueIsChar = false;
    
    user:any;
    domain:any;


    constructor(
        config: NgbDropdownConfig,
        private siteFB: FormBuilder,
        private fb: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private layoutUtilsService: LayoutUtilsService,
        private modalService: NgbModal,
        private qualityControlService: QualityControlService
    ) {
        config.autoClose = true
    }

    ngOnInit(): void {
        this.loading$ = this.loadingSubject.asObservable()
        this.loadingSubject.next(false)
        this.createForm()
        this.createPopupForm()
        this.prepareGrid()
        this.user = JSON.parse(localStorage.getItem("user"));
        this.domain = this.user.usrd_domain
        console.log(this.domain)
    }
    //create form

    createForm() {
      this.loadingSubject.next(false)
        const date = new Date()
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

    createPopupForm() {
      this.loadingSubject.next(false)
        this.popupForm = this.fb.group({
            max: [""],
            min: [""],
            char: [""],
            bool: [""],
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
          mp_expire : validity_date,
          mp_domain:this.domain
        }

        let specificationDetails = []
        this.details.forEach(element => {
          console.log("NB LINE : " + element.mpd_tol)
          specificationDetails.push({
            mpd_nbr : doc_code,
            mpd_label : element.code_param,
            mpd_type : element.nb_line,
            mpd_tol:element.val,
            mpd_tol_type : element.measure_unit,
            mpd_chr01 : element.test_method ,
            mpd_chr02 : element.val_type,
            mpd_dec01: element.min,
            mpd_dec02: element.max,
            mpd_domain:this.domain
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
    

    mvGridReady(angularGrid: AngularGridInstance) {
      this.angularGrid = angularGrid;
      this.dataView = angularGrid.dataView;
      this.grid = angularGrid.slickGrid;
      this.gridService = angularGrid.gridService;
    }
    
    
    
    
    prepareGrid() {
      console.log("Grid length :"+ this.details.length )

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
                  onCellClick: (e: Event, args: OnEventArgs) => {
                    this.clickedRowIndex = args.dataContext.id
                    console.log(args.dataContext.id)
                  },
                  editor: {model: Editors.singleSelect, 
                  collection:[{value :"bool", label:"Booléen"},{value :"value", label:"Valeur"},{value :"char", label:"Caractère"}],
                  elementOptions: {
                    onClick: (event) => {
                      switch(event.value){
                        case 'bool':{
                          this.valueIsBool = true 
                          this.valueIsChar = false 
                          this.valueIsMinMax = false
                          break;
                        }
                        case 'value':{
                          this.valueIsBool = false 
                          this.valueIsChar = false 
                          this.valueIsMinMax = true
                          break;
                        }
                        case 'char':{
                          this.valueIsBool = false 
                          this.valueIsChar = true 
                          this.valueIsMinMax = false
                          break;
                        }
                      }
                      this.createPopupForm()
                      document.getElementById("modalButton").click(); 
                  }} 
                }
                },
    
                {
                  id: "min",
                  name: "Min",
                  field: "min",
                  sortable: true,
                  minWidth: 100,
                  maxWidth: 300,
                  filterable: true,
                  type: FieldType.integer, 
                  editor: {model: Editors.integer}
                },
                
                {
                  id: "max",
                  name: "Max",
                  field: "max",
                  sortable: true,
                  minWidth: 100,
                  maxWidth: 300,
                  filterable: true,
                  type: FieldType.integer, 
                  editor: {model: Editors.integer}
                  
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

                },
                {
                  id: "bool",
                  name: "Booléen",
                  field: "bool",
                  sortable: true,
                  minWidth: 100,
                  maxWidth: 300, 
                  filterable: true,
                  type: FieldType.boolean, 
                  editor: {model: Editors.checkbox},
                  formatter :Formatters.checkmark
                }
                
                
          ]
    
          this.gridOptions = {
            asyncEditorLoading: false,
            editable: true,
            enableColumnPicker: true,
            enableCellNavigation: true,
            enableRowSelection: true,

            // asyncEditorLoading: false,
            // editable: true,
            //  enableAddRow:true,
            // enableColumnPicker: true,
            // enableCellNavigation: true,
            // enableRowSelection: true,
            // enableCheckboxSelector: true,
            // rowSelectionOptions: {
            //   selectActiveRow: false
            // }
          };
          this.details = []
    }
    
    addNewItem( ) {
      console.log("Grid length :"+ this.details.length )
      this.gridService.addItem(
        {
          id: this.details.length + 1,
          nb_line: "",
           code_param: "",
           measure_unit: "",
           test_method: "",
           val_type: "",
          max: 0,
          min: 0,
          
        },
        { position: "bottom" }
      );
    }

    openPopup(content){
      this.modalService.open(content, { size: "lg" });
    }

    updateGridLine(){
      let index = this.details.findIndex(e => e.id == this.clickedRowIndex)
      this.resetRowValues(index)

      const controls = this.popupForm.controls 

      if(this.valueIsMinMax){
        this.details[index].max = controls.max.value
        this.details[index].min = controls.min.value
      }else if(this.valueIsChar){
        this.details[index].val = controls.char.value 
      }else if(this.valueIsBool){
        this.details[index].bool = controls.bool.value 
      }
      this.dataView.setItems(this.details)
      document.getElementById("btnClosePopup").click(); 
    }

    resetRowValues(index){
      this.details[index].max = 0
      this.details[index].min =0
      this.details[index].val = ""
      this.details[index].bool = false 
    }

}




