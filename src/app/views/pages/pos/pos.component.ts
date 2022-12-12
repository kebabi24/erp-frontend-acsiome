import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { HttpUtilsService } from "../../../core/_base/crud";
import {
  Observable,
  BehaviorSubject,
  Subscription,
  of,
  Subject,
  Observer,
} from "rxjs";
import { Store } from "@ngrx/store";
import { bk } from "../../../core/erp/mockdata";
import { Tables } from "../../../core/erp/data/mock-categories";
import { Category } from "../../../core/erp/_models/pos-categories.model";
import { Bank } from "../../../core/erp/_models/bank.model";
import { Spec } from "../../../core/erp/_models/spec.model";
import { PosInventory } from "../../../core/erp/_models/pos-inventory.model";
import { Product } from "../../../core/erp/_models/pos-products.model";
import { Cart } from "../../../core/erp/_models/pos-cart.model";
import { NgbDropdownConfig, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import {
  EmployeService,
  PosCategoryService,
  MobileServiceService,
} from "../../../core/erp";
import { LayoutUtilsService, MessageType } from "src/app/core/_base/crud";
import { DatePipe } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators,
} from "@angular/forms";

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

// import {
//   PosPrinter,
//   PosPrintData,
//   PosPrintOptions,
// } from "electron-pos-printer";
// import * as path from "path";

import { environment } from "../../../../environments/environment";
const API_URL = environment.apiUrl + "/codes";
// const options: PosPrintOptions = {
//   preview: false,
//   margin: "0 0 0 0",
//   copies: 1,
//   printerName: "XP-80C",
//   timeOutPerLine: 400,
//   pageSize: "80mm", // page size
//   boolean: false,
// };
@Component({
  selector: "kt-pos",
  templateUrl: "./pos.component.html",
  styleUrls: ["./pos.component.scss"],
})
export class PosComponent implements OnInit {
  seq: any[] = [];
  item: any;
  row_number;
  bkForm: FormGroup;
  mvForm: FormGroup;
  customerForm: FormGroup;
  bk: any;
  hasFormErrors = false;
  inventory: PosInventory;
  InventoryForm: FormGroup;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  categories: Observable<Category[]>;
  currentCategory: Category;
  products: any[];
  family: any[];
  cart: Cart;
  // all: any[] = [];
  selectedCategory?: Category;
  selectedProducts?: Array<Product>;
  suppliments: any[];
  ingredients: Spec[];
  soda: any[];
  drinksBrand: any[];
  elem: any[];
  sauces: any[];
  cartProducts?: Array<Product> = [];
  lastSeq: Array<any>;
  showPrice: boolean = false;
  inShop: boolean = false;
  showStatusDelivery: boolean = false;
  showStatusOut: boolean = false;
  itemToAdd: Product;
  productInCartPrice: number = 0;
  subtotalPrice: number = 0;
  AllProducts: Array<Product>;
  currentItem: any;
  updatedCart: Cart;
  loclocOrder: string = "Sur place";
  AllTables: string[];
  currentTable: string = "01";
  isChecked: boolean = false;
  isDisabled: boolean = true;
  disableButton: boolean = true;
  selectedIndex: number;
  sizeProduct: string = "Classic";
  PosInventory: PosInventory;
  secondFormule: string;
  angularGrid: AngularGridInstance;
  angularGrid4: AngularGridInstance;
  grid: any;
  gridService: GridService;
  dataView: any;
  angularGrid18: AngularGridInstance;
  grid18: any;
  gridService18: GridService;
  dataView18: any;
  lists: any[] = [];
  columnDefinitions: Column[];
  columnDefinitions2: Column[];
  gridOptions: GridOption;
  gridOptions2: GridOption;
  columnDefinitions3: Column[];
  gridOptions3: GridOption;
  columnDefinitions4: Column[];
  gridOptions4: GridOption;
  columnDefinitions5: Column[];
  gridOptions5: GridOption;
  columnDefinitions18: Column[];
  gridOptions18: GridOption;
  gridObj18: any;
  emps: any[];
  dataset: any[];
  dataset5: any[];
  items: any[];
  gridObj: any;
  gridObj4: any;
  ordersHistory: Array<Cart> = [];
  showSize: boolean = false;
  showSupp: boolean = false;
  showSpec: boolean = false;
  showSoda: boolean = false;
  showSauces: boolean = false;
  showListOfSoda: boolean = false;
  showListOfBrands: boolean = false;
  families: Array<any>;
  sizeOfProduct: Array<any>;
  ItemsToAddToCard: Product;
  addProductBtn: boolean = false;
  workOrders: any[] = [];
  detail: any[] = [];
  it: any;
  detailSo: any[] = [];
  itSo: any;
  salesOrder: any[] = [];
  user;
  inventoryData: any[] = [];
  tag_cnt_qty;
  datasetRec: any[] = [];
  bank: any[] = [];
  chooseCaisse: boolean;
  inventoryTabcaisse: any[] = [];
  regie: boolean = false;
  value1: boolean = false;
  value2: any;
  cartAmount: number = 0;
  bk_type: any;
  disable: boolean = false;
  discount: number = 0;
  discountTable: any[] = [];
  remisePrice: number = 0;
  currentSeq: number = 0;
  selectedBank: string;
  platformes: any[] = [];
  platformesOffers: any[] = [];
  deliveryOption: string;
  currentPlatformeOffers: any[] = [];
  offerActif: boolean = false;
  productOffers: any[] = [];
  RequestBuyingArticle: boolean = false;
  httpOptions = this.httpUtils.getHTTPHeaders();
  pipe = new DatePipe("en-US");
  offer: boolean = false;
  currentOffer: any;
  stateCaisse: boolean = false;
  stateInventory: boolean = true;
  globalState: boolean = true;
  private results: Observable<any[]>;
  loy_num: number = 0;
  disableIng: boolean = false;
  formule: boolean = false;
  editCart: boolean = false;
  constructor(
    config: NgbDropdownConfig,
    private http: HttpClient,
    private httpUtils: HttpUtilsService,
    private modalService: NgbModal,
    private bkFb: FormBuilder,
    private mvFb: FormBuilder,
    private customerFb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private InventoryFB: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private posCategoryService: PosCategoryService,
    private employeService: EmployeService,
    private mobileService: MobileServiceService,
    private fb: FormBuilder,
    private layoutUtilsService: LayoutUtilsService
  ) {
    config.autoClose = true;

    this.posCategoryService.getAll().subscribe((res: any) => {
      this.categories = res.data.map((item) => {
        return item;
      });
    });
    this.posCategoryService
      .getByCode({ code_fldname: "pt_draw" })
      .subscribe((res: any) => {
        this.families = res.data.map((item) => {
          return item;
        });
      });
    this.posCategoryService.getAllProducts().subscribe((res: any) => {
      this.AllProducts = res.data.map((item) => {
        return item;
      });
    });
    this.posCategoryService.getBySupp({ pt_ms: true }).subscribe((res: any) => {
      this.suppliments = res.data.map((item) => {
        return item;
      });
    });
    this.posCategoryService
      .getByItems({ pt_status: "MP-ACTIF", pt_group: "SPEC" })
      .subscribe((res: any) => {
        this.ingredients = res.data.map((item) => {
          const ing = {
            id: item.id,
            pt_pt_part: item.pt_part,
            pt_desc1: item.pt_desc1,
            pt_desc2: item.pt_desc2,
            pt_loc: item.pt_loc,
            pt_bom_code: item.pt_bom_code,
            isChecked: true,
            pt_price: item.pt_price,
          };
          return ing;
        });
      });
    this.posCategoryService
      .getByCode({ code_cmmt: "CT007" })
      .subscribe((res: any) => {
        this.soda = res.data.map((item) => {
          return item;
        });
      });
    this.posCategoryService
      .getByItems({ pt_group: "Sauces" })
      .subscribe((res: any) => {
        this.sauces = res.data.map((item) => {
          return item;
        });
      });
    this.posCategoryService.getAllPlatformesOffers().subscribe((res: any) => {
      this.platformesOffers = res.data.map((item) => {
        return item;
      });
    });
    this.posCategoryService.getDiscountCode().subscribe((res: any) => {
      this.discountTable = res.data.map((item) => {
        return item;
      });
    });
    this.posCategoryService.getSeq({ seq_seq: "OP" }).subscribe((res: any) => {
      this.currentSeq = res.data.seq_curr_val;
    });
    this.posCategoryService
      .getByCode({ code_fldname: "del_desc" })
      .subscribe((res: any) => {
        this.platformes = res.data.map((item) => {
          return item;
        });
      });
  }

  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.bk = bk;
    this.AllTables = Tables;

    this.user = JSON.parse(localStorage.getItem("user"));

    this.cart = {
      id: Math.floor(Math.random() * 101) + 1,

      products: [],
      order_emp: this.loclocOrder,
      customer: "particulier",
      status: "N",
      total_price: 0,
      usrd_name: this.user.usrd_user_name,
      usrd_site: this.user.usrd_site,
      from: "BOUTIQUE",
    };

    this.initGrid();
    this.initGrid3();
    this.initGrid4();
    this.createBkForm();
    this.createMvForm();
    this.createCustomerForm();
    // this.initGrid2();
    this.mobileService
      .getByOne({ role_code: this.user.usrd_code, service_open: "true" })
      .subscribe((res: any) => {
        let service = res.data;
        if (service) {
          this.globalState = false;
          this.stateCaisse = true;
          this.stateInventory = true;
        } else {
          this.globalState = true;
          this.stateCaisse = false;
          this.stateInventory = true;
        }
      });
  }

  onSelect(category: Category): void {
    this.currentCategory = category;
    this.showSize = false;
    this.showSupp = false;
    this.showSauces = false;
    this.showSoda = false;
    this.showListOfSoda = false;
    this.showListOfBrands = false;
    this.disableIng = false;
    this.lists = [];
    this.selectedProducts = this.families.filter(
      (item) => item.code_cmmt === category.category_code
    );

    console.log(this.currentSeq);
    this.productInCartPrice = 0;
    this.currentItem = undefined;

    // this.selectedProducts = result.items.map((item) => {
    //   let itemCategory: Product = {
    //     id: item.id,
    //     pt_part: item.pt_part,
    //     pt_desc1: item.pt_desc1,
    //     pt_article: item.pt_article,
    //     pt_formule: item.pt_formule,
    //     pt_page: item.pt_page,
    //     pt_price: item.pt_price,
    //     pt_bom_code: item.pt_bom_code,
    //     pt_qty: 1,
    //     size: "item.size",
    //     suppliments: [],
    //     ingredients: [],
    //   };
    //   return itemCategory;
    // });
  }

  initializeProduct(productOnlist) {
    console.log(productOnlist);
    let test: boolean = false;
    this.sizeOfProduct = this.AllProducts.filter(
      (item) => item.pt_draw === productOnlist.code_value
    );
    this.addProductBtn = true;

    if (this.sizeOfProduct[0].pt_group === "SU") {
      this.showSize = false;
      this.prepareProduct(this.sizeOfProduct[0], "");
    } else {
      this.showSize = true;
    }
    this.sizeOfProduct.map((item) => {
      item.pt_group == "null" && (this.showSupp = false);
    });

    this.productInCartPrice = 0;
    this.currentItem = undefined;
    this.showListOfBrands = false;
  }

  prepareProduct(size, content) {
    if (
      size.pt_group === "COCA" ||
      size.pt_group === "SCHWEPPES" ||
      size.pt_group === "SCHWEPPES GOLD"
    ) {
      this.elem = this.AllProducts.filter(
        (item) => item.pt_group === size.pt_group
      );
      this.showListOfBrands = true;
      console.log(size.pt_group);
    } else {
      this.productInCartPrice = 0;
      this.currentItem = this.sizeOfProduct.find(
        (item) => item.pt_group === size.pt_group
      );
      console.log(this.currentItem);
      this.sizeProduct = this.currentItem.pt_group;
      this.currentCategory.direct === true
        ? (this.showSauces = false)
        : (this.showSauces = true);
      console.log("test", this.currentItem.pt_loc);
      this.currentItem = {
        id: Math.random(),
        pt_part: this.currentItem.pt_part,
        pt_desc1: this.currentItem.pt_desc1,
        pt_article: this.currentItem.pt_article,
        pt_formule: this.currentItem.pt_formula,
        pt_loc: this.currentItem.pt_loc,
        pt_price: this.currentItem.pt_price,
        pt_bom_code: this.currentItem.pt_bom_code,
        pt_qty: 1,
        pt_part_type: this.currentItem.pt_part_type,
        comment: this.currentItem.pt_group,
        suppliments: [],
        ingredients: [],
        sauces: [],
      };
      if (this.currentCategory.direct === true) {
        this.addProductToCart();
      } else {
        this.open2(content);
      }
      const checkItemExist = this.currentItem;

      checkItemExist.suppliments.map((item) => {
        this.productInCartPrice =
          Number(this.productInCartPrice) + Number(item.pt_price);
      });
      this.productInCartPrice =
        Number(this.productInCartPrice) + Number(checkItemExist.pt_price);
      this.loclocOrder === "Emporté"
        ? this.posCategoryService
            .getByOneBom({ ptb_part: checkItemExist.pt_part })
            .subscribe((res: any) => {
              res.data.map((item) => {
                checkItemExist.pt_bom_code = item.ptb_bom;
              });
            })
        : null;
      this.itemToAdd = {
        id: Math.random(),
        pt_part: checkItemExist.pt_part,
        pt_desc1: checkItemExist.pt_desc1,
        pt_article: checkItemExist.pt_article,
        pt_price: checkItemExist.pt_price,
        pt_formule: checkItemExist.pt_formule,
        pt_bom_code: checkItemExist.pt_bom_code,
        suppliments: checkItemExist.suppliments,
        ingredients: checkItemExist.ingredients,
        sauces: checkItemExist.sauces,
        comment: this.sizeProduct,
        pt_part_type: checkItemExist.pt_part_type,
        pt_loc: checkItemExist.pt_loc,
        pt_qty: 1,
        line: this.cartProducts.length.toString(),
      };
      // checkItemExist.size != undefined ? this.sizeOfProduct : null;

      // const itemExist: Product = this.cartProducts.find((item) => {
      //   return (
      //     item.pt_part === checkItemExist.pt_part &&
      //     item.suppliments.length === checkItemExist.suppliments.length &&
      //     item.suppliments.filter((s) => checkItemExist.suppliments.includes(s))
      //       .length === checkItemExist.suppliments.length &&
      //     item.ingredients.length === checkItemExist.ingredients.length &&
      //     item.ingredients.filter((s) => checkItemExist.ingredients.includes(s))
      //       .length === checkItemExist.ingredients.length &&
      //     item.sauces.length === checkItemExist.sauces.length &&
      //     item.sauces.filter((s) => checkItemExist.sauces.includes(s)).length ===
      //       checkItemExist.sauces.length &&
      //     item.comment === checkItemExist.comment
      //   );
      // });
      this.cart.products.push(this.itemToAdd);
      this.showPrice = true;

      this.cartProducts = this.cart.products;
      this.ingredients.map((item) => {
        item.isChecked = true;
      });
      this.cartAmount = this.calculateSubTotal();
      // this.offer &&
      //   (this.cart.total_price =
      //     this.cartAmount * (1 - Number(this.currentOffer.del_pct_disc) / 100)) &&
      //   (this.remisePrice =
      //     this.cartAmount * (Number(this.currentOffer.del_pct_disc) / 100)) &&
      //   (this.cartAmount = this.cart.total_price);
      // this.currentItem.suppliments = [];
      // this.currentItem.ingredients = [];
      // this.productInCartPrice = 0;
      // this.selectedIndex = 0;
      // this.showSize = false;
      // this.showSoda = false;
      // this.showSpec = false;
      // this.showSupp = false;
      // this.showSauces = false;
      // this.currentItem = undefined;
      this.offer && this.applyDiscount(this.currentOffer);
      this.disableIng = false;
    }
  }
  prepareAnotherProduct(size) {
    this.productInCartPrice = 0;
    this.currentItem = size;
    this.currentItem = {
      id: Math.random(),
      pt_part: this.currentItem.pt_part,
      pt_desc1: this.currentItem.pt_desc1,
      pt_article: this.currentItem.pt_article,
      pt_formule: this.currentItem.pt_formula,
      pt_loc: this.currentItem.pt_loc,
      pt_price: this.formule ? Number(0) : this.currentItem.pt_price,
      pt_bom_code: this.currentItem.pt_bom_code,
      pt_qty: 1,
      pt_part_type: this.currentItem.pt_part_type,
      comment: this.currentItem.pt_group,
      suppliments: [],
      ingredients: [],
      sauces: [],
    };
    const checkItemExist = this.currentItem;
    // checkItemExist.size != undefined ? this.sizeOfProduct : null;

    // const itemExist: Product = this.cartProducts.find((item) => {
    //   return (
    //     item.pt_part === checkItemExist.pt_part &&
    //     item.suppliments.length === checkItemExist.suppliments.length &&
    //     item.suppliments.filter((s) => checkItemExist.suppliments.includes(s))
    //       .length === checkItemExist.suppliments.length &&
    //     item.ingredients.length === checkItemExist.ingredients.length &&
    //     item.ingredients.filter((s) => checkItemExist.ingredients.includes(s))
    //       .length === checkItemExist.ingredients.length &&
    //     item.sauces.length === checkItemExist.sauces.length &&
    //     item.sauces.filter((s) => checkItemExist.sauces.includes(s)).length ===
    //       checkItemExist.sauces.length &&
    //     item.comment === checkItemExist.comment
    //   );
    // });

    checkItemExist.suppliments.map((item) => {
      this.productInCartPrice =
        Number(this.productInCartPrice) + Number(item.pt_price);
    });
    this.productInCartPrice =
      Number(this.productInCartPrice) + Number(checkItemExist.pt_price);
    this.loclocOrder === "Emporté"
      ? this.posCategoryService
          .getByOneBom({ ptb_part: checkItemExist.pt_part })
          .subscribe((res: any) => {
            res.data.map((item) => {
              checkItemExist.pt_bom_code = item.ptb_bom;
            });
          })
      : null;
    this.itemToAdd = {
      id: Math.random(),
      pt_part: checkItemExist.pt_part,
      pt_desc1: checkItemExist.pt_desc1,
      pt_article: checkItemExist.pt_article,
      pt_price: checkItemExist.pt_price,
      pt_formule: checkItemExist.pt_formule,
      pt_bom_code: checkItemExist.pt_bom_code,
      suppliments: checkItemExist.suppliments,
      ingredients: checkItemExist.ingredients,
      sauces: checkItemExist.sauces,
      comment: this.sizeProduct,
      pt_part_type: checkItemExist.pt_part_type,
      pt_loc: checkItemExist.pt_loc,
      pt_qty: 1,
      line: this.cartProducts.length.toString(),
    };

    this.cart.products.push(this.itemToAdd);
    this.showPrice = true;

    this.cartProducts = this.cart.products;
    this.ingredients.map((item) => {
      item.isChecked = true;
    });
    this.cartAmount = this.calculateSubTotal();
    // this.offer &&
    //   (this.cart.total_price =
    //     this.cartAmount * (1 - Number(this.currentOffer.del_pct_disc) / 100)) &&
    //   (this.remisePrice =
    //     this.cartAmount * (Number(this.currentOffer.del_pct_disc) / 100)) &&
    //   (this.cartAmount = this.cart.total_price);
    // this.currentItem.suppliments = [];
    // this.currentItem.ingredients = [];
    // this.productInCartPrice = 0;
    // this.selectedIndex = 0;
    // this.showSize = false;
    // this.showSoda = false;
    // this.showSpec = false;
    // this.showSupp = false;
    // this.showSauces = false;
    // this.currentItem = undefined;
    this.offer && this.applyDiscount(this.currentOffer);
    this.disableIng = false;
    this.formule = false;
  }
  setSauce(sauce: any) {
    this.currentItem.pt_formule == false && (this.showSupp = true);
    this.currentItem &&
      this.currentItem.pt_formule == true &&
      (this.showSoda = true) &&
      (this.showSupp = false);
    this.currentItem && this.currentItem.sauces.push(sauce);
    // console.log(this.currentItem);
  }
  setSupplement(suppliment: any) {
    console.log(suppliment);

    this.currentItem && this.currentItem.suppliments.push(suppliment);
    // console.log(this.currentItem.sauces);
  }

  setIngredient(ingredient, i) {
    let currentItemSpec = this.currentItem.ingredients;

    if (ingredient.isChecked === true) {
      ingredient.isChecked = false;
      const l = document.getElementById(i);
      l.classList.add("selected");
      currentItemSpec.push(ingredient);
    } else {
      ingredient.isChecked = true;
      const l = document.getElementById(i);
      l.classList.remove("selected");
      currentItemSpec = currentItemSpec.filter((s) => s !== ingredient);
      const item = this.cartProducts.find(
        (item) => item.id === this.currentItem.id
      );
      item.ingredients = currentItemSpec;
    }
    this.currentItem.ingredients = currentItemSpec;
  }

  setAllIngredient(ingredient) {
    let currentItemSpec = this.currentItem.ingredients;
    const item = this.cartProducts.find(
      (item) => item.id === this.currentItem.id
    );
    if (item.ingredients.length === this.ingredients.length) {
      item.ingredients = [];
      const l = document.getElementById("ing");
      l.classList.remove("selected");
      this.disableIng = false;
    } else {
      const l = document.getElementById("ing");
      l.classList.add("selected");
      item.ingredients = ingredient;
      this.disableIng = true;
    }
  }

  setSoda() {
    this.currentItem &&
      this.currentItem.pt_formule == true &&
      (this.showSoda = true);
  }

  setListOfBrands(so: any) {
    this.showListOfBrands = true;
    this.elem = this.AllProducts.filter(
      (item) => item.pt_draw === so.code_value
    );
    console.log(this.elem);
    this.formule = true;
  }

  setListOfItems(drinks: any) {
    this.elem = this.AllProducts.filter(
      (item) => item.pt_group === drinks.code_value
    );
    this.showListOfSoda = true;
    // this.showSupp = true;
  }

  open(content) {
    this.modalService.open(content, { size: "xl" });
  }
  open2(content) {
    this.modalService.open(content, { size: "md" });
  }

  customizeProduct(content): void {
    // if (this.currentCategory.direct === true) {
    //   this.addProductToCart();
    // } else {
    //   this.open2(content);
    // }
  }

  addProductToCart() {
    // const checkItemExist = this.currentItem;
    // // checkItemExist.size != undefined ? this.sizeOfProduct : null;
    // const itemExist: Product = this.cartProducts.find((item) => {
    //   return (
    //     item.pt_part === checkItemExist.pt_part &&
    //     item.suppliments.length === checkItemExist.suppliments.length &&
    //     item.suppliments.filter((s) => checkItemExist.suppliments.includes(s))
    //       .length === checkItemExist.suppliments.length &&
    //     item.ingredients.length === checkItemExist.ingredients.length &&
    //     item.ingredients.filter((s) => checkItemExist.ingredients.includes(s))
    //       .length === checkItemExist.ingredients.length &&
    //     item.sauces.length === checkItemExist.sauces.length &&
    //     item.sauces.filter((s) => checkItemExist.sauces.includes(s)).length ===
    //       checkItemExist.sauces.length &&
    //     item.comment === checkItemExist.comment
    //   );
    // });
    // if (itemExist) {
    //   itemExist.pt_price =
    //     Number(itemExist.pt_price) +
    //     Number(itemExist.pt_price) / itemExist.pt_qty;
    //   itemExist.pt_qty = itemExist.pt_qty + 1;
    // } else {
    //   checkItemExist.suppliments.map((item) => {
    //     this.productInCartPrice =
    //       Number(this.productInCartPrice) + Number(item.pt_price);
    //   });
    //   this.productInCartPrice =
    //     Number(this.productInCartPrice) + Number(checkItemExist.pt_price);
    //   this.loclocOrder === "Emporté"
    //     ? this.posCategoryService
    //         .getByOneBom({ ptb_part: checkItemExist.pt_part })
    //         .subscribe((res: any) => {
    //           res.data.map((item) => {
    //             checkItemExist.pt_bom_code = item.ptb_bom;
    //           });
    //         })
    //     : null;
    //   this.itemToAdd = {
    //     id: Math.random(),
    //     pt_part: checkItemExist.pt_part,
    //     pt_desc1: checkItemExist.pt_desc1,
    //     pt_article: checkItemExist.pt_article,
    //     pt_price: this.offer
    //       ? Number(this.productInCartPrice) *
    //         (1 - Number(this.currentOffer.del_pct_disc) / 100)
    //       : Number(this.productInCartPrice),
    //     pt_formule: checkItemExist.pt_formule,
    //     pt_bom_code: checkItemExist.pt_bom_code,
    //     suppliments: checkItemExist.suppliments,
    //     ingredients: checkItemExist.ingredients,
    //     sauces: checkItemExist.sauces,
    //     comment: this.sizeProduct,
    //     pt_loc: checkItemExist.pt_loc,
    //     pt_qty: 1,
    //     line: this.cartProducts.length.toString(),
    //   };
    //   this.cart.products.push(this.itemToAdd);
    //   this.showPrice = true;
    // }
    // this.cartProducts = this.cart.products;
    // this.ingredients.map((item) => {
    //   item.isChecked = true;
    // });
    // this.cartAmount = this.calculateSubTotal();
    // // this.offer &&
    // //   (this.cart.total_price =
    // //     this.cartAmount * (1 - Number(this.currentOffer.del_pct_disc) / 100)) &&
    // //   (this.remisePrice =
    // //     this.cartAmount * (Number(this.currentOffer.del_pct_disc) / 100)) &&
    // //   (this.cartAmount = this.cart.total_price);
    // this.currentItem.suppliments = [];
    // this.currentItem.ingredients = [];
    // this.productInCartPrice = 0;
    // this.selectedIndex = 0;
    // this.showSize = false;
    // this.showSoda = false;
    // this.showSpec = false;
    // this.showSupp = false;
    // this.showSauces = false;
    // this.currentItem = undefined;
  }

  locOrderS(content) {
    this.loclocOrder = "Sur place";
    console.log(this.loclocOrder);
    this.cartProducts != null && this.setBomCode();
    this.modalService.open(content, { size: "lg" });
    this.inShop = true;
    this.showStatusDelivery = false;
    this.showStatusOut = false;
    const s = document.getElementById("btn1");
    const e = document.getElementById("btn2");
    const l = document.getElementById("btn3");
    s.classList.add("selected");
    e.classList.remove("selected");
    l.classList.remove("selected");
    this.offer = false;
    (this.cartAmount = this.cartAmount + this.remisePrice) &&
      (this.remisePrice = 0);
    this.platformesOffers.map((item) => {
      item.actif = false;
    });
    return this.loclocOrder;
  }
  locOrderE() {
    this.loclocOrder = "Emporté";
    console.log(this.loclocOrder);
    this.cartProducts != null && this.setBomCode();
    this.showStatusOut = true;
    this.inShop = false;
    this.showStatusDelivery = false;
    const s = document.getElementById("btn1");
    const e = document.getElementById("btn2");
    const l = document.getElementById("btn3");
    e.classList.add("selected");
    s.classList.remove("selected");
    l.classList.remove("selected");
    this.offer = false;
    (this.cartAmount = this.cartAmount + this.remisePrice) &&
      (this.remisePrice = 0);
    this.platformesOffers.map((item) => {
      item.actif = false;
    });
    return this.loclocOrder;
  }
  locOrderL(content) {
    this.currentTable = null;
    this.loclocOrder = "Livraison";
    console.log(this.loclocOrder);
    this.cartProducts != null && this.setBomCode();
    this.modalService.open(content, { size: "xl" });
    this.inShop = false;
    this.showStatusDelivery = true;
    this.showStatusOut = false;
    const s = document.getElementById("btn1");
    const e = document.getElementById("btn2");
    const l = document.getElementById("btn3");
    e.classList.remove("selected");
    s.classList.remove("selected");
    l.classList.add("selected");

    return this.loclocOrder;
  }

  setBomCode() {
    console.log("bom code qui change");
    this.cartProducts.map((product) => {
      this.loclocOrder === "Emporté" || this.loclocOrder === "Livraison"
        ? this.posCategoryService
            .getByOneBom({ ptb_part: product.pt_part })
            .subscribe((res: any) => {
              res.data.map((item) => {
                console.log(item.ptb_bom);
                return (product.pt_bom_code = item.ptb_bom);
              });
            })
        : this.posCategoryService
            .getByItems({ pt_part: product.pt_part })
            .subscribe((res: any) => {
              res.data.map((item) => {
                console.log(item.pt_bom_code);
                return (product.pt_bom_code = item.pt_bom_code);
              });
            });
    });
  }

  chooseTable(table) {
    this.currentTable = table;
  }

  clearCurrentCart(): void {
    this.cartAmount = 0;
    this.remisePrice = 0;
    this.cartProducts = [];
    this.cart.products = this.cartProducts;
    this.showPrice = false;
    //this.offer = false;
    this.disable = false;
    this.platformesOffers.map((item) => {
      item.actif = false;
    });
    this.editCart = false;
  }

  onDecreaseQty(product: Product): void {
    if (product.pt_qty == 1) {
      this.cartProducts = this.cartProducts.filter((s) => s !== product);
      this.cart.products = this.cartProducts;
    } else {
      product.pt_price =
        Number(product.pt_price) - Number(product.pt_price) / product.pt_qty;
      product.pt_qty = product.pt_qty - 1;
    }

    this.cartAmount = this.calculateSubTotal();
    this.cart.total_price = this.cartAmount;
    this.cart.products.length === 0 && (this.showPrice = false);
  }

  onIncreaseQty(product: Product): void {
    console.log(product);
    const pt = this.cartProducts.find((item) => item.id === product.id);
    pt.pt_price =
      Number(product.pt_price) + Number(product.pt_price) / product.pt_qty;
    pt.pt_qty = product.pt_qty + 1;
    this.cartAmount = this.calculateSubTotal();
    this.cart.total_price = this.cartAmount;
  }

  calculateSubTotal() {
    let val = this.cartProducts.reduce((acc, cur) => {
      return acc + Number(cur.pt_price);
    }, 0);
    return val;
  }
  getItemFromHistory(order) {
    this.editCart = true;
    const elem: Cart = this.ordersHistory.find(
      (item) => item.order_code === order.order_code
    );
    this.cart.order_code = order.order_code;
    this.disable = true;
    this.showPrice = true;
    this.posCategoryService
      .getOneOrder({ order_code: elem.order_code })
      .subscribe((res: any) => {
        this.cartProducts = res.data.products.map((item) => {
          return item;
        });
        this.cartAmount = Number(res.data.total_price);
        this.cart.products = this.cartProducts;
      });
  }

  prepareCart(content): void {
    let cart: Cart = {
      // id: Math.floor(Math.random() * 101) + 1,
      order_code: this.cart.order_code,
      products: this.cartProducts,
      order_emp: this.loclocOrder,
      customer: "particulier",
      status: "N",
      total_price: this.cartAmount,
      usrd_name: this.user.usrd_user_name,
      usrd_site: this.user.usrd_site,
      loy_num: this.loy_num,
      disc_amt: this.currentOffer ? this.currentOffer.del_pct_disc : null,
      del_comp: this.currentOffer ? this.currentOffer.del_desc : null,
      site_loc: this.currentTable ? this.currentTable : null,
      from: "BOUTIQUE",
    };
    // const data: PosPrintData[] = [
    //   {
    //     type: "image",
    //     url: "https://randomuser.me/api/portraits/men/43.jpg", // file path
    //     position: "center", // position of image: 'left' | 'center' | 'right'
    //     width: "160px", // width of image in px; default: auto
    //     height: "60px", // width of image in px; default: 50 or '50px'
    //   },
    //   {
    //     type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
    //     value: "SAMPLE HEADING",
    //     style: { fontWeight: "700", textAlign: "center", fontSize: "24px" },
    //   },
    //   {
    //     type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
    //     value: "Secondary text",
    //     style: {
    //       textDecoration: "underline",
    //       fontSize: "10px",
    //       textAlign: "center",
    //       color: "red",
    //     },
    //   },
    //   {
    //     type: "barCode",
    //     value: "023456789010",
    //     height: "40px", // height of barcode, applicable only to bar and QR codes
    //     width: "2px", // width of barcode, applicable only to bar and QR codes
    //     displayValue: true, // Display value below barcode
    //     fontsize: 12,
    //   },
    //   {
    //     type: "qrCode",
    //     value: "https://github.com/Hubertformin/electron-pos-printer",
    //     height: "55px",
    //     width: "55px",
    //     style: { margin: "10 20px 20 20px" },
    //   },
    //   {
    //     type: "table",
    //     // style the table
    //     style: { border: "1px solid #ddd" },
    //     // list of the columns to be rendered in the table header
    //     tableHeader: ["Animal", "Age"],
    //     // multi dimensional array depicting the rows and columns of the table body
    //     tableBody: [
    //       ["Cat", "2"],
    //       ["Dog", "4"],
    //       ["Horse", "12"],
    //       ["Pig", "4"],
    //     ],
    //     // list of columns to be rendered in the table footer
    //     tableFooter: ["Animal", "Age"],
    //     // custom style for the table header
    //     tableHeaderStyle: { backgroundColor: "#000", color: "white" },
    //     // custom style for the table body
    //     tableBodyStyle: { border: "0.5px solid #ddd" },
    //     // custom style for the table footer
    //     tableFooterStyle: { backgroundColor: "#000", color: "white" },
    //   },
    //   {
    //     type: "table",
    //     style: { border: "1px solid #ddd" }, // style the table
    //     // list of the columns to be rendered in the table header
    //     tableHeader: [{ type: "text", value: "People" }],
    //     // multi-dimensional array depicting the rows and columns of the table body

    //     // list of columns to be rendered in the table footer

    //     // custom style for the table header
    //     tableHeaderStyle: { backgroundColor: "red", color: "white" },
    //     // custom style for the table body
    //     tableBodyStyle: { border: "0.5px solid #ddd" },
    //     // custom style for the table footer
    //     tableFooterStyle: { backgroundColor: "#000", color: "white" },
    //   },
    // ];
    // PosPrinter.print(data, options)
    //   .then(console.log)
    //   .catch((error) => {
    //     console.error(error);
    //   });
    this.posCategoryService
      .addOrder({ cart, editCart: this.editCart })
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
          this.offer === true && (this.offer = false);
          this.currentOffer = null;

          this.loadingSubject.next(false);
        }
      );
    // this.posCategoryService
    //   .createIssWo({ detail: this.detail, user: this.user.usrd_user_name })
    //   .subscribe(
    //     (reponse) => console.log("response", Response),
    //     (error) => {
    //       this.layoutUtilsService.showActionNotification(
    //         "Erreur verifier les informations",
    //         MessageType.Create,
    //         10000,
    //         true,
    //         true
    //       );
    //       this.loadingSubject.next(false);
    //     },
    //     () => {
    //       this.layoutUtilsService.showActionNotification(
    //         "Ajout avec succès",
    //         MessageType.Create,
    //         10000,
    //         true,
    //         true
    //       );
    //       this.loadingSubject.next(false);
    //     }
    //   );

    this.cartAmount = 0;
    this.remisePrice = 0;
    this.cart.products = [];
    this.cartProducts = [];
    this.showPrice = false;
    this.inShop = false;
    this.showStatusDelivery = false;
    this.showStatusOut = false;
    this.offer = false;
    this.loclocOrder = "Sur place";
    this.currentTable = "01";
    this.cart.order_code = null;
    this.editCart = false;
  }

  changeSelection(event, index) {
    this.selectedIndex = event.target.checked ? index : undefined;
    if (index === 1) {
      this.sizeProduct = "Classic";
    } else {
      this.sizeProduct = "Mega";
    }
    // do your logic here...
  }

  introduceInventory(content) {
    // this.showSize = true;
  }

  podRec(content) {
    this.modalService.open(content, { size: "xl" });

    this.initGrid2();
  }

  checkCloseInventory(content) {
    this.modalService.open(content, { size: "xl" });
    this.dataset.map((item) => {
      item.tag_cnt_qty = 0;
    });
  }

  setCloseInventory() {
    this.dataset.map((item) => {
      return (item.tag_cnt_qty = item.tag_cnt_qty);
    });
    this.posCategoryService.checkInventory2({ detail: this.dataset }).subscribe(
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
        this.loadingSubject.next(false);
      }
    );
  }
  checkOpenInventory2(content) {
    this.modalService.open(content, { size: "xl" });
    this.dataset.map((item) => {
      item.tag_cnt_qty = 0;
    });
  }

  openModal(content) {
    this.modalService.open(content, { size: "sm" });
  }

  setOpenInventory2() {
    this.value1 = true;
    this.dataset.map((item) => {
      return (item.tag_cnt_qty = item.tag_cnt_qty);
    });
    this.posCategoryService.checkInventory({ detail: this.dataset }).subscribe(
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
        this.stateInventory = true;
        this.globalState = false;
        this.loadingSubject.next(false);
      }
    );
  }
  handleSelectedRowsChanged(e, args) {}

  getHistory(content) {
    this.posCategoryService
      .getAllOrders({ user: this.user.usrd_user_name })
      .subscribe((res: any) => {
        this.ordersHistory = res.data.map((item) => {
          return item;
        });
      });
    this.modalService.open(content, { size: "xl" });
  }

  // Sodata() {
  //   this.posCategoryService
  //     .getWod({ wod_nbr: this.cart.code_cart })
  //     .subscribe((res: any) => {
  //       this.salesOrder = res.data.map((item) => {
  //         return item;
  //       });
  //     });

  //   this.itSo = this.cart.created_date;
  // }

  paiement() {
    this.posCategoryService
      .processTopaiement({
        cart: this.cart,
        type: "REC",
        user_name: this.user.usrd_user_name,
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
          this.loadingSubject.next(false);
        }
      );
    console.log("pssss22222", this.cartProducts);
    this.detail = [];
    (this.workOrders = []), (this.detailSo = []), (this.it = null);
    this.cartProducts = [];
    this.cart.products = [];
    this.showPrice = false;
    this.disable = false;
  }
  time = new Observable<string>((observer: Observer<string>) => {
    setInterval(() => {
      observer.next("");
      this.applyDiscount;
    }, 10);
  });

  gridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;
    this.gridService = angularGrid.gridService;
  }

  gridReady4(angularGrid: AngularGridInstance) {
    this.angularGrid4 = angularGrid;
    this.gridObj4 = (angularGrid && angularGrid.slickGrid) || {};
  }
  gridReady18(angularGrid: AngularGridInstance) {
    this.angularGrid18 = angularGrid;
    this.dataView18 = angularGrid.dataView;
    this.grid18 = angularGrid.slickGrid;
    this.gridService18 = angularGrid.gridService;
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
      .getAllProductInventory({
        ld_site: this.user.usrd_site,
        ld_status: "CONFORME",
      })
      .subscribe(
        (response: any) => (this.dataset = response.data),
        (error) => {
          this.dataset = [];
        },
        () => {}
      );
  }

  initGrid2() {
    this.columnDefinitions2 = [
      {
        id: "description",
        name: "Description",
        field: "item.pt_desc1",
        sortable: true,
        width: 80,
        filterable: false,
      },
      {
        id: "pod_qty_ord",
        name: "Qte Commandée",
        field: "pod_qty_ord",
        sortable: true,
        width: 80,
        filterable: false,
      },
      {
        id: "pod_serial",
        name: "Numéro de lot",
        field: "pod_serial",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.float,
          params: { decimalPlaces: 2 },
        },
      },
      {
        id: "pod_qty_rcvd",
        name: "Qte receptionnée",
        field: "pod_qty_rcvd",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.float,
          params: { decimalPlaces: 2 },
        },
      },
      {
        id: "pod_qty_chg",
        name: "Qte livrée",
        field: "pod_qty_chg",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.float,
          params: { decimalPlaces: 2 },
        },
      },
    ];

    this.gridOptions2 = {
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
      .getPoRec({ pod_site: this.user.usrd_site })
      .subscribe(
        (response: any) => (this.datasetRec = response.detail),
        (error) => {
          this.dataset = [];
        },
        () => {}
      );
  }

  initGrid5() {
    this.columnDefinitions5 = [
      {
        id: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        formatter: Formatters.deleteIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
            this.angularGrid.gridService.deleteItem(args.dataContext);
          }
        },
      },
      {
        id: "pt_part",
        name: "Désignation",
        field: "pt_part",
        sortable: true,
        width: 50,
        filterable: false,
      },
      {
        id: "pt_desc",
        name: "Article",
        field: "pt_desc",
        sortable: true,
        width: 50,
        filterable: false,
        onCellChange: (e: Event, args: OnEventArgs) => {
          console.log(args.dataContext.pt_part);
          this.posCategoryService
            .getItem({ pt_part: args.dataContext.pt_part })
            .subscribe((resp: any) => {
              if (resp.data) {
                this.gridService.updateItemById(args.dataContext.id, {
                  ...args.dataContext,
                  pt_part: resp.data.pt_part,
                  pt_price: resp.data.pt_price,
                  pt_vend: resp.data.pt_vend,
                });
              } else {
                alert("Article Nexiste pas");
                this.gridService.updateItemById(args.dataContext.id, {
                  ...args.dataContext,
                  pt_part: null,
                });
              }
            });
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
          let element: HTMLElement = document.getElementById(
            "openItemsGrid"
          ) as HTMLElement;
          element.click();
        },
      },
      {
        id: "pt_ord_qty",
        name: "Quantité",
        field: "pt_ord_qty",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.float,
        editor: {
          model: Editors.float,
          params: { decimalPlaces: 2 },
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          console.log(args.dataContext.pt_ord_qty);
        },
      },
      {
        id: "pt_price",
        name: "Prix d'achat",
        field: "pt_price",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.float,
        editor: {
          model: Editors.float,
          params: { decimalPlaces: 2 },
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          console.log(args.dataContext.pt_price);
        },
      },
      {
        id: "pt_vend",
        name: "Fournisseur",
        field: "pt_vend",
        sortable: true,
        width: 50,
        filterable: false,
        editor: {
          model: Editors.text,
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          console.log(args.dataContext.pt_vend);
        },
      },
    ];

    this.gridOptions5 = {
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

    this.dataset5 = [];
    this.posCategoryService
      .getPoRec({ pod_site: this.user.usrd_site })
      .subscribe(
        (response: any) => (this.dataset5 = response.detail),
        (error) => {
          this.dataset5 = [];
        },
        () => {}
      );
  }

  podRecRec() {
    this.datasetRec.map((item) => {
      return (item.pod_qty_rcvd = item.pod_qty_rcvd);
    });
    this.posCategoryService
      .createRctPo({ detail: this.datasetRec, it: new Date() })
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
          this.loadingSubject.next(false);
        }
      );
    this.datasetRec = [];
  }

  initGrid3() {
    this.columnDefinitions3 = [
      {
        id: "bk_desc",
        name: "Description",
        field: "bk_desc",
        sortable: true,
        width: 80,
        filterable: false,
      },
      {
        id: "bk_num_doc",
        name: "Numéro document",
        field: "bk_num_doc",
        sortable: true,
        width: 80,
        filterable: false,
      },
      {
        id: "bk_balance",
        name: "Montant",
        field: "bk_balance",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.float,
          params: { decimalPlaces: 2 },
        },
      },
    ];

    this.gridOptions3 = {
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
      .getBank({ bk_user1: this.user.usrd_user_name })
      .subscribe(
        (response: any) => (this.bank = response.data),
        (error) => {
          this.dataset = [];
        },
        () => {}
      );
  }

  initGrid4() {
    this.columnDefinitions4 = [
      {
        id: "pt_part",
        name: "code article",
        field: "pt_part",
        sortable: true,
        width: 80,
        filterable: true,
      },
      {
        id: "pt_desc1",
        name: "description article",
        field: "pt_desc1",
        sortable: true,
        width: 80,
        filterable: true,
      },
      {
        id: "pt_price",
        name: "prix d'achat",
        field: "pt_price",
        sortable: true,
        width: 80,
        filterable: true,
      },
    ];

    this.gridOptions4 = {
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

    this.dataset = [];
    this.posCategoryService
      .getSomeProducts({ pt_buyer: this.selectedBank })
      .subscribe(
        (response: any) => (this.items = response.data),
        (error) => {
          this.dataset = [];
        },
        () => {}
      );
  }
  open4(content) {
    this.modalService.open(content, { size: "lg" });

    this.initGrid4();
  }

  handleSelectedRowsChanged4(e, args) {
    console.log(args.rows);
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    console.log(updateItem);
    if (Array.isArray(args.rows) && this.gridObj4) {
      args.rows.map((idx) => {
        const item = this.gridObj4.getDataItem(idx);
        console.log(item);

        this.posCategoryService
          .getItem({ pt_part: item.pt_part, pt_site: item.pt_site })
          .subscribe((response: any) => {
            this.item = response.data;
            updateItem.pt_part = item.pt_part;
            updateItem.pt_desc = item.pt_desc1;
            updateItem.pt_price = item.pt_price;
            updateItem.pt_vend = item.pt_vend;
            this.gridService.updateItem(updateItem);
            console.log(response.data);
          });
      });
    }
  }
  opBk(content) {
    this.modalService.open(content, { size: "xl" });
    this.posCategoryService
      .getBank({ bk_user1: this.user.usrd_user_name })
      .subscribe((res: any) => {
        this.bank = res.data.map((item) => {
          item.bk_balance = 0;
          return item;
        });
      });
  }

  onSubmitCaisseInventory() {
    this.posCategoryService
      .createBkBkh({
        detail: this.bank,
        type: "O",
        user: this.user.usrd_user_name,
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
          this.stateCaisse = true;
          this.stateInventory = false;
          this.loadingSubject.next(false);
        }
      );
    this.bank = [];
  }

  onSubmitCaisseClotureInventory() {
    this.posCategoryService
      .createBkBkh({
        detail: this.bank,
        type: "C",
        user: this.user.usrd_user_name,
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
          this.globalState = true;
          this.stateInventory = true;
          this.stateCaisse = false;
          this.loadingSubject.next(false);
        }
      );
    this.bank = [];
  }

  createBkForm() {
    this.bkForm = this.bkFb.group({
      bk_code: "",
      bk_balance: "",
    });
  }
  createMvForm() {
    this.mvForm = this.mvFb.group({
      mv_cause: "",
      mv_amt: "",
    });
  }
  createCustomerForm() {
    this.customerForm = this.customerFb.group({
      customer_code: "",
      customer_name: "",
      customer_addr: "",
      customer_phone_one: 0,
      customer_birthday: "",
      customer_gender: "",
    });
  }
  mouvementCaisse(content) {
    this.modalService.open(content, { size: "xl" });
    this.initGrid5();
  }

  addNewItem(elem) {
    console.log(elem);
    this.gridService.addItem(
      {
        id: this.dataset5.length + 1,
        pt_line: this.dataset5.length + 1,
      },
      { position: "bottom" }
    );
  }
  selectOption(id: number) {
    //getted from event
    console.log(id);
    //getted from binding
    console.log(this.bk_type);
  }

  PlanPOD() {
    this.posCategoryService
      .addPo({
        Site: this.user.usrd_site,
        purchaseOrder: this.dataset5,
        po_blanket: this.selectedBank,
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
          this.loadingSubject.next(false);
        }
      );
  }
  mvBank(content) {
    this.modalService.open(content, { size: "xl" });
  }

  addClientModal(content) {
    this.modalService.open(content, { size: "xl" });
  }
  prepareMv(): any {
    const controls = this.mvForm.controls;
    const _mv = {
      mv_cause: "",
      mv_amt: 0,
    };
    _mv.mv_cause = controls.mv_cause.value;
    _mv.mv_amt = controls.mv_amt.value;

    return _mv;
  }

  prepareCustomer(): any {
    const controls = this.customerForm.controls;
    const _customer = {
      customer_code: "",
      customer_name: "",
      customer_addr: "",
      customer_phone_one: 0,
      customer_birthday: "",
      customer_gender: "",
    };
    _customer.customer_code = controls.customer_code.value;
    _customer.customer_name = controls.customer_name.value;
    _customer.customer_addr = controls.customer_addr.value;
    _customer.customer_phone_one = controls.customer_phone_one.value;
    _customer.customer_birthday = controls.customer_birthday.value;
    _customer.customer_gender = controls.customer_gender.value;

    return _customer;
  }

  onSubmitCustomer() {
    const customer = this.prepareCustomer();

    this.posCategoryService.createCustomer({ customer }).subscribe(
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
        this.loadingSubject.next(false);
      }
    );
  }

  onSubmitMv() {
    const mv = this.prepareMv();
    console.log(mv);
    this.posCategoryService
      .createFRequest({ mv, type: "D", user_site: this.user.usrd_site })
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
          this.loadingSubject.next(false);
        }
      );
  }

  pEmp(content) {
    this.modalService.open(content, { size: "xl" });

    this.initGrid18();
  }

  angularGridReady18(angularGrid: AngularGridInstance) {
    this.angularGrid18 = angularGrid;
    this.gridObj18 = (angularGrid && angularGrid.slickGrid) || {};
  }

  initGrid18() {
    this.emps = [];
    this.columnDefinitions18 = [
      {
        id: "emp_fname",
        name: "Nom",
        field: "emp_fname",
        sortable: true,
        width: 80,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "emp_lname",
        name: "Prénom",
        field: "emp_lname",
        sortable: true,
        width: 80,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "reason",
        name: "Etat",
        field: "reason",
        sortable: true,
        width: 50,
        filterable: true,
        type: FieldType.string,
        editor: {
          model: Editors.singleSelect,

          // We can also add HTML text to be rendered (any bad script will be sanitized) but we have to opt-in, else it will be sanitized
          enableRenderHtml: true,
          collectionAsync: this.http.get(`${API_URL}/emptime`), //this.http.get<[]>( 'http://localhost:3000/api/v1/codes/check/') /*'api/data/pre-requisites')*/ ,
          //   customStructure: {
          //     value: 'code_value',
          //     label: 'code_cmmt',
          //     optionLabel: 'code_value', // if selected text is too long, we can use option labels instead
          //     //labelSuffix: 'text',
          //  },
          //   editorOptions: {
          //     maxHeight: 400
          //   }
        },
      },
      {
        id: "timestart",
        name: "Heure D'entrée",
        field: "timestart",
        sortable: true,
        width: 80,
        filterable: true,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
        onCellChange: (e: Event, args: OnEventArgs) => {},
      },
      {
        id: "timeend",
        name: "Heure De Sortie",
        field: "timeend",
        sortable: true,
        width: 80,
        filterable: true,
        type: FieldType.string,

        editor: {
          model: Editors.text,
        },
        onCellChange: (e: Event, args: OnEventArgs) => {},
      },
    ];

    this.gridOptions18 = {
      enableSorting: true,
      enableCellNavigation: true,
      enableExcelCopyBuffer: true,
      enableFiltering: true,
      autoEdit: true,
      editable: true,
      autoHeight: false,
      frozenColumn: 0,
      frozenBottom: true,
      enableRowSelection: true,
      enableCheckboxSelector: true,
      checkboxSelector: {},
      multiSelect: false,
      rowSelectionOptions: {
        selectActiveRow: true,
      },
    };

    // fill the dataset with your data
    this.employeService
      .getByTime({ emp_site: this.user.usrd_site })
      .subscribe((response: any) => (this.emps = response.data));
  }

  onSubmitEmpTime() {
    this.employeService.addTime({ empDetails: this.emps }).subscribe(
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
        this.loadingSubject.next(false);
      }
    );
  }
  selectChangeHandler(event: any) {
    //update the ui

    console.log(this.selectedBank);
  }

  onChangeDiscount(discount) {
    console.log(discount);

    if (discount) {
      this.loy_num = discount;
      const elem = this.discountTable.find((item) => item.cm_addr === discount);
      if (elem) {
        // console.log(elem.cm_disc_pct);
        console.log(this.cart.total_price);

        this.cart.total_price =
          this.cartAmount * (1 - Number(elem.cm_disc_pct) / 100);

        this.remisePrice = this.cartAmount * (Number(elem.cm_disc_pct) / 100);
        this.cartAmount = this.cart.total_price;
      }
      console.log(this.remisePrice);
    }
  }

  pArticle(content) {
    this.modalService.open(content, { size: "xl" });
  }
  onSelectServiceBuy() {
    this.RequestBuyingArticle = true;
  }
  onSelectAutre() {
    this.RequestBuyingArticle = false;
  }

  onSelectDelivery(option) {
    this.currentPlatformeOffers = [];
    this.productOffers = [];
    this.deliveryOption = option.code_desc;
    console.log(this.platformesOffers);
    const now = new Date();
    let ChangedFormat = this.pipe.transform(now, "yyyy-MM-dd");

    const current =
      now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();

    this.currentPlatformeOffers = this.platformesOffers.filter(
      (del) =>
        del.del_desc === option.code_desc &&
        del.del_valid < ChangedFormat &&
        del.del_exp > ChangedFormat
    );
    console.log(this.platformesOffers);
  }

  applyDiscount(p) {
    this.currentOffer &&
      this.currentOffer.del_code != p.del_code &&
      (this.cartAmount = this.cartAmount + this.remisePrice) &&
      (this.remisePrice = 0);
    this.offer = true;
    this.platformesOffers.map((item) => {
      item.del_code === p.del_code ? (item.actif = true) : (item.actif = false);
    });
    this.currentOffer = p;

    if (p.del_cndt === "A") {
      this.remisePrice = this.cartAmount * (Number(p.del_pct_disc) / 100);
      this.cartAmount =
        this.cartAmount - this.cartAmount * (Number(p.del_pct_disc) / 100);
    } else {
      const exist = this.cartProducts.find(
        (item) => item.pt_part_type === p.del_cndt
      );
      if (exist) {
        this.remisePrice = this.cartAmount * (Number(p.del_pct_disc) / 100);
        this.cartAmount =
          this.cartAmount - this.cartAmount * (Number(p.del_pct_disc) / 100);
        p.del_cndt = "A";
      }
    }
  }
}
