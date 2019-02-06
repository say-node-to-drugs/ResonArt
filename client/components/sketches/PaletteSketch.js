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
  let averageBlack = []
  let averageBlue = []
  let averageRed = []
  let recordArrayRed = []
  let recordArrayBlack = []
  let downloading = false
  let downloadCounter = 0
  let singleLoopTime = 0

  // let width = p.windowWidth / 2 - 30;
  let width = p.windowWidth / 2 - 30
  let height = p.windowHeight * (4 / 10)

  // buttons
  let redPaint,
    bluePaint,
    blackPaint,
    play,
    stop,
    download,
    clearCanvas,
    load,
    eraser

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
    drawGridLines()
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
          checkDownloadingStatus()
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
          synth2.amp(value ? 0.2 : 0)
          synth2.freq(p.midiToFreq(value))
        }, time * 1000)
      },
      synth2Pattern
    )
    synth3Phrase = new p5.Phrase(
      'synth3Sound',
      (time, value) => {
        setTimeout(() => {
          synth3.amp(value ? 0.5 : 0)
          synth3.freq(p.midiToFreq(value))
        }, time * 1000)
      },
      synth3Pattern
    )

    drums.setBPM('80')

    // create a sound recorder
    recorder = new p5.SoundRecorder()
    recorder.setInput()
    soundFile = new p5.SoundFile()

    /*
  ----------------------------------------------------------
                    Buttons
  ----------------------------------------------------------
  */

    // RED PAINT
    redPaint = p.createButton('Sawtooth Synth')
    redPaint.mousePressed(() => {
      color = 'red'
    })
    redPaint.parent('synthButtons')
    redPaint.class('redButton')

    // BLUE PAINT
    bluePaint = p.createButton('Triangle Synth')
    bluePaint.mousePressed(() => {
      color = 'blue'
    })
    bluePaint.parent('synthButtons')
    bluePaint.class('blueButton')

    // BLACK PAINT
    blackPaint = p.createButton('Sine Synth')
    blackPaint.mousePressed(() => {
      color = 'black'
    })
    blackPaint.parent('synthButtons')
    blackPaint.class('blackButton')

    // ERASER
    eraser = p.createButton('Eraser')
    eraser.mousePressed(() => {
      color = 'eraser'
    })
    eraser.parent('audioButtons')
    eraser.class('eraserButton')

    // PLAY AUDIO
    play = p.createButton('Play')
    play.mousePressed(() => {
      if (!isPlaying) {
        isPlaying = true
        drums.metro.metroTicks = 0
        synth.start()
        synth2.start()
        synth3.start()
        loadPaletteArrangement()
        drums.loop()
      }
    })
    play.parent('audioButtons')
    play.class('playButton')

    // STOP AUDIO
    stop = p.createButton('Stop')
    stop.mousePressed(() => {
      isPlaying = false
      synth.stop()
      synth2.stop()
      drums.stop()
    })
    stop.parent('audioButtons')
    stop.class('stopButton')

    // SAVE IMAGE
    let saveImage = p.createButton('Save Image')
    saveImage.mousePressed(() => {
      saveCanvasToFirebase(p, allBlackGrid, allRedGrid, allBlueGrid) // This saves to Firebase
    })
    saveImage.parent('saveButtons')
    saveImage.class('saveButton')

    // DOWNLOAD AUDIO
    download = p.createButton('Download')
    download.mousePressed(() => {
      isPlaying = true
      drums.metro.metroTicks = 0
      downloadCounter = 0

      synth.start()
      synth2.start()
      synth3.start()

      // Setup and the palette to play it's audio
      loadPaletteArrangement()
      recorder.record(soundFile)
      // Loops just once
      downloading = true
      drums.loop()
    })
    download.parent('saveButtons')
    download.class('downloadButton')

    // CLEAR PALETTE
    clearCanvas = p.createButton('Clear Palette')
    clearCanvas.mousePressed(() => {
      p.resizeCanvas(width, height)
      p.background(255)
      p.fill(0)
      drawGridLines()
      // Reset grid arrays for each color
      allBlackGrid = generateColorArray()
      allRedGrid = generateColorArray()
      allBlueGrid = generateColorArray()
      loadPaletteArrangement()
    })
    clearCanvas.parent('audioButtons')
    clearCanvas.class('clearButton')

    // ------------------
    // LOAD PRESET CANVAS
    // ------------------
    load = p.createButton('Load Preset Image')
    load.mousePressed(async () => {
      // This pulls a saved canvas from firebase

      await loadCanvasFromFirebase(p)

      console.log('GET VALUE FROM BUTTON PRESSED: ', p.firebase.loaded)
      console.log(
        'GET LATEST VALUE FROM BUTTON PRESSED: ',
        p.firebase.loaded[p.firebase.loaded.length - 1]
      )
      console.log('DRUMS LOAD: ', drums.phrases)
      drums.loadDrums = p.firebase.loadDrums

      console.log('DRUMS LOAD: ', drums.loadDrums)
      /*
      THIS IS ALL A PLACEHOLDER FOR CODE ONCE WE KNOW HOW WE WILL USE THIS DATA
      */
      p.loadImage(
        p.firebase.loaded[p.firebase.loaded.length - 1].dataURL.imageData,
        img => {
          img.resize(width, height)
          p.image(img, 0, 0)
        }
      )
      allBlackGrid = p.firebase.loaded[p.firebase.loaded.length - 1].black
      allBlackGrid.forEach(function(elem, idx) {
        elem = [].concat.apply([], elem)
        allBlackGrid[idx] = elem
      })

      allRedGrid = p.firebase.loaded[p.firebase.loaded.length - 1].red
      allRedGrid.forEach(function(elem, idx) {
        elem = [].concat.apply([], elem)
        allRedGrid[idx] = elem
      })

      allBlueGrid = p.firebase.loaded[p.firebase.loaded.length - 1].blue
      allBlueGrid.forEach(function(elem, idx) {
        elem = [].concat.apply([], elem)
        allBlueGrid[idx] = elem
      })

      drums.phrases[0].sequence =
        p.firebase.loaded[p.firebase.loaded.length - 1].hh
      drums.phrases[1].sequence =
        p.firebase.loaded[p.firebase.loaded.length - 1].clap
      drums.phrases[2].sequence =
        p.firebase.loaded[p.firebase.loaded.length - 1].bass
      drums.phrases[3].sequence =
        p.firebase.loaded[p.firebase.loaded.length - 1].seq

      isPlaying = true
      drums.metro.metroTicks = 0
      synth.start()
      synth2.start()
      synth3.start()
      loadPaletteArrangement()
      drums.loop()
    })

    load.parent('saveButtons')
    load.class('loadButton')
  }

  /*
  ----------------------------------------------------------
                    Resized Window Logic
  ----------------------------------------------------------
  */
  p.windowResized = () => {
    width = p.windowWidth / 2 - 30
    height = p.windowHeight * (4 / 10)

    p.saveFrames('canvas', 'png', 1, 1, function(im) {
      p.resizeCanvas(width, height)
      p.loadImage(im[0].imageData, img => {
        img.resize(width, height)
        p.image(img, 0, 0)
      })
    })
  }

  /*
  ----------------------------------------------------------
                    Mouse Event Handlers
  ----------------------------------------------------------
  */
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

    if (state) {
      // Gives us a value between 30 and  80 (good audible frequencies)
      if (isWithinBounds(p.mouseX, p.mouseY)) {
        // Start stroke and play audio based on color
        mouseDrag(p.mouseX, p.mouseY)
        drawColor(color, prevX, prevY, p.mouseX, p.mouseY)
      } else {
        synth.amp(0)
        synth2.amp(0)
      }
      // Save previous mouse position for next line() call
      prevX = p.mouseX
      prevY = p.mouseY
    }
    loadPaletteArrangement()
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
          synth.start()
          synth2.start()
          synth3.start()
          loadPaletteArrangement()
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
  const loadPaletteArrangement = () => {
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

    if (drums.getPhrase('synth1Sound')) {
      drums.removePhrase('synth1Sound')
      drums.removePhrase('synth2Sound')
      drums.removePhrase('synth3Sound')
    }
    drums.addPhrase(synth1Phrase)
    drums.addPhrase(synth2Phrase)
    drums.addPhrase(synth3Phrase)
  }

  // Move these to seperate files eventually
  /*
  ----------------------------------------------------------
                     Utility Functions
  ----------------------------------------------------------
  */
  const generateColorArray = () => {
    let array = []
    for (let i = 0; i < 16; i++) {
      array.push([])
    }
    return array
  }

  const drawGridLines = () => {
    // Draw grid lines
    for (let x = 0; x < width; x += width / 16) {
      for (let y = 0; y < height; y += height / 14) {
        p.stroke(200)
        p.strokeWeight(1)
        p.line(x, 0, x, height)
        p.line(0, y, width, y)
      }
    }
  }

  const checkDownloadingStatus = () => {
    if (downloading && downloadCounter++ > 15) {
      // Stop instruments, part, and recorder
      isPlaying = false
      fadeOutInstrument(synth)
      fadeOutInstrument(synth2)
      fadeOutInstrument(synth3)
      drums.stop()
      recorder.stop()

      // Reset downloading flags
      downloadCounter = 0
      downloading = false
      // Save the audio file to the browser client and re-initialize the sound file
      p.saveSound(soundFile, 'myHorribleSound.wav')
      soundFile = new p5.SoundFile()
    }
  }

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
    p.strokeWeight(10)
    switch (color) {
      case 'black':
        p.stroke(0)
        synth.amp(0.5)
        synth.freq(frequency)
        break
      case 'red':
        p.stroke(255, 0, 0)
        synth2.amp(0.2)
        synth2.freq(frequency)
        break
      case 'blue':
        p.stroke(0, 0, 255)
        synth3.amp(0.5)
        synth3.freq(frequency)
        break
      case 'eraser':
        p.strokeWeight(50)
        p.stroke(255, 255, 255)
        break
      default:
        break
    }
    p.line(lastX, lastY, x, y)
  }

  const mouseDrag = (x, y) => {
    // Calculate (x, y) value of the grid cell being dragged over
    let rowClicked = 20 - p.floor(21 * (y / p.height))
    let indexClicked = p.floor(16 * x / p.width)

    if (indexClicked === 16) {
      indexClicked--
    }

      if (
        color === 'black' &&
        allBlackGrid[indexClicked].indexOf(rowClicked) === -1
      ) {
        console.log(allBlackGrid)
        allBlackGrid[indexClicked].push(rowClicked)
      } else if (
        color === 'red' &&
        allRedGrid[indexClicked].indexOf(rowClicked) === -1
      ) {
        allRedGrid[indexClicked].push(rowClicked)
      } else if (
        color === 'blue' &&
        allBlueGrid[indexClicked].indexOf(rowClicked) === -1
      ) {
        allBlueGrid[indexClicked].push(rowClicked)
      } else if (color === 'eraser') {
        allBlackGrid[indexClicked] = allBlackGrid[indexClicked].filter(
          elem => elem > rowClicked + 1 || elem < rowClicked - 1
        )
        allRedGrid[indexClicked] = allRedGrid[indexClicked].filter(
          elem => elem > rowClicked + 1 || elem < rowClicked - 1
        )
        allBlueGrid[indexClicked] = allBlueGrid[indexClicked].filter(
          elem => elem > rowClicked + 1 || elem < rowClicked - 1
        )
      }
    }
  }

  const mousePress = (x, y) => {
    if (isWithinBounds(x, y)) {
      // Begin playing the correct synth
      if (color === 'black') {
        synth.start()
      } else if (color === 'red') {
        synth2.start()
      } else if (color === 'blue') {
        synth3.start()
      }
      mouseDrag(x, y)
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

  const mouseRelease = () => {
    if (color === 'black' && isPlaying === false) {
      fadeOutInstrument(synth)
    } else if (color === 'red' && isPlaying === false) {
      fadeOutInstrument(synth2)
    } else if (color === 'blue' && isPlaying === false) {
      fadeOutInstrument(synth3)
    }
    state = 0
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
