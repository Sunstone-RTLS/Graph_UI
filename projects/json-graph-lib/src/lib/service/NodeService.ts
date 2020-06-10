import {Display, Node} from '../model/JsonGraph'
import * as L from "leaflet";
import {DivIconOptions} from "leaflet";
import {style} from "@angular/animations";
// import {latLng, Map as LeafletMap, Marker, marker, BeautifyIcon, icon} from "leaflet";
import {PopupService} from './PopupService';

export class NodeService {
  private addedMarkers:L.Marker[] = []
  constructor(private leaflet: L.Map,
              private coordinateTransformation:(x:number, y:number)=>{x:number, y:number},
              private popupService: PopupService
              ) {
  }


  public setNodes(nodes:Node[], onEdit: (n: Node) => void){
    for(let n of nodes){
      let transformedPosition = this.coordinateTransformation(n.metadata.position.x,n.metadata.position.y);
      let icon = L.divIcon(this.createIconOptionsForDisplay(n.metadata?.display))
      const m = L.marker(L.latLng(transformedPosition.x,transformedPosition.y),{icon:icon});
      m.bindTooltip(n.id, {direction:"bottom", permanent: true, className: 'jge-tooltip'}).openTooltip();
      m.addTo(this.leaflet);
      this.addedMarkers.push(m);
      m.bindPopup(this.popupService.createNodePopup(n, onEdit), {
        autoClose: false, closeOnClick: false
      });
    }
  }

  public clear(){
    this.addedMarkers.forEach(m=>{
      m.remove();
    });
    this.addedMarkers = [];
  }

  private createIconOptionsForDisplay(display:Display):DivIconOptions{
    if(display){
      let shapeClass = '';
      let style = '';
      switch(display.shape){
        case 'circle':
          shapeClass = 'jge-circle';
          break;
        case 'rounded':
          shapeClass = 'jge-rounded'
          break;
      }
      if(display.color){
          style = `background: ${display.color};`;
      }else{
        style = 'background: red;';
      }
      let size = display.size ?? 16;
      style +=  ` width: ${size}px; height: ${size}px`;

      return {
        html: `<div style="${style}" class="jge-icon  ${shapeClass}"></div>`,
        className:'',
        iconSize: [size,size],
        iconAnchor: [size/2,size/2]
      }
    }
    return {
      html: '<div class="jge-icon jge-circle" style="width:16px; height:16px"></div>',
      className:'',
      iconSize: [16,16],
      iconAnchor: [8,8]
    }
  }
}
