import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DocumentsComponent} from './components/documents/documents.component';
import {ShowDocumentsComponent} from './components/showDocuments/showDocuments.component';

const routes: Routes = [
  {
    path: '',
    component: DocumentsComponent
  },
  {
    path: 'viewDocs',
    component: ShowDocumentsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentsRoutingModule {
}
