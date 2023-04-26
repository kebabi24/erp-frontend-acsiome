import { Component, OnInit } from "@angular/core"
import {
  NgbDropdownConfig,
  NgbTabChangeEvent,
  NgbTabsetConfig,
  NgbModal,
} from "@ng-bootstrap/ng-bootstrap"
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
import { Location, LocationService, SiteService, InventoryStatusService, CodeService, Item, ItemService } from "../../../../core/erp"

@Component({
  selector: 'kt-edit-loc',
  templateUrl: './edit-loc.component.html',
  styleUrls: ['./edit-loc.component.scss']
})
export class EditLocComponent implements OnInit {

  location: Location
  locationForm: FormGroup
  hasFormErrors = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  loc_type: any[] = []
  locationEdit: any

  datasite: []
  columnDefinitionssite: Column[] = []
  gridOptionssite: GridOption = {}
  gridObjsite: any
  angularGridsite: AngularGridInstance
  selectedField = ""

  data: []
  columnDefinitions3: Column[] = []
  gridOptions3: GridOption = {}
  gridObj3: any
  angularGrid3: AngularGridInstance

  datastatus: []
  columnDefinitionsstatus: Column[] = []
  gridOptionsstatus: GridOption = {}
  gridObjstatus: any
  angularGridstatus: AngularGridInstance

   // selects
   item: Item;

   //for filter
   dataset: any[];
   angularGrid: AngularGridInstance;
   grid: any;
   gridService: GridService;
   dataView: any;
   columnDefinitions: Column[];
   gridOptions: GridOption;
   filtredList: any[] = [];
   listprods: any[] = [];
   listprodIds: any[] = [];


  error = false;
  isExist = false

  title: String = 'Modifier Emplacement - '
  constructor(
    config: NgbDropdownConfig,
    private locationFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private locationService: LocationService,
    private inventoryStatusService: InventoryStatusService,
    private siteService: SiteService,
    private modalService: NgbModal,
    private codeService: CodeService,
    private itemService: ItemService,
) {
    this.prepareGrid();
    config.autoClose = true
    this.codeService
        .getBy({ code_fldname: "loc_type" })
        .subscribe((response: any) => (this.loc_type = response.data))
}


ngOnInit(): void {
  this.loading$ = this.loadingSubject.asObservable()
  this.loadingSubject.next(true)
  this.activatedRoute.params.subscribe((params) => {
      const id = params.id
      this.locationService.getOne(id).subscribe((response: any)=>{
        this.locationEdit = response.data
        this.initCode()
        this.loadingSubject.next(false)
        this.title = this.title + this.locationEdit.loc_loc
        //appeler un autre service qui ramene les article de ce loc_loc et loc_site from locd_det
        //puis faire traitement sur cette liste pour separer le tableau des ids et lutiliser sur grid
        //ou bien ramener que tableau des ids from backend 
        this.locationService.getProducts({loc_loc:response.data.loc_loc,
          loc_site:response.data.loc_site}).subscribe((resp:any)=>{
            console.log(' response list prods '+Object(resp.data))
            let data:[]=resp.data
            data.map((item)=>{
               //@ts-ignore
                this.listprods.push(item.loc_part)
            })
            console.log(' list prods lenght '+this.listprods.length)
          })

      })

  })
  this.prepareGrid();
}
// init code
initCode() {
  this.createForm()
  this.loadingSubject.next(false)
}
 //create form
 createForm() {
  this.loadingSubject.next(false)
  
  this.locationForm = this.locationFB.group({
      loc_site: [this.locationEdit.loc_site, Validators.required],
      loc_loc: [this.locationEdit.loc_loc, Validators.required],
      loc_desc: [ this.locationEdit.loc_desc,  Validators.required ],
      loc_status: [this.locationEdit.loc_status, Validators.required],
      loc_project: [this.locationEdit.loc_project],
      loc_perm: [this.locationEdit.loc_perm],
      loc_type: [this.locationEdit.loc_type ],
      loc_single: [this.locationEdit.loc_single],
      loc__qad01: [this.locationEdit.loc__qad01],
      loc_cap: [this.locationEdit.loc_cap],
      loc_cap_um: [this.locationEdit.loc_cap_um],
      loc_xfer_ownership: [this.locationEdit.loc_xfer_ownership],
      chr01: [this.locationEdit.chr01],
      loc_phy_adr:[this.locationEdit.loc_phys_addr]
  })
}

 //reste form
 reset() {
  this.location = new Location()
  this.createForm()
  this.hasFormErrors = false
}
// save data
onSubmit() {
  this.hasFormErrors = false
  const controls = this.locationForm.controls
  /** check form */
  if (this.locationForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
          controls[controlName].markAsTouched()
      )

      this.hasFormErrors = true
      return
  }

  // tslint:disable-next-line:prefer-const
  let address = this.prepareLocation()
  this.addLocation(address)
}
/**
* Returns object for saving
*/
prepareLocation(): Location {
  const controls = this.locationForm.controls
  const _location = new Location()
  _location.id = this.locationEdit.id
  _location.loc_site = controls.loc_site.value
  _location.loc_loc = controls.loc_loc.value
  _location.loc_desc = controls.loc_desc.value
  _location.loc_status = controls.loc_status.value
  _location.loc_project = controls.loc_project.value
  _location.loc_perm = controls.loc_perm.value
  _location.loc_type = controls.loc_type.value
  _location.loc_single = controls.loc_single.value
  _location.loc__qad01 = controls.loc__qad01.value
  _location.loc_cap = controls.loc_cap.value
  _location.loc_cap_um = controls.loc_cap_um.value
  _location.loc_xfer_ownership = controls.loc_xfer_ownership.value
  _location.chr01=controls.chr01.value
  _location.loc_phys_addr=controls.loc_phy_adr.value

  return _location
}
/**
* Add code
*
* @param _location: LocationModel
*/
addLocation(_location: Location) {
  this.loadingSubject.next(true)
  this.locationService.update(this.locationEdit.id, {_location:_location,details:this.filtredList}).subscribe(
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
              "Modification avec succès",
              MessageType.Create,
              10000,
              true,
              true
          )
          this.loadingSubject.next(false)
          this.router.navigateByUrl("/inventory-settings/list-loc")
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


changeUm() {
  const controls = this.locationForm.controls; // chof le champs hada wesh men form rah
  
  let obj = {};
    
    const code_value = controls.loc_cap_um.value;
    obj = {
      code_value,
      code_fldname: 'pt_um',
    };
  

  this.codeService.getBy(obj).subscribe(
    (res: any) => {
      const { data } = res;
      const message = "Cette UM n'existe pas!";
      if (!data.length) {
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
    },
    (error) => console.log(error)
  );
}


changeStatus(field) {
  const controls = this.locationForm.controls; // chof le champs hada wesh men form rah

  let is_status: any;
  if (field == "loc_status") {
   
     is_status = controls.loc_status.value;
    
  }
 

  this.inventoryStatusService.getBy({is_status}).subscribe(
    (res: any) => {
      const { data } = res;
      const message = "Ce code status n'existe pas!";
      if (!data.length) {
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
    },
    (error) => console.log(error)
  );
}


handleSelectedRowsChangedsite(e, args) {
  const controls = this.locationForm.controls
 
  if (Array.isArray(args.rows) && this.gridObjsite) {
      args.rows.map((idx) => {
          const item = this.gridObjsite.getDataItem(idx)
          // TODO : HERE itterate on selected field and change the value of the selected field
          switch (this.selectedField) {
              case "loc_site": {
                  controls.loc_site.setValue(item.si_site || "")
                  break
              }    
              default:
                  break
          }
      })
  }
}
angularGridReadysite(angularGrid: AngularGridInstance) {
  this.angularGridsite = angularGrid
  this.gridObjsite = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGridsite() {
  this.columnDefinitionssite = [
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
      
  ]

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
      },
      multiSelect: false,
      rowSelectionOptions: {
          selectActiveRow: true,
      },
  }

  // fill the dataset with your data
  this.siteService
      .getAll()
      .subscribe((response: any) => (this.datasite = response.data))
}
opensite(contentsite, field) {
  this.selectedField = field
  this.prepareGridsite()
  this.modalService.open(contentsite, { size: "lg" })
}



handleSelectedRowsChanged3(e, args) {
  const controls = this.locationForm.controls
  
  if (Array.isArray(args.rows) && this.gridObj3) {
      args.rows.map((idx) => {
          const item = this.gridObj3.getDataItem(idx)
          // TODO : HERE itterate on selected field and change the value of the selected field
          switch (this.selectedField) {
             
              case "pt_um": {
                  controls.loc_cap_um.setValue(item.code_value || "")
                  break    
              }
              case "loc_type": {
                  controls.loc_cap_um.setValue(item.code_value || "")
                  break    
              }
             
              default:
                  break
          }
      })
  }
}

angularGridReady3(angularGrid: AngularGridInstance) {
  this.angularGrid3 = angularGrid
  this.gridObj3 = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGrid3() {
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
  ]

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
      checkboxSelector: {
      },
      multiSelect: false,
      rowSelectionOptions: {
          selectActiveRow: true,
      },
  }

  // fill the dataset with your data
  this.codeService
      .getBy({ code_fldname: this.selectedField })
      .subscribe((response: any) => (this.data = response.data))
}
open3(content, field) {
  this.selectedField = field
  this.prepareGrid3()
  this.modalService.open(content, { size: "lg" })
}

handleSelectedRowsChangedstatus(e, args) {
  const controls1 = this.locationForm.controls;
  
  if (Array.isArray(args.rows) && this.gridObjstatus) {
    args.rows.map((idx) => {
      const item = this.gridObjstatus.getDataItem(idx);
      // TODO : HERE itterate on selected field and change the value of the selected field
      switch (this.selectedField) {
        case "loc_status": {
          controls1.loc_status.setValue(item.is_status || "");
          break;
        }
        
        default:
          break;
      }
    });
  }
}


angularGridReadystatus(angularGrid: AngularGridInstance) {
  this.angularGridstatus = angularGrid
  this.gridObjstatus = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGridstatus() {
  this.columnDefinitionsstatus = [
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
      id: "is_status",
      name: "Status",
      field: "is_status",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "is_desc",
      name: "Designation",
      field: "is_desc",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "is_avail",
      name: "Disponible",
      field: "is_avail",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "is_nettable",
      name: "Gerer MRP",
      field: "is_nettable",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "is_overissue",
      name: "Sortie Excedent",
      field: "is_overissue",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },


  ];

  this.gridOptionsstatus = {
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
  this.inventoryStatusService
    .getAll()
    .subscribe((response: any) => (this.datastatus = response.data));
}
openstatus(content, field) {
  this.selectedField = field
  this.prepareGridstatus()
  this.modalService.open(content, { size: "lg" })
}

onChangeArticles() {
  const controls = this.locationForm.controls
  this.locationService
      .getBy({
            loc_site: controls.loc_site.value,
            loc_loc: controls.loc_loc.value,

      })
      .subscribe((response: any) => {
          if (response.data.length) {
              this.isExist = true
              console.log('if'+response.data.length)
          } else {
            console.log('else'+response.data.length)

              // controls.loc_desc.enable()
              // controls.loc_status.enable()
              // controls.loc_project.enable()
              // controls.loc_perm.enable()
              // controls.loc_type.enable()
              // controls.loc_single.enable()
              // controls.loc__qad01.enable()
              // controls.loc_cap.enable()
              // controls.loc_cap_um.enable()
              // controls.loc_xfer_ownership.enable()

          }
   })
}

gridReady(angularGrid: AngularGridInstance) {
  this.angularGrid = angularGrid;
  this.dataView = angularGrid.dataView;
  this.grid = angularGrid.slickGrid;
  this.gridService = angularGrid.gridService;
}

prepareGrid() {
  this.columnDefinitions = [
   
  //   {
  //     id: "id",
  //     name: "id",
  //     field: "id",
  //     sortable: true,
  //     width: 10,
  //   },
    {
      id: "pt_part",
      name: "Code Produit",
      field: "pt_part",
      sortable: true,
      filterable: true,
      type: FieldType.string,
      minWidth: 80,
    },
  //   {
  //     id: "pt_desc2",
  //     name: "Description Interne",
  //     field: "pt_desc2",
  //     sortable: true,
  //     filterable: true,
  //     minWidth: 150,
  //     type: FieldType.string,
  //   },
   
    {
      id: "pt_status",
      name: "Statut",
      field: "pt_status",
      sortable: true,
      filterable: true,
      // type: FieldType.text,
      minWidth: 80,
    },
    {
      id: "pt_net_wt",
      name: "Poids Net",
      field: "pt_net_wt",
      sortable: true,
      filterable: true,
      type: FieldType.number,
      minWidth: 80,
    },
    {
      id: "pt_model",
      name: "Format",
      field: "pt_model",
      sortable: true,
      filterable: true,
      // type: FieldType.text,
      minWidth: 80,
    },

    {
      id: "pt_break_cat",
      name: "Couleur",
      field: "pt_break_cat",
      sortable: true,
      filterable: true,
      minWidth: 80,
      // type: FieldType.text,
      // resizeAlwaysRecalculateWidth:true
    },
    {
      id: "pt_promo",
      name: "Logo",
      field: "pt_promo",
      sortable: true,
      filterable: true,
      type: FieldType.string,
      minWidth: 80,
    }
   
  ];

  this.gridOptions = {
    enableSorting: true,
    enableCellNavigation: true,
    enableExcelCopyBuffer: true,
    enableCheckboxSelector:true,
    multiSelect:true,
    enableFiltering: true,
    autoEdit: false,
    enableAutoResize: true,

    autoFitColumnsOnFirstLoad: true,
    // autosizeColumnsByCellContentOnFirstLoad: true,
    enableAutoSizeColumns: true,
    syncColumnCellResize: true,
    rowSelectionOptions: {
      // True (Single Selection), False (Multiple Selections)
      selectActiveRow: false
    },
    presets: {
      sorters: [{ columnId: "id", direction: "ASC" }],

      rowSelection: {
        // gridRowIndexes: [2],           // the row position of what you see on the screen (UI)
        dataContextIds: this.listprodIds  //[3,5, 12, 13,]  // (recommended) select by your data object IDs
      }
    },
   
    // rowSelectionOptions: {
    //   // True (Single Selection), False (Multiple Selections)
    //   selectActiveRow: false
    // },
  };

  // fill the dataset with your data
  this.dataset = [];
  this.itemService.getAll().subscribe(
    (response: any) => {
      this.dataset = response.data;
      // this.dataView.setItems(this.dataset);


      // console.log(' response list '+Object(response.data))
      let datatomap=[]
      this.dataset.map((item)=>{
        datatomap.push(item)
      })
      // this.dataView.setItems(datatomap);
     
      // console.log(' list to map lenght '+datatomap.length)
      // console.log('first response.data'+response.data)
    
      this.listprods.map((code)=>{
        // console.log('dataset size '+this.dataset.length)
        //  console.log(' element of dataset '+this.dataset[2].pt_part)
         let exist=false;
         let i=0;
         while(!exist && i<datatomap.length){
          // console.log('exist '+exist+' i '+i+' pt part '+datatomap[i].pt_part+' loc part '+code)
          if(code===datatomap[i].pt_part){
            // console.log('exist '+code)
            this.listprodIds.push(this.dataset[i].id)
            exist=true
          }
          i++
         }
        //  console.log(' ids '+this.listprodIds.length)
      })
    },

    (error) => {
      this.dataset = [];
    },
    () => {}
  );

}

handleSelectedRowsChangedFiltredProd(e, args) {
  // const controls1 = this.form1.controls;    
  this.filtredList=[];
  if (Array.isArray(args.rows) && this.grid) {
  //    this.filtredList=args.rows;
      // products: Array<Product>;

  //    console.log(" arg rows "+args.rows)
  //    console.log(" arg rows in list "+this.filtredList)
    args.rows.map((idx) => {
      const item = this.grid.getDataItem(idx);
      // TODO : HERE itterate on selected field and change the value of the selected field
       let pt_fltr ={
           loc_loc: this.locationForm.controls.loc_loc.value,
           loc_site: this.locationForm.controls.loc_site.value,
           loc_part: item.pt_part,
           color: item.pt_break_cat,
           model: item.pt_model,
           quality: item.status,
           logo: item.pt_promo,
           grammage: item.pt_net_wt,
       };
       this.filtredList.push(pt_fltr)
          // controls1.pt_site.setValue(item.si_site || "");
    });

     
    //  this.filtredList.map((item)=>{
   
    //  })

  }
}

}
