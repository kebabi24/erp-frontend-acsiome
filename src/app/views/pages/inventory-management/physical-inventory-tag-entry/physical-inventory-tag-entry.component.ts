import { Component, OnInit } from "@angular/core";
import { InventoryManagementService , ItemService,LabelService,InventoryStatusService,LocationDetailService,CostSimulationService,} from  "../../../../core/erp";
import {
  NgbDropdownConfig,
  NgbTabChangeEvent,
  NgbTabsetConfig,
  NgbModal,
} from "@ng-bootstrap/ng-bootstrap";

import {
  Column,
  GridOption,
  Formatter,
  Editor,
  Editors,
  AngularGridInstance,
  GridService,
  Formatters,
  FieldType,
  OnEventArgs,
} from "angular-slickgrid";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Observable, BehaviorSubject, Subscription, of } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { LayoutUtilsService, MessageType } from "../../../../core/_base/crud";
@Component({
  selector: "kt-physical-inventory-tag-entry", 
  templateUrl: "./physical-inventory-tag-entry.component.html",
  styleUrls: ["./physical-inventory-tag-entry.component.scss"],
})
export class PhysicalInventoryTagEntryComponent implements OnInit {
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  tagForm: FormGroup
  angularGrid: AngularGridInstance;
  grid: any;
  gridService: GridService;
  dataView: any;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];
  details: any [];
  lastId: Number;  
  bool: Boolean;
  row_number;
  tag_nbr
  items: [];
  columnDefinitions4: Column[] = [];
  gridOptions4: GridOption = {};
  gridObj4: any;
  angularGrid4: AngularGridInstance;
  hasFormErrors = false;
  message = "";
  stat: String;
  lddet: any;
  sct: any;
  constructor(
    private tagService: InventoryManagementService,
    private tagFB: FormBuilder,
    private modalService: NgbModal,
    private itemsService:  ItemService,
    private router: Router,
    private layoutUtilsService: LayoutUtilsService,
    private labelService: LabelService,
    private locationDetailService: LocationDetailService,
    private inventoryStatusService: InventoryStatusService,
    private sctService: CostSimulationService, 
  ) {}

  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable()
    this.loadingSubject.next(true)
    this.createForm();
    this.initGrid();
  }
  gridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;
    this.gridService = angularGrid.gridService;
  }
  
  onChangeNbr() {
    this.dataset = []
    const controls = this.tagForm.controls;
    this.tag_nbr =  Number(controls.tagnbr.value)
    this.tagService
      .getTag({ tag_nbr: this.tag_nbr })
      .subscribe((res: any) => {
       

        this.details  = res.data;
        console.log(this.details)
        for (const object in this.details) {
          const detail = this.details[object];
          this.gridService.addItem(
            {
              id: detail.id,
              tag_nbr: this.tag_nbr,
              tag_part: detail.tag_part,
              tag_serial: detail.tag_serial,
              tag_ref: detail.tag_ref,
              tag_site: detail.tag_site,
              description: detail.item.pt_desc1,
              tag_loc: detail.tag_loc,
              tag_cnt_qty: detail.tag_cnt_qty,          
              tag_cnt_nam: detail.tag_cnt_nam,
              tag_cnt_dt: detail.tag_cnt_dt,
             // bool01:true

            },
            { position: "bottom" }
          );
        }
   //       this.dataset = this.details;
    this.loadingSubject.next(false) 

          });
  }

  onChangeNew() {
    this.dataset = []
    this.bool = false
    const controls = this.tagForm.controls;
    controls.tagnbr.setValue("");
    
  }
  createForm() {
    this.loadingSubject.next(false);
    //this.saleOrder = new SaleOrder();
   // const date = new Date;
    
    this.tagForm = this.tagFB.group({
  //    so__chr01: [this.saleOrder.so__chr01],
      tagnbr:  [""],   
      new: [false],
    });

    
    

  }

  initGrid() {
    this.columnDefinitions = [
      {
        id: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        minWidth: 40,
        maxWidth: 40,
      },

      {
        id: "tag_part",
        name: "Article",
        field: "tag_part",
        minWidth: 50,
        maxWidth: 50,
        selectable: true,
        editor: {
          model: Editors.text,
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          console.log(args.dataContext.pod_part)
          
          this.itemsService.getByOne({pt_part: args.dataContext.tag_part }).subscribe((resp:any)=>{
        console.log(resp.data)
            if (resp.data) {
     
              this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , description: resp.data.pt_desc1  })

      
      
         }  else {
            alert("Article Nexiste pas")
            this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tag_part: null })
         }
          
          });

           
         
         
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
        id: "tag_serial",
        name: "Lot",
        field: "tag_serial",
        minWidth: 100,
        maxWidth: 100,
        selectable: true,
        editor: {
          model: Editors.text,
        },
      },
      {
        id: "tag_site",
        name: "Site",
        field: "tag_site",
        sortable: true,
        width: 50,
        filterable: false,
        editor: {
          model: Editors.text,
        },
      },
      {
        id: "tag_loc",
        name: "Emplacement",
        field: "tag_loc",
        sortable: true,
        width: 50,
        filterable: false,
        editor: {
          model: Editors.text,
        },
      },
      {
        id: "description",
        name: "Description",
        field: "item.pt_desc1",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.text,
        },
      },
      {
        id: "tag_cnt_qty",
        name: "Qte Comptee",
        field: "tag_cnt_qty",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.float,
          params: { decimalPlaces: 2 },
        },
      },
      {
        id: "tag_cnt_nam",
        name: "Compte par",
        field: "tag_cnt_nam",
        sortable: true,
        width: 60,
        filterable: false,
        //type: FieldType.float,
        editor: {
          model: Editors.text,
        },
      },
      {
        id: "tag_cnt_dt",
        name: "Date Comptee",
        field: "tag_cnt_dt",
        sortable: true,
        width: 60,
        filterable: false,
        type: FieldType.dateIso,
        editor: {
          model: Editors.date,
        },
      },
    ];

    this.gridOptions = {
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
        thousandSeparator: " ", // can be any of ',' | '_' | ' ' | ''
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

    this.dataset = [];
  }
  goBack() {
    this.loadingSubject.next(false);
    const url = `/`;
    this.router.navigateByUrl(url, {});
  }
  onSubmit() {

    const controls = this.tagForm.controls;
    if (controls.new.value == true) {
      let tag = null;
      for (let data of this.dataset) {
        delete data.id;
      delete data.description;
   
      }
      this.tagService
      .add( {Detail: this.dataset} )
      .subscribe(
        (reponse: any) => (tag = reponse.data),
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
          this.router.navigateByUrl("/");
        }
      );

    }
    else {

    this.updateItem(0);
  
    }
  }
  addNewItem() {

    const controls = this.tagForm.controls

    const newtag = controls.new.value
    let did = 0;
    
    this.tagService
      .getLastIdTag({})
      .subscribe((res: any) => { 
      

      console.log(res.data)
console.log(newtag)
console.log(this.bool)
      console.log (this.dataset.length);
       
      if (this.bool == false) { if (res.data == null) { did = 1}else {did = Number(res.data) + 1} } else 
      { if (this.bool == true) { if (res.data == null) { did = 1 } else { did = this.dataset[this.dataset.length-1].id +1}} else { did = 1}}
      this.bool = true
    this.gridService.addItem(
      {
        id: did,
        tag_nbr: this.tag_nbr,
        tag_part: '',
        tag_serial: "",
        tag_ref:"",
        tag_site:'',
        description:'',
        tag_loc:'',
        tag_cnt_qty:'',
        tag_cnt_nam:'',
        tag_cnt_dt:null,
        bool01:true
      },
      { position: "bottom" }
    );
  })
  }
  updateItem(i) {
    const {description,...elem} = this.dataset[i];
    this.tagService
      .updateTag(elem.id, {
        ...elem,
        tag_cnt_qty: elem.tag_cnt_qty,
        tag_cnt_nam: elem.tag_cnt_nam,
        tag_cnt_dt: elem.tag_cnt_dt,
        
      })
      .subscribe(
        (res) => console.log(res),
        (error) => console.log(error),
        () => {
          if (i == this.dataset.length - 1) {
            this.layoutUtilsService.showActionNotification(
              "Ajout avec succès",
              MessageType.Create,
              10000,
              true,
              true
            );
            this.loadingSubject.next(false);
            const url = `/`;
            this.router.navigateByUrl(url);
          } else {
            i++;
            this.updateItem(i);
          }
        }
      );
  }

  handleSelectedRowsChanged4(e, args) {
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    
    if (Array.isArray(args.rows) && this.gridObj4) {
      args.rows.map((idx) => {

        
        const item = this.gridObj4.getDataItem(idx);
        console.log(item);
    
        
        updateItem.tag_part = item.pt_part;
        updateItem.desc = item.pt_desc1;
        this.gridService.updateItem(updateItem);
      });
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
  onChangePal() {
    
    /*kamel palette*/
    const controls = this.tagForm.controls
    const ref = controls.ref.value
  var bol = false
  let idpal;
this.labelService.getBy({lb_cab: ref}).subscribe((res:any) =>{if (res.data != null) {bol = true}})
  
  
  
    for(let ob of this.dataset) {

      if(ob.tr_ref == ref) {
        console.log("hnehnahna")
        bol = true
        break;
       
      }
    }
    if (!bol) {
    this.locationDetailService.getByOneRef({ ld_ref: ref  }).subscribe(
      (response: any) => {
        this.lddet = response.data
        //console.log(this.lddet.ld_qty_oh)
    if (this.lddet != null) {
     
      
      
     
     
      this.inventoryStatusService.getAllDetails({isd_status: this.lddet.ld_status, isd_tr_type: "CYC-CNT" }).subscribe((resstat:any)=>{
          console.log(resstat)
          const { data } = resstat;

          if (data) {
            this.stat = null
            this.message = "mouvement interdit dans cet emplacement";
            this.hasFormErrors = true;
            return;


          } else {
            this.stat = this.lddet.ld_status
          

      // this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , desc: resp.data.pt_desc1 , qty_oh: this.lddet.ld_qty_oh,
      //   tr_um:resp.data.pt_um, tr_um_conv: 1,  tr_status: this.stat, tr_price: this.sct.sct_cst_tot, tr_expire: this.lddet.ld_expire})
             
     
     this.itemsService.getByOne({pt_part: this.lddet.ld_part  }).subscribe(
      (respopart: any) => {
        console.log(respopart)

     this.sctService.getByOne({ sct_site: this.lddet.ld_site, sct_part: this.lddet.ld_part, sct_sim: 'STD-CG' }).subscribe(
      (respo: any) => {
        this.sct = respo.data
        console.log(this.sct)
        this.labelService.getBy({lb_cab: ref}).subscribe((res:any) =>{if (res.data != null) {idpal = res.data.id}})
        this.labelService.update({lb_actif : false},{id: idpal}).subscribe((res:any) =>{})

     this.gridService.addItem(
      { id: this.dataset.length + 1,  
        tag_nbr: this.tag_nbr,
        tag_part: this.lddet.ld_part,
        tag_serial: this.lddet.ld_lot,
        tag_ref: this.lddet.ld_ref,
        tag_site: this.lddet.ld_site,
        description: respopart.data.pt_desc1,
        tag_loc: this.lddet.ld_loc,
        tag_cnt_qty: this.lddet.ld_qty_oh,         
        tag_cnt_nam: null,
        tag_cnt_dt: null,
        
      
        
        
      
      },
      { position: "bottom" }
    );
 
     });
  
})
  
     
  }
  }); 
        
    
 


  }



    else {
      this.message = "veuillez verifier le bigbag";
            this.hasFormErrors = true;
            return;
  //  this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_part: null })
    }

    });

  }
  else {
    this.message = "bigbag déjà scanné";
    this.hasFormErrors = true;
    return;
  }

  controls.ref.setValue(null)
  document.getElementById("ref").focus();
  
}

}
