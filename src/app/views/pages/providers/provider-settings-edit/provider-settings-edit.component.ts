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

import { Code, CodeService } from "../../../../core/erp"
@Component({
  selector: 'kt-provider-settings-edit',
  templateUrl: './provider-settings-edit.component.html',
  styleUrls: ['./provider-settings-edit.component.scss']
})
export class ProviderSettingsEditComponent implements OnInit {
  code: Code
    codeForm: FormGroup
    hasFormErrors = false
    loadingSubject = new BehaviorSubject<boolean>(true)
    loading$: Observable<boolean>
    title: String = 'Modifier Paramétre - '
    codeEdit: any
date1: any;
date2: any;
isTerms:Boolean = false
check_form: any[] = []
    constructor(
        config: NgbDropdownConfig,
        private codeFB: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private layoutUtilsService: LayoutUtilsService,
        private codeService: CodeService
    ) {
        config.autoClose = true
        this.codeService
        .getBy({ code_fldname: "check_form" })
        .subscribe((response: any) => (this.check_form = response.data))
    }
    ngOnInit(): void {
        this.loading$ = this.loadingSubject.asObservable()
        this.loadingSubject.next(true)
        this.activatedRoute.params.subscribe((params) => {
            const id = params.id
            this.codeService.getOne(id).subscribe((response: any)=>{
              this.codeEdit = response.data

              if(this.codeEdit.code_fldname == 'vd_cr_terms') { this.isTerms = true }
            
               // console.log(this.codeEdit.date01, this.date2)
             
              this.initCode()
              this.loadingSubject.next(false)
              this.title = this.title + this.codeEdit.code_value  
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
    
        this.codeForm = this.codeFB.group({
            code_fldname: [this.codeEdit.code_fldname],
            code_value: [this.codeEdit.code_value, Validators.required],
            code_cmmt: [this.codeEdit.code_cmmt, Validators.required],
            code_desc: [ {value:this.codeEdit.code_desc,disabled: !this.isTerms}],
            dec01: [{value:this.codeEdit.dec01,disabled: !this.isTerms}],
       
        })
        
     
     
    }
    //reste form
    reset() {
        this.code = new Code()
        this.createForm()
        this.hasFormErrors = false
    }
    // save data
    onSubmit() {
        this.hasFormErrors = false
        const controls = this.codeForm.controls
        /** check form */
        if (this.codeForm.invalid) {
            Object.keys(controls).forEach((controlName) =>
                controls[controlName].markAsTouched()
            )

            this.hasFormErrors = true
            return
        }

        // tslint:disable-next-line:prefer-const
        let address = this.prepareCode()
        this.addCode(address)
    }
    /**
     * Returns object for saving
     */
    prepareCode(): Code {
        const controls = this.codeForm.controls
        const _code = new Code()
        _code.id = this.codeEdit.id
        _code.code_fldname = controls.code_fldname.value
        _code.code_value = controls.code_value.value
        _code.code_cmmt = controls.code_cmmt.value
        _code.code_desc = controls.code_desc.value
      
        _code.dec01 = controls.dec01.value
        return _code
    }
    /**
     * Add code
     *
     * @param _code: CodeModel
     */
    addCode(_code: Code) {
        this.loadingSubject.next(true)
        this.codeService.update(this.codeEdit.id, _code).subscribe(
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
                this.router.navigateByUrl("/providers/provider-settings-list")
            }
        )
    }

    /**
     * Go back to the list
     *
     */
    goBack() {
        this.loadingSubject.next(false)
        const url = `/providers/provider-settings-list`
        this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
    }
}
