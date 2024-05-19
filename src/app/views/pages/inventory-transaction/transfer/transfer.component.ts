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
  EditorValidator,
  EditorArgs,
  GridService,
  Formatters,
  FieldType,
  OnEventArgs,
} from "angular-slickgrid";
import { FormGroup, FormBuilder, Validators, NgControlStatus } from "@angular/forms";
import { Observable, BehaviorSubject, Subscription, of } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
// Layout
import {
  SubheaderService,
  LayoutConfigService,
} from "../../../../core/_base/layout";
// CRUD
import {
  LayoutUtilsService,
  TypesUtilsService,
  MessageType,
} from "../../../../core/_base/crud";
import { MatDialog } from "@angular/material/dialog";
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
import {
  ItemService,
  AddressService,
  InventoryTransaction,
  InventoryTransactionService,
  LocationService,
  SiteService,
  RequisitionService,
  CostSimulationService,
  LocationDetailService,
  InventoryStatusService,
  CodeService,
  SequenceService,
  printBc,
  MesureService,
  printTR,
} from "../../../../core/erp";
import { exit } from "process";
import { jsPDF } from "jspdf";
import { NumberToLetters } from "../../../../core/erp/helpers/numberToString";


const statusValidator: EditorValidator = (value: any, args: EditorArgs) => {
  // you can get the Editor Args which can be helpful, e.g. we can get the Translate Service from it
  const grid = args && args.grid;
  const gridOptions = (grid && grid.getOptions) ? grid.getOptions() : {};
  const translate = gridOptions.i18n;

  // to get the editor object, you'll need to use "internalColumnEditor"
  // don't use "editor" property since that one is what SlickGrid uses internally by it's editor factory
  const columnEditor = args && args.column && args.column.internalColumnEditor;

  if (value == null || value == undefined || !value.length) {
    return { valid: false, msg: 'This is a required field' };
  } 
  return { valid: true, msg: '' };
};


@Component({
  selector: 'kt-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnInit {
    inventoryTransaction: InventoryTransaction;
    trForm: FormGroup;
    hasFormErrors = false;
    loadingSubject = new BehaviorSubject<boolean>(true);
    loading$: Observable<boolean>;
    error = false;
    angularGrid: AngularGridInstance;
    grid: any;
    gridService: GridService;
    dataView: any;
    columnDefinitions: Column[];
    gridOptions: GridOption;
    dataset: any[];
    user
    
    alertWarning: any;
   
    adresses: [];
    columnDefinitions2: Column[] = [];
    gridOptions2: GridOption = {};
    gridObj2: any;
    angularGrid2: AngularGridInstance;

    items: [];
    columnDefinitions4: Column[] = [];
    gridOptions4: GridOption = {};
    gridObj4: any;
    angularGrid4: AngularGridInstance;
  
    datasite: [];
    columnDefinitionssite: Column[] = [];
    gridOptionssite: GridOption = {};
    gridObjsite: any;
    angularGridsite: AngularGridInstance;
  
    dataloc: [];
    columnDefinitionsloc: Column[] = [];
    gridOptionsloc: GridOption = {};
    gridObjloc: any;
    angularGridloc: AngularGridInstance;
  
    datalocdet: [];
    columnDefinitionslocdet: Column[] = [];
    gridOptionslocdet: GridOption = {};
    gridObjlocdet: any;
    angularGridlocdet: AngularGridInstance;
    ums: [];
    columnDefinitionsum: Column[] = [];
    gridOptionsum: GridOption = {};
    gridObjum: any;
    angularGridum: AngularGridInstance;
  
    statuss: [];
    columnDefinitionsstatus: Column[] = [];
    gridOptionsstatus: GridOption = {};
    gridObjstatus: any;
    angularGridstatus: AngularGridInstance;
  
    selectedField = "";
    fieldcode = "";
    sit : string ;
    stat : String;
    expire;
    row_number;
    message = "";
    site: any;
    location: any;
    sct: any;
    seq : any;
    trServer;
    trlot: string;
    datasetPrint = [];
    lddet: any;
    rqm: boolean;
    statusref: any;
    requisitions: [];
    columnDefinitions5: Column[] = [];
    gridOptions5: GridOption = {};
    gridObj5: any;
    angularGrid5: AngularGridInstance;
    requistionServer;
    domain: any;
    constructor(
      config: NgbDropdownConfig,
      private trFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public  dialog: MatDialog,
      private modalService: NgbModal,
      private layoutUtilsService: LayoutUtilsService,
      private inventoryTransactionService: InventoryTransactionService,
      private sctService: CostSimulationService,  
      private itemsService: ItemService,
      private locationService: LocationService,
      private siteService: SiteService,
      private inventoryStatusService: InventoryStatusService,
      private mesureService: MesureService,
      private codeService: CodeService,
      private requisitionService: RequisitionService,
      private sequenceService: SequenceService,
      private locationDetailService: LocationDetailService
    ) {
      config.autoClose = true;
      this.initGrid();
    }
    GridReady(angularGrid: AngularGridInstance) {
        this.angularGrid = angularGrid
        this.dataView = angularGrid.dataView
        this.grid = angularGrid.slickGrid
        this.gridService = angularGrid.gridService
    }
    ngOnInit(): void {
      
      this.loading$ = this.loadingSubject.asObservable()
      this.loadingSubject.next(true)
        this.user =  JSON.parse(localStorage.getItem('user'))       
        this.domain = JSON.parse(localStorage.getItem("domain"));
        console.log("hna user",this.user)
        
           this.createForm()
           this.loadingSubject.next(false)
        
    }
    

    createForm() {
      this.loadingSubject.next(false);
      this.inventoryTransaction = new InventoryTransaction();
    
     // console.log(this.site)  
      const date = new Date()

      this.trForm = this.trFB.group({
        tr_so_job: [this.inventoryTransaction.tr_so_job],
        tr_effdate: [{
          year:date.getFullYear(),
          month: date.getMonth()+1,
          day: date.getDate()
        }],
        tr_rmks: [this.inventoryTransaction.tr_rmks],    
        //tr_site:  [this.inventoryTransaction.tr_site],
        tr_site:  [this.user.usrd_site],
        tr_loc: [this.inventoryTransaction.tr_loc],
        tr_ref_site: [this.user.usrd_site],
        tr_ref_loc: [this.inventoryTransaction.tr_ref_loc],
        ref: [null],
        print:[true],
       
      
    })  
      // const controls = this.trForm.controls;
      // this.siteService.getByOne({ si_default: true  }).subscribe(
      //   (res: any) => {
      //   this.site = res.data.si_site
        
      //   controls.tr_site.setValue(this.site );
      //   controls.tr_ref_site.setValue(this.site );
    
      // })
    
      
        
      }
      
      //reste form
      reset() {
        this.inventoryTransaction = new InventoryTransaction();
        this.createForm();
        this.hasFormErrors = false;
      }
      // save data
      onSubmit() {
        this.hasFormErrors = false;
        const controls = this.trForm.controls;
        /** check form */
        if (this.trForm.invalid) {
          Object.keys(controls).forEach((controlName) =>
            controls[controlName].markAsTouched()
          );
          this.message = "Modifiez quelques éléments et réessayez de soumettre.";
          this.hasFormErrors = true;
    
          return;
        }
    
        if (!this.dataset.length) {
          this.message = "La liste des article ne peut pas etre vide";
          this.hasFormErrors = true;
    
          return;
        }


        for (var i = 0; i < this.dataset.length; i++) {
          console.log(this.dataset[i]  )
         if (this.dataset[i].tr_part == "" || this.dataset[i].tr_part == null  ) {
          this.message = "L' article ne peut pas etre vide";
          this.hasFormErrors = true;
          return;
     
         }
         
         if (this.dataset[i].tr_um == "" || this.dataset[i].tr_um == null  ) {
          this.message = "L' UM ne peut pas etre vide";
          this.hasFormErrors = true;
          return;
     
         }
         if (this.dataset[i].tr_status == "" || this.dataset[i].tr_status == null  ) {
          this.message = "Le Status ne peut pas etre vide";
          this.hasFormErrors = true;
          return;
     
         }
         if (this.dataset[i].tr_qty_loc == 0 ) {
          this.message = "La Quantite ne peut pas etre 0";
          this.hasFormErrors = true;
          return;
     
         }
  
        }



        this.sequenceService.getByOne({ seq_type: "TR", seq_profile: this.user.usrd_profile }).subscribe(
          (response: any) => {
        this.seq = response.data 
            
            if (this.seq) {
             this.trlot = `${this.seq.seq_prefix}-${Number(this.seq.seq_curr_val)+1}`
  
             this.sequenceService.update(this.seq.id,{ seq_curr_val: Number(this.seq.seq_curr_val )+1 }).subscribe(
              (reponse) => console.log("response", Response),
              (error) => {
                this.message = "Erreur modification Sequence";
                this.hasFormErrors = true;
                return;
           
              
              },
              )
              let tr = this.prepare()
              this.addIt( this.dataset,tr, this.trlot);
            }else {
              this.message = "Parametrage Manquant pour la sequence";
              this.hasFormErrors = true;
              return;
         
             }
  
  
          })
  
          
  

        // tslint:disable-next-line:prefer-const
       
      }
    
      prepare(){
        const controls = this.trForm.controls;
        const _tr = new InventoryTransaction();
        _tr.tr_so_job = controls.tr_so_job.value
        _tr.tr_effdate = controls.tr_effdate.value
        ? `${controls.tr_effdate.value.year}/${controls.tr_effdate.value.month}/${controls.tr_effdate.value.day}`
        : null
        
       // _tr.tr_ex_rate = controls.tr_ex_rate.value
        
        _tr.tr_rmks = controls.tr_rmks.value
        _tr.tr_site = controls.tr_site.value
        _tr.tr_loc = controls.tr_loc.value
        _tr.tr_ref_site = controls.tr_ref_site.value
        _tr.tr_ref_loc = controls.tr_ref_loc.value
        return _tr
      }
      /**
       *
       * Returns object for saving
       */
      /**
       * Add po
       *
       * @param _it: it
       */
      addIt( detail: any, it, nlot) {
        for (let data of detail) {
          delete data.id;
          delete data.cmvid;
        }
        this.loadingSubject.next(true);
        const controls = this.trForm.controls;

    
        this.inventoryTransactionService
          .addTr({detail, it,nlot})
          .subscribe(
           (reponse: any) => {
            // console.log(reponse)
            // const arrayOctet = new Uint8Array(reponse.pdf.data)
            // const file = new Blob([arrayOctet as BlobPart], {type : 'application/pdf'})
            // const fileUrl = URL.createObjectURL(file);
            // window.open(fileUrl)
          },
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
          //    console.log(this.provider, po, this.dataset);
          //    if(controls.print.value == true) printBc(this.provider, this.datasetPrint, po);
          //console.log(it, this.dataset, nlot)
          // if(controls.print.value == true) printTR(it, this.dataset, nlot)
          if (controls.print.value == true) this.printpdf(nlot);
            this.router.navigateByUrl("/");
            }
          );
      }
      
      /**
       * Go back to the list
       *
       */
      goBack() {
        this.loadingSubject.next(false);
        const url = `/`;
        this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
      }
    



      
      // add new Item to Datatable
      addNewItem() {
        this.gridService.addItem(
          {
            id: this.dataset.length + 1,
            tr_line: this.dataset.length + 1,
            tr_part: "",
            cmvid: "",
            desc: "",
            tr_qty_loc: 0,
            tr_um: "",
            tr_price: 0,
            cmvids: "",
            tr_serial: null,
            tr_status: null,
            tr_expire: null,
          },
          { position: "bottom" }
        );
      }

      onChangePal() {
            /*kamel palette*/
            const controls = this.trForm.controls
            const ref = controls.ref.value
          var bol = false
            for(let ob of this.dataset) {

              if(ob.tr_ref == ref) {
                console.log("hnehnahna")
                bol = true
                break;
               
              }
            }
            if (!bol) {
            this.locationDetailService.getByOneRef({ ld_ref: ref  }).subscribe(
              (response: any) => {
                this.lddet = response.data
                //console.log(this.lddet.ld_qty_oh)
            if (this.lddet != null) {
             
              if(this.lddet.ld_site != controls.tr_site.value) {
                alert("Palette N'existe pas dans Ce Site")
   
               } else {
  
                if (this.lddet.ld_loc != controls.tr_loc.value) {
                  alert("Palette N'existe pas dans Cet Emplacement")
                }
                else {
             
             
              this.inventoryStatusService.getAllDetails({isd_status: this.lddet.ld_status, isd_tr_type: "ISS-TR" }).subscribe((resstat:any)=>{
                  console.log(resstat)
                  const { data } = resstat;

                  if (data) {
                    this.stat = null
                    alert("Status Interdit pour ce mouvement ")


                  } else {
                    this.stat = this.lddet.ld_status
                  
                    this.inventoryStatusService.getAllDetails({isd_status: this.statusref, isd_tr_type: "RCT-TR" }).subscribe((resstatref:any)=>{
                      console.log(resstatref)
                      const { data1 } = resstatref;
    
              // this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , desc: resp.data.pt_desc1 , qty_oh: this.lddet.ld_qty_oh,
              //   tr_um:resp.data.pt_um, tr_um_conv: 1,  tr_status: this.stat, tr_price: this.sct.sct_cst_tot, tr_expire: this.lddet.ld_expire})
                   console.log(this.statusref)
                   if (data1) {
                    this.stat = null
                    alert("Status Interdit pour ce mouvement ")


                  } else {
              this.inventoryStatusService.getByIsm({ism_loc_start: controls.tr_loc.value,ism_loc_end:controls.tr_ref_loc.value, ism_status_start: this.lddet.ld_status, 
                ism_status_end:this.statusref }).subscribe((resstat:any)=>{
                console.log(resstat)
                const { data } = resstat;
                if (data.length > 0) {
                  alert("Mouvement Interdit pour Status dans cet emplacement")
                  this.stat = null
                } 
                else{
                this.stat =  this.statusref
                     
             
             this.itemsService.getByOne({pt_part: this.lddet.ld_part  }).subscribe(
              (respopart: any) => {
                console.log(respopart)

             this.sctService.getByOne({ sct_site: controls.tr_site.value, sct_part: this.lddet.ld_part, sct_sim: 'STD-CG' }).subscribe(
              (respo: any) => {
                this.sct = respo.data
                console.log(this.sct)
            

             this.gridService.addItem(
              {
                id: this.dataset.length + 1,
                tr_line: this.dataset.length + 1,
                tr_part: this.lddet.ld_part,
                cmvid: "",
                desc: respopart.data.pt_desc1,
                tr_qty_loc: this.lddet.ld_qty_oh,
                qty_oh: this.lddet.ld_qty_oh,
                tr_um: respopart.data.pt_um,
                tr_um_conv:1,
                tr_price: this.sct.sct_mtl_tl,
                cmvids: "",
                tr_ref: ref,
                tr_serial: this.lddet.ld_lot,
                tr_status: this.stat,
                tr_expire: this.lddet.ld_expire,
              },
              { position: "bottom" }
            );
         
             });
            }); 
          }
        })
          }
        })     
          }
          }); 
                }
            }
         


          }



            else {
            alert("Palette Nexiste pas")
          //  this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_part: null })
            }

            });

          }
          else {
            alert ("Palette déja scannée")
          }
      controls.ref.setValue(null)
      document.getElementById("ref").focus();
      }
      onChangeLoc() {
        const controls = this.trForm.controls;
        const loc_loc = controls.tr_loc.value;
        const loc_site = controls.tr_site.value;
       
        
            this.locationService.getByOne({ loc_site, loc_loc }).subscribe(
              (res: any) => {
                console.log(res)
               this.location = res.data
                if (this.location != null) {
                
                  if (this.rqm == true){

                    for (var i = 0; i < this.dataset.length; i++) {
                      console.log(this.dataset[i].tr_part  )
                      let updateItem = this.gridService.getDataItemByRowIndex(i);
                      this.sctService.getByOne({ sct_site: loc_site, sct_part: this.dataset[i].tr_part, sct_sim: 'STD-CG' }).subscribe(
                        (response: any) => {
                          this.sct = response.data
                         console.log(this.sct.sct_cst_tot)
                         let scttot = this.sct.sct_cst_tot
                         console.log(scttot)
                         updateItem.tr_price = scttot
                          this.locationDetailService.getBy({ ld_site: loc_site, ld_loc: loc_loc, ld_part: this.sct.sct_part, ld_lot: null }).subscribe(
                            (respo: any) => {
                              this.lddet = respo.data
                              console.log(this.lddet[0].ld_qty_oh)
        
                              

                              this.inventoryStatusService.getAllDetails({isd_status: this.location.loc_status, isd_tr_type: "ISS-TR" }).subscribe((resstat:any)=>{
                                console.log(resstat)
                                const { data } = resstat;
        
                                if (data) {
                                  this.stat = null
                                  this.expire = null
                                } else {
                                  this.stat = this.lddet[0].ld_status
                                  this.expire = this.lddet[0].ld_expire
                                }
                                
                                updateItem.qty_oh = this.lddet[0].ld_qty_oh
                                updateItem.tr_status = this.stat
                                updateItem.tr_expire = this.expire
                                this.gridService.updateItem(updateItem);
                                 });     
                            });     
           
                               
                      });




                     }

                  }
              
                
                }else {
                  alert("Emplacement n'existe pas ")
                  controls.tr_loc.setValue("")
                  //console.log(response.data.length)
                  document.getElementById("tr_loc").focus();
                }
          })    
        
              
      }
    
      onChangeCC() {
        const controls = this.trForm.controls;
        const rqm_nbr = controls.tr_so_job.value;
       
        this.dataset = [];
            this.requisitionService.getBy({ rqm_nbr,rqm_aprv_stat: "3", rqm_open: true  }).subscribe(
              (res: any) => {
                console.log(res)
                const { requisition, details } = res.data;
               if (requisition != null) {
                const det1 = details;
                this.rqm = true;
                
              
                for (var object = 0; object < det1.length; object++) {
                    const detail = details[object];
                    console.log(detail)
                      this.gridService.addItem(
                        {
                          id: detail.rqd_line, //this.dataset.length + 1,
                          tr_line: detail.rqd_line,   //this.dataset.length + 1,
                          tr_nbr: detail.rqd_nbr,
                         
                          tr_part: detail.rqd_part,
                          desc: detail.item.pt_desc1,
                          tr_qty_loc: detail.rqd_qty_ord ,
                          tr_um: detail.rqd_um,
                          tr_um_conv: 1,
                          tr_price: detail.item.pt_pur_price,



          //                tr_site: detail.rqd_site,
            //              tr_loc: detail.rqd_loc,
                        //  tr_serial: detail.rqd_serial,
                        //  tr_status: detail.rqd_status,
                        //  tr_expire: detail.rqd_expire,
                        },
                        { position: "bottom" }
                      );
              
            }
    
          }else {
            alert("Demande n'existe pas ")
            controls.tr_so_job.setValue("")
            //console.log(response.data.length)
            document.getElementById("tr_so_job").focus();
          }
          })    
        
              
      }



    initGrid() {
        this.columnDefinitions = [
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
            id: "tr_line",
            name: "Ligne",
            field: "tr_line",
            minWidth: 50,
            maxWidth: 50,
            selectable: true,
          },
//           {
//             id: "tr_part",
//             name: "Article",
//             field: "tr_part",
//             sortable: true,
//             minWidth: 80,
//             filterable: false,
//             editor: {
//               model: Editors.text,
//             },

//             onCellChange: (e: Event, args: OnEventArgs) => {
//               const controls = this.trForm.controls;
//               console.log(args.dataContext.tr_part)
//               this.itemsService.getByOne({pt_part: args.dataContext.tr_part }).subscribe((resp:any)=>{
  
//                 console.log(resp.data)
//                 if (resp.data) {
  
//                // this.locationService.getByOne({ loc_loc: controls.tr_ref_loc.value, loc_site: controls.tr_ref_site.value }).subscribe(
//                   //(response: any) => {
//                     //this.location = response.data
                
//                     this.sctService.getByOne({ sct_site: resp.data.pt_site, sct_part: resp.data.pt_part, sct_sim: 'STD-CG' }).subscribe(
//                       (response: any) => {
//                         this.sct = response.data
               
//                         this.locationDetailService.getByOne({ ld_site: controls.tr_site.value, ld_loc: controls.tr_loc.value, ld_part: args.dataContext.tr_part, ld_lot: null }).subscribe(
//                           (response: any) => {
//                             this.lddet = response.data
//                             //console.log(this.lddet.ld_qty_oh)
//       if (this.lddet != null)
// {                            this.inventoryStatusService.getAllDetails({isd_status: this.lddet.ld_status, isd_tr_type: "ISS-TR" }).subscribe((resstat:any)=>{
//                               console.log(resstat)
//                               const { data } = resstat;
      
//                               if (data) {
//                                 this.stat = null
//                               } else {
//                                 this.stat = this.lddet.ld_status
//                               }
//                         this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , desc: resp.data.pt_desc1 , qty_oh: this.lddet.ld_qty_oh,
//                           tr_um:resp.data.pt_um, tr_um_conv: 1,  tr_status: this.stat, tr_price: this.sct.sct_cst_tot, tr_expire: this.lddet.ld_expire})
//                             });     
//                           }
//                           else {
//                             this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , desc: resp.data.pt_desc1 , qty_oh: 0,
//                               tr_um:resp.data.pt_um, tr_um_conv: 1,  tr_status: null, tr_price: this.sct.sct_cst_tot, tr_expire: null})


//                           }
//                           });     
         
                             
//                     });  
//                // });
//               }
  
  
  
        
  
  
//               else {
//                 alert("Article Nexiste pas")
//                 this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_part: null })
//               }
              
//               });
  
               
             
             
//             }




//           },

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
            id: "desc",
            name: "Description",
            field: "desc",
            sortable: true,
            width: 180,
            filterable: false,
          },
          
          
          {
            id: "tr_serial",
            name: "Lot/Serie",
            field: "tr_serial",
            sortable: true,
            width: 80,
            filterable: false,
            editor: {
              model: Editors.text,
            },
            onCellChange: (e: Event, args: OnEventArgs) => {
              const controls = this.trForm.controls;
              this.locationDetailService.getBy({ ld_site: controls.tr_site.value, ld_loc: controls.tr_loc.value, ld_part: args.dataContext.tr_part, ld_lot: args.dataContext.tr_serial }).subscribe(
                (response: any) => {
                  this.lddet = response.data
                  
                  console.log(response.data.length)
                    if (response.data.length != 0) {
                     
                      this.inventoryStatusService.getAllDetails({isd_status: this.lddet[0].ld_status, isd_tr_type: "ISS-TR" }).subscribe((resstat:any)=>{
                        console.log(resstat)
                        const { data } = resstat;
          
                        if (data) {
                          alert("Status Interdit pour ce lot")
                          this.gridService.updateItemById(args.dataContext.id,{...args.dataContext  , tr_serial: null, qty_0h: 0, tr_expire: null});
                        } 
                          else {
                            this.gridService.updateItemById(args.dataContext.id,{...args.dataContext ,   qty_oh: this.lddet[0].ld_qty_oh, tr_expire: this.lddet[0].ld_expire})
                   
                      
                          }
                      
                      })

                     
                    }
                    else {
                          this.gridService.updateItemById(args.dataContext.id,{...args.dataContext  , tr_serial: null, qty_0h: 0});
        
                          alert("Lot N' existe pas")
                    }
              });     
          }

          },
          
          {
              id: "mvidlot",
              field: "cmvidlot",
              excludeFromHeaderMenu: true,
              formatter: Formatters.infoIcon,
              minWidth: 30,
              maxWidth: 30,
              onCellClick: (e: Event, args: OnEventArgs) => {
                  this.row_number = args.row;
                  let element: HTMLElement = document.getElementById(
                  "openLocdetsGrid"
                  ) as HTMLElement;
                  element.click();
              },
          },
          {
              id: "qty_oh",
              name: "QTE Stock",
              field: "qty_oh",
              sortable: true,
              width: 80,
              filterable: false,
              type: FieldType.float,
              
          },
          {
              id: "tr_qty_loc",
              name: "QTE",
              field: "tr_qty_loc",
              sortable: true,
              width: 80,
              filterable: false,
              type: FieldType.float,
              editor: {
                  model: Editors.float,
                  params: { decimalPlaces: 2 },
                  required: true,
                  
                  
              },
          
              onCellChange: (e: Event, args: OnEventArgs) => {
                console.log(args.dataContext.tr_qty_loc)
                console.log(args.dataContext.tr_um_conv)
                const controls = this.trForm.controls
                if (args.dataContext.tr_qty_loc * args.dataContext.tr_um_conv   > args.dataContext.qty_oh) {
                    console.log('here')
                 alert ("Qte Manquante")
                 this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_qty_loc: null })
              //  this.alertWarning = `Updated Title: ${args.dataView.tr_qty_loc}`;
             
               
            
               // meta.cssClasses = (meta.cssClasses || '') + ' ' + newCssClass;
              } else {
                if (this.rqm) {
                this.sctService.getByOne({ sct_site: controls.tr_site.value, sct_part: args.dataContext.tr_part, sct_sim: 'STD-CG' }).subscribe(
                  (response: any) => {
                    this.sct = response.data
                    this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_price: this.sct.sct_cst_tot  })
              
                  })
                }
              }

            }

              
          },
          // {
          //   id: "tr_um",
          //   name: "UM",
          //   field: "tr_um",
          //   sortable: true,
          //   width: 80,
          //   filterable: false,
          //   editor: {
          //       model: Editors.text,
          //       required: true,
          //       validator: statusValidator,

          //   },
          //   onCellChange: (e: Event, args: OnEventArgs) => {
          //     console.log(args.dataContext.tr_um)
          //     this.itemsService.getBy({pt_part: args.dataContext.tr_part }).subscribe((resp:any)=>{
                
          //     if   (args.dataContext.tr_um == resp.data.pt_um )  {
                
          //       this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_um_conv: 1 })
          //     } else { 
          //       //console.log(resp.data.pt_um)



          //         this.mesureService.getBy({um_um: args.dataContext.tr_um, um_alt_um: resp.data.pt_um, um_part: args.dataContext.tr_part  }).subscribe((res:any)=>{
          //         console.log(res)
          //         const { data } = res;
        
          //       if (data) {
          //         //alert ("Mouvement Interdit Pour ce Status")
          //         this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_um_conv: res.data.um_conv })
          //         this.angularGrid.gridService.highlightRow(1, 1500);

          //         if (args.dataContext.tr_qty_loc * Number(res.data.um_conv) >  args.dataContext.qty_oh) {
          //           console.log('here')
          //           alert ("Qte Manquante")
          //           this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_um_conv: "1" , tr_um: null});
                   
               
          //         } else {
                
          //           this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_um: null })
  
          //         }
  



          //       } else {
          //         this.mesureService.getBy({um_um: resp.data.pt_um, um_alt_um: args.dataContext.tr_um, um_part: args.dataContext.tr_part  }).subscribe((res:any)=>{
          //           console.log(res)
          //           const { data } = res;
          //           if (data) {
          //             if (args.dataContext.tr_qty_loc * Number(res.data.um_conv) >  args.dataContext.qty_oh) {
          //               console.log('here')
          //               alert ("Qte Manquante")
          //               this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_um_conv: "1" , tr_um: null});
                       
                   
          //             } else {
                    
          //               this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_um: null })
      
          //             }
           
          //           } else {
          //             this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_um_conv: "1" , tr_um: null});
               
          //             alert("UM conversion manquante")
                      
          //           }  
          //         })

          //       }
          //         })
  
          //       }
          //       })
      
          //     }
             
          // },
        
       
        // {
        //   id: "mvidlot",
        //   field: "cmvidlot",
        //   excludeFromHeaderMenu: true,
        //   formatter: Formatters.infoIcon,
        //   minWidth: 30,
        //   maxWidth: 30,
        //   onCellClick: (e: Event, args: OnEventArgs) => {
        //       this.row_number = args.row;
        //       let element: HTMLElement = document.getElementById(
        //       "openUmsGrid"
        //       ) as HTMLElement;
        //       element.click();
        //   },
        // },
        // {
        //   id: "tr_um_conv",
        //   name: "Conv UM",
        //   field: "tr_um_conv",
        //   sortable: true,
        //   width: 80,
        //   filterable: false,
        //  // editor: {
        //  //     model: Editors.float,
        //   //},
          
        // },
        
          // {
          //     id: "tr_price",
          //     name: "Prix unitaire",
          //     field: "tr_price",
          //     sortable: true,
          //     width: 80,
          //     filterable: false,
          //     //type: FieldType.float,
          //     formatter: Formatters.decimal,
              
          // },
                  
          {
            id: "tr_ref",
            name: "Palette",
            field: "tr_ref",
            sortable: true,
            width: 80,
            filterable: false,
            //type: FieldType.float,
            editor: {
              model: Editors.text,
            },
            onCellChange: (e: Event, args: OnEventArgs) => {
            
            }
            
        },
             
        //   {
        //     id: "tr_status",
        //     name: "Status",
        //     field: "tr_status",
        //     sortable: true,
        //     width: 80,
        //     filterable: false,
        // //     editor: {
        // //       model: Editors.text,
        // //     },
        // //     onCellChange: (e: Event, args: OnEventArgs) => {
        // //       const controls = this.trForm.controls;
        // //       console.log(args.dataContext.tr_status)
             
        // //       this.inventoryStatusService.getBy({is_status: args.dataContext.tr_status }).subscribe((ress:any)=>{
        // //         console.log(ress.data.inventoryStatus) 
        // // if (ress.data.inventoryStatus) {
  
  
        // //       this.inventoryStatusService.getAllDetails({isd_status: args.dataContext.tr_status, isd_tr_type: "RCT-TR" }).subscribe((res:any)=>{
        // //       console.log(res)
        // //       const { data } = res;
    
        // //     if (data) {
        // //       alert ("Mouvement Interdit Pour ce Status")
        // //       this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_status: null })
              
        // //      } else {
  
        // //  console.log(args.dataContext.tr_part)
        // //       let obj = {}
        // //       obj = {
        // //          ld_site: controls.tr_ref_site.value, 
        // //          ld_loc: controls.tr_ref_loc.value, 
        // //          ld_part: args.dataContext.tr_part, 
        // //          ld_lot: args.dataContext.tr_serial
        // //         }
        // //         console.log(obj)
        // //         status = args.dataContext.tr_status
        // //       console.log(args.dataContext.tr_part) 
        // //       console.log(status)
        // //       this.locationDetailService.getByStatus({obj, status} ).subscribe(
        // //         (response: any) => {
        // //          console.log(response.data.length != 0   )
        // //           if (response.data.length != 0) {
        // //             this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_status: null })
        // //               alert("lot existe avec un autre status")
   
        // //           }  
  
  
  
            
        // //   })
        // //     }
          
        // //       })
        // //     } else {
      
        // //       this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_status: null })
        // //       alert("Status N' existe pas")
      
      
        // //     }
        // //   })
        // //   }
  





        //   },
          // {
          //   id: "mvidlot",
          //   field: "cmvidlot",
          //   excludeFromHeaderMenu: true,
          //   formatter: Formatters.infoIcon,
          //   minWidth: 30,
          //   maxWidth: 30,
          //   onCellClick: (e: Event, args: OnEventArgs) => {
          //       this.row_number = args.row;
          //       let element: HTMLElement = document.getElementById(
          //       "openStatussGrid"
          //       ) as HTMLElement;
          //       element.click();
          //   },
          // },
          // {
          //   id: "tr_expire",
          //   name: "Expire",
          //   field: "tr_expire",
          //   sortable: true,
          //   width: 80,
          //   filterable: false,
          //   type: FieldType.dateIso,
           
            
          // },
        ];
    
        this.gridOptions = {
          asyncEditorLoading: false,
          editable: true,
          enableColumnPicker: true,
          enableCellNavigation: true,
          enableRowSelection: true,
          autoHeight:false,
          autoCommitEdit:true,
          enableAutoResize:true,
          formatterOptions: {
            
            
            // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
            displayNegativeNumberWithParentheses: true,
      
            // Defaults to undefined, minimum number of decimals
            minDecimal: 2,
      
            // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
            thousandSeparator: ' ', // can be any of ',' | '_' | ' ' | ''
        }
      }
        this.dataset = [];
     
    }


    handleSelectedRowsChangedsite(e, args) {
        const controls = this.trForm.controls;
       
        if (Array.isArray(args.rows) && this.gridObjsite) {
          args.rows.map((idx) => {
            const item = this.gridObjsite.getDataItem(idx);
            // TODO : HERE itterate on selected field and change the value of the selected field
            switch (this.selectedField) {
              case "tr_site": {
                controls.tr_site.setValue(item.si_site || "");
                break;
              }
              case "tr_ref_site": {
                controls.tr_ref_site.setValue(item.si_site || "");
                break;
              }
              default:
                break;
            }
          });
        }
    }


    angularGridReadysite(angularGrid: AngularGridInstance) {
        this.angularGridsite = angularGrid;
        this.gridObjsite = (angularGrid && angularGrid.slickGrid) || {};
      }
    
      prepareGridsite() {
        this.columnDefinitionssite = [
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
            id: "id",
            name: "id",
            field: "id",
            sortable: true,
            minWidth: 80,
            maxWidth: 80,
          },
          {
            id: "si_site",
            name: "Site",
            field: "si_site",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "si_desc",
            name: "Designation",
            field: "si_desc",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
        ];
    
        this.gridOptionssite = {
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
          checkboxSelector: {},
          multiSelect: false,
          rowSelectionOptions: {
            selectActiveRow: true,
          },
        };
    
        // fill the dataset with your data
        this.siteService
          .getAll()
          .subscribe((response: any) => (this.datasite = response.data));
      }
      opensite(contentsite, field) {
        this.selectedField = field;
        this.prepareGridsite();
        this.modalService.open(contentsite, { size: "lg" });
      }
      

    handleSelectedRowsChangedloc(e, args) {
        const controls = this.trForm.controls;
    
        if (Array.isArray(args.rows) && this.gridObjloc) {
          args.rows.map((idx) => {
            const item = this.gridObjloc.getDataItem(idx);
            // TODO : HERE itterate on selected field and change the value of the selected field
            switch (this.selectedField) {
              case "tr_loc": {
                controls.tr_loc.setValue(item.loc_loc || "");
                break;
              }
              case "tr_ref_loc": {
                controls.tr_ref_loc.setValue(item.loc_loc || "");
                this.statusref = item.loc_status
                break;
              }
              default:
                break;
            }
          });
        }
    }
    angularGridReadyloc(angularGrid: AngularGridInstance) {
        this.angularGridloc = angularGrid;
        this.gridObjloc = (angularGrid && angularGrid.slickGrid) || {};
      }
    
      prepareGridloc() {
        const controls = this.trForm.controls;
         
        switch (this.selectedField) {
            case "tr_loc": {
            this.sit =  controls.tr_site.value;
              break;
            }
            case "tr_ref_loc": {
             this.sit = controls.tr_ref_site.value;
              break;
            }
            default:
              break;
          }
        this.columnDefinitionsloc = [
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
            id: "id",
            name: "id",
            field: "id",
            sortable: true,
            minWidth: 80,
            maxWidth: 80,
          },
    
          {
            id: "loc_loc",
            name: "loc",
            field: "loc_loc",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "loc_desc",
            name: "Designation",
            field: "loc_desc",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
        ];
    
        this.gridOptionsloc = {
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
          checkboxSelector: {},
          multiSelect: false,
          rowSelectionOptions: {
            selectActiveRow: true,
          },
        };
    
        // fill the dataset with your data
        this.locationService
          .getBy({ loc_site: this.sit })
          .subscribe((response: any) => (this.dataloc = response.data));
      }
      openloc(contentloc, field) {
        this.selectedField = field;
        this.prepareGridloc();
        this.modalService.open(contentloc, { size: "lg" });
      }
      changeSite() {
        const controls = this.trForm.controls; // chof le champs hada wesh men form rah
        const si_site = controls.tr_site.value;
        this.siteService.getByOne({ si_site }).subscribe(
          (res: any) => {
              console.log(res)
            const { data } = res;
    
            if (!data) {
              this.layoutUtilsService.showActionNotification(
                "ce Site n'existe pas!",
                MessageType.Create,
                10000,
                true,
                true
              );
              this.error = true;
            } else {
              this.error = false;
            }
          },
          (error) => console.log(error)
        );
      }
      changeSiteRef() {
        const controls = this.trForm.controls; // chof le champs hada wesh men form rah
        const si_site = controls.tr_ref_site.value;
        this.siteService.getByOne({ si_site }).subscribe(
          (res: any) => {
            const { data } = res;
    
            if (!data) {
              this.layoutUtilsService.showActionNotification(
                "ce Site n'existe pas!",
                MessageType.Create,
                10000,
                true,
                true
              );
              this.error = true;
            } else {
              this.error = false;
            }
          },
          (error) => console.log(error)
        );
      }
    
      changeLoc() {
        const controls = this.trForm.controls; // chof le champs hada wesh men form rah
        const loc_loc = controls.tr_loc.value;
        const loc_site = controls.tr_site.value;
    
        this.locationService.getByOne({ loc_loc, loc_site }).subscribe(
          (res: any) => {
            const { data } = res;
    
            if (!data) {
              this.layoutUtilsService.showActionNotification(
                "cet Emplacement n'existe pas!",
                MessageType.Create,
                10000,
                true,
                true
              );
              this.error = true;
            } else {
              this.error = false;
            }
          },
          (error) => console.log(error)
        );
      }
      changeLocRef() {
        const controls = this.trForm.controls; // chof le champs hada wesh men form rah
        const loc_loc = controls.tr_ref_loc.value;
        const loc_site = controls.tr_ref_site.value;
    
        this.locationService.getByOne({ loc_loc, loc_site }).subscribe(
          (res: any) => {
            const { data } = res;
    
            if (!data) {
              this.layoutUtilsService.showActionNotification(
                "cet Emplacement n'existe pas!",
                MessageType.Create,
                10000,
                true,
                true
              );
              this.error = true;
            } else {
              this.error = false;
              this.statusref = data.loc_status
               
            }
          },
          (error) => console.log(error)
        );
      }
   
      
      handleSelectedRowsChanged4(e, args) {
       const controls = this.trForm.controls;
        let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
        if (Array.isArray(args.rows) && this.gridObj4) {
          args.rows.map((idx) => {
            const item = this.gridObj4.getDataItem(idx);
            console.log(item);
    
            //this.locationService.getByOne({ loc_loc: controls.tr_ref_loc.value, loc_site: controls.tr_ref_site.value }).subscribe(
             // (response: any) => {
              //  this.location = response.data
            
              this.sctService.getByOne({ sct_site: controls.tr_site.value, sct_part: item.pt_part, sct_sim: 'STD-CG' }).subscribe(
                (response: any) => {
                  this.sct = response.data
              

                  this.locationDetailService.getByOne({ ld_site: controls.tr_site.value, ld_loc: controls.tr_loc.value, ld_part: item.pt_part, ld_lot: null , ld_ref: null}).subscribe(
                    (response: any) => {
                      this.lddet = response.data
                      //console.log(this.lddet.ld_qty_oh)

if (this.lddet != null)
{                  this.inventoryStatusService.getAllDetails({isd_status: this.lddet.ld_status, isd_tr_type: "ISS-TR" }).subscribe((resstat:any)=>{
                    console.log(resstat)
                    const { data } = resstat;
  
                    if (data) {
                      this.stat = null
                    } else {
                     // this.stat = this.lddet.ld_status

                      this.inventoryStatusService.getAllDetails({isd_status: this.statusref, isd_tr_type: "RCT-TR" }).subscribe((resstatref:any)=>{
                        console.log(resstatref)
                        const { data } = resstatref;
      
                        if (data) {
                          this.stat = null
                        } else {
                          this.stat = this.statusref
    
                        

                              this.inventoryStatusService.getByIsm({ism_loc_start: controls.tr_loc.value,ism_loc_end:controls.tr_ref_loc.value, ism_status_start: this.lddet.ld_status, 
                                ism_status_end:this.statusref }).subscribe((resstatd:any)=>{
                                console.log(resstatd)
                                const { data } = resstatd;
                                if (data.length > 0) {
                                 
                                  this.stat = null
                                 
                                } 
                                else{
                                this.stat =  this.statusref

                                
                                }  
                                updateItem.tr_part = item.pt_part;
                                updateItem.desc = item.pt_desc1;
                                updateItem.tr_um = item.pt_um;
                                updateItem.tr_um_conv = 1;
                                updateItem.qty_oh =  this.lddet.ld_qty_oh;
                                updateItem.tr_price = this.sct.sct_mtl_tl;
                                
                                updateItem.tr_status =  this.stat;
                                updateItem.tr_expire =  this.lddet.ld_expire;
                              })


/*************fin */
                          
                        }
                      })
                    }
  






                   
                          
                    
                    this.gridService.updateItem(updateItem);
                  });
                  } 
                  else {
                    updateItem.tr_part = item.pt_part;
                    updateItem.desc = item.pt_desc1;
                    updateItem.tr_um = item.pt_um;
                    updateItem.tr_um_conv = 1;
                    updateItem.qty_oh =  0;
                    updateItem.tr_price = this.sct.sct_mtl_tl;
                    
                    updateItem.tr_status =  null;
                    updateItem.tr_expire =  null;
                          
                    
                    this.gridService.updateItem(updateItem);
                 

                  }
                  
                });       
              });   
           // });
          });
   
        }
      }
      angularGridReady4(angularGrid: AngularGridInstance) {
        this.angularGrid4 = angularGrid;
        this.gridObj4 = (angularGrid && angularGrid.slickGrid) || {};
      }
    
      prepareGrid4() {
        this.columnDefinitions4 = [
          {
            id: "id",
            name: "id",
            field: "id",
            sortable: true,
            minWidth: 80,
            maxWidth: 80,
          },
          {
            id: "pt_part",
            name: "code ",
            field: "pt_part",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "pt_desc1",
            name: "desc",
            field: "pt_desc1",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "pt_um",
            name: "desc",
            field: "pt_um",
            sortable: true,
            filterable: true,
            type: FieldType.string,
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
    
        // fill the dataset with your data
        this.itemsService
          .getAll()
          .subscribe((response: any) => (this.items = response.data));
      }
      open4(content) {
        this.prepareGrid4();
        this.modalService.open(content, { size: "lg" });
      }
      

      handleSelectedRowsChangedlocdet(e, args) {
        const controls = this.trForm.controls;
        let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
        if (Array.isArray(args.rows) && this.gridObjlocdet) {
          args.rows.map((idx) => {
            const item = this.gridObjlocdet.getDataItem(idx);
            console.log(item);
    
            this.inventoryStatusService.getAllDetails({isd_status: item.ld_status, isd_tr_type: "ISS-TR" }).subscribe((resstat:any)=>{
              console.log(resstat)
              const { data } = resstat;

              if (data) {
                alert("Mouvement interdit pour ce Status ")
                updateItem.tr_status = null;
               
              } 
                else { 

                  this.inventoryStatusService.getAllDetails({isd_status: this.statusref, isd_tr_type: "RCT-TR" }).subscribe((resstatref:any)=>{
                    console.log(resstatref)
                    const { data } = resstatref;
      
                    if (data) {
                      alert("Mouvement interdit pour ce Status ")
                      updateItem.tr_status = null;
                     
                    } 
                    else {

                      this.inventoryStatusService.getByIsm({ism_loc_start: controls.tr_loc.value,ism_loc_end:controls.tr_ref_loc.value, ism_status_start: item.ld_status, 
                        ism_status_end:this.statusref }).subscribe((resstatd:any)=>{
                        console.log(resstatd)
                        const { data } = resstatd;
                        if (data.length > 0) {
                          alert("Mouvement Interdit pour Status dans cet emplacement")
                          this.stat = null
                          updateItem.tr_status = null;
                        } 
                        else{
                        this.stat =  this.statusref
                          updateItem.tr_ref = item.ld_ref;
                          updateItem.tr_serial = item.ld_lot;
                          updateItem.tr_expire = item.ld_expire;
                          updateItem.qty_oh = item.ld_qty_oh;
                          updateItem.tr_status = this.stat;
                        }  
                      })
                    }  
                })
                }
            this.gridService.updateItem(updateItem);
            
            })
          
          });
        }
      }
      angularGridReadylocdet(angularGrid: AngularGridInstance) {
        this.angularGridlocdet = angularGrid;
        this.gridObjlocdet = (angularGrid && angularGrid.slickGrid) || {};
      }
    
      prepareGridlocdet() {
        const controls = this.trForm.controls; 

        this.columnDefinitionslocdet = [
          // {
          //   id: "id",
          //   field: "id",
          //   excludeFromColumnPicker: true,
          //   excludeFromGridMenu: true,
          //   excludeFromHeaderMenu: true,
    
          //   minWidth: 50,
          //   maxWidth: 50,
          // },
        
          {
            id: "ld_site",
            name: "Site",
            field: "ld_site",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "ld_loc",
            name: "Emplacement",
            field: "ld_loc",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "ld_part",
            name: "Article",
            field: "ld_part",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "ld_lot",
            name: "Lot",
            field: "ld_lot",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "ld_ref",
            name: "Palette",
            field: "ld_ref",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "ld_status",
            name: "Status",
            field: "ld_status",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "ld_qty_oh",
            name: "Qte",
            field: "ld_qty_oh",
            sortable: true,
            filterable: true,
            type: FieldType.float,
          },
          {
            id: "ld_expire",
            name: "Expire",
            field: "ld_expire",
            sortable: true,
            filterable: true,
            type: FieldType.dateIso,
          },
        ];
    
        this.gridOptionslocdet = {
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
          let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
        
        // fill the dataset with your data
        this.locationDetailService
          .getBy({ ld_site:  controls.tr_site.value , ld_loc: controls.tr_loc.value  , ld_part:  updateItem.tr_part })
          .subscribe((response: any) => (this.datalocdet = response.data));
      }
      openlocdet(contentlocdet) {
        this.prepareGridlocdet();
        this.modalService.open(contentlocdet, { size: "lg" });
      }
      handleSelectedRowsChangedum(e, args) {
        let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
        if (Array.isArray(args.rows) && this.gridObjum) {
          args.rows.map((idx) => {
            const item = this.gridObjum.getDataItem(idx);
            updateItem.tr_um = item.code_value;
         
            this.gridService.updateItem(updateItem);


          this.itemsService.getBy({pt_part: updateItem.tr_part }).subscribe((resp:any)=>{
                          
            if   (updateItem.tr_um == resp.data.pt_um )  {
              
              updateItem.tr_um_conv = 1
            } else { 
              //console.log(resp.data.pt_um)



                this.mesureService.getBy({um_um: updateItem.tr_um, um_alt_um: resp.data.pt_um, um_part: updateItem.tr_part  }).subscribe((res:any)=>{
                console.log(res)
                const { data } = res;

              if (data) {
               // alert ("Mouvement Interdit Pour ce Status")
                updateItem.tr_um_conv = res.data.um_conv 
         
         
                if (updateItem.tr_qty_loc * Number(res.data.um_conv) >  updateItem.qty_oh) {
                  console.log('here')
                  alert ("Qte Manquante")
                   updateItem.tr_qty_loc = null 
           
             
                } else {
              
                  updateItem.tr_um_conv = res.data.um_conv


                }


              } else {
                this.mesureService.getBy({um_um: resp.data.pt_um, um_alt_um: updateItem.tr_um, um_part: updateItem.tr_part  }).subscribe((res:any)=>{
                  console.log(res)
                  const { data } = res;
                  if (data) {
                    //alert ("Mouvement Interdit Pour ce Status")
                     

                    if (updateItem.tr_qty_loc * Number(res.data.um_conv) >  updateItem.qty_oh) {
                      console.log('here')
                      alert ("Qte Manquante")
                      updateItem.tr_qty_loc = null 
                 
                    } else {
                  
    
                      updateItem.tr_um_conv = res.data.um_conv

                    }
    
    


                    
                    
                  } else {
                    updateItem.tr_um_conv = 1
                    updateItem.tr_um = null
            
                    alert("UM conversion manquante")
                    
                  }  
                })

              }
                })

              }
              })


/***********/








          });
        }
      }
    angularGridReadyum(angularGrid: AngularGridInstance) {
        this.angularGridum = angularGrid
        this.gridObjum = (angularGrid && angularGrid.slickGrid) || {}
    }
    
    prepareGridum() {
        this.columnDefinitionsum = [
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
                id: "id",
                name: "id",
                field: "id",
                sortable: true,
                minWidth: 80,
                maxWidth: 80,
            },
            {
                id: "code_fldname",
                name: "Champs",
                field: "code_fldname",
                sortable: true,
                filterable: true,
                type: FieldType.string,
            },
            {
                id: "code_value",
                name: "Code",
                field: "code_value",
                sortable: true,
                filterable: true,
                type: FieldType.string,
            },
            {
                id: "code_cmmt",
                name: "Description",
                field: "code_cmmt",
                sortable: true,
                width: 200,
                filterable: true,
                type: FieldType.string,
            },
        ]
    
        this.gridOptionsum = {
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
            },
            multiSelect: false,
            rowSelectionOptions: {
                selectActiveRow: true,
            },
        }
    
        // fill the dataset with your data
        this.codeService
            .getBy({ code_fldname: "pt_um" })
            .subscribe((response: any) => (this.ums = response.data))
    }
    openum(content) {
        this.prepareGridum()
        this.modalService.open(content, { size: "lg" })
    }
    handleSelectedRowsChangedstatus(e, args) {
      const controls = this.trForm.controls;
      let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
      if (Array.isArray(args.rows) && this.gridObjstatus) {
        args.rows.map((idx) => {
          const item = this.gridObjstatus.getDataItem(idx);

          this.inventoryStatusService.getAllDetails({isd_status: item.is_status, isd_tr_type: "RCT-TR" }).subscribe((res:any)=>{
            console.log(res)
            const { data } = res;
  
          if (data) {
            alert ("Mouvement Interdit Pour ce Status")
            updateItem.tr_status = null;
       
            this.gridService.updateItem(updateItem);
          }else {
            console.log("hhhhhhhhhhhhhhhhhhhhhhhhh")
            let obj = {}
            obj = {
               ld_site: controls.tr_ref_site.value, 
               ld_loc: controls.tr_ref_loc.value, 
               ld_part: updateItem.tr_part,
               ld_lot: updateItem.tr_lot,
              }
              console.log(obj)
              status = item.is_status
            console.log(status)
            this.locationDetailService.getByStatus({obj, status} ).subscribe(
              (response: any) => {
               console.log(response.data.length != 0   )
                if (response.data.length != 0) {
                  
                    alert("lot existe avec un autre status")
 
                    updateItem.tr_status = null;
       
                }  else { 


                  updateItem.tr_status = item.is_status;
       
                } 

                this.gridService.updateItem(updateItem);

          
            })
          }

  
          })

                  });
      }
    }
  

  angularGridReadystatus(angularGrid: AngularGridInstance) {
      this.angularGridstatus = angularGrid
      this.gridObjstatus = (angularGrid && angularGrid.slickGrid) || {}
  }

  prepareGridstatus() {
      this.columnDefinitionsstatus = [
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
          id: "id",
          name: "id",
          field: "id",
          sortable: true,
          minWidth: 80,
          maxWidth: 80,
        },
        {
          id: "is_status",
          name: "Status",
          field: "is_status",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "is_desc",
          name: "Designation",
          field: "is_desc",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "is_avail",
          name: "Disponible",
          field: "is_avail",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "is_nettable",
          name: "Gerer MRP",
          field: "is_nettable",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "is_overissue",
          name: "Sortie Excedent",
          field: "is_overissue",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
    
    
      ];
    
      this.gridOptionsstatus = {
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
        checkboxSelector: {},
        multiSelect: false,
        rowSelectionOptions: {
          selectActiveRow: true,
        },
      };
    
      // fill the dataset with your data
      this.inventoryStatusService
        .getAll()
        .subscribe((response: any) => (this.statuss = response.data));
       
  }
  openstatus(content) {
      this.prepareGridstatus()
      this.modalService.open(content, { size: "lg" })
  }

  

  /*choisir demande achat*/
  handleSelectedRowsChanged5(e, args) {
    const controls = this.trForm.controls;

    const rqm_nbr = controls.tr_so_job.value;
    
    if (Array.isArray(args.rows) && this.gridObj5) {
      this.dataset = []
      args.rows.map((idx) => 
      {
        const item = this.gridObj5.getDataItem(idx);
        controls.tr_so_job.setValue(item.rqm_nbr || "");


        this.requisitionService.findBy({ rqm_nbr: item.rqm_nbr }).subscribe(
          (res: any) => {
            const { requisition, details } = res.data;
            const det1 = details;
            this.requistionServer = requisition;
            const {
              sequence: { seq_appr3_lev },
              rqm_aprv_stat,
            } = this.requistionServer;
            console.log(
              seq_appr3_lev,
              rqm_aprv_stat,
              rqm_aprv_stat !== `${seq_appr3_lev}`
            );
            if (rqm_aprv_stat !== `${seq_appr3_lev}`) {
              this.hasFormErrors = true;
              this.message = "Cette Demande D'Achat n'est pas encore validée";
              return;
            }
                    for (const object in det1) {
                      console.log("hna",details[object]);
                      const detail = details[object];
                      this.gridService.addItem(
                        {
                          id: this.dataset.length + 1,
                          tr_line: this.dataset.length + 1,
                          tr_part: detail.rqd_part,
                          cmvid: "",
                          desc: detail.rqd_desc,
                          tr_qty_loc: detail.rqd_req_qty,
                          tr_um: detail.item.pt_um,
                          tr_um_conv: 1,
                          tr_price: detail.item.pt_price,
                          // pod_disc_pct: 0,
                          
                          //tr_type: detail.item.pt_type,
                          // tr_cc: "",
                          // pod_taxable: detail.item.pt_taxable,
                          // pod_tax_code: detail.item.pt_taxc,
                          // pod_taxc: detail.item.taxe.tx2_tax_pct,
                        },
                        { position: "bottom" }
                      );
                  }
                },
                (error) => {
                  this.message = ` erreur`;
                  this.hasFormErrors = true;
                },
                () => {}
              );
          },
          (error) => {
            this.message = `Demande avec ce numero ${rqm_nbr} n'existe pas`;
            this.hasFormErrors = true;
          },
          () => {}
        );
    
     
    }
   // this.calculatetot();
  }

  angularGridReady5(angularGrid: AngularGridInstance) {
    this.angularGrid5 = angularGrid;
    this.gridObj5 = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGrid5() {
    this.columnDefinitions5 = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "rqm_nbr",
        name: "N° Demande",
        field: "rqm_nbr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "rqm_req_date",
        name: "Date",
        field: "rqm_req_date",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "rqm_total",
        name: "Total",
        field: "rqm_total",
        sortable: true,
        filterable: true,
        type: FieldType.float,
      },
      {
        id: "rqm_status",
        name: "status",
        field: "rqm_status",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptions5 = {
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
      checkboxSelector: {},
      multiSelect: false,
      rowSelectionOptions: {
        selectActiveRow: true,
      },
    };

    // fill the dataset with your data
    this.requisitionService
      .getByAll({ rqm_aprv_stat: "3", rqm_open: true })
      .subscribe((response: any) => (this.requisitions = response.data));
  }
  open5(content) {
    this.prepareGrid5();
    this.modalService.open(content, { size: "lg" });
  }
  
  printpdf(nbr) {
    // const controls = this.totForm.controls
    const controlss = this.trForm.controls;
    console.log("pdf");
    var doc = new jsPDF();
    
   // doc.text('This is client-side Javascript, pumping out a PDF.', 20, 30);
    var img = new Image()
    img.src = "./assets/media/logos/companylogo.png";
    doc.addImage(img, 'png', 150, 5, 50, 30)
    doc.setFontSize(9);
    if (this.domain.dom_name != null) {
      doc.text(this.domain.dom_name, 10, 10);
    }
    if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
    if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
    if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
    doc.setFontSize(14);

    doc.line(10, 35, 200, 35);
    doc.setFontSize(12);
    doc.text("Bon Transfert N° : " + nbr, 70, 45);
    doc.setFontSize(8);
    //console.log(this.provider.ad_misc2_id)
    doc.text("Site Source : " + controlss.tr_site.value, 20, 50);
    doc.text("Magasin     : " + controlss.tr_loc.value, 100, 50);
    doc.text("Site Dest   : " + controlss.tr_ref_site.value, 20, 55);
    doc.text("Magasin     : " + controlss.tr_ref_loc.value, 100, 55);
    
   

    doc.line(10, 85, 205, 85);
    doc.line(10, 90, 205, 90);
    doc.line(10, 85, 10, 90);
    doc.text("LN", 12.5, 88.5);
    doc.line(20, 85, 20, 90);
    doc.text("Code Article", 25, 88.5);
    doc.line(45, 85, 45, 90);
    doc.text("Désignation", 67.5, 88.5);
    doc.line(100, 85, 100, 90);
    doc.text("QTE", 107, 88.5);
    doc.line(120, 85, 120, 90);
    doc.text("UM", 123, 88.5);
    doc.line(130, 85, 130, 90);
    doc.text("PU", 138, 88.5);
    doc.line(150, 85, 150, 90);
    doc.text("Lot/Série", 152, 88.5);
    doc.line(170, 85, 170, 90);
    doc.text("N PAL", 172, 88.5);
    doc.line(185, 85, 185, 90);
    doc.text("THT", 195, 88.5);
    doc.line(205, 85, 205, 90);
    var i = 95;
    doc.setFontSize(6);
    let total = 0
    for (let j = 0; j < this.dataset.length  ; j++) {
      total = total + Number(this.dataset[j].tr_price) * Number(this.dataset[j].tr_qty_loc)
      
      if ((j % 30 == 0) && (j != 0) ) {
  doc.addPage();
        img.src = "./assets/media/logos/companylogo.png";
        doc.addImage(img, 'png', 150, 5, 50, 30)
        doc.setFontSize(9);
        if (this.domain.dom_name != null) {
          doc.text(this.domain.dom_name, 10, 10);
        }
        if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
        if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
        if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
        doc.setFontSize(14);
        doc.line(10, 35, 200, 35);

        doc.setFontSize(12);
        doc.text("Bon Transfert N° : " + nbr, 70, 45);
        doc.setFontSize(8);
        //console.log(this.provider.ad_misc2_id)
        doc.text("Site Source : " + controlss.tr_site.value, 20, 50);
        doc.text("Magasin     : " + controlss.tr_loc.value, 100, 50);
        doc.text("Site Dest   : " + controlss.tr_ref_site.value, 20, 55);
        doc.text("Magasin     : " + controlss.tr_ref_loc.value, 100, 55);

        doc.line(10, 85, 205, 85);
        doc.line(10, 90, 205, 90);
        doc.line(10, 85, 10, 90);
        doc.text("LN", 12.5, 88.5);
        doc.line(20, 85, 20, 90);
        doc.text("Code Article", 25, 88.5);
        doc.line(45, 85, 45, 90);
        doc.text("Désignation", 67.5, 88.5);
        doc.line(100, 85, 100, 90);
        doc.text("QTE", 107, 88.5);
        doc.line(120, 85, 120, 90);
        doc.text("UM", 123, 88.5);
        doc.line(130, 85, 130, 90);
        doc.text("PU", 138, 88.5);
        doc.line(150, 85, 150, 90);
        doc.text("Lot/Série", 152, 88.5);
        doc.line(170, 85, 170, 90);
        doc.text("N PAL", 172, 88.5);
        doc.line(185, 85, 185, 90);
        doc.text("THT", 195, 88.5);
        doc.line(205, 85, 205, 90);
        i = 95;
        doc.setFontSize(6);
      }

      if (this.dataset[j].desc.length > 35) {
        let desc1 = this.dataset[j].desc.substring(35);
        let ind = desc1.indexOf(" ");
        desc1 = this.dataset[j].desc.substring(0, 35 + ind);
        let desc2 = this.dataset[j].desc.substring(35 + ind);

        doc.line(10, i - 5, 10, i);
        doc.text(String("000" + this.dataset[j].tr_line).slice(-3), 12.5, i - 1);
        doc.line(20, i - 5, 20, i);
        doc.text(this.dataset[j].tr_part, 25, i - 1);
        doc.line(45, i - 5, 45, i);
        doc.text(desc1, 47, i - 1);
        doc.line(100, i - 5, 100, i);
        doc.text(String(Number(this.dataset[j].tr_qty_loc.toFixed(2))), 118, i - 1, { align: "right" });
        doc.line(120, i - 5, 120, i);
        doc.text(this.dataset[j].tr_um, 123, i - 1);
        doc.line(130, i - 5, 130, i);
        doc.text(String(Number(this.dataset[j].tr_price).toFixed(2)), 148, i - 1, { align: "right" });
        doc.line(150, i - 5, 150, i);
        doc.text(String(this.dataset[j].tr_serial), 168, i - 1, { align: "right" });
        doc.line(170, i - 5, 170, i);
        doc.text(String(this.dataset[j].tr_ref), 183, i - 1, { align: "right" });
        doc.line(185, i - 5, 185, i);
        doc.text(String((this.dataset[j].tr_price * this.dataset[j].tr_qty_loc).toFixed(2)), 203, i - 1, { align: "right" });
        doc.line(205, i - 5, 205, i);
        // doc.line(10, i, 200, i );

        i = i + 5;

        doc.text(desc2, 47, i - 1);

        doc.line(10, i - 5, 10, i);
        doc.line(20, i - 5, 20, i);
        doc.line(45, i - 5, 45, i);
        doc.line(100, i - 5, 100, i);
        doc.line(120, i - 5, 120, i);
        doc.line(130, i - 5, 130, i);
        doc.line(150, i - 5, 150, i);
        doc.line(170, i - 5, 170, i);
        doc.line(185, i - 5, 185, i);
        doc.line(205, i - 5, 205, i);
        doc.line(10, i, 200, i);

        i = i + 5;
      } else {
        doc.line(10, i - 5, 10, i);
        doc.text(String("000" + this.dataset[j].tr_line).slice(-3), 12.5, i - 1);
        doc.line(20, i - 5, 20, i);
        doc.text(this.dataset[j].tr_part, 25, i - 1);
        doc.line(45, i - 5, 45, i);
        doc.text(this.dataset[j].desc, 47, i - 1);
        doc.line(100, i - 5, 100, i);
        doc.text(String(Number(this.dataset[j].tr_qty_loc).toFixed(2)), 118, i - 1, { align: "right" });
        doc.line(120, i - 5, 120, i);
        doc.text(this.dataset[j].tr_um, 123, i - 1);
        doc.line(130, i - 5, 130, i);
        doc.text(String(Number(this.dataset[j].tr_price).toFixed(2)), 148, i - 1, { align: "right" });
        doc.line(150, i - 5, 150, i);
        doc.text(String(this.dataset[j].tr_serial), 168, i - 1, { align: "right" });
        doc.line(170, i - 5, 170, i);
        doc.text(String(this.dataset[j].tr_ref), 183, i - 1, { align: "right" });
        doc.line(185, i - 5, 185, i);
        doc.text(String((this.dataset[j].tr_price * this.dataset[j].tr_qty_loc).toFixed(2)), 203, i - 1, { align: "right" });
        doc.line(205, i - 5, 205, i);
        doc.line(10, i, 205, i);
        i = i + 5;
      }
    }

    // doc.line(10, i - 5, 200, i - 5);
/*
    doc.line(130, i + 7, 205, i + 7);
    doc.line(130, i + 14, 205, i + 14);
    //  doc.line(130, i + 21, 200, i + 21 );
    //  doc.line(130, i + 28, 200, i + 28 );
    //  doc.line(130, i + 35, 200, i + 35 );
    doc.line(130, i + 7, 130, i + 14);
    doc.line(160, i + 7, 160, i + 14);
    doc.line(205, i + 7, 205, i + 14);
    doc.setFontSize(10);

    doc.text("Total HT", 140, i + 12, { align: "left" });
    //  doc.text('TVA', 140 ,  i + 19 , { align: 'left' });
    //  doc.text('Timbre', 140 ,  i + 26 , { align: 'left' });
    //  doc.text('Total TC', 140 ,  i + 33 , { align: 'left' });

    doc.text(String(Number(total).toFixed(2)), 198, i + 12, { align: "right" });
    //  doc.text(String(Number(controls.tva.value).toFixed(2)), 198 ,  i + 19 , { align: 'right' });
    //  doc.text(String(Number(controls.timbre.value).toFixed(2)), 198 ,  i + 26 , { align: 'right' });
    //  doc.text(String(Number(controls.ttc.value).toFixed(2)), 198 ,  i + 33 , { align: 'right' });

    doc.setFontSize(8);
    let mt = NumberToLetters(Number(total).toFixed(2), "Dinars Algerien");

    if (mt.length > 95) {
      let mt1 = mt.substring(90);
      let ind = mt1.indexOf(" ");

      mt1 = mt.substring(0, 90 + ind);
      let mt2 = mt.substring(90 + ind);

      doc.text("Arretée la présente Commande a la somme de :" + mt1, 20, i + 53);
      doc.text(mt2, 20, i + 60);
    } else {
      doc.text("Arretée la présente Commande a la somme de :" + mt, 20, i + 53);
    }
    */
    // window.open(doc.output('bloburl'), '_blank');
    //window.open(doc.output('blobUrl'));  // will open a new tab
    var blob = doc.output("blob");
    window.open(URL.createObjectURL(blob));
  }

}
