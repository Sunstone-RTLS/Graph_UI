import * as L from 'leaflet';

declare module 'leaflet' {

  namespace BeautifyIcon {

    interface BeautifyIconIconOptions extends BaseIconOptions {
      icon?:string,
      iconSize?:any,
      iconAnchor?:any,
      iconShape?:string,
      iconStyle?:string,
      innerIconAnchor?:any,
      innerIconStyle?:string,
      isAlphaNumericIcon?:boolean,
      text?:string,
      borderColor?:string,
      borderWidth?:Number,
      borderStyle?:string,
      backgroundColor?:string,
      textColor?:string,
      customClasses?:string,
      spin?:boolean,
      prefix?:string,
      html?:string
    }

    function icon(options: BeautifyIconIconOptions): Icon;

    class Icon extends L.Icon<BeautifyIconIconOptions> {
      constructor(options?: BeautifyIconIconOptions);
    }
  }

}
