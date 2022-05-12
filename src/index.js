// https://github.com/yyx990803/vue-lit/blob/master/index.js

import { render } from "lit-html";
import { shallowReactive, effect } from "@vue/reactivity";

let currentInstance;
export function defineComponent(factory) {
  return function (node) {
    // @antv/x6/src/graph/hook.ts  getHTMLComponent FunctionExt.call(ret, this.graph, node)
    // 最终这个函数拿到的this实际上是graph
    const self = node;
    const props = (self._props = shallowReactive({
      node,
      data: node.getData() || {}
    }));
    currentInstance = self;
    // 这里还是将graph作为this传进去
    const template = factory.call(this, props);
    currentInstance = null;
    self._bm && self._bm.forEach((cb) => cb());
    self._root = self._root || document.createElement("div");
    let isMounted = false;
    effect(() => {
      if (isMounted) {
        self._bu && self._bu.forEach((cb) => cb());
      }
      render(template(), self._root);
      if (isMounted) {
        self._u && self._u.forEach((cb) => cb());
      } else {
        isMounted = true;
      }
    });
    // 返回后立马会挂载到节点上面，就立马执行onMounted
    requestAnimationFrame(() => {
      self._m && self._m.forEach((cb) => cb());
    });
    node.on("removed", () => {
      self._um && self._um.forEach((cb) => cb());
    });
    node.on("change:data", ({ current, previous, options }) => {
      props["data"] = current;
      props["options"] = options;
    });
    return self._root;
  };
}

function createLifecycleMethod(name) {
  return (cb) => {
    if (currentInstance) {
      (currentInstance[name] || (currentInstance[name] = [])).push(cb);
    }
  };
}

export const onBeforeMount = createLifecycleMethod("_bm");
export const onMounted = createLifecycleMethod("_m");
export const onBeforeUpdate = createLifecycleMethod("_bu");
export const onUpdated = createLifecycleMethod("_u");
export const onUnmounted = createLifecycleMethod("_um");

export * from "lit-html";
export * from "@vue/reactivity";

