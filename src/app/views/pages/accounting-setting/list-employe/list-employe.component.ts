import { Component, OnInit } from "@angular/core"
import {
  Formatter,
  Editor,
  Editors,
  OnEventArgs,
  AngularGridInstance,
  Aggregators,
  Column,
  DelimiterType,
  FieldType,
  FileType,
  Filters,
  GridService,
  Formatters,
  GridOption,
  Grouping,
  GroupingGetterFunction,
  GroupTotalFormatters,
  SortDirectionNumber,
  Sorters,
} from "angular-slickgrid"

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

import { EmployeService,UsersService,} from "../../../../core/erp"

@Component({ 
  selector: 'kt-list-employe',
  templateUrl: './list-employe.component.html',
  styleUrls: ['./list-employe.component.scss']
})
export class ListEmployeComponent implements OnInit {
  repForm: FormGroup;
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  hasFormErrors = false
  grid: any;
  gridService: GridService;
  dataView: any;
  user;
  domain;
  angularGrid: AngularGridInstance;
  draggableGroupingPlugin: any;    
  columnDefinitions: Column[] = []
    gridOptions: GridOption = {}
    dataset: any[] = []
    constructor(
        private repFB: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private layoutUtilsService: LayoutUtilsService,
        private employeService: EmployeService,
        private userService: UsersService,
    ) {
        this.prepareGrid()
    }

    ngOnInit(): void {
      this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
      this.user = JSON.parse(localStorage.getItem("user"));
    this.domain = JSON.parse(localStorage.getItem("domain"));
      
      
      
      this.createForm();
      this.hasFormErrors = false
     
    }
    

    angularGridReady(angularGrid: AngularGridInstance) {
      this.angularGrid = angularGrid;
      this.grid = angularGrid.slickGrid; // grid object
      this.dataView = angularGrid.dataView;
      this.gridService = angularGrid.gridService;
    }
    prepareGrid() {
        this.columnDefinitions = [
            {
                id: "edit",
                field: "id",
                excludeFromColumnPicker: true,
                excludeFromGridMenu: true,
                excludeFromHeaderMenu: true,
                formatter: (row, cell, value, columnDef, dataContext) => {
                  // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
                  return `
                       <a class="btn btn-sm btn-clean btn-icon mr-2" title="Modifier Employe">
                       <i class="flaticon2-pen"></i>
                   </a>
                   `;
                },
                minWidth: 50,
                maxWidth: 50,
                // use onCellClick OR grid.onClick.subscribe which you can see down below
                onCellClick: (e: Event, args: OnEventArgs) => {
                    const id = args.dataContext.id
                    this.router.navigateByUrl(`/accounting-setting/edit-employe/${id}`)
                },
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
                id: "emp_addr",
                name: "Matricule",
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
              id: "emp_first_date",
              name: "Date Recrutement",
              field: "emp_first_date",
              sortable: true,
              filterable: true,
              width: 50,
              type: FieldType.dateIso,
            },
            
            {
              id: "emp_job",
              name: "Service",
              field: "emp_job",
              sortable: true,
              filterable: true,
              width: 50,
              type: FieldType.string,
            },
            
            {
              id: "emp_level",
              name: "Poste",
              field: "emp_level",
              sortable: true,
              filterable: true,
              width: 50,
              type: FieldType.string,
            },
            {
              id: "emp_last_date",
              name: "Date Départ",
              field: "emp_last_date",
              sortable: true,
              filterable: true,
              width: 50,
              type: FieldType.dateIso,
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
              id: "emp_ss_id",
              name: "N° Sécurité sociale",
              field: "emp_ss_id",
              sortable: true,
              filterable: true,
              type: FieldType.string,
            },
            {
              id: "chr01",
              name: "Taille H",
              field: "chr01",
              sortable: true,
              filterable: true,
              type: FieldType.string,
            },
            {
              id: "int01",
              name: "Pointure",
              field: "int01",
              sortable: true,
              filterable: true,
              type: FieldType.string,
            },
            
            {
              id: "emp_sex",
              name: "Genre",
              field: "emp_sex",
              sortable: true,
              filterable: true,
              type: FieldType.string,
            },
            {
              id: "emp_blood",
              name: "Groupe Sanguin",
              field: "emp_blood",
              sortable: true,
              filterable: true,
              type: FieldType.string,
            },
             {
              id: "emp_familysit",
              name: "Situation familliale",
              field: "emp_familysit",
              sortable: true,
              filterable: true,
              type: FieldType.string,
            },
             {
              id: "emp_child_nbr",
              name: "Enfants",
              field: "emp_child_nbr",
              sortable: true,
              filterable: true,
              type: FieldType.string,
            },
             {
              id: "emp_child_nbr",
              name: "Enfants",
              field: "emp_child_nbr",
              sortable: true,
              filterable: true,
              type: FieldType.string,
            },
             {
              id: "emp_phone",
              name: "N° Téléphone",
              field: "emp_phone",
              sortable: true,
              filterable: true,
              type: FieldType.string,
            },
            {
              id: "emp_mail",
              name: "Email",
              field: "emp_mail",
              sortable: true,
              filterable: true,
              type: FieldType.string,
            },
            {
              id: "emp_contact_tel",
              name: "Contact urgence",
              field: "emp_contact_tel",
              sortable: true,
              filterable: true,
              type: FieldType.string,
            },
         
           
        ]

        this.gridOptions = {
            enableSorting: true,
            enableCellNavigation: true,
            enableExcelCopyBuffer: true,
            // enableFiltering: true,
            autoEdit: false,
            autoHeight: false,
            enableAutoResize:true,
            frozenColumn: 0,
            frozenBottom: true,
            rowHeight:40,
        }

        // fill the dataset with your data
        this.dataset = []
        this.user = JSON.parse(localStorage.getItem("user"));
        console.log(this.user)
        if(this.user.usrd_site == '*')
        {this.employeService.getAll().subscribe(
            (response: any) => {this.dataset = response.data
              this.dataView.setItems(this.dataset)},
            (error) => {
                this.dataset = []
            },
            () => {}
        )}
        else{this.employeService.getBy({emp_site:this.user.usrd_site}).subscribe(
          (response: any) => {this.dataset = response.data
            this.dataView.setItems(this.dataset)},
          (error) => {
              this.dataset = []
          },
          () => {}
      )}
    }
    
createForm() {
    this.loadingSubject.next(false)
  //create form
  
  this.repForm = this.repFB.group({
      filter1: [ ""],
      filter2: [ ""],
      filter3: [ ""]
  
  })
}
getemp1() {
  this.dataset = []
 
  const controls = this.repForm.controls
  if(controls.filter1.value == ''){
    if(controls.filter2.value == '' ){
      if(controls.filter3.value == ''){this.dataset =[]}
      else{this.employeService.getBy({ emp_level : controls.filter3.value}).subscribe(
            (response: any) => {   
            this.dataset = response.data
            console.log(this.dataset)
            this.dataView.setItems(this.dataset);
          
              },
              (error) => {
                this.dataset = []
                },
              () => {}
            )
          }
    }
    else{
      if(controls.filter3.value == ''){this.employeService.getBy({ emp_lname : controls.filter2.value}).subscribe(
        (response: any) => {   
        this.dataset = response.data
        console.log(this.dataset)
        this.dataView.setItems(this.dataset);
      
          },
          (error) => {
            this.dataset = []
            },
          () => {}
        )}
      else{this.employeService.getBy({ emp_lname:controls.filter2.value,emp_level : controls.filter3.value}).subscribe(
            (response: any) => {   
            this.dataset = response.data
            console.log(this.dataset)
            this.dataView.setItems(this.dataset);
          
              },
              (error) => {
                this.dataset = []
                },
              () => {}
            )
          }
    }
  } 
  else{
    if(controls.filter2.value == ''){
      if(controls.filter3.value == ''){console.log('getemp1-1',controls.filter1.value)
        this.employeService.getBy({ emp_fname : controls.filter1.value}).subscribe(
          (response: any) => {   
            this.dataset = response.data
           console.log(this.dataset)
           this.dataView.setItems(this.dataset);
            
             },
          (error) => {
              this.dataset = []
          },
          () => {}
      )
      }
      else{console.log('getemp1-2')
        this.employeService.getBy({ emp_fname:controls.filter1.value,emp_level : controls.filter3.value}).subscribe(
          (response: any) => {   
            this.dataset = response.data
           console.log(this.dataset)
           this.dataView.setItems(this.dataset);
            
             },
          (error) => {
              this.dataset = []
          },
          () => {}
      )
      }
    }
    else {
      if(controls.filter3.value == ''){console.log('getemp1-3')
        this.employeService.getBy({ emp_fname:controls.filter1.value,emp_lname : controls.filter2.value}).subscribe(
          (response: any) => {   
            this.dataset = response.data
           console.log(this.dataset)
           this.dataView.setItems(this.dataset);
            
             },
          (error) => {
              this.dataset = []
          },
          () => {}
      )
      }
      else{console.log('getemp1-4')
        this.employeService.getBy({ emp_fname:controls.filter1.value,emp_lname:controls.filter2.value,emp_level : controls.filter3.value}).subscribe(
          (response: any) => {   
            this.dataset = response.data
           console.log(this.dataset)
           this.dataView.setItems(this.dataset);
            
             },
          (error) => {
              this.dataset = []
          },
          () => {}
      )
      }
    }
  } 

 
  
}
getemp2() {
  this.dataset = []
 
  const controls = this.repForm.controls
  if(controls.filter2.value == ''){
    if(controls.filter1.value == '' ){
      if(controls.filter3.value == ''){this.dataset =[]}
      else{this.employeService.getBy({ emp_level : controls.filter3.value}).subscribe(
            (response: any) => {   
            this.dataset = response.data
            console.log(this.dataset)
            this.dataView.setItems(this.dataset);
          
              },
              (error) => {
                this.dataset = []
                },
              () => {}
            )
          }
    }
    else{
      if(controls.filter3.value == ''){this.employeService.getBy({ emp_fname : controls.filter1.value}).subscribe(
        (response: any) => {   
        this.dataset = response.data
        console.log(this.dataset)
        this.dataView.setItems(this.dataset);
      
          },
          (error) => {
            this.dataset = []
            },
          () => {}
        )}
      else{this.employeService.getBy({ emp_fname:controls.filter1.value,emp_level : controls.filter3.value}).subscribe(
            (response: any) => {   
            this.dataset = response.data
            console.log(this.dataset)
            this.dataView.setItems(this.dataset);
          
              },
              (error) => {
                this.dataset = []
                },
              () => {}
            )
          }
    }
  } 
  else{
    if(controls.filter1.value == ''){
      if(controls.filter3.value == ''){console.log('getemp1-1',controls.filter2.value)
        this.employeService.getBy({ emp_lname : controls.filter2.value}).subscribe(
          (response: any) => {   
            this.dataset = response.data
           console.log(this.dataset)
           this.dataView.setItems(this.dataset);
            
             },
          (error) => {
              this.dataset = []
          },
          () => {}
      )
      }
      else{console.log('getemp1-2')
        this.employeService.getBy({ emp_lname:controls.filter2.value,emp_level : controls.filter3.value}).subscribe(
          (response: any) => {   
            this.dataset = response.data
           console.log(this.dataset)
           this.dataView.setItems(this.dataset);
            
             },
          (error) => {
              this.dataset = []
          },
          () => {}
      )
      }
    }
    else {
      if(controls.filter3.value == ''){console.log('getemp1-3')
        this.employeService.getBy({ emp_fname:controls.filter1.value,emp_lname : controls.filter2.value}).subscribe(
          (response: any) => {   
            this.dataset = response.data
           console.log(this.dataset)
           this.dataView.setItems(this.dataset);
            
             },
          (error) => {
              this.dataset = []
          },
          () => {}
      )
      }
      else{console.log('getemp1-4')
        this.employeService.getBy({ emp_fname:controls.filter1.value,emp_lname:controls.filter2.value,emp_level : controls.filter3.value}).subscribe(
          (response: any) => {   
            this.dataset = response.data
           console.log(this.dataset)
           this.dataView.setItems(this.dataset);
            
             },
          (error) => {
              this.dataset = []
          },
          () => {}
      )
      }
    }
  } 
  
}

getemp3() {
  this.dataset = []
 
  const controls = this.repForm.controls
  if(controls.filter3.value == ''){
    if(controls.filter1.value == '' ){
      if(controls.filter2.value == ''){this.dataset =[]}
      else{this.employeService.getBy({ emp_lname : controls.filter2.value}).subscribe(
            (response: any) => {   
            this.dataset = response.data
            console.log(this.dataset)
            this.dataView.setItems(this.dataset);
          
              },
              (error) => {
                this.dataset = []
                },
              () => {}
            )
          }
    }
    else{
      if(controls.filter2.value == ''){this.employeService.getBy({ emp_fname : controls.filter1.value}).subscribe(
        (response: any) => {   
        this.dataset = response.data
        console.log(this.dataset)
        this.dataView.setItems(this.dataset);
      
          },
          (error) => {
            this.dataset = []
            },
          () => {}
        )}
      else{this.employeService.getBy({ emp_fname:controls.filter1.value,emp_lname : controls.filter2.value}).subscribe(
            (response: any) => {   
            this.dataset = response.data
            console.log(this.dataset)
            this.dataView.setItems(this.dataset);
          
              },
              (error) => {
                this.dataset = []
                },
              () => {}
            )
          }
    }
  } 
  else{
    if(controls.filter1.value == ''){
      if(controls.filter2.value == ''){console.log('getemp1-1',controls.filter2.value)
        this.employeService.getBy({ emp_level : controls.filter3.value}).subscribe(
          (response: any) => {   
            this.dataset = response.data
           console.log(this.dataset)
           this.dataView.setItems(this.dataset);
            
             },
          (error) => {
              this.dataset = []
          },
          () => {}
      )
      }
      else{console.log('getemp1-2')
        this.employeService.getBy({ emp_lname:controls.filter2.value,emp_level : controls.filter3.value}).subscribe(
          (response: any) => {   
            this.dataset = response.data
           console.log(this.dataset)
           this.dataView.setItems(this.dataset);
            
             },
          (error) => {
              this.dataset = []
          },
          () => {}
      )
      }
    }
    else {
      if(controls.filter2.value == ''){console.log('getemp1-3')
        this.employeService.getBy({ emp_fname:controls.filter1.value,emp_level : controls.filter3.value}).subscribe(
          (response: any) => {   
            this.dataset = response.data
           console.log(this.dataset)
           this.dataView.setItems(this.dataset);
            
             },
          (error) => {
              this.dataset = []
          },
          () => {}
      )
      }
      else{console.log('getemp1-4')
        this.employeService.getBy({ emp_fname:controls.filter1.value,emp_lname:controls.filter2.value,emp_level : controls.filter3.value}).subscribe(
          (response: any) => {   
            this.dataset = response.data
           console.log(this.dataset)
           this.dataView.setItems(this.dataset);
            
             },
          (error) => {
              this.dataset = []
          },
          () => {}
      )
      }
    }
  } 
  
  
}
}
