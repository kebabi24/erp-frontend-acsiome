import { Component, OnInit } from "@angular/core";
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

import { ActivatedRoute, Router } from "@angular/router";
import {
  Observable,
  BehaviorSubject,
  Subscription,
  of,
  Subject,
  Observer,
} from "rxjs";
import {
  Customer,
  EmployeService,
  PosCategoryService,
  MobileServiceService,
} from "../../../core/erp";
import { NgbDropdownConfig, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { LayoutUtilsService, MessageType } from "src/app/core/_base/crud";
@Component({
  selector: "kt-weekly-inventory",
  templateUrl: "./weekly-inventory.component.html",
  styleUrls: ["./weekly-inventory.component.scss"],
})
export class WeeklyInventoryComponent implements OnInit {
  angularGrid: AngularGridInstance;
  angularGrid4: AngularGridInstance;
  grid: any;
  gridService: GridService;
  dataView: any;
  angularGrid18: AngularGridInstance;
  grid18: any;
  gridService18: GridService;
  dataView6: any;
  angularGrid6: AngularGridInstance;
  grid6: any;
  gridService6: GridService;
  dataView18: any;
  columnDefinitions: Column[];
  columnDefinitions2: Column[];
  gridOptions: GridOption;
  dataset: any = [];
  user;
  loadingSubject = new BehaviorSubject<boolean>(true);
  constructor(
    private posCategoryService: PosCategoryService,
    private modalService: NgbModal,
    private router: Router,
    private layoutUtilsService: LayoutUtilsService
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.initGrid();
  }
  handleSelectedRowsChanged(e, args) {}
  gridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;
    this.gridService = angularGrid.gridService;
  }
  initGrid() {
    this.columnDefinitions = [
      {
        id: "description",
        name: "Description",
        field: "item.pt_desc1",
        sortable: true,
        width: 80,
        filterable: false,
      },
      {
        id: "item.pt_um",
        name: "Unité de mesure",
        field: "item.pt_um",
        sortable: true,
        width: 80,
        filterable: false,
      },
      {
        id: "tag_cnt_qty",
        name: "Qte Comptee",
        field: "tag_cnt_qty",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.float,
          params: { decimalPlaces: 2 },
        },
      },
    ];

    this.gridOptions = {
      asyncEditorLoading: false,

      editable: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableRowSelection: true,
      formatterOptions: {
        // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
        displayNegativeNumberWithParentheses: true,

        // Defaults to undefined, minimum number of decimals
        minDecimal: 2,

        // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
        thousandSeparator: " ", // can be any of ',' | '_' | ' ' | ''
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
    };

    this.dataset = [];
    this.posCategoryService
      .getWeekProductInventory({
        ld_site: this.user.usrd_site,
        ld_status: "CONFORME",
      })
      .subscribe(
        (response: any) => (
          (this.dataset = response.data), console.log(response.data)
        ),
        (error) => {
          this.dataset = [];
        },
        () => {}
      );
  }
  openModal(content) {
    this.modalService.open(content, { size: "sm" });
  }
  setOpenInventory2() {
    this.dataset.map((item) => {
      return (item.tag_cnt_qty = item.tag_cnt_qty);
    });
    this.posCategoryService
      .checkInventory2({
        detail: this.dataset,
        user: this.user.usrd_profile,
        user_site: this.user.usrd_site,
      })
      .subscribe(
        (reponse) => console.log("response", Response),
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
          this.router.navigateByUrl("/pos");
        }
      );
  }
}
