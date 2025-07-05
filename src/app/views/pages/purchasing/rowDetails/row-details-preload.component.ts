import { Component } from '@angular/core';

@Component({
  // template: `<h4><i class="fa fa-refresh fa-spin fa-2x fa-fw"></i>Loading...</h4>`
  template: `<div class="container-fluid d-flex align-items-center" style="margin-top: 10px">
  <i class="mdi mdi-sync mdi-spin mdi-50px"></i>
  <h4>Loading...</h4>
</div>`,
})
export class RowDetailPreloadComponent {}