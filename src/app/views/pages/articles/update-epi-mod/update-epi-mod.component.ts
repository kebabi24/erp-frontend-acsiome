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
  Grouping,
  GroupingGetterFunction,
  GroupTotalFormatters,
  SortDirectionNumber,
  Sorters,
  GridService,
  ColumnFilter,
  Filter,
  FilterArguments,
  FilterCallback,
  OperatorType,
  OperatorString,
  SearchTerm,
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

import { ItemService, CodeService} from "../../../../core/erp"
import { jsPDF } from "jspdf";
import { HttpUtilsService } from "../../../../core/_base/crud"
import { environment } from "../../../../../environments/environment"
import { HttpClient } from "@angular/common/http"
import { L } from "@angular/cdk/keycodes"

const myCustomCheckboxFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
  value ? `<div class="text"  aria-hidden="true">Oui</div>` : '<div class="text"  aria-hidden="true">Non</div>';
  const API_URL_codes = environment.apiUrl + "/codes"

@Component({
  selector: 'kt-update-epi-mod',
  templateUrl: './update-epi-mod.component.html',
  styleUrls: ['./update-epi-mod.component.scss']
})
export class UpdateEpiModComponent implements OnInit {

  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []
  draggableGroupingPlugin: any;
  angularGrid: AngularGridInstance;
loadingSubject = new BehaviorSubject<boolean>(true);
index: any;
  grid: any;
  gridService: GridService;
  dataview: any;
 
  domain    : any;
  user : any;
  selectedGroupingFields: Array<string | GroupingGetterFunction> = ['', '', ''];
  gridObj: any;
  dataviewObj: any;

  
  constructor(
      private http: HttpClient,
      private httpUtils: HttpUtilsService,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private itemservice:ItemService,
      
  ) {
      this.prepareGrid()
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.domain = JSON.parse(localStorage.getItem("domain"));
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
            id: "pt_site",
            name: "Site",
            field: "pt_site",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'pt_site',
              formatter: (g) => `Site: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                // new Aggregators.Sum('ld_qty_oh'),
                // new Aggregators.Sum('int03')
              ],
              aggregateCollapsed: true,
              collapsed: true,
            }
          }, 
          {
            id: "pt_loc",
            name: "Emplacement",
            field: "pt_loc",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'pt_loc',
              formatter: (g) => `Emplacement: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                // new Aggregators.Sum('ld_qty_oh'),
                // new Aggregators.Sum('int03')
              ],
              aggregateCollapsed: true,
              collapsed: true,
            }
          }, 
          {
            id: "pt_part",
            name: "code",
            field: "pt_part",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
            grouping: {
              getter: 'pt_part',
              formatter: (g) => `Article: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                // new Aggregators.Sum('ld_qty_oh'),
                // new Aggregators.Sum('int03')
              ],
              aggregateCollapsed: true,
              collapsed: true,
              lazyTotalsCalculation:true,
            }
          }, 
          {
            id: "pt_desc1",
            name: "Description",
            field: "pt_desc1",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
            grouping: {
              getter: 'pt_desc1',
              formatter: (g) => `Description: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                // new Aggregators.Sum('ld_qty_oh'),
                // new Aggregators.Sum('int03')
              ],
              aggregateCollapsed: true,
              collapsed: true,
              lazyTotalsCalculation:true,
            }
          }, 
          {
            id: "pt_prod_line",
            name: "Famille",
            field: "pt_prod_line",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            // filter: {collectionAsync:  this.http.get(`${API_URL_codes}/types`),model: Filters.multipleSelect , operator: OperatorType.inContains },
            grouping: {
              getter: 'pt_prod_line',
              formatter: (g) => `Famille: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                // new Aggregators.Sum('ld_qty_oh'),
                // new Aggregators.Sum('int03')
              ],
              aggregateCollapsed: true,
              lazyTotalsCalculation:true,
              collapsed:true
            }
            
          },
           {
            id: "pt_part_type",
            name: "Sous-Famille",
            field: "pt_part_type",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            // filter: {collectionAsync:  this.http.get(`${API_URL_codes}/types`),model: Filters.multipleSelect , operator: OperatorType.inContains },
            grouping: {
              getter: 'pt_part_type',
              formatter: (g) => `Sous-famille: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                // new Aggregators.Sum('ld_qty_oh'),
                // new Aggregators.Sum('int03')
              ],
              aggregateCollapsed: true,
              lazyTotalsCalculation:true,
              collapsed:true
            }
            
          }, 
          {
            id: "pt_draw",
            name: "Article",
            field: "pt_draw",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            filter: {collectionAsync:  this.http.get(`${API_URL_codes}/types`),model: Filters.multipleSelect , operator: OperatorType.inContains },
            grouping: {
              getter: 'pt_draw',
              formatter: (g) => `Article: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                // new Aggregators.Sum('ld_qty_oh'),
                // new Aggregators.Sum('int03')
              ],
              aggregateCollapsed: true,
              lazyTotalsCalculation:true,
              collapsed:true
            }
            
          }, 
           {
            id: "pt_group",
            name: "Groupe",
            field: "pt_group",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            filter: {collectionAsync:  this.http.get(`${API_URL_codes}/etats`),model: Filters.multipleSelect , operator: OperatorType.inContains},
            grouping: {
              getter: 'chr03',
              formatter: (g) => `Sous-famille: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                // new Aggregators.Sum('ld_qty_oh'),
                // new Aggregators.Sum('int03')
              ],
              aggregateCollapsed: true,
              lazyTotalsCalculation:true,
              collapsed:true
            }
            
          },
          {
            id: "pt_break_cat",
            name: "Couleur",
            field: "pt_break_cat",
            sortable: true,
            filterable: true,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            type: FieldType.string,
            filter: {collectionAsync:  this.http.get(`${API_URL_codes}/colors`),model: Filters.multipleSelect , operator: OperatorType.inContains },
            grouping: {
              getter: 'pt_break_cat',
              formatter: (g) => `Couleur: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                
                // new Aggregators.Sum('ld_qty_oh'),
                // new Aggregators.Sum('int03')
              ],
              aggregateCollapsed: true,
              lazyTotalsCalculation:true,
              collapsed:true
            }
            
          }, 
         
          
          {
            id: "pt_rev",
            name: "Taille",
            field: "pt_rev",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            // filter: {collectionAsync:  this.http.get(`${API_URL_codes}/etats`),model: Filters.multipleSelect , operator: OperatorType.inContains},
            grouping: {
              getter: 'pt_rev',
              formatter: (g) => `Taille: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                // new Aggregators.Sum('ld_qty_oh'),
                // new Aggregators.Sum('int03')
              ],
              aggregateCollapsed: true,
              lazyTotalsCalculation:true,
              collapsed:true
            }
            
          },
          {
            id: "pt_status",
            name: "Statut",
            field: "pt_status",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            editor: {model: Editors.text},
            grouping: {
              getter: 'pt_status',
              formatter: (g) => `Statut: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                // new Aggregators.Sum('ld_qty_oh'),
                // new Aggregators.Sum('int03')
              ],
              aggregateCollapsed: true,
              collapsed: true,
              
            }
          }, 
          {
            id: "pt_sfty_stk",
            name: "Stock Minimum",
            field: "pt_sfty_stk",
            sortable: true,
            filterable: true,
            editor: {model: Editors.float},
            type: FieldType.float,
            filter: { model: Filters.compoundInput,operator: OperatorType.rangeInclusive}
            
            
          }, 
          {
            id: "pt_price",
            name: "Prix",
            field: "pt_price",
            sortable: true,
            editor: {model: Editors.float},
            filterable: true,
            type: FieldType.float,
            
          }, 
          {
            id: "idprint",
            field: "idprint",
            excludeFromHeaderMenu: true,
            formatter: (row, cell, value, columnDef, dataContext) => {
              // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
              return `
                    <a class="btn btn-sm btn-clean btn-icon mr-2" title="Impression Etiquette" [disabled]="printbuttonState">
                         <i class="flaticon2-printer" ></i>
                         
                     </a>
                     `;
            },
            minWidth: 30,
            maxWidth: 30,
            onCellClick: (e: Event, args: OnEventArgs) => {
              this.index = this.dataset.findIndex((el) => {
                return el.tr_line == args.dataContext.tr_line;
              });
              this.updateitem(args.dataContext)
              
            }
          }
      ]

      this.gridOptions = {
         /* autoResize: {
            containerId: 'demo-container',
            sidePadding: 10
          },*/
          editable:true,
          enableCellNavigation:true,
          enableDraggableGrouping: true,
          createPreHeaderPanel: true,
          showPreHeaderPanel: true,
          preHeaderPanelHeight: 40,
          enableFiltering: true,
          enableSorting: true,
          enableAutoResize: true,
          exportOptions: {
            sanitizeDataExport: true
          },
          gridMenu: {
            onCommand: (e, args) => {
              if (args.command === 'toggle-preheader') {
                // in addition to the grid menu pre-header toggling (internally), we will also clear grouping
                this.clearGrouping();
              }
            },
          },
          draggableGrouping: {
            dropPlaceHolderText: 'Drop a column header here to group by the column',
            // groupIconCssClass: 'fa fa-outdent',
            deleteIconCssClass: 'fa fa-times',
            onGroupChanged: (e, args) => this.onGroupChanged(args),
            onExtensionRegistered: (extension) => this.draggableGroupingPlugin = extension,
        
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
      this.itemservice.getBy({pt_prod_line:'EPI'}).subscribe( 
        
          (response: any) => {this.dataset = response.data
            console.log(this.dataset)
            this.dataview.setItems(this.dataset)},
          
          (error) => {
              this.dataset = []
          },
          () => {}
          
      )
      console.log(this.dataset)
  }
  onGroupChanged(change: { caller?: string; groupColumns: Grouping[] }) {
      // the "caller" property might not be in the SlickGrid core lib yet, reference PR https://github.com/6pac/SlickGrid/pull/303
      const caller = change && change.caller || [];
      const groups = change && change.groupColumns || [];

      if (Array.isArray(this.selectedGroupingFields) && Array.isArray(groups) && groups.length > 0) {
        // update all Group By select dropdown
        this.selectedGroupingFields.forEach((g, i) => this.selectedGroupingFields[i] = groups[i] && groups[i].getter || '');
      } else if (groups.length === 0 && caller === 'remove-group') {
        this.clearGroupingSelects();
      }
    }
    clearGroupingSelects() {
      this.selectedGroupingFields.forEach((g, i) => this.selectedGroupingFields[i] = '');
    }
    
    collapseAllGroups() {
      this.dataviewObj.collapseAllGroups();
    }
  
    expandAllGroups() {
      this.dataviewObj.expandAllGroups();
    }
    clearGrouping() {
      if (this.draggableGroupingPlugin && this.draggableGroupingPlugin.setDroppedGroups) {
        this.draggableGroupingPlugin.clearDroppedGroups();
      }
      this.gridObj.invalidate(); // invalidate all rows and re-render
    }

    printpdf() {
      // const controls = this.totForm.controls
      let nbr = new Date().toLocaleDateString()
      console.log("pdf");
      var doc = new jsPDF("l");
      let date = new Date()
     // doc.text('This is client-side Javascript, pumping out a PDF.', 20, 30);
      var img = new Image()
      // img.src = "./assets/media/logos/inventory-list.png";
      img.src = "./assets/media/logos/companyentete"
    doc.addImage(img, 'png', 5, 5, 200, 30)
      doc.setFontSize(9);
      // if (this.domain.dom_name != null) {
      //   doc.text(this.domain.dom_name, 10, 10);
      // }
      // if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
      // if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
      // if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
      doc.setFontSize(14);
    
      doc.line(10, 35, 300, 35);
      doc.setFontSize(12);
      doc.text("Etat des Stocks Du: " + nbr, 100, 45);
      //doc.text("Date: " + this.dataset[0].tr_effdate, 160, 45);
      doc.text("imprimé Le: " + date.toLocaleDateString() , 220, 45);
      doc.text("A: " + new Date().toLocaleTimeString(), 220, 50);
      doc.text("Edité par: " + this.user.usrd_code, 220, 55);
      
      
      doc.setFontSize(8);
      //console.log(this.provider.ad_misc2_id)
     
    
      doc.line(10, 85, 300, 85);
      doc.line(10, 90, 300, 90);
      doc.line(10, 85, 10, 90);
      doc.text("LN", 12.5, 88.5);
      doc.line(20, 85, 20, 90);
      doc.text("Code Article", 25, 88.5);
      doc.line(65, 85, 65, 90);
      doc.text("Désignation", 67.5, 88.5);
      doc.line(130, 85, 130, 90);
      doc.text("QTE", 133, 88.5);
      doc.line(140, 85, 140, 90);
      doc.text("ORIGINE", 143, 88.5);
      doc.line(170, 85, 170, 90);
      doc.text("PAR", 173, 88.5);
      doc.line(185, 85, 185, 90);
      doc.text("Lot/Série", 188, 88.5);
      doc.line(205, 85, 205, 90);
      doc.text("N PAL", 207, 88.5);
      doc.line(220, 85, 220, 90);
      doc.text("DATE", 223, 88.5);
      doc.line(235, 85, 235, 90);
      doc.text("SITE", 238, 88.5);
      doc.line(245, 85, 245, 90);
      var i = 95;
      doc.setFontSize(6);
      let total = 0
      for (let j = 0; j < this.dataset.length  ; j++) {
        total = total - Number(this.dataset[j].ld_qty_oh)
        
        if ((j % 20 == 0) && (j != 0) ) {
          doc.addPage();
          // img.src = "./assets/media/logos/inventory-list.png";
          img.src = "./assets/media/logos/companyentete"
    doc.addImage(img, 'png', 5, 5, 200, 30)
          doc.setFontSize(9);
          // if (this.domain.dom_name != null) {
          //   doc.text(this.domain.dom_name, 10, 10);
          // }
          // if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
          // if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
          // if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
          doc.setFontSize(14);
          doc.line(10, 35, 300, 35);
    
          doc.setFontSize(12);
          doc.text("Etat des Stocks Du: " + nbr, 100, 45);
          //doc.text("Date: " + this.dataset[0].tr_effdate, 160, 45);
          doc.text("imprimé Le: " + date.toLocaleDateString() , 220, 45);
          doc.text("A: " + new Date().toLocaleTimeString(), 220, 50);
          doc.text("Edité par: " + this.user.usrd_code, 220, 55);
         
      
          doc.setFontSize(8);
          
    
          
      doc.line(10, 85, 300, 85);
      doc.line(10, 90, 300, 90);
      doc.line(10, 85, 10, 90);
      doc.text("LN", 12.5, 88.5);
      doc.line(20, 85, 20, 90);
      doc.text("Code Article", 25, 88.5);
      doc.line(65, 85, 65, 90);
      doc.text("Désignation", 67.5, 88.5);
      doc.line(130, 85, 130, 90);
      doc.text("QTE", 133, 88.5);
      doc.line(140, 85, 140, 90);
      doc.text("ORIGINE", 143, 88.5);
      doc.line(170, 85, 170, 90);
      doc.text("PAR", 173, 88.5);
      doc.line(185, 85, 185, 90);
      doc.text("Lot/Série", 188, 88.5);
      doc.line(205, 85, 205, 90);
      doc.text("N PAL", 207, 88.5);
      doc.line(220, 85, 220, 90);
      doc.text("DATE", 223, 88.5);
      doc.line(235, 85, 235, 90);
      doc.text("SITE", 238, 88.5);
      doc.line(245, 85, 245, 90);
          i = 95;
          doc.setFontSize(6);
        }
    
        
          doc.line(10, i - 5, 10, i);
          doc.text(String("0000" + Number(j+1)).slice(-4), 12.5, i - 1);
          doc.line(20, i - 5, 20, i);
          doc.text(this.dataset[j].ld_part, 25, i - 1);
          doc.line(65, i - 5, 65, i);
          doc.text(this.dataset[j].chr01 + ' ' + this.dataset[j].chr02 + ' ' + this.dataset[j].chr03, 67.5, i - 1);
          doc.line(130, i - 5, 130, i);
          doc.text(String(Number(this.dataset[j].ld_qty_oh) ), 137, i - 1, { align: "right" });
          doc.line(140, i - 5, 140, i);
          doc.text(String(this.dataset[j].chr04), 143, i - 1);
          doc.line(170, i - 5, 170, i);
          doc.text(String(this.dataset[j].created_by), 173, i - 1, );
          doc.line(185, i - 5, 185, i);
          doc.text(String(this.dataset[j].ld_lot), 188, i - 1, );
          doc.line(205, i - 5, 205, i);
          doc.text(String(this.dataset[j].ld_ref), 207, i - 1, );
          doc.line(220, i - 5, 220, i);
          doc.text(String((this.dataset[j].ld_date)) , 223, i - 1, );
          doc.line(235, i - 5, 235, i);
          doc.text(String((this.dataset[j].ld_site)) , 238, i - 1, );
          doc.line(245, i - 5, 245, i);
          doc.line(10, i, 245, i);
          i = i + 5;
        
      }
    
      // doc.line(10, i - 5, 200, i - 5);
    
      // doc.line(130, i + 7, 205, i + 7);
      // doc.line(130, i + 14, 205, i + 14);
      // //  doc.line(130, i + 21, 200, i + 21 );
      // //  doc.line(130, i + 28, 200, i + 28 );
      // //  doc.line(130, i + 35, 200, i + 35 );
      // doc.line(130, i + 7, 130, i + 14);
      // doc.line(160, i + 7, 160, i + 14);
      // doc.line(205, i + 7, 205, i + 14);
      // doc.setFontSize(10);
    
      doc.text("NOMBRE DE BIG BAG   " + String(this.dataset.length) + "  , Total POIDS:  " + String(Number(total)), 40, i + 12, { align: "left" });
      //  doc.text('TVA', 140 ,  i + 19 , { align: 'left' });
      //  doc.text('Timbre', 140 ,  i + 26 , { align: 'left' });
      //  doc.text('Total TC', 140 ,  i + 33 , { align: 'left' });
    
      // doc.text(String(Number(total)), 198, i + 12, { align: "right" });
      //  doc.text(String(Number(controls.tva.value).toFixed(2)), 198 ,  i + 19 , { align: 'right' });
      //  doc.text(String(Number(controls.timbre.value).toFixed(2)), 198 ,  i + 26 , { align: 'right' });
      //  doc.text(String(Number(controls.ttc.value).toFixed(2)), 198 ,  i + 33 , { align: 'right' });
    
      doc.setFontSize(8);
      // let mt = NumberToLetters(Number(total), "Dinars Algerien");
    
      // if (mt.length > 95) {
      //   let mt1 = mt.substring(90);
      //   let ind = mt1.indexOf(" ");
    
      //   mt1 = mt.substring(0, 90 + ind);
      //   let mt2 = mt.substring(90 + ind);
    
      //   doc.text("Arretée la présente Commande a la somme de :" + mt1, 20, i + 53);
      //   doc.text(mt2, 20, i + 60);
      // } else {
      //   doc.text("Arretée la présente Commande a la somme de :" + mt, 20, i + 53);
      // }
      // window.open(doc.output('bloburl'), '_blank');
      //window.open(doc.output('blobUrl'));  // will open a new tab
      doc.save('ES-' + nbr + '.pdf')
      var blob = doc.output("blob");
      window.open(URL.createObjectURL(blob));
    }
    onSubmit() {
    
      this.printpdf(); 
     
      // tslint:disable-next-line:prefer-const
    
    }
    
   
   
    
    reset() {
    
      this.dataset = []
      this.itemservice.getBy({pt_prod_line:'EPI'}).subscribe( 
        
          (response: any) => {this.dataset = response.data
            console.log(this.dataset)
            this.dataview.setItems(this.dataset)},
          
          (error) => {
              this.dataset = []
          },
          () => {}
          
      )
    
    }
    updateitem(details: any) {
    this.loadingSubject.next(true)
    this.itemservice.epiupdate(details).subscribe(
        (reponse) => console.log("response", reponse),
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
            // this.router.navigateByUrl("inventory-settings/list-status")
        }
    )
  }
}


