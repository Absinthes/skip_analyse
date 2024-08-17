// @ts-ignore
type Func<T = any[], R = any> = (...args: T) => R;

export class EventEmitter {
  eventMap: Map<string, Set<Func>>;

  constructor() {
    this.eventMap = new Map();
  }

  on(name: string, cb: Func) {
    let funcSet = this.eventMap.get(name);
    if (!funcSet) this.eventMap.set(name, (funcSet = new Set()));
    funcSet.add(cb);
    return () => {
      this.off(name, cb);
    };
  }

  off(name: string, cb?: Func) {
    if (!cb) {
      this.eventMap.delete(name);
      return;
    }
    let cbSet = this.eventMap.get(name);
    if (!cbSet) return;
    cbSet.delete(cb);
  }

  trigger(name: string, ...rest: any[]) {
    const queue = this.eventMap.get(name);
    if (!queue) return;
    for (let cb of queue) {
      cb.apply(null, rest);
    }
  }
}
