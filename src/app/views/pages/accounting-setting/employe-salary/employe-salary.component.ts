import { Component, OnInit } from "@angular/core"

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
import {
  NgbDropdownConfig,
  NgbTabChangeEvent,
  NgbTabsetConfig,
  NgbModal,
} from "@ng-bootstrap/ng-bootstrap";

import { EmployeService} from "../../../../core/erp"
@Component({
  selector: 'kt-employe-salary',
  templateUrl: './employe-salary.component.html',
  styleUrls: ['./employe-salary.component.scss']
})
export class EmployeSalaryComponent implements OnInit {
  empForm: FormGroup
  grid: any;
  gridService: GridService;
  dataview: any;
  angularGrid: AngularGridInstance;
  draggableGroupingPlugin: any;    
  columnDefinitions: Column[] = []
    gridOptions: GridOption = {}
    dataset: any[] = []
    hasFormErrors = false
  isExist = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  year:any[] = [];
    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private empFB: FormBuilder,
        private layoutUtilsService: LayoutUtilsService,
        private employeService: EmployeService
    ) {
      var y : Number
      for(var i=2023; i <= 2099;i++) {
        y = i
        this.year.push({y})
      }
        this.prepareGrid()
    }

    ngOnInit(): void {
      this.createForm();
    }
    createForm() {
      this.loadingSubject.next(false)
    
     const date = new Date()
      this.empForm = this.empFB.group({
          year:  [date.getFullYear(), Validators.required],
          month: ["", Validators.required],
        
      })
    }
    angularGridReady(angularGrid: AngularGridInstance) {
      this.angularGrid = angularGrid;
      this.grid = angularGrid.slickGrid; // grid object
      this.dataview = angularGrid.dataView;
      this.gridService = angularGrid.gridService;
    }
    prepareGrid() {
        this.columnDefinitions = [
      
            {
                id: "id",
                name: "id",
                field: "id",
                sortable: true,
                minWidth: 50,
                maxWidth: 50,
            },
            {
                id: "code",
                name: "Code Employe",
                field: "code",
                sortable: true,
                filterable: true,
                type: FieldType.string,
            },
            {
                id: "name",
                name: "Nom",
                field: "name",
                sortable: true,
                filterable: true,
                width: 50,
                type: FieldType.string,
            },
            {
                id: "prename",
                name: "Prénom",
                field: "prename",
                sortable: true,
                filterable: true,
                width: 50,
                type: FieldType.string,
            },
            // {
            //   id: "emp_line1",
            //   name: "Adresse",
            //   field: "emp_line1",
            //   sortable: true,
            //   width: 120,
            //   filterable: true,
            //   type: FieldType.string,
            // },
            // {
            //   id: "emp_birth_date",
            //   name: "Date Naissance",
            //   field: "emp_birth_date",
            //   sortable: true,
            //   filterable: true,
            //   width: 50,
            //   type: FieldType.dateIso,
            // },
            
            {
              id: "shift",
              name: "Equipe",
              field: "shift",
              sortable: true,
              filterable: true,
              width: 50,
              type: FieldType.string,
            },
            
            {
              id: "balance",
              name: "Balance",
              field: "balance",
              sortable: true,
              filterable: true,
              width: 50,
              type: FieldType.float,
            },
            
            {
              id: "amt",
              name: "Salaire",
              field: "amt",
              sortable: true,
              filterable: true,
              type: FieldType.float,
            },
            {
              id: "bonus",
              name: "Bonus",
              field: "bonus",
              sortable: true,
              filterable: true,
              type: FieldType.float,
              editor: {
      
                //collection: this.leveljob,
              
                model: Editors.float,
              
                
              },

              onCellChange: (e: Event, args: OnEventArgs) => {
                this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , salary: Number(args.dataContext.amt) + Number(args.dataContext.bonus),newbalance:Number(args.dataContext.balance) - Number(args.dataContext.bonus)})
  
              }
            },
            {
              id: "salary",
              name: "Nouveau Salaire",
              field: "salary",
              sortable: true,
              filterable: true,
              type: FieldType.float,
            },
            {
              id: "newbalance",
              name: "Nouvelle Balance",
              field: "newbalance",
              sortable: true,
              filterable: true,
              width: 50,
              type: FieldType.float,
            },
            
        ]

        this.gridOptions = {
            enableSorting: true,
            enableCellNavigation: true,
            enableExcelCopyBuffer: true,
            enableFiltering: true,
            autoEdit: true,
            autoHeight: false,
            enableAutoResize:true,
            editable: true,
            frozenColumn: 0,
            frozenBottom: true,
        }

        // fill the dataset with your data
        this.dataset = []
        // this.employeService.getAll().subscribe(
        //     (response: any) => {this.dataset = response.data
        //       this.dataview.setItems(this.dataset)},
        //     (error) => {
        //         this.dataset = []
        //     },
        //     () => {}
        // )
    }
    getDays = (year, month) => {
      return new Date(year, month, 0).getDate();
     
    };
    valide(){
const controls = this.empForm.controls
      var limit = this.getDays(Number(controls.year.value),Number(controls.month.value) )
    
    //     var date1 =  new Date(Number(controls.year.value), Number(controls.month.value) - 1, 1)
     //    var date2 =  new Date(Number(controls.year.value), Number(controls.month.value) - 1, limit)


         const date1 = `${controls.year.value}/${controls.month.value}/1`
         const date2 = `${controls.year.value}/${controls.month.value}/${limit}`
   
         console.log(date1,date2)
        this.employeService.GetSalary({date1,date2}).subscribe(
            (response: any) => {this.dataset = response.data
              this.dataview.setItems(this.dataset)},
            (error) => {
                this.dataset = []
            },
            () => {}
        )
    }
    onSubmit(){
this.addSo(this.dataset)

    }


    addSo( detail: any) {
      for (let data of detail) {
        delete data.id;
        delete data.cmvid;
       
      }
      this.loadingSubject.next(true);
      let salary = null;
     
      this.employeService
        .addSalary({ empDetails: detail })
        .subscribe(
          (reponse: any) => {
            salary = reponse.data
          	
          },
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
            console.log(this.dataset);
            //if(controls.print.value == true) this.printpdf(so.so_nbr) //printSO(this.customer, this.dataset, so);
            this.router.navigateByUrl("/");
          }
        );
    }
}
