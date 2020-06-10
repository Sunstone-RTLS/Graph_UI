export interface EditorSettings {
  editable: boolean;
  coordinateTransformation?:(x:number, y:number)=>{x:number, y:number};
  showNodeLabels:boolean;
}
