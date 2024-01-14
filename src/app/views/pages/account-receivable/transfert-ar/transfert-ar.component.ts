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
  PurchaseOrderService,
  SequenceService,
  UsersService,
  BankService,
  TaxeService,
  DeviseService,
  CodeService,
  SiteService,
  
  } from "../../../../core/erp";
declare var printTransfert: any;
@Component({
  selector: 'kt-transfert-ar',
  templateUrl: './transfert-ar.component.html',
  styleUrls: ['./transfert-ar.component.scss']
})
export class TransfertArComponent implements OnInit {

  rvForm: FormGroup;

  hasFormErrors = false;
  
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  user;
  currentamt: any = 0;
  date: any;
  error = false;
  sites: any[] = [];
  domain : any
  role_code : any
  roles: any[] = []
  serivce_code : any
  services: any[] = []
  user_mobile:any
  banks: [];
  columnDefinitionsbank: Column[] = [];
  gridOptionsbank: GridOption = {};
  gridObjbank: any;
  angularGridbank: AngularGridInstance;
  constructor(
    config: NgbDropdownConfig,
    private rvFB: FormBuilder,
    private totFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private layoutUtilsService: LayoutUtilsService,
    private userService: UsersService,
    private sequenceService: SequenceService,
    private bankService: BankService,
    private codeService: CodeService,
    private deviseService: DeviseService,
    private siteService: SiteService,
    private taxService: TaxeService,
    

  ) {
    
  }

  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.user = JSON.parse(localStorage.getItem("user"));
    this.domain = JSON.parse(localStorage.getItem("domain"));
    
   
    this.createForm();
  }
  

  createForm() {
    this.loadingSubject.next(false);

    const date = new Date();

    this.rvForm = this.rvFB.group({
      // po_category: [{value: this.purchaseOrder.po_category, disabled:true}, Validators.required],
      bank_code : ["", Validators.required],
      bank_code_dest:  ["", Validators.required],
      calc_date: [
        {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate(),
        },
      ],
      
    

      montant_rl: [
        { value: 0, disabled: true },
        Validators.required,
      ],
      montant_tr: [0, Validators.required],
      
    });

   
  }

  reset() {
    this.createForm();
    
    this.services = []
    this.hasFormErrors = false;
  }
  onChangeAmt() {

    const controls  = this.rvForm.controls
    
    if (Number(controls.montant_tr.value) > Number(controls.montant_rl.value) ) {
      alert(" montant Transferé doit etre inferieur au montant de la caisse")
      controls.montant_tr.setValue(0)
      document.getElementById("montant_tr").focus();
    }
    
  }

  onSubmit() {
    this.hasFormErrors = false
    const controls_ = this.rvForm.controls
    if (this.rvForm.invalid) {
      Object.keys(controls_).forEach((controlName) =>
          controls[controlName].markAsTouched()
      )

      this.hasFormErrors = true
      return
  }

  if (controls_.montant_tr.value == 0 ) {
   
    this.hasFormErrors = true
    return
}
    this.loadingSubject.next(true);

    const controls = this.rvForm.controls;
    const effdate = controls.calc_date.value
    ? `${controls.calc_date.value.year}/${controls.calc_date.value.month}/${controls.calc_date.value.day}`
    : null;
    console.log(controls.montant_rl.value);
    console.log(controls.montant_tr.value);
    let index = this.services.findIndex((service)=>{return service.role_code === controls.role_code.value})
    console.log(this.services[index])
    this.bankService.addBkhTransfertC({
        date: new Date(),
        effdate: effdate,
        addr:  this.user.usrd_code,
        bank: controls.bank_code.value,
        bank_dest: controls.bank_code_dest.value,
       
        amt_rl: controls.montant_rl.value,
        amt_tr: controls.montant_tr.value,
        site: this.user.usrd_site,

      })
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
          //console.log(this.provider, po, this.dataset);
          this.reset()
          this.router.navigateByUrl("/account-receivable/transfert-ar");

          })
        }

        handleSelectedRowsChangedbank(e, args) {
          const controls = this.rvForm.controls;
          if (Array.isArray(args.rows) && this.gridObjbank) {
            args.rows.map((idx) => {
              const item = this.gridObjbank.getDataItem(idx);
              controls.bank_code.setValue(item.bk_code || "");
              controls.montant_rl.setValue(item.bk_balance)     
            });
          }
        }
        handleSelectedRowsChangedbankd(e, args) {
          const controls = this.rvForm.controls;
          if (Array.isArray(args.rows) && this.gridObjbank) {
            args.rows.map((idx) => {
              const item = this.gridObjbank.getDataItem(idx);
              controls.bank_code_dest.setValue(item.bk_code || "");
             
                    
            });
          }
        }
        angularGridReadybank(angularGrid: AngularGridInstance) {
          this.angularGridbank = angularGrid;
          this.gridObjbank = (angularGrid && angularGrid.slickGrid) || {};
        }
        
        prepareGridbank() {
          this.columnDefinitionsbank = [
            {
              id: "id",
              name: "id",
              field: "id",
              sortable: true,
              minWidth: 80,
              maxWidth: 80,
            },
            {
              id: "bk_code",
              name: "code",
              field: "bk_code",
              sortable: true,
              filterable: true,
              type: FieldType.string,
            },
            {
              id: "address.ad_name",
              name: "Designation",
              field: "address.ad_name",
              sortable: true,
              filterable: true,
              type: FieldType.string,
            },
            {
              id: "bk_curr",
              name: "Devise",
              field: "bk_curr",
              sortable: true,
              filterable: true,
              type: FieldType.string,
            },
            {
              id: "bk_entity",
              name: "Entité",
              field: "bk_entity",
              sortable: true,
              filterable: true,
              type: FieldType.boolean,
            },
          ];
        
          this.gridOptionsbank = {
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
          this.bankService
            .getByAll({bk_user1:this.user.usrd_code})
            .subscribe((response: any) => {
              console.log(response.data)
              this.banks = response.data});
        }
        openbank(content) {
          this.prepareGridbank();
          this.modalService.open(content, { size: "lg" });
        }
  
}