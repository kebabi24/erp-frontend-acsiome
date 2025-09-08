import { Component, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { jsPDF } from "jspdf";
// Angular slickgrid
import { Column, GridOption, Formatter, Editor, Editors, AngularGridInstance, GridService, FieldType, Formatters, OnEventArgs } from "angular-slickgrid";
import { round } from "lodash";

import { BehaviorSubject, Observable } from "rxjs";
import { FormGroup, FormBuilder, Validators, NgControlStatus } from "@angular/forms";
import {  WorkCenterService,Bom,Ps, Project, ProjectService, CustomerService, ProviderService, ItemService, BomService, TaskService, PsService, SaleOrderService, Requisition, RequisitionService, SaleOrder, PurchaseOrder, DeviseService, SiteService, DealService, QualityControlService,OperationHistoryService } from "../../../../core/erp";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { LayoutUtilsService, TypesUtilsService, MessageType, HttpUtilsService } from "../../../../core/_base/crud";
import { reverseString } from "@amcharts/amcharts4/.internal/core/utils/Utils";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../../environments/environment";
import { C } from "@angular/cdk/keycodes";
const API_URL = environment.apiUrl + "/codes";

@Component({
  selector: "kt-create-project",
  templateUrl: "./create-project.component.html",
  styleUrls: ["./create-project.component.scss"],
})
export class CreateProjectComponent implements OnInit {
  projectForm: FormGroup;
  row_number;
  selected_doc_row_number;

  isExist = false;

  error = false;
  specifications: [];
  project_types: [];
  project_lists: [];
  project_reasons: [];
  customers: [];
  columnDefinitions2: Column[] = [];
  gridOptions2: GridOption = {};
  gridObj2: any;
  angularGrid2: AngularGridInstance;

  columnDefinitions3: Column[] = [];
  gridOptions3: GridOption = {};
  gridObj3: any;
  angularGrid3: AngularGridInstance;
  selectedIndexes: any[];
  docs_codess: any[];

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

  dataps: [];
  columnDefinitionsps: Column[] = [];
  gridOptionsps: GridOption = {};
  gridObjps: any;
  angularGridps: AngularGridInstance;

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
  mvdataset : any[];
  sodataset : any[];
  reqdataset = [];
  project: Project;
  gridService: GridService;
  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  saleOrder: SaleOrder;

  datasite: [];
  columnDefinitionssite: Column[] = [];
  gridOptionssite: GridOption = {};
  gridObjsite: any;
  angularGridsite: AngularGridInstance;

  datadeal: [];
  columnDefinitionsdeal: Column[] = [];
  gridOptionsdeal: GridOption = {};
  gridObjdeal: any;
  angularGriddeal: AngularGridInstance;

  date: String;
  customer: any;
  ex_rate1: any;
  ex_rate2: any;
  type: String;

  doc_triggers: any = [];
  columnDefinitions5: Column[] = [];
  gridOptions5: GridOption = {};
  gridObj5: any;
  angularGrid5: AngularGridInstance;
  dataView5: any;
  dataView3: any;
  gridService5: GridService;
  grid5: any;
  selectedTriggersIndexes: any[];

  httpOptions = this.httpUtils.getHTTPHeaders();
bom: any
product : any
psdataset: any[];
user;
  constructor(config: NgbDropdownConfig, 
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
    private workCenterService: WorkCenterService,
    private operationhistoryService:OperationHistoryService,
    private http: HttpClient) {
    config.autoClose = true;
  }

  mvGridReady(angularGrid: AngularGridInstance) {
    this.mvangularGrid = angularGrid;
    this.mvdataView = angularGrid.dataView;
    this.mvgrid = angularGrid.slickGrid;
    this.mvgridService = angularGrid.gridService;
  }
  ngOnInit(): void {
    this.user =  JSON.parse(localStorage.getItem('user'))
    this.reset();
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.getSpecifications();
    this.getProjectTypes();
    this.getProjectLists();
    this.getProjectReasons();
    this.createForm();
    this.initmvGrid();
    this.prepareTriggersGrid();
    const controls = this.projectForm.controls; 
    this.projectService
      .getAll().subscribe((response: any) => {
        if (response.data.length !=0) {controls.pm_code.setValue('BT' + String("000000"+response.data.length).slice(-6))
        
        } 
        else{controls.pm_code.setValue('BT' + String("000000").slice(-6))
        }
      });
      controls.pm_desc.enable();
          controls.pm_win_addr.enable();
          controls.pm_site.enable();
          controls.pm_amt.enable();
          controls.pm_type.enable();
          controls.pm_doc_list.enable();
          controls.pm_reason.enable();
          controls.pm_deal.enable();
  }

  //create form
  createForm() {
    this.loadingSubject.next(false);
    this.project = new Project();
    const date = new Date();
    this.projectForm = this.projectFB.group({
      pm_code: [this.project.pm_code, Validators.required],
      pm_desc: [{ value: this.project.pm_desc, disabled: !this.isExist }, Validators.required],
      pm_site: [{ value: this.project.pm_site, disabled: !this.isExist }, Validators.required],
      pm_win_addr: [{ value: this.project.pm_win_addr, disabled: !this.isExist }],
      pm_cust:[{ value: this.project.pm_cust }],
      parent:[''],
      pm_deal: [{ value: this.project.pm_deal, disabled: !this.isExist }],
      name: [{ value: "", disabled: true }],
      pm_amt: [{ value: this.project.pm_amt, disabled: !this.isExist }],
      pm_cost: [{ value: 0, disabled: true }],
      pm_ord_date: [
        {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate(),
        },
      ],
      pm_type: [{ value: this.project.pm_type, disabled: !this.isExist }],
      pm_doc_list: [{ value: this.project.pm_doc_list, disabled: !this.isExist }],
      pm_reason: [{ value: this.project.pm_reason, disabled: !this.isExist }],
    });
  }

  onChangeCode() {
    this.mvdataset = [];
    //this.sodataset = [];
    const controls = this.projectForm.controls;
    this.projectService
      .getBy({
        pm_code: controls.pm_code.value,
      })
      .subscribe((response: any) => {
        if (response.data.project) {
          this.isExist = true;
        } else {
          controls.pm_desc.enable();
          controls.pm_win_addr.enable();
          controls.pm_site.enable();
          controls.pm_amt.enable();
          controls.pm_type.enable();
          controls.pm_doc_list.enable();
          controls.pm_reason.enable();
          controls.pm_deal.enable();
        }
      });
  }
  //reste form
  reset() {
    this.isExist = false;
    this.project = new Project();
   // this.mvdataset = [];
   // this.sodataset = [];
    this.createForm();
    this.hasFormErrors = false;
  }
  // save data
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.projectForm.controls;
    /** check form */
    if (this.projectForm.invalid) {
      Object.keys(controls).forEach((controlName) => controls[controlName].markAsTouched());

      this.hasFormErrors = true;
      return;
    }

    // tslint:disable-next-line:prefer-const
    this.printpdf()
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
    _project.pm_win_addr = controls.pm_win_addr.value;
    _project.pm_cust = controls.pm_cust.value;
    _project.pm_deal = controls.pm_deal.value;
    _project.pm_amt = controls.pm_amt.value;
    _project.pm_cost = controls.pm_cost.value;
    _project.pm_type = controls.pm_type.value;
    _project.pm_doc_list = controls.pm_doc_list.value;
    _project.pm_reason = controls.pm_reason.value;
    _project.pm_ord_date = controls.pm_ord_date.value ? `${controls.pm_ord_date.value.year}/${controls.pm_ord_date.value.month}/${controls.pm_ord_date.value.day}` : null;
//     
    return _project;
  }
  /**
   * Add code
   *
   * @param _project: ProjectModel
   */
  addproject(_project: Project, details: any) {
   

    // let l = [];
    // this.selectedIndexes.forEach((index) => {
    //   l.push({
    //     code_doc: this.specifications[index]["mp_nbr"],
    //     trigger: this.specifications[index]["pjd_trigger"],
    //   });
    // });

  //  this.loadingSubject.next(true);
    this.projectService.add({ Project: _project, ProjectDetails: details }).subscribe(
      (reponse) => console.log("response", Response),
      (error) => {
        alert("Erreur, vérifier les informations");
    //    this.loadingSubject.next(false);
      },
      () => {
        // this.sodataset = [];
        // for (let data of details) {
        //   this.itemService.getByOne({ pt_part: data.pmd_part }).subscribe((resp: any) => {
        //     if (resp.data.pt_phantom) {
        //       this.type = "M";
        //     } else {
        //       this.type = null;
        //     }
        //     this.sodataset.push({
        //       sod_line: data.pmd_line,
        //       sod_part: resp.data.pt_part,
        //       sod_um: resp.data.pt_um,
        //       sod__chr01: data.pmd_task,
        //       sod__chr02: data.pmd_bom_code,
        //       sod_qty_ord: data.pmd_qty,
        //       sod_qty_ret: data.int01,
        //       sod_qty_cons: 0,
        //       sod_desc: resp.data.pt_desc1,
        //       sod_site: resp.data.pt_site,
        //       sod_loc: resp.data.pt_loc,
        //       sod_um_conv: 1,
        //       sod_type: this.type,
        //       sod_price: resp.data.pt_price,
        //       sod_disc_pct: 0,
        //       sod_tax_code: resp.data.pt_taxc,
        //       sod_taxc: resp.data.taxe.tx2_tax_pct,
        //       sod_taxable: resp.data.pt_taxable,
        //     });
        //   });
        // }
        // const controls = this.projectForm.controls;
        // const deal_code = controls.pm_deal.value;
// console.log(this.sodataset)
// if(deal_code != null) {
//   this.dealService.getByOne({ deal_code }).subscribe((res: any) => {
//     console.log(res);
//     const { data } = res;

//     if (res.data != null) {
//       let so = this.prepareSo();
//       console.log("sooooo", so, this.sodataset);
//       so.so_cr_terms = res.data.deal_pay_meth;
//       this.addSo(so, this.sodataset);
//     } else {
//       let so = this.prepareSo();
//       console.log("sooooood", so, this.sodataset);
//       this.addSo(so, this.sodataset);
//     }
//   });
// } else 
// {
//   let so = this.prepareSo();
//   //console.log("sooooood", so, this.sodataset);
//   this.loadingSubject.next(true);
//   let sop = null;
 
//   console.log(this.sodataset)
//   console.log(details)
  
//   this.saleOrderService.add({ saleOrder: so, saleOrderDetail: this.sodataset }).subscribe(
//     (reponse: any) => (sop = reponse.data),
//     (error) => {
//       alert("Erreur, vérifier les informations");
//       this.loadingSubject.next(false);
//     },
//     () => {
//       this.layoutUtilsService.showActionNotification("Ajout avec succès", MessageType.Create, 10000, true, true);
//       //this.reset();
//     }
//   );
// }
      
       // this.addReq(details);

       this.layoutUtilsService.showActionNotification(
        "Ajout avec succès",
        MessageType.Create,
        10000,
        true,
        true
      );
      this.loadingSubject.next(false);

       this.loadingSubject.next(false);
       this.reset();
       this.router.navigateByUrl("/project/create-project");
       this.reset();
      }
    );

      //  this.router.navigateByUrl("/project/create-project");
      //  this.reset();
  }

  prepareReq(): any {
    const controls = this.projectForm.controls;
    const _req = new Requisition();
    _req.rqm_category = "RQ";
    _req.rqm_nbr = controls.rqm_nbr.value;
    _req.rqm_vend = controls.rqm_vend.value;
    _req.rqm_req_date = controls.pm_ord_date.value ? `${controls.pm_ord_date.value.year}/${controls.pm_ord_date.value.month}/${controls.pm_ord_date.value.day}` : null;
    _req.rqm_need_date = controls.pm_ord_date.value ? `${controls.pm_ord_date.value.year}/${controls.pm_ord_date.value.month}/${controls.pm_ord_date.value.day}` : null;
    //_req.rqm_status=  controls.rqm_status.value
    _req.rqm_open = true;
    _req.rqm_aprv_stat = 0;
    return _req;
  }

//   prepareSo(): any {
//     const controls = this.projectForm.controls;
//     const _so = new SaleOrder();
//     const date = new Date();

//     // const deal_code = controls.pm_deal.value;

//     // this.dealService.getByOne({ deal_code }).subscribe(
//     //   (res: any) => {
//     //     console.log(res);
//     //     const { data } = res;

//     //     if(res.data.length>0) {

//     //           _so.so_category =  "SO"
//     //           _so.so_cust = controls.pm_win_addr.value;
//     //           _so.so_ord_date = controls.pm_ord_date.value
//     //             ? `${controls.pm_ord_date.value.year}/${controls.pm_ord_date.value.month}/${controls.pm_ord_date.value.day}`
//     //             : null;
//     //           _so.so_due_date = controls.pm_ord_date.value
//     //             ? `${controls.pm_ord_date.value.year}/${controls.pm_ord_date.value.month}/${controls.pm_ord_date.value.day}`
//     //             : null;

//     //           _so.so_po = controls.pm_code.value;
//     //           _so.so_amt = controls.pm_amt.value;
//     //           _so.so_cr_terms = res.data.deal_pay_meth;
//     //           _so.so_curr = this.customer.cm_curr
//     //           _so.so_taxable = this.customer.address.ad_taxable
//     //           _so.so_taxc = this.customer.address.ad_taxc
//     //           _so.so_ex_rate = this.ex_rate1
//     //           _so.so_ex_rate2 = this.ex_rate2

//     //     }
//     //     else {
// console.log(controls.pm_win_addr.value)
//     _so.so_category = "SO";
//     _so.so_cust = controls.pm_win_addr.value;
//     _so.so_ord_date = controls.pm_ord_date.value ? `${controls.pm_ord_date.value.year}/${controls.pm_ord_date.value.month}/${controls.pm_ord_date.value.day}` : null;
//     _so.so_due_date = controls.pm_ord_date.value ? `${controls.pm_ord_date.value.year}/${controls.pm_ord_date.value.month}/${controls.pm_ord_date.value.day}` : null;
//     _so.so_po = controls.pm_code.value;
//     _so.so_amt = controls.pm_amt.value;
//     _so.so_cr_terms = this.customer.cm_cr_terms;
//     _so.so_curr = this.customer.cm_curr;
//     _so.so_taxable = this.customer.address.ad_taxable;
//     _so.so_taxc = this.customer.address.ad_taxc;
//     _so.so_ex_rate = this.ex_rate1;
//     _so.so_ex_rate2 = this.ex_rate2;

//     // }

//     // })

//     return _so;
//   }
  /**
   * Add po
   */
   // @param _so: so
   
  // addSo(_so: any, details: any) {
  //   this.loadingSubject.next(true);
  //   let so = null;
   
  //   console.log(this.sodataset)
  //   console.log(details)
    
  //   this.saleOrderService.add({ /*saleOrder: _so, saleOrderDetail:*/ details }).subscribe(
  //     (reponse: any) => (so = reponse.data),
  //     (error) => {
  //       alert("Erreur, vérifier les informations");
  //       this.loadingSubject.next(false);
  //     },
  //     () => {
  //       this.layoutUtilsService.showActionNotification("Ajout avec succès", MessageType.Create, 10000, true, true);
  //       this.reset();
  //     }
  //   );
  // }

  addReq(detail: any) {
    const controls = this.projectForm.controls;
    for (let data of detail) {
      if (data.pmd_vend != "" && data.pmd_vend != null) {
        this.reqdataset = [];
        const _req = new Requisition();
        _req.rqm_category = "RQ";
        _req.rqm_vend = data.pmd_vend;
        _req.rqm_req_date = controls.pm_ord_date.value ? `${controls.pm_ord_date.value.year}/${controls.pm_ord_date.value.month}/${controls.pm_ord_date.value.day}` : null;
        _req.rqm_need_date = controls.pm_ord_date.value ? `${controls.pm_ord_date.value.year}/${controls.pm_ord_date.value.month}/${controls.pm_ord_date.value.day}` : null;
        //_req.rqm_status=  controls.rqm_status.value
        _req.rqm_open = true;
        _req.rqm_aprv_stat = 0;

        this.reqdataset.push({
          rqd_line: data.pmd_line,
          rqd_part: data.pmd_part,
          rqd_um: data.pmd_um,

          rqd_req_qty: 1,
        });

        this.loadingSubject.next(true);
        this.requisitonService.add({ requisition: _req, requisitionDetail: this.reqdataset }).subscribe(
          (reponse) => console.log("response", Response),
          (error) => {
            alert("Erreur, vérifier les informations");
            this.loadingSubject.next(false);
          },
          () => {
            this.layoutUtilsService.showActionNotification("Ajout avec succès", MessageType.Create, 10000, true, true);
            this.loadingSubject.next(false);
            //this.router.navigateByUrl("/")
          }
        );
      }
    }
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
          let element: HTMLElement = document.getElementById("openTasksGrid") as HTMLElement;
          element.click();
        },
      },
      {
        id: "desc",
        name: "Designation",
        field: "desc",
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
          params: { minDecimal: 2 },
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
          let element: HTMLElement = document.getElementById("openBomsGrid") as HTMLElement;
          element.click();
        },
      },
      {
        id: "mvidp",
        name:"composants",
        field: "cmvidp",
        excludeFromHeaderMenu: true,
        formatter: Formatters.editIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          this.row_number = args.row;
          this.bom = args.dataContext.pmd_bom_code
          let element: HTMLElement = document.getElementById("openPssGrid") as HTMLElement;
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
          var days = Number(1) + Number((new Date(args.dataContext.pmd_end).getTime() - new Date(args.dataContext.pmd_start).getTime()) / (1000 * 3600 * 24));
          if (days < 0) {
            days = 0;
          }
          console.log(args.dataContext.pmd_end, args.dataContext.pmd_start, days);
          this.mvgridService.updateItemById(args.dataContext.id, { ...args.dataContext, int01: days });
 
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
          var days = Number(1) + Number((new Date(args.dataContext.pmd_end).getTime() - new Date(args.dataContext.pmd_start).getTime()) / (1000 * 3600 * 24));
          if (days < 0) {
            days = 0;
          }
          console.log(args.dataContext.pmd_end, args.dataContext.pmd_start, days);
          this.mvgridService.updateItemById(args.dataContext.id, { ...args.dataContext, int01: days });
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
          let element: HTMLElement = document.getElementById("openItemsGrid") as HTMLElement;
          element.click();
        },
      },
      {
        id: "descr",
        name: "Designation",
        field: "descr",
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
          let element: HTMLElement = document.getElementById("openVendsGrid") as HTMLElement;
          element.click();
        },
      },
    ];

    this.mvgridOptions = {
      asyncEditorLoading: false,
      editable: true,
      autoHeight: true,
      enableAutoResize: true,
      autoCommitEdit: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableRowSelection: true,
    };

    this.mvdataset = [];
  }
  addNewItem() {
    const newId = this.mvdataset.length + 1;

    const newItem = {
      id: newId,
      pmd_line: newId,
      pmd_task: "",
      desc: "",
      cout: 0,
      pmd_bom: "",
      pmd_bom_cost: 0,
      pmd_start: null,
      pmd_end: null,
      pmd_part: "",
      descr: "",
      days:0,
      pmd_vend: "",
    };
    this.mvgridService.addItem(newItem, { position: "bottom" });
  }
  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  onChangeCust() {
    const controls = this.projectForm.controls; // chof le champs hada wesh men form rah
    const cm_addr = controls.pm_win_addr.value;

    this.customerService.getBy({ cm_addr }).subscribe(
      (res: any) => {
        console.log(res);
        const { data } = res;

        if (!data) {
          this.layoutUtilsService.showActionNotification("ce client n'existe pas!", MessageType.Create, 10000, true, true);
          this.error = true;
          document.getElementById("cust").focus();
        } else {
          this.error = false;
          controls.pm_win_addr.setValue(data.cm_addr || "");
          controls.name.setValue(data.address.ad_name || "");
          this.customerService.getBy({ cm_addr: controls.pm_win_addr.value }).subscribe((res: any) => {
            console.log(res);
            const { data } = res;

            if (data) {
              this.customer = data;

              if (data.cm_curr == "DA") {
                this.ex_rate1 = 1;
                this.ex_rate2 = 1;
              } else {
                this.deviseService.getExRate({ exr_curr1: data.cm_curr, exr_curr2: "DA", date: this.date }).subscribe((res: any) => {
                  this.ex_rate1 = res.data.exr_rate;
                  this.ex_rate2 = res.data.exr_rate2;
                });
              }
            }
          });
        }
      },
      (error) => console.log(error)
    );
  }

  onChangeDeal() {
    const controls = this.projectForm.controls; // chof le champs hada wesh men form rah
    const deal_code = controls.pm_deal.value;

    this.operationhistoryService.getBy({op_wo_nbr: deal_code }).subscribe(
      (res: any) => {
        console.log(res);
        const { data } = res;

        if (!data) {
          this.layoutUtilsService.showActionNotification("cette demande n'existe pas!", MessageType.Create, 10000, true, true);
          this.error = true;
          document.getElementById("deal").focus();
          controls.pm_deal.setValue(null);
        } else {
          this.error = false;
          controls.pm_deal.setValue(data.op_wo_nbr || "");
          
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

        controls.pm_win_addr.setValue(item.wc_mch || "");
        controls.pm_cust.setValue(item.wc_desc||"");
        controls.parent.setValue(item.wc_user1||"")
        controls.name.setValue(item.wc_wkctr || "");
        controls.pm_site.setValue(item.wc__chr01)
        
      });
    }
  }

  handleSelectedRowsChanged3(e, args) {
    this.selectedIndexes = [];
    this.selectedIndexes = args.rows;
  }

  handleSelectedRowsChanged5(e, args) {
    this.selectedTriggersIndexes = [];
    this.selectedTriggersIndexes = args.rows;
    // const selected_trigger_code = this.gridService5.getDataItemByRowIndex(this.selectedTriggersIndexes[0]).code_value

    (this.specifications[this.selected_doc_row_number] as any).pjd_trigger = this.gridService5.getDataItemByRowIndex(this.selectedTriggersIndexes[0]).code_value;
    // this.specifications[this.selected_doc_row_number].pjd_trigger = selected_trigger_code

    this.dataView3.setItems(this.specifications);
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
      editable: true,
      autoEdit: false,
      autoHeight: true,
      frozenColumn: 0,
      frozenBottom: true,
      enableRowSelection: true,
      enableCheckboxSelector: true,
      multiSelect: true,
      rowSelectionOptions: { selectActiveRow: false },
    };

    // fill the dataset with your data
    this.projectService.getSpecifications().subscribe((response: any) => (this.specifications = response.data));
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
      rowSelectionOptions: { selectActiveRow: false },
    };

    // fill the dataset with your data
    this.qualityControlService.findDocumentTriggers().subscribe((response: any) => {
      console.log(response.data);
      this.doc_triggers = response.data;
    });
  }

  openTriggerGrid(content) {
    this.prepareTriggersGrid();
    this.modalService.open(content, { size: "lg" });
  }

  prepareGrid2() { 
    this.columnDefinitions2 = [
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
        id: "wc_wkctr",
        name: "Centre Charge",
        field: "wc_wkctr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "wc_mch",
        name: "Machine",
        field: "wc_mch",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "wc_user1",
        name: "Organe",
        field: "wc_user1",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "wc_desc",
        name: "Designation",
        field: "wc_desc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "wc__chr01",
        name: "Site",
        field: "wc__chr01",
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
    this.workCenterService
          .getByparent({})
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
            tk_code: item.tk_code,
          })
          .subscribe((response: any) => {
            console.log(response.data, response.data.details.length);
            updateItem.pmd_task = item.tk_code;
            updateItem.desc = item.tk_desc;
            updateItem.pmd_um = item.tk_um;
            updateItem.pmd_qty = Number(response.data.details.length);
            updateItem.pmd_price = item.tk_price * Number(response.data.details.length);
            this.taskService
              .getCost({
                tk_code: item.tk_code,
              })
              .subscribe((response: any) => {
                updateItem.pmd_cost = Number(response.data);

                this.mvgridService.updateItem(updateItem);
                this.calculatetot();
              });
          });
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
    this.taskService.getAll().subscribe((response: any) => (this.datatask = response.data));
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
            ps_parent: item.bom_parent,
          })
          .subscribe((response: any) => {
            console.log(response.data, "here");
            updateItem.pmd_bom_code = item.bom_parent;

            updateItem.pmd_bom_cost = response.data;
            this.mvgridService.updateItem(updateItem);
            this.calculatetot();
          });
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
    this.bomService.getAll().subscribe((response: any) => (this.databom = response.data));
  }
  openbom(contentbom) {
    this.prepareGridbom();
    this.modalService.open(contentbom, { size: "lg" });
  }

  handleSelectedRowsChanged4(e, args) {
    let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number);

    console.log(updateItem.pmd_line);
    if (Array.isArray(args.rows) && this.gridObj4) {
      args.rows.map((idx) => {
        const item = this.gridObj4.getDataItem(idx);
        updateItem.pmd_part = item.pt_part;
        updateItem.pmd_um = item.pt_um;
        updateItem.descr = item.pt_desc1;
        this.mvgridService.updateItem(updateItem);
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
    this.itemService.getAll().subscribe((response: any) => (this.items = response.data));
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
    this.grid5 = angularGrid.slickGrid;
    this.dataView5.getItemMetadata = this.updateItemMetadata(this.dataView5.getItemMetadata);
    this.grid5.invalidate();
    this.grid5.render();
  }

  updateItemMetadata(previousItemMetadata: any) {
    const newCssClass = "highlight-bg";
    return (rowNumber: number) => {
      const item = this.dataView5.getItem(rowNumber);
      let meta = {
        cssClasses: "",
      };
      if (typeof previousItemMetadata === "object") {
        meta = previousItemMetadata(rowNumber);
      }

      if (meta && item && item.etat_service) {
        const state = item.etat_service;
        if (state === "true") {
          meta.cssClasses = (meta.cssClasses || "") + " " + newCssClass;
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
      });
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
    this.providerService.getAll().subscribe((response: any) => (this.providers = response.data));
  }
  openvend(contentvend) {
    this.prepareGridvend();
    this.modalService.open(contentvend, { size: "lg" });
  }

  calculatetot() {
    const controls = this.projectForm.controls;
    let tcost = 0;
    for (var i = 0; i < this.mvdataset.length; i++) {
      tcost += Number(this.mvdataset[i].pmd_cost) + Number(this.mvdataset[i].pmd_bom_cost);

      console.log("tcost", tcost);
      console.log(this.mvdataset[i].pmd_cost, this.mvdataset[i].pmd_bom_cost);
    }
    console.log(tcost);
    controls.pm_cost.setValue(Number(tcost.toFixed(2)));
  }

  getSpecifications() {
    this.projectService.getSpecifications().subscribe(
      (response) => {
        if (response["data"] != null) {
          this.specifications = response["data"];
          console.log(this.specifications);
          console.log(response["data"]);
        }
      },
      (error) => {
        this.layoutUtilsService.showActionNotification("Erreur lors de la récupération des données du backend", MessageType.Create, 10000, true, true);
        this.loadingSubject.next(false);
      }
    );
  }

  getProjectTypes() {
    this.projectService.getProjectTypes().subscribe(
      (response) => {
        if (response["data"] != null) {
          this.project_types = response["data"];
          console.log(this.project_types);
          console.log(response["data"]);
        }
      },
      (error) => {
        this.layoutUtilsService.showActionNotification("Erreur lors de la récupération des données du backend", MessageType.Create, 10000, true, true);
        this.loadingSubject.next(false);
      }
    );
  }
  getProjectLists() {
    this.projectService.getProjectLists().subscribe(
      (response) => {
        if (response["data"] != null) {
          this.project_lists = response["data"];
          console.log(this.project_lists);
          
        }
      },
      (error) => {
        this.layoutUtilsService.showActionNotification("Erreur lors de la récupération des données du backend", MessageType.Create, 10000, true, true);
        this.loadingSubject.next(false);
      }
    );
  }
  getProjectReasons() {
    this.projectService.getProjectReasons().subscribe(
      (response) => {
        if (response["data"] != null) {
          this.project_reasons = response["data"];
          console.log(this.project_reasons);
          console.log(response["data"]);
        }
      },
      (error) => {
        this.layoutUtilsService.showActionNotification("Erreur lors de la récupération des données du backend", MessageType.Create, 10000, true, true);
        this.loadingSubject.next(false);
      }
    );
  }

  handleSelectedRowsChangedsite(e, args) {
    const controls = this.projectForm.controls;

    if (Array.isArray(args.rows) && this.gridObjsite) {
      args.rows.map((idx) => {
        const item = this.gridObjsite.getDataItem(idx);
        // TODO : HERE itterate on selected field and change the value of the selected field

        controls.pm_site.setValue(item.si_site || "");
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
      checkboxSelector: {},
      multiSelect: false,
      rowSelectionOptions: {
        selectActiveRow: true,
      },
    };

    // fill the dataset with your data
    const controls = this.projectForm.controls;
    this.siteService.getBy({ si_cust: controls.pm_win_addr.value }).subscribe((response: any) => (this.datasite = response.data));
  }
  opensite(contentsite) {
    this.prepareGridsite();
    this.modalService.open(contentsite, { size: "lg" });
  }

  handleSelectedRowsChangeddeal(e, args) {
    const controls = this.projectForm.controls;

    if (Array.isArray(args.rows) && this.gridObjdeal) {
      args.rows.map((idx) => {
        const item = this.gridObjdeal.getDataItem(idx);
        // TODO : HERE itterate on selected field and change the value of the selected field

        controls.pm_deal.setValue(item.op_wo_nbr || "");
        controls.pm_win_addr.setValue(item.op_mch|| "");
        controls.pm_cust.setValue(item.op_user1|| "");
        controls.parent.setValue(item.op_user2|| "");
        controls.name.setValue(item.op_wkctr|| "");
        controls.pm_site.setValue(item.op_site|| "")
      });
    }
  }
  angularGridReadydeal(angularGrid: AngularGridInstance) {
    this.angularGriddeal = angularGrid;
    this.gridObjdeal = (angularGrid && angularGrid.slickGrid) || {};
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
        id: "op_wo_nbr",
        name: "Demande",
        field: "op_wo_nbr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "op_wkctr",
        name: "Ligne",
        field: "op_wkctr",
        sortable: true,
        width: 200,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "op_mch",
        name: "Equipement",
        field: "op_mch",
        sortable: true,
        filterable: true,
        type: FieldType.dateIso,
      },
      {
        id: "op_rsn_down",
        name: "Cause",
        field: "op_rsn_down",
        sortable: true,
        filterable: true,
        type: FieldType.dateIso,
      },
      {
        id: "op_date",
        name: "Date",
        field: "op_date",
        sortable: true,
        filterable: true,
        type: FieldType.dateIso,
      },
      
    ];

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
      checkboxSelector: {},
      multiSelect: false,
      rowSelectionOptions: {
        selectActiveRow: true,
      },
    };

    // fill the dataset with your data
    const controls = this.projectForm.controls;
    this.operationhistoryService.getBy({op_type:'down',op_rsn:null}).subscribe((response: any) => (this.datadeal = response.data));
  }
  opendeal(content) {
    this.prepareGriddeal();
    this.modalService.open(content, { size: "lg" });
  }


  handleSelectedRowsChangedps(e, args) {
    this.product = []
    const controls = this.projectForm.controls
    let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObjps) {
      args.rows.map((idx) => {
        const item = this.gridObjps.getDataItem(idx);

        updateItem.pmd_bom_code = item.ps_parent + controls.pm_code.value;

        this.mvgridService.updateItem(updateItem);

        this.product.push(item.ps_comp)
      
       
      });
      
    }
  }
  angularGridReadyps(angularGrid: AngularGridInstance) {
    this.angularGridps = angularGrid;
    this.gridObjps = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridps() {
    this.columnDefinitionsps = [
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
        id: "ps_parent",
        name: "Code",
        field: "ps_parent",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ps_comp",
        name: "Composant",
        field: "ps_comp",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ps_desc",
        name: "Designation",
        field: "item.pt_desc1",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptionsps = {
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
      multiSelect: true,
      rowSelectionOptions: {
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: false,
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
    let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number);
   
    
    // fill the dataset with your data
    this.psService.getBy({ps_parent:this.bom}).subscribe((response: any) => (this.dataps = response.data));
  }
  openps(contentps) {
    this.prepareGridps();
    this.modalService.open(contentps, { size: "lg" });
  }

  createPs(){
     console.log(this.product)
     const controls = this.projectForm.controls

       const _bom = new Bom()
      _bom.bom_parent = this.bom + controls.pm_code.value
      _bom.bom_desc = this.bom +  controls.pm_code.value
      _bom.bom_batch = 1

        this.bomService.add(_bom).subscribe(
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

              this.psdataset = []
              for (let pr of this.product) {
                this.psdataset.push({ps_comp: pr,ps_qty_per:1})
              }
              const detail = this.psdataset
              const it = new Ps();
                it.ps_parent = this.bom + controls.pm_code.value
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
                 
                let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number);
                this.psService
                .getPrice({
                  ps_parent: this.bom + controls.pm_code.value,
                })
                .subscribe((response: any) => {
                  console.log(response.data, "here");
                 // updateItem.pmd_bom_code = item.bom_parent;
      
                  updateItem.pmd_bom_cost = response.data;
                  this.mvgridService.updateItem(updateItem);
                  this.calculatetot();
                });
                  }
                );
                
          }
          
      )
      this.modalService.dismissAll()
  }
  printpdf() {
            const controls = this.projectForm.controls;
           
            var doc = new jsPDF({
              orientation: 'landscape',
              unit: 'mm',
              //format: [100,150]
              })
              let initialY = 25;
              doc.setLineWidth(0.2);
            
            var img = new Image();
             img.src = "./assets/media/logos/companyentete.png";
             doc.addImage(img, "png", 5, 5, 280, 30);
            doc.setFontSize(8);
    //      if(this.exist == true){
    //   doc.text(this.docs[0].code_value, 160, 17); 
    //   doc.setFontSize(10);
    //   doc.text(this.docs[0].code_cmmt, 55, 22);
    //   doc.setFontSize(8);
    //   doc.text(this.docs[0].code_desc, 165, 12);
    //   doc.text(this.docs[0].chr01, 22, 27);
    //   doc.text(String(1), 22, 32);
    //   doc.text(this.docs[0].dec01, 170, 32);
    //   doc.text(this.docs[0].date01, 180, 22);
    //   doc.text(this.docs[0].date02, 180, 27);
    // }
          
            const date = controls.pm_ord_date.value
              ? `${controls.pm_ord_date.value.year}/${controls.pm_ord_date.value.month}/${controls.pm_ord_date.value.day}`
              : null
  
            
            doc.setFontSize(16);
      
            
            doc.setFont("Times-Roman");
            doc.text("Ordre de Travail N° : " + controls.pm_code.value, 100, 40);
            doc.line(5,45,280,45)
            doc.line(5,45,5,185)
            doc.line(280,45,280,185)
            doc.setFontSize(10);
            doc.text("Date Debut des travaux : " + date , 10, 49);
            doc.line(5,50,280,50)
            doc.text("Date Fin des travaux : "  , 10, 54);
            doc.line(5,55,280,55)
            doc.text("Unité d'intervention : " + controls.pm_win_addr.value + ' ' + controls.pm_cust.value + ' - ' + controls.parent.value + ' - ' + controls.name.value, 10, 59);
            doc.line(180,55,180,60)
            doc.text("Compteur : " , 185, 59);
            doc.line(230,55,230,60)
            doc.text("Demande N°: " + controls.pm_deal.value, 235, 59);
            doc.line(5,60,280,60)
            doc.text("I- OBJET : " , 120, 64);
            doc.line(5,65,280,65)
            doc.text(controls.pm_desc.value, 10, 69);
            doc.line(5,80,280,80)
            doc.text("Type de travaux :   " + controls.pm_type.value, 10, 84);
            doc.line(5,85,280,85)
            doc.text("Famille de travaux :   " + controls.pm_doc_list.value , 10, 89);
            doc.line(5,90,280,90)
            doc.text("Nature de travaux :   " + controls.pm_reason.value , 10, 94);
            doc.line(5,95,280,95)
            doc.text("II- RESSOURCES INTERNES : " , 120, 99);
            doc.line(5,100,280,100)
            doc.text("Matricule : " , 10, 104);
            doc.line(40,100,40,130)
            doc.text("Nom & Prénom : ", 45, 104);
            doc.line(120,100,120,130)
            doc.text("Debut prévue : ", 125, 104);
            doc.line(160,100,160,130)
            doc.text("Fin prévue : " , 165, 104);
            doc.line(200,100,200,130)
            doc.text("debut réelle : " , 205, 104);
            doc.line(240,100,240,130)
            doc.text("Fin réelle : " , 245, 104);
            doc.line(5,105,280,105)
            doc.line(5,130,280,130)
            doc.text("III- COMPTE RENDU" , 120, 134);
            doc.line(5,135,280,135)
            doc.line(5,160,280,160)
            doc.text("IV- PIECES DE RECHANGES" , 120, 164);
            doc.line(5,165,280,165)
            doc.text("Réference" , 10, 169);
            doc.line(45,165,45,185)
            doc.text("Désignation" , 47, 169);
            doc.line(215,165,215,185)
            doc.text("Quantité" , 217, 169);
            doc.line(5,170,280,170)

            doc.line(5,185,280,185)  
            doc.text("Responsable maintenance",15,190);
          doc.text("Demandeur d'intervention",200,190);
      
            doc.setFontSize(9);
      
      var i = 105
      
      i = i + 5;
      var blob = doc.output("blob");
      window.open(URL.createObjectURL(blob));   
    }
}
