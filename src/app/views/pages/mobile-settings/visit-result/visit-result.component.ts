import { array } from '@amcharts/amcharts4/core';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDropdownConfig, NgbModal, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"
import { AngularGridInstance, Column, FieldType, GridOption, OnEventArgs, GridService, Editors, thousandSeparatorFormatted, Formatters } from 'angular-slickgrid';

import { BehaviorSubject, Observable } from 'rxjs';
import { LayoutUtilsService, MessageType } from 'src/app/core/_base/crud';
import { MobileServiceService, MobileService, RoleService, ItineraryService } from "../../../../core/erp"
import {   MobileSettingsService} from "../../../../core/erp"
@Component({
  selector: 'kt-visit-result',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './visit-result.component.html',
  styleUrls: ['./visit-result.component.scss']
})
export class VisitResultComponent implements OnInit {
  service: MobileService
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
  
  public nodes = [];
  confirmDelete: boolean;
  alertWarning: string;

  constructor(
    config: NgbDropdownConfig,
        private serviceF : FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private modalService: NgbModal,
        private mobileSettingsService : MobileSettingsService,
  ) { 
        config.autoClose = true
        // this.prepareVisitResult()
        // this.fillDataset()
        this.prepareGrid()
        
        // this.gridService.highlightRow("")
  }

  
  gridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;
    this.gridService = angularGrid.gridService;
  }

  ngOnInit(): void {
        this.loading$ = this.loadingSubject.asObservable()
        this.loadingSubject.next(false)
        // this.createForm()
        
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
      return  elem.id == ""
    })
    console.log('create list :' + this.newVisitResults.length)

   
  }

  
  prepareGrid() {
    this.columnDefinitions = [
              {
                id: 'delete',
                field: 'id',
                excludeFromColumnPicker: true,
                excludeFromGridMenu: true,
                excludeFromHeaderMenu: true,
                formatter: Formatters.deleteIcon,
                minWidth: 30,
                maxWidth: 30,
                onCellClick: (e: Event, args: OnEventArgs) => {
                  // this.confirmDelete = true
                  this.alertWarning = `Deleting: ${args.dataContext.cluster_code}`;
                  // this.deleteCluster(args.dataContext.id)
                  // this.dataset = this.dataset.filter(function(value, index, arr){ 
                  //   return value.id != args.dataContext.id;
                  // })
                  // this.dataView.setItems(this.dataset)
                  this.addToDeletedIds(args.dataContext.id)
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
                  id: "visitresult_code",
                  name: "Code du résultat de la visite",
                  field: "visitresult_code",
                  sortable: true,
                  editor: {
                    model: Editors.text,
                  },
                  minWidth: 70,
                  maxWidth: 100,
                  filterable: true,
                  type: FieldType.string,
                  onCellChange: (e: Event, args: OnEventArgs) => {
                    this.addToUpdatedIds(args.dataContext.id)
                    //  this.dataView.getItemById(args.dataContext.id)
                    // console.log(Object.keys(this.dataView))
                  },
              },
              {
                  id: "name",
                  name: "Nom du résultat de la visite",
                  field: "name",
                  sortable: true,
                  editor: {
                    model: Editors.text,
                  },
                  minWidth: 100,
                  maxWidth: 300,
                  filterable: true,
                  type: FieldType.string,
                  onCellChange: (e: Event, args: OnEventArgs) => {
                    this.addToUpdatedIds(args.dataContext.id)
                    // this.dataView.getItemById(args.dataContext.id).meta
                    // console.log(Object.keys(this.dataView))
                  },
              },
              {
                id: "rank",
                name: "Rang",
                field: "rank",
                sortable: true,
                minWidth: 70,
                maxWidth: 100,
                filterable: true,  
                editor: {
                  model: Editors.text,
                },
                type: FieldType.string,
                onCellChange: (e: Event, args: OnEventArgs) => {
                  this.addToUpdatedIds(args.dataContext.id)
                  // this.dataView.getItemById(args.dataContext.id).meta
                  // console.log(Object.keys(this.dataView))
                },
              },
              {
                id: "revisit",
                name: "Revisiter",
                field: "revisit",
                minWidth: 70,
                maxWidth: 100,
                sortable: true,
                editor: {
                  model: Editors.checkbox,
                },
                filterable: true,
                type: FieldType.boolean,
                onCellChange: (e: Event, args: OnEventArgs) => {
                  this.addToUpdatedIds(args.dataContext.id)
                  // this.dataView.getItemById(args.dataContext.id).meta
                  // console.log(Object.keys(this.dataView))
                },
              },   
        ]

    this.gridOptions = {
        editable: true,
        enableSorting: true,
        autoEdit: false,  
        autoHeight: false,
        enableFiltering: true,
        enableAddRow:true,
        enableCellNavigation: true,
        // enableExcelCopyBuffer: true,
          enableRowSelection: true,
        // enableCheckboxSelector: true,
        //  frozenColumn: 0,
        // frozenBottom: true,
        checkboxSelector: {
          hideSelectAllCheckbox: true,
        },
        multiSelect: false,
        rowSelectionOptions: {
            selectActiveRow: true,
        }, 
    }


    this.mobileSettingsService.getAllVisitResult().subscribe(
      (response: any) => {
        this.dataset = response.visitList
        // this.grid.invalidate();
        // this.grid.render();
        // this.dataView.refresh()
        this.dataView.setItems(this.dataset)
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

    // 
    this.mobileSettingsService.submitVisitListData(
      {visitResults: this.newVisitResults},
      {deleteIds : this.deleteIds},
      {updateData :updateData }
      ).subscribe(
      (response: any) => {
        console.log(response.updatedResults)
        this.dataset = response.newVisitResults
        this.dataView.setItems(this.dataset)
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

createForm(row) {
  console.log(row)
  this.loadingSubject.next(false)
  this.service = new MobileService()
  this.createServiceForm = this.serviceF.group({
    id :[row.id ],
    visitresult_code: [row.service, Validators.required],
    name: [row.name, Validators.required],
    rank: [row.rank, Validators.required], 
    revisit:  [row.revisit, Validators.required], 
  })
}



angularGridReady(angularGrid: AngularGridInstance) {
  this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;

    // if you want to change background color of Duration over 50 right after page load,
    // you would put the code here, also make sure to re-render the grid for the styling to be applied right away
    this.dataView.getItemMetadata = this.updateItemMetadata(this.dataView.getItemMetadata);
    this.grid.invalidate();
    this.grid.render();
}

updateItemMetadata(previousItemMetadata: any) {
  const newCssClass = 'highlight-bg';
  return (rowNumber: number) => {
    const item = this.dataView.getItem(rowNumber);
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

addNewItem() {
  this.angularGrid.gridService.addItem(
    {
      // id: this.dataset.length + 1,
      id : "",
      visitresult_code:"", 
      name: "", 
      rank: "", 
      revisit: true
    },
    { position: "bottom" }
  );
}


}
