import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentsRoutingModule } from './documents-routing.module';
import { DocumentsComponent } from './components/documents/documents.component';
import { MaterialModule } from 'src/app/shared/material/material.module';

@NgModule({
  declarations: [DocumentsComponent],
  imports: [
    CommonModule,
    DocumentsRoutingModule,
    MaterialModule
  ]
})
export class DocumentsModule { }
