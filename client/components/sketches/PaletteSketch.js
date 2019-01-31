const PaletteSketch = p => {
  let recorder, soundFile, canvas
  let prevX, prevY
  let state = 0 // mousePress will increment from Record, to Stop, to Play
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
      if(!isPlaying) {
        isPlaying = true;
        playingCanvas()
        instruments.loop()
      }
    }
    play.onkeypress = () => {
      if (key === ' ' && !isPlaying) {
        isPlaying = true;
        playingCanvas()
        instruments.loop()
      } else if(isPlaying) {
        isPlaying = false;
        synth.stop()
        synth2.stop()
        instruments.stop()
      }
    }
    document.body.appendChild(play)

    let stop = document.createElement('button')
    stop.innerText = 'Stop'
    stop.onclick = () => {
      isPlaying = false;
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

  /*
  ----------------------------------------------------------
                    Mouse Event Handlers
  ----------------------------------------------------------
  */
  p.mouseDragged = () => {
    if(!isPlaying) {
      if (isWithinBounds(p.mouseX, p.mouseY)) {
        let rowClicked = 13 - p.floor(14 * (p.mouseY / p.height))
        let indexClicked = p.floor(16 * p.mouseX / p.width)
  
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

  p.mousePressed = () => {
    // If nothing is being played and the mouse is clicked on the canvas
    if(!isPlaying) {
      if (isWithinBounds(p.mouseX, p.mouseY)) {
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
  p.mouseReleased = () => {
    // Stop playing synth
    if(!isPlaying) {
      if (color === 'black') {
        synth.fade(0, 0.5)
        synth.amp(0)
        synth.stop()
      } else if (color === 'red') {
        synth2.fade(0, 0.5)
        synth2.amp(0)
        synth2.stop()
      }
      state = 0
    }
  }

  /*
  ----------------------------------------------------------
                     Draw Function
  ----------------------------------------------------------
  */
  // Draw function that p5 calls every time the canvas is interacted with
  p.draw = () => {
    // Set previous mouse position correctly if starting a new line
    if (prevX === 0) {
      prevX = p.mouseX
      prevY = p.mouseY
    }

    if (state && !isPlaying) {
      // Gives us a value between 30 and  80 (good audible frequencies)
      if (
        p.mouseX >= 0 &&
        p.mouseX <= width &&
        p.mouseY >= 0 &&
        p.mouseY <= height
      ) {
        // Start stroke and play audio based on color
        if (color === 'black') {
          synth.amp(2)
          synth.freq(p.midiToFreq(90 * (height - p.mouseY) / 500) + 90)
          p.stroke(0)
        } else if (color === 'red') {
          synth2.amp(2)
          synth2.freq(p.midiToFreq(90 * (height - p.mouseY) / 500) + 60)
          p.stroke(255, 0, 0)
        }
        p.line(prevX, prevY, p.mouseX, p.mouseY)
      } else {
        synth.amp(0)
        synth2.amp(0)
      }
      // Save previous mouse position for next line() call
      prevX = p.mouseX
      prevY = p.mouseY
    }
  }

  document.addEventListener(
    'keydown',
    function(event) {
      console.log('space was pressed !!!!')
      if (event.key === ' ') {
        if (!isPlaying) {
          isPlaying = true;
          instruments.metro.metroTicks = 0 // restarts playhead at beginning [0]
          playingCanvas()
          instruments.loop()
        } else {
          isPlaying = false;
          synth.fade(0, 0.5)
          synth.amp(0)
          synth.stop()
          synth2.fade(0, 0.5)
          synth2.amp(0)
          synth2.stop()
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
      synth1Pattern[i] =
        allBlackGrid[i].reduce((a, b) => a + b, 0) / allBlackGrid[i].length
      synth1Pattern[i] = notes[Math.floor(synth1Pattern[i])]
    }

    for (let i = 0; i < allRedGrid.length; i++) {
      synth2Pattern[i] =
        allRedGrid[i].reduce((a, b) => a + b, 0) / allRedGrid[i].length
      synth2Pattern[i] = notes[Math.floor(synth2Pattern[i])]
    }

    synth.start()
    synth2.start()

    // Setup phrases to loop
    synth1Phrase = new p5.Phrase(
      'synth1Sound',
      (time, value) => {
        if (value > 1) {
          //console.log('current value is ' + value)
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
        if (value > 1) {
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


  const isWithinBounds = (x, y) => {
    if (x >= 0 && x <= width && y >= 0 && y <= height) {
      return true;
    }
    return false;
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
