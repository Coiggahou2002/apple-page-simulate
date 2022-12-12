const html = document.documentElement;

// 一个canvas搞定所有动画
const canvas = document.getElementById("scrollAnimation");
const context = canvas.getContext("2d");

const loader = new PxLoader();


function resizeCanvas(canvas) {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
}

// 窗口resize时需要重绘canvas
window.addEventListener("resize", () => {
  resizeCanvas(canvas);
  drawImgWhoFillsCanvas(canvas, allImgs[currentFrameIdx])
});


// 记录当前图片帧的编号，如果用户滚动到一半不滚动
// 而去缩放页面，保证重绘时画的是同一张图
let currentFrameIdx = 0;

// 即将切换到的帧号
// onscroll的回调负责更新这个值
// requestAnimationFrame的回调draw负责每次取这个值画图
let targetFrameIdx = 0;

const sections = [
  {
    id: 0,
    name: 'purple',
    frameCnt: 214,
    imgs: [],
    rawUrl: "https://www.apple.com/105/media/us/airpods-3rd-generation/2021/3c0b27aa-a5fe-4365-a9ae-83c28d10fa21/anim/spatial-audio/large/0001.jpg",
    // curFrameIdx: 0,
  },
  {
    id: 1,
    name: 'earphonebox',
    frameCnt: 54,
    imgs: [],
    rawUrl: "https://www.apple.com/105/media/us/airpods-3rd-generation/2021/3c0b27aa-a5fe-4365-a9ae-83c28d10fa21/anim/battery/large/0003.jpg",

    // curFrameIdx: 0,
  },
];

const allImgs = []

const getFrameImgUrl = (frameIdx, sectionIdx) => {
  let padIdx = frameIdx.toString().padStart(4, "0");
  let originUrl = sections[sectionIdx].rawUrl;
  let modifiedUrl =
    originUrl.substring(0, originUrl.lastIndexOf("/")) + `/${padIdx}.jpg`;
  return modifiedUrl;
};

function preloadFrameImgs(sectionIdx) {
  for (let i = 0; i <= sections[sectionIdx].frameCnt; i++) {
    sections[sectionIdx].imgs[i] = loader.addImage(getFrameImgUrl(i, sectionIdx));
  }
}

function preloadAllFrameImgs() {
  for (let i = 0; i < sections.length; i++) {
    preloadFrameImgs(i);
    allImgs.push(...sections[i].imgs);
  }
}


preloadAllFrameImgs();

// 加载完所有图片时的回调，初始化canvas，画第一张图片
loader.addCompletionListener(function () {
  document.body.classList.add("loaded");
  resizeCanvas(canvas);
  window.requestAnimationFrame(drawOnCanvas)
});


function drawOnCanvas() {
  changeFrameTo(targetFrameIdx);
  window.requestAnimationFrame(drawOnCanvas);
}

loader.start();

// 将图片img以全填充方式画到canvas上
function drawImgWhoFillsCanvas(canvas, img) {
  if (!canvas) {
    console.error('invalid argument canvas')
    return;
  }
  if (!img || !canvas) {
    console.error('invalid argument img')
    return;
  }

  let [hRatio, wRatio] = [canvas.height / img.height, canvas.width / img.width];
  let ratio = Math.max(hRatio, wRatio);
  canvas
    .getContext("2d")
    .drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      0,
      0,
      img.width * ratio,
      img.height * ratio
    );
}

function changeFrameTo(frameIdx) {
  let idx = frameIdx - 1;

  // 边界防跨越
  if (idx < 0) index = 0;
  if (idx > allImgs.length) idx = allImgs.length-1;

  drawImgWhoFillsCanvas(canvas, allImgs[idx]);
  currentFrameIdx = idx;
}


// 利用闭包存上次滚动距离，方便滚动事件中计算滚动方向
let lastScrollTop = 0;

/**
 * 根据滚动距离计算某个块应该渲染的图片帧编号
 * @param frameObj
 * @param el 包裹canvas块的元素
 * @param scrollTop
 * @returns 
 */
function calcTargetFrameIndex(el, scrollTop) {

  // el.offsetHeight: 元素的高度
  // 分子加上 el.offsetHeight/2 是为了抵消中心偏差
  // 结果：scrolled: [0, 1] 之间的百分比数字，用于计算目标图片帧的编号

  // 百分比算法一
  // let scrolledPercent = (scrollTop + el.offsetHeight/2) / el.offsetHeight;

  // 百分比算法二
  let scrolledPercent = (scrollTop) / (html.scrollHeight - html.clientHeight);

  scrolledPercent = Math.min(scrolledPercent, 1);
  let frameIdxByPercent = Math.ceil(scrolledPercent * allImgs.length);

  // let frameIdxNext = Math.min(currentFrameIdx + 1, allImgs.length);
  // return Math.min(frameIdxByPercent, frameIdxNext);

  return frameIdxByPercent;
}


// 不应该把draw回调放在scroll事件回调
// 应该放在requestAnimationFrame里，也就是浏览器重绘的钩子里
window.addEventListener("scroll", (e) => {
  // scrollTop: 滚动条纵坐标距离整个网页最顶部的距离
  const scrollTop = html.scrollTop;

  let blk = document.getElementById("sticky-block");

  targetFrameIdx = calcTargetFrameIndex(blk, scrollTop);
  console.log(`targetFrameIdx = ${targetFrameIdx}`)

  // let opacity = scrolled;

  // changeFrameTo(targetFrameIdx);

  // 向下滚动
  // if (scrollTop > lastScrollTop) {
  //   if (targetFrameIdx >= allImgs.length) {
  //     canvas.style.visibility = "hidden";
  //   } else {
  //     changeFrameTo(targetFrameIdx);
  //   }
  // }
  // // 向上滚动
  // else {
  //   if (targetFrameIdx <= 0) {
  //   } else if (targetFrameIdx >= allImgs.length) {
  //     canvas.style.visibility = "visible";
  //     changeFrameTo(targetFrameIdx);
  //   } else {
  //     // document.getElementById("remaster").style.opacity = opacity;
  //   }
  // }

  lastScrollTop = scrollTop;
});
