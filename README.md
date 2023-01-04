# 仿苹果官网滚动视频帧特效

[苹果官网特效页](https://www.apple.com/airpods-3rd-generation/) | [模仿的 Demo](https://coiggahou2002.github.io/apple-page-simulate)

本仓库主要是对 [AirPods (3rd generation)](https://www.apple.com/airpods-3rd-generation/) 的滚动特效进行模仿

## 原理

上述苹果官方页面之所以会随着鼠标滚动呈现很沉浸式的交互效果，背后是苹果把一个视频截取成了 100 ~ 200 张不等的图片

然后监听鼠标滚动事件 `onscroll`，根据 `部分滚动距离 / 可滚动总距离` 计算出一个滚动进度百分比 `k`

然后计算 `k * 图片总张数` 得到应该渲染哪一帧的图片，然后在页面的 canvas 中渲染这一张图片

- 当我们滚轮向下滚动时，`k` 一直在增加，所以图片一直在往前进，比如说从第 `002.jpg` 一直往前更换渲染到 `112.jpg`
- 当我们滚动向上滚动时（也就是往回走），`k` 一直在减小，所以图片一直往后退，比如说从第 `201.jpg` 一直往前更换渲染到 `56.jpg`

这样一来，就能实现 `画面进度跟随滚轮控制` 的效果

这个交互效果确实非常妙，如果要落地，有以下几个要点:

1. 设计要做出合适的视频，然后将视频切成几百帧的图片，工作量大，成本高
2. 前端要关心的是: 在什么时机将这些图片异步加载进来，然后在滚动事件监听器中计算滚动百分比，得到图片的渲染帧号序列，用 canvas 的 `drawImage()` 方法画图
3. 还有就是前端和设计需要合力保证切出来的几百张图片的大小合适，估计每张是不能超过 30 kB 的，否则太多的话，客户端没法短时间下载完成，效果就出不来了