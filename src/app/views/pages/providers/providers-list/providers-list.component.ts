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
import { Provider, ProviderService,Address , AddressService, CodeService, BankService, DeviseService} from "../../../../core/erp"
import { jsPDF } from "jspdf";
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
  pays:any;
vdtype:any;
seq:any;
shipvia:any;
banque:any;
ckfrm:any;
crterms:any;
devise:any;
docs:any[]=[];
exist:any;
provider : any
  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private addressService: AddressService,
      private providerService: ProviderService,
      private modalService: NgbModal,
      private codeService: CodeService,
      private bankService: BankService,
      private deviseService :DeviseService,
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
          {
            id: "print",
            name: "Impression",
            field: "id",
            excludeFromColumnPicker: true,
            excludeFromGridMenu: true,
            excludeFromHeaderMenu: true,
            
              //formatter: Formatters.editIcon,
              formatter: (row, cell, value, columnDef, dataContext) => {
                // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
                return `
                <a class="btn btn-sm btn-clean btn-icon mr-2" title="Impression Fiche Fournisseur">
                <i class="flaticon2-printer"></i>
            </a>
                 `;
              },
            
            minWidth: 50,
            maxWidth: 80,
            // use onCellClick OR grid.onClick.subscribe which you can see down below
            onCellClick: (e: Event, args: OnEventArgs) => {
               const id = args.dataContext.id
               
               
              // alert("print")
              this.providerService
              .getBy({ vd_addr: args.dataContext.vd_addr })
              .subscribe( (res:any) => {
                  console.log(res.data)
                  this.provider = res.data
                  this.codeService
                  .getBy({ code_fldname: 'check_form',code_value:this.provider.vd_ckfrm })
                  .subscribe((response: any) => (
                    (response.data.length !=0) ? this.ckfrm = response.data[0].code_cmmt : this.ckfrm = '',
                    
                    this.codeService.getBy({ code_fldname: 'vd_cr_terms',code_value:this.provider.vd_cr_terms })
                    .subscribe((response1: any) => ((response1.data.length !=0) ? this.crterms = response1.data[0].code_cmmt : this.crterms = '',
                      this.codeService.getBy({ code_fldname: 'vd_type',code_value:this.provider.vd_type })
                      .subscribe((response2: any) => ( (response2.data.length != 0) ? this.vdtype = response2.data[0].code_cmmt : this.vdtype='',
                        this.codeService.getBy({ code_fldname: 'ad_country',code_value:this.provider.address.ad_country })
                        .subscribe((response3: any) => { if(response3.data.length != 0) {
                                            this.pays = response3.data[0].code_cmmt } else {  this.pays = '' }
                          this.codeService.getBy({ code_fldname: 'vd_shipvia',code_value:this.provider.vd_shipvia })
                          .subscribe((response4: any) => {
                            if(response4.data.length !=0) {this.shipvia = response4.data[0].code_cmmt} else {this.shipvia = ''}
                            this.codeService.getBy({code_fldname:'bank',code_value:this.provider.vd_bank}).subscribe((res:any)=>{
                              console.log(res.data)
                              if(res.data.length != 0)
                              {this.banque = res.data[0].code_cmmt } else {this.banque = ''}
                              this.deviseService.getBy({ cu_curr:  this.provider.vd_curr }).subscribe(
                                (response: any) => {
                             (response.data != null) ? this.devise = response.data.cu_desc : this.devise = ''
                                
                                 this.printpdf()
                                })
                            })
                          })             
                          })
                      ))    
                    ))
                  )); 
               
              })
      
            },
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
printpdf() {
  
  var doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    //format: [100,150]
    })
    let initialY = 25;
    doc.setLineWidth(0.2);
  
  var img = new Image();
   img.src = "./assets/media/logos/companyentete.png";
   doc.addImage(img, "png", 5, 5, 200, 30);
  doc.setFontSize(8);
if(this.exist == true){
doc.text(this.docs[0].code_value, 160, 17); 
doc.setFontSize(10);
doc.text(this.docs[0].code_cmmt, 55, 22);
doc.setFontSize(8);
doc.text(this.docs[0].code_desc, 165, 12);
doc.text(this.docs[0].chr01, 22, 27);
doc.text(String(1), 22, 32);
doc.text(this.docs[0].dec01, 170, 32);
doc.text(this.docs[0].date01, 180, 22);
doc.text(this.docs[0].date02, 180, 27);
}

  const date = new Date()
  doc.setFontSize(16);

  
  doc.setFont("Times-Roman");
  doc.line(35,35,150,35)
  doc.text("Code Fournisseur : " + this.provider.address.ad_addr, 40, 40);
  doc.line(35,45,150,45)
  doc.setFontSize(12);
  
  doc.text("Nom Fournisseur: " + this.provider.address.ad_name, 7, 50);
  if(this.provider.vd_sort != null){doc.text("Activité: " + this.provider.vd_sort, 7, 55);}
  else {doc.text("Activité: " , 7, 55);}
  doc.line(5,60,200,60)
  if(this.provider.address.ad_line1 != null){doc.text("Addresse: " + this.provider.address.ad_line1, 7, 65);}
  else{doc.text("Addresse: ", 7, 65);}
  if(this.provider.address.ad_country != null){doc.text("Pays: " + this.provider.address.ad_country + ' ' + this.pays, 7, 70);}
  else{doc.text("Pays: ", 7, 70);}
  // doc.line(5,75,200,75)
  if(this.provider.address.ad_phone != null){doc.text("Tel: " + this.provider.address.ad_phone, 7, 80);}
  else{doc.text("Tel: ", 7, 80);}  
  if(this.provider.address.ad_ext != null){doc.text("Email: " + this.provider.address.ad_ext, 57, 80);}
  else{doc.text("Email: ", 57, 80)}  
  doc.line(5,85,200,85)
  if(this.provider.address.ad_taxable == true) {
  doc.text("Taxable: " + "OUI", 7, 90);} else { 
    doc.text("Taxable: " + "NON", 7, 90)
  }
  doc.text("Taux de taxe: " + this.provider.address.ad_taxc, 57, 90);
  // doc.line(5,85,200,85)
  // doc.text("DA Obligatoire: " + this.provider.pt_plan_ord, 5, initialY + 45);
  // doc.text("Achat: " + this.provider.pt_dea, 55, initialY + 45);
  if(this.provider.address.ad_gst_id != null){doc.text("RC N°: " + this.provider.address.ad_gst_id, 7, 95);}
  else{doc.text("RC N°: ", 7, 95)}
  if(this.provider.address.ad_misc2_id != null){doc.text("NIF: " + this.provider.address.ad_misc2_id, 57, 95);}
  else{doc.text("NIF: ", 57, 95)}
  if(this.provider.address.ad_pst_id != null){doc.text("AI: " + this.provider.address.ad_pst_id, 7, 100);}
  else{doc.text("AI: " , 7, 100)}
  if(this.provider.address.ad_misc1_id != null){doc.text("NIS: " + this.provider.address.ad_misc1_id, 57, 100);}
  {doc.text("NIS: ", 57, 100)}
  doc.line(5,105,200,105)
  
  if(this.provider.vd_type != null){doc.text("Type: " + this.provider.vd_type + ' - ' , 7, 110);}
  else{doc.text("Type: ", 7, 110)}
  if(this.provider.vd_seq!=null){doc.text("Séquence: " + this.provider.vd_seq + ' - ' + this.seq, 7, 115);}
  else{doc.text("Séquence: ", 7, 115)}
  if(this.provider.vd_shipvia!=null){doc.text("Modalité de transport: " + this.provider.vd_shipvia + ' - ' + this.shipvia, 7, 120);}
  else{doc.text("Modalité de transport: ", 7, 120)}
  doc.line(5,125,200,125)
  if(this.provider.vd_bank!=null){doc.text("Banque: " + this.provider.vd_bank + ' - ' + this.banque, 7, 130);}
  else{doc.text("Banque: ", 7, 130)}
  if(this.provider.vd_ckfrm!=null){doc.text("Méthode de paiement: " + this.provider.vd_ckfrm + ' - ' + this.ckfrm, 7, 135);}
  else{doc.text("Méthode de paiement: ", 7, 135)}
  if(this.provider.vd_cr_terms!=null){doc.text("Condition: " + this.provider.vd_cr_terms + ' -  ' + this.crterms, 7, 140);}
  else{doc.text("Condition: ", 7, 140)}
  if(this.provider.vd_curr!=null){doc.text("Devise: " + this.provider.vd_curr + ' - ' + this.devise, 7, 145);}
  else{doc.text("Devise: ", 7, 145)}
  if(this.provider.vd_db!=null){doc.text("RIB: " + this.provider.vd_db, 7, 150);}
  else{doc.text("RIB: ", 7, 150)}
  if(this.provider.vd_debtor!=null){doc.text("Compte: " + this.provider.vd_debtor, 7, 155);}
  else{doc.text("Compte: ", 7, 155)}
  doc.line(5,160,200,160)

  if(this.provider.address.ad_attn != null){doc.text("Contact 1: " + this.provider.address.ad_attn, 7, 165)}
  if(this.provider.address.ad_user1 != null){doc.text("Poste: " + this.provider.address.ad_user1, 7, 170)}
  if(this.provider.address.ad_phone != null){doc.text("Téléphone: " + this.provider.address.ad_phone, 7, 175)}
  if(this.provider.address.ad_ext != null){doc.text("Email: " + this.provider.address.ad_ext, 7, 180)}
  if(this.provider.address.ad_fax != null){doc.text("Fax: " + this.provider.address.ad_fax, 7, 185)}

  if(this.provider.address.ad_attn2 != null){doc.text("Contact 2: " + this.provider.address.ad_attn2, 7, 190)}
  if(this.provider.address.ad_user2 != null){doc.text("Poste: " + this.provider.address.ad_user2, 7, 195)}
  if(this.provider.address.ad_phone2 != null){doc.text("Téléphone: " + this.provider.address.ad_phone2, 7, 200)}
  if(this.provider.address.ad_ext2 != null){doc.text("Email: " + this.provider.address.ad_ext2, 7, 205)}
  if(this.provider.address.ad_fax2 != null){doc.text("Fax: " + this.provider.address.ad_fax2, 7, 210)}
  doc.line(5,215,200,215)

  doc.setFontSize(9);

  var i = 35



  
    var blob = doc.output("blob");
    window.open(URL.createObjectURL(blob));   
  }
}
