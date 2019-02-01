const PaletteSketch = p => {
  let recorder, soundFile, canvas
  let prevX, prevY
  let state = 0
  let synth, synth2
  let color = 'black'
  let synth1Phrase, synth2Phrase
  let isPlaying = false
  let instruments = new p5.Part()
  let synth1Pattern = [
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined
  ]
  let synth2Pattern = [
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined
  ]
  let synth1Sound
  let synth2Sound
  const notes = [48, 50, 52, 53, 55, 57, 59, 60, 62, 64, 65, 67, 69, 71]
  let scaleDifference = notes[notes.length - 1] - notes[0]
  let allBlackGrid = [
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    []
  ]
  let allRedGrid = [
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    []
  ]
  let recordArrayRed = []
  let recordArrayBlack = []

  let width = p.windowWidth / 2 - 30
  let height = p.windowHeight * (4 / 10)

  // buttons
  let startRecord,
    stopRecord,
    redPaint,
    blackPaint,
    play,
    stop,
    download,
    playback

  p.preload = () => {
    synth1Sound = new p5.SoundFile()
    synth2Sound = new p5.SoundFile()
  }

  p.setup = () => {
    p.userStartAudio()

    canvas = p.createCanvas(p.windowWidth / 2 - 30, p.windowHeight * (4 / 10))
    canvas.parent('sketchPad')
    canvas.style('display', 'block')
    canvas.class('palette')

    p.background(255)
    p.fill(0)
    p.strokeWeight(10)

    for (
      let x = 0;
      x < p.windowWidth / 2 - 30;
      x += (p.windowWidth / 2 - 30) / 16
    ) {
      for (
        let y = 0;
        y < p.windowHeight * (4 / 10);
        y += p.windowHeight * (4 / 10) / 14
      ) {
        p.stroke(200)
        p.strokeWeight(1)
        p.line(x, 0, x, p.windowHeight * (4 / 10))
        p.line(0, y, p.windowWidth / 2 - 30, y)
      }
    }

    // Link mouse press functions

    synth = new p5.SinOsc()
    synth.setType('sine')
    synth.freq(0)

    synth2 = new p5.Oscillator()
    synth2.setType('sawtooth')
    synth2.freq(0)

    // create a sound recorder
    recorder = new p5.SoundRecorder()
    recorder.setInput(synth)
    soundFile = new p5.SoundFile()

    /*
  ----------------------------------------------------------
                    Buttons
  ----------------------------------------------------------
  */
    // Button to begin recording audio
    startRecord = p.createButton('Start Record')
    startRecord.onclick = () => {
      recorder.record(soundFile)
      console.log('start record')
    }
    startRecord.parent('buttonManifold')

    // Button to stop recording audio
    stopRecord = p.createButton('Stop Record')
    stopRecord.onclick = () => {
      recorder.stop()
    }
    stopRecord.parent('buttonManifold')

    // Button to change paint to red
    redPaint = p.createButton('Red')
    redPaint.onclick = () => {
      color = 'red'
    }
    redPaint.parent('buttonManifold')

    // Button to change paint to black
    blackPaint = p.createButton('Black')
    blackPaint.onclick = () => {
      color = 'black'
    }
    blackPaint.parent('buttonManifold')

    // Button to handle canvas playback
    play = p.createButton('Play')
    play.onclick = () => {
      p.playingCanvas()
      instruments.loop()
    }
    play.onkeypress = () => {
      if (key === ' ') {
        p.playingCanvas()
        instruments.loop()
      }
    }
    play.parent('buttonManifold')

    stop = p.createButton('Stop')
    stop.onclick = () => {
      isPlaying = false
      synth.stop()
      synth2.stop()
      instruments.stop()
    }
    stop.parent('buttonManifold')

    // Button to download the currently recorded audio
    download = p.createButton('Download')
    download.onclick = () => {
      p.saveSound(soundFile, 'myHorribleSound.wav')
      // Re-initialize the soundfile
      soundFile = new p5.SoundFile()
      // Retrieve all pixels from the canvas
    }
    download.parent('buttonManifold')

    // Button for playback of strokes
    playback = p.createButton('Playback')
    playback.onclick = () => {
      replay = true
    }
    playback.parent('buttonManifold')
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth / 2 - 30, p.windowHeight * (4 / 10))
    p.background(255)
    p.fill(0)
    p.strokeWeight(10)

    for (
      let x = 0;
      x < p.windowWidth / 2 - 30;
      x += (p.windowWidth / 2 - 30) / 16
    ) {
      for (
        let y = 0;
        y < p.windowHeight * (4 / 10);
        y += p.windowHeight * (4 / 10) / 14
      ) {
        p.stroke(200)
        p.strokeWeight(1)
        p.line(x, 0, x, p.windowHeight * (4 / 10))
        p.line(0, y, p.windowWidth / 2 - 30, y)
      }
    }
  }

  /*
  ----------------------------------------------------------
                    Mouse Event Handlers
  ----------------------------------------------------------
  */
  p.mouseDragged = () => {
    mouseDrag(p.mouseX, p.mouseY)
  }

  p.mousePressed = () => {
    mousePress(p.mouseX, p.mouseY)
  }
  p.mouseReleased = () => {
    mouseRelease()
  }

  /*
  ----------------------------------------------------------
                     Draw Function
  ----------------------------------------------------------
  */
  p.draw = () => {
    // Set previous mouse position correctly if starting a new line
    if (prevX === 0) {
      prevX = p.mouseX
      prevY = p.mouseY
    }

    if (state && !isPlaying) {
      // Gives us a value between 30 and  80 (good audible frequencies)
      if (isWithinBounds(p.mouseX, p.mouseY)) {
        // Start stroke and play audio based on color
        drawColor(color, prevX, prevY, p.mouseX, p.mouseY)
      } else {
        synth.amp(0)
        synth2.amp(0)
      }
      // Save previous mouse position for next line() call
      prevX = p.mouseX
      prevY = p.mouseY
    }
  }

  /*
  ----------------------------------------------------------
                     Key Press Handler
  ----------------------------------------------------------
  */
  document.addEventListener(
    'keydown',
    function(event) {
      if (event.key === ' ') {
        if (!isPlaying) {
          isPlaying = true
          instruments.metro.metroTicks = 0 // restarts playhead at beginning [0]
          p.playingCanvas()
          instruments.loop()
        } else {
          isPlaying = false
          fadeOutInstrument(synth)
          fadeOutInstrument(synth2)
          instruments.stop()
        }
      }
    },
    false
  )

  /*
  ----------------------------------------------------------
                     Playing Music Function
  ----------------------------------------------------------
  */
  p.playingCanvas = () => {
    // Get average grid y-value for each color
    for (let i = 0; i < allBlackGrid.length; i++) {
      synth1Pattern[i] = notes[getAverage(allBlackGrid[i])]
    }
    for (let i = 0; i < allRedGrid.length; i++) {
      synth2Pattern[i] = notes[getAverage(allRedGrid[i])]
    }

    synth.start()
    synth2.start()

    // Setup phrases to loop
    synth1Phrase = new p5.Phrase(
      'synth1Sound',
      (time, value) => {
        let volume = 0
        if (value) {
          volume = 0.5
        }
        synth.freq(p.midiToFreq(value))
        synth.amp(0 + volume)

        if (value) {
          synth.freq(p.midiToFreq(value))
          synth.amp(0.5)
        } else {
          synth.freq(p.midiToFreq(value))
          synth.amp(0)
        }
      },
      synth1Pattern
    )
    synth2Phrase = new p5.Phrase(
      'synth2Sound',
      (time, value) => {
        if (value) {
          synth2.freq(p.midiToFreq(value))
          synth2.amp(0.5)
        } else {
          synth2.freq(p.midiToFreq(value))
          synth2.amp(0)
        }
      },
      synth2Pattern
    )
    instruments = new p5.Part()
    instruments.addPhrase(synth1Phrase)
    instruments.addPhrase(synth2Phrase)
    instruments.setBPM('80')
  }

  // Move these to seperate files eventually
  /*
  ----------------------------------------------------------
                     Utility Functions
  ----------------------------------------------------------
  */
  const fadeOutInstrument = instrument => {
    instrument.fade(0, 0.5)
    instrument.amp(0)
    instrument.stop()
  }

  const isWithinBounds = (x, y) => {
    if (
      x >= 0 &&
      x <= p.windowWidth / 2 - 30 &&
      y >= 0 &&
      y <= p.windowHeight * (4 / 10)
    ) {
      return true
    }
    return false
  }

  const getAverage = array => {
    return Math.floor(array.reduce((a, b) => a + b, 0) / array.length)
  }

  const drawColor = (color, lastX, lastY, x, y) => {
    let frequency = p.midiToFreq(
      scaleDifference *
        (p.windowHeight * (4 / 10) - p.mouseY) /
        (p.windowHeight * (4 / 10)) +
        notes[0]
    )
    synth.amp(2)
    synth.freq(frequency)

    switch (color) {
      case 'black':
        p.stroke(0)
        break
      case 'red':
        p.stroke(255, 0, 0)
        break
      default:
        break
    }
    p.line(lastX, lastY, x, y)
  }

  const mouseDrag = (x, y) => {
    if (!isPlaying) {
      if (isWithinBounds(x, y)) {
        // Calculate (x, y) value of the grid cell being dragged over
        let rowClicked = 13 - p.floor(14 * (y / (p.windowHeight * (4 / 10))))
        let indexClicked = p.floor(16 * x / (p.windowWidth / 2 - 30))

        if (indexClicked === 16) {
          indexClicked--
        }

        if (allBlackGrid[indexClicked].indexOf(rowClicked) === -1) {
          if (color === 'black') {
            allBlackGrid[indexClicked].push(rowClicked)
          }
          if (color === 'red') {
            allRedGrid[indexClicked].push(rowClicked)
          }
        }
        p.draw()
      } else {
        synth.amp(0)
        synth2.amp(0)
      }
    }
  }

  const mousePress = (x, y) => {
    if (!isPlaying) {
      if (isWithinBounds(x, y)) {
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
        synth.amp(0)
        synth2.amp(0)
      }
    }
  }

  const mouseRelease = () => {
    if (!isPlaying) {
      if (color === 'black') {
        fadeOutInstrument(synth)
      } else if (color === 'red') {
        fadeOutInstrument(synth2)
      }
      state = 0
    }
  }
}
//_______________WILL BE USED LATER________________________________________
//
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
