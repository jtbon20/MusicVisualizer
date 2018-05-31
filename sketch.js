/* eslint no-unused-vars: 0 no-undef:0 */

/*
  Based on examples from: https://p5js.org/
 */

let mic, soundFile, fft;
const smoothing = 0.93;
const binCount = 256;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();

  // Create an Audio input
  mic = new p5.AudioIn();
  mic.start();

  // initialize the FFT, plug in our variables for smoothing and binCount
  fft = new p5.FFT(smoothing, binCount);
  fft.setInput(mic);
}

function draw() {
  // returns an array with [binCount] amplitude readings from lowest to highest frequencies
  const spectrum = fft.analyze(binCount);
  // background(spectrum[0],spectrum[0],spectrum[0]);
  background(255);
  // background(map(spectrum[0], 0, 255, 240, 0));

  for (let j = 0; j < 20; j += 1) {
    push();
    for (let i = 0; i < 90; i += 1) {
      const thisLevel = map(spectrum[2 * i], 0, 255, -1, 1);
      const thisLevel2 = map(spectrum[0], 0, 255, -1, 1);
      translate(sin((frameCount * 0.0001) + j + thisLevel) * 100, sin((frameCount * 0.0001) + j + thisLevel) * 100, i * 0.1);
      rotateZ((frameCount * 0.002) + thisLevel2);
      push();
      sphere(map(spectrum[2 * i], 0, 255, 2, 5));
      // var color = map(spectrum[i], 0, 255, 255, 0);
      // var opacity = map(mic.getLevel(), 0, 1, 0, 255);
      // console.log(mic.getLevel());

      const opacity = map(spectrum[0], 0, 255, 0.2, 1);
      pop();
      fill(`rgba(${0},${spectrum[2 * i]},${255 - spectrum[2 * i]},${opacity})`);
    }
    pop();
  }
}

// To prevent feedback, mic doesnt send its output.
// So we need to tell fft to listen to the mic, and then switch back.
function toggleInput() {
  if (soundFile.isPlaying()) {
    soundFile.pause();
    mic.start();
    fft.setInput(mic);
  } else {
    soundFile.play();
    mic.stop();
    fft.setInput(soundFile);
  }
}

// ================
// Helper Functions
// ================

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}

function keyPressed() {
  if (key === 'T') {
    toggleInput();
  }
}
