export interface JsonGraph {
  directed:boolean;
  multiEdge:boolean;
  nodes:Node[];
  edges:Edge[];
}

export interface Node {
  id:string;
  metadata: Metadata&any;
}

export interface Edge {
  id?:string;
  source:string;
  target:string;
  metadata: Metadata&any;
}

export interface Metadata{
  position?:{x:number, y:number};
  display?:Display;
}

export interface Display {
  color?:string;
  shape?:string;
  size?:number;
}
