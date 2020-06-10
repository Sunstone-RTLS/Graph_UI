import {Display, Edge, Node} from '../model/JsonGraph'
import * as L from "leaflet";
import 'leaflet-arrowheads'
import {DivIconOptions, latLng, Polyline} from "leaflet";
import {PopupService} from './PopupService';

export class EdgeService {
  private lines:Polyline[] = [];
  constructor(private leaflet: L.Map,
              private coordinateTransformation: (x: number, y: number) => { x: number, y: number },
              private popupService: PopupService
              ) {
  }


  public setEdges(edges: Edge[], nodes:Node[], directional = false, onEdit: (e: Edge) => void) {
    for (let e of edges) {
      console.log("Adding edge ", e);
      let nodeStart = nodes.find(n=>n.id === e.source);
      let nodeEnd = nodes.find(n=>n.id === e.target);
      if(!nodeStart){
        console.error("No start node found for edge",e);
        continue;
      }
      if(!nodeEnd){
        console.error("No end node found for edge",e);
        continue;
      }
      const startCoords = this.coordinateTransformation(nodeStart.metadata.position.x, nodeStart.metadata.position.y);
      const endCoords = this.coordinateTransformation(nodeEnd.metadata.position.x, nodeEnd.metadata.position.y);
      const polyline = L.polyline([latLng(startCoords.x,startCoords.y),
        latLng(endCoords.x, endCoords.y)],{
          color: e.metadata?.display?.color ?? 'black',
          weight: e.metadata?.display?.weight ?? 2
      });
      if(directional){
        this.addArrowheads(polyline);
      }
      polyline.addTo(this.leaflet);
      this.lines.push(polyline);
      polyline.bindPopup(this.popupService.createEdgePopup(e, onEdit), {
        autoClose: false, closeOnClick: false
      });
    }
  }

  public clear() {
    this.lines.forEach(pl=>pl.remove());
    this.lines = [];
  }

  private addArrowheads(line:Polyline){
    (line as any).arrowheads({size:'20px',frequency:'3'});
  }
}
