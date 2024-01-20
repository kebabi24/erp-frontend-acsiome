import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbDropdownConfig, NgbModal, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";
import { Column, AngularGridInstance, FieldType, GridOption, GridService, Editors } from "angular-slickgrid";
import { BehaviorSubject, Observable } from "rxjs";
import { LayoutUtilsService, MessageType } from "src/app/core/_base/crud";
import { Role, RoleService, TokenSerie, TokenSerieService } from "../../../../core/erp";
import * as os from "os";

@Component({
  selector: "kt-create-new-token",
  templateUrl: "./create-new-token.component.html",
  styleUrls: ["./create-new-token.component.scss"],
})
export class CreateNewTokenComponent implements OnInit {
  token: TokenSerie;
  roleForm: FormGroup;
  hasFormErrors = false;
  isExist = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;

  // GRID
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  gridObj: any;
  angularGrid: AngularGridInstance;
  gridService: GridService;
  message: any;
  column: Column;
  grid: any;
  dataView: any;

  tokens: any = []; // dataset

  constructor(config: NgbDropdownConfig, private activatedRoute: ActivatedRoute, private router: Router, public dialog: MatDialog, private layoutUtilsService: LayoutUtilsService, private tokenSerieService: TokenSerieService) {
    config.autoClose = true;
    this.prepareGrid();
  }

  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
  }

  // onChangeCode() {
  //   const controls = this.roleForm.controls

  //   this.roleService.getByOne({role_code: controls.role_code.value }).subscribe(
  //       (res: any) => {
  //         console.log("aa", res.data);

  //         if (res.data) {
  //           alert("Ce role exist déja")
  //           this.isExist = true
  //           document.getElementById("role").focus();

  //         } else {
  //           controls.role_name.enable()
  //           controls.userMobile_code.enable()

  //       }

  //   })

  // }

  reset() {
    this.token = new TokenSerie();
    this.prepareGrid();
  }
  // save data
  onSubmit() {
    this.hasFormErrors = false;

    this.tokenSerieService.createTokens(this.tokens).subscribe(
      (reponse) => console.log("response", Response),
      (error) => {
        this.layoutUtilsService.showActionNotification("Erreur verifier les informations", MessageType.Create, 10000, true, true);
        this.loadingSubject.next(false);
      },
      () => {
        this.layoutUtilsService.showActionNotification("Ajout avec succès", MessageType.Create, 10000, true, true);
        this.loadingSubject.next(false);
        this.tokens = [];
        // this.createForm()
      }
    );
  }

  goBack() {
    this.loadingSubject.next(false);
    const url = `/roles/list-all-roles`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }

  gridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;
    this.gridService = angularGrid.gridService;
  }

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;
    this.gridService = angularGrid.gridService;
    this.dataView.getItemMetadata = this.updateItemMetadata(this.dataView.getItemMetadata);
    this.grid.invalidate();
    this.grid.render();
  }

  updateItemMetadata(previousItemMetadata: any) {
    const newCssClass = "highlight-bg";
    return (rowNumber: number) => {
      const item = this.dataView.getItem(rowNumber);
      let meta = {
        cssClasses: "",
      };
      if (typeof previousItemMetadata === "object") {
        meta = previousItemMetadata(rowNumber);
      }

      if (meta && item && item.etat_service) {
        const state = item.etat_service;
        if (state === "true") {
          meta.cssClasses = (meta.cssClasses || "") + " " + newCssClass;
        }
      }

      return meta;
    };
  }

  prepareGrid() {
    this.columnDefinitions = [
      {
        id: "token_code",
        name: "Code token",
        field: "token_code",
        sortable: true,
        minWidth: 100,
        maxWidth: 300,
        filterable: true,
        type: FieldType.string,
        editor: { model: Editors.text },
      },

      {
        id: "token_name",
        name: "Nom token ",
        field: "token_name",
        sortable: true,
        minWidth: 100,
        maxWidth: 300,
        filterable: true,
        type: FieldType.string,
        editor: { model: Editors.text },
      },
      {
        id: "token_digitcount",
        name: "Nombre de chiffres",
        field: "token_digitcount",
        sortable: true,
        minWidth: 100,
        maxWidth: 300,
        filterable: true,
        type: FieldType.integer,
        editor: { model: Editors.integer },
      },

      {
        id: "service_prefix",
        name: "Service préfixe",
        field: "service_prefix",
        sortable: true,
        minWidth: 100,
        maxWidth: 300,
        filterable: true,
        type: FieldType.string,
        editor: { model: Editors.text },
      },
      {
        id: "service_next_number",
        name: "Numéro suivant",
        field: "service_next_number",
        sortable: true,
        minWidth: 100,
        maxWidth: 300,
        filterable: true,
        type: FieldType.integer,
        editor: { model: Editors.integer },
      },

      //
      {
        id: "visit_prefix",
        name: "Visit préfixe",
        field: "visit_prefix",
        sortable: true,
        minWidth: 100,
        maxWidth: 300,
        filterable: true,
        type: FieldType.string,
        editor: { model: Editors.text },
      },
      {
        id: "visit_next_number",
        name: "Numéro suivant",
        field: "visit_next_number",
        sortable: true,
        minWidth: 100,
        maxWidth: 300,
        filterable: true,
        type: FieldType.integer,
        editor: { model: Editors.integer },
      },

      // ***
      {
        id: "customer_prefix",
        name: "Client préfixe",
        field: "customer_prefix",
        sortable: true,
        minWidth: 100,
        maxWidth: 300,
        filterable: true,
        type: FieldType.string,
        editor: { model: Editors.text },
      },
      {
        id: "customer_next_number",
        name: "Numéro suivant",
        field: "customer_next_number",
        sortable: true,
        minWidth: 100,
        maxWidth: 300,
        filterable: true,
        type: FieldType.integer,
        editor: { model: Editors.integer },
      },

      // ***
      {
        id: "load_request_prefix",
        name: "Demande de chargement préfixe",
        field: "load_request_prefix",
        sortable: true,
        minWidth: 100,
        maxWidth: 300,
        filterable: true,
        type: FieldType.string,
        editor: { model: Editors.text },
      },
      {
        id: "load_request_next_number",
        name: "Numéro suivant",
        field: "load_request_next_number",
        sortable: true,
        minWidth: 100,
        maxWidth: 300,
        filterable: true,
        type: FieldType.integer,
        editor: { model: Editors.integer },
      },

      // ***
      {
        id: "inventory_prefix",
        name: "Inventaire préfixe",
        field: "inventory_prefix",
        sortable: true,
        minWidth: 100,
        maxWidth: 300,
        filterable: true,
        type: FieldType.string,
        editor: { model: Editors.text },
      },
      {
        id: "inventory_next_number",
        name: "Numéro suivant",
        field: "inventory_next_number",
        sortable: true,
        minWidth: 100,
        maxWidth: 300,
        filterable: true,
        type: FieldType.integer,
        editor: { model: Editors.integer },
      },
      {
        id: "invoice_prefix",
        name: "Invoice préfixe",
        field: "invoice_prefix",
        sortable: true,
        minWidth: 100,
        maxWidth: 300,
        filterable: true,
        type: FieldType.string,
        editor: { model: Editors.text },
      },
      {
        id: "invoice_next_number",
        name: "Numéro suivant",
        field: "invoice_next_number",
        sortable: true,
        minWidth: 100,
        maxWidth: 300,
        filterable: true,
        type: FieldType.integer,
        editor: { model: Editors.integer },
      },

      {
        id: "payment_prefix",
        name: "Payment préfixe",
        field: "payment_prefix",
        sortable: true,
        minWidth: 100,
        maxWidth: 300,
        filterable: true,
        type: FieldType.string,
        editor: { model: Editors.text },
      },
      {
        id: "payment_next_number",
        name: "Numéro suivant",
        field: "payment_next_number",
        sortable: true,
        minWidth: 100,
        maxWidth: 300,
        filterable: true,
        type: FieldType.integer,
        editor: { model: Editors.integer },
      },

      {
        id: "unload_request_prefix",
        name: "Unload préfixe",
        field: "unload_request_prefix",
        sortable: true,
        minWidth: 100,
        maxWidth: 300,
        filterable: true,
        type: FieldType.string,
        editor: { model: Editors.text },
      },
      {
        id: "unload_request_next_number",
        name: "Numéro suivant",
        field: "unload_request_next_number",
        sortable: true,
        minWidth: 100,
        maxWidth: 300,
        filterable: true,
        type: FieldType.integer,
        editor: { model: Editors.integer },
      },
    ];

    this.gridOptions = {
      asyncEditorLoading: false,
      editable: true,
      enableAutoResize: true,
      autoCommitEdit: true,
      autoEdit: true,
      autoHeight: true,

      enableAddRow: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableRowSelection: true,
      enableCheckboxSelector: true,
      rowSelectionOptions: {
        selectActiveRow: false,
      },
    };
  }

  addNewItem() {
    this.gridService.addItem(
      {
        id: this.tokens.length + 1,
      },
      { position: "bottom" }
    );
  }
}
