import { NgModule } from '@angular/core';
import {
  MatSidenavModule,
  MatToolbarModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatTableModule,
  MatChipsModule,
  MatInputModule,
  MatSelectModule,
  MatIconModule,
  MatListModule,
  MatPaginatorModule,
  MatSortModule,
  MatDatepickerModule,
  MatSnackBarModule,
  MatCardModule,
  MatDialogModule,
  MatGridListModule,
  MatCheckboxModule,
  MatStepperModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatMenuModule,
  MatTooltipModule,
  MatRadioModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatExpansionModule,
  MatTabsModule,
  MatAutocompleteModule
} from '@angular/material';
import { GooglePlacesDirective } from 'src/app/directives/googlePlaces/googlePlaces.directive';

@NgModule({
  imports: [
    MatTooltipModule,
    MatGridListModule,
    MatCardModule,
    MatDialogModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTableModule,
    MatChipsModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatListModule,
    MatCheckboxModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSortModule,
    MatDatepickerModule,
    MatSnackBarModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatStepperModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatTabsModule,
    MatAutocompleteModule
  ],
  declarations: [GooglePlacesDirective],
  exports: [
    MatTooltipModule,
    MatGridListModule,
    MatCardModule,
    MatDialogModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatSidenavModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatMenuModule,
    MatTableModule,
    MatChipsModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatListModule,
    MatPaginatorModule,
    MatSortModule,
    MatDatepickerModule,
    MatSnackBarModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatStepperModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatTabsModule,
    GooglePlacesDirective,
    MatAutocompleteModule
  ]
})
export class MaterialModule { }
