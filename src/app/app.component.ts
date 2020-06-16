import { Component } from '@angular/core';
import {JsonGraph} from "../../projects/json-graph-lib/src/lib/model/JsonGraph";
import {EdgeCreateEvent, EdgeChangeEvent, NodeChangeEvent} from "../../projects/json-graph-lib/src/lib/model/EditorEvents";
import {EditorSettings} from '../../projects/json-graph-lib/src/lib/model/EditorSettings';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'json-graph-editor';

  graph: JsonGraph = {
    "directed": true,
    "multiEdge": true,
    "nodes":
      [
        {"id": "0", "metadata": {"receivedPackets": 1, "position":{"x":0.0,"y":0.0}, "display":{"color":"blue","shape":"circle", "size":20} }},
        {"id": "1", "metadata": {"receivedPackets": 2, "position":{"x":1.0,"y":0.0}, "display":{"color":"red","shape":"rectangle", "size":10} }},
        {"id": "2", "metadata": {"receivedPackets": 3, "position":{"x":2.3,"y":-1.0}, "display":{"color":"#880088","shape":"circle", "size":15} }},
        {"id": "3", "metadata": {"receivedPackets": 4, "position":{"x":-0.8,"y":-0.8}, "display":{"color":"#cce038","shape":"rounded", "size":15} }},
        {"id": "4", "metadata": {"receivedPackets": 5, "position":{"x":0.5,"y":0.6}, "display":{"color":"#33aa88","shape":"rounded", "size":15} }},
        {"id": "5", "metadata": {"receivedPackets": 6, "status": "online", "position":{"x":-2.2,"y":1.8}, "display":{"color":"#880088","shape":"circle", "size":15} }}
      ],
    "edges":
      [
        {"id": "0", "source": "0", "target": "1", "metadata": {"losConfidence": 1000, "display":{"color":"red","weight":4} }},
        {"id": "1", "source": "4", "target": "5", "metadata": {"losConfidence": 400, "display":{"color":"red","weight":4} }},
        {"id": "2", "source": "5", "target": "3", "metadata": {"losConfidence": 1000, "display":{"color":"black","weight":4} }},
        {"source": "3", "target": "2", "metadata": {"losConfidence": 1000, "display":{"color":"gray","weight":6} }},
        {"source": "0", "target": "3", "metadata": {"losConfidence": 300, "display":{"color":"red","weight":4} }},
        {"source": "0", "target": "2", "metadata": {"losConfidence": 1000, "display":{"color":"orange","weight":2} }},
        {"source": "2", "target": "0", "metadata": {"losConfidence": 1000, "display":{"color":"orange","weight":3} }},
        {"source": "0", "target": "2", "metadata": {"losConfidence": 1000, "display":{"color":"orange","weight":2} }}
      ]
  };
  input:string =
  `
 {
    "directed": true,
    "multiEdge": true,
    "nodes":
      [
        {"id": "0", "metadata": {"receivedPackets": 1, "position":{"x":0.0,"y":0.0}, "display":{"color":"blue","shape":"circle", "size":20} }},
        {"id": "1", "metadata": {"receivedPackets": 2, "position":{"x":1.0,"y":0.0}, "display":{"color":"red","shape":"rectangle", "size":10} }},
        {"id": "2", "metadata": {"receivedPackets": 3, "position":{"x":2.3,"y":-1.0}, "display":{"color":"#880088","shape":"circle", "size":15} }},
        {"id": "3", "metadata": {"receivedPackets": 4, "position":{"x":-0.8,"y":-0.8}, "display":{"color":"#cce038","shape":"rounded", "size":15} }},
        {"id": "4", "metadata": {"receivedPackets": 5, "position":{"x":0.5,"y":0.6}, "display":{"color":"#33aa88","shape":"rounded", "size":15} }},
        {"id": "5", "metadata": {"receivedPackets": 6, "status": "online", "position":{"x":-2.2,"y":1.8}, "display":{"color":"#880088","shape":"circle", "size":15} }}
      ],
    "edges":
      [
        {"id": "0", "source": "0", "target": "1", "metadata": {"losConfidence": 1000, "display":{"color":"red","weight":4} }},
        {"id": "1", "source": "4", "target": "5", "metadata": {"losConfidence": 400, "display":{"color":"red","weight":4} }},
        {"id": "2", "source": "5", "target": "3", "metadata": {"losConfidence": 1000, "display":{"color":"black","weight":4} }},
        {"source": "3", "target": "2", "metadata": {"losConfidence": 1000, "display":{"color":"gray","weight":6} }},
        {"source": "0", "target": "3", "metadata": {"losConfidence": 300, "display":{"color":"red","weight":4} }},
        {"source": "0", "target": "2", "metadata": {"losConfidence": 1000, "display":{"color":"orange","weight":2} }},
        {"source": "2", "target": "0", "metadata": {"losConfidence": 1000, "display":{"color":"orange","weight":3} }},
        {"source": "0", "target": "2", "metadata": {"losConfidence": 1000, "display":{"color":"orange","weight":2} }}
      ]
  }
  `;
  editable: boolean = true;
  createEdge: boolean = false;

  settings: EditorSettings = {
    editable: true,
    createEdge: false,
    coordinateTransformation: (x,y)=>{return {x,y}},
    defaultDisplaySettings: {
      nodeDisplaySettings: {
        color: "red",
        shape: "circle",
        size: 16
      },
      edgeDisplaySettings: {
        color: "black",
        size: 2
      }
    }
  }

  update() {
    this.settings = {...this.settings, editable: this.editable, createEdge: this.createEdge};
    this.graph = JSON.parse(this.input);
  }

  updateSettings() {
    this.settings = {...this.settings, editable: this.editable, createEdge: this.createEdge};
  }

  edgeChanged($event: EdgeChangeEvent) {
    console.log("Edge changed: ",$event);
  }

  edgeCreated($event: EdgeCreateEvent) {
    console.log("Edge created", $event);
  }

  onNodeChanged($event: NodeChangeEvent) {
    console.log("Node changed", $event);
  }
}
