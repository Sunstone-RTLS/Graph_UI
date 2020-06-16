import {Display} from './JsonGraph';

interface DisplaySettings {
  nodeDisplaySettings?:Display;
  edgeDisplaySettings?:Display;
}

export interface EditorSettings {
  editable: boolean;
  createEdge: boolean;
  coordinateTransformation?:(x:number, y:number)=>{x:number, y:number}; // default identity
  defaultDisplaySettings?:DisplaySettings;
}
