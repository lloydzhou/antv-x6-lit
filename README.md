# antv-x6-lit

参照[@vue/lit](https://www.npmjs.com/package/@vue/lit)写了一个可以在[@antv/x6](https://www.npmjs.com/package/@antv/x6)中作为HTML节点使用的组件

考虑到每一个节点本身并不复杂，所以使用一个非常轻量化的方案。
每一个组件设计参照@vue/lit，API与[Vue Composition API](https://vuejs.org/api/composition-api-setup.html#basic-usage)基本一致。


# demo

这里有一个在线的[DEMO](https://codesandbox.io/s/antv-x6-lit-html-node-ps1cem?file=/src/app.tsx)
模拟了onBeforeMount/onMounted/onBeforeUpdate/onUpdated/onUnmounted整个生命周期


## 定义一个组件
```
import {
  defineComponent,
  onMounted,
  onUnmounted,
  onBeforeMount,
  onBeforeUpdate,
  onUpdated,
  html,
  reactive
} from "antv-x6-lit";

const component = defineComponent((props: any) => {
  const state = reactive({ count: 0 });
  onMounted(() => {
    const { graph, node, data } = props
    console.log("onMounted", graph, node, data);
    state.count++;
  });
  onBeforeMount(() => {
    console.log("onBeforeMount");
    state.count++;
  });
  onBeforeUpdate(() => {
    console.log("onBeforeUpdate");
  });
  onUpdated(() => {
    console.log("onUpdated");
  });
  onUnmounted(() => {
    console.log("onUnmounted");
  });
  return () => html`<div>Hello ${state.count} ${props.data.time}!</div>`;
});
```

## 注册组件
```
Graph.registerNode(
  "lit-html",
  {
    inherit: "html",
    width: 300,
    height: 40,
    html: component
  },
  true
);
```

## 向画布添加组件
```
const target = graph.addNode({
  x: 180,
  y: 160,
  width: 100,
  height: 40,
  data: {
    time: new Date().toString()
  },
  shape: "lit-html",
});
```

## 更新组件
```
const interval = setInterval(() => {
  // 更新组件data数据
  target.setData({ time: new Date().toString()})
}, 4000)
setTimeout(() => {
  clearInterval(interval)
  // 移除组件，触发组件onUnmounted事件
  graph.removeCells([target], true)
}, 10000)
```





