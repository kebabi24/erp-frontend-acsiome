import { Component, OnInit } from "@angular/core";
import { Observable, BehaviorSubject, Subscription, of, Subject } from "rxjs";
import { Store } from "@ngrx/store";
// import { Categories } from "../../../core/erp/data/mock-categories";
import { Tables } from "../../../core/erp/data/mock-categories";
import { Category } from "../../../core/erp/_models/pos-categories.model";
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
  inventory: PosInventory;
  InventoryForm: FormGroup;
  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  categories: Category[];
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
  gridOptions: GridOption;
  dataset: any[];
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
  private results: Observable<any[]>;
  constructor(
    config: NgbDropdownConfig,
    private modalService: NgbModal,
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
      .getByItems({ pt_status: "MP" })
      .subscribe((res: any) => {
        this.ingredients = res.data.map((item) => {
          const ing = {
            id: item.id,
            spec_code: item.pt_part,
            spec_pt_desc1: item.pt_desc1,
            spec_pt_desc2: item.pt_desc2,
            isChecked: true,
            price: item.pt_price,
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
    this.AllTables = Tables;

    this.cart = {
      id: Math.floor(Math.random() * 101) + 1,
      code_cart: "CC-" + Math.floor(Math.random() * 101) + 1,
      products: [],
      order_emp: this.loclocOrder,
      customer: "particulier",
      total_price: 0,
    };

    this.initGrid();
  }

  createInventoryForm() {
    this.loadingSubject.next(false);

    this.inventory = new PosInventory();
    this.InventoryForm = this.InventoryFB.group({
      inv1: [this.inventory.inv1, Validators.required],
      inv2: [this.inventory.inv2, Validators.required],
      inv3: [this.inventory.inv3, Validators.required],
    });
  }
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.InventoryForm.controls;
    /** check form */
    if (this.InventoryForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      return;
    }

    // tslint:disable-next-line:prefer-const
    this.PosInventory = this.getInventory();
    this.checkInventory(this.PosInventory);
  }

  getInventory(): PosInventory {
    const controls = this.InventoryForm.controls;
    const _pOsinventory = new PosInventory();
    _pOsinventory.inv1 = controls.inv1.value;
    _pOsinventory.inv2 = controls.inv2.value;
    _pOsinventory.inv3 = controls.inv3.value;

    return _pOsinventory;
  }
  checkInventory(PosInventory: PosInventory) {}

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
      pt_page: this.currentItem.pt_page,
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
      pt_page: this.currentItem.pt_page,
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
        pt_page: checkItemExist.pt_page,
        pt_bom_code: checkItemExist.pt_bom_code,
        suppliments: checkItemExist.suppliments,
        ingredients: checkItemExist.ingredients,
        sauces: checkItemExist.sauces,
        comment: this.sizeProduct,
        pt_qty: 1,
        line: this.cartProducts.length.toString(),
      };

      this.cart.products.push(this.itemToAdd);
      this.showPrice = true;
    }
    console.log(typeof checkItemExist.pt_price);
    this.cartProducts = this.cart.products;
    console.log(this.cartProducts);
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

  locOrder(content) {
    if (this.loclocOrder === "Sur place") {
      this.loclocOrder = "Emporté";
      this.cartProducts != null && this.setBomCode();
    } else if (this.loclocOrder === "Emporté") {
      this.loclocOrder = "Livraison";
      this.cartProducts != null && this.setBomCode();
    } else {
      this.loclocOrder = "Sur place";
      this.cartProducts != null && this.setBomCode();
      this.modalService.open(content, { size: "lg" });
    }
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
    this.suppliments.map((item) => {
      item.isChecked = false;
    });
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
    this.modalService.open(content, { size: "xl" });
  }

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
      .getSomeOrders({ order_code: order.order_code })
      .subscribe((res: any) => {
        const productsfromhistory = res.data.map((item) => {
          this.posCategoryService
            .getOneProduct({ pt_part: item.pt_part })
            .subscribe((res: any) => {
              this.cartProducts.push(res.data);
            });
        });
      });
    console.log(this.cartProducts);
  }

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
    this.posCategoryService.getAllProductTag({ tag_nbr: 4 }).subscribe(
      (response: any) => (this.dataset = response.data),
      (error) => {
        this.dataset = [];
      },
      () => {}
    );
  }
}
