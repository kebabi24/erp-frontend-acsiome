import { Component, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";

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
import { round } from 'lodash';

import { BehaviorSubject, Observable } from "rxjs";
import { FormGroup, FormBuilder, Validators, NgControlStatus } from "@angular/forms"
import { Project, ProjectService, CustomerService, ProviderService, ItemService, BomService, TaskService, PsService , SaleOrderService, Requisition,
         RequisitionService,SaleOrder, AddressService, DeviseService, SiteService,DealService ,QualityControlService} from "../../../../core/erp";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import {
  LayoutUtilsService,
  TypesUtilsService,
  MessageType,
  HttpUtilsService,
} from "../../../../core/_base/crud"
import { reverseString } from "@amcharts/amcharts4/.internal/core/utils/Utils";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../../environments/environment";
const API_URL = environment.apiUrl + "/codes";

@Component({
  selector: 'kt-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.scss']
})
export class EditProjectComponent implements OnInit {

 
  projectForm: FormGroup;
  row_number;
  selected_doc_row_number;

  isExist = false

  error = false;
  specifications :[];
  project_types :[];
  customers: [];
  columnDefinitions2: Column[] = [];
  gridOptions2: GridOption = {};
  gridObj2: any;
  angularGrid2: AngularGridInstance;

  columnDefinitions3: Column[] = [];
  gridOptions3: GridOption = {};
  gridObj3: any;
  angularGrid3: AngularGridInstance;
  selectedIndexes : any[]
  docs_codess : any[]
  
  datatask: [];
  columnDefinitionstask: Column[] = [];
  gridOptionstask: GridOption = {};
  gridObjtask: any;
  angularGridtask: AngularGridInstance;
  
  databom: [];
  columnDefinitionsbom: Column[] = [];
  gridOptionsbom: GridOption = {};
  gridObjbom: any;
  angularGridbom: AngularGridInstance;

  items: [];
  columnDefinitions4: Column[] = [];
  gridOptions4: GridOption = {};
  gridObj4: any;
  angularGrid4: AngularGridInstance;

  providers: [];
  columnDefinitionsvend: Column[] = [];
  gridOptionsvend: GridOption = {};
  gridObjvend: any;
  angularGridvend: AngularGridInstance;
  // grid options
  mvangularGrid: AngularGridInstance;
  mvgrid: any;
  mvgridService: GridService;
  mvdataView: any;
  mvcolumnDefinitions: Column[];
  mvgridOptions: GridOption;
  mvdataset: any[];
  sodataset = [];
  reqdataset = [];
  project: Project;
  gridService: GridService
  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  saleOrder:  SaleOrder;

  datasite: []
  columnDefinitionssite: Column[] = []
  gridOptionssite: GridOption = {}
  gridObjsite: any
  angularGridsite: AngularGridInstance

  datadeal: []
  columnDefinitionsdeal: Column[] = []
  gridOptionsdeal: GridOption = {}
  gridObjdeal: any
  angularGriddeal: AngularGridInstance


  date: String;
  customer: any;
  ex_rate1 : any;
  ex_rate2 : any;
  type: String;

  doc_triggers : any = []
  columnDefinitions5: Column[] = [];
  gridOptions5: GridOption = {};
  gridObj5: any;
  angularGrid5: AngularGridInstance
  dataView5: any
  dataView3: any
  gridService5: GridService
  grid5: any
  selectedTriggersIndexes : any[]
projectEdit:any;
soEdit: any;
  httpOptions = this.httpUtils.getHTTPHeaders();
  title: String = 'Modifier Projet - '
orddate: any
name : any
  constructor(
    config: NgbDropdownConfig,
    private httpUtils: HttpUtilsService,
    private projectFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private modalService: NgbModal,
    private projectService: ProjectService,
    private taskService: TaskService,
    private customerService: CustomerService,
    private qualityControlService: QualityControlService,
    private providerService: ProviderService,
    private itemService: ItemService,
    private bomService: BomService,
    private saleOrderService: SaleOrderService,
    private requisitonService: RequisitionService,
    private psService: PsService,
    private deviseService: DeviseService,
    private siteService: SiteService,
    private dealService: DealService,
    private addressService: AddressService,
    private http: HttpClient,
  ) {
    config.autoClose = true;
  }

  mvGridReady(angularGrid: AngularGridInstance) {
    this.mvangularGrid = angularGrid;
    this.mvdataView = angularGrid.dataView;
    this.mvgrid = angularGrid.slickGrid;
    this.mvgridService = angularGrid.gridService;
  }
  
  ngOnInit(): void {
    //this.reset();
   
    this.loading$ = this.loadingSubject.asObservable()
    this.loadingSubject.next(true)
    this.activatedRoute.params.subscribe((params) => {
        const id = params.id
        this.projectService.getOne(id).subscribe((response: any)=>{
        
          this.projectEdit = response.data.project
          this.mvdataset = response.data.details
          this.orddate = new Date(this.projectEdit.pm_ord_date)
         // console.log(this.projectEdit)
         
         
         

          this.initCode()
          this.loadingSubject.next(false)
          this.title = this.title + this.projectEdit.pm_code
         // console.log(this.mvdataset)
          
          this.customerService.getBy({ cm_addr : this.projectEdit.pm_cust  }).subscribe(
            (res: any) => {
              this.customer=res.data
             // console.log(this.customer)
            })
            this.saleOrderService.getBy({ so_po : this.projectEdit.pm_code  }).subscribe(
              (respon: any) => {
                this.soEdit=respon.data.saleOrder
            //    console.log(this.soEdit)
              })
        })
 
         
      
       
    })
       
    
   
   

   
  this.initmvGrid() 
  
    this.prepareTriggersGrid()
    this.getSpecifications();
    this.getProjectTypes(); 
    

    
  }
  // init code
initCode() {
  this.createForm()
  this.loadingSubject.next(false)
}
  //create form
  createForm() {
    this.loadingSubject.next(false);
   // this.project = new Project();
   // const date = new Date;
    this.projectForm = this.projectFB.group({
      pm_code: [{value:this.projectEdit.pm_code, disabled:true}],
      pm_desc: [this.projectEdit.pm_desc  ,  Validators.required],
      pm_site: [this.projectEdit.pm_site  ,  Validators.required],
      pm_cust: [ this.projectEdit.pm_cust ],
      pm_deal: [this.projectEdit.pm_deal],
      name: [{value:this.name, disabled: true}],
      pm_amt: [ this.projectEdit.pm_amt],
      pm_cost: [this.projectEdit.pm_cost],
      pm_ord_date: [{
        year:this.orddate.getFullYear(),
        month: this.orddate.getMonth()+1,
        day: this.orddate.getDate()
      }],
      pm_type: [this.projectEdit.pm_type],
      pm_doc_list_code: [this.projectEdit.pm_doc_list_code],
      
     
    });
  const controls = this.projectForm.controls
    this.addressService.getBy({ad_addr: this.projectEdit.pm_cust}).subscribe((resp: any)=>{
      this.name = resp.data.ad_name
    controls.name.setValue(this.name)
     
   }) 
  }


  //reste form
  reset() {
    this.isExist = false 
    this.project = new Project();
    this.mvdataset = [];
    this.sodataset = [];
    this.createForm();
    this.hasFormErrors = false;
  }
  // save data
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.projectForm.controls;
    /** check form */
    if (this.projectForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      return;
    }

    // tslint:disable-next-line:prefer-const
    let project = this.prepareproject();
    for (let data of this.mvdataset) {
      delete data.id;
      delete data.cmvid;
      
    }
    this.addproject(project, this.mvdataset);
  }
  /**
   * Returns object for saving
   */
  prepareproject(): Project {
    const controls = this.projectForm.controls;
    const _project = new Project();
    _project.pm_code = controls.pm_code.value;
    _project.pm_desc = controls.pm_desc.value;
    _project.pm_site = controls.pm_site.value;
    _project.pm_cust = controls.pm_cust.value;
    _project.pm_deal = controls.pm_deal.value;
    _project.pm_amt = controls.pm_amt.value;
    _project.pm_cost = controls.pm_cost.value;
    _project.pm_type = controls.pm_type.value;
    _project.pm_doc_list_code = controls.pm_doc_list_code.value;
    return _project;
  }
  /**
   * Add code
   *
   * @param _project: ProjectModel
   */
  addproject(_project: Project, details: any) {
    this.sodataset = [];
   // console.log("details",details)
    // for (let data of details) {
    //   console.log("yawyawyawyaw",data)
    //   this.itemService.getByOne({pt_part: data.pmd_part }).subscribe((resp:any)=>{

    //     if (resp.data.pt_phantom) {
    //       this.type = 'M'
        
    //     } else {
    //       this.type = null
    //     }            
    //     this.sodataset.push({
    //       sod_line: data.pmd_line,
    //       sod_part: resp.data.pt_part,
    //       sod_um: resp.data.pt_um,
    //       sod__chr01:  data.pmd_task,
    //       sod_qty_ord: data.pmd_qty,
    //       sod_qty_ret: data.day,
    //       //sod_qty_cons: 0,
    //       sod_desc: resp.data.pt_desc1 ,
    //       sod_site:resp.data.pt_site, 
    //       sod_loc: resp.data.pt_loc,
    //       sod_um_conv:1, 
    //       sod_type: this.type,
    //       sod_price: resp.data.pt_price, 
    //       sod_disc_pct:0, 
    //       sod_tax_code:resp.data.pt_taxc, 
    //       sod_taxc: resp.data.taxe.tx2_tax_pct, 
    //       sod_taxable: resp.data.pt_taxable
    //     })
     
    //   })
    //   console.log("creation", this.sodataset)
    // }
    // console.log("creation 2", this.sodataset)
    let l = []
    if (this.selectedIndexes.length > 0) {
    this.selectedIndexes.forEach(index => {
      l.push({
        code_doc : this.specifications[index]['mp_nbr'],
        trigger : this.specifications[index]['pjd_trigger']
      })
    });
    }


    this.loadingSubject.next(true);
    this.projectService
      // .add({ Project: _project, ProjectDetails: details , docs_codes :l  })
      // .subscribe(
        this.projectService.update({project: _project, details,  docs_codes :l},this.projectEdit.id).subscribe( 
        (reponse) => console.log("response", reponse),
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
          const controls = this.projectForm.controls
            const deal_code = controls.pm_deal.value;
  

            for (let data of details) {
             // console.log("yawyawyawyaw",data)
              this.itemService.getByOne({pt_part: data.pmd_part }).subscribe((resp:any)=>{
        
                if (resp.data.pt_phantom) {
                  this.type = 'M'
                
                } else {
                  this.type = null
                }            
                this.sodataset.push({
                  sod_line: data.pmd_line,
                  sod_part: resp.data.pt_part,
                  sod_um: resp.data.pt_um,
                  sod__chr01:  data.pmd_task,
                  sod__chr02: data.pmd_bom_code,
                  sod_qty_ord: data.pmd_qty,
                  sod_qty_ret: data.day,
                  //sod_qty_cons: 0,
                  sod_desc: resp.data.pt_desc1 ,
                  sod_site:resp.data.pt_site, 
                  sod_loc: resp.data.pt_loc,
                  sod_um_conv:1, 
                  sod_type: this.type,
                  sod_price: resp.data.pt_price, 
                  sod_disc_pct:0, 
                  sod_tax_code:resp.data.pt_taxc, 
                  sod_taxc: resp.data.taxe.tx2_tax_pct, 
                  sod_taxable: resp.data.pt_taxable
                })
             
              })
             // console.log("creation", this.sodataset)
            }


  this.dealService.getByOne({ deal_code }).subscribe(
    (res: any) => {
      //console.log(res);
      const { data } = res;
 
    //  console.log("deal",this.sodataset)
      if(res.data != null) {

      //  console.log("hna datasetSo",this.sodataset)
        let so = this.prepareSo();
      //  console.log("so", so)
        so.so_cr_terms = res.data.deal_pay_meth
        this.addSo(so, this.sodataset);

      }
      else {
       // console.log("hna datasetSo 2",this.sodataset)
                let so = this.prepareSo();
               // console.log("so", so)
                this.addSo(so, this.sodataset);
      }
    })
         // this.addReq(details);
          
          this.layoutUtilsService.showActionNotification(
            "Ajout avec succès",
            MessageType.Create,
            10000,
            true,
            true
          );
         
          this.loadingSubject.next(false);
          this.reset();
          this.router.navigateByUrl("/project/list-pm");
   //       this.reset();
        }
      );


     
    

    
  }

  prepareReq(): any {
    const controls = this.projectForm.controls
    const _req = new Requisition()
    _req.rqm_category =  "RQ"
      _req.rqm_nbr=  controls.rqm_nbr.value
      _req.rqm_vend =  controls.rqm_vend.value
      _req.rqm_req_date=  controls.pm_ord_date.value
      ? `${controls.pm_ord_date.value.year}/${controls.pm_ord_date.value.month}/${controls.pm_ord_date.value.day}`
      : null;
      _req.rqm_need_date=  controls.pm_ord_date.value
      ? `${controls.pm_ord_date.value.year}/${controls.pm_ord_date.value.month}/${controls.pm_ord_date.value.day}`
      : null;
      //_req.rqm_status=  controls.rqm_status.value
      _req.rqm_open= true
      _req.rqm_aprv_stat = 0
    return _req
}

  prepareSo(): any {
    const controls = this.projectForm.controls;
    const _so = new SaleOrder();
    const date = new Date()

    
        //_so.so_category =  "SO"
        _so.so_cust = controls.pm_cust.value;
        _so.so_nbr = this.soEdit.so_nbr;
        _so.so_ord_date = controls.pm_ord_date.value
          ? `${controls.pm_ord_date.value.year}/${controls.pm_ord_date.value.month}/${controls.pm_ord_date.value.day}`
          : null;
        _so.so_due_date = controls.pm_ord_date.value
          ? `${controls.pm_ord_date.value.year}/${controls.pm_ord_date.value.month}/${controls.pm_ord_date.value.day}`
          : null;

        _so.so_po = controls.pm_code.value;
        _so.so_amt = controls.pm_amt.value;
        _so.so_cr_terms = this.customer.cm_cr_terms;
        _so.so_curr = this.customer.cm_curr 
        _so.so_taxable = this.customer.address.ad_taxable 
        _so.so_taxc = this.customer.address.ad_taxc 
        _so.so_ex_rate = this.ex_rate1 
        _so.so_ex_rate2 = this.ex_rate2

      // }  
        
  // })
      
      
    return _so;


  
  }
  /**
   * Add po
   *
   * @param _so: so
   */
  addSo(_so: any, sodetail: any) {
    
     
 //console.log("so sos os ososososososososo")   

    this.loadingSubject.next(true);
    let so = null;
    
    // this.saleOrderService
    //   .add({ saleOrder: _so, saleOrderDetail: sodetail })
    //   .subscribe(
      this.saleOrderService
      .updateproj(this.soEdit.id ,{ saleOrder: _so, saleOrderDetail: sodetail})
      .subscribe(
        (reponse: any) => (so = reponse.data),
        (error) => {
          this.layoutUtilsService.showActionNotification(
            "Erreur verifier les informations",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.loadingSubject.next(false);
        }
      );
  }

//   addReq(detail:any) {
//     const controls = this.projectForm.controls;
//     for (let data of detail) {
//     if ( data.pmd_vend != "" &&  data.pmd_vend != null) {  
//       this.reqdataset = []
//       const _req = new Requisition()
//       _req.rqm_category =  "RQ"
//         _req.rqm_vend =  data.pmd_vend
//         _req.rqm_req_date=  controls.pm_ord_date.value
//         ? `${controls.pm_ord_date.value.year}/${controls.pm_ord_date.value.month}/${controls.pm_ord_date.value.day}`
//         : null;
//         _req.rqm_need_date=  controls.pm_ord_date.value
//         ? `${controls.pm_ord_date.value.year}/${controls.pm_ord_date.value.month}/${controls.pm_ord_date.value.day}`
//         : null;
//         //_req.rqm_status=  controls.rqm_status.value
//         _req.rqm_open= true
//         _req.rqm_aprv_stat = '0'

//       this.reqdataset.push({
//         rqd_line: data.pmd_line,
//         rqd_part: data.pmd_part,
//         rqd_um: data.pmd_um,
        
//         rqd_req_qty: 1,
//              });
             
    
//     this.loadingSubject.next(true)
//     this.requisitonService.add({ requisition: _req, requisitionDetail: this.reqdataset }).subscribe(
//         (reponse) => console.log("response", Response),
//         (error) => {
//             this.layoutUtilsService.showActionNotification(
//                 "Erreur verifier les informations",
//                 MessageType.Create,
//                 10000,
//                 true,
//                 true
//             )
//             this.loadingSubject.next(false)
//         },
//         () => {
//             this.layoutUtilsService.showActionNotification(
//                 "Ajout avec succès",
//                 MessageType.Create,
//                 10000,
//                 true,
//                 true
//             )
//             this.loadingSubject.next(false)
//             //this.router.navigateByUrl("/")
//         }
//     )
//     }
//   }
// }

  /**
   * Go back to the list
   *
   */
  goBack() {
    this.loadingSubject.next(false);
    const url = `/`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
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
            this.calculatetot();
          }
        },
      },
      {
        id: "pmd_line",
        name: "Ligne",
        field: "pmd_line",
        minWidth: 30,
        maxWidth: 30,
        selectable: true,
      },
      {
        id: "pmd_task",
        name: "Code Instruction",
        field: "pmd_task",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
      },
      {
        id: "mvidl",
        field: "cmvidl",
        excludeFromHeaderMenu: true,
        formatter: Formatters.infoIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
            this.row_number = args.row;
            let element: HTMLElement = document.getElementById(
            "openTasksGrid"
            ) as HTMLElement;
            element.click();
        },
    },    
      {
        id: "desc",
        name: "Designation",
        field: "task.tk_desc",
        sortable: true,
        width: 120,
        filterable: false,
        type: FieldType.string,
       
      },
      {
        id: "pmd_um",
        name: "UM",
        field: "pmd_um",
        sortable: true,
        width: 30,
        filterable: false,
        type: FieldType.string,
       
      },
      {
        id: "pmd_cost",
        name: "Cout",
        field: "pmd_cost",
        sortable: true,
        width: 30,
        filterable: false,
        type: FieldType.float,
       
      },
      
      {
        id: "pmd_qty",
        name: "QTE",
        field: "pmd_qty",
        sortable: true,
        width: 30,
        filterable: false,
        type: FieldType.float,
        editor: {
          model: Editors.float,
          params:{minDecimal: 2,},
        },
       
      },
      {
        id: "pmd_price",
        name: "Prix",
        field: "pmd_price",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.float,
       
      },
      
      {
        id: "pmd_bom_code",
        name: "Code Nomenclature",
        field: "pmd_bom_code",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
      },
      {
        id: "mvidl",
        field: "cmvidl",
        excludeFromHeaderMenu: true,
        formatter: Formatters.infoIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
            this.row_number = args.row;
            let element: HTMLElement = document.getElementById(
            "openBomsGrid"
            ) as HTMLElement;
            element.click();
        },
    },    
    {
      id: "pmd_bom_cost",
      name: "Cout Nomenclature",
      field: "pmd_bom_cost",
      sortable: true,
      width: 80,
      filterable: false,
      type: FieldType.float,
    },
    

      {
        id: "pmd_start",
        name: "Date Début",
        field: "pmd_start",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.dateIso,
        editor: {
          model: Editors.date,
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          
          var days = Number(1) + Number((new Date(args.dataContext.pmd_end).getTime() - new Date(args.dataContext.pmd_start).getTime() ) / (1000 * 3600 * 24));
          if ( days < 0) {days = 0 }
          //console.log(args.dataContext.pmd_end,args.dataContext.pmd_start,days)
          this.mvgridService.updateItemById(args.dataContext.id,{...args.dataContext , int01: days })

          },
      },
      
      {
        id: "pmd_end",
        name: "Date Fin",
        field: "pmd_end",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.dateIso,
        editor: {
          model: Editors.date,
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          
          var days = Number(1) + Number((new Date(args.dataContext.pmd_end).getTime() - new Date(args.dataContext.pmd_start).getTime() ) / (1000 * 3600 * 24));
          if ( days < 0) {days = 0 }
          //console.log(args.dataContext.pmd_end,args.dataContext.pmd_start,days)
          this.mvgridService.updateItemById(args.dataContext.id,{...args.dataContext , int01: days })

          },
      },
      {
        id: "int01",
        name: "Nbr Jour",
        field: "int01",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.integer,
        editor: {
          model: Editors.integer,
        },
      },
      {
        id: "pmd_part",
        name: "Code Service",
        field: "pmd_part",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
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
        id: "descr",
        name: "Designation",
        field: "item.pt_desc1",
        sortable: true,
        width: 120,
        filterable: false,
        type: FieldType.string,
       
      },
      {
        id: "pmd_um",
        name: "UM",
        field: "pmd_um",
        sortable: true,
        width: 30,
        filterable: false,
        type: FieldType.string,
       
      },

      {
        id: "pmd_vend",
        name: "Code Fournisseur",
        field: "pmd_vend",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          
          model: Editors.text,
        },
        
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
            "openVendsGrid"
          ) as HTMLElement;
          element.click();
        },
      },
      
      
      
    ];

    this.mvgridOptions = {
      asyncEditorLoading: false,
      editable: true,
      autoHeight:true,
      enableAutoResize: true,
      autoCommitEdit:true,
      enableColumnPicker: true,
      autoEdit:true,
      enableCellNavigation: true,
      enableRowSelection: true,
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
   // this.mvdataView.setItems(this.mvdataset)
    // this.mvdataset = [];
  }
  addNewItem() {
    const newId = this.mvdataset.length+1;

    const newItem = {
      id: newId,
      pmd_line: newId,
      pmd_task : "",
      desc: "",
      cout: 0,
      pmd_bom: "",
      pmd_bom_cost : 0,
      pmd_start: null,
      pmd_end: null,
      pmd_part: "",
      descr:"",
      pmd_vend: "",
    };
    this.mvgridService.addItem(newItem, { position: "bottom" });
  }
onAlertClose($event) {
  this.hasFormErrors = false
}





onChangeCust() {
  const controls = this.projectForm.controls; // chof le champs hada wesh men form rah
  const cm_addr = controls.pm_cust.value;
  
  this.customerService.getBy({ cm_addr }).subscribe(
    (res: any) => {
     // console.log(res);
      const { data } = res;

      if (!data) {
        this.layoutUtilsService.showActionNotification(
          "ce client n'existe pas!",
          MessageType.Create,
          10000,
          true,
          true
        );
        this.error = true;
        document.getElementById("cust").focus();
      } else {
        this.error = false;
        controls.pm_cust.setValue(data.cm_addr || "");
        controls.name.setValue(data.address.ad_name || "");
        this.customerService.getBy({ cm_addr : controls.pm_cust.value  }).subscribe(
          (res: any) => {
            //console.log(res);
            const { data } = res;
    
            if (data) {
    
            
             this.customer = data
              
              
              if (data.cm_curr == 'DA'){
               this.ex_rate1 = 1 
               this.ex_rate2 = 1
    
              } else {
    
              this.deviseService.getExRate({exr_curr1:data.cm_curr, exr_curr2:'DA', date: this.date}).subscribe((res:any)=>{
                
                 this.ex_rate1 = res.data.exr_rate
                 this.ex_rate2 = res.data.exr_rate2
                })
    
                }
    
            }
             
          }
          
        );


      }
       
    },
    (error) => console.log(error)
  );
}

onChangeDeal() {
  const controls = this.projectForm.controls; // chof le champs hada wesh men form rah
  const deal_code = controls.pm_deal.value;
  
  this.dealService.getByOne({ deal_code }).subscribe(
    (res: any) => {
      //console.log(res);
      const { data } = res;

      if (!data) {
        this.layoutUtilsService.showActionNotification(
          "ce contrat n'existe pas!",
          MessageType.Create,
          10000,
          true,
          true
        );
        this.error = true;
        document.getElementById("deal").focus();
        controls.pm_deal.setValue(null)
      } else {
        this.error = false;
        controls.pm_deal.setValue(data.deal_code || "");
             
          
      


      }
       
    },
    (error) => console.log(error)
  );
}

handleSelectedRowsChanged2(e, args) {
  
  const controls = this.projectForm.controls;
  if (Array.isArray(args.rows) && this.gridObj2) {
    args.rows.map((idx) => {
      const item = this.gridObj2.getDataItem(idx);
      
      controls.pm_cust.setValue(item.cm_addr || "");
      controls.name.setValue(item.address.ad_name || "");
      
      this.customerService.getBy({ cm_addr : controls.pm_cust.value  }).subscribe(
        (res: any) => {
          //console.log(res);
          const { data } = res;
  
          if (data) {
  
          
           this.customer = data
            
            
            if (data.cm_curr == 'DA'){
             this.ex_rate1 = 1 
             this.ex_rate2 = 1
  
            } else {
  
            this.deviseService.getExRate({exr_curr1:data.cm_curr, exr_curr2:'DA', date: this.date}).subscribe((res:any)=>{
              
               this.ex_rate1 = res.data.exr_rate
               this.ex_rate2 = res.data.exr_rate2
              })
  
              }
  
          }
           
        }
        
      );

    });
  }
}

handleSelectedRowsChanged3(e, args) {
  this.selectedIndexes =[]
  this.selectedIndexes = args.rows;

}

handleSelectedRowsChanged5(e, args) {
  this.selectedTriggersIndexes =[]
  this.selectedTriggersIndexes = args.rows;
  // const selected_trigger_code = this.gridService5.getDataItemByRowIndex(this.selectedTriggersIndexes[0]).code_value
  
  (this.specifications[this.selected_doc_row_number] as any).pjd_trigger = this.gridService5.getDataItemByRowIndex(this.selectedTriggersIndexes[0]).code_value
  // this.specifications[this.selected_doc_row_number].pjd_trigger = selected_trigger_code

  this.dataView3.setItems(this.specifications)
}

angularGridReady2(angularGrid: AngularGridInstance) {
  this.angularGrid2 = angularGrid;
  this.gridObj2 = (angularGrid && angularGrid.slickGrid) || {};
}

angularGridReady3(angularGrid: AngularGridInstance) {
  this.angularGrid3 = angularGrid;
  this.gridService = angularGrid.gridService;
  this.gridObj3 = (angularGrid && angularGrid.slickGrid && angularGrid.gridService) || {};
  this.dataView3 = angularGrid.dataView;
}

// DOCS ***************************************


prepareGrid3() {
  this.columnDefinitions3 = [
    {
      id: "id",
      name: "id",
      field: "id",
      sortable: true,
      minWidth: 80,
      maxWidth: 80,
    },
    {
      id: "mp_nbr",
      name: "code specification",
      field: "mp_nbr",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "mp_desc",
      name: "description",
      field: "mp_desc",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    // {
    //   id: "pjd_trigger",
    //   name: "Trigger",
    //   field: "pjd_trigger",
    //   sortable: true,
    //   width: 50,
    //   filterable: true,
    //   type: FieldType.string,
    //   editor: {model: Editors.text}
    // },
    // {
    //   id: "mvid",
    //   field: "cmvid",
    //   excludeFromHeaderMenu: true,
    //   formatter: Formatters.infoIcon,
    //   minWidth: 30,
    //   maxWidth: 30,
    //   onCellClick: (e: Event, args: OnEventArgs) => {
    //       this.selected_doc_row_number = args.row
    //       console.log(this.selected_doc_row_number)
    //       let element: HTMLElement = document.getElementById(
    //           "openTriggerPopup"
    //       ) as HTMLElement
    //       element.click()
        
           
    //   },
    // },
    {
        id: "pjd_trigger",
        name: "Trigger",
        field: "pjd_trigger",
        sortable: true,
        width: 50,
        filterable: true,
        type: FieldType.string,
        editor: {
          model: Editors.singleSelect,
          enableRenderHtml: true,
          collectionAsync: this.http.get(`${API_URL}/triggerType`), 
         
        },
      },
    

    {
      id: "mp_expire",
      name: "date expiration",
      field: "mp_expire",
      sortable: true,
      filterable: true,
      type: FieldType.date,
    },
    
  ];

  this.gridOptions3 = {
      enableSorting: true,
      enableCellNavigation: true,
      enableExcelCopyBuffer: true,
      enableFiltering: true,
      editable : true,
      autoEdit: false,
      autoHeight: true,
      frozenColumn: 0,
      frozenBottom: true,
      enableRowSelection: true,
      enableCheckboxSelector: true,
      multiSelect: true,
      rowSelectionOptions: {selectActiveRow: false}
  };

  // fill the dataset with your data
  this.projectService
    .getSpecifications()
    .subscribe((response: any) => (this.specifications = response.data));
}

prepareTriggersGrid() {
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
      id: "code_value",
      name: "code",
      field: "code_value",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "code_desc",
      name: "description",
      field: "code_desc",
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
      autoHeight: true,
      frozenColumn: 0,
      frozenBottom: true,
      enableRowSelection: true,
      enableCheckboxSelector: true,
      multiSelect: true,
      rowSelectionOptions: {selectActiveRow: false}
  };

  // fill the dataset with your data
  this.qualityControlService
  .findDocumentTriggers()
  .subscribe((response: any) => {
   // console.log(response.data)
    this.doc_triggers = response.data});
}

openTriggerGrid(content){
  this.prepareTriggersGrid()
  this.modalService.open(content, { size: "lg" })
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
      id: "cm_addr",
      name: "code",
      field: "cm_addr",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_name",
      name: "Client",
      field: "address.ad_name",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_phone",
      name: "Numero telephone",
      field: "address.ad_phone",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_taxable",
      name: "A Taxer",
      field: "address.ad_taxable",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_taxc",
      name: "Taxe",
      field: "address.ad_taxc",
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
  this.customerService
    .getAll()
    .subscribe((response: any) => (this.customers = response.data));
}
open2(content) {
  this.prepareGrid2();
  this.modalService.open(content, { size: "lg" });
}


open3(content) {
  this.prepareGrid3();
  this.modalService.open(content, { size: "lg" });
}

handleSelectedRowsChangedtask(e, args) {
  let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number);
  if (Array.isArray(args.rows) && this.gridObjtask) {
    args.rows.map((idx) => {
      const item = this.gridObjtask.getDataItem(idx);
          
      
      
     
   
      this.taskService
        .getBy({
              tk_code: item.tk_code
        })
        .subscribe((response: any) => {
        //  console.log(response.data, response.data.details.length)
          updateItem.pmd_task = item.tk_code;
          updateItem.desc = item.tk_desc;
          updateItem.pmd_um = item.tk_um;
          updateItem.pmd_qty = Number(response.data.details.length);
          updateItem.pmd_price = item.tk_price * Number(response.data.details.length);
          this.taskService
          .getCost({
                tk_code: item.tk_code
               
          })
          .subscribe((response: any) => {
          
            updateItem.pmd_cost = Number(response.data);
        
            this.mvgridService.updateItem(updateItem);
            this.calculatetot();

          })

     })



});

  }
}
angularGridReadytask(angularGrid: AngularGridInstance) {
  this.angularGridtask = angularGrid;
  this.gridObjtask = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGridtask() {
  this.columnDefinitionstask = [
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
      id: "tk_code",
      name: "Code",
      field: "tk_code",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "tk_desc",
      name: "Designation",
      field: "tk_desc",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    
  ];

  this.gridOptionstask = {
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
    let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number);
  
  // fill the dataset with your data
  this.taskService
    .getAll()
    .subscribe((response: any) => (this.datatask = response.data));
}
opentask(contenttask) {
  this.prepareGridtask();
  this.modalService.open(contenttask, { size: "lg" });
}


handleSelectedRowsChangedbom(e, args) {
  let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number);
  if (Array.isArray(args.rows) && this.gridObjbom) {
    args.rows.map((idx) => {
      const item = this.gridObjbom.getDataItem(idx);
          
      updateItem.pmd_bom = item.bom_parent;
      
      
      this.mvgridService.updateItem(updateItem);
      this.psService
      .getPrice({
            ps_parent: item.bom_parent
      })
      .subscribe((response: any) => {
        //console.log(response.data, "here")
        updateItem.pmd_bom_code = item.bom_parent;
        
        updateItem.pmd_bom_cost = response.data;
        this.mvgridService.updateItem(updateItem);
        this.calculatetot();
   })
   
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
    let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number);
  
  // fill the dataset with your data
  this.bomService
    .getAll()
    .subscribe((response: any) => (this.databom = response.data));
}
openbom(contentbom) {
  this.prepareGridbom();
  this.modalService.open(contentbom, { size: "lg" });
}


handleSelectedRowsChanged4(e, args) {
  let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number);
  
  //console.log(updateItem.pmd_line)
  if (Array.isArray(args.rows) && this.gridObj4) {
    args.rows.map((idx) => {

          
      const item = this.gridObj4.getDataItem(idx);
            updateItem.pmd_part = item.pt_part;
            updateItem.pmd_um = item.pt_um;
            updateItem.descr = item.pt_desc1;
            this.mvgridService.updateItem(updateItem);
           
          
         
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
      name: "UM",
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
  this.itemService
    .getAll()
    .subscribe((response: any) => (this.items = response.data));
}
open4(content) {
  this.prepareGrid4();
  this.modalService.open(content, { size: "lg" });
}
angularGridReady5(angularGrid: AngularGridInstance) {
  this.angularGrid5 = angularGrid;
  this.gridService5 = angularGrid.gridService;
  this.gridObj5 = (angularGrid && angularGrid.slickGrid && angularGrid.gridService) || {};

  // this.angularGrid5 = angularGrid;
  // this.gridObj5 = (angularGrid && angularGrid.slickGrid) || {};


   this.dataView5 = angularGrid.dataView;
   this.grid5= angularGrid.slickGrid;
   this.dataView5.getItemMetadata = this.updateItemMetadata(this.dataView5.getItemMetadata);
   this.grid5.invalidate();
   this.grid5.render();
}

updateItemMetadata(previousItemMetadata: any) {
  const newCssClass = 'highlight-bg';
  return (rowNumber: number) => {
    const item = this.dataView5.getItem(rowNumber);
    let meta = {
      cssClasses: ''
    };
    if (typeof previousItemMetadata === 'object') {
      meta = previousItemMetadata(rowNumber);
    }

    if (meta && item && item.etat_service) {
      const state = item.etat_service;
      if (state === "true") {
        meta.cssClasses = (meta.cssClasses || '') + ' ' + newCssClass;
      }
    }

    return meta;
  };
}






handleSelectedRowsChangedvend(e, args) {
  let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number);
  
  if (Array.isArray(args.rows) && this.gridObjvend) {
    args.rows.map((idx) => {

          
      const item = this.gridObjvend.getDataItem(idx);
            updateItem.pmd_vend = item.vd_addr;
            this.mvgridService.updateItem(updateItem);
         
    })   
  }
}

angularGridReadyvend(angularGrid: AngularGridInstance) {
  this.angularGridvend = angularGrid;
  this.gridObjvend = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGridvend() {
  this.columnDefinitionsvend = [
    {
      id: "id",
      name: "id",
      field: "id",
      sortable: true,
      minWidth: 80,
      maxWidth: 80,
    },
    {
      id: "vd_addr",
      name: "code",
      field: "vd_addr",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_name",
      name: "Fournisseur",
      field: "address.ad_name",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_phone",
      name: "Numero telephone",
      field: "address.ad_phone",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_taxable",
      name: "A Taxer",
      field: "address.ad_taxable",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_taxc",
      name: "Taxe",
      field: "address.ad_taxc",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
  ];

  this.gridOptionsvend = {
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
  this.providerService
    .getAll()
    .subscribe((response: any) => (this.providers = response.data));
}
openvend(contentvend) {
  this.prepareGridvend();
  this.modalService.open(contentvend, { size: "lg" });
}


calculatetot(){
  const controls = this.projectForm.controls 
   let tcost = 0
   for (var i = 0; i < this.mvdataset.length; i++) {
     tcost += Number(this.mvdataset[i].pmd_cost) +  Number(this.mvdataset[i].pmd_bom_cost)

    // console.log("tcost",tcost)
   //  console.log(this.mvdataset[i].pmd_cost,this.mvdataset[i].pmd_bom_cost)

}
//console.log(tcost)
controls.pm_cost.setValue(Number(tcost.toFixed(2)));
}

getSpecifications() {
  this.projectService.getSpecifications().subscribe(
    (response) => {
      if (response["data"] != null) {
        this.specifications = response["data"]
       // console.log(this.specifications)
       // console.log(response["data"])
        
      }
    },
    (error) => {
      this.layoutUtilsService.showActionNotification(
        "Erreur lors de la récupération des données du backend",
        MessageType.Create,
        10000,
        true,
        true
      );
      this.loadingSubject.next(false);
    }
  );
}

getProjectTypes() {
  this.projectService.getProjectTypes().subscribe(
    (response) => {
      if (response["data"] != null) {
        this.project_types = response["data"]
        // console.log(this.project_types)
        // console.log(response["data"])
      }
    },
    (error) => {
      this.layoutUtilsService.showActionNotification(
        "Erreur lors de la récupération des données du backend",
        MessageType.Create,
        10000,
        true,
        true
      );
      this.loadingSubject.next(false);
    }
  );
}


handleSelectedRowsChangedsite(e, args) {
  const controls = this.projectForm.controls
 
  if (Array.isArray(args.rows) && this.gridObjsite) {
      args.rows.map((idx) => {
          const item = this.gridObjsite.getDataItem(idx)
          // TODO : HERE itterate on selected field and change the value of the selected field
          
                  controls.pm_site.setValue(item.si_site || "")
          
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
  const controls = this.projectForm.controls
  this.siteService
      .getBy({si_cust: controls.pm_cust.value })
      .subscribe((response: any) => (this.datasite = response.data))
}
opensite(contentsite) {
  
  this.prepareGridsite()
  this.modalService.open(contentsite, { size: "lg" })
}



handleSelectedRowsChangeddeal(e, args) {
  const controls = this.projectForm.controls
 
  if (Array.isArray(args.rows) && this.gridObjdeal) {
      args.rows.map((idx) => {
          const item = this.gridObjdeal.getDataItem(idx)
          // TODO : HERE itterate on selected field and change the value of the selected field
          
                  controls.pm_deal.setValue(item.deal_code || "")
          
      })
  }
}
angularGridReadydeal(angularGrid: AngularGridInstance) {
  this.angularGriddeal = angularGrid
  this.gridObjdeal = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGriddeal() {
  this.columnDefinitionsdeal = [
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
        id: "deal_code",
        name: "Code",
        field: "deal_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
    },
    {
        id: "deal_desc",
        name: "Designation",
        field: "deal_desc",
        sortable: true,
        width: 200,
        filterable: true,
        type: FieldType.string,
    },
    {
      id: "deal_start_date",
      name: "Date Début",
      field: "deal_start_date",
      sortable: true,
      filterable: true,
      type: FieldType.dateIso,
     },
     {
      id: "deal_end_date",
      name: "Date Fin",
      field: "deal_end_date",
      sortable: true,
      filterable: true,
      type: FieldType.dateIso,
     },
     {
      id: "deal_amt",
      name: "Montant",
      field: "deal_amt",
      sortable: true,
      filterable: true,
      type: FieldType.float,
     },
     {
      id: "deal_inv_meth",
      name: "Méthode de Facturaion",
      field: "deal_inv_meth",
      sortable: true,
      filterable: true,
      type: FieldType.string,
     },
     {
      id: "deal_pay_meth",
      name: "Méthode de Paiement",
      field: "deal_pay_meth",
      sortable: true,
      filterable: true,
      type: FieldType.string,
     },
    
     {
      id: "deal_status",
      name: "Status",
      field: "deal_status",
      sortable: true,
      filterable: true,
      type: FieldType.string,
     },
     {
      id: "deal_open",
      name: "Ouvert/Ferme",
      field: "deal_open",
      sortable: true,
      filterable: true,
      formatter:Formatters.checkmark,
      type: FieldType.boolean,
     },
      
  ]

  this.gridOptionsdeal = {
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
  const controls = this.projectForm.controls
  this.dealService
      .getAll()
      .subscribe((response: any) => (this.datadeal = response.data))
}
opendeal(content) {
  
  this.prepareGriddeal()
  this.modalService.open(content, { size: "lg" })
}




}