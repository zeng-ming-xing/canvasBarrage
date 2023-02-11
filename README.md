# 基于vue2的纯canvas弹幕

<br/>

## 功能

|规定行数|
|:--:|
|规定每行的速度|
|无限滚动|
|默认为边框背景|
|背景自适应文字宽度|


<br/>

## 使用

```
npm install z-canvas-barrage
```

```
import CanvasBarrage from 'z-canvas-barrage'
```

```
    // 行数
    lineNum: {
      type: Number,
      default: 4,
    },
    // 每一行的距离
    lineSpace: {
      type: Number,
      default: 30,
    },
    // 数据
    parentList: {
      type: Array,
      default: () => [],
    },
    //每一行速度
    customSpeed:{
      type:Array,
      default: null
    }
```


