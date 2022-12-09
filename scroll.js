const html = document.documentElement;

const canvas = document.getElementById("scrollAnimation")

// drawing context
const context = canvas.getContext("2d")

const copy = document.getElementById("copyExample")



// ?
const frameCount = 214 

// canvas.height = document.body.clientHeight
// canvas.width = document.body.clientWidth

window.addEventListener('resize', () => {
  // canvas.height = document.body.clientHeight
  canvas.height = window.innerHeight
  // canvas.width = document.body.clientWidth
  canvas.width = window.innerWidth
})


const getFrame = index => (
  // `https://www.apple.com/105/media/us/airpods-pro/2019/1299e2f5_9206_4470_b28e_08307a42f19b/anim/sequence/large/01-hero-lightpass/${index.toString().padStart(4, '0')}.jpg`
  `https://www.apple.com/105/media/us/airpods-3rd-generation/2021/3c0b27aa-a5fe-4365-a9ae-83c28d10fa21/anim/spatial-audio/large/${index.toString().padStart(4, '0')}.jpg`
)



const loader = new PxLoader();
const imgs = []


for (let i = 0; i <= frameCount; i++) {
  imgs[i] = loader.addImage(getFrame(i))
}1


loader.addCompletionListener(function() {
  document.body.classList.add('loaded')
  context.drawImage(imgs[0], 0, 0)
})

loader.start();

function changeFrame(frameIdx) {
  let idx = frameIdx - 1;
  if (idx < 0) index = 0;
  if (idx > frameCount) idx = frameCount;
  const img = imgs[idx]
  let [hRatio, wRatio] = [canvas.height / img.height, canvas.width / img.width]
  let ratio = Math.max(hRatio, wRatio)
  context.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width*ratio, img.height*ratio)

}

window.addEventListener('scroll', (e) => {
  // how far the user has scrolled
  console.log(e)

  const scrollTop = html.scrollTop;
  const scrollHeight = html.scrollHeight;
  const clientHeight = html.clientHeight;
  let scrolled = scrollTop / (scrollHeight - clientHeight);

  let frame = Math.ceil(scrolled * frameCount);

  changeFrame(frame)

})