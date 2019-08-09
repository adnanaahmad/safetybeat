import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DocumentsComponent} from './components/documents/documents.component';
import {ShowFolderDocumentsComponent} from './components/showFolderDocuments/showFolderDocuments.component';

const routes: Routes = [
  {
    path: '',
    component: DocumentsComponent
  },
  {
    path: 'viewDocs',
    component: ShowFolderDocumentsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentsRoutingModule {
}
