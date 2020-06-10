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
import {Edge, JsonGraph, Node} from "../model/JsonGraph";
import {EdgeChangeEvent, NodeChangeEvent} from "../model/EditorEvents";
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

  graph:JsonGraph;
  options = {
    // layers: [
    //   tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    // ],
    zoom: 10,
    center: latLng(0.0, 0.0)
  }
  leaflet?: LeafletMap;
  popupService: PopupService;
  nodeService: NodeService;
  edgeService:EdgeService;

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
    this.popupService = new PopupService(this.resolver, this.injector, this.appRef, this.editorSettings.editable);
    this.nodeService = new NodeService(this.leaflet,this.editorSettings.coordinateTransformation,this.popupService);
    this.edgeService = new EdgeService(this.leaflet,this.editorSettings.coordinateTransformation,this.popupService);
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
    this.nodeService.clear();
    this.nodeService.setNodes(this.graph.nodes, (node: Node) => this.onEditNode(node));
    this.edgeService.clear();
    this.edgeService.setEdges(this.graph.edges, this.graph.nodes, this.graph.directed, (edge: Edge) => this.onEditEdge(edge));
  }

  onEditNode(updatedNode: Node) {
    const nodeIndex = this.graph.nodes.findIndex(node => node.id === updatedNode.id);
    const originalNode = this.originalGraph.nodes[nodeIndex];
    this.graph.nodes[nodeIndex] = updatedNode;

    this.onNodeChanged.emit({old: originalNode, updated: updatedNode, updatedGraph: this.graph});
    this.reloadGraph();
  }

  onEditEdge(updatedEdge: Edge) {
    const edgeIndex = this.graph.edges.findIndex(edge => edge.source === updatedEdge.source && edge.target === updatedEdge.target);
    const originalEdge = this.originalGraph.edges[edgeIndex];
    this.graph.edges[edgeIndex] = updatedEdge;

    this.onEdgeChanged.emit({old: originalEdge, updated: updatedEdge, updatedGraph: this.graph});
    this.reloadGraph();
  }

}
