# JsonGraphEditor

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.5.

This is a wrapper project for development/testing. 
The json graph editor library is found under `./projects/json-graph-lib` 

## Usage

Include in your component and supply the graph and settings. 
You may listen to edit events if the graph is editable.
```angular2html
<jge-json-graph-editor [graph]="graph" 
                       [editorSettings]="settings"
                       (onEdgeChanged)="edgeChanged($event)"
                       (onEdgeCreated)="edgeCreated($event)"
                       (onNodeChanged)="onNodeChanged($event)">
</jge-json-graph-editor>
```

## Events

### Node changed

Called when one of the properties of a node has changed from the editor.

```javascript
{
 old: Node;              // the old state of the node
 updated: Node;          // the new updated state of the node
 updatedGraph:JsonGraph; // the whole updated graph, as displayed in the editor
}
```

### Edge changed

Called when one of the properties of an edge has changed from the editor.

```javascript
{
 old: Edge;              // the old state of the edge
 updated: Edge;          // the new updated state of the edge
 updatedGraph:JsonGraph; // the whole updated graph, as displayed in the editor
}
```

### Edge created

Called when one of the properties of an edge has changed from the editor.

```javascript
{
 created: Edge;          // the ly created edge
 updatedGraph:JsonGraph; // the whole updated graph, as displayed in the editor
}
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
