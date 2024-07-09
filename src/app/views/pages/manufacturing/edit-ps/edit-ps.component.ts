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
/// Angular slickgrid
import {
  Column,
  GridOption,
  Formatter,
  Editor,
  Editors,
  Filters,
  AngularGridInstance,
  GridService,
  Formatters,
  FieldType,
  OnEventArgs,
} from "angular-slickgrid"

import {Ps,ItemService, PsService, BomService } from "../../../../core/erp"


@Component({
  selector: 'kt-edit-ps',
  templateUrl: './edit-ps.component.html',
  styleUrls: ['./edit-ps.component.scss']
})
export class EditPsComponent implements OnInit {

  
  psForm: FormGroup
  hasFormErrors = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  psEdit: any
  title: String = 'Modifier Nomenclature - '
  
  angularGrid: AngularGridInstance;
  grid: any;
  gridService: GridService;
  dataView: any;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];
  items: [];
  columnDefinitions4: Column[] = [];
  gridOptions4: GridOption = {};
  gridObj4: any;
  angularGrid4: AngularGridInstance;
  desc: any;
  row_number
  comp:any;
message :any;
  quantitytypesList = [
    { value: 0, label: 'UM' },
    { value: 1, label: '%' },
  
  ];
  percent= 0;
  
    constructor(
      config: NgbDropdownConfig,
      private psFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private psService: PsService,
      private modalService: NgbModal,
      private bomService: BomService,
      private itemsService: ItemService
  ) {
    config.autoClose = true
  }


ngOnInit(): void {
  this.loading$ = this.loadingSubject.asObservable()
  this.loadingSubject.next(true)
  this.activatedRoute.params.subscribe((params) => {
      const id = params.id
      console.log(id)
      this.psService.getBy({ps_parent:id}).subscribe((response: any)=>{
        this.bomService.getBy({bom_parent:id}).subscribe((resp: any)=>{
          this.desc = resp.data.bom_desc
      console.log(response.data)
        this.psEdit = response.data[0]
        console.log("psedit",this.psEdit)
        this.dataset = response.data
        this.initCode()
        this.loadingSubject.next(false)
        this.title = this.title + this.psEdit.ps_parent
        console.log(this.dataset)
      
      })
    })
 
  })
  this.initGrid()
}
// init code
initCode() {
  this.createForm()
  this.loadingSubject.next(false)
}
 //create form
 createForm() {
  this.loadingSubject.next(false)
  
  this.psForm = this.psFB.group({
      ps_parent: [{value:this.psEdit.ps_parent,  disabled: true}],
      desc: [ {value:this.desc, disabled: true }],
      
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
  const controls = this.psForm.controls
  /** check form */
  if (this.psForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
          controls[controlName].markAsTouched()
      )
      this.message = "veuillez choisir le code formule";
      this.hasFormErrors = true;

      return;
    }
    if (this.percent < 100) {
      
      this.message = "la somme des quantités saisies n'atteint pas 100%";
      this.hasFormErrors = true;

     
      return
  }

  // tslint:disable-next-line:prefer-const
  let address = this.preparePs()
  console.log(address)
  for (let data of this.dataset) {
    delete data.id;
    delete data.cmvid;
  }
  this.addPs(address, this.dataset)
}
/**
* Returns object for saving
*/
preparePs(): Ps {
  const controls = this.psForm.controls
  const _ps = new Ps()
  _ps.id = this.psEdit.id
  _ps.ps_parent = controls.ps_parent.value
  
  return _ps
}
/**
* Add code
*

*/
addPs(_ps: Ps, details: any) {
  for (let data of details) {
    delete data.id;
    delete data.line
    delete data.desc;
    delete data.cmvid;
  }
  this.loadingSubject.next(true)
  this.psService.update({Ps:_ps, details},this.psEdit.ps_parent).subscribe(
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
          this.router.navigateByUrl("/manufacturing/list-ps")
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

  initGrid () {
  this.columnDefinitions = [
    {
      id: "id",
      field: "id",
      excludeFromHeaderMenu: true,
      formatter: Formatters.deleteIcon,
      minWidth: 30,
      maxWidth: 30,
      onCellClick: (e: Event, args: OnEventArgs) => {
        if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
          if(args.dataContext.ps_qty_type == 1){this.percent = Number(this.percent) - args.dataContext.ps_qty_per}
            
          this.angularGrid.gridService.deleteItem(args.dataContext);
        }
      },
    },

    {
      id: "line",
      name: "Ligne",
      field: "int01",
      minWidth: 50,
      maxWidth: 50,
      selectable: true,
    },
    {
      id: "ps_comp",
      name: "Composant",
      field: "ps_comp",
      sortable: true,
      width: 50,
      filterable: false,
      editor: {
        model: Editors.text,
        required: true,
       

      },
      onCellChange: (e: Event, args: OnEventArgs) => {
        console.log(args.dataContext.ps_comp)
        this.itemsService.getByOne({pt_part: args.dataContext.ps_comp }).subscribe((resp:any)=>{

          if (resp.data) {
            console.log(resp.data)
            this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , desc: resp.data.pt_desc1 , })
            this.comp = args.dataContext.ps_comp
          }else {

            alert("Article Nexiste pas")
            this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , ps_comp: null })


          } 
        })
      }  
     
    },
    {
      id: "mvid",
      field: "cmvid",
      excludeFromHeaderMenu: true,
      formatter: Formatters.infoIcon,
      minWidth: 30,
      maxWidth: 30,
      onCellClick: (e: Event, args: OnEventArgs) => {
        this.row_number = args.row;
        let element: HTMLElement = document.getElementById(
          "openItemsGrid"
        ) as HTMLElement;
        element.click();
      },
    },
    {
      id: "desc",
      name: "Description",
      field: "chr01",
      sortable: true,
      width: 150,
      filterable: false,
    },
    
    // {
    //   id: "ps_item_no",
    //   name: "Revision",
    //   field: "ps_item_no",
    //   sortable: true,
    //   width: 80,
    //   filterable: false,
    //   editor: {
    //     model: Editors.integer,
    //     required: true,
        

    //   },
     
    // },
    {
      id: "ps_ref",
      name: "Ref",
      field: "ps_ref",
      sortable: true,
      width: 80,
      filterable: false,
      // editor: {
      //   model: Editors.text,
      //   required: true,
        

      // },
     
    },


    // {
    //   id: "ps_start",
    //   name: "Date Début",
    //   field: "ps_start",
    //   sortable: true,
    //   width: 80,
    //   filterable: false,
    //   formatter: Formatters.dateIso ,
    //   type: FieldType.dateIso,
    //   editor: {
    //     model: Editors.date,
    //   },
     
    // },
    // {
    //   id: "ps_end",
    //   name: "Date Fin",
    //   field: "ps_end",
    //   sortable: true,
    //   width: 80,
    //   filterable: false,
    //   formatter: Formatters.dateIso ,
    //   type: FieldType.dateIso,
    //   editor: {
    //     model: Editors.date,
    //   },
     
    // },
    {
      id: "ps_qty_type",
      name: "Type Qté",
      field: "ps_qty_type",
      sortable: true,
      width: 80,
      filterable: false,
      type: FieldType.number,
      formatter: (_row, _cell, value) => this.quantitytypesList[value]?.label,
      exportCustomFormatter: (_row, _cell, value) => this.quantitytypesList[value]?.label,
      filter: {
        model: Filters.multipleSelect,
        collection: this.quantitytypesList,
      },
      editor: {
        model: Editors.singleSelect,
        collection: this.quantitytypesList,
        
      },
      onCellChange: (e: Event, args: OnEventArgs) => {var bol = false
        
      }



     

    },
    

    {
      id: "ps_qty_per",
      name: "QTE",
      field: "ps_qty_per",
      sortable: true,
      width: 80,
      filterable: false,
      type: FieldType.float,
      editor: {
          model: Editors.float,
          params: { decimalPlaces: 2 },
          required: true,
          
          
      },
      onCellChange: (e: Event, args: OnEventArgs) => {
        console.log(args.dataContext.ps_qty_type)
        if(args.dataContext.ps_qty_type == 1 ){console.log(this.percent)
              if ((Number(this.percent) + args.dataContext.ps_qty_per ) > 100)
                 {this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , ps_qty_per: 0}) 
                  this.message = "la quantité saisie dépasse les 100%";
                   this.hasFormErrors = true;
                   return;
                   
                } 
              else {this.percent = Number(this.percent) + args.dataContext.ps_qty_per}     
        }
        else{console.log('0',this.percent)}
      }  
      
    },
   
    {
      id: "ps_scrp_pct",
      name: "Rejet",
      field: "ps_scrp_pct",
      sortable: true,
      width: 80,
      filterable: false,
      type: FieldType.float,
      formatter: Formatters.percentComplete,
      editor: {
          model: Editors.float,
          params: { decimalPlaces: 2 },
          
          
      },
  
      
    },
    

   
    // {
    //   id: "ps_lt_off",
    //   name: "Décalage",
    //   field: "ps_lt_off",
    //   sortable: true,
    //   width: 80,
    //   filterable: false,
    //   editor: {
    //     model: Editors.integer
        

    //   },

    // },
    
        
    // {
    //   id: "ps_cst_pct",
    //   name: "Pourcentage lot",
    //   field: "ps_cst_pct",
    //   sortable: true,
    //   width: 80,
    //   filterable: false,
    //   formatter: Formatters.percentComplete,
    //   editor: {
    //     model: Editors.text,
        
    //   },
     
    // },
    {
      id: "ps_op",
      name: "Opération",
      field: "ps_op",
      sortable: true,
      width: 80,
      filterable: false,
      type: FieldType.number,
      editor: {
        model: Editors.float,
      
      },


     

    },
            
    // {
    //   id: "ps_group",
    //   name: "Groupe Option",
    //   field: "ps_group",
    //   sortable: true,
    //   width: 80,
    //   filterable: false,
    //   editor: {
    //     model: Editors.text,
      
    //   },


     

    // },
  ];

  this.gridOptions = {
    enableAutoResize:true,
    asyncEditorLoading: false,
    editable: true,
    enableColumnPicker: true,
    enableCellNavigation: true,
    enableRowSelection: true,
    formatterOptions: {
      
      
      // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
      displayNegativeNumberWithParentheses: true,

      // Defaults to undefined, minimum number of decimals
      minDecimal: 2,

      // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
      thousandSeparator: ' ', // can be any of ',' | '_' | ' ' | ''
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

 
}
addNewItem() {
  this.gridService.addItem(
    {
      id: this.dataset.length + 1,
      int01: this.dataset.length + 1,
      ps_comp: "",
      cmvid: "",
      desc: "",
      ps_qty_req: 0,
      
    },
    { position: "bottom" }
  );
}

  
onAlertClose($event) {
  this.hasFormErrors = false
}


handleSelectedRowsChanged4(e, args) {
  let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
  const controls = this.psForm.controls;
  
  if (Array.isArray(args.rows) && this.gridObj4) {
    args.rows.map((idx) => { var bol;
      const item = this.gridObj4.getDataItem(idx);
      console.log(this.dataset)
      if (this.dataset.length > 1)
        {for(let ob of this.dataset) {
          if(ob.ps_comp == item.pt_part) {
            console.log(item.pt_part)
            bol = true
            break;
           
          }
        }}
        if (bol){
          // this.angularGrid.gridService.deleteItem(args.dataContext);
          this.message = "ce produit existe déjà dans la formule";
                   this.hasFormErrors = true;
                   return;

        }
      
      console.log(item);
      updateItem.ps_comp = item.pt_part;
      updateItem.desc = item.pt_desc1;
      updateItem.ps_ref = item.pt_draw;
     
      
         
        this.gridService.updateItem(updateItem);
    }) 
   
  }
}
angularGridReady4(angularGrid: AngularGridInstance) {
  this.angularGrid4 = angularGrid;
  this.gridObj4 = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGrid4() {
  this.columnDefinitions4 = [
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

  this.gridOptions4 = {
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
  this.itemsService
    .getAll()
    .subscribe((response: any) => (this.items = response.data));
}
open4(content) {
  this.prepareGrid4();
  this.modalService.open(content, { size: "lg" });
}
}
