import {Display, Edge, Node} from '../model/JsonGraph'
import * as L from "leaflet";
import {DivIconOptions} from "leaflet";
import {PopupService} from './PopupService';
import {EdgeService} from './EdgeService';

export class NodeService {
  private addedMarkers:L.Marker[] = []

  constructor(private leaflet: L.Map,
              private coordinateTransformation:(x:number, y:number)=>{x:number, y:number},
              private defaultDisplay: Display,
              private popupService: PopupService,
              private edgeService: EdgeService,
              private createEdge: boolean,
              private onEditNode: (n: Node) => void
              ) {
  }


  public setNodes(nodes:Node[]){
    for(let n of nodes){
      let transformedPosition = this.coordinateTransformation(n.metadata.position.x,n.metadata.position.y);
      let icon = L.divIcon(this.createIconOptionsForDisplay(n.metadata?.display))
      const m = L.marker(L.latLng(transformedPosition.y, transformedPosition.x),{icon:icon});
      m.bindTooltip(n.id, {direction:"bottom", permanent: true, className: 'jge-tooltip'}).openTooltip();

      if (this.createEdge) {
        this.edgeService.enableEdgeCreationForNode(n, m);
        this.edgeService.enableEdgeCreationPreviewSnapOnMarkerHover(m);
      } else {
        const popup = this.popupService.createNodePopup(n, this.onEditNode);
        m.bindPopup(popup, {autoClose: false, closeOnClick: false});
        this.popupService.enableDragging(popup, m, this.leaflet);
      }

      m.addTo(this.leaflet);
      this.addedMarkers.push(m);
    }

    if (this.createEdge) {
      this.edgeService.enableEdgeCreationPreview();
    }
  }

  public clear(){
    this.addedMarkers.forEach(m=>{
      m.remove();
    });
    this.addedMarkers = [];
  }

  private createIconOptionsForDisplay(display?:Display): DivIconOptions {
    let shapeClass = '';
    let style = '';
    switch (display?.shape ?? this.defaultDisplay.shape) {
      case 'circle':
        shapeClass = 'jge-circle';
        break;
      case 'rounded':
        shapeClass = 'jge-rounded';
        break;
    }
    style = `background: ${display?.color ?? this.defaultDisplay.color};`;
    let size = display?.size ?? this.defaultDisplay.size;
    style +=  ` width: ${size}px; height: ${size}px`;

    return {
      html: `<div style="${style}" class="jge-icon ${shapeClass}"></div>`,
      className:'',
      iconSize: [size,size],
      iconAnchor: [size/2,size/2]
    }
  }
}
