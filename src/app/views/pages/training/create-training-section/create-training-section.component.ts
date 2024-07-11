import { array } from '@amcharts/amcharts4/core';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDropdownConfig, NgbModal, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"
import { AngularGridInstance, Column, FieldType, GridOption, OnEventArgs, GridService, Editors,Formatter, thousandSeparatorFormatted, Formatters } from 'angular-slickgrid';

import { BehaviorSubject, Observable } from 'rxjs';
import { LayoutUtilsService, MessageType } from 'src/app/core/_base/crud';
import {   CodeService,ItemService} from "../../../../core/erp"

const myCustomStringFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>{
  if (value!= null){
    return `<div class="text"  aria-hidden="${value}" style="font-size:14px; font-weight: bold;" >${value}</div>`
  }
}
@Component({
  selector: 'kt-create-training-section',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './create-training-section.component.html',
  styleUrls: ['./create-training-section.component.scss']
})
export class CreateTrainingSectionComponent implements OnInit {
  serviceForm: FormGroup
  createServiceForm: FormGroup
  hasFormErrors = false
  isExist = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  services: []
  roles : string[] = []
  itinerary: string[] = []
  angularGrid: AngularGridInstance;
  grid: any;
  gridService: GridService;
  dataView: any;
  gridObj: any;
  dataviewObj: any;
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any = []; // dataset

  datasettr: any = []
  columnDefinitionstr: Column[] = []
  gridOptionstr: GridOption = {}
  gridObjtr: any
  angularGridtr: AngularGridInstance
  gridServicetr: GridService
  gridtr: any
  dataViewtr: any
  message: any
  column : Column
  
  selectedRow: any
  isSelected = false
  // selectedIndex :any 
  updateIds : any [] = []
  newVisitResults : any [] = []
  deleteIds : any [] = []
  
  public nodes = [];
  confirmDelete: boolean;
  alertWarning: string;
  row_number;
  indexd:any
  codes: [];
  columnDefinitions1: Column[] = [];
  gridOptions1: GridOption = {};
  gridObj1: any;
  angularGrid1: AngularGridInstance;
  group : any
  constructor(
    config: NgbDropdownConfig,
        private serviceF : FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private modalService: NgbModal,
        private codeService : CodeService,
        private itemService : ItemService,
        private layoutUtilsService: LayoutUtilsService,
  ) { 
        config.autoClose = true
        // this.prepareVisitResult()
        // this.fillDataset()
      
        // this.gridService.highlightRow("")
  }

  
  

  ngOnInit(): void {
        this.loading$ = this.loadingSubject.asObservable()
        this.loadingSubject.next(false)
        this.initData()
        this.prepareGrid()
        this.prepareGridtr()
        
  }

  open(content) {
    this.modalService.open(content, { size: "lg" })
  }

  open2(content) {
    this.modalService.open(content, { size: "lg" })
  }

  addToUpdatedIds(index){
    if(!this.updateIds.includes(index)){
      this.updateIds.push(index)
    }
    console.log('update list :' + this.updateIds)
    // const element = this.dataset.filter(function(e){
    //   return e.id == index;
    // })
    // console.log(element)
  }

  addToDeletedIds(index){
    if(!this.deleteIds.includes(index)){
      this.deleteIds.push(index)
    }
    console.log('delete list :' + this.deleteIds)
  }

  addToCreateIds(){
    // if(!this.createIds.includes(index)){
    //   this.createIds.push(index)
    // }
    this.newVisitResults = this.dataset.filter(function(elem){
      return  elem.etat_service == true
    })
    console.log('create list :' + this.newVisitResults.length)

   
  }

  
  prepareGrid() {
    this.columnDefinitions = [
              {
                id: 'delete',
                field: 'bool05',
                excludeFromColumnPicker: true,
                excludeFromGridMenu: true,
                excludeFromHeaderMenu: true,
                formatter: Formatters.deleteIcon,
                minWidth: 30,
                maxWidth: 30,
                onCellClick: (e: Event, args: OnEventArgs) => {
                  // this.confirmDelete = true
                  this.alertWarning = `Deleting: ${args.dataContext.id}`;
                  // this.deleteCluster(args.dataContext.id)
                  // this.dataset = this.dataset.filter(function(value, index, arr){ 
                  //   return value.id != args.dataContext.id;
                  // })
                  // this.dataView.setItems(this.dataset)
                  console.log(args.dataContext.id)
                 
                

                  console.log(args.dataContext.id)
                  this.itemService.getByOne(
                    {pt_group: args.dataContext.code_value},
                    ).subscribe(
                    (response: any) => {
                      console.log(response.data)
                     if(response.data != null) {
                      alert("Formations existent pour ce code")
                     }
                      else {

                        this.indexd = args.dataContext.id
                        console.log(this.dataView.getIdxById(args.dataContext.id))
                        let element: HTMLElement = document.getElementById("openDeletesGrid") as HTMLElement;
                        element.click();
      
                      }
                    
                      //this.dataViewtr.setItems(this.datasettr)
                       
                    },
                    (error) => {
                        console.log(error)
                    },
                  )
                
                
                //   this.angularGrid.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, bool05:true });
                //   this.addToDeletedIds(args.dataContext.id)
                //  console.log(args.dataContext.bool05)
                //  this.dataView.setItems(this.dataset)
               
                //   this.angularGrid.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, bool05:true });
                //   this.addToDeletedIds(args.dataContext.id)
                //  console.log(args.dataContext.bool05)
                //  this.dataView.setItems(this.dataset)
                }
                
              },
              // {
              //     id: "id",
              //     name: "id",
              //     field: "id",
              //     excludeFromHeaderMenu: true,
              //     minWidth: 40,
              //     maxWidth: 60,
              //     sortable:true,
              // },
              {
                  id: "code_value",
                  name: "Code Rubrique",
                  field: "code_value",
                  sortable: true,
                  editor: {
                    model: Editors.text,
                  },
                  minWidth: 70,
                  maxWidth: 150,
                  resizeExtraWidthPadding: 20,
                  filterable: true,
                  type: FieldType.string,
                  formatter:myCustomStringFormatter,
                  onCellChange: (e: Event, args: OnEventArgs) => {
                    
                    if(args.dataContext.etat_service != true){
                       this.addToUpdatedIds(args.dataContext.id)
                    }
                    //  this.dataView.getItemById(args.dataContext.id)
                    // console.log(Object.keys(this.dataView))
                  },
              },
              {
                  id: "code_cmmt",
                  name: "Désignation",
                  field: "code_cmmt",
                  sortable: true,
                  editor: {
                    model: Editors.text,
                  },
                  formatter:myCustomStringFormatter,
                  minWidth: 100,
                  maxWidth: 300,
                  filterable: true,
                  type: FieldType.string,
                  onCellChange: (e: Event, args: OnEventArgs) => {
                    if(args.dataContext.etat_service != true){
                      this.addToUpdatedIds(args.dataContext.id)
                   }
                    // this.dataView.getItemById(args.dataContext.id).meta
                    // console.log(Object.keys(this.dataView))
                  },
              },      
              {
                id: "chr01",
                name: "Domaine",
                field: "chr01",
                sortable: true,
               
                editor: {
                  model: Editors.text,
                },
                minWidth: 100,
                maxWidth: 300,
                filterable: true,
                type: FieldType.string,
                formatter:myCustomStringFormatter,
                
                onCellChange: (e: Event, args: OnEventArgs) => {
                  this.codeService.getByOne({code_fldname:"pt_draw", code_value: args.dataContext.chr01 }).subscribe((response: any) => {
                    if (!response.data) {
                      alert("Domaine N'existe pas");
                      this.angularGrid.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, chr01: null });
                    }
                  });
                  if(args.dataContext.etat_service != true){
                    this.addToUpdatedIds(args.dataContext.id)
                 }
                  // this.dataView.getItemById(args.dataContext.id).meta
                  // console.log(Object.keys(this.dataView))
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
                let element: HTMLElement = document.getElementById("openCodesGrid") as HTMLElement;
                element.click();
              },
            }, 
            ]

    this.gridOptions = {
      editable:true,
      rowHeight: 40,
      enableAutoResize:true,
      autoFitColumnsOnFirstLoad: false,
    enableAutoSizeColumns: false,
    

    // then enable resize by content with these 2 flags
    autosizeColumnsByCellContentOnFirstLoad: true,
    enableAutoResizeColumnsByCellContent: true,
      autoHeight:false,
      enableCellNavigation: true,
      enableRowSelection: true,
      enableCheckboxSelector: true,
      checkboxSelector: {
          hideSelectAllCheckbox: true,
        },
      rowSelectionOptions: {
        selectActiveRow: true,
      },
      enableFiltering:true,
      
    
    

        presets: {
          sorters: [{ columnId: "id", direction: "ASC" }],
        } 
    }


    this.codeService.getBy({code_fldname:"pt_group"}).subscribe(
      (response: any) => {
        this.dataset = response.data
          console.log(this.dataset)
       // this.dataset.push();
        // this.grid.invalidate();
        // this.grid.render();
        // this.dataView.refresh()
        //this.dataView.setItems(this.dataset)
      },
      (error) => {
        this.dataset = []
    
      },
      () => {}
      )
    

  }

  initData(){
  
    
    this.codeService.getBy({code_fldname:"pt_group"}).subscribe(
      (response: any) => {
        this.dataset = response.data
          console.log(this.dataset)
       // this.dataset.push();
        // this.grid.invalidate();
        // this.grid.render();
        // this.dataView.refresh()
        //this.dataView.setItems(this.dataset)
      },
      (error) => {
        this.dataset = []
    
      },
      () => {}
      )
    

   }
  onSubmit() {
    // GET THE IDS TO BE ADDED 
    this.addToCreateIds()

    const updateData = []
    
    // fill updateData with the updated data from dataset 
    this.updateIds.forEach(index => {
      const element = this.dataset.filter(function(e){
        return e.id == index;
      })
      updateData.push(...element)
    });

    for (let data of this.newVisitResults ) {
      delete data.id
    }
    console.log("this.newVisitResults",this.newVisitResults)
    this.codeService.submitDomainData(
      {domain: this.newVisitResults},
      {updateData :updateData },
      {field: "pt_group"}
      ).subscribe(
      (response: any) => {
        console.log(response.updatedResults)
        this.dataset = response.newVisitResults
        this.dataView.setItems(this.dataset)
        this.layoutUtilsService.showActionNotification(
          "Ajout avec succès",
          MessageType.Create,
          10000,
          true,
          true
        );
        this.loadingSubject.next(false);
      },
      (error) => {
          console.log(error)
      },
    )
  }

 

  goBack() {
    this.loadingSubject.next(false)
    const url = `/service`
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}

// handleSelectedRowsChanged(e, args) {
//   let updateItem = this.angularGrid.gridService.getDataItemByRowIndex(this.row_number);
//   if (Array.isArray(args.rows) && this.gridObjtr) {
//     args.rows.map((idx) => {
      
//           const item = this.grid.getDataItem(idx)
//           console.log(item);
//           item.etat_service = false
//           this.selectedRow = item
//           console.log("here",item)
//           this.itemService.getByOne(
//             {pt_group: item.code_value},
//             ).subscribe(
//             (response: any) => {
//               console.log(response.data)
//               this.datasettr = response.data
//               this.dataViewtr.setItems(this.datasettr)
              
              
//             },
//             (error) => {
//                 console.log(error)
//             },
//           )
         
//       })
//   }
//   this.isSelected = true
//   // this.createForm(this.selectedRow)
// }
onSelectedRowsChanged(e,args) {
  // console.log('indexs', args.rows);
  const index = args.rows;
  
  this.group = this.gridService.getDataItemByRowIndex(index).code_value
  console.log("this.group", this.group)
  // this.itemService.getByOne(
  //   {pt_group: this.group},
  //   ).subscribe(
  //   (response: any) => {
  //     console.log(response.data)
  //     this.datasettr = response.data
  //     this.dataViewtr.setItems(this.datasettr)
      
      
  //   },
  //   (error) => {
  //       console.log(error)
  //   },
  // )
 
this.updateData()
}
updateData(){
console.log("hereeeeeeeeeeeeeeeeee")
  this.itemService.getBy(
    {pt_group: this.group},
    ).subscribe(
    (response: any) => {
      console.log(response.data)
      this.datasettr = response.data
      console.log(this.datasettr)
      
    
      this.dataViewtr.setItems(this.datasettr)
       
    },
    (error) => {
        console.log(error)
    },
  )

}
// createForm(row) {
//   console.log(row)
//   this.loadingSubject.next(false)
//   this.service = new MobileService()
//   this.createServiceForm = this.serviceF.group({
//     id :[row.id ],
//     visitresult_code: [row.service, Validators.required],
//     name: [row.name, Validators.required],
//     rank: [row.rank, Validators.required], 
//     revisit:  [row.revisit, Validators.required], 
//   })
// }



angularGridReady(angularGrid: AngularGridInstance) {
  this.angularGrid = angularGrid;
  this.grid = angularGrid.slickGrid; // grid object
  this.dataView = angularGrid.dataView;
  this.gridService = angularGrid.gridService;
 // this.dataView.getItemMetadata = this.updateItemMetadata();
  // this.dataView.getItemMetadata = function(idx) {
  //   return {cssClasses: ".slick-cell"}
  // };
  // this.grid.invalidate();
  // this.grid.render();

}
updateItemMetadata() {
  const newCssClass = "slick-cell";
  // console.log(this.dataView);
  
    //const item = this.dataView.getItem(rowNumber);
    let meta = {
      cssClasses: "",
    };
    

   
      
        meta.cssClasses = (meta.cssClasses || "") + " " + newCssClass;
      
   
    return meta;
  }
angularGridReadytr(angularGrid: AngularGridInstance) {
  this.angularGridtr = angularGrid;
  this.dataViewtr = angularGrid.dataView;
  this.gridtr = angularGrid.slickGrid;
  this.gridServicetr = angularGrid.gridService;
  
 
}

addNewItem() {
  var maxObj = null;
      var iddd = 0;
  if (this.dataset.length > 0) {
    maxObj = this.dataset.reduce((accumulator, current) => {
      return accumulator.id > current.id ? accumulator : current;
    });
    console.log(maxObj.id + 1);
    iddd = maxObj.id + 1;
  } else {
    iddd = 1;
  }
  this.angularGrid.gridService.addItem(
    {
      // id: this.dataset.length + 1,
      id : iddd,
      code_value:"", 
      code_cmmt: "", 
      chr01: "",
      etat_service:true
      
    },
    { position: "top" }
  );
}
openDelete(content) {
  this.modalService.open(content, { size: "lg" });
}
confirmDeleting(){
 // let updateItem = this.gridService.getDataItemByRowIndex(this.indexd);
 this.codeService.deletes(
  {id:this.indexd,
  field:"pt_group"
  }
  ).subscribe(
  (response: any) => {
     console.log(response.data)
      this.dataset = response.data
     this.dataView.setItems(this.dataset)
    this.layoutUtilsService.showActionNotification(
      "Supression avec succès",
      MessageType.Create,
      10000,
      true,
      true
    );
    this.loadingSubject.next(false);
  },
  (error) => {
      console.log(error)
  },
)
this.modalService.dismissAll()
}

handleSelectedRowsChanged1(e, args) {
  let updateItem = this.angularGrid.gridService.getDataItemByRowIndex(this.row_number);
  if (Array.isArray(args.rows) && this.gridObj1) {
    args.rows.map((idx) => {
      const item = this.gridObj1.getDataItem(idx);
      console.log(item);
      
     
      updateItem.chr01 = item.code_value;

     this.angularGrid.gridService.updateItem(updateItem);
     if(updateItem.etat_service != true){
      this.addToUpdatedIds(updateItem.id)
   }
    });
  }



}

angularGridReady1(angularGrid: AngularGridInstance) {
  this.angularGrid1 = angularGrid;
  this.gridObj1 = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGrid1() {
  this.columnDefinitions1 = [
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
      name: "code Domaine",
      field: "code_value",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "code_cmmt",
      name: "Désignation",
      field: "code_cmmt",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    
  ];

  this.gridOptions1 = {
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

  this.codeService.getBy({ code_fldname: "pt_draw" }).subscribe((response: any) => (this.codes = response.data));
}
openCode(content) {
  this.prepareGrid1();
  this.modalService.open(content, { size: "lg" });
}





prepareGridtr() {
  this.columnDefinitionstr = [
        {
            id: "id",
            name: "id",
            field: "id",
            excludeFromHeaderMenu: true,
            minWidth: 40,
            maxWidth: 60,
            sortable:true,
        },
        {
            id: "pt_part",
            name: "Code Formation",
            field: "pt_part",
            sortable: true,
            minWidth: 70,
            maxWidth: 120,          
            type: FieldType.string,
        },
        {
            id: "pt_desc1",
            name: "Désignation",
            field: "pt_desc1",
            sortable: true,
            minWidth: 100,
            maxWidth: 350,
            type: FieldType.string,
        },      
        {
          id: "pt_draw",
          name: "Domaine",
          field: "pt_draw",
          type: FieldType.string,
          sortable: true,
         
        },    
          
        {
          id: "pt_formula",
          name: "Int / Ext",
          field: "pt_formula",
          type: FieldType.boolean,
          formatter: Formatters.checkmark,
          sortable: true,
         
        },      
      ]

  this.gridOptionstr = {
   
    rowHeight: 40,
    enableAutoResize:true,
    autoHeight:false,
    enableCellNavigation: true,
    
    
  
  }

 
}
}
