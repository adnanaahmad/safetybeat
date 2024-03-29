import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DocumentsComponent} from './components/documents/documents.component';
import {DocumentsRoutingModule} from './documents-routing.module';
import {MaterialModule} from 'src/app/material.module';
import {ShowFolderDocumentsComponent} from './components/showFolderDocuments/showFolderDocuments.component';
import {FileComponent} from './components/file/file.component';
import {FolderComponent} from './components/folder/folder.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    DocumentsComponent,
    ShowFolderDocumentsComponent,
    FileComponent,
    FolderComponent
  ],
  imports: [
    CommonModule,
    DocumentsRoutingModule,
    MaterialModule,
    FormsModule
  ]
})
export class DocumentsModule {
}
