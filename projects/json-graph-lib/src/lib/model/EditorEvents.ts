import {Edge, JsonGraph, Node} from './JsonGraph';

export interface NodeChangeEvent {
  old: Node;
  updated: Node;
  updatedGraph: JsonGraph;
}

export interface EdgeChangeEvent {
  old: Edge;
  updated: Edge;
  updatedGraph: JsonGraph;
}
