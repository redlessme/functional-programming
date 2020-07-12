/** 
 * a little wrapper for creating SVG elements and getting/setting their attributes
 * and observing their events.
 * inspired by d3.js (http://d3js.org)
 */
class Elem {
  elem: Element;

  /**
   * @param svg is the parent SVG object that will host the new element
   * @param tag could be "rect", "line", "ellipse", etc.
   */
  constructor(svg: HTMLElement, tag: string) {
    this.elem = document.createElementNS(svg.namespaceURI, tag);
    svg.appendChild(this.elem);
  }

  /**
   * all purpose attribute getter/setter
   * @param name attribute name
   * @param value value to assign to the attribute
   * @returns called with just the name of the attribute it returns the attribute's current value as a string, called with the name and a new value it sets the attribute and returns this object
   * so subsequent calls can be chained
   */
  attr(name: string): string 
  attr(name: string, value: string | number): this
  attr(name: string, value?: string | number): this | string {
    if (typeof value === 'undefined') {
      return this.elem.getAttribute(name)!;
    }
    this.elem.setAttribute(name, value.toString());
    return this;
  }
  /**
   * @returns an Observable for the specified event on this element
   */
  observe<T extends Event>(event: string): Observable<T> {
    return Observable.fromEvent<T>(this.elem, event);
  }
}