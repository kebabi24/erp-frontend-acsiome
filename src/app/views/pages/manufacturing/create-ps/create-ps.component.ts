import { Component, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";

// Angular slickgrid
import {
  Column,
  GridOption,
  Formatter,
  Editor,
  Editors,
  Filters,
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
import {
  ItemService, Ps, BomService,PsService,

} from "../../../../core/erp";

 
@Component({
  selector: 'kt-create-ps',
  templateUrl: './create-ps.component.html',
  styleUrls: ['./create-ps.component.scss']
})
export class CreatePsComponent implements OnInit {

  ps: Ps
  psForm: FormGroup;
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
  user: any;
  alertWarning: any;
 
  boms: [];
  columnDefinitionsbom: Column[] = [];
  gridOptionsbom: GridOption = {};
  gridObjbom: any;
  angularGridbom: AngularGridInstance;

  items: [];
  columnDefinitions4: Column[] = [];
  gridOptions4: GridOption = {};
  gridObj4: any;
  angularGrid4: AngularGridInstance;
  
  comp:any;

  quantitytypesList = [
    { value: 0, label: 'UM' },
    { value: 1, label: '%' },
  
  ];
  
  row_number;
  message = "";
  percent= 0;

  constructor(
    config: NgbDropdownConfig,
    private psFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private layoutUtilsService: LayoutUtilsService,
    private bomService: BomService,  
    private psService: PsService,  
    private itemsService: ItemService,
  ) {
    config.autoClose = true;
    this.initGrid();
  }
  gridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;
    this.gridService = angularGrid.gridService;
  }

  initGrid() {
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
        field: "line",
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
          const controls = this.psForm.controls
          console.log(args.dataContext.ps_comp)
          this.itemsService.getByOne({pt_part: args.dataContext.ps_comp,pt_part_type:'CONSOMMABLE',pt_break_cat:controls.color.value }).subscribe((resp:any)=>{

            if (resp.data) {
              console.log(resp.data)
              this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , desc: resp.data.pt_desc1 , })
              this.comp = args.dataContext.ps_comp
            }else {

              
              this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , ps_comp: null })
              this.message = "le code article n'existe pas ou n'est pas prévu pour ce type formule";
                     this.hasFormErrors = true;
                     return;

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
        field: "desc",
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
      //     model: Editors.float,
         
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
      {
        id: "ps__qad01",
        name: "Imprimable",
        field: "ps__qad01group",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.checkbox,
        
        },
        formatter: Formatters.checkmark,

      },
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
    };

    this.dataset = [];
  }
  //ISS-UNP qrt * -1 w ttna7a men ld_det 
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.createForm();
    this.user =  JSON.parse(localStorage.getItem('user'))
    
  }

  //create form
  createForm() {
    this.loadingSubject.next(false);
    this.ps = new Ps();
    const date = new Date;
    this.psForm = this.psFB.group({
      ps_parent: [this.ps.ps_parent , Validators.required],
      desc: [
        { value: "", disabled: true }],
      type: [
        { value: "", disabled: true }],
      color:[
        { value: "", disabled: true }], 
        ps_scrp_pct: [this.ps.ps_scrp_pct],
    });
  }
  //reste form
  reset() {
    this.ps = new Ps();
    this.createForm();
    this.hasFormErrors = false;
  }


  onChangeCode() {
    const controls = this.psForm.controls
    this.bomService
        .getBy({
              bom_parent: controls.ps_parent.value,
        })
        .subscribe((response: any) => {
            console.log(response.data)
            if (!response.data) {
             
              controls.ps_parent.setValue("")
              document.getElementById("code").focus();
              this.message = "le code formule saisie n'existe pas";
                     this.hasFormErrors = true;
                     return;
            } else {
              controls.desc.setValue(response.data.bom_desc);
              controls.type.setValue(response.data.bom__chr01);
              controls.color.setValue(response.data.bom__chr02)
            
            }
     })
  }

  // save data
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.psForm.controls;
    /** check form */
    if (this.psForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      this.message = "veuillez choisir le code formule";
      this.hasFormErrors = true;

      return;
    }
    // if (this.percent < 100) {
      
    //   this.message = "la somme des quantités saisies n'atteint pas 100%";
    //   this.hasFormErrors = true;

    //   return;
    // }

    if (!this.dataset.length) {
      this.message = "La liste des article ne peut pas etre vide";
      this.hasFormErrors = true;

      return;
    }

    let ps = this.prepare()
    this.addIt( this.dataset,ps);

   
    

    
    // tslint:disable-next-line:prefer-const
    
  }

  prepare(){
    const controls = this.psForm.controls;
    const _ps = new Ps();
    _ps.ps_parent = controls.ps_parent.value
    
    return _ps
  }
  /**
   *
   * Returns object for saving
   */
  /**
   * Add po
   *
   * @param _it: it
   */ 
   addIt( detail: any, it) {
    for (let data of detail) {
      delete data.id;
      delete data.line
      delete data.desc;
      delete data.cmvid;
    }
    this.loadingSubject.next(true);
    const controls = this.psForm.controls;

    this.psService
      .add({detail, it})
      .subscribe(
       (reponse: any) => console.log(reponse),
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
      //    console.log(this.provider, po, this.dataset);
      //    if(controls.print.value == true) printBc(this.provider, this.datasetPrint, po);
        this.router.navigateByUrl(`/manufacturing/list-ps`);
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

  // add new Item to Datatable
  addNewItem() {
    const controls=this.psForm.controls
    this.gridService.addItem(
      {
        id: this.dataset.length + 1,
        line: this.dataset.length + 1,
        ps_comp: "",
        cmvid: "",
        desc: "",
        ps_qty_req: 0,
        ps_scrp_pct:controls.ps_scrp_pct.value
      },
      { position: "bottom" }
    );
  }
  
  
 





  handleSelectedRowsChangedbom(e, args) {
    const controls = this.psForm.controls;
    if (Array.isArray(args.rows) && this.gridObjbom) {
      args.rows.map((idx) => {
        const item = this.gridObjbom.getDataItem(idx);
        controls.ps_parent.setValue(item.bom_parent || "");
        controls.desc.setValue(item.bom_desc)
        controls.type.setValue(item.bom__chr01)
        controls.color.setValue(item.bom__chr02)
        

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
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "bom_parent",
        name: "code",
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
      {
        id: "bom__chr01",
        name: "Type",
        field: "bom__chr01",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "bom__chr02",
        name: "Couleur",
        field: "bom__chr02",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "bom_batch",
        name: "Taille du Lot",
        field: "bom_batcg",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "bom_batch_um",
        name: "UM",
        field: "bom_batch_um",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "bom_formula",
        name: "Formule",
        field: "bom_formula",
        sortable: true,
        filterable: true,
        type: FieldType.boolean,
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
  openbom(content) {
    this.prepareGridbom();
    this.modalService.open(content, { size: "lg" });
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
    const controls = this.psForm.controls
    this.itemsService
      .getBy({pt_part_type:'CONSOMMABLE'})
      .subscribe((response: any) => (this.items = response.data));
  }
  open4(content) {
    this.prepareGrid4();
    this.modalService.open(content, { size: "lg" });
  }
  onAlertClose($event) {
    this.hasFormErrors = false;
  }
}






