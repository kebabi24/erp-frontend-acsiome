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
import {
  
  WorkOrder,
  WorkOrderService,
  PsService,
  BomService,
  WorkRoutingService,
} from "../../../../core/erp";
import { Reason, ReasonService} from "../../../../core/erp"
import { addDays } from "@fullcalendar/angular";
@Component({
  selector: 'kt-edit-wo',
  templateUrl: './edit-wo.component.html',
  styleUrls: ['./edit-wo.component.scss']
})
export class EditWoComponent implements OnInit {
  woForm: FormGroup;
  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  error = false;
 
 

  wos: [];
  columnDefinitions5: Column[] = [];
  gridOptions5: GridOption = {};
  gridObj5: any;
  angularGrid5: AngularGridInstance;

  causes: []
  columnDefinitions6: Column[] = []
  gridOptions6: GridOption = {}
  gridObj6: any
  angularGrid6: AngularGridInstance

  row_number;
  message = "";
  woServer;
  user;
  op:any;
  lpnbr: String;
  stat: String;
  gamme: any;
  color:any;
  micronage:any;
  echeance: any;
  lancement:any;
  jours:any;
  isExist = false
  bom: any;
  woEdit: any;
  title: String = 'Modifier OF - '
  reldate: any
  constructor(
    config: NgbDropdownConfig,
    private woFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private layoutUtilsService: LayoutUtilsService,
    private workOrderService: WorkOrderService,
    private psService: PsService,
    private bomService: BomService,
    private reasonService: ReasonService,
    private workRoutingService: WorkRoutingService,
  ) {
    config.autoClose = true;
  }
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.user =  JSON.parse(localStorage.getItem('user'))
    // this.createForm();
    this.activatedRoute.params.subscribe((params) => {
      const id = params.id
      this.workOrderService.getOne(id).subscribe((response: any)=>{
        console.log(response.data)
        this.woEdit = response.data
        this.reldate = new Date(this.woEdit.wo_rel_date)
          // this.date1 = new Date(this.codeEdit.date01) 
          // this.date1.setDate(this.date1.getDate() )
       
        
          // this.date2 = new Date(this.codeEdit.date02)
          // this.date2.setDate(this.date2.getDate() )
      
         // console.log(this.codeEdit.date01, this.date2)
       
        this.initCode()
        this.loadingSubject.next(false)
        this.title = this.title + this.woEdit.id
      })
  })
    
  }
  initCode() {
    this.createForm()
    this.loadingSubject.next(false)
}
  //create form
  createForm() {
    this.loadingSubject.next(false);
    
    const date = new Date()
    this.woForm = this.woFB.group({
      id: [this.woEdit.id],
      wo_nbr: [this.woEdit.wo_nbr],
      wo_rev:[this.woEdit.wo_rev],
      wo_so_job:[this.woEdit.wo_so_job],
      part: [this.woEdit.wo_part],
      descr: [this.woEdit.item.pt_desc1],
      wo_queue_eff: [this.woEdit.wo_queue_eff],
      wo_status: [this.woEdit.wo_status],
      wo_routing: [this.woEdit.wo_routing],
      site: [this.woEdit.wo_site],
      wo_bom_code: [this.woEdit.wo_bom_code],
      wo_qty_ord: [this.woEdit.wo_qty_ord],
      wo_rel_date: [{
        year: this.reldate.getFullYear(),
        month: this.reldate.getMonth()+1,
        day: this.reldate.getDate()
      }],
      wo_rmks:[this.woEdit.wo_rmks],
     
    });
  }
  //reste form
  reset() {
    this.createForm();
    this.hasFormErrors = false;
  }
  // save data
  
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.woForm.controls;
    if (this.woForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      this.message = "Modifiez quelques éléments et réessayez de soumettre.";
      this.hasFormErrors = true;

      return;
    }

      
     
    // tslint:disable-next-line:prefer-const
   
    let wo = this.prepare()
    this.addIt( wo);


    // tslint:disable-next-line:prefer-const
   // let pr = this.prepare()
    //this.addIt( this.dataset,pr);
  }

  prepare(){
    const controls = this.woForm.controls;
    const _wo = new WorkOrder();
    _wo.wo_status = controls.wo_status.value
    _wo.wo_routing = controls.wo_routing.value
    _wo.wo_bom_code = controls.wo_bom_code.value
    _wo.wo_qty_ord = controls.wo_qty_ord.value
    _wo.wo_queue_eff = controls.wo_queue_eff.value
    _wo.wo_line = this.op
    _wo.wo_rel_date = controls.wo_rel_date.value
      ? `${controls.wo_rel_date.value.year}/${controls.wo_rel_date.value.month}/${controls.wo_rel_date.value.day}`
      : null
      _wo.wo_due_date = this.echeance 
      ? `${this.echeance.year}/${this.echeance.value.month}/${this.echeance.value.day}`
      : null
    _wo.wo_rmks = controls.wo_rmks.value
   
    return _wo
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
  addIt( _wo: any) {
    this.loadingSubject.next(true);
    
    const controls = this.woForm.controls
   

    console.log(controls.id.value)
    this.workOrderService
    .update(controls.id.value, _wo, )
      .subscribe(
       (reponse: any) => ( _wo = reponse.data),
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
        // console.log(this.provider, poNbr, this.dataset);
         // if(controls.print.value == true) printReceive(this.provider, this.dataset, poNbr);
       this.goBack()
          // this.router.navigateByUrl("/");
        }
      );
  }
  onChangeOA() {
   
    const controls = this.woForm.controls;
    const id = controls.id.value;
    
    this.workOrderService.getByOne({ id }).subscribe(
      (res: any) => {
      
                
        this.woServer = res.data;
        
        controls.id.setValue(this.woServer.id);
        controls.wo_nbr.setValue(this.woServer.wo_nbr);
        controls.wo_so_job.setValue(this.woServer.wo_so_job);
        controls.wo_rev.setValue(this.woServer.wo_rev);

        controls.part.setValue(this.woServer.wo_part);
        controls.descr.setValue(this.woServer.item.pt_desc1)
        controls.site.setValue(this.woServer.wo_site);
        controls.wo_routing.setValue(this.woServer.wo_routing);
        controls.wo_bom_code.setValue(this.woServer.wo_bom_code);
        controls.wo_status.setValue(this.woServer.wo_status)
        this.stat = this.woServer.wo_status
        this.color = this.woServer.item.pt_break_cat
        this.micronage = this.woServer.item.int01
        controls.wo_status.enable()
      });
  }

  onChangeStatus() {
  
    const controls = this.woForm.controls;
    const stat = controls.wo_status.value;
   
    // if (this.stat != "R" && stat == "R") {
    
    //   console.log(this.stat)
    //   controls.wo_status.setValue(this.stat)
    //   document.getElementById("stat").focus();




    // }
   
  }
  onChangeqty() {
  
    const controls = this.woForm.controls;
    this.workRoutingService.getByOne({ro_routing: controls.wo_routing.value,ro__chr01:this.color,ro__dec01:this.micronage} ).subscribe((resp:any)=>{

      this.lancement = new Date(controls.wo_rel_date.value)      
      if (resp.data) {console.log(resp.data.ro_run)
        this.op = resp.data.ro_op
        this.jours = Number(Number(controls.wo_qty_ord.value) / (Number(resp.data.ro_run) * 24))
        console.log(this.jours)
             
          if(this.lancement == null)  {this.lancement = new Date()}
        
       
         console.log(this.lancement)
          this.echeance = addDays(this.lancement,this.jours)
          console.log(this.echeance)
          
           
      } 
      else{
        this.workRoutingService.getByOne({ro_routing: controls.wo_routing.value,ro_op:0} ).subscribe((resp:any)=>{

          this.lancement = new Date(controls.wo_rel_date.value)      
          if (resp.data) {console.log(resp.data.ro_run)
            this.op = resp.data.ro_op
            this.jours = Number(Number(controls.wo_qty_ord.value) / (Number(resp.data.ro_run) * 24))
            console.log(this.jours)
                 
              if(this.lancement == null)  {this.lancement = new Date()}
            
           
             console.log(this.lancement)
              this.echeance = addDays(this.lancement,this.jours)
              console.log(this.echeance)
              
               
          } 
        })
      }
    })
   
  }
  onChangebom() {
  
    const controls = this.woForm.controls;
    this.workRoutingService.getByOne({ro_routing: controls.wo_routing.value,ro__chr01:this.color,ro__dec01:this.micronage} ).subscribe((resp:any)=>{

      this.lancement = new Date(controls.wo_rel_date.value)      
      if (resp.data) {console.log(resp.data.ro_run)
        this.op = resp.data.ro_op
        this.jours = Number(Number(controls.wo_qty_ord.value) / (Number(resp.data.ro_run) * 24))
        console.log(this.jours)
             
          if(this.lancement == null)  {this.lancement = new Date()}
        
       
         console.log(this.lancement)
          this.echeance = addDays(this.lancement,this.jours)
          console.log(this.echeance)
          
           
      } 
      else{
        this.workRoutingService.getByOne({ro_routing: controls.wo_routing.value,ro_op:0} ).subscribe((resp:any)=>{

          this.lancement = new Date(controls.wo_rel_date.value)      
          if (resp.data) {console.log(resp.data.ro_run)
            this.op = resp.data.ro_op
            this.jours = Number(Number(controls.wo_qty_ord.value) / (Number(resp.data.ro_run) * 24))
            console.log(this.jours)
                 
              if(this.lancement == null)  {this.lancement = new Date()}
            
           
             console.log(this.lancement)
              this.echeance = addDays(this.lancement,this.jours)
              console.log(this.echeance)
              
               
          } 
        })
      }
    })
   
  }
  onChangerouting() {
  
    const controls = this.woForm.controls;
    this.workRoutingService.getByOne({ro_routing: controls.wo_routing.value,ro__chr01:this.color,ro__dec01:this.micronage} ).subscribe((resp:any)=>{

      this.lancement = new Date(controls.wo_rel_date.value)      
      if (resp.data) {console.log(resp.data.ro_run)
        this.op = resp.data.ro_op
        this.jours = Number(Number(controls.wo_qty_ord.value) / (Number(resp.data.ro_run) * 24))
        console.log(this.jours)
             
          if(this.lancement == null)  {this.lancement = new Date()}
        
       
         console.log(this.lancement)
          this.echeance = addDays(this.lancement,this.jours)
          console.log(this.echeance)
          
           
      } 
      else{
        this.workRoutingService.getByOne({ro_routing: controls.wo_routing.value,ro_op:0} ).subscribe((resp:any)=>{

          this.lancement = new Date(controls.wo_rel_date.value)      
          if (resp.data) {console.log(resp.data.ro_run)
            this.op = resp.data.ro_op
            this.jours = Number(Number(controls.wo_qty_ord.value) / (Number(resp.data.ro_run) * 24))
            console.log(this.jours)
                 
              if(this.lancement == null)  {this.lancement = new Date()}
            
           
             console.log(this.lancement)
              this.echeance = addDays(this.lancement,this.jours)
              console.log(this.echeance)
              
               
          } 
        })
      }
    })
   
  }
  onChangeorder() {
  
    const controls = this.woForm.controls;
    this.workRoutingService.getByOne({ro_routing: controls.wo_routing.value,ro__chr01:this.color,ro__dec01:this.micronage} ).subscribe((resp:any)=>{

      this.lancement = new Date(controls.wo_rel_date.value)      
      if (resp.data) {console.log(resp.data.ro_run)
        this.op = resp.data.ro_op
        this.jours = Number(Number(controls.wo_qty_ord.value) / (Number(resp.data.ro_run) * 24))
        console.log(this.jours)
             
          if(this.lancement == null)  {this.lancement = new Date()}
        
       
         console.log(this.lancement)
          this.echeance = addDays(this.lancement,this.jours)
          console.log(this.echeance)
          
           
      } 
      else{
        this.workRoutingService.getByOne({ro_routing: controls.wo_routing.value,ro_op:0} ).subscribe((resp:any)=>{

          this.lancement = new Date(controls.wo_rel_date.value)      
          if (resp.data) {console.log(resp.data.ro_run)
            this.op = resp.data.ro_op
            this.jours = Number(Number(controls.wo_qty_ord.value) / (Number(resp.data.ro_run) * 24))
            console.log(this.jours)
                 
              if(this.lancement == null)  {this.lancement = new Date()}
            
           
             console.log(this.lancement)
              this.echeance = addDays(this.lancement,this.jours)
              console.log(this.echeance)
              
               
          } 
        })
      }
    })
  }
  onChangereldate() {
  
    const controls = this.woForm.controls;
    this.workRoutingService.getByOne({ro_routing: controls.wo_routing.value,ro__chr01:this.color,ro__dec01:this.micronage} ).subscribe((resp:any)=>{

      this.lancement = new Date(controls.wo_rel_date.value)      
      if (resp.data) {console.log(resp.data.ro_run)
        this.op = resp.data.ro_op
        this.jours = Number(Number(controls.wo_qty_ord.value) / (Number(resp.data.ro_run) * 24))
        console.log(this.jours)
             
          if(this.lancement == null)  {this.lancement = new Date()}
        
       
         console.log(this.lancement)
          this.echeance = addDays(this.lancement,this.jours)
          console.log(this.echeance)
          
           
      } 
      else{
        this.workRoutingService.getByOne({ro_routing: controls.wo_routing.value,ro_op:0} ).subscribe((resp:any)=>{

          this.lancement = new Date(controls.wo_rel_date.value)      
          if (resp.data) {console.log(resp.data.ro_run)
            this.op = resp.data.ro_op
            this.jours = Number(Number(controls.wo_qty_ord.value) / (Number(resp.data.ro_run) * 24))
            console.log(this.jours)
                 
              if(this.lancement == null)  {this.lancement = new Date()}
            
           
             console.log(this.lancement)
              this.echeance = addDays(this.lancement,this.jours)
              console.log(this.echeance)
              
               
          } 
        })
      }
    })
   
  }


  /**
   * Go back to the list
   *
   */
  goBack() {
    this.loadingSubject.next(false);
    const url = `/manufacturing/list-wo`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }

  // add new Item to Datatable
  
  
  
  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  handleSelectedRowsChanged5(e, args) {
    const controls = this.woForm.controls;

   
    if (Array.isArray(args.rows) && this.gridObj5) {
      args.rows.map((idx) => {
        const item = this.gridObj5.getDataItem(idx);
        controls.id.setValue(item.id || "");
       
        controls.wo_nbr.setValue(item.wo_nbr);
        controls.part.setValue(item.wo_part);
        controls.descr.setValue(item.item.pt_desc1)

        controls.site.setValue(item.wo_site);
        controls.routing.setValue(item.wo_routing);
        controls.bom.setValue(item.wo_bom_code);
        controls.wo_status.setValue(item.wo_status)
        this.stat = this.woServer.wo_status
        this.color = item.item.pt_break_cat
        this.micronage = item.item.int01
        controls.wo_status.enable()
          }
        );



      
    }
  }

  angularGridReady5(angularGrid: AngularGridInstance) {
    this.angularGrid5 = angularGrid;
    this.gridObj5 = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGrid5() {
    this.columnDefinitions5 = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "wo_nbr",
        name: "N° OF",
        field: "wo_nbr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "wo_ord_date",
        name: "Date",
        field: "wo_ord_date",
        sortable: true,
        filterable: true,
        type: FieldType.date,
      },
      {
        id: "wo_part",
        name: "Article",
        field: "wo_part",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "wo_status",
        name: "status",
        field: "wo_status",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptions5 = {
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
    this.workOrderService
      .getAll()
      .subscribe((response: any) => {
       // console.log(response.data)
        this.wos = response.data });
      
      
      
    }
  open5(content) {
    this.prepareGrid5();
    this.modalService.open(content, { size: "lg" });
  }
  handleSelectedRowsChanged6(e, args) {
    const controls = this.woForm.controls
    if (Array.isArray(args.rows) && this.gridObj6) {
        args.rows.map((idx) => {
            const cause = this.gridObj6.getDataItem(idx)
            console.log(cause)
            controls.wo_rmks.setValue(cause.rsn_ref || "")

        })
    }
}
angularGridReady6(angularGrid: AngularGridInstance) {
    this.angularGrid6 = angularGrid
    this.gridObj6 = (angularGrid && angularGrid.slickGrid) || {}
}
prepareGrid6() {
    const controls = this.woForm.controls
    this.columnDefinitions6 = [
        {
            id: "id",
            name: "id",
            field: "id",
            sortable: true,
            minWidth: 80,
            maxWidth: 80,
        },
       
       
        {
          id: "rsn_ref",
          name: "Code",
          field: "rsn_ref",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      
        {
            id: "rsn_desc",
            name: "Designation",
            field: "rsn_desc",
            sortable: true,
            width: 200,
            filterable: true,
            type: FieldType.string,
        },
    ]

    this.gridOptions6 = {
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
    }

    // fill the dataset with your data
    
    this.reasonService
        .getBy ({rsn_type: 'WORKORDERCHANGE' })
        .subscribe((response: any) => (this.causes = response.data))
     
}
open6(content) {
    this.prepareGrid6()
    this.modalService.open(content, { size: "lg" })
}
}
