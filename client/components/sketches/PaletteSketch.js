const PaletteSketch = p => {
  let recorder, soundFile, canvas, startTime, currentTime
  let prevX, prevY
  let state = 0 // mousePress will increment from Record, to Stop, to Play
  let synth, synth2
  let replay = false
  let color = 'black'
  let synth1Sound, synth2Sound, synth1Phrase, synth2Phrase, instruments
  let synth1Pattern = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  let synth2Pattern = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

  const notes = [48, 50, 52, 53, 55, 57, 59, 60, 62, 64, 65, 67, 69, 71]
  let recordArray = []
  let playbackArray = []
  let recordArrayRed = []
  let recordArrayBlack = []

  p.preload = () => {
    synth1Sound = new p5.SoundFile()
    synth2Sound = new p5.SoundFile()
  }

  p.setup = () => {
    p.userStartAudio()

    canvas = p.createCanvas(800, 800)
    p.background(255)
    p.fill(0)
    p.strokeWeight(50)

    // Link mouse press functions
    canvas.mousePressed(p.canvasPressed)
    canvas.mouseReleased(p.canvasReleased)

    synth = new p5.SinOsc()
    synth2 = new p5.Oscillator()
    synth2.setType('sawtooth')

    // create a sound recorder
    recorder = new p5.SoundRecorder()
    recorder.setInput(synth)
    soundFile = new p5.SoundFile()

    // Set input of recorder to instruments
    // create an empty sound file that we will use to playback the recording

    /*         BUTTONS         */
    // Button to begin recording audio
    let startRecording = document.createElement('button')
    startRecording.innerText = 'Start Recording'
    startRecording.onclick = () => {
      recorder.record(soundFile)
    }
    document.body.appendChild(startRecording)
    // Button to stop recording audio
    let stopRecording = document.createElement('button')
    stopRecording.innerText = 'Stop Recording'
    stopRecording.onclick = () => {
      recorder.stop()
    }
    document.body.appendChild(stopRecording)
    // Button to change paint to red
    let redPaint = document.createElement('button')
    redPaint.innerText = 'Red'
    redPaint.onclick = () => {
      color = 'red'
    }
    document.body.appendChild(redPaint)
    // Button to change paint to black
    let blackPaint = document.createElement('button')
    blackPaint.innerText = 'Black'
    blackPaint.onclick = () => {
      color = 'black'
    }
    document.body.appendChild(blackPaint)
    // Button to handle canvas playback
    let play = document.createElement('button')
    play.innerText = 'Play'
    play.onclick = () => {
      playingCanvas()
      instruments.loop()
    }
    document.body.appendChild(play)

    let stop = document.createElement('button')
    stop.innerText = 'Stop'
    stop.onclick = () => {
      synth.stop()
      synth2.stop()
      instruments.stop()
    }
    document.body.appendChild(stop)
    // Button to download the currently recorded audio

    let download = document.createElement('button')
    download.innerText = 'Download'
    download.onclick = () => {
      p.saveSound(soundFile, 'myHorribleSound.wav')
      // Re-initialize the soundfile
      soundFile = new p5.SoundFile()
      // Retrieve all pixels from the canvas
    }
    document.body.appendChild(download)

    // Button for playback of strokes
    let playback = document.createElement('button')
    playback.innerText = 'Playback'
    playback.onclick = () => {
      replay = true
    }
    document.body.appendChild(playback)
  }

  /*       MOUSE EVENT HANDLERS        */
  p.canvasPressed = () => {
    // If nothing is being played and the mouse is clicked on the canvas
    if (state === 0 && p.mouseX <= 800 && p.mouseY <= 800) {
      // Begin playing the correct synth
      if (color === 'black') {
        synth.start()
      } else if (color === 'red') {
        synth2.start()
      }
      // Set state to 1 so the draw() function knows to make lines and produce audio
      state++
      // Reset the previous mouse position
      prevX = 0
      prevY = 0
    } else {
      state = 0
    }
  }
  p.canvasReleased = () => {
    // Stop playing synth
    if (color === 'black') {
      synth.fade(0, 0.5)
      synth.stop()
    } else if (color === 'red') {
      synth2.fade(0, 0.5)
      synth2.stop()
    }
    state = 0
  }

  /*       DRAW FUNCTION       */
  let blackPixels = []
  let redPixels = []
  let pixels
  let loopNum = 0
  // Draw function that p5 calls every time the canvas is interacted with
  p.draw = () => {
    // Set previous mouse position correctly if starting a new line
    if (prevX === 0) {
      prevX = p.mouseX
      prevY = p.mouseY
    }

    if (state) {
      // Gives us a value between 30 and  80 (good audible frequencies)
      if (p.mouseX <= 800 && p.mouseY <= 800) {
        // Start stroke and play audio based on color
        if (color === 'black') {
          synth.amp(2)
          synth.freq(p.midiToFreq(60 * (800 - p.mouseY) / 500 + 20))
          p.stroke(0)
          recordArrayBlack.push(p.mouseX)
          recordArrayBlack.push(p.mouseY)
          //LZcompressed(recordArrayBlack);
        } else if (color === 'red') {
          synth2.amp(2)
          synth2.freq(p.midiToFreq(60 * (800 - p.mouseY) / 500 + 20))
          p.stroke(255, 0, 0)
          recordArrayRed.push(p.mouseX)
          recordArrayRed.push(p.mouseY)
          //LZcompressed(recordArrayRed);
        }
        p.line(prevX, prevY, p.mouseX, p.mouseY)
      }
      // Save previous mouse position for next line() call
      prevX = p.mouseX
      prevY = p.mouseY
    }
  }

  /*       Playing Music Function        */
  const playingCanvas = () => {
    // Loop for the amount of slices we take of the canvas
    for (let i = 0; i < 16; i++) {
      // Get all pixel data from current slice
      pixels = canvas.drawingContext.getImageData(i * 50, 0, 50, 800)
      let j = 0
      // Loop throught all pixel data and add all colored pixels' y-values to appropriate arrays
      while (j < pixels.data.length) {
        if (pixels.data[j] === 0 && pixels.data[j + 1] === 0) {
          blackPixels.push(j / 50)
        } else if (pixels.data[j] === 255 && pixels.data[j + 1] === 0) {
          redPixels.push(j / 50)
        }
        j += 4
      }

      // Finds the average y-value for black pixels and adds the note closest to that frequency to the synth pattern
      if (blackPixels.length) {
        let averageBlack = blackPixels.reduce(getSum) / blackPixels.length

        let frequency = 90 * (averageBlack / 500)
        let index = Math.floor(14 - 14 * (frequency / 600))
        synth1Pattern[i] = notes[index]
      } else {
        synth1Pattern[i] = 1
      }
      // Finds the average y-value for red pixels and adds the note closest to that frequency to the synth pattern
      if (redPixels.length) {
        let averageRed = redPixels.reduce(getSum) / redPixels.length

        let frequency = 90 * (averageRed / 500)
        let index = Math.floor(14 - 14 * (frequency / 600))
        synth2Pattern[i] = notes[index]
      } else {
        synth2Pattern[i] = 1
      }
      // Reset the colored pixels arrays
      blackPixels = []
      redPixels = []

      console.log('synth1Pattern is ')
      console.log(synth1Pattern)
      synth.start()
      synth2.start()
      // Setup phrases to loop
      synth1Phrase = new p5.Phrase(
        'synth1Sound',
        (time, value) => {
          if (value > 1) {
            synth.freq(p.midiToFreq(value))
            synth.amp(0.5)
          } else {
            synth.amp(0)
            synth.freq(p.midiToFreq(value))
          }
        },
        synth1Pattern
      )
      synth2Phrase = new p5.Phrase(
        'synth2Sound',
        (time, value) => {
          console.log('current value is ' + value)
          if (value > 1) {
            synth2.freq(p.midiToFreq(value))
            synth2.amp(0.5)
          } else {
            synth2.amp(0)
            synth2.freq(p.midiToFreq(value))
          }
        },
        synth2Pattern
      )

      instruments = new p5.Part()

      instruments.addPhrase(synth1Phrase)
      instruments.addPhrase(synth2Phrase)

      instruments.setBPM('80')
    }
  }

  /*
  ----------------------------------------------------------
  THIS IS THE RECORDING SNIPPET OF CODE -- BELOW --
  This needs a bitton... toggle the value of < replay > with a button. If replay === true, p5 draw will run replay once and then set replay to false. Replay will replay back the values recorded in recordArray (see above)
  ----------------------------------------------------------
  */

  if (replay) {
    console.log('Replaying')
    synth.start()
    if (color === 'red') {
      playbackArray = recordArrayRed
    }
    if (color === 'black') {
      playbackArray = recordArrayBlack
    }
    for (let i = 0; i < playbackArray.length - 4; i = i + 2) {
      synth.amp(2)
      // Gives us a value between 30 and  80 (good audible frequencies)
      synth.freq(p.midiToFreq(60 * (800 - playbackArray[i + 1]) / 500 + 30))
      // Start black stroke
      p.stroke(0)
      console.log(color)
      p.line(
        playbackArray[i],
        playbackArray[i + 1],
        playbackArray[i + 2],
        playbackArray[i + 3]
      )

      sleep(17)
    }

    canvas.mouseReleased()
    state = 0
    console.log('DONE')
    replay = false
  }

  /*
  ----------------------------------------------------------
  THIS IS THE RECORDING SNIPPET OF CODE -- ABOVE --
  ----------------------------------------------------------
  */
}

// Utility functions
function sleep(milliseconds) {
  var start = new Date().getTime()
  for (var i = 0; i < 1e7; i++) {
    if (new Date().getTime() - start > milliseconds) {
      break
    }
  }
}

function getSum(total, num) {
  return total + num
}
//_______________________________________________________

// function LZcompressed(array) {
//   var string = String.fromCharCode.apply(null, array);
//   var compressed = LZString.compress(string);
//   var decompressed = LZString.decompress(compressed);
//   var dearray = [];
//   for (var i = 0; i < decompressed.length; i++) {
//     dearray[i] = decompressed.charCodeAt(i);
//   }
//   console.log('LZ - ORIG. ARRAY: ', array.length, array);
//   console.log('LZ - ARRAY TO STRING: ', string.length, string);
//   console.log('LZ - COMPRESSED: ', compressed.length, compressed);
//   console.log('LZ - DECOMPRESSED: ', decompressed.length, decompressed);
//   console.log('LZ - DECOMP. ARRAY: ', dearray.length, dearray);
// }

export default PaletteSketch
