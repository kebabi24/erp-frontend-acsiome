import { Component, OnInit } from "@angular/core"
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"

// Angular slickgrid
import {
    Column,
    GridOption,
    Formatter,
    Editor,
    Editors,
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

import { Domain, DomainService } from "../../../../core/erp"
@Component({
  selector: 'kt-edit-domain',
  templateUrl: './edit-domain.component.html',
  styleUrls: ['./edit-domain.component.scss']
})
export class EditDomainComponent implements OnInit {

  domain: Domain
  domForm: FormGroup
  hasFormErrors = false
  isExist = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  domainEdit: any
  title: String = 'Modifier Domaine - '

  constructor(
      config: NgbDropdownConfig,
      private domFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private domainService: DomainService
  ) {
      config.autoClose = true
  }
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable()
    this.loadingSubject.next(true)
    this.activatedRoute.params.subscribe((params) => {
        const id = params.id
        this.domainService.getOne(id).subscribe((response: any)=>{
          this.domainEdit = response.data
          this.initCode()
          this.loadingSubject.next(false)
          this.title = this.title + this.domainEdit.dom_domain
        })
    })
  }

  // init code
  initCode() {
    this.createForm()
    this.loadingSubject.next(false)
  }
//create form
createForm() {
  this.loadingSubject.next(false)

  this.domain = new Domain()
  this.domForm = this.domFB.group({
      dom_domain: [this.domainEdit.dom_domain, Validators.required],
      dom_name: [
         this.domainEdit.dom_name, 
          Validators.required,
      ],
      dom_sname: [
       this.domainEdit.dom_sname, 
        Validators.required,
    ],
    

    dom_addr: [this.domainEdit.dom_addr],
    dom_city: [this.domainEdit.dom_city],

    dom_rc: [this.domainEdit.dom_rc],
    dom_nif: [this.domainEdit.dom_nif],
    dom_nis: [this.domainEdit.dom_nis],
    dom_ai: [this.domainEdit.dom_ai],

    dom_email: [this.domainEdit.dom_email],
    dom_web: [this.domainEdit.dom_web],
    
    dom_bank1: [this.domainEdit.dom_bank1],
    dom_rib1: [this.domainEdit.dom_rib1],
    dom_bank2: [this.domainEdit.dom_bank2],
    dom_rib2: [this.domainEdit.dom_rib2],

    dom_tel1: [this.domainEdit.dom_tel1],
    dom_tel2: [this.domainEdit.dom_tel2],
    
    dom_fax: [this.domainEdit.dom_fax],
    dom_active: [this.domainEdit.dom_active],
      
  })
}

//reste form
reset() {
  this.domain = new Domain()
  this.createForm()
  this.hasFormErrors = false
}
// save data
onSubmit() {
  this.hasFormErrors = false
  const controls = this.domForm.controls
  /** check form */
  if (this.domForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
          controls[controlName].markAsTouched()
      )

      this.hasFormErrors = true
      return
  }

  // tslint:disable-next-line:prefer-const
  let domain = this.prepareDomain()
  this.addDomain(domain)
}
/**
     * Returns object for saving
     */
    prepareDomain(): Domain {
      const controls = this.domForm.controls
      const _domain = new Domain()
      _domain.dom_domain = controls.dom_domain.value
      _domain.dom_name = controls.dom_name.value
      _domain.dom_sname = controls.dom_sname.value
      _domain.dom_addr = controls.dom_addr.value
      _domain.dom_city = controls.dom_city.value
      _domain.dom_rc = controls.dom_rc.value
      _domain.dom_nif = controls.dom_nif.value
      _domain.dom_nis = controls.dom_nis.value
      _domain.dom_ai = controls.dom_ai.value


      _domain.dom_bank1 = controls.dom_bank1.value
      _domain.dom_rib1 = controls.dom_rib1.value
      _domain.dom_bank2 = controls.dom_bank2.value
      _domain.dom_rib2 = controls.dom_rib2.value
  
      _domain.dom_tel1 = controls.dom_tel1.value
      _domain.dom_tel2 = controls.dom_tel2.value
      
      _domain.dom_email = controls.dom_email.value
      _domain.dom_web = controls.dom_web.value
      
      _domain.dom_fax =  controls.dom_fax.value
      _domain.dom_active = controls.dom_active.value
      return _domain
  }
/**
     * Add code
     *
     * @param _domain: DeviseModel
     */
    addDomain(_domain: Domain) {
      this.loadingSubject.next(true)
      this.domainService.update(this.domainEdit.id, _domain).subscribe(
        (reponse) => console.log("response", Response),
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
            this.router.navigateByUrl("/domain/list-domain")
        }
    )
  }


 /**
     * Go back to the list
     *
     */
    goBack() {
      this.loadingSubject.next(false)
      const url = `/domain/create-domain`
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }



}
