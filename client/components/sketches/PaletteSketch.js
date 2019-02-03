import {drums} from './DrumSketch'
import {saveCanvasToFirebase} from '../../firebase/saveCanvas.js'
import {loadCanvasFromFirebase} from '../../firebase/loadCanvas.js'

const PaletteSketch = p => {
  let recorder, soundFile, canvas
  let prevX, prevY
  let state = 0
  let synth, synth2, synth3
  let color = 'black'
  let synth1Phrase, synth2Phrase, synth3Phrase
  let isPlaying = false
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
  let synth3Pattern = [
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
  let synth1Sound, synth2Sound, synth3Sound
  const notes = [
    38,
    40,
    42,
    43,
    45,
    47,
    48,
    50,
    52,
    53,
    55,
    57,
    59,
    60,
    62,
    64,
    65,
    67,
    69,
    71
  ]
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
  let allBlueGrid = [
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

  // let width = p.windowWidth / 2 - 30;
  let width = p.windowWidth / 2 - 30
  let height = p.windowHeight * (4 / 10)

  // buttons
  let redPaint, bluePaint, blackPaint, play, stop, download, playback, load

  p.preload = () => {
    synth1Sound = new p5.SoundFile()
    synth2Sound = new p5.SoundFile()
    synth3Sound = new p5.SoundFile()
  }

  p.setup = () => {
    p.userStartAudio()

    // Create our canvas
    canvas = p.createCanvas(width, height)
    canvas.parent('sketchPad')
    canvas.style('display', 'block')
    canvas.class('palette')

    p.background(255)
    p.fill(0)

    // Draw grid lines
    for (let x = 0; x < width; x += width / 16) {
      for (let y = 0; y < height; y += height / 14) {
        p.stroke(200)
        p.strokeWeight(1)
        p.line(x, 0, x, height)
        p.line(0, y, width, y)
      }
    }
    p.strokeWeight(10)

    // Create instruments
    synth = new p5.Oscillator()
    synth.setType('sine')
    synth.freq(0)

    synth2 = new p5.Oscillator()
    synth2.setType('sawtooth')
    synth2.freq(0)

    synth3 = new p5.Oscillator()
    synth3.setType('triangle')
    synth3.freq(0)

    // Setup phrases to loop
    synth1Phrase = new p5.Phrase(
      'synth1Sound',
      (time, value) => {
        setTimeout(() => {
          synth.amp(value ? 0.5 : 0)
          synth.freq(p.midiToFreq(value))
        }, time * 1000)
      },
      synth1Pattern
    )
    synth2Phrase = new p5.Phrase(
      'synth2Sound',
      (time, value) => {
        setTimeout(() => {
          synth2.amp(value ? 0.3 : 0)
          synth2.freq(p.midiToFreq(value))
        }, time * 1000)
      },
      synth2Pattern
    )
    synth3Phrase = new p5.Phrase(
      'synth3Sound',
      (time, value) => {
        setTimeout(() => {
          synth3.amp(value ? 0.3 : 0)
          synth3.freq(p.midiToFreq(value))
        }, time * 1000)
      },
      synth3Pattern
    )

    // create a sound recorder
    recorder = new p5.SoundRecorder()
    recorder.setInput(synth)
    soundFile = new p5.SoundFile()

    /*
  ----------------------------------------------------------
                    Buttons
  ----------------------------------------------------------
  */

    // RED PAINT
    redPaint = p.createButton('Red')
    redPaint.mousePressed(() => {
      color = 'red'
    })
    redPaint.parent('buttonManifold')

    // RED PAINT
    bluePaint = p.createButton('Blue')
    bluePaint.mousePressed(() => {
      color = 'blue'
    })
    bluePaint.parent('buttonManifold')

    // BLACK PAINT
    blackPaint = p.createButton('Black')
    blackPaint.mousePressed(() => {
      color = 'black'
    })
    blackPaint.parent('buttonManifold')

    // PLAY AUDIO
    play = p.createButton('Play')
    play.mousePressed(() => {
      if (!isPlaying) {
        isPlaying = true
        drums.metro.metroTicks = 0
        playingCanvas()
        drums.loop()
      }
    })
    play.parent('buttonManifold')

    // STOP AUDIO
    stop = p.createButton('Stop')
    stop.mousePressed(() => {
      isPlaying = false
      synth.stop()
      synth2.stop()
      drums.stop()
    })
    stop.parent('buttonManifold')

    // SAVE IMAGE
    let saveImage = p.createButton('Save Image')
    saveImage.mousePressed(() => {
      saveCanvasToFirebase(p) // This saves to Firebase
    })
    saveImage.parent('buttonManifold')

    // DOWNLOAD AUDIO
    download = p.createButton('Download')
    download.mousePressed(() => {
      p.saveSound(soundFile, 'myHorribleSound.wav')
      // Re-initialize the soundfile
      soundFile = new p5.SoundFile()
      // Retrieve all pixels from the canvas
    })
    download.parent('buttonManifold')

    // PLAYBACK STROKE
    playback = p.createButton('Playback')
    playback.mousePressed(() => {
      replay = true
    })
    playback.parent('buttonManifold')

    // ------------------
    // LOAD PRESET CANVAS
    // ------------------
    load = p.createButton('Load Preset Image')
    load.mousePressed(() => {
      // This pulls a saved canvas from firebase
      p.loadImage(loadCanvasFromFirebase(p), img => {
        img.resize(width, height)
        p.image(img, 0, 0)
      })
    })
    load.parent('buttonManifold')
  }

  /*
  ----------------------------------------------------------
                    Resized Window Logic
  ----------------------------------------------------------
  */
  p.windowResized = () => {
    width = p.windowWidth / 2 - 30
    height = p.windowHeight * (4 / 10)
    p.resizeCanvas(width, height)
    p.background(255)
    p.fill(0)
    for (let x = 0; x < width; x += width / 16) {
      for (let y = 0; y < height; y += height / 14) {
        p.stroke(200)
        p.strokeWeight(1)
        p.line(x, 0, x, height)
        p.line(0, y, width, y)
      }
    }
    p.strokeWeight(10)
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
          drums.metro.metroTicks = 0 // restarts playhead at beginning [0]
          playingCanvas()
          drums.loop()
        } else {
          isPlaying = false
          fadeOutInstrument(synth)
          fadeOutInstrument(synth2)
          fadeOutInstrument(synth3)
          drums.stop()
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
  const playingCanvas = () => {
    // Get average grid y-value for each color
    for (let i = 0; i < allBlackGrid.length; i++) {
      synth1Pattern[i] = notes[getAverage(allBlackGrid[i])]
    }
    for (let i = 0; i < allRedGrid.length; i++) {
      synth2Pattern[i] = notes[getAverage(allRedGrid[i])]
    }
    for (let i = 0; i < allBlueGrid.length; i++) {
      synth3Pattern[i] = notes[getAverage(allBlueGrid[i])]
    }

    synth.start()
    synth2.start()
    synth3.start()

    //drums = new p5.Part()
    drums.addPhrase(synth1Phrase)
    drums.addPhrase(synth2Phrase)
    drums.addPhrase(synth3Phrase)
    drums.setBPM('80')
  }

  // Move these to seperate files eventually
  /*
  ----------------------------------------------------------
                     Utility Functions
  ----------------------------------------------------------
  */
  const fadeOutInstrument = instrument => {
    //instrument.fade(0, 0.5)
    instrument.amp(0)
    instrument.stop()
  }

  const isWithinBounds = (x, y) => {
    if (x >= 0 && x <= width && y >= 0 && y <= height) {
      return true
    }
    return false
  }

  const getAverage = array => {
    return Math.floor(array.reduce((a, b) => a + b, 0) / array.length)
  }

  const drawColor = (color, lastX, lastY, x, y) => {
    let frequency = p.midiToFreq(
      scaleDifference * (height - p.mouseY) / height + notes[0]
    )
    switch (color) {
      case 'black':
        p.stroke(0)
        synth.amp(0.5)
        synth.freq(frequency)
        break
      case 'red':
        p.stroke(255, 0, 0)
        synth2.amp(0.3)
        synth2.freq(frequency)
        break
      case 'blue':
        p.stroke(0, 0, 255)
        synth3.amp(0.3)
        synth3.freq(frequency)
      default:
        break
    }
    p.line(lastX, lastY, x, y)
  }

  const mouseDrag = (x, y) => {
    if (!isPlaying) {
      if (isWithinBounds(x, y)) {
        // Calculate (x, y) value of the grid cell being dragged over
        let rowClicked = 20 - p.floor(21 * (y / p.height))
        let indexClicked = p.floor(16 * x / p.width)

        if (indexClicked === 16) {
          indexClicked--
        }

        if (allBlackGrid[indexClicked].indexOf(rowClicked) === -1) {
          if (color === 'black') {
            allBlackGrid[indexClicked].push(rowClicked)
          } else if (color === 'red') {
            allRedGrid[indexClicked].push(rowClicked)
          } else if (color === 'blue') {
            allBlueGrid[indexClicked].push(rowClicked)
          }
        }
        p.draw()
      } else {
        synth.amp(0)
        synth2.amp(0)
        synth3.amp(0)
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
        } else if (color === 'blue') {
          synth3.start()
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
        synth3.amp(0)
      }
    }
  }

  const mouseRelease = () => {
    if (!isPlaying) {
      if (color === 'black') {
        fadeOutInstrument(synth)
      } else if (color === 'red') {
        fadeOutInstrument(synth2)
      } else if (color === 'blue') {
        fadeOutInstrument(synth3)
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
