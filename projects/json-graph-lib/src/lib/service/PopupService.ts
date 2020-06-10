import {Node,Edge} from "../model/JsonGraph";
import {PopupComponent} from '../popup/popup.component';
import {ApplicationRef, ComponentFactory, ComponentFactoryResolver, Injector} from '@angular/core';


export class PopupService {
  private popupFactory: ComponentFactory<PopupComponent>;

  constructor(private resolver: ComponentFactoryResolver,
              private injector: Injector,
              private appRef: ApplicationRef,
              private editable: boolean
              ) {
    this.popupFactory = this.resolver.resolveComponentFactory(PopupComponent);
  }

  public createNodePopup(target:Node, onEdit: (n: Node) => void):string {
    let popupComp =  this.popupFactory.create(this.injector);
    this.appRef.attachView(popupComp.hostView);
    popupComp.onDestroy(() => {
      this.appRef.detachView(popupComp.hostView);
    });
    popupComp.instance.editable = this.editable;
    popupComp.instance.header = `Node ${target.id}`;
    popupComp.instance.model = {content: target.metadata};
    popupComp.instance.modelChange.subscribe(data => {
      target.metadata = data;
      onEdit(target);
    });
    return popupComp.location.nativeElement;
  }

  public createEdgePopup(target:Edge, onEdit: (e: Edge) => void):string {
    let popupComp =  this.popupFactory.create(this.injector);
    this.appRef.attachView(popupComp.hostView);
    popupComp.onDestroy(() => {
      this.appRef.detachView(popupComp.hostView);
    });
    popupComp.instance.editable = this.editable;
    popupComp.instance.header = `Edge ${target.source}-${target.target}`;
    popupComp.instance.model = {content: target.metadata};
    popupComp.instance.modelChange.subscribe(data => {
      target.metadata = data;
      onEdit(data);
    });
    return popupComp.location.nativeElement;
  }

  private objectToHTML(o: object): string {
    let result = '';
    for (const [key, value] of Object.entries(o)) {
      if (typeof value === 'object' && value !== null) {
        result +=
          `<div><strong>${key}</strong></div>` +
          this.objectToHTML(value) +
          `<br>`;
      } else if (o !== undefined) {
        result += `<div>${key}: ${value}</div>`;
      }
    }
    return result;
  }
}
