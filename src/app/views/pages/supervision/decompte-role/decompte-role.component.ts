import { Component, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";

// Angular slickgrid
import {
  Formatter,
  Editor,
  Editors,
  OnEventArgs,
  AngularGridInstance,
  Aggregators,
  Column,
  DelimiterType,
  FieldType,
  FileType,
  Filters,
  Formatters,
  FlatpickrOption,
  GridService,
  GridOption,
  Grouping,
  GroupingGetterFunction,
  GroupTotalFormatters,
  SortDirectionNumber,
  Sorters,
  ColumnFilter,
  Filter,
  FilterArguments,
  FilterCallback,
  MultipleSelectOption,
  OperatorType,
  OperatorString,
  SearchTerm,
} from "angular-slickgrid"
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
import {
  RoleService,
  DecompteService,
} from "../../../../core/erp";
import { round } from 'lodash';
import { jsPDF } from "jspdf";
import { NumberToLetters } from "../../../../core/erp/helpers/numberToString";
import thId from "src/assets/plugins/formvalidation/src/js/validators/id/thId";
import { HttpUtilsService } from "../../../../core/_base/crud"
import { environment } from "../../../../../environments/environment"
import { HttpClient } from "@angular/common/http"


@Component({
  selector: 'kt-decompte-role',
  templateUrl: './decompte-role.component.html',
  styleUrls: ['./decompte-role.component.scss']
})
export class DecompteRoleComponent implements OnInit {

 
  soForm: FormGroup;
  totForm: FormGroup;
  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  error = false;

  draggableGroupingPlugin: any;
  
  selectedGroupingFields: Array<string | GroupingGetterFunction> = ['', '', ''];

  draggableGroupingPluginp: any;
  
  selectedGroupingFieldsp: Array<string | GroupingGetterFunction> = ['', '', ''];
  // grid options

  mvangularGrid: AngularGridInstance;
  mvgrid: any;
  mvgridService: GridService;
  mvdataView: any;
  mvcolumnDefinitions: Column[];
  mvgridOptions: GridOption;
  mvdataset: any[];

  datarole: [];
  columnDefinitionsrole: Column[] = [];
  gridOptionsrole: GridOption = {};
  gridObjrole: any;
  angularGridrole: AngularGridInstance;
  
  seq;
  user;
  row_number;
  message = "";
  // requistionServer;
  // vpServer;
  // provider;
  // curr
  // details : any [];
  // datasetPrint = [];
  // date: String;
 
  invid : any;

  constructor(
    config: NgbDropdownConfig,
    private soFB: FormBuilder,
    private http: HttpClient,
    private httpUtils: HttpUtilsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private layoutUtilsService: LayoutUtilsService,
    private roleService: RoleService,
    private decompteService: DecompteService,
  ) {
    config.autoClose = true;
    
  
  }

  handleSelectedRowsChangedS(e, args) {
    if (Array.isArray(args.rows) && this.mvgrid) {
      args.rows.map((idx) => {
        const item = this.mvgrid.getDataItem(idx);
        // this.itinerary = this.services[idx].role_itineraries
      
        // console.log(this.itinerary);
      });
    }
   
  }
  mvGridReady(angularGrid: AngularGridInstance) {
    this.mvangularGrid = angularGrid;
    this.mvdataView = angularGrid.dataView;
    this.mvgrid = angularGrid.slickGrid;
    this.mvdataView.getItemMetadata = this.updateItemMetadata(this.mvdataView.getItemMetadata);
    this.mvgrid.invalidate();
    this.mvgrid.render();
  }
  
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.user =  JSON.parse(localStorage.getItem('user'))
    console.log(this.user)
    this.createForm();
    this.initmvGrid();
    //this.initGrid();
    this.solist();
   
  }

  
 
  initmvGrid() {
    this.mvcolumnDefinitions = [
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
        id: "Role",
        name: "Role",
        field: "dec_role",
        sortable: true,
        width: 50,
        filterable: true,
        type: FieldType.text,
        
      }, 
      {
        id: "dec_effdate",
        name: "Date",
        field: "dec_effdate",
        sortable: true,
        width: 50,
        type: FieldType.date,
        filterable: true,
        
      },
      {
        id: "dec_type",
        name: "Type",
        field: "dec_type",
        sortable: true,
        width: 50,
        filterable: true,
        type: FieldType.text,
        
      },
      {
        id: "dec_desc",
        name: "Designation",
        field: "dec_desc",
        sortable: true,
        width: 50,
        filterable: true,
        type: FieldType.text,
        
      },
      {
        id: "dec_code",
        name: "Document",
        field: "dec_code",
        sortable: true,
        width: 50,
        filterable: true,
        type: FieldType.text,
        
      }, 
       
      {
        id: "dec_amt",
        name: "Montant",
        field: "dec_amt",
        sortable: true,
        width: 50,
        filterable: true,
        formatter: Formatters.decimal,
        params: { minDecimal: 2, maxDecimal: 2 }, 

       
      
      },
      
    ];

    this.mvgridOptions = {
      asyncEditorLoading: true,
     
      
        enableAutoResize: true,
        enableSorting: true,
        exportOptions: {
          sanitizeDataExport: true
        },
       
       
       
        formatterOptions: {
        
          // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
          displayNegativeNumberWithParentheses: false,
    
          // Defaults to undefined, minimum number of decimals
          minDecimal: 2,
          maxDecimal:2,
    
          // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
          thousandSeparator: ' ', // can be any of ',' | '_' | ' ' | ''
        },
       

    }
    this.mvdataset = [];
    
  
  }
  solist() {
    this.mvdataset = []
    
   
    const controls = this.soForm.controls
    controls.charge.setValue(0)
    controls.payment.setValue(0)
    controls.solde.setValue(0)
    controls.invamt.setValue(0)
    controls.credit.setValue(0)
    controls.ecart.setValue(0)

    const date = controls.calc_date.value
    ? `${controls.calc_date.value.year}/${controls.calc_date.value.month}/${controls.calc_date.value.day}`
    : null;
  
    const date1 = controls.calc_date1.value
    ? `${controls.calc_date1.value.year}/${controls.calc_date1.value.month}/${controls.calc_date1.value.day}`
    : null;
    const role = controls.role.value
    let obj= {date,date1,role}
    console.log(this.user)
    this.decompteService.getByAll(obj).subscribe(
      (response: any) => {   
        this.mvdataset = response.data.decomptes
       console.log(response.data)
       this.mvdataView.setItems(this.mvdataset);
      
       controls.charge.setValue(String(Number(response.data.charge[0].charge).toFixed(2)))
       controls.payment.setValue(String(Number(response.data.payment[0].payment).toFixed(2)))
       let solde = Number(response.data.charge[0].charge) - Number(response.data.payment[0].payment)
       controls.solde.setValue(String(Number(solde).toFixed(2)))
       controls.invamt.setValue(String(Number(response.data.invamt).toFixed(2)))
       controls.credit.setValue(String(Number(response.data.credit[0].result).toFixed(2)))
       let ecart = Number(solde) - Number(response.data.invamt) - Number(response.data.credit[0].result)
       console.log(ecart)
       controls.ecart.setValue(String(Number(ecart).toFixed(2)))
         },
      (error) => {
          this.mvdataset = []
      },
      () => {}
  )
  }
  onChangerole() {
    const controls = this.soForm.controls;
    const role_code = controls.role.value;
    
   
    this.roleService.getByOne({ role_code }).subscribe(
      (res: any) => {
  
        if (!res.data) {
       
            alert("Role n'existe pas  ")
            controls.site.setValue(null);
            document.getElementById("role").focus();
          } 
      
      });
   
  }
  
 
  //create form
  createForm() {
    this.loadingSubject.next(false);
    const date = new Date;
    
    this.soForm = this.soFB.group({
     // po_category: [{value: this.purchaseOrder.po_category, disabled:true}, Validators.required],
     role:[null,Validators.required],
     
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
      charge:[0],
      payment:[0],
      solde:[0],
      invamt:[0],
      credit:[0],
      ecart:[0],
    });

    const controls = this.soForm.controls
   /* this.sequenceService.getBy({ seq_type: "PO", seq_profile: this.user.usrd_profile }).subscribe(
      (res: any) => {
        this.seq = res.data[0].seq_seq
        console.log(this.seq)
        controls.po_category.setValue(this.seq);
    
    })
    */

  }
  //reste form
 
  handleSelectedRowsChangedrole(e, args) {
    const controls = this.soForm.controls;
      if (Array.isArray(args.rows) && this.gridObjrole) {
      args.rows.map((idx) => {
        const item = this.gridObjrole.getDataItem(idx);
        console.log(item);
        
       controls.role.setValue(item.role_code);
        
    
     
  });

    }
  }
  angularGridReadyrole(angularGrid: AngularGridInstance) {
    this.angularGridrole = angularGrid;
    this.gridObjrole = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridrole() {
    this.columnDefinitionsrole = [
      
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
    },
   
    {
        id: "role_name",
        name: "Role",
        field: "role_name",
        sortable: true,
        filterable: true,
        type: FieldType.string,
    },
    {
      id: "role_code",
      name: "Role",
      field: "role_code",
      sortable: true,
      filterable: true,
      type: FieldType.string,
  },
    {
      id: "userMobile_code",
      name: "Nom d'utilisateur",
      field: "userMobile_code",
      sortable: true,
      filterable: true,
      type: FieldType.date,
    },
    
    ];

    this.gridOptionsrole = {
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
   
  
      this.roleService.getAllRoles().subscribe((response: any) => (this.datarole = response.data));
   }
  openrole(contentsite) {
    this.prepareGridrole();
    this.modalService.open(contentsite, { size: "lg" });
  }



  updateItemMetadata(previousItemMetadata: any) {
    const newCssClass = "highlight-bg";
    // console.log(this.dataView);
    return (rowNumber: number) => {
      const item = this.mvdataView.getItem(rowNumber);
      let meta = {
        cssClasses: "",
      };
      if (typeof previousItemMetadata === "object") {
        meta = previousItemMetadata(rowNumber);
      }

     
      if (meta && item && item.dec_type) {

        const state = item.dec_type;
       

      
        if (state === "C") {
         
          console.log(state)
          meta.cssClasses = (meta.cssClasses || "") + " " + newCssClass;
        }
      }

      return meta;
    };
  }
  
 
}
