import { NgModule } from '@angular/core';
import {LeafletModule} from "@asymmetrik/ngx-leaflet";
import { JsonGraphEditorComponent } from './json-graph-editor/json-graph-editor.component';
import {PopupComponent} from './popup/popup.component';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';



@NgModule({
  declarations: [JsonGraphEditorComponent, PopupComponent],
  imports: [LeafletModule, CommonModule, ReactiveFormsModule],
  exports: [JsonGraphEditorComponent],
  entryComponents: [PopupComponent]
})
export class JsonGraphLibModule { }
