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

import {BomService,   SiteService,  } from "../../../../core/erp"
@Component({
  selector: 'kt-bom-cost',
  templateUrl: './bom-cost.component.html',
  styleUrls: ['./bom-cost.component.scss']
})
export class BomCostComponent implements OnInit {

  
  
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  isExist = false 
  error = false
  boms: [];
  columnDefinitionsbom: Column[] = [];
  gridOptionsbom: GridOption = {};
  gridObjbom: any;
  angularGridbom: AngularGridInstance;
  selectedField = ""
  bomForm: FormGroup;
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
    private bomFB: FormBuilder,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private bomService: BomService,
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
   
    this.bomForm = this.bomFB.group({
     
      bom1: [""],
      bom2: [""],
      site:["",Validators.required],
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
   
      this.dataset=[]
      this.createForm();

      this.hasFormErrors = false;
    }
    
// save data
onSubmit() {
  this.hasFormErrors = false
  const controls = this.bomForm.controls
  /** check form */
  if (this.bomForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
          controls[controlName].markAsTouched()
      )

      this.hasFormErrors = true
      return
  }
let cost= null
  if (confirm("Êtes-vous sûr de Mettre à jour les coûts?") )
 
    {
     
      this.bomService.AddBomCost({ Detail: this.dataset}).subscribe(
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
          this.router.navigateByUrl("/manufacturing/bom-cost");
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
  
 
  const controls = this.bomForm.controls
  var bom1 = controls.bom1.value
 
  var bom2 = controls.bom2.value
  const site = controls.site.value
  const type = controls.type.value
if(bom1 == null || bom1 == "") { bom1 = "0"}

if(bom2 == null || bom2 == "") { bom2 = "ZZZZZZZZZZZZZZZZZZZZ"}
var errors = false
if (controls.site.value == "" || controls.site.value == null || controls.type.value == "" || controls.type.value == null)  {
  errors = true
}
  let obj= {bom1,bom2,site,type}
  if (!errors) {
  this.bomService.CalcBomCost(obj).subscribe(
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


 handleSelectedRowsChangedbom(e, args) {
  const controls = this.bomForm.controls;
  if (Array.isArray(args.rows) && this.gridObjbom) {
    args.rows.map((idx) => {
      const item = this.gridObjbom.getDataItem(idx);
      switch (this.selectedField) {
                    
        case "bom1": {
            controls.bom1.setValue(item.bom_parent || "")
            break
        }
        case "bom2": {
          controls.bom2.setValue(item.bom_parent || "")
          break
      }
          default:
              break
      }
    });
  }
}

angularGridReadybom(angularGrid: AngularGridInstance) {
  this.angularGridbom = angularGrid;
  this.gridObjbom = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGridbom() {
  this.columnDefinitionsbom = [
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
      id: "bom_parent",
      name: "Code",
      field: "bom_parent",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "bom_desc",
      name: "Designation",
      field: "bom_desc",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
   


  ];

  this.gridOptionsbom = {
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
  this.bomService
    .getAll()
    .subscribe((response: any) => (this.boms = response.data));
}
openbom(content, field) {
  this.selectedField = field
  this.prepareGridbom()
  this.modalService.open(content, { size: "lg" })
}

changeBom (field){

  const controls = this.bomForm.controls 
  let bom_parent : any
  if (field=="bom1") {
      bom_parent  = controls.bom1.value
  
  } else {
    bom_parent  = controls.bom2.value
  }
 
  
this.bomService.getBy({bom_parent}).subscribe((res:any)=>{
    const {data} = res
    console.log(res)
    if (!data){  alert("Code Nomenclature N existe pas")
      if (field=="bom1") {
      controls.bom1.setValue(null) 
      document.getElementById("bom1").focus(); 
       }
      else {
        controls.bom2.setValue(null) 
        document.getElementById("bom2").focus(); 
      }
    }
},error=>console.log(error))
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
      id: "bom",
      name: "Code bom",
      field: "bom",
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
      id: "old_mtl_tl",
      name: "Ancien Coût Matiere",
      field: "old_mtl_tl",
      sortable: true,
      width: 50,
      filterable: true,
    
      type: FieldType.float,
      
    },
    {
      id: "old_mtl_ll",
      name: "Ancien Coût Matiere Niv Inf",
      field: "old_mtl_ll",
      sortable: true,
      width: 50,
      filterable: true,
    
      type: FieldType.float,
      
    },
    {
      id: "mtl_tl",
      name: " Matiere",
      field: "mtl_tl",
      sortable: true,
      width: 50,
      filterable: true,
    
      type: FieldType.float,
      
    },
    {
      id: "mtl_ll",
      name: "matiere Niv Inf",
      field: "mtl_ll",
      sortable: true,
      width: 50,
      filterable: true,
    
      type: FieldType.float,
      
    },

    {
      id: "lbr_ll",
      name: " Main d oeuvre Niv Inf",
      field: "lbr_ll",
      sortable: true,
      width: 50,
      filterable: true,
    
      type: FieldType.float,
      
    },
    {
      id: "bdn_ll",
      name: "FG Variable Niv Inf",
      field: "bdn_ll",
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
handleSelectedRowsChangedsite(e, args) {
  const controls = this.bomForm.controls;
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
  const controls = this.bomForm.controls;
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
}