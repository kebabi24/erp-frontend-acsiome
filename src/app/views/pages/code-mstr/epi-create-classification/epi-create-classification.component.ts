import { array } from '@amcharts/amcharts4/core';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDropdownConfig, NgbModal, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"
import { AngularGridInstance, Column, FieldType, GridOption, OnEventArgs,Formatter, GridService, Editors, thousandSeparatorFormatted, Formatters } from 'angular-slickgrid';

import { BehaviorSubject, Observable } from 'rxjs';
import { LayoutUtilsService, MessageType } from 'src/app/core/_base/crud';
import {   CodeService} from "../../../../core/erp"
const myCustomStringFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>{
  if (value!= null){
    return `<div class="text"  aria-hidden="${value}" style="font-size:14px; font-weight: bold;" >${value}</div>`
  }
}
@Component({  
  selector: 'kt-epi-create-classification',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './epi-create-classification.component.html',
  styleUrls: ['./epi-create-classification.component.scss']
})
export class EpiCreateClassificationComponent implements OnInit {
  
  serviceForm: FormGroup
  createServiceForm: FormGroup
  hasFormErrors = false
  isExist = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  services: []
  roles : string[] = []
  itinerary: string[] = []
  dataset: any[] = []
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  gridObj: any
  angularGrid: AngularGridInstance
  gridService: GridService
  message: any
  column : Column
  grid: any
  dataView: any
  selectedRow: any
  isSelected = false
  // selectedIndex :any 
  updateIds : any [] = []
  newVisitResults : any [] = []
  deleteIds : any [] = []
  
  datasettr: any = []
  columnDefinitionstr: Column[] = []
  gridOptionstr: GridOption = {}
  gridObjtr: any
  angularGridtr: AngularGridInstance
  gridServicetr: GridService
  gridtr: any
  dataViewtr: any
code:any

  public nodes = [];
  confirmDelete: boolean;
  alertWarning: string;
indexd:any
field:any
  constructor(
    config: NgbDropdownConfig,
        private serviceF : FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private modalService: NgbModal,
        private codeService : CodeService,
        private layoutUtilsService: LayoutUtilsService,
  ) { 
        config.autoClose = true
        // this.prepareVisitResult()
        // this.fillDataset()
        //this.prepareGrid()
        
        // this.gridService.highlightRow("")
  }

  
  

  ngOnInit(): void {
        this.loading$ = this.loadingSubject.asObservable()
        this.loadingSubject.next(false)
        // this.createForm()
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
                  this.codeService.getByOne(
                    {code_fldname:args.dataContext.code_fldname,chr01: args.dataContext.code_value},
                    ).subscribe(
                    (response: any) => {
                      console.log(response.data)
                     if(response.data != null) {
                      alert("Rubriques existent pour ce code")
                     }
                      else {

                        this.indexd = args.dataContext.id
                        this.field = args.dataContext.code_fldname
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
                  name: "Code Classification",
                  field: "code_value",
                  sortable: true,
                  editor: {
                    model: Editors.text,
                  },
                  minWidth: 70,
                  maxWidth: 100,
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
                  minWidth: 100,
                  maxWidth: 300,
                  filterable: true,
                  type: FieldType.string,
                  formatter:myCustomStringFormatter,
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
                  name: "Lié à",
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
                    if(args.dataContext.etat_service != true){
                      this.addToUpdatedIds(args.dataContext.id)
                   }
                    // this.dataView.getItemById(args.dataContext.id).meta
                    // console.log(Object.keys(this.dataView))
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


    this.codeService.getBy({code_desc:"EPI"}).subscribe(
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
    this.codeService.submitData(
      {domain: this.newVisitResults},
      {updateData :updateData },
      {}
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

handleSelectedRowsChanged(e, args) {
  if (Array.isArray(args.rows) && this.grid) {
      args.rows.map((idx) => {
          const item = this.grid.getDataItem(idx)
          item.etat_service = false
          this.selectedRow = item
          console.log(item)
         
      })
  }
  this.isSelected = true
  // this.createForm(this.selectedRow)
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
  this.dataView = angularGrid.dataView;
  this.grid = angularGrid.slickGrid;
  this.gridService = angularGrid.gridService;

  // if you want to change background color of Duration over 50 right after page load,
  // you would put the code here, also make sure to re-render the grid for the styling to be applied right away
  // this.dataView.getItemMetadata = this.updateItemMetadata(this.dataView.getItemMetadata);
  this.grid.invalidate();
  this.grid.render();
}

// updateItemMetadata(previousItemMetadata: any) {
//   const newCssClass = "highlight-bg";
//   // console.log(this.dataView);
//   return (rowNumber: number) => {
//     const item = this.dataView.getItem(rowNumber);
//     let meta = {
//       cssClasses: "",
//     };
//     if (typeof previousItemMetadata === "object") {
//       meta = previousItemMetadata(rowNumber);
//     }
      
//     if (meta && item && item.bool05) {
//       const state = item.bool05;
//       if (state === true) {
//         meta.cssClasses = (meta.cssClasses || "") + " " + newCssClass;
//       }
//     }

//     return meta;
//   };
// }

addNewItemF() {
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
      code_fldname:"pt_prod_line",
      code_value:"", 
      code_cmmt: "", 
      etat_service:true,
      code_desc:'EPI',
      chr02:'FAMILLE'
      
    },
    { position: "top" }
  );
}
addNewItemS() {
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
      code_fldname:"pt_part_type",
      code_value:"", 
      code_cmmt: "", 
      etat_service:true,
      code_desc:'EPI',
      chr02:'SOUS-FAMILLE'
      
    },
    { position: "top" }
  );
}
addNewItemG() {
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
      code_fldname:"pt_group",
      code_value:"", 
      code_cmmt: "", 
      etat_service:true,
      code_desc:'EPI',
      chr02:'GROUPE'
      
    },
    { position: "top" }
  );
}
addNewItemA() {
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
      code_fldname:"pt_draw",
      code_value:"", 
      code_cmmt: "", 
      etat_service:true,
      code_desc:'EPI',
      chr02:'ARTICLE'
      
    },
    { position: "top" }
  );
}
addNewItemM() {
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
      code_fldname:"pt_model",
      code_value:"", 
      code_cmmt: "", 
      etat_service:true,
      code_desc:'EPI',
      chr02:'MODELE'
      
    },
    { position: "top" }
  );
}
addNewItemT() {
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
      code_fldname:"pt_rev",
      code_value:"", 
      code_cmmt: "", 
      etat_service:true,
      code_desc:'EPI',
      chr02:'TAILLE'
      
    },
    { position: "top" }
  );
}
addNewItemC() {
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
      code_fldname:"pt_break_cat",
      code_value:"", 
      code_cmmt: "", 
      etat_service:true,
      code_desc:'EPI',
      chr02:'COULEUR'
      
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
  field:this.field
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

onSelectedRowsChanged(e,args) {
  // console.log('indexs', args.rows);
  const index = args.rows;
  
  this.code = this.gridService.getDataItemByRowIndex(index).code_value
  this.field = this.gridService.getDataItemByRowIndex(index).code_fldname
  console.log(this.field, this.code)
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
  this.codeService.getBy(
    {chr01: this.code,code_desc:'EPI'},
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
angularGridReadytr(angularGrid: AngularGridInstance) {
  this.angularGridtr = angularGrid;
  this.dataViewtr = angularGrid.dataView;
  this.gridtr = angularGrid.slickGrid;
  this.gridServicetr = angularGrid.gridService;
  
 
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
            id: "code_value",
            name: "Code Classification",
            field: "code_value",
            sortable: true,
            minWidth: 70,
            maxWidth: 120,          
            type: FieldType.string,
        },
        {
            id: "code_cmmt",
            name: "Désignation",
            field: "code_cmmt",
            sortable: true,
            minWidth: 100,
            maxWidth: 350,
            type: FieldType.string,
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

