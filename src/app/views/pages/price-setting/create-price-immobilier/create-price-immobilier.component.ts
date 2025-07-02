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
  GridService,
  FieldType,
  Formatters,
  OnEventArgs,
} from "angular-slickgrid";

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

import { Pricelist, PricelistService, CodeService , ItemService, CustomerService,DeviseService,SiteService,LocationService} from "../../../../core/erp"

@Component({  
  selector: 'kt-create-price-immobilier',
  templateUrl: './create-price-immobilier.component.html',
  styleUrls: ['./create-price-immobilier.component.scss']
})
export class CreatePriceImmobilierComponent implements OnInit {

  pricelist: Pricelist
  priceForm: FormGroup
  hasFormErrors = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  isExist = false
  error = false;
  msg: String;

  
  devises: [];
  columnDefinitions2: Column[] = [];
  gridOptions2: GridOption = {};
  gridObj2: any;
  angularGrid2: AngularGridInstance;


  customers: [];
  columnDefinitionscm: Column[] = [];
  gridOptionscm: GridOption = {};
  gridObjcm: any;
  angularGridcm: AngularGridInstance;

  locs: [];
  columnDefinitionsloc: Column[] = [];
  gridOptionsloc: GridOption = {};
  gridObjloc: any;
  angularGridloc: AngularGridInstance;
  items: [];
    columnDefinitionspart: Column[] = [];
    gridOptionspart: GridOption = {};
    gridObjpart: any;
    angularGridpart: AngularGridInstance;

  data: [];
  columnDefinitions3: Column[] = [];
  gridOptions3: GridOption = {};
  gridObj3: any;
  angularGrid3: AngularGridInstance;
  selectedField = "";
  fieldcode = "";
  selectedCode = "";

  // grid options
  mvangularGrid: AngularGridInstance;
  mvgrid: any;
  mvgridService: GridService;
  mvdataView: any;
  mvcolumnDefinitions: Column[];
  mvgridOptions: GridOption;
  mvdataset: any[];
  row_number;
  user;
  constructor(
      config: NgbDropdownConfig,
      private priceFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public  dialog: MatDialog,
      private codeService: CodeService,
      private customerService: CustomerService,
      private deviseService: DeviseService,
      private itemService: ItemService,
      private layoutUtilsService: LayoutUtilsService,
      private modalService: NgbModal,
      private pricelistService: PricelistService,
      private siteService: SiteService,
      private locationService: LocationService
  ) {
      config.autoClose = true
  }

  mvGridReady(angularGrid: AngularGridInstance) {
    this.mvangularGrid = angularGrid;
    this.mvdataView = angularGrid.dataView;
    this.mvgrid = angularGrid.slickGrid;
    this.mvgridService = angularGrid.gridService;
  }
  ngOnInit(): void {
      this.user = JSON.parse(localStorage.getItem("user"));
      this.loading$ = this.loadingSubject.asObservable()
      this.loadingSubject.next(false)
      this.createForm()
      this.initmvGrid();
  }
  initmvGrid() {
    this.mvcolumnDefinitions = [
      {
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
      },
      {
        id: "pi_min_net",
        name: "Qte Min",
        field: "pi_min_net",
        width: 50,
        type: FieldType.float,
        editor: {
          model: Editors.float,
          params: { decimalPlaces: 2 },
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          console.log(args.row)
          if (args.row != 0) {
            if (args.dataContext.pi_min_net  <=  this.mvdataset[args.row-1].pi_max_ord) {
              
            alert ("Qte doit etre superieur a qte max du precedent palier")
            this.mvgridService.updateItemById(args.dataContext.id,{...args.dataContext , pi_min_net: 0 })   
            }
          }  
        }

      },
      {
        id: "pi_max_ord",
        name: "Qte max",
        field: "pi_max_ord",
        width: 50,
        type: FieldType.float,
        editor: {
          model: Editors.float,
          params: { decimalPlaces: 2 },
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
         
         
          if (args.dataContext.pi_max_ord  <  args.dataContext.pi_min_net) {
            
          alert ("Qte max doit etre superieure ou egale a qte min")
          this.mvgridService.updateItemById(args.dataContext.id,{...args.dataContext , pi_max_ord: null })   
          }
         
        }

      },
      {
        id: "pi_list_price",
        name: "Prix",
        field: "pi_list_price",
        width: 50,
        type: FieldType.float,
        editor: {
          model: Editors.float,
          params: { decimalPlaces: 2 },
        },
      },
      
    ];

    this.mvgridOptions = {
      asyncEditorLoading: false,
      editable: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableRowSelection: true,
    };

    this.mvdataset = [];
  }
  addNewItem() {
    const newId = this.mvdataset.length+1;

    const newItem = {
      id: newId,
      pi_min_net: 0,
      pi_max_ord: 0,
      pi_list_price: 0,
    };
    this.mvgridService.addItem(newItem, { position: "bottom" });
  }

  //create form
  createForm() {
    this.loadingSubject.next(false)
      this.pricelist = new Pricelist()
      const date = new Date;
    
      this.priceForm = this.priceFB.group({
          pi_list: [this.pricelist.pi_list, Validators.required],
          pi_desc: [{ value: this.pricelist.pi_desc, disabled: !this.isExist },  Validators.required ],
          pi_cs_code : [{ value: this.pricelist.pi_cs_code, disabled: !this.isExist }],
          pi_part_code : [{ value: this.pricelist.pi_part_code, disabled: !this.isExist }],
          pi_um: [{ value: this.pricelist.pi_um, disabled: !this.isExist }],
          pi_curr: [{ value: this.pricelist.pi_curr, disabled: !this.isExist }],
          pi_amt_type : [{ value: this.pricelist.pi_amt_type, disabled: !this.isExist }],
          pi_user1 : [{ value: this.pricelist.pi_user1, disabled: !this.isExist }],
          pi_user2 : [{ value: this.pricelist.pi_user2, disabled: !this.isExist }],
          
          pi_start: [{
            year:date.getFullYear(),
            month: date.getMonth()+1,
            day: date.getDate() 
          , disabled: !this.isExist}], 
          pi_expire: [{ value: this.pricelist.pi_expire, disabled: !this.isExist }],
          
      })
  }
  
  onChangeCode() {
      const controls = this.priceForm.controls
      this.pricelistService
          .getBy({
                pi_list: controls.pi_list.value,
                

          })
          .subscribe((response: any) => {
              if (response.data.length) {
                  this.isExist = true
                  console.log(response.data.length)
              } else {
                  controls.pi_desc.enable()
                  controls.pi_cs_code.enable() 
                  controls.pi_user1.enable()
                  controls.pi_user2.enable()
                  controls.pi_part_code.enable()
                  controls.pi_um.enable()
                  controls.pi_curr.enable()
                  controls.pi_amt_type.enable()
                  controls.pi_start.enable()
                  controls.pi_expire.enable()
                  

              }
             
       })
     
    }


  
  //reste form
  reset() {
      this.pricelist = new Pricelist()
      this.createForm()
      this.hasFormErrors = false
  }
  // save data
  onSubmit() {
      this.hasFormErrors = false
      const controls = this.priceForm.controls
      /** check form */
      if (this.priceForm.invalid) {
          Object.keys(controls).forEach((controlName) =>
              controls[controlName].markAsTouched()
          )

          this.hasFormErrors = true
          return
      }

      // tslint:disable-next-line:prefer-const
      let pricelist = this.preparePricelist()
      this.addPricelist(this.mvdataset, pricelist)
  }
  /**
   * Returns object for saving
   */
  preparePricelist(): Pricelist {
      const controls = this.priceForm.controls
      const _pricelist = new Pricelist()
      _pricelist.pi_list = controls.pi_list.value
      _pricelist.pi_desc= controls.pi_desc.value
     
      _pricelist.pi_cs_code = controls.pi_cs_code.value
      _pricelist.pi_user1 = controls.pi_user1.value
      _pricelist.pi_user2 = controls.pi_user2.value
      _pricelist.pi_part_code = controls.pi_part_code.value
      _pricelist.pi_um = controls.pi_um.value
      _pricelist.pi_curr = controls.pi_curr.value
      _pricelist.pi_amt_type = controls.pi_amt_type.value;
      _pricelist.pi_start = controls.pi_start.value
      
      _pricelist.pi_expire = controls.pi_expire.value
      ? `${controls.pi_expire.value.year}/${controls.pi_expire.value.month}/${controls.pi_expire.value.day}`
      : `${2999}-${12}-${31}`;
      return _pricelist
  }
  /**
   * Add code
   *
   * @param _pricelist: PricelistModel
   */
  addPricelist(detail: any,pricelist: Pricelist) {
    for (let data of detail) {
      delete data.id;
   
    }
      this.loadingSubject.next(true)
      this.pricelistService.add({detail,pricelist}).subscribe(
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




  handleSelectedRowsChanged3(e, args) {
    const controls1 = this.priceForm.controls;
    

    if (Array.isArray(args.rows) && this.gridObj3) {
      args.rows.map((idx) => {
        const item = this.gridObj3.getDataItem(idx);
        // TODO : HERE itterate on selected field and change the value of the selected field
        switch (this.selectedField) {
          case "pi_cs_code": {
            controls1.pi_cs_code.setValue(item.code_value || "");
            break;
          }
          case "pi_part_code": {
            controls1.pi_part_code.setValue(item.code_value || "");
            break;
          }
          case "pi_um": {
            controls1.pi_um.setValue(item.code_value || "");
            break;
          }
          default:
            break;
        }
      });
    }
  }

  angularGridReady3(angularGrid: AngularGridInstance) {
    this.angularGrid3 = angularGrid;
    this.gridObj3 = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGrid3(field) {
    const controls1 = this.priceForm.controls;
    this.selectedCode = field;

    switch (this.selectedField) {
      case "pi_cs_code": {
        this.selectedCode = "cm_class"
        break;
      }
      case "pi_part_code": {
        this.selectedCode = "pt_promo"
        break;
      }
      case "pi_um": {
        this.selectedCode = "pt_um"
        break;
      }
      default:
        break;
    }
    this.columnDefinitions3 = [
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
        id: "code_fldname",
        name: "Champs",
        field: "code_fldname",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "code_value",
        name: "Code",
        field: "code_value",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "code_cmmt",
        name: "Description",
        field: "code_cmmt",
        sortable: true,
        width: 200,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptions3 = {
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
      checkboxSelector: {},
      multiSelect: false,
      rowSelectionOptions: {
        selectActiveRow: true,
      },
    };

    // fill the dataset with your data
    this.codeService
      .getBy({ code_fldname: this.selectedCode })
      .subscribe((response: any) => (this.data = response.data));
    // fill the dataset with your data
    if(this.selectedField == 'pi_cs_code' ){this.customerService
      .getBy({})
      .subscribe((response: any) => (this.data = response.data));  }
    if(this.selectedField == 'pi_part_code' ){this.itemService
        .getBy({})
        .subscribe((response: any) => (this.data = response.data));  }  
  }
  open3(content, field) {
    this.selectedField = field;
    this.prepareGrid3(this.selectedField);
    this.modalService.open(content, { size: "lg" });
  }
  
  changeCode(field) {
    const controls = this.priceForm.controls; // chof le champs hada wesh men form rah

    let obj = {};
    if (field == "pi_cs_code") {
      this.msg = " Categorie Client ";
      const code_value = controls.pi_cs_code.value;
      const code_fldname = "cm_class"
      obj = {
        code_value,
        code_fldname,
      };
    }
    if (field == "pi_part_code") {
      this.msg = " Categorie Produit ";
      const code_value = controls.pi_part_code.value;
      const code_fldname = "pt_promo"
      
      obj = {
        code_value,
        code_fldname,
      };
    }
    if (field == "pi_um") {
      this.msg = " UM ";
      const code_value = controls.pi_um.value;
      const code_fldname = "pt_um"
      
      obj = {
        code_value,
        code_fldname,
      };
    }
    
    this.codeService.getBy(obj).subscribe(
      (res: any) => {
        const { data } = res;
        const message = "Ce code" + this.msg + " n'existe pas!";
        if (!data.length) {
          if (field == "pi_part_code")  {
            console.log(controls.pi_part_code.value)
            this.itemService.getByOne({pt_part: controls.pi_part_code.value }).subscribe(
              (ress: any) => {
                
               
                if (ress.data==null) {   
                  this.layoutUtilsService.showActionNotification(
                    message,
                    MessageType.Create,
                    10000,
                    true,
                    true
                  );
                  this.error = true;
                } else {
                  this.error = false;
                }
          
            });          
          } 
          if (field == "pi_cs_code")  {
            console.log(controls.pi_cs_code.value)
            this.customerService.getBy({cm_addr: controls.pi_cs_code.value }).subscribe(
              (ress: any) => {
                console.log(ress)
               
                if (ress.data==null) {   
                  this.layoutUtilsService.showActionNotification(
                    message,
                    MessageType.Create,
                    10000,
                    true,
                    true
                  );
                  this.error = true;
                } else {
                  this.error = false;
                }
          
            });          
          } 
          if (field == "pi_um")  {
            this.layoutUtilsService.showActionNotification(
              message,
              MessageType.Create,
              10000,
              true,
              true
            );
            this.error = true;
          
          }
      }
      (error) => console.log(error)
    }
      );
  }
  

  changeCurr(){
    const controls = this.priceForm.controls // chof le champs hada wesh men form rah
    const cu_curr  = controls.pi_curr.value
    this.deviseService.getBy({cu_curr}).subscribe((res:any)=>{
        const {data} = res
        console.log(res)
        if (!data){ this.layoutUtilsService.showActionNotification(
            "cette devise n'existe pas!",
            MessageType.Create,
            10000,
            true,
            true
        )
    this.error = true}
        else {
            this.error = false
        }


    },error=>console.log(error))
}

  handleSelectedRowsChanged2(e, args) {
    const controls = this.priceForm.controls;
    if (Array.isArray(args.rows) && this.gridObj2) {
      args.rows.map((idx) => {
        const item = this.gridObj2.getDataItem(idx);
        controls.pi_curr.setValue(item.cu_curr || "");
      });
    }
  }

  angularGridReady2(angularGrid: AngularGridInstance) {
    this.angularGrid2 = angularGrid;
    this.gridObj2 = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGrid2() {
    this.columnDefinitions2 = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "cu_curr",
        name: "code",
        field: "cu_curr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "cu_desc",
        name: "Designation",
        field: "cu_desc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "cu_rnd_mthd",
        name: "Methode Arrondi",
        field: "cu_rnd_mthd",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "cu_active",
        name: "Actif",
        field: "cu_active",
        sortable: true,
        filterable: true,
        type: FieldType.boolean,
      },
      {
        id: "cu_iso_curr",
        name: "Devise Iso",
        field: "cu_iso_curr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptions2 = {
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
    this.deviseService
      .getAll()
      .subscribe((response: any) => (this.devises = response.data));
  }
  open2(content) {
    this.prepareGrid2();
    this.modalService.open(content, { size: "lg" });
  }
  handleSelectedRowsChangedcm(e, args) {
    const controls = this.priceForm.controls;
    if (Array.isArray(args.rows) && this.gridObjcm) {
      args.rows.map((idx) => {
        const item = this.gridObjcm.getDataItem(idx);
        console.log(item);
        const date = new Date();

        
        controls.pi_user1.setValue(item.si_site || "");
       
       
       
      });
    }
  }

  angularGridReadycm(angularGrid: AngularGridInstance) {
    this.angularGridcm = angularGrid;
    this.gridObjcm = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridcm() {
    this.columnDefinitionscm = [
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
        name: "code",
        field: "si_site",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "si_desc",
        name: "Projet",
        field: "si_desc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      
    
      
    ];

    this.gridOptionscm = {
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
      dataItemColumnValueExtractor: function getItemColumnValue(item, column) {
        var val = undefined;
        try {
          val = eval("item." + column.field);
        } catch (e) {
          // ignore
        }
        return val;
      },
    };

    // fill the dataset with your data
    const controls = this.priceForm.controls;
    this.siteService.getBy({created_by:this.user.usrd_code }).subscribe((response: any) => (this.customers = response.data));
  }
  opensite(content) {
    this.prepareGridcm();
    this.modalService.open(content, { size: "lg" });
  }

  handleSelectedRowsChangedloc(e, args) {
    const controls = this.priceForm.controls;
    if (Array.isArray(args.rows) && this.gridObjloc) {
      args.rows.map((idx) => {
        const item = this.gridObjloc.getDataItem(idx);
        console.log(item);
        const date = new Date();

        
        controls.pi_user2.setValue(item.loc_phys_addr || "");
       
       
       
      });
    }
  }

  angularGridReadyloc(angularGrid: AngularGridInstance) {
    this.angularGridloc = angularGrid;
    this.gridObjloc = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridloc() {
    this.columnDefinitionsloc = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "loc_site",
        name: "Projet",
        field: "loc_site",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "loc_loc",
        name: "Emplacement",
        field: "loc_loc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "loc_phys_addr",
        name: "Etage",
        field: "loc_phys_addr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "loc_desc",
        name: "Description",
        field: "loc_desc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
     
    ];

    this.gridOptionsloc = {
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
      dataItemColumnValueExtractor: function getItemColumnValue(item, column) {
        var val = undefined;
        try {
          val = eval("item." + column.field);
        } catch (e) {
          // ignore
        }
        return val;
      },
    };

    // fill the dataset with your data
    const controls = this.priceForm.controls;
    this.locationService.getBy({ loc_site:controls.pi_user1.value}).subscribe((response: any) => (this.locs = response.data));
  }
  openloc(content) {
    this.prepareGridloc();
    this.modalService.open(content, { size: "lg" });
  }

  handleSelectedRowsChangedpart(e, args) {
      const controls = this.priceForm.controls;
  
      if (Array.isArray(args.rows) && this.gridObjpart) {
        args.rows.map((idx) => {
          const item = this.gridObjpart.getDataItem(idx);
          console.log(item);
          controls.pi_part_code.setValue(item.pt_part)
  
          
               });
      }
    }
    dbclick4(e) {
       this.gridObjpart.onDblClick.subscribe((e, args) => {
       alert("On Click");
        
    })
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
          id: "pt_desc2",
          name: "desc2",
          field: "pt_desc2",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "pt_um",
          name: "UM",
          field: "pt_um",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "pt_ord_max",
          name: "QTE",
          field: "pt_ord_max",
          sortable: true,
          filterable: true,
          type: FieldType.float,
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
        editable: true,
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
      this.itemService.getBy({}).subscribe((response: any) => (this.items = response.data));
    }
    openpart(content) {
      this.prepareGridpart();
      this.modalService.open(content, { size: "lg" });
    }
}
