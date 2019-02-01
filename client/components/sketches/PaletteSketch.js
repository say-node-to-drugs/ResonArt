const PaletteSketch = p => {
  let recorder, soundFile, canvas
  let prevX, prevY
  let state = 0
  let synth, synth2
  let color = 'black'
  let synth1Phrase, synth2Phrase
  let isPlaying = false;
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
  let scaleDifference = notes[notes.length - 1] - notes[0];
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

  let width = p.windowWidth * (1 / 2)
  let height = p.windowWidth / 4
  p.preload = () => {
    synth1Sound = new p5.SoundFile()
    synth2Sound = new p5.SoundFile()
  }

  p.setup = () => {
    p.userStartAudio()

    canvas = p.createCanvas(width, height)
    canvas.parent('paletteP5Wrapper')
    canvas.style('display', 'block')

    p.background(255)
    p.fill(0)
    canvas.class('paletteP5')
    for (var x = 0; x < width; x += width / 16) {
      for (var y = 0; y < height; y += height / 14) {
        p.stroke(200)
        p.strokeWeight(1)
        p.line(x, 0, x, height)
        p.line(0, y, width, y)
      }
    }
    p.strokeWeight(10)

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
    // RED PAINT
    let redPaint = document.createElement('button')
    redPaint.innerText = 'Red'
    redPaint.onclick = () => {
      color = 'red'
    }
    document.body.appendChild(redPaint)
    // BLACK PAINT
    let blackPaint = document.createElement('button')
    blackPaint.innerText = 'Black'
    blackPaint.onclick = () => {
      color = 'black'
    }
    document.body.appendChild(blackPaint)
    // PLAY
    let play = document.createElement('button')
    play.innerText = 'Play'
    play.onclick = () => {
      if(!isPlaying) {
        isPlaying = true;
        playingCanvas()
        instruments.loop()
      }
    }
    document.body.appendChild(play)
    // STOP PLAYING
    let stop = document.createElement('button')
    stop.innerText = 'Stop'
    stop.onclick = () => {
      isPlaying = false;
      synth.stop()
      synth2.stop()
      instruments.stop()
    }
    document.body.appendChild(stop)
    // DOWNLOAD AUDIO
    let download = document.createElement('button')
    download.innerText = 'Download'
    download.onclick = () => {
      p.saveSound(soundFile, 'myHorribleSound.wav')
      // Re-initialize the soundfile
      soundFile = new p5.SoundFile()
      // Retrieve all pixels from the canvas
    }
    document.body.appendChild(download)

    // PLAYBACK STROKES
    let playback = document.createElement('button')
    playback.innerText = 'Playback'
    playback.onclick = () => {
      replay = true
    }
    document.body.appendChild(playback)
  }

  /*
  ----------------------------------------------------------
                    Mouse Event Handlers
  ----------------------------------------------------------
  */
  p.mouseDragged = () => {
    mouseDrag(p.mouseX, p.mouseY);
  }

  p.mousePressed = () => {
    mousePress(p.mouseX, p.mouseY);
  }
  p.mouseReleased = () => {
    mouseRelease();
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
        drawColor(color, prevX, prevY, p.mouseX, p.mouseY);
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
          isPlaying = true;
          instruments.metro.metroTicks = 0 // restarts playhead at beginning [0]
          playingCanvas()
          instruments.loop()
        } else {
          isPlaying = false;
          fadeOutInstrument(synth);
          fadeOutInstrument(synth2);
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
  const playingCanvas = () => {
    // Get average grid y-value for each color
    for (let i = 0; i < allBlackGrid.length; i++) {
      synth1Pattern[i] = notes[getAverage(allBlackGrid[i])];
    }
    for (let i = 0; i < allRedGrid.length; i++) {
      synth2Pattern[i] = notes[getAverage(allRedGrid[i])]
    }

    synth.start()
    synth2.start()

    // Setup phrases to loop
    synth1Phrase = new p5.Phrase('synth1Sound', (time, value) => {
      let volume = 0;
      if(value) {
        volume = .5;
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
      }, synth1Pattern);
    synth2Phrase = new p5.Phrase('synth2Sound', (time, value) => {
        if (value) {
          synth2.freq(p.midiToFreq(value))
          synth2.amp(0.5)
        } else {
          synth2.freq(p.midiToFreq(value))
          synth2.amp(0)
        }
      }, synth2Pattern)
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
  const fadeOutInstrument = (instrument) => {
    instrument.fade(0, 0.5)
    instrument.amp(0)
    instrument.stop()
  }

  const isWithinBounds = (x, y) => {
    if (x >= 0 && x <= width && y >= 0 && y <= height) {
      return true;
    }
    return false;
  }

  const getAverage = (array) => {
    return Math.floor(array.reduce((a, b) => a + b, 0) / array.length);
  }

  const drawColor = (color, lastX, lastY, x, y) => {
    let frequency = p.midiToFreq(scaleDifference * (height - p.mouseY) / height + notes[0]);
    synth.amp(2)
    synth.freq(frequency)
    
    switch(color) {
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
    if(!isPlaying) {
      if (isWithinBounds(x, y)) {
        // Calculate (x, y) value of the grid cell being dragged over
        let rowClicked = 13 - p.floor(14 * (y / p.height))
        let indexClicked = p.floor(16 * x / p.width)
  
        if (indexClicked === 16) { indexClicked-- }
  
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
    if(!isPlaying) {
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
    if(!isPlaying) {
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
