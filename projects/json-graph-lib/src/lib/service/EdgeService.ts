import {Display, Edge, Node} from '../model/JsonGraph'
import * as L from "leaflet";
import '@elfalem/leaflet-curve'
import 'leaflet-arrowheads'
import {LatLng, latLng, Polyline} from "leaflet";
import {PopupService} from './PopupService';


export class EdgeService {
  private lines:Polyline[] = [];

  private createEdgeSelectedMarker:L.Marker = null;
  private createEdgeSelectedNode:Node = null;
  private readonly createEdgePreviewMouseMoveHandler: L.LeafletEventHandlerFn = null;
  private readonly createEdgePreview: L.Polyline = null;
  private snapCreateEdgePreviewToNode: boolean = false;

  constructor(private leaflet: L.Map,
              private coordinateTransformation: (x: number, y: number) => { x: number, y: number },
              private defaultDisplay: Display,
              private popupService: PopupService,
              private createEdge: boolean,
              private onEditEdge: (e: Edge) => void,
              private onCreateEdge: (e: Edge) => void
              ) {

    this.createEdgePreview = L.polyline([[0,0], [0,0]], {
      color: 'grey',
      weight: 8,
      opacity: 0.6,
      dashArray: '16, 16',
      dashOffset: '0',
      interactive: false
    });

    this.createEdgePreviewMouseMoveHandler = event => {
      if (this.createEdgeSelectedNode && !this.snapCreateEdgePreviewToNode) {
        this.createEdgePreview.setLatLngs([this.createEdgeSelectedMarker.getLatLng(), (event as any).latlng]);
        this.createEdgePreview.setStyle({dashArray: '16, 16'});
      }
    };
  }


  public setEdges(edges: Edge[], nodes:Node[], directional = false) {
    const edgeGroups = {};
    for (let e of edges) {
      const sorted = [e.source, e.target].sort();
      const edgeKey = sorted[0] +'-'+ sorted[1];
      const group = edgeGroups[edgeKey] ?? {key: edgeKey, edges:[]};
      edgeGroups[edgeKey] = group;
      group.edges.push(e);
    }
    for (let e of edges) {
      const sorted = [e.source, e.target].sort();
      const edgeKey = sorted[0] +'-'+ sorted[1];
      const group = edgeGroups[edgeKey];
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
      const edgeNumber = group.edges.indexOf(e)+1;
      let polyline;
      if(group.edges.length > 1){
        polyline = this.drawArcLib(startCoords,endCoords, edgeNumber, e.source < e.target,directional, {
            color: e.metadata?.display?.color ?? this.defaultDisplay.color,
            weight: e.metadata?.display?.weight ?? this.defaultDisplay.size
        });
      }else{
        polyline = L.polyline([latLng(startCoords.y, startCoords.x),
          latLng(endCoords.y, endCoords.x)],{
            color: e.metadata?.display?.color ?? this.defaultDisplay.color,
            weight: e.metadata?.display?.weight ?? this.defaultDisplay.size
        });
      }
      if(directional){
        this.addArrowheads(polyline);
      }

      if (!this.createEdge) {
        const popup = this.popupService.createEdgePopup(e, this.onEditEdge);
        polyline.bindPopup(popup, {autoClose: false, closeOnClick: false});
        this.popupService.enableDragging(popup, polyline, this.leaflet);
      }

      polyline.addTo(this.leaflet);
      this.lines.push(polyline);
    }
  }

  public clear() {
    this.lines.forEach(pl=> {
      pl.remove();
    });
    this.lines = [];

    this.createEdgeSelectedNode = null;
    this.createEdgeSelectedMarker = null;
    this.leaflet.off('mousemove', this.createEdgePreviewMouseMoveHandler);
    this.createEdgePreview.remove();
  }

  public enableEdgeCreationForNode(n: Node, m: L.Marker) {
    // Select, deselect node by clicking
    // Creating edge by clicking two different nodes after one another
    m.on('click', () => {
      if (this.createEdgeSelectedNode === null) {
        this.createEdgeSelectedNode = n;
        this.createEdgeSelectedMarker = m;
        this.leaflet.addLayer(this.createEdgePreview);
      } else {
        const sourceId = this.createEdgeSelectedNode.id;
        this.createEdgeSelectedNode = null;
        this.createEdgeSelectedMarker = null;
        this.createEdgePreview.setLatLngs([[0,0], [0,0]]);
        this.createEdgePreview.remove();

        if (this.createEdgeSelectedNode !== n) {
          const newEdge: Edge = {source: sourceId, target: n.id, metadata: {
              display: {
                color: this.defaultDisplay.color,
                weight: this.defaultDisplay.size
              }
            }};
          this.onCreateEdge(newEdge);
        }
      }
    });
  }

  public enableEdgeCreationPreviewSnapOnMarkerHover(m: L.Marker) {
    // Snap edge preview to node when hovering one if creating edge
    m.on('mouseover', () => {
      this.snapCreateEdgePreviewToNode = true;
      if (this.createEdgeSelectedMarker !== null) {
        this.createEdgePreview.setLatLngs([this.createEdgeSelectedMarker.getLatLng(), m.getLatLng()]);
        this.createEdgePreview.setStyle({dashArray: '6, 12'});
      }
    });
    m.on('mouseout', () => {
      this.snapCreateEdgePreviewToNode = false;
    });
  }

  public enableEdgeCreationPreview() {
    // Draw a preview starting from selected node to cursor while creating edge
    this.leaflet.on('mousemove', this.createEdgePreviewMouseMoveHandler);
  }

  private addArrowheads(line:Polyline){
   (line as any).arrowheads({size:'20px',frequency:'3'});
  }


  private drawArcLib(startCoords: {x: number, y: number}, endCoords: {x: number, y: number}, edgeNumber: number, reverse:boolean, directional:boolean ,options){
    let arcCenterX = (endCoords.x + startCoords.x)/2;
    let arcCenterY = (endCoords.y + startCoords.y)/2;
    let xDiff = (endCoords.x - startCoords.x);
    let yDiff = (endCoords.y - startCoords.y);
    let vectorLength = Math.sqrt(xDiff*xDiff + yDiff*yDiff);
    let normalX = xDiff/vectorLength;
    let normalY = yDiff/vectorLength;
    let sideStep = 0.3 * (Math.ceil(edgeNumber/2));
    if(edgeNumber % 2 == 0) sideStep*=-1;
    if(reverse) sideStep*=-1;
    let bX = arcCenterX + normalY*sideStep;
    let bY = arcCenterY - normalX*sideStep;
    let c =  (L as any).curve([
        'M',[startCoords.y,startCoords.x],
        'Q', [bY,bX], [endCoords.y,endCoords.x]
       ],
      options);

    if(!directional){
      // if not directional, and arrows are not needed, curve looks much better
      return c;
    }else{
      //trace only works if already added to a map
      c.addTo(this.leaflet);
      let traceArray = [];
      for(let d = 0; d <=1; d+=0.02){
        traceArray.push([d]);
      }
      let traced:LatLng[] = c.trace(traceArray);
      c.remove();
      traced = [latLng(startCoords.y, startCoords.x), ...traced];
      traced.push(latLng(endCoords.y, endCoords.x));
      return L.polyline(traced,options);
    }

  }

}
