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

import { Config, ConfigService, UsersService} from "../../../../core/erp"

@Component({
  selector: 'kt-maint-config',
  templateUrl: './maint-config.component.html',
  styleUrls: ['./maint-config.component.scss']
})
export class MaintConfigComponent implements OnInit {

  conf: any
  config: Config
  cfgForm: FormGroup
  hasFormErrors = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  isExist = false
  pm_module = false
  pay_multiple = false  
  crm= false
  accounting=false
  declared = false
  error = false;

  emps: [];
  columnDefinitionsemp: Column[] = [];
  gridOptionsemp: GridOption = {};
  gridObjemp: any;
  angularGridemp: AngularGridInstance;
  dataViewemp: any;
  gridServiceemp: GridService;
  selectedIndexes: any[];
  selectedIndexes2: any[];
  cfg_po_threshold: any
  cfg_threshold_user: any
  user1:any
  constructor(
      configs: NgbDropdownConfig,
      private cfgFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private modalService: NgbModal,
      private configService: ConfigService,
      private userService: UsersService
  ) {
      configs.autoClose = true
      
    
  }

  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable()
    this.loadingSubject.next(true)
    
          this.createForm()
          this.loadingSubject.next(false)
    
    
    
  }
  //create form
  createForm() {
    this.loadingSubject.next(false)
    console.log(this.pm_module)
    this.cfgForm = this.cfgFB.group({
      
        cfg_pm_module: [this.pm_module],
        cfg_pay_multiple: [this.pay_multiple],
        cfg_crm: [this.crm],
        cfg_accounting: [this.accounting],
        cfg_declared : [this.declared],
        cfg_po_threshold: [this.cfg_po_threshold],
        cfg_threshold_user: [this.cfg_threshold_user]
       
    })
    let id = 1
        this.configService.getOne(id).subscribe((response: any)=>{
          console.log(response.data)
          this.conf = response.data
          if (this.conf == null) {
           
            this.pm_module = false
            this.pay_multiple = false
            this.crm = false
            this.accounting = false
            this.declared = false
            this.cfg_po_threshold = 0
            this.cfg_threshold_user=null
          }
          else {
        //    console.log(this.conf.cfg_pm_module)
            this.pm_module = this.conf.cfg_pm_module
            this.pay_multiple = this.conf.cfg_pay_multiple
             this.crm = this.conf.cfg_crm
             this.accounting = this.conf.cfg_accounting
             this.declared = this.conf.cfg_declared
             this.cfg_po_threshold = this.conf.cfg_po_threshold
            this.cfg_threshold_user=this.conf.cfg_threshold_user
          }
         
    
        
     
      const controls = this.cfgForm.controls
      console.log("jjjjjj")
      console.log(this.pay_multiple)
      controls.cfg_pm_module.setValue(this.pm_module);
      controls.cfg_pay_multiple.setValue(this.pay_multiple);
      controls.cfg_crm.setValue(this.crm);
      controls.cfg_accounting.setValue(this.accounting);
      controls.cfg_declared.setValue(this.declared);
      controls.cfg_po_threshold.setValue(this.cfg_po_threshold);
      controls.cfg_threshold_user.setValue(this.cfg_threshold_user);
    })
  }

  
  //reste form
  reset() {
      this.config = new Config()
      this.createForm()
      this.hasFormErrors = false
  }
  // save data
  onSubmit() {
      this.hasFormErrors = false
      
      /** check form */
     
      // tslint:disable-next-line:prefer-const
      let config = this.prepareConfig()
     // console.log("here", config)
      this.addConfig(config)
  }
  /**
   * Returns object for saving
   */
  prepareConfig(): Config {
      
      const controls = this.cfgForm.controls
      const _config = new Config()
      console.log(controls.cfg_pm_module.value)
      _config.cfg_pm_module = controls.cfg_pm_module.value
      _config.cfg_pay_multiple = controls.cfg_pay_multiple.value
      _config.cfg_crm = controls.cfg_crm.value
      _config.cfg_accounting = controls.cfg_accounting.value
      _config.cfg_declared = controls.cfg_declared.value

      _config.cfg_po_threshold = controls.cfg_po_threshold.value
      _config.cfg_threshold_user = controls.cfg_threshold_user.value

      console.log(controls.cfg_pm_module.value)
      //console.log("hnahnahna",_config)
      return _config
  }
  /**
   * Add code
   *
   * @param _code: CodeModel
   */
  addConfig(_config: Config) {
      this.loadingSubject.next(true)
      this.configService.update(1, _config).subscribe(
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
            this.router.navigateByUrl("/config/maint-config")
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
  



  
 angularGridReadyemp(angularGrid: AngularGridInstance) {
    this.angularGridemp = angularGrid;
    this.gridObjemp = (angularGrid && angularGrid.slickGrid) || {};

    this.gridServiceemp = angularGrid.gridService;
    this.dataViewemp = angularGrid.dataView;
  }

  // GRID IN
  prepareGridemp() {
    this.columnDefinitionsemp = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "usrd_code",
        name: "Code Utilisateur",
        field: "usrd_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "usrd_name",
        name: "Nom Utilisateur",
        field: "usrd_name",
        sortable: true,
        width: 80,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "usrd_profile",
        name: "Profil",
        field: "usrd_profile",
        sortable: true,
        width: 80,
        filterable: true,
        type: FieldType.string,
      },
      
    ];

    this.gridOptionsemp = {
      enableSorting: true,
      enableCellNavigation: true,
      enableExcelCopyBuffer: true,
      enableFiltering: true,
      autoEdit: false,
      autoHeight: false,
      // frozenColumn: 0,
      // frozenBottom: true,
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
      presets: {
        sorters: [{ columnId: "id", direction: "ASC" }],
        rowSelection: {
          // gridRowIndexes: [2],           // the row position of what you see on the screen (UI)
          gridRowIndexes: this.selectedIndexes2, // (recommended) select by your data object IDs
          //dataContextIds
        },
      },
    };

    // fill the dataset with your data
    this.userService.getAllUsers().subscribe((response: any) => (this.emps = response.data));
  }

  handleSelectedRowsChangedemp(e, args) {
    this.selectedIndexes = [];
    this.selectedIndexes = args.rows;
  }
  openemp(content) {
    this.prepareGridemp();
    this.modalService.open(content, { size: "lg" });
  }

  addit() {
    // this.itinerary.push({})
    const controls = this.cfgForm.controls;
    var l: String;
    l = "";
    console.log(l.length);
    this.selectedIndexes.forEach((index) => {
      if (index == 0) {
        l = this.emps[index]["usrd_code"];
      } else {
        l = l + "," + this.emps[index]["usrd_code"];
      }
      //id: index,
    });

    console.log(l);
    controls.cfg_threshold_user.setValue(l);
    this.user1 = l;
  }
}

