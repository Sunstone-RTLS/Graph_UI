import { Component } from '@angular/core';
import {JsonGraph} from "../../projects/json-graph-lib/src/lib/model/JsonGraph";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'json-graph-editor';

  graph: JsonGraph = {
    "directed": true,
    "nodes":
      [
        {"id": "0", "metadata": {"receivedPackets": 1, "position":{"x":0.0,"y":0.0}, "display":{"color":"blue","shape":"circle"} }},
        {"id": "1", "metadata": {"receivedPackets": 2, "position":{"x":1.0,"y":0.0}, "display":{"color":"red","shape":"rectangle"} }},
        {"id": "2", "metadata": {"receivedPackets": 3, "position":{"x":1.0,"y":1.0}, "display":{"color":"#880088","shape":"circle"} }}
      ],
    "edges":
      [
        {"source": "0", "target": "1", "metadata": {"losConfidence": 1000, "display":{"color":"red","weight":4} }},
        {"source": "0", "target": "2", "metadata": {"losConfidence": 1000}}
      ]
  };
  input:string =
  `
  {
    "directed": true,
    "nodes":
      [
        {"id": "0", "metadata": {"receivedPackets": 1, "position":{"x":0.0,"y":0.0}, "display":{"color":"blue","shape":"circle"} }},
        {"id": "1", "metadata": {"receivedPackets": 2, "position":{"x":1.0,"y":0.0}, "display":{"color":"red","shape":"rectangle"} }},
        {"id": "2", "metadata": {"receivedPackets": 3, "position":{"x":1.0,"y":1.0}, "display":{"color":"#880088","shape":"circle"} }}
      ],
    "edges":
      [
        {"source": "0", "target": "1", "metadata": {"losConfidence": 1000, "display":{"color":"red","weight":4} }},
        {"source": "0", "target": "2", "metadata": {"losConfidence": 1000}}
      ]
  }
  `;
  editable: boolean = true;

  settings = {
    editable: true,
    coordinateTransformation: (x,y)=>{return {x,y}}
  }

  update() {
    this.settings = {...this.settings, editable: this.editable};
    this.graph = JSON.parse(this.input);
  }

  updateSettings() {
    this.settings = {...this.settings, editable: this.editable};
  }
}
