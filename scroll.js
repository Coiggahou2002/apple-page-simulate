const html = document.documentElement;

const canvas = document.getElementById("scrollAnimation");
const context = canvas.getContext("2d");

// how many frames
const frameCount = 214;

let currentFrameIdx = 0;

window.addEventListener("resize", () => {
  resizeCanvas();
});

const getFrameImgUrl = (index) =>
  `https://www.apple.com/105/media/us/airpods-3rd-generation/2021/3c0b27aa-a5fe-4365-a9ae-83c28d10fa21/anim/spatial-audio/large/${index
    .toString()
    .padStart(4, "0")}.jpg`;

const loader = new PxLoader();
const imgs = [];


function preloadAllFrameImgs() {
  for (let i = 0; i <= frameCount; i++) {
    imgs[i] = loader.addImage(getFrameImgUrl(i));
  }
}

preloadAllFrameImgs();

loader.addCompletionListener(function () {
  document.body.classList.add("loaded");
  resizeCanvas();
  drawImgWhoFillsCanvas(canvas, imgs[0]);
});

loader.start();

function drawImgWhoFillsCanvas(canvas, img) {
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
  if (idx < 0) index = 0;
  if (idx > frameCount) idx = frameCount;
  drawImgWhoFillsCanvas(canvas, imgs[idx]);
  currentFrameIdx = frameIdx;
}

function resizeCanvas() {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  drawImgWhoFillsCanvas(canvas, imgs[currentFrameIdx]);

}

window.addEventListener("scroll", (e) => {
  console.log(e);

  // how far the user has scrolled
  const scrollTop = html.scrollTop;
  const scrollHeight = html.scrollHeight;
  const clientHeight = html.clientHeight;
  let scrolled = scrollTop / (scrollHeight - clientHeight);

  let targetFrameIdx = Math.ceil(scrolled * frameCount);

  changeFrameTo(targetFrameIdx);
});
