import {
  ApplicationRef,
  Component,
  ComponentFactoryResolver, EventEmitter,
  Injector,
  Input,
  OnInit, Output,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import {Display, Edge, JsonGraph, Node} from "../model/JsonGraph";
import {EdgeChangeEvent, NodeChangeEvent, EdgeCreateEvent} from "../model/EditorEvents";
import {EditorSettings} from "../model/EditorSettings";
import {latLng, tileLayer, Map as LeafletMap} from "leaflet";
import {NodeService} from "../service/NodeService";
import {EdgeService} from "../service/EdgeService";
import {PopupService} from '../service/PopupService';

@Component({
  selector: 'jge-json-graph-editor',
  templateUrl: './json-graph-editor.component.html',
  styleUrls: ['./json-graph-editor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class JsonGraphEditorComponent implements OnInit {

  @Input('graph') originalGraph:JsonGraph;
  @Input() editorSettings:EditorSettings;
  @Output() onNodeChanged = new EventEmitter<NodeChangeEvent>();
  @Output() onEdgeChanged = new EventEmitter<EdgeChangeEvent>();
  @Output() onEdgeCreated = new EventEmitter<EdgeCreateEvent>()

  graph:JsonGraph;
  options = {
    zoom: 8,
    center: latLng(0.0, 0.0)
  }
  leaflet?: LeafletMap;
  popupService: PopupService;
  nodeService: NodeService;
  edgeService:EdgeService;
  identityTransformation:(x:number, y:number)=>{x:number, y:number} = (x,y)=>{return{x,y}};
  mediumBlackCircleNodeDisplay:Display = {
    color: 'blue',
    size: 16,
    shape: 'circle'
  }
  thinBlackEdgeDisplay:Display = {
    color: 'black',
    size: 2
  }

  constructor(private resolver: ComponentFactoryResolver, private injector: Injector, private appRef: ApplicationRef) { }

  ngOnInit(): void {
    // Copy graph for editing
    this.graph = this.copyGraph(this.originalGraph);
  }

  copyGraph(graph: JsonGraph): JsonGraph {
    // Deep copy original graph
    return JSON.parse(JSON.stringify(graph));
  }

  initializeServices(): void {
    let transformation = this.editorSettings.coordinateTransformation ?? this.identityTransformation;
    let defaultNodeDisplay = this.editorSettings.defaultDisplaySettings?.nodeDisplaySettings ?? this.mediumBlackCircleNodeDisplay;
    let defaultEdgeDisplay = this.editorSettings.defaultDisplaySettings?.edgeDisplaySettings ?? this.thinBlackEdgeDisplay;

    this.popupService = new PopupService(this.resolver, this.injector, this.appRef, this.editorSettings.editable);
    this.edgeService = new EdgeService(this.leaflet,transformation,defaultEdgeDisplay,
      this.popupService,
      this.editorSettings.createEdge,
      edge => this.onEditEdge(edge), edge => this.onCreateEdge(edge));
    this.nodeService = new NodeService(this.leaflet,transformation,defaultNodeDisplay,
      this.popupService,this.edgeService,
      this.editorSettings.createEdge,
      node => this.onEditNode(node));
  }

  onMapReady(map: LeafletMap) {
    console.log("Map ready");
    this.leaflet = map;
    this.initializeServices()
    this.reloadGraph()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.leaflet && (changes.originalGraph || changes.editorSettings)) {
      if (changes.originalGraph) {
        this.graph = this.copyGraph(this.originalGraph);
      }
      if (changes.editorSettings) {
        this.nodeService.clear();
        this.edgeService.clear();
        this.initializeServices();
      }
      this.reloadGraph();
    }
  }

  reloadGraph() {
    // First clear services then set them, because they modify each other's state during the setting process
    this.nodeService.clear();
    this.edgeService.clear();
    this.nodeService.setNodes(this.graph.nodes);
    this.edgeService.setEdges(this.graph.edges, this.graph.nodes, this.graph.directed);
  }

  onEditNode(updatedNode: Node) {
    const nodeIndex = this.graph.nodes.indexOf(updatedNode);
    const originalNode = this.originalGraph.nodes[nodeIndex];
    this.onNodeChanged.emit({old: originalNode, updated: updatedNode, updatedGraph: this.graph});
    this.reloadGraph();
  }

  onEditEdge(updatedEdge: Edge) {
    const edgeIndex = this.graph.edges.indexOf(updatedEdge);
    const originalEdge = this.originalGraph.edges[edgeIndex];
    this.onEdgeChanged.emit({old: originalEdge, updated: updatedEdge, updatedGraph: this.graph});
    this.reloadGraph();
  }

  onCreateEdge(createdEdge: Edge) {
    let alreadyExists = false;
    if (!this.graph.multiEdge) {
      const edgeIndex = this.graph.edges.findIndex(
        edge => edge.source === createdEdge.source && edge.target === createdEdge.target);
      if (this.graph.directed) {
        alreadyExists = edgeIndex > -1;
      } else {
        const flippedEdgeIndex = this.graph.edges.findIndex(
          edge => edge.source === createdEdge.target && edge.target === createdEdge.source);
        alreadyExists = edgeIndex > -1 || flippedEdgeIndex > -1;
      }
    }
    if (alreadyExists) return;

    this.graph.edges.push(createdEdge);

    this.onEdgeCreated.emit({created: createdEdge, updatedGraph: this.graph});
    this.reloadGraph();
  }

}
