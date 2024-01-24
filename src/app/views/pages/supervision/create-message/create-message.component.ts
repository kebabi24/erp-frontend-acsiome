import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbDropdownConfig, NgbModal, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";
import { BehaviorSubject, Observable } from "rxjs";
import { LayoutUtilsService, MessageType } from "src/app/core/_base/crud";
import { Message, MessageService, RoleService,  } from "../../../../core/erp";
import * as os from "os";
import { AngularGridInstance, Column, FieldType, Filters, Formatters, GridOption, GridStateChange, GridService } from "angular-slickgrid";
import { AnyCnameRecord } from "dns";

@Component({
  selector: 'kt-create-message',
  templateUrl: './create-message.component.html',
  styleUrls: ['./create-message.component.scss']
})
export class CreateMessageComponent implements OnInit {
  message: Message;
  msgForm: FormGroup;
  hasFormErrors = false;
  isExist = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  users: [];
  itinerary: any[];
  roles:  any[];
  ro: any[];
  selectedRole: number[] = [];

  columnDefinitions: Column[] = [];
  columnDefinitionsrole: Column[] = [];
  columnDefinitions2: Column[] = [];
  gridOptions: GridOption = {};
  gridOptions2: GridOption = {};
  gridOptionsrole: GridOption = {};
  gridObj: any;
  angularGrid: AngularGridInstance;
  gridObj2: any;

  angularGrid2: AngularGridInstance;
  gridObjrole: any;
  angularGridrole: AngularGridInstance;
  selectedTitle: any;
  msg: any;
  dataViewrole: any;
  gridServicerole: GridService;
  selectedIndexes: any[];
  selectedIndexes2: any[];
  d: Array<number> = [];

 
 
 

  constructor(config: NgbDropdownConfig, private msgFB: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router, public dialog: MatDialog, private layoutUtilsService: LayoutUtilsService, private roleService: RoleService, private messageService: MessageService, private modalService: NgbModal,
     private cd: ChangeDetectorRef) {
    config.autoClose = true;
    this.prepareGrid2();
  }

  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.createForm();
    this.prepareGrid2();
    
    
  }

  createForm() {
    this.loadingSubject.next(false);

    this.message = new Message();
    this.msgForm = this.msgFB.group({
      title: [this.message.title, Validators.required],
      description: [this.message.title, Validators.required],
      rank: [this.message.rank, Validators.required],
         });
  }

  prepareGrid2() {
    this.columnDefinitions2 = [
      // {
      //     id: "id",
      //     name: "id",
      //     field: "id",
      //     sortable: true,
      //     minWidth: 80,
      //     maxWidth: 80,
      // },
      {
        id: "Role_code",
        name: "Code du Role",
        field: "role_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "role_name",
        name: "Nom du Role",
        field: "role_name",
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
      // frozenColumn: 0,
      // frozenBottom: true,
      enableRowSelection: false,
      // rowSelectionOptions: {
      //   // True (Single Selection), False (Multiple Selections)
      //   selectActiveRow: false
      //   },
      // enableCheckboxSelector: true,
      // checkboxSelector: {
      //     // optionally change the column index position of the icon (defaults to 0)
      //     // columnIndexPosition: 1,

      //     // remove the unnecessary "Select All" checkbox in header when in single selection mode
      //     hideSelectAllCheckbox: true,

      //     // you can override the logic for showing (or not) the expand icon
      //     // for example, display the expand icon only on every 2nd row
      //     // selectableOverride: (row: number, dataContext: any, grid: any) => (dataContext.id % 2 === 1)
      // },
      // multiSelect: false,
    };

    this.roles = [];
    // fill the dataset with your data
    // this.itineraryService
    //     .getAllItinerary()
    //     .subscribe((response: any) => (this.itinerary = response.data))
  }

  

  openrole(content) {
    let dd = [];
    for (let role of this.roles) {
      //console.log(it)
      //this.selectedIndexes2.push(1)
      var i = role.id;
      dd.push(i);
      // console.log("i",i)
    }
    // console.log(this.selectedIndexes2)
    // console.log(dd)
    this.selectedIndexes2 = dd;
    this.prepareGridrole();
    this.modalService.open(content, { size: "lg" });
  }
  reset() {
    this.message = new Message();
    this.createForm();
    this.roles = []
    this.hasFormErrors = false;
  }
  // save data
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.msgForm.controls;
    /** check form */
    if (this.msgForm.invalid) {
      Object.keys(controls).forEach((controlName) => controls[controlName].markAsTouched());

      this.hasFormErrors = true;
      return;
    }

    // tslint:disable-next-line:prefer-const
    let ms = this.prepareMessage();
    //console.log(this.selectedItinerary)
    this.addMessage(ms, this.roles);
    // const hostname = os.networkInterfaces()
    //console.log(hostname)
  }
  prepareMessage(): Message {
    const controls = this.msgForm.controls;
    const _message = new Message();
    _message.title = controls.title.value;
    _message.description = controls.description.value;
    _message.rank = controls.rank.value;
  
    return _message;
  }

  /**
   * Add role
   *
   * @param _message: RoleModel
   */
  addNewItem(content) {
    this.openrole(content);
  }
  addMessage(_message: Message, _role: any) {
    this.loadingSubject.next(true);
    this.messageService.add( { Msg:_message, Roles: _role }).subscribe(
      (reponse) => console.log("response", Response),
      (error) => {
        this.layoutUtilsService.showActionNotification("Erreur verifier les informations", MessageType.Create, 10000, true, true);
        this.loadingSubject.next(false);
      },
      () => {
        this.layoutUtilsService.showActionNotification("Ajout avec succès", MessageType.Create, 10000, true, true);
        this.loadingSubject.next(false);
        this.reset()
        this.router.navigateByUrl("/supervision/create-message");
      }
    );
  }

  goBack() {
    this.loadingSubject.next(false);
    const url = `/supervision/create-message`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }

  handleSelectedRowsChanged(e, args) {
    const controls = this.msgForm.controls;
    if (Array.isArray(args.rows) && this.gridObj) {
      args.rows.map((idx) => {
        const item = this.gridObj.getDataItem(idx);
        controls.user_mobile_code.setValue(item.user_mobile_code || "");
      });
    }
  }
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = (angularGrid && angularGrid.slickGrid) || {};
  }

  // handleSelectedRowsChanged2(e, args) {
  //   if (Array.isArray(args.rows) && this.gridObj2) {

  //     this.selectedItinerary = args.rows.map((idx: number) => {
  //       const item = this.gridObj2.getDataItem(idx);
  //       return item.itinerary_code;
  //     });

  // }
  //console.log(this.selectedItinerary)
  //}
  angularGridReady2(angularGrid: AngularGridInstance) {
    this.angularGrid2 = angularGrid;
    this.gridObj2 = (angularGrid && angularGrid.slickGrid) || {};
  }

  onChange(e) {
    console.log(e);
  }

  angularGridReadyrole(angularGrid: AngularGridInstance) {
    this.angularGridrole = angularGrid;
    this.gridObjrole = (angularGrid && angularGrid.slickGrid) || {};

    this.gridServicerole = angularGrid.gridService;
    this.dataViewrole = angularGrid.dataView;
  }

  // GRID IN
  prepareGridrole() {
    this.columnDefinitionsrole = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "role_code",
        name: "Code du role",
        field: "role_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "role_name",
        name: "Nom du Role",
        field: "role_name",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    
    ];

    this.gridOptionsrole = {
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
    this.roleService.getAllRoles().subscribe((response: any) => (this.ro = response.data));
  }

  handleSelectedRowsChangedrole(e, args) {
    this.selectedIndexes = [];
    this.selectedIndexes = args.rows;
    console.log(this.selectedIndexes)
  }

  addro() {
    // this.itinerary.push({})
    var l: any[] = [];
    this.selectedIndexes.forEach((index) => {
      l.push({
        id: index,
        role_code: this.ro[index]["role_code"],
        role_name: this.ro[index]["role_name"],
      
        //trigger : this.itinerary[index]['pjd_trigger']
      });
    });
    // console.log("lllllllll",l)
    this.roles = l;

    this.dataViewrole.setItems(this.roles);
  }

 }
