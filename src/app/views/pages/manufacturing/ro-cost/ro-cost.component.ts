import { Component, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";

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
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Observable, BehaviorSubject, Subscription, of } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";

// Layout
import {
  SubheaderService,
  LayoutConfigService,
} from "../../../../core/_base/layout";

// CRUD
import {
  LayoutUtilsService,
  TypesUtilsService,
  MessageType,
} from "../../../../core/_base/crud";
import { MatDialog } from "@angular/material/dialog";
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";

import {WorkRouting, WorkRoutingService,  SiteService, WorkCenterService } from "../../../../core/erp"
@Component({
  selector: 'kt-ro-cost',
  templateUrl: './ro-cost.component.html',
  styleUrls: ['./ro-cost.component.scss']
})
export class RoCostComponent implements OnInit {

  
  workRouting: WorkRouting;
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  isExist = false 
  error = false
  gammes: [];
  columnDefinitionsgamme: Column[] = [];
  gridOptionsgamme: GridOption = {};
  gridObjgamme: any;
  angularGridgamme: AngularGridInstance;
  selectedField = ""
  gammeForm: FormGroup;
  hasFormErrors: boolean = false;

  angularGrid: AngularGridInstance;
  grid: any;
  gridService: GridService;
  dataView: any;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];

  datasite: [];
  columnDefinitionssite: Column[] = [];
  gridOptionssite: GridOption = {};
  gridObjsite: any;
  angularGridsite: AngularGridInstance;
user;
  constructor(
    config: NgbDropdownConfig,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private gammeFB: FormBuilder,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private workcenterService: WorkCenterService,
    private workroutingService: WorkRoutingService,
    private modalService: NgbModal,
    private siteService: SiteService,
    ) { config.autoClose = true}
    
    
     
      
  
  
  ngOnInit() {
    this.loading$ = this.loadingSubject.asObservable()
    this.loadingSubject.next(false)
    this.user =  JSON.parse(localStorage.getItem('user'))
    this.createForm();
    this.initGrid();
  }
  //create form
  createForm() {
    this.loadingSubject.next(false)
    this.workRouting = new WorkRouting()
    this.gammeForm = this.gammeFB.group({
      site:["",Validators.required],
     
      routing1: [""],
      routing2: [""],
      type:["",Validators.required]
     
     
    })
  }
  GridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;
    this.gridService = angularGrid.gridService;
  }
    //reste form
    reset() {
      this.workRouting = new WorkRouting();
      this.dataset=[]
      this.createForm();

      this.hasFormErrors = false;
    }
    
// save data
onSubmit() {
  this.hasFormErrors = false
  const controls = this.gammeForm.controls
  /** check form */
  if (this.gammeForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
          controls[controlName].markAsTouched()
      )

      this.hasFormErrors = true
      return
  }
let cost= null
  if (confirm("Êtes-vous sûr de Mettre à jour les coûts?") )
 
    {
     
      this.workroutingService.AddRoCost({ Detail: this.dataset}).subscribe(
        (reponse: any) => (cost = reponse.data),
        (error) => {
          this.layoutUtilsService.showActionNotification(
            "Erreur verifier les informations",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.loadingSubject.next(false);
        },
        () => {
          this.layoutUtilsService.showActionNotification(
            "Ajout avec succès",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.loadingSubject.next(false);
          console.log(this.dataset);
          this.reset()
          this.router.navigateByUrl("/manufacturing/ro-cost");
          this.reset()
        }
      );
    }  
 
}
/**
* Returns object for saving
*/
/**
* Add code
*
*/
calculatecost() {
  
 
  const controls = this.gammeForm.controls
  var routing1 = controls.routing1.value
 
  var routing2 = controls.routing2.value
  const site = controls.site.value
  const type = controls.type.value
if(routing1 == null || routing1 == "") { routing1 = "0"}

if(routing2 == null || routing2 == "") { routing2 = "ZZZZZZZZZZZZZZZZZZZZ"}
var errors = false
if (controls.site.value == "" || controls.site.value == null || controls.type.value == "" || controls.type.value == null)  {
  errors = true
}
  let obj= {routing1,routing2,site,type}
  if (!errors) {
  this.workroutingService.CalcRoCost(obj).subscribe(
    (response: any) => {   
      this.dataset = response.data
     console.log(this.dataset)
    this.dataView.setItems(this.dataset);
      
       },
    (error) => {
        this.dataset = []
    },
    () => {}
) 
  }
  else {
    alert ("Veuillez remplir tous les champs ")
  }
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


 handleSelectedRowsChangedgamme(e, args) {
  const controls = this.gammeForm.controls;
  if (Array.isArray(args.rows) && this.gridObjgamme) {
    args.rows.map((idx) => {
      const item = this.gridObjgamme.getDataItem(idx);
      switch (this.selectedField) {
                    
        case "routing1": {
            controls.routing1.setValue(item.ro_routing || "")
            break
        }
        case "routing2": {
          controls.routing2.setValue(item.ro_routing || "")
          break
      }
          default:
              break
      }
    });
  }
}

angularGridReadygamme(angularGrid: AngularGridInstance) {
  this.angularGridgamme = angularGrid;
  this.gridObjgamme = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGridgamme() {
  this.columnDefinitionsgamme = [
    {
      id: "id",
      field: "id",
      excludeFromColumnPicker: true,
      excludeFromGridMenu: true,
      excludeFromHeaderMenu: true,

      minWidth: 50,
      maxWidth: 50,
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
      id: "ro_routing",
      name: "Gamme",
      field: "ro_routing",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ro_desc",
      name: "Designation",
      field: "ro_desc",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
   


  ];

  this.gridOptionsgamme = {
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
    checkboxSelector: {
      // optionally change the column index position of the icon (defaults to 0)
      // columnIndexPosition: 1,

      // remove the unnecessary "Select All" checkbox in header when in single selection mode
      hideSelectAllCheckbox: true,

      // you can override the logic for showing (or not) the expand icon
      // for example, display the expand icon only on every 2nd row
      // selectableOverride: (row: number, dataContext: any, grid: any) => (dataContext.id % 2 === 1)
    },
    multiSelect: false,
    rowSelectionOptions: {
      // True (Single Selection), False (Multiple Selections)
      selectActiveRow: true,
    },
  };

  // fill the dataset with your data
  this.workroutingService
    .getAllDistinct()
    .subscribe((response: any) => (this.gammes = response.data));
}
opengamme(content, field) {
  this.selectedField = field
  this.prepareGridgamme()
  this.modalService.open(content, { size: "lg" })
}

changeRo (field){

  const controls = this.gammeForm.controls 
  let ro_routing : any
  if (field=="routing1") {
      ro_routing  = controls.routing1.value
  
  } else {
    ro_routing  = controls.routing2.value
  }
 
  
this.workroutingService.getByOne({ro_routing}).subscribe((res:any)=>{
    const {data} = res
    console.log(res)
    if (!data){  alert("Gamme N existe pas")
      if (field=="routing1") {
      controls.routing1.setValue(null) 
      document.getElementById("routing1").focus(); 
       }
      else {
        controls.routing2.setValue(null) 
        document.getElementById("routing2").focus(); 
      }
    }
},error=>console.log(error))
}
handleSelectedRowsChangedsite(e, args) {
  const controls = this.gammeForm.controls;
    if (Array.isArray(args.rows) && this.gridObjsite) {
    args.rows.map((idx) => {
      const item = this.gridObjsite.getDataItem(idx);
      console.log(item);
      
     controls.site.setValue(item.si_site);
      
  
   
});

  }
}
angularGridReadysite(angularGrid: AngularGridInstance) {
  this.angularGridsite = angularGrid;
  this.gridObjsite = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGridsite() {
  this.columnDefinitionssite = [
    
    {
      id: "id",
      name: "id",
      field: "id",
      sortable: true,
      minWidth: 80,
      maxWidth: 80,
    },
    {
      id: "si_site",
      name: "Site",
      field: "si_site",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "si_desc",
      name: "Designation",
      field: "si_desc",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
  ];

  this.gridOptionssite = {
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
      checkboxSelector: {
        // optionally change the column index position of the icon (defaults to 0)
        // columnIndexPosition: 1,

        // remove the unnecessary "Select All" checkbox in header when in single selection mode
        hideSelectAllCheckbox: true,

        // you can override the logic for showing (or not) the expand icon
        // for example, display the expand icon only on every 2nd row
        // selectableOverride: (row: number, dataContext: any, grid: any) => (dataContext.id % 2 === 1)
      },
      multiSelect: false,
      rowSelectionOptions: {
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: true,
      },
    };
  // fill the dataset with your data
  if(this.user.usrd_site == "*") {
  this.siteService
    .getAll()
    .subscribe((response: any) => (this.datasite = response.data));
  }
  else {
    this.siteService
    .getBy({si_site : this.user.usrd_site})
    .subscribe((response: any) => (this.datasite = response.data));

  }
}
opensite(contentsite) {
  this.prepareGridsite();
  this.modalService.open(contentsite, { size: "lg" });
}
onChangesite() {
  const controls = this.gammeForm.controls;
  const si_site = controls.site.value;
  
 
  this.siteService.getByOne({ si_site }).subscribe(
    (res: any) => {
console.log(res.data)
      if (!res.data) {
        console.log("hnahna")

       
          alert("Site n'existe pas  ")
          controls.site.setValue(null);
          document.getElementById("site").focus();
      
        
        } else {
         if( this.user.usrd_site != "*" && si_site != this.user.usrd_site){
          alert("Site n'est pas autorisé pour cet utilisateur ")
          controls.site.setValue(null);
          document.getElementById("site").focus();
           


         } 
        }
    
    });
 
}

initGrid() {
  this.columnDefinitions = [
/*    {
      id: "id",
      field: "id",
      excludeFromHeaderMenu: true,
      formatter: Formatters.deleteIcon,
      minWidth: 30,
      maxWidth: 30,
      onCellClick: (e: Event, args: OnEventArgs) => {
        if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
          this.mvangularGrid.gridService.deleteItem(args.dataContext);
        }
      },
    },*/
    {
      id: "id",
      name: "id",
      field: "id",
      excludeFromHeaderMenu: true,
    
      minWidth: 30,
      maxWidth: 30,
      
    },
    {
      id: "routing",
      name: "Code Gamme",
      field: "routing",
      sortable: true,
      width: 50,
      filterable: true,
      type: FieldType.text,
      

    }, 
    {
      id: "part",
      name: "Code Produit",
      field: "part",
      sortable: true,
      width: 50,
      filterable: true,
      type: FieldType.text,
      

    }, 
    {
      id: "desc",
      name: "Designation",
      field: "desc",
      sortable: true,
      width: 50,
      filterable: true,
      type: FieldType.text,
      

    }, 
    {
      id: "old_lbr",
      name: "Ancien Main d'œuvre",
      field: "old_lbr",
      sortable: true,
      width: 50,
      filterable: true,
    
      type: FieldType.float,
      
    },
    {
      id: "old_bdn",
      name: "Ancien FG variable",
      field: "old_bdn",
      sortable: true,
      width: 50,
      filterable: true,
    
      type: FieldType.float,
      
    },
    {
      id: "lbr",
      name: " Main d'œuvre",
      field: "lbr",
      sortable: true,
      width: 50,
      filterable: true,
    
      type: FieldType.float,
      
    },
    {
      id: "bdn",
      name: "FG variable",
      field: "bdn",
      sortable: true,
      width: 50,
      filterable: true,
    
      type: FieldType.float,
      
    },
  ];

  this.gridOptions = {
   
     
      enableAutoResize: true,
      enableSorting: true,
      autoHeight:true,
    
     
     
     
   
   

  }
  this.dataset = [];
  
  
}
}