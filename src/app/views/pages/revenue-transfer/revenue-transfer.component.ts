import { Component, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";

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
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Observable, BehaviorSubject, Subscription, of } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
// Layout
import {
  SubheaderService,
  LayoutConfigService,
} from "../../../core/_base/layout";
// CRUD
import {
  LayoutUtilsService,
  TypesUtilsService,
  MessageType,
} from "../../../core/_base/crud";
import { MatDialog } from "@angular/material/dialog";
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
import {
  PurchaseOrderService,
  SequenceService,
  UsersService,
  ItemService,
  PurchaseOrder,
  TaxeService,
  DeviseService,
  CodeService,
  SiteService,
  PosCategoryService,
  InventoryTransactionService,
} from "../../../core/erp";
declare var printTransfert: any;
@Component({
  selector: "kt-revenue-transfer",
  templateUrl: "./revenue-transfer.component.html",
  styleUrls: ["./revenue-transfer.component.scss"],
})
export class RevenueTransferComponent implements OnInit {
  rvForm: FormGroup;

  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  user;
  currentamt: any = 0;
  date: any;
  error = false;
  sites: any[] = [];
  constructor(
    config: NgbDropdownConfig,
    private rvFB: FormBuilder,
    private totFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private layoutUtilsService: LayoutUtilsService,
    private userService: UsersService,
    private inventoryTransactionService: InventoryTransactionService,
    private sequenceService: SequenceService,
    private purchaseOrderService: PurchaseOrderService,
    private itemsService: ItemService,
    private codeService: CodeService,
    private deviseService: DeviseService,
    private siteService: SiteService,
    private taxService: TaxeService,
    private posCategoryService: PosCategoryService
  ) {
    this.posCategoryService.getAllSite().subscribe((response: any) => {
      this.sites = response.data.map((item) => {
        return item;
      });
    });
  }

  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.user = JSON.parse(localStorage.getItem("user"));

    this.createForm();
  }

  change() {
    this.currentamt = 0;
    const controls = this.rvForm.controls;
    // const date = new Date(`${controls.calc_date.value.year}/${controls.calc_date.value.month}/${controls.calc_date.value.day}`)
    const date = controls.calc_date.value
      ? `${controls.calc_date.value.year}/${controls.calc_date.value.month}/${controls.calc_date.value.day}`
      : null;
    const date1 = controls.calc_date.value
      ? `${controls.calc_date.value.year}/${controls.calc_date.value.month}/${controls.calc_date.value.day}`
      : null;
    this.date = date;
    const site = this.user.usrd_site;
    console.log(this.user.usrd_site);
    const obj = { date, date1, site };
    this.posCategoryService.getAllBySite(obj).subscribe(
      (response: any) => {
        if (response.data.length > 0) {
          this.currentamt = response.data[0].rec;
          this.rvForm.get("montant_tr").setValue(this.currentamt);
        } else {
          this.rvForm.get("montant_tr").setValue(this.currentamt);
        }
        console.log(this.currentamt);
      },
      (error) => {
        console.log(error);
      },
      () => {}
    );
  }

  createForm() {
    this.loadingSubject.next(false);

    const date = new Date();

    this.rvForm = this.rvFB.group({
      // po_category: [{value: this.purchaseOrder.po_category, disabled:true}, Validators.required],
      montant_tr: [
        { value: this.currentamt, disabled: true },
        Validators.required,
      ],
      montant_rl: ["", Validators.required],
      calc_date: [
        {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate(),
        },
      ],
    });

    const controls = this.rvForm.controls;
  }

  reset() {
    this.createForm();
    this.hasFormErrors = false;
  }

  onSubmit() {
    this.loadingSubject.next(true);

    const controls = this.rvForm.controls;
    console.log(controls.montant_rl.value);
    console.log(controls.montant_tr.value);
    this.posCategoryService
      .addBkhTransfert({
        date: this.date,
        amt_rl: controls.montant_rl.value,
        amt_tr: controls.montant_tr.value,
        site: this.user.usrd_site,
      })
      .subscribe(
        (reponse: any) => console.log(reponse),
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
          //console.log(this.provider, po, this.dataset);
          this.router.navigateByUrl("/pos");

          const site = this.sites.find(
            (item) => item.si_site === this.user.usrd_site
          );

          const data2 = [
            {
              type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
              value: site.si_desc,
            },

            {
              type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
              value: new Date(),
            },
            {
              type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
              value:
                "Total sur système: " +
                " " +
                controls.montant_tr.value +
                ".00 DA",
            },
            {
              type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
              value:
                "Total a transférer : " +
                " " +
                controls.montant_rl.value +
                ".00 DA",
            },
            {
              type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
              value: "Manager :  ",
            },
            {
              type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
              value: "",
            },
            {
              type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
              value: "Visa : ",
            },
            {
              type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
              value: "Nom de l'agent  ",
            },
            {
              type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
              value: "",
            },
            {
              type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
              value: "Visa : ",
            },
          ];
          console.log(data2);
          // printTransfert.printT(data2);
        }
      );
  }
}
