import { Component, OnInit } from "@angular/core";
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
import { PosCategoryService } from "../../../core/erp";
import { LayoutUtilsService, MessageType } from "src/app/core/_base/crud";
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

@Component({
  selector: "kt-pos",
  templateUrl: "./pos.component.html",
  styleUrls: ["./pos.component.scss"],
})
export class PosComponent implements OnInit {
  bkForm: FormGroup;
  bk: any;
  hasFormErrors = false;
  inventory: PosInventory;
  InventoryForm: FormGroup;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  categories: Observable<Category[]>;
  products: any[];
  family: any[];
  cart: Cart;
  selectedCategory?: Category;
  selectedProducts?: Array<Product>;
  suppliments: any[];
  ingredients: Spec[];
  soda: any[];
  drinksBrand: any[];
  sauces: any[];
  cartProducts?: Array<Product> = [];
  lastSeq: Array<any>;
  showPrice: boolean = false;
  itemToAdd: Product;
  productInCartPrice: number = 0;
  subtotalPrice: number = 0;
  AllProducts: Array<Product>;
  currentItem: any;
  updatedCart: Cart;
  loclocOrder: string = "Sur place";
  AllTables: string[];
  currentTable: string;
  isChecked: boolean = false;
  isDisabled: boolean = true;
  disableButton: boolean = true;
  selectedIndex: number;
  sizeProduct: string = "Classic";
  PosInventory: PosInventory;
  secondFormule: string;
  row_number;
  angularGrid: AngularGridInstance;
  grid: any;
  gridService: GridService;
  dataView: any;
  columnDefinitions: Column[];
  columnDefinitions2: Column[];
  gridOptions: GridOption;
  gridOptions2: GridOption;
  columnDefinitions3: Column[];
  gridOptions3: GridOption;
  columnDefinitions4: Column[];
  gridOptions4: GridOption;
  dataset: any[];
  gridObj: any;
  ordersHistory: Array<Cart>;
  showSize: boolean = false;
  showSupp: boolean = false;
  showSpec: boolean = false;
  showSoda: boolean = false;
  showSauces: boolean = false;
  showListOfSoda: boolean = false;
  families: Array<any>;
  sizeOfProduct: Array<any>;
  ItemsToAddToCard: Product;
  addProductBtn: boolean = false;
  workOrders: any[];
  detail: any[] = [];
  it: any;
  detailSo: any[] = [];
  itSo: any;
  salesOrder: any[];
  user;
  inventoryData: any[] = [];
  tag_cnt_qty;
  datasetRec: any[] = [];
  bank: any[] = [];
  chooseCaisse: boolean;
  inventoryTabcaisse: any[] = [];
  regie: boolean = false;
  value1: any;
  value2: any;
  private results: Observable<any[]>;
  constructor(
    config: NgbDropdownConfig,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private InventoryFB: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private posCategoryService: PosCategoryService,
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
  }

  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.bk = bk;
    this.AllTables = Tables;

    this.user = JSON.parse(localStorage.getItem("user"));
    console.log("hna user", this.user.usrd_site);

    this.cart = {
      id: Math.floor(Math.random() * 101) + 1,
      code_cart: "CC-" + Math.floor(Math.random() * 101) + 1,
      products: [],
      order_emp: this.loclocOrder,
      customer: "particulier",
      total_price: 0,
      usrd_site: this.user.usrd_site,
    };

    this.initGrid();

    // this.initGrid2();
  }

  onSelect(category: Category): void {
    this.showSize = false;
    this.showSupp = false;
    this.showSauces = false;
    this.showSoda = false;
    this.showListOfSoda = false;
    this.selectedProducts = this.families.filter(
      (item) => item.code_cmmt === category.category_code
    );

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
    this.sizeOfProduct = this.AllProducts.filter(
      (item) => item.pt_draw === productOnlist.code_value
    );
    this.addProductBtn = true;
    this.sizeOfProduct.map((item) => {
      if (item.pt_group != null) {
        this.showSize = true;
      } else {
        this.prepareProductWithoutSize(productOnlist);
      }
    });

    this.sizeOfProduct.map((item) => {
      item.pt_group == "null" && (this.showSupp = false);
    });
    if (productOnlist.code_cmmt == "CT007") {
      this.setListOfSoda(productOnlist);
      this.showSize = false;
    }
  }
  prepareProductWithoutSize(productOnlist) {
    this.currentItem = this.sizeOfProduct.find(
      (item) => item.pt_draw === productOnlist.code_value
    );
    this.addProductBtn = true;
    this.currentItem = {
      id: this.currentItem.id,
      pt_part: this.currentItem.pt_part,
      pt_desc1: this.currentItem.pt_desc1,
      pt_article: this.currentItem.pt_article,
      pt_formule: this.currentItem.pt_formule,
      pt_loc: this.currentItem.pt_loc,
      pt_price: this.currentItem.pt_price,
      pt_bom_code: this.currentItem.pt_bom_code,
      pt_qty: 1,
      comment: this.currentItem.pt_group,
      suppliments: [],
      ingredients: [],
      sauces: [],
    };
    console.log(this.currentItem);
  }
  prepareProduct(size) {
    this.currentItem = this.sizeOfProduct.find(
      (item) => item.pt_group === size.pt_group
    );
    console.log(size);
    this.sizeProduct = this.currentItem.pt_group;
    this.showSupp = true;

    this.currentItem = {
      id: this.currentItem.id,
      pt_part: this.currentItem.pt_part,
      pt_desc1: this.currentItem.pt_desc1,
      pt_article: this.currentItem.pt_article,
      pt_formule: this.currentItem.pt_formula,
      pt_loc: this.currentItem.pt_loc,
      pt_price: this.currentItem.pt_price,
      pt_bom_code: this.currentItem.pt_bom_code,
      pt_qty: 1,
      comment: this.currentItem.pt_group,
      suppliments: [],
      ingredients: [],
      sauces: [],
    };
  }
  setSupplement(suppliment: any) {
    this.showSauces = true;

    this.currentItem && this.currentItem.suppliments.push(suppliment);
    console.log(this.currentItem);
  }
  setSauces(sauce: any) {
    this.currentItem &&
      this.currentItem.pt_formule == true &&
      (this.showSoda = true);
    this.currentItem && this.currentItem.sauces.push(sauce);
    console.log(this.currentItem.sauces);
  }

  setIngredient(ingredient: Spec) {
    let currentItemSpec = this.currentItem.ingredients;

    if (ingredient.isChecked === true) {
      ingredient.isChecked = false;
      currentItemSpec.push(ingredient);
      console.log(ingredient);
    } else {
      ingredient.isChecked = true;
      currentItemSpec = currentItemSpec.filter((s) => s !== ingredient);
    }
    this.currentItem.ingredients = currentItemSpec;
  }

  setSoda() {
    this.currentItem &&
      this.currentItem.pt_formula == true &&
      (this.showSoda = true);
  }

  setListOfSoda(so: any) {
    this.drinksBrand = this.AllProducts.filter(
      (item) => item.pt_draw === so.code_value
    );
    this.showListOfSoda = true;
  }

  open(content) {
    this.modalService.open(content, { size: "xl" });
  }
  open2(content) {
    this.modalService.open(content, { size: "lg" });
  }

  customizeProduct(content): void {
    // this.currentItem = productOnlist;
    this.open2(content);
  }

  addProductToCart() {
    console.log(this.AllProducts);
    const checkItemExist = this.currentItem;
    checkItemExist.size = this.sizeProduct;
    const itemExist: Product = this.cartProducts.find((item) => {
      return (
        item.pt_part === checkItemExist.pt_part &&
        item.suppliments.length === checkItemExist.suppliments.length &&
        item.suppliments.filter((s) => checkItemExist.suppliments.includes(s))
          .length === checkItemExist.suppliments.length &&
        item.ingredients.length === checkItemExist.ingredients.length &&
        item.ingredients.filter((s) => checkItemExist.ingredients.includes(s))
          .length === checkItemExist.ingredients.length &&
        item.sauces.length === checkItemExist.sauces.length &&
        item.sauces.filter((s) => checkItemExist.sauces.includes(s)).length ===
          checkItemExist.sauces.length &&
        item.comment === checkItemExist.comment
      );
    });
    if (itemExist) {
      itemExist.pt_price =
        Number(itemExist.pt_price) +
        Number(itemExist.pt_price) / itemExist.pt_qty;
      itemExist.pt_qty = itemExist.pt_qty + 1;
    } else {
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
        pt_price: Number(this.productInCartPrice),
        pt_formule: checkItemExist.pt_formule,
        pt_bom_code: checkItemExist.pt_bom_code,
        suppliments: checkItemExist.suppliments,
        ingredients: checkItemExist.ingredients,
        sauces: checkItemExist.sauces,
        comment: this.sizeProduct,
        pt_loc: checkItemExist.pt_loc,
        pt_qty: 1,
        line: this.cartProducts.length.toString(),
      };

      this.cart.products.push(this.itemToAdd);
      this.showPrice = true;
    }
    console.log(typeof checkItemExist.pt_price);
    this.cartProducts = this.cart.products;
    console.log(this.cart);
    this.ingredients.map((item) => {
      item.isChecked = true;
    });
    this.subtotalPrice = this.calculateSubTotal();
    this.currentItem.suppliments = [];
    this.currentItem.ingredients = [];
    this.productInCartPrice = 0;
    this.selectedIndex = 0;
    this.showSize = false;
    this.showSoda = false;
    this.showSpec = false;
    this.showSupp = false;
    this.showSauces = false;
    this.currentItem = undefined;
  }

  locOrderS(content) {
    this.loclocOrder = "Sur place";
    this.cartProducts != null && this.setBomCode();
    this.modalService.open(content, { size: "lg" });

    return this.loclocOrder;
  }
  locOrderE() {
    this.loclocOrder = "Emporté";
    this.cartProducts != null && this.setBomCode();

    return this.loclocOrder;
  }
  locOrderL() {
    this.loclocOrder = "Livraison";
    this.cartProducts != null && this.setBomCode();
    return this.loclocOrder;
  }

  setBomCode() {
    this.cartProducts.map((product) => {
      this.loclocOrder === "Emporté" || this.loclocOrder === "Livraison"
        ? this.posCategoryService
            .getByOneBom({ ptb_part: product.pt_part })
            .subscribe((res: any) => {
              res.data.map((item) => {
                return (product.pt_bom_code = item.ptb_bom);
              });
            })
        : this.posCategoryService
            .getByItems({ pt_part: product.pt_part })
            .subscribe((res: any) => {
              res.data.map((item) => {
                return (product.pt_bom_code = item.pt_bom_code);
              });
            });
    });
  }

  chooseTable(table) {
    this.currentTable = table;
  }

  clearCurrentCart(): void {
    this.cartProducts = [];
    this.cart.products = this.cartProducts;
    this.showPrice = false;

    this.ingredients.map((item) => {
      item.isChecked = true;
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
    this.subtotalPrice = this.calculateSubTotal();
    this.cart.total_price = this.subtotalPrice;
    this.cart.products.length === 0 && (this.showPrice = false);
  }

  onIncreaseQty(productCart: Product): void {
    this.cartProducts.filter((item) => {
      if (item.pt_part === productCart.pt_part) {
        const price = Number(item.pt_price);
        item.pt_price =
          Number(productCart.pt_price) +
          Number(productCart.pt_price) / productCart.pt_qty;
        item.pt_qty = productCart.pt_qty + 1;
      }
    });
    this.subtotalPrice = this.calculateSubTotal();
    this.cart.total_price = this.subtotalPrice;
  }

  calculateSubTotal() {
    let val = this.cartProducts.reduce((acc, cur) => {
      return acc + Number(cur.pt_price);
    }, 0);
    return val;
  }

  prepareCart(content): void {
    let cart: Cart = {
      id: Math.floor(Math.random() * 101) + 1,
      code_cart: "PC-" + Math.floor(Math.random() * 1001) + 1,
      products: this.cartProducts,
      order_emp: this.loclocOrder,
      customer: "particulier",
      total_price: this.subtotalPrice,
      usrd_site: this.user.usrd_site,
    };
    console.log(cart.products);
    this.posCategoryService.addOrder({ cart }).subscribe(
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

    // this.cartProducts.map((item) => {
    //   this.posCategoryService
    //     .getLd({ ld_part: item.pt_part, ld_lot: null })
    //     .subscribe((res: any) => {
    //       const pro = res.data;
    //       console.log(pro.ld_qty_oh);
    //     });
    // });

    this.posCategoryService.createld({ cart }).subscribe(
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

    this.posCategoryService.createPosWorkOrder({ cart }).subscribe(
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

    this.posCategoryService.createPosWorkOrderDetail({ cart }).subscribe(
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

    console.log(cart);
    this.cart.products = [];
    this.cartProducts = [];
    this.showPrice = false;
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
    console.log(this.datasetRec);
    this.initGrid2();
  }

  checkInventory(content) {
    this.modalService.open(content, { size: "xl" });
  }

  setInventory() {
    this.dataset.map((item) => {
      console.log(item.tag_cnt_qty);
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
        this.loadingSubject.next(false);
      }
    );
  }
  checkInventory2(content) {
    this.modalService.open(content, { size: "xl" });
  }

  setInventory2() {
    this.dataset.map((item) => {
      return (item.ld_rev = "M");
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
        this.loadingSubject.next(false);
      }
    );
  }
  handleSelectedRowsChanged(e, args) {}

  getHistory(content) {
    this.posCategoryService.getAllOrders().subscribe((res: any) => {
      this.ordersHistory = res.data.map((item) => {
        return item;
      });
    });
    this.modalService.open(content, { size: "xl" });
  }
  getItemFromHistory(order) {
    this.posCategoryService
      .getOneOrder({ order_code: order.order_code })
      .subscribe((res: any) => {
        this.cart = res.data;
        this.showPrice = true;
        this.cartProducts = res.data.products;
      });
  }

  WodData() {
    this.posCategoryService
      .getWod({ wod_nbr: this.cart.code_cart })
      .subscribe((res: any) => {
        this.workOrders = res.data.map((item) => {
          return item;
        });
      });
    this.workOrders.forEach((wo) => {
      const d = {
        tr_part: wo.wod_part,
        tr_lot: wo.wod_lot,
        tr_price: wo.wod_price,
        tr_site: wo.wod_site,
        tr_qty_loc: Number(wo.wod_qty_req),
        tr_qty_chg: Number(wo.wod_qty_req),
        tr_nbr: wo.wod_nbr,
        tr_serial: null,
        tr_loc: wo.wod_loc,
        tr_um_conv: 1,
      };
      this.detail.push(d);
    });
    this.it = this.cart.created_date;
  }

  Sodata() {
    this.posCategoryService
      .getWod({ wod_nbr: this.cart.code_cart })
      .subscribe((res: any) => {
        this.salesOrder = res.data.map((item) => {
          return item;
        });
      });
    this.salesOrder.forEach((so) => {
      const d = {
        tr_part: so.wod_part,
        tr_lot: so.wod_lot,
        tr_price: so.wod_price,
        tr_site: so.wod_site,
        tr_qty_loc: Number(so.wod_qty_req),
        tr_qty_chg: Number(so.wod_qty_req),
        tr_nbr: so.wod_nbr,
        tr_serial: null,
        tr_loc: so.wod_loc,
        tr_um_conv: 1,
      };
      this.detailSo.push(d);
    });
    this.itSo = this.cart.created_date;
  }
  getValue1(ticket: any) {
    console.log(ticket);
    this.value1 = this.value1 + ticket;
  }
  getValue2(ticket: any) {
    console.log(ticket);
    this.value2 = this.value2 + ticket;
  }
  paiement() {
    this.WodData();
    this.posCategoryService
      .createIssWo({ detail: this.detail, it: this.it })
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
    this.Sodata();
    this.posCategoryService
      .createIssSo({ detail: this.detailSo, it: this.itSo })
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
    this.detail = [];
    this.it = null;
    this.cartProducts = [];
    this.showPrice = false;
  }
  time = new Observable<string>((observer: Observer<string>) => {
    setInterval(() => observer.next(""), 1000);
  });

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
      .getAllProductInventory({ ld_site: this.user.usrd_site })
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
      {
        id: "bk_2000",
        name: "Billet 2000",
        field: "bk_2000",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.float,
          params: { decimalPlaces: 2 },
        },
      },
      {
        id: "bk_1000",
        name: "Billet 1000",
        field: "bk_1000",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.float,
          params: { decimalPlaces: 2 },
        },
      },
      {
        id: "bk_0500",
        name: "Billet 500",
        field: "bk_0500",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.float,
          params: { decimalPlaces: 2 },
        },
      },
      {
        id: "bk_0200",
        name: "Billet 200",
        field: "bk_0200",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.float,
          params: { decimalPlaces: 2 },
        },
      },
      {
        id: "bk_p200",
        name: "Billet 200 p",
        field: "bk_p200",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.float,
          params: { decimalPlaces: 2 },
        },
      },
      {
        id: "bk_p100",
        name: "Billet 100 ",
        field: "bk_p100",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.float,
          params: { decimalPlaces: 2 },
        },
      },
      {
        id: "bk_p050",
        name: "Billet 50 p",
        field: "bk_p050",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.float,
          params: { decimalPlaces: 2 },
        },
      },
      {
        id: "bk_p020",
        name: "Billet 20 p",
        field: "bk_p020",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.float,
          params: { decimalPlaces: 2 },
        },
      },
      {
        id: "bk_p010",
        name: "Billet 10 p",
        field: "bk_p010",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.float,
          params: { decimalPlaces: 2 },
        },
      },
      {
        id: "bk_p005",
        name: "Billet 5 p",
        field: "bk_p005",
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
      .getBank({ bk_user1: this.user.usrd_code })
      .subscribe(
        (response: any) => (this.bank = response.data),
        (error) => {
          this.dataset = [];
        },
        () => {}
      );
  }

  opBk(content) {
    this.initGrid3();
    this.modalService.open(content, { size: "xl" });
    this.posCategoryService
      .getBank({ bk_user1: this.user.usrd_code })
      .subscribe((res: any) => {
        this.bank = res.data.map((item) => {
          return item;
        });
      });
  }

  onSubmitCaisseInventory() {
    this.bank.map((item) => {
      return (
        (item.bk_balance = item.bk_balance),
        (item.bk_2000 = item.bk_2000),
        (item.bk_1000 = item.bk_1000),
        (item.bk_0500 = item.bk_0500),
        (item.bk_0200 = item.bk_0200),
        (item.bk_p200 = item.bk_p200),
        (item.bk_p100 = item.bk_p100),
        (item.bk_p050 = item.bk_p050),
        (item.bk_p020 = item.bk_p020),
        (item.bk_p010 = item.bk_p010),
        (item.bk_p005 = item.bk_p005)
      );
    });
    this.posCategoryService
      .createBkBkh({ detail: this.bank, type: "INV-D" })
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
    this.bank = [];
  }

  onSubmitCaisseClotureInventory() {
    this.bank.map((item) => {
      return (
        (item.bk_balance = item.bk_balance),
        (item.bk_2000 = item.bk_2000),
        (item.bk_1000 = item.bk_1000),
        (item.bk_0500 = item.bk_0500),
        (item.bk_0200 = item.bk_0200),
        (item.bk_p200 = item.bk_p200),
        (item.bk_p100 = item.bk_p100),
        (item.bk_p050 = item.bk_p050),
        (item.bk_p020 = item.bk_p020),
        (item.bk_p010 = item.bk_p010),
        (item.bk_p005 = item.bk_p005)
      );
    });
    this.posCategoryService
      .createBkBkh({ detail: this.bank, type: "INV-F" })
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
    this.bank = [];
  }

  createCustomerForm() {
    this.bkForm = this.formBuilder.group({
      balance: "",
      balance2: "",
    });
  }
}
