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
  Formatters,
  GridOption,
  GridService,
  Grouping,
  GroupingGetterFunction,
  GroupTotalFormatters,
  SortDirectionNumber,
  Sorters,
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
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap"
import { Provider, ProviderService,Address , AddressService} from "../../../../core/erp"
const myCustomCheckboxFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
  value ? `<div class="text"  aria-hidden="true">Oui</div>` : '<div class="text"  aria-hidden="true">Non</div>';
  
@Component({
  selector: 'kt-providers-list',
  templateUrl: './providers-list.component.html',
  styleUrls: ['./providers-list.component.scss']
})
export class ProvidersListComponent implements OnInit {

  loadingSubject = new BehaviorSubject<boolean>(true)
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: any[] = [];
  draggableGroupingPlugin: any;
  angularGrid: AngularGridInstance;
  grid: any
  gridService: GridService
  dataview: any;
  vdaddr : any 
  vdname : any
  idaddr:any
  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private addressService: AddressService,
      private providerService: ProviderService,
      private modalService: NgbModal,
  ) {
      this.prepareGrid()
  }

  ngOnInit(): void {
  }
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid
    this.dataview = angularGrid.dataView
    this.grid = angularGrid.slickGrid
    this.gridService = angularGrid.gridService
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
                     <a class="btn btn-sm btn-clean btn-icon mr-2" title="Modifier Fournisseur">
                     <i class="flaticon2-pen"></i>
                 </a>
                 `;
              },
              minWidth: 50,
              maxWidth: 50,
              // use onCellClick OR grid.onClick.subscribe which you can see down below
              onCellClick: (e: Event, args: OnEventArgs) => {
                  const id = args.dataContext.id
                  this.router.navigateByUrl(`/providers/edit/${id}`)
              },
          },
          {
            id: "delete",
            field: "id",
            excludeFromColumnPicker: true,
            excludeFromGridMenu: true,
            excludeFromHeaderMenu: true,
            formatter: (row, cell, value, columnDef, dataContext) => {
             // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
             return `
                  <a class="btn btn-sm btn-clean btn-icon mr-2" title="Suprimer DA">
                  <i class="flaticon-delete
                  "></i>
              </a>
              `;
           },
            minWidth: 50,
            maxWidth: 50,
            // use onCellClick OR grid.onClick.subscribe which you can see down below
            onCellClick: (e: Event, args: OnEventArgs) => {
              const id = args.dataContext.id
              this.idaddr = args.dataContext.id
              console.log(id)
            
             
                this.vdaddr = args.dataContext.vd_addr
                this.vdname = args.dataContext.address.ad_name
                console.log(this.vdaddr)
                let element: HTMLElement = document.getElementById('deleteDAGrid') as HTMLElement;
                element.click();
             
          },
          },
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
            id: "vd_sort",
            name: "Activité",
            field: "vd_sort",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "vd_balance",
            name: "Solde",
            field: "vd_balance",
            sortable: true,
            filterable: true,
            type: FieldType.float,
          },
          {
            id: "ad_line1",
            name: "Adresse",
            field: "address.ad_line1",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },

          {
            id: "ad_phone",
            name: "Téléphone",
            field: "address.ad_phone",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "ad_pst",
            name: "Email",
            field: "address.ad_pst",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "vd_hold",
            name: "Statut Inactif",
            field: "vd_hold",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "ad_taxc",
            name: "TVA",
            field: "address.ad_taxc",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "vd_ckfrm",
            name: "Mode paiement",
            field: "vd_ckfrm",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          
          {
            id: "vd_cr_terms",
            name: "Délai",
            field: "vd_cr_terms",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "vd_type",
            name: "Type",
            field: "vd_type",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          }, 
          {
            id: "vd_sequence",
            name: "Sequence",
            field: "vd_seq",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "createdAt",
            name: "crée le",
            field: "createdAt",
            sortable: true,
            filterable: true,
            type: FieldType.date,
          },

          {
            id: "created_by",
            name: "Par",
            field: "created_by",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },

          {
            id: "updatedAt",
            name: "modifié le",
            field: "updatedAt",
            sortable: true,
            filterable: true,
            type: FieldType.date,
          },

          {
            id: "last_modified_by",
            name: "Par",
            field: "last_modified_by",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },


      ]

      this.gridOptions = {
          enableSorting: true,
          enableCellNavigation: true,
          enableExcelCopyBuffer: true,
          enableFiltering: true,
          autoEdit: false,
          autoHeight: false,
          enableAutoResize:true,
         
          autoFitColumnsOnFirstLoad: false,
          enableAutoSizeColumns: false,
          // then enable resize by content with these 2 flags
          autosizeColumnsByCellContentOnFirstLoad: true,
          enableAutoResizeColumnsByCellContent: true,

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

















      }

      // fill the dataset with your data
      this.dataset = []
      this.providerService.getAll().subscribe(
          (response: any) => {this.dataset = response.data
            this.dataview.setItems(this.dataset);
          },
          (error) => {
              this.dataset = []
          },
          () => {}
      )
  }
  vendor() {
    
      
    const url = `/providers/add`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  
  }
  stklist() {
  
    
    const url = `/inventory-transaction/inventory-list`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  
  }
  polist() {
  
    
    const url = `/inventory-transaction/transaction-list`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  
  }
  
  open(content) {
    this.modalService.open(content, { size: "lg" })
}

deleteProvider() {
  this.providerService.delete( this.idaddr ).subscribe(
    (reponse:any) =>   {
      console.log("here",reponse.message)
      if(reponse.bool == false) {
        this.layoutUtilsService.showActionNotification(
            "Supression  avec succès",
            MessageType.Create,
            10000,
            true,
            true
        )
        window.location.reload()
      }else {
        alert(reponse.message)
      }
        this.loadingSubject.next(false)
        this.modalService.dismissAll()
       
    },
  
     
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
 
  ) 
}

}
