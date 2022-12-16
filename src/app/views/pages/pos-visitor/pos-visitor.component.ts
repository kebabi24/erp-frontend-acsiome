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

import { environment } from "../../../../environments/environment";
const API_URL = environment.apiUrl + "/codes";

@Component({
  selector: "kt-pos-visitor",
  templateUrl: "./pos-visitor.component.html",
  styleUrls: ["./pos-visitor.component.scss"],
})
export class PosVisitorComponent implements OnInit {
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
  sites: any[] = [];
  currentSite: any;
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
            spec_code: item.pt_part,
            pt_desc1: item.pt_desc1,
            pt_desc2: item.pt_desc2,
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
      usrd_profile: this.user.usrd_profile,
      usrd_name: this.user.usrd_user_name,
      usrd_site: this.user.usrd_site,
      from: "CALL CENTER",
    };

    this.createCustomerForm();
    // this.initGrid2();
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
    this.detail = [];
    const elem: Cart = this.ordersHistory.find(
      (item) => item.order_code === order.order_code
    );
    this.disable = true;
    this.showPrice = true;
    this.posCategoryService
      .getOneOrder({ order_code: elem.order_code })
      .subscribe((res: any) => {
        this.cartProducts = res.data.products;
        this.cartAmount = Number(res.data.total_price);
      });

    this.cart = elem;
  }

  prepareCart(): void {
    let cart: Cart = {
      id: Math.floor(Math.random() * 101) + 1,
      products: this.cartProducts,
      order_emp: this.loclocOrder,
      customer: "particulier",
      status: "A",
      total_price: this.cartAmount,
      usrd_name: this.user.usrd_user_name,
      usrd_profile: this.user.usrd_profile,
      usrd_site: this.currentSite.si_site,
      loy_num: this.loy_num,
      disc_amt: this.currentOffer ? this.currentOffer.del_pct_disc : null,
      del_comp: this.currentOffer ? this.currentOffer.del_desc : null,
      site_loc: this.currentTable ? this.currentTable : null,
      from: "CALL CENTER",
    };
    console.log(cart.products);
    this.posCategoryService
      .addCallCenterOrder({ cart, user_site: this.user.usrd_site })
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
    this.selectedProducts = [];
    this.showSize = false;
    this.showSoda = false;
    this.showSpec = false;
    this.showSupp = false;
    this.showSauces = false;
    this.globalState = true;
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

  handleSelectedRowsChanged(e, args) {}

  time = new Observable<string>((observer: Observer<string>) => {
    setInterval(() => {
      observer.next("");
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

  createCustomerForm() {
    this.customerForm = this.customerFb.group({
      customer_code: "",
      customer_name: "",
      customer_addr: "",
      customer_phone_one: null,
      customer_birthday: "",
      customer_gender: "",
    });
  }

  addClientModal(content) {
    this.modalService.open(content, { size: "xl" });
  }

  prepareCustomer(): any {
    const controls = this.customerForm.controls;
    const phone_number = document.getElementById("phone_number");
    var currentValue = phone_number.getAttribute("value");

    const _customer = {
      customer_code: "",
      customer_name: "",
      customer_addr: "",
      customer_phone_one: null,
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
  onChangeDiscount(discount) {
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
  onCheckCustomer(discount, content) {
    if (discount) {
      this.loy_num = discount;
      const elem = this.discountTable.find((item) => item.cm_addr === discount);
      if (elem) {
        console.log("nothing");
      } else {
        this.modalService.open(content, { size: "xl" });
      }
    }
  }

  getSite(content) {
    this.modalService.open(content, { size: "xl" });
    this.posCategoryService
      .getAllSite()
      .subscribe((response: any) => (this.sites = response.data));
  }

  setSite(s) {
    this.globalState = false;
    this.currentSite = s;
  }
}
