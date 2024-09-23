import { Component, OnInit } from "@angular/core"
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"
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
  Formatters,
  FieldType,
  OnEventArgs,
} from "angular-slickgrid";
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

import { Employe, EmployeService, JobService , CodeService, SiteService, UsersService,ItemService} from "../../../../core/erp"
@Component({
  selector: 'kt-edit-employe',
  templateUrl: './edit-employe.component.html',
  styleUrls: ['./edit-employe.component.scss']
})
export class EditEmployeComponent implements OnInit {

  employe: Employe
  empForm: FormGroup
  hasFormErrors = false
  hasEmployeErrors = false
  isExist = false
  employeEdit: any
  title: String = 'Modifier Employé - '
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  error = false
  field = ""
  selectedTab = 0
    data: []
    columnDefinitions3: Column[] = []
    gridOptions3: GridOption = {}
    gridObj3: any
    angularGrid3: AngularGridInstance
    selectedField = ""
   
    hasEmployeFormErrors = false

    datasite: []
    columnDefinitionssite: Column[] = []
    gridOptionssite: GridOption = {}
    gridObjsite: any
    angularGridsite: AngularGridInstance
    
    datauserid: []
    columnDefinitionsuserid: Column[] = []
    gridOptionsuserid: GridOption = {}
    gridObjuserid: any
    angularGriduserid: AngularGridInstance

    datashift: []
    columnDefinitionsshift: Column[] = []
    gridOptionsshift: GridOption = {}
    gridObjshift: any
    angularGridshift: AngularGridInstance

  jobs: [];
  columnDefinitions2: Column[] = [];
  gridOptions2: GridOption = {};
  gridObj2: any;
  angularGrid2: AngularGridInstance;

    emp_city: any[] = []
    emp_state: any[] = []
    emp_county: any[] = []
    emp_country: any[] = []
    bdate: any;
    fdate: any;
    ldate: any;
    hdate: any;

     // grid options
  mvangularGrid: AngularGridInstance;
  mvgrid: any;
  mvgridService: GridService;
  mvdataView: any;
  mvcolumnDefinitions: Column[];
  mvgridOptions: GridOption;
  mvdataset: any[];

  jbangularGrid: AngularGridInstance;
  jbgrid: any;
  jbgridService: GridService;
  jbdataView: any;
  jbcolumnDefinitions: Column[];
  jbgridOptions: GridOption;
  jbdataset: any[];
  row_number;
  mv: any[];
  leveljbd = [];
  leveljob = []

  domains: [];
  columnDefinitionsdomain: Column[] = [];
  gridOptionsdomain: GridOption = {};
  gridObjdomain: any;
  angularGriddomain: AngularGridInstance;
  
  dataupper: []
    columnDefinitionsupper: Column[] = []
    gridOptionsupper: GridOption = {}
    gridObjupper: any
    angularGridupper: AngularGridInstance

    trangularGrid: AngularGridInstance;
    trgrid: any;
    trgridService: GridService;
    trdataView: any;
    trcolumnDefinitions: Column[];
    trgridOptions: GridOption;
    trdataset: any[];

    items: [];
    columnDefinitions4: Column[] = [];
    gridOptions4: GridOption = {};
    gridObj4: any;
    angularGrid4: AngularGridInstance;

  constructor(
      config: NgbDropdownConfig,
      private empFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private modalService: NgbModal,
      private employeService: EmployeService,
      private jobService: JobService,
      private codeService: CodeService,
      private siteService: SiteService,
      private userService: UsersService,  
      private itemsService: ItemService, 
  ) {
      config.autoClose = true
      this.codeService
      .getBy({ code_fldname: "ad_state" })
      .subscribe((response: any) => (this.emp_state = response.data))
      this.codeService
      .getBy({ code_fldname: "ad_country" })
      .subscribe((response: any) => (this.emp_country = response.data))
  this.codeService
      .getBy({ code_fldname: "ad_county" })
      .subscribe((response: any) => (this.emp_county = response.data))
      this.codeService
      .getBy({ code_fldname: "ad_city" })
      .subscribe((response: any) => (this.emp_city = response.data))
  
  }
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable()
    this.loadingSubject.next(false)
    this.activatedRoute.params.subscribe((params) => {
      const id = params.id
      this.employeService.getOne(id).subscribe((response: any)=>{
      this.employeEdit = response.data.employe
      this.mvdataset = response.data.employeScoreDetail
      this.jbdataset = response.data.employeJobDetail
      this.trdataset = response.data.employeTrDetail
      console.log("hereeeeeeeeeeee", this.employeEdit)
     
                            this.loadingSubject.next(false)
                            this.title = this.title + this.employeEdit.emp_addr
                            this.bdate = new Date(this.employeEdit.emp_birth_date)
                            this.fdate = new Date(this.employeEdit.emp_first_date)
                            this.ldate = new Date(this.employeEdit.emp_last_date)
                            this.hdate = new Date(this.employeEdit.emp_hab_date)
                            
        /*      this.bdate.setDate(this.bdate.getDate() + 1)
              this.fdate.setDate(this.fdate.getDate() + 1)
              this.ldate.setDate(this.ldate.getDate() + 1)*/
             
      this.createForm()
      this.initmvGrid()
      this.initjbGrid()
      this.inittrGrid()
      
   
      this.loadingSubject.next(false)
      
      })
    })
}
//create form
createForm() {
  this.loadingSubject.next(false)
  
  
  this.empForm = this.empFB.group({
      emp_addr: [{value: this.employeEdit.emp_addr, disabled:true}],
      emp_fname: [{value:this.employeEdit.emp_fname},
        Validators.required
        
    ],
      emp_lname: [
          this.employeEdit.emp_lname ,
          Validators.required,
      ],
      
      
    emp_sex: [
      this.employeEdit.emp_sex ,
      Validators.required,
  ],
  emp_familysit: [
    this.employeEdit.emp_familysit ,
    Validators.required,
],



emp_birth_date: [{
  year: this.bdate.getFullYear(),
  month: this.bdate.getMonth()+1,
  day: this.bdate.getDate()
}],
emp_first_date: [{
  year: this.fdate.getFullYear(),
  month: this.fdate.getMonth()+1,
  day: this.fdate.getDate()
}],
emp_last_date: [{
  year: this.ldate.getFullYear(),
  month: this.ldate.getMonth()+1,
  day: this.ldate.getDate()
}],


emp_hab_date: [{
  year: this.hdate.getFullYear(),
  month: this.hdate.getMonth()+1,
  day: this.hdate.getDate()
}],



      
    emp_blood: [this.employeEdit.emp_blood , Validators.required],
      emp_line1:  [this.employeEdit.emp_line1, Validators.required,],
      emp_ss_id:  [this.employeEdit.emp_ss_id , Validators.required,],
      emp_country: [this.employeEdit.emp_country ],
      emp_city: [this.employeEdit.emp_city ],
      emp_state: [this.employeEdit.emp_state ],
      emp_zip: [this.employeEdit.emp_zip ],
      emp_phone: [this.employeEdit.emp_phone ],
      emp_fax: [this.employeEdit.emp_fax ],
      emp_mail: [this.employeEdit.emp_mail ],
      emp_shift:  [this.employeEdit.emp_shift ],
      emp_site:  [this.employeEdit.emp_site ],
      emp_rate:  [this.employeEdit.emp_rate ],
      emp_mrate: [this.employeEdit.emp_mrate ],
      emp_arate: [this.employeEdit.emp_arate ],
      emp_dlicence:  [this.employeEdit.emp_dlicence ],
      emp_anem: [this.employeEdit.emp_anem ],
      emp_habiliation: [this.employeEdit.emp_habiliation ],
      emp_child_nbr: [this.employeEdit.emp_child_nbr ],
      emp_contact_fname:  [this.employeEdit.emp_contact_fname],
      emp_contact_lname:  [this.employeEdit.emp_contact_lname ],
      emp_contact_adress: [ this.employeEdit.emp_contact_adress ],
      emp_contact_tel: [ this.employeEdit.emp_contact_tel ],
      emp_parent_liaison: [ this.employeEdit.emp_parent_liaison ],
      emp_userid:  [ this.employeEdit.emp_userid ],
      emp_conf_date: [this.employeEdit.emp_conf_date],
      emp_dism_date: [this.employeEdit.emp_dism_date],
      emp_loyalty: [this.employeEdit.emp_loyalty],
      emp_loyal_date: [this.employeEdit.emp_loyal_date],
      emp_upper : [this.employeEdit.emp_upper],
      emp_job: [this.employeEdit.emp_job, ],

      emp_level: [this.employeEdit.emp_level],
  })
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
    
    },
    {
      id: "code_value",
      name: "Type",
      field: "code_value",
      sortable: true,
      width: 50,
      filterable: false,
      type: FieldType.string,
      editor: {
        model: Editors.text,
      },
    },
    {
      id: "code_cmmt",
      name: "Designation",
      field: "code_cmmt",
      sortable: true,
      width: 50,
      filterable: false,
      type: FieldType.string,
      editor: {
        model: Editors.text,
      },
    },
    
    {
      id: "emps_amt",
      name: "Montant",
      field: "emps_amt",
      sortable: true,
      width: 80,
      filterable: false,
      type: FieldType.float,
      editor: {
        model: Editors.float,
      },
    },
  ];

  this.mvgridOptions = {
    asyncEditorLoading: false,
    editable: true,
    enableColumnPicker: true,
    enableAutoResize:true,
    autoHeight:true,
    enableCellNavigation: true,
    enableRowSelection: true,
  };
  this.codeService.getBy({ code_fldname: "emp_type" })
  .subscribe((response: any) => {this.mv = response.data
    for (let m of this.mv) {

      const result = this.mvdataset.find(({ emps_type }) => emps_type === m.code_value);
      console.log(result)
      m.emps_amt = result.emps_amt
    }

  this.mvdataset = this.mv
  
  
  });
  

}

initjbGrid() {
  this.jbcolumnDefinitions = [
    {
      id: "id",
      field: "id",
      excludeFromHeaderMenu: true,
      formatter: Formatters.deleteIcon,
      minWidth: 30,
      maxWidth: 30,
      onCellClick: (e: Event, args: OnEventArgs) => {
        if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
          this.jbangularGrid.gridService.deleteItem(args.dataContext);
        }
      },
    
    },
    {
      id: "empj_job",
      name: "Code Metier",
      field: "empj_job",
      sortable: true,
      width: 50,
      filterable: false,
      type: FieldType.string,
      editor: {
        model: Editors.text,
      },
      onCellChange: (e: Event, args: OnEventArgs) => {
        
        this.jobService.getLevel({jbd_code: args.dataContext.empj_job }).subscribe((resp:any)=>{

         this.leveljob = resp.data 
        
      
         for (let obj of this.leveljob) {
           let ob = {
             value : obj.value,
             label : obj.label
           }
           this.leveljbd.push(ob)
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
      
       
        this.row_number = args.row
        let element: HTMLElement = document.getElementById(
            "openItemsGrid"
        ) as HTMLElement
        element.click()
        }  
      
    },
    {
      id: "desc",
      name: "Designation",
      field: "desc",
      sortable: true,
      width: 50,
      filterable: false,
      type: FieldType.string,
    
    },
    {
      id: "empj_level",
      name: "Niveau",
      field: "empj_level",
      sortable: true,
      width: 50,
      filterable: false,
      type: FieldType.string,
      editor: {
        model: Editors.singleSelect,
        collection: this.leveljbd,
      
      
      
        
      },
    },
    
  ];

  this.jbgridOptions = {
    asyncEditorLoading: false,
    editable: true,
    enableColumnPicker: true,
    enableAutoResize:true,
    autoHeight:true,
    enableCellNavigation: true,
    enableRowSelection: true,
  };
  // this.codeService.getBy({ code_fldname: "emp_type" })
  // .subscribe((response: any) => (this.mvdataset = response.data));
 

}

addNewItem() {
  this.jbgridService.addItem(
    {
      id: this.jbdataset.length + 1,
     
      empj_job: null,
      empj_level: null,
    },
    { position: "bottom" }
  );
}
inittrGrid() {
  this.trcolumnDefinitions = [
    {
      id: "id",
      field: "id",
      excludeFromHeaderMenu: true,
      formatter: Formatters.deleteIcon,
      minWidth: 30,
      maxWidth: 30,
    
    },
    {
      id: "empf_part",
      name: "Code Formation",
      field: "empf_part",
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
      
       
        this.row_number = args.row
        let element: HTMLElement = document.getElementById(
            "openItemspGrid"
        ) as HTMLElement
        element.click()
        }  
      
    },
    {
      id: "desc",
      name: "Designation",
      field: "desc",
      sortable: true,
      width: 50,
      filterable: false,
      type: FieldType.string,
    
    },
    {
      id: "empf_beging_date",
      name: "Date Debut",
      field: "empf_beging_date",
      sortable: true,
      width: 50,
      filterable: false,
      type: FieldType.dateIso,
      editor: {
        model: Editors.date,
      },
    },
    
    {
      id: "empf_end_date",
      name: "Date Fin",
      field: "empf_end_date",
      sortable: true,
      width: 50,
      filterable: false,
      type: FieldType.dateIso,
      editor: {
        model: Editors.date,
      },
    },
  ];

  this.trgridOptions = {
    asyncEditorLoading: false,
    editable: true,
    enableAutoResize:true,
    autoHeight:false,
    enableColumnPicker: true,
    enableCellNavigation: true,
    enableRowSelection: true,
    rowHeight:40,
  };
 

}

addNewtrItem() {
  this.trgridService.addItem(
    {
      id: this.trdataset.length + 1,
     
      empf_part: null,
      empf_beging_date: null,
      empf_end_date: null
    },
    { position: "bottom" }
  );
}
jbGridReady(angularGrid: AngularGridInstance) {
  this.jbangularGrid = angularGrid;
  this.jbdataView = angularGrid.dataView;
  this.jbgrid = angularGrid.slickGrid;
  this.jbgridService = angularGrid.gridService;
}
mvGridReady(angularGrid: AngularGridInstance) {
  this.mvangularGrid = angularGrid;
  this.mvdataView = angularGrid.dataView;
  this.mvgrid = angularGrid.slickGrid;
  this.mvgridService = angularGrid.gridService;
}
trGridReady(angularGrid: AngularGridInstance) {
  this.trangularGrid = angularGrid;
  this.trdataView = angularGrid.dataView;
  this.trgrid = angularGrid.slickGrid;
  this.trgridService = angularGrid.gridService;
}
onChangeJob() {
  const controls = this.empForm.controls; // chof le champs hada wesh men form rah
  const jb_code = controls.emp_job.value;
 

  this.jobService.getBy({ jb_code }).subscribe(
    (res: any) => {
      console.log(res);
      const { data } = res.data;

      if (!data) {
        this.layoutUtilsService.showActionNotification(
          "ce Métier n'existe pas!",
          MessageType.Create,
          10000,
          true,
          true
        );
        this.error = true;
        document.getElementById("job").focus();
      }
    },
    (error) => console.log(error)
  );
}
onChangeLevel() {
  const controls = this.empForm.controls; // chof le champs hada wesh men form rah
  const jbd_code = controls.emp_job.value;
 

  this.jobService.getByDet({ jbd_code }).subscribe(
    (res: any) => {
      console.log(res);
      const { data } = res.data;

      if (!data) {
        this.layoutUtilsService.showActionNotification(
          "ce Niveau n'existe pas!",
          MessageType.Create,
          10000,
          true,
          true
        );
        this.error = true;
        document.getElementById("level").focus();
      }
    },
    (error) => console.log(error)
  );
}

//reste form
reset() {
  this.employe = new Employe()
  this.createForm()
  this.hasFormErrors = false
  
}
// save data
onSubmit() {
  this.hasFormErrors = false
  
  const controls = this.empForm.controls
  /** check form */
  if (this.empForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
          controls[controlName].markAsTouched()
      )

      this.hasFormErrors = true
      
      this.selectedTab = 0
      
      return
  }
  

  // tslint:disable-next-line:prefer-const
  let employe = this.prepareCode()
  for (let data of this.mvdataset) {
    delete data.id;
    delete data.cmvid;
  }
  for (let data of this.jbdataset) {
    delete data.id;
    delete data.cmvid;
    delete data.desc;
  }
  for (let data of this.trdataset) {
    delete data.id;
    delete data.cmvid;
    delete data.desc;
  }
  this.addEmploye(employe,this.mvdataset,this.jbdataset,this.trdataset)
  
}
/**
     * Returns object for saving
     */
    prepareCode(): Employe {
      const controls = this.empForm.controls
      const _employe = new Employe()
      _employe.emp_addr = controls.emp_addr.value
      _employe.emp_lname = controls.emp_lname.value
      _employe.emp_fname = controls.emp_fname.value
      _employe.emp_sex = controls.emp_sex.value
      _employe.emp_familysit = controls.emp_familysit.value
      _employe.emp_birth_date = controls.emp_birth_date.value
      ? `${controls.emp_birth_date.value.year}/${controls.emp_birth_date.value.month}/${controls.emp_birth_date.value.day}`
      : null
      _employe.emp_first_date = controls.emp_first_date.value
      ? `${controls.emp_first_date.value.year}/${controls.emp_first_date.value.month}/${controls.emp_first_date.value.day}`
      : null
      _employe.emp_last_date = controls.emp_last_date.value
      ? `${controls.emp_last_date.value.year}/${controls.emp_last_date.value.month}/${controls.emp_last_date.value.day}`
      : null

      _employe.emp_hab_date = controls.emp_hab_date.value
      ? `${controls.emp_hab_date.value.year}/${controls.emp_hab_date.value.month}/${controls.emp_hab_date.value.day}`
      : null

      _employe.emp_line1 = controls.emp_line1.value
      
      _employe.emp_country = controls.emp_country.value
      _employe.emp_city = controls.emp_city.value
      
      _employe.emp_state = controls.emp_state.value
      _employe.emp_zip =  controls.emp_zip.value

      _employe.emp_phone = controls.emp_phone.value
      _employe.emp_fax = controls.emp_fax.value
      _employe.emp_mail = controls.emp_mail.value




      _employe.emp_ss_id = controls.emp_ss_id.value
      _employe.emp_shift = controls.emp_shift.value
      _employe.emp_site = controls.emp_site.value
      _employe.emp_rate = controls.emp_rate.value
      _employe.emp_mrate = controls.emp_mrate.value
      _employe.emp_arate = controls.emp_arate.value

      _employe.emp_anem = controls.emp_anem.value
      _employe.emp_habiliation = controls.emp_habiliation.value
      _employe.emp_dlicence = controls.emp_dlicence.value
      

      
      _employe.emp_child_nbr = controls.emp_child_nbr.value
      _employe.emp_blood = controls.emp_blood.value
      _employe.emp_contact_fname = controls.emp_contact_fname.value
      _employe.emp_contact_lname = controls.emp_contact_lname.value
      _employe.emp_contact_adress = controls.emp_contact_adress.value
      _employe.emp_contact_tel = controls.emp_contact_tel.value
      _employe.emp_parent_liaison = controls.emp_parent_liaison.value
      _employe.emp_userid = controls.emp_userid.value
      
      _employe.emp_conf_date =  controls.emp_conf_date.value
      ? `${controls.emp_conf_date.value.year}/${controls.emp_conf_date.value.month}/${controls.emp_conf_date.value.day}`
      : null
      _employe.emp_dism_date = controls.emp_dism_date.value
      ? `${controls.emp_dism_date.value.year}/${controls.emp_dism_date.value.month}/${controls.emp_dism_date.value.day}`
      : null
      _employe.emp_loyalty = controls.emp_loyalty.value
      _employe.emp_loyal_date = controls.emp_loyal_date.value
      ? `${controls.emp_emp_loyal_date.value.year}/${controls.emp_loyal_date.value.month}/${controls.emp_loyal_date.value.day}`
      : null
      _employe.emp_upper =  controls.emp_upper.value
      _employe.emp_job   = controls.emp_job.value
      _employe.emp_level = controls.emp_level.value

      return _employe
  }
  onChangeState() {
    const controls  = this.empForm.controls
  
    this.codeService
        .getBy({ code_fldname: "ad_city", chr01: controls.emp_state.value.substring(0, 2) })
        .subscribe((response: any) => {(this.emp_city = response.data)
        })    
}
/**
     * Add code
     *
     * @param _employe: EmployeModel
     */
    addEmploye(_employe: Employe,details: any, jbdetails:any, trdetails:any) {
      const controls = this.empForm.controls
      this.loadingSubject.next(true)
      this.employeService.update(this.employeEdit.id, {Employe:_employe, employeScoreDetail: details, employeJobDetail: jbdetails,employeTrDetail: trdetails}).subscribe(
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
              this.loadingSubject.next(false)
              
              this.router.navigateByUrl("/accounting-setting/employe-list")
          }
      )
  }


 

 /**
     * Go back to the list
     *
     */
    goBack() {
      this.loadingSubject.next(false)
      const url = `/accounting-setting/employe-list`
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }




  changeJob(){
    const controls = this.empForm.controls // chof le champs hada wesh men form rah
    const jb_code  = controls.emp_job.value
    this.jobService.getBy({jb_code}).subscribe((res:any)=>{
        const {data} = res
        console.log(res)
        if (!data){ this.layoutUtilsService.showActionNotification(
            "ce Métier n'existe pas!",
            MessageType.Create,
            10000,
            true,
            true
        )
    this.error = true}
        else {
            this.error = false
        }


    },error=>console.log(error))
}

 

  angularGridReady2(angularGrid: AngularGridInstance) {
    this.angularGrid2 = angularGrid;
    this.gridObj2 = (angularGrid && angularGrid.slickGrid) || {};
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
        id: "jb_code",
        name: "code",
        field: "jb_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "jb_desc",
        name: "Designation",
        field: "jb_desc",
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
    };

    // fill the dataset with your data
    this.jobService
      .getAll()
      .subscribe((response: any) => (this.jobs = response.data));
  }
  open2(content) {
    this.prepareGrid2();
    this.modalService.open(content, { size: "lg" });
  }


  handleSelectedRowsChanged3(e, args) {
    const controls = this.empForm.controls;
    if (Array.isArray(args.rows) && this.gridObj3) {
      args.rows.map((idx) => {
        const item = this.gridObj3.getDataItem(idx);
        controls.emp_level.setValue(item.jbd_level || "");
      });
    }
}
  angularGridReady3(angularGrid: AngularGridInstance) {
    this.angularGrid3 = angularGrid
    this.gridObj3 = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGrid3() {
  const controls = this.empForm.controls;
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
            id: "jbd_code",
            name: "Code Métier",
            field: "jbd_code",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
          id: "jbd_level",
          name: "Niveau",
          field: "jbd_level",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      
        {
            id: "jbd_desc",
            name: "Designation",
            field: "jbd_desc",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
          id: "jbd_time_rate",
          name: "Taux Horaire",
          field: "jbd_time_rate",
          sortable: true,
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
    this.jobService
        .getByDet({jbd_code: controls.emp_job.value})
        .subscribe((response: any) => (this.data = response.data))
}
open3(content) {
   
    this.prepareGrid3()
    this.modalService.open(content, { size: "lg" })
}

handleSelectedRowsChangedsite(e, args) {
  
  const controls = this.empForm.controls;
  if (Array.isArray(args.rows) && this.gridObjsite) {
      args.rows.map((idx) => {
          const item = this.gridObjsite.getDataItem(idx)
          // TODO : HERE itterate on selected field and change the value of the selected field
                  controls.emp_site.setValue(item.si_site || "")
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
onChangesite() {
  const controls = this.empForm.controls;
  const si_site = controls.emp_site.value;
  
  this.siteService.getByOne({ si_site }).subscribe(
    (res: any) => {

      if (!res.data) {

          alert("Site n'existe pas  ")
          controls.emp_site.setValue(null);
          document.getElementById("emp_site").focus();
        }
    
    });
}

handleSelectedRowsChangedshift(e, args) {
  
  const controls = this.empForm.controls;
  if (Array.isArray(args.rows) && this.gridObjshift) {
      args.rows.map((idx) => {
          const item = this.gridObjshift.getDataItem(idx)
          // TODO : HERE itterate on selected field and change the value of the selected field
                  controls.emp_shift.setValue(item.code_value || "")
      })
  }
}
angularGridReadyshift(angularGrid: AngularGridInstance) {
  this.angularGridshift = angularGrid
  this.gridObjshift = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGridshift() {
  this.columnDefinitionsshift = [
      /*{
          id: "id",
          field: "id",
          excludeFromColumnPicker: true,
          excludeFromGridMenu: true,
          excludeFromHeaderMenu: true,

          minWidth: 50,
          maxWidth: 50,
      },*/
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
          name: "Code Equipe",
          field: "code_value",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
          id: "code_cmmt",
          name: "Designation",
          field: "code_cmmt",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      
  ]

  this.gridOptionsshift = {
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
      .getBy ({code_fldname: "emp_shift"})
      .subscribe((response: any) => (this.datashift = response.data))
}
openshift(contentshift, field) {
  this.selectedField = field
  this.prepareGridshift()
  this.modalService.open(contentshift, { size: "lg" })
}
onChangeshift() {
  const controls = this.empForm.controls;
  
  this.codeService.getBy({ code_fldname: "emp_shift", code_value : controls.emp_shift.value}).subscribe(
    (res: any) => {
console.log(res.data)
      if (res.data.length == 0) {

          alert("Equipe n'existe pas  ")
          controls.emp_shift.setValue(null);
          document.getElementById("emp_shift").focus();
        }
    
    });
}

/**
     * Close alert
     *
     * @param $event
     */
 onAlertClose($event) {
  this.hasFormErrors = false
}
handleSelectedRowsChanged2(e, args) {
  
  let updateItem = this.jbgridService.getDataItemByRowIndex(this.row_number);
  
  if (Array.isArray(args.rows) && this.gridObj2) {
      args.rows.map((idx) => {
       
          const item = this.gridObj2.getDataItem(idx)
          // TODO : HERE itterate on selected field and change the value of the selected field
          updateItem.empj_job = item.jb_code
          updateItem.desc = item.jb_desc
          this.jbgridService.updateItem(updateItem);
          this.jobService.getLevel({jbd_code: item.jb_code }).subscribe((resp:any)=>{

            this.leveljob = resp.data 
           
           
            for (let obj of this.leveljob) {
              let ob = {
                value : obj.value,
                label : obj.label
              }
              this.leveljbd.push(ob)
            }
           
           });
      })
  }
}
handleSelectedRowsChangeduserid(e, args) {
  const controls = this.empForm.controls;
  if (Array.isArray(args.rows) && this.gridObjuserid) {
    args.rows.map((idx) => {
      const item = this.gridObjuserid.getDataItem(idx);
      console.log(item);
      controls.emp_userid.setValue(item.usrd_code || "");
    });
  }
}

angularGridReadyuserid(angularGrid: AngularGridInstance) {
  this.angularGriduserid = angularGrid;
  this.gridObjuserid = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGriduserid() {
  this.columnDefinitionsuserid = [
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
      name: "code user",
      field: "usrd_code",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "usrd_name",
      name: "nom",
      field: "usrd_name",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
  ];

  this.gridOptionsuserid = {
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
  this.userService.getAllUsers().subscribe((response: any) => (this.datauserid = response.data));
}
openuserid(content) {
  this.prepareGriduserid();
  this.modalService.open(content, { size: "lg" });
}
onChangeUserid() {
  const controls = this.empForm.controls; // chof le champs hada wesh men form rah
  const usrd_code = controls.emp_userid.value;
 

  this.userService.getByOne({ usrd_code }).subscribe(
    (res: any) => {
      console.log(res);
      
      if (res.data == null) {
        this.layoutUtilsService.showActionNotification(
          "cet utilisateur n'existe pas!",
          MessageType.Create,
          10000,
          true,
          true
        );
        this.error = true;
        controls.emp_userid.setValue(null)
        document.getElementById("userid").focus();
      }
    },
    (error) => console.log(error)
  );
}
handleSelectedRowsChangedupper(e, args) {
  
  const controls = this.empForm.controls;
  if (Array.isArray(args.rows) && this.gridObjupper) {
      args.rows.map((idx) => {
          const item = this.gridObjupper.getDataItem(idx)
          // TODO : HERE itterate on selected field and change the value of the selected field
                  controls.emp_upper.setValue(item.emp_addr || "")
      })
  }
}
angularGridReadyupper(angularGrid: AngularGridInstance) {
  this.angularGridupper = angularGrid
  this.gridObjupper = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGridupper() {
  this.columnDefinitionsupper = [
    {
      id: "id",
      name: "id",
      field: "id",
      sortable: true,
      minWidth: 80,
      maxWidth: 80,
    },
    {
        id: "emp_addr",
        name: "Code Employe",
        field: "emp_addr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
    },
    {
      id: "emp_fname",
      name: "Nom",
      field: "emp_fname",
      sortable: true,
      filterable: true,
      width: 50,
      type: FieldType.string,
  },
  {
      id: "emp_lname",
      name: "Prénom",
      field: "emp_lname",
      sortable: true,
      filterable: true,
      width: 50,
      type: FieldType.string,
  },
  {
    id: "emp_line1",
    name: "Adresse",
    field: "emp_line1",
    sortable: true,
    width: 120,
    filterable: true,
    type: FieldType.string,
  },
  {
    id: "emp_birth_date",
    name: "Date Naissance",
    field: "emp_birth_date",
    sortable: true,
    filterable: true,
    width: 50,
    type: FieldType.dateIso,
  },
  
  {
    id: "emp_job",
    name: "Métier",
    field: "emp_job",
    sortable: true,
    filterable: true,
    width: 50,
    type: FieldType.string,
  },
  
  {
    id: "emp_level",
    name: "Niveau",
    field: "emp_level",
    sortable: true,
    filterable: true,
    width: 50,
    type: FieldType.string,
  },
  {
    id: "emp_site",
    name: "Site",
    field: "emp_site",
    sortable: true,
    filterable: true,
    type: FieldType.string,
  },
  
  {
    id: "emp_shift",
    name: "Equipe",
    field: "emp_shift",
    sortable: true,
    filterable: true,
    type: FieldType.string,
  },

  {
    id: "emp_rate",
    name: "Taux",
    field: "emp_rate",
    sortable: true,
    filterable: true,
    type: FieldType.float,
  },
  {
    id: "emp_mrate",
    name: "Taux Multiple",
    field: "emp_mrate",
    sortable: true,
    filterable: true,
    type: FieldType.float,
  },
  {
    id: "emp_arate",
    name: "Taux",
    field: "emp_arate",
    sortable: true,
    filterable: true,
    type: FieldType.float,
  },
      
  ]

  this.gridOptionsupper = {
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
  this.employeService
      .getAll()
      .subscribe((response: any) => (this.dataupper = response.data))
}
openupper(content) {
 
  this.prepareGridupper()
  this.modalService.open(content, { size: "lg" })
}
onChangeUpper() {
  const controls = this.empForm.controls;
  const emp_addr = controls.emp_upper.value;
  
  this.employeService.getByOne({ emp_addr }).subscribe(
    (res: any) => {
console.log(res.data)
      if (!res.data) {

          alert("Employe n'existe pas  ")
          controls.emp_upper.setValue(null);
          document.getElementById("emp_upper").focus();
        }
    
    });
}
changeDomain(){
  const controls = this.empForm.controls // chof le champs hada wesh men form rah
  const code_value  = controls.emp_job.value
  this.codeService.getBy({code_fldname:"pt_draw",code_value:code_value}).subscribe((res:any)=>{
      const {data} = res
      console.log(res)
      if (!data){ this.layoutUtilsService.showActionNotification(
          "ce Service n'existe pas!",
          MessageType.Create,
          10000,
          true,
          true
      )
  this.error = true}
      else {
          this.error = false
      }


  },error=>console.log(error))
}

handleSelectedRowsChangeddomain(e, args) {
  const controls = this.empForm.controls;
  if (Array.isArray(args.rows) && this.gridObjdomain) {
    args.rows.map((idx) => {
      const item = this.gridObjdomain.getDataItem(idx);
      controls.emp_job.setValue(item.code_value || "");
    });
  }
}

angularGridReadydomain(angularGrid: AngularGridInstance) {
  this.angularGriddomain = angularGrid;
  this.gridObjdomain = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGriddomain() {
  this.columnDefinitionsdomain = [
   
    {
      id: "code_value",
      name: "Code Domaine",
      field: "code_value",
      sortable: true,
      minWidth: 70,
      maxWidth: 100,
      filterable: true,
      type: FieldType.string,
    
  },
  {
      id: "code_cmmt",
      name: "Désignation",
      field: "code_cmmt",
      sortable: true,
      minWidth: 100,
      maxWidth: 300,
      filterable: true,
      type: FieldType.string,
      
  },   
  ];

  this.gridOptionsdomain = {
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
  this.codeService
    .getBy({code_fldname:"pt_draw"})
    .subscribe((response: any) => (this.domains = response.data));
}
opendom(content) {
  this.prepareGriddomain();
  this.modalService.open(content, { size: "lg" });
}
handleSelectedRowsChanged4(e, args) {
  let updateItem = this.trgridService.getDataItemByRowIndex(this.row_number);
  if (Array.isArray(args.rows) && this.gridObj4) {
    args.rows.map((idx) => {
      const item = this.gridObj4.getDataItem(idx);
            updateItem.empf_part = item.pt_part;
            updateItem.desc = item.pt_desc1;
            
            this.trgridService.updateItem(updateItem);
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
  this.itemsService.getBy({pt_part_type : "FORMATION"}).subscribe((response: any) => (this.items = response.data));
}
open4(content) {
  this.prepareGrid4();
  this.modalService.open(content, { size: "lg" });
}
}
