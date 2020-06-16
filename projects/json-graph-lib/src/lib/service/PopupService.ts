import {Node,Edge} from "../model/JsonGraph";
import {PopupComponent} from '../popup/popup.component';
import {ApplicationRef, ComponentFactory, ComponentFactoryResolver, Injector} from '@angular/core';
import * as L from 'leaflet';


export class PopupService {
  private popupFactory: ComponentFactory<PopupComponent>;

  constructor(private resolver: ComponentFactoryResolver,
              private injector: Injector,
              private appRef: ApplicationRef,
              private editable: boolean
              ) {
    this.popupFactory = this.resolver.resolveComponentFactory(PopupComponent);
  }

  public createNodePopup(target:Node, onEdit: (n: Node) => void): L.Popup {
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
    return L.popup().setContent(popupComp.location.nativeElement);
  }

  public createEdgePopup(target:Edge, onEdit: (e: Edge) => void): L.Popup {
    let popupComp =  this.popupFactory.create(this.injector);
    this.appRef.attachView(popupComp.hostView);
    popupComp.onDestroy(() => {
      this.appRef.detachView(popupComp.hostView);
    });
    popupComp.instance.editable = this.editable;
    popupComp.instance.header = `Edge ${target.id ?? ''}`;
    popupComp.instance.subheader = `Node ${target.source} - Node${target.target}`;
    popupComp.instance.model = {content: target.metadata};
    popupComp.instance.modelChange.subscribe(data => {
      target.metadata = data;
      onEdit(target);
    });
    return L.popup().setContent(popupComp.location.nativeElement);
  }

  public enableDragging(popup: L.Popup, layer: L.Layer, map: L.Map): void {
    // Make popup draggable and focusable. This is only possible if popup._wrapper exists.
    // It is first available when the popup has been opened, so this configuration
    // is done once on the first opening.
    layer.once('popupopen', event => {
      // Make popup draggable
      const popupPosition = map.latLngToLayerPoint((popup as any)._latlng);
      L.DomUtil.setPosition((popup as any)._wrapper.parentNode, popupPosition);
      const draggablePopup = new L.Draggable((popup as any)._container, (popup as any)._wrapper);
      draggablePopup.enable();
      // Update popup position after drop to make it stay even after zooming or panning
      draggablePopup.on('dragend', event => {
        const newPopupPosition = L.DomUtil.getPosition((popup as any)._wrapper.parentNode);
        popup.setLatLng(map.layerPointToLatLng(newPopupPosition));
      });
      // Make popup focused on mousedown
      (popup as any)._wrapper.addEventListener('mousedown', event => popup.bringToFront());
    });
    // Always open popup at marker
    layer.on('click', (event: L.LeafletMouseEvent) => {
      popup.setLatLng(event.latlng);
    });
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
