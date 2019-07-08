
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsComponent } from './components/documents/documents.component';
import { DocumentsRoutingModule } from './documents-routing.module';
import { MaterialModule} from '../../../../shared/material/material.module';
import { ShowDocumentsComponent } from './components/showDocuments/showDocuments.component';

@NgModule({
  declarations: [
    DocumentsComponent,
    ShowDocumentsComponent
  ],
  imports: [
    CommonModule,
    DocumentsRoutingModule,
    MaterialModule
  ]
})
export class DocumentsModule { }
