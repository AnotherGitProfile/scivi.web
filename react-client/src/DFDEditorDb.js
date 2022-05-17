import Rete from "rete";

export class DFDEditorDb {
  constructor() {
    this.socketTypes = new Map();
    this.components = new Map();
  }

  /**
   * @param {string} name
   * @returns {import('rete').Socket}
   */
  buildOrCreateSocketType(name) {
    if (!this.socketTypes.has(name)) {
      const socket = new Rete.Socket(name);
      this.socketTypes.set(name, socket);
    }
    return this.socketTypes.get(name);
  }

  addComponent(component) {
    this.components.set(component.name, component);
  }

  getComponent(name) {
    return this.components.get(name);
  }

  getAllComponents() {
    return Array.from(this.components.values());
  }
}
