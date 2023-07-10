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
import { round } from 'lodash';
import { FormGroup, FormBuilder, Validators, NgControlStatus } from "@angular/forms";
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
import {
  FraisService,
  AccountPayableService,
  PurchaseReceiveService,
  ItemService,
  SiteService,
  CostSimulationService,

} from "../../../../core/erp";
import { DecimalPipe } from "@angular/common";
import { CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY } from "@angular/cdk/overlay/overlay-directives";

@Component({
  selector: 'kt-calc-cmp',
  templateUrl: './calc-cmp.component.html',
  styleUrls: ['./calc-cmp.component.scss']
})
export class CalcCmpComponent implements OnInit {

 
  calcForm: FormGroup;
  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  error = false;
  angularGrid: AngularGridInstance;
  grid: any;
  gridService: GridService;
  dataView: any;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];

  parts: [];
  columnDefinitionspart: Column[] = [];
  gridOptionspart: GridOption = {};
  gridObjpart: any;
  angularGridpart: AngularGridInstance;
  selectedField = ""
  
  
  datasite: [];
  columnDefinitionssite: Column[] = [];
  gridOptionssite: GridOption = {};
  gridObjsite: any;
  angularGridsite: AngularGridInstance;
  row_number;
  user: any;
 message = ""
  constructor(
    config: NgbDropdownConfig,
    private calcFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public  dialog: MatDialog,
    private modalService: NgbModal,
    private layoutUtilsService: LayoutUtilsService,
    private fraisService: FraisService,
    private itemService: ItemService,
    private costSimulationService: CostSimulationService,
    private siteService : SiteService
  
  ) {
     
  }
  gridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;
    this.gridService = angularGrid.gridService;
  }

  initGrid() {
  
    this.columnDefinitions = [
      

      //(qtym : tr.tr_qty_loc, qtys: stkA,coutm: cmpA,cmpM: cmpA})
           
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 50,
        maxWidth: 50,
    },
    {
      id: "date",
      name: "Date",
      field: "date",
      sortable: true,
      minWidth: 250,
      maxWidth: 250,
      filterable: false,
      formatter: Formatters.dateIso,
      type: FieldType.dateIso,
    },
    
      {
        id: "nbr",
        name: "N° Mouvement",
        field: "nbr",
        sortable: true,
        minWidth: 200,
        maxWidth: 200,
        filterable: false,
        
        
      },

      {
        id: "part",
        name: "Article",
        field: "part",
        sortable: true,
        minWidth: 200,
        maxWidth: 200,
        filterable: false,
        
      },
      {
        id: "desc",
        name: "Designation",
        field: "desc",
        sortable: true,
        minWidth: 200,
        maxWidth: 200,
        filterable: false,
        
      },
      {
        id: "qtys",
        name: "Stock ",
        field: "qtys",
        sortable: true,
        minWidth: 200,
        maxWidth: 200,
        filterable: false,
      
      },
      {
        id: "qtym",
        name: "Qte Mouvement ",
        field: "qtym",
        sortable: true,
        minWidth: 200,
        maxWidth: 200,
        filterable: false,
      
      },
      
      {
        id: "coutm",
        name: "Coût Mouvement",
        field: "coutm",
        sortable: true,
        minWidth: 200,
        maxWidth: 200,
        filterable: false,
      
      },
      {
        id: "cmpM",
        name: "CMP",
        field: "cmpM",
        sortable: true,
        minWidth: 200,
        maxWidth: 200,
        filterable: false,
      
      },
      
    ];

    this.gridOptions = {
      asyncEditorLoading: false,
      editable: true,
      enableColumnPicker: true,
      enableSorting: true,
      autoHeight:true,
      enableCellNavigation: true,
      enableRowSelection: true,
      enableAutoResize: false,
    
      
      formatterOptions: {
        
        // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
        displayNegativeNumberWithParentheses: true,
  
        // Defaults to undefined, minimum number of decimals
        minDecimal: 2,
  
        // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
        thousandSeparator: ' ', // can be any of ',' | '_' | ' ' | ''
      },
     /* presets: {
        sorters: [
          { columnId: 'psh_line', direction: 'ASC' }
        ],
      },*/
    };

    this.dataset = [];
  }






 ngOnInit(): void {
    this.reset();
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.user =  JSON.parse(localStorage.getItem('user'))
    console.log(this.user)
    this.createForm();
  this.initGrid()
  }

  
  //create form
  createForm() {
    this.loadingSubject.next(false);
      const date = new Date;
      
      this.calcForm = this.calcFB.group({
       
   // site:["",Validators.required],
     
    calc_date: [{
      year:date.getFullYear(),
      month: date.getMonth()+1,
      day: 1
    }],
    calc_date1: [{
      year:date.getFullYear(),
      month: date.getMonth()+1,
      day: date.getDate()
    }],

    part1 : [""],
    part2 : [""]
      });
  
      
  
    }



    addNewItem() {
      const controls = this.calcForm.controls;
      
  
          this.gridService.addItem(
            {
              id: this.dataset.length + 1,
              frp_prh_nbr: "",
              effdate: null,
              amt: 0,
              
            },
            { position: "bottom" }
          );
    }
  
  //reste form
  reset() {
  
    this.createForm();
    this.dataset = [];
    
    this.hasFormErrors = false;
  }
  // save data
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.calcForm.controls;
    /** check form */
    if (this.calcForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      this.message = "Modifiez quelques éléments et réessayez de soumettre.";
      this.hasFormErrors = true;

      return;
    }
    
   
    
    // let ap = this.prepareAP()
    // this.addAP(ap);


  }

  // prepareAP(): any {
  //   const controls = this.calcForm.controls;
   
  //   const _frais = new Frais();
   
  //   _frais.frp_inv_nbr = controls.frp_inv_nbr.value;
    
  //   _frais.frp_effdate = controls.frp_effdate.value
  //     ? `${controls.frp_effdate.value.year}/${controls.frp_effdate.value.month}/${controls.frp_effdate.value.day}`
  //     : null;

  //   _frais.frp_rmks = controls.frp_rmks.value; 
  //   _frais.frp_type_affect = controls.frp_type_affect.value; 
  //   _frais.frp_val = controls.amt.value; 
  //   return _frais;
  
  // }
  /**
   * Add po
   *
   * @param _frais: ap
   */
  addAP(_frais: any, detail: any) {
    for (let data of detail) {
      delete data.id;
      delete data.cmvid;
     
    }
    this.loadingSubject.next(true);
    let ar = null;
    const controls = this.calcForm.controls;

   this.fraisService
      .add({ frais: _frais, fraisDetail: detail })
      .subscribe(
        (reponse: any) => (ar = reponse.data),
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
          
          this.router.navigateByUrl("/account-Payable/create-account-Payable");
          this.reset()
        }
      );
  }
 
  
  /**
   * Go back to the list
   *
   */
  goBack() {
    this.loadingSubject.next(false);
    const url = `/`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }

  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  
 
  changepart (field){

    const controls = this.calcForm.controls 
    let pt_part : any
    if (field=="part1") {
        pt_part  = controls.part1.value
    
    } else {
      pt_part  = controls.part2.value
    }
   
    
  this.itemService.getByOne({pt_part}).subscribe((res:any)=>{
      const {data} = res
      console.log(res)
      if (!data){  alert("Code Article n'existe pas")
        if (field=="part1") {
        controls.part1.setValue(null) 
        document.getElementById("part1").focus(); 
         }
        else {
          controls.part2.setValue(null) 
          document.getElementById("part2").focus(); 
        }
      }
  },error=>console.log(error))
  }
  
handleSelectedRowsChangedpart(e, args) {
  const controls = this.calcForm.controls;
  
  if (Array.isArray(args.rows) && this.gridObjpart) {
    args.rows.map((idx) => {

      
      const item = this.gridObjpart.getDataItem(idx);
     
      
      switch (this.selectedField) {
                    
        case "part1": {
            controls.part1.setValue(item.pt_part || "")
            break
        }
        case "part2": {
          controls.part2.setValue(item.pt_part || "")
          break
      }
          default:
              break
      }
    
      
    }  
    )
  
  }
    
}
angularGridReadypart(angularGrid: AngularGridInstance) {
  this.angularGridpart = angularGrid;
  this.gridObjpart = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGridpart() {
 
  this.columnDefinitionspart = [
    {
      id: "id",
      name: "id",
      field: "id",
      sortable: true,
      minWidth: 80,
      maxWidth: 80,
    },
    {
      id: "pt_part",
      name: "code ",
      field: "pt_part",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "pt_desc1",
      name: "desc",
      field: "pt_desc1",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "pt_um",
      name: "desc",
      field: "pt_um",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    
  ];

  this.gridOptionspart = {
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
  this.itemService
    .getAll()
    .subscribe((response: any) => (this.parts = response.data));
}
openpart(content, field) {
  this.selectedField = field
  this.prepareGridpart()
  this.modalService.open(content, { size: "lg" })
}





  onValidate() {
    const controls = this.calcForm.controls
  var part1 = controls.part1.value
 
  var part2 = controls.part2.value
if(part1 == null || part1 == "") { part1 = "0"}

if(part2 == null || part2 == "") { part2 = "ZZZZZZZZZZZZZZZZZZZZ"}
const date = controls.calc_date.value
? `${controls.calc_date.value.year}/${controls.calc_date.value.month}/${controls.calc_date.value.day}`
: null;

const date1 = controls.calc_date1.value
? `${controls.calc_date1.value.year}/${controls.calc_date1.value.month}/${controls.calc_date1.value.day}`
: null;
  let obj= {part1,part2,date,date1}
  this.itemService.CalcCmp(obj).subscribe(
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
  onChangesite() {
    const controls = this.calcForm.controls;
    const si_site = controls.site.value;
    
   
    this.siteService.getByOne({ si_site }).subscribe(
      (res: any) => {
  console.log(res.data)
  const data = res.data
        if (data == null) {
          if( si_site != "*" ) {
            alert("Site n'existe pas  ")
            controls.site.setValue(null);
            document.getElementById("site").focus();
          }
          else {
            if( this.user.usrd_site != "*"){
              alert("Site n'existe pas  ")
              controls.site.setValue(null);
              document.getElementById("site").focus();
            
             } 
              
          }
          } else {
           if( this.user.usrd_site != "*" && si_site != this.user.usrd_site){
            alert("Site n'est pas autorisé pour cet utilisateur ")
            controls.site.setValue(null);
            document.getElementById("site").focus();
             


           } 
          }
      
      });
   
  }
  
  handleSelectedRowsChangedsite(e, args) {
    const controls = this.calcForm.controls;
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

  
}
