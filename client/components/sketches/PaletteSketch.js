const PaletteSketch = p => {
  let recorder, soundFile, canvas
  let prevX, prevY
  let state = 0 // mousePress will increment from Record, to Stop, to Play
  let synth, synth2
  let color = 'black'
  let synth1Phrase, synth2Phrase
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
  let recordArrayRed = []
  let recordArrayBlack = []

  let width = window.innerWidth * (6 / 10)
  let height = window.innerHeight * (4 / 10)

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

    canvas = p.createCanvas(width, height)
    canvas.parent('sketchPad')
    canvas.style('display', 'block')
    canvas.class('palette')

    p.background(255)
    p.fill(0)
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
    startRecord = p.createButton('Start Record')
    startRecord.onclick = () => {
      console.log('start record')
      recorder.record(soundFile)
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

  /*
  ----------------------------------------------------------
                    Mouse Event Handlers
  ----------------------------------------------------------
  */
  p.mouseDragged = () => {
    console.log(color)
    let rowClicked = 14 - p.floor(14 * (p.mouseY / p.height))
    let indexClicked = p.floor(16 * p.mouseX / p.width)
    console.log(`${indexClicked},${rowClicked}`)

    if (color === 'black') {
      if (synth1Pattern[indexClicked] !== notes[rowClicked]) {
        synth1Pattern[indexClicked] = notes[rowClicked]
      }
      console.log(synth1Pattern)
    }
    if (color === 'red') {
      if (synth2Pattern[indexClicked] !== notes[rowClicked]) {
        synth2Pattern[indexClicked] = notes[rowClicked]
      }
      console.log(synth2Pattern)
    }
    p.draw()
  }

  p.mousePressed = () => {
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
  p.mouseReleased = () => {
    // Stop playing synth
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

  document.addEventListener(
    'keydown',
    function(event) {
      console.log('space was pressed !!!!')
      if (event.key === ' ') {
        if (!instruments.isPlaying) {
          instruments.metro.metroTicks = 0 // restarts playhead at beginning [0]
          p.playingCanvas()
          instruments.loop()
        } else {
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
  p.playingCanvas = () => {
    synth.start()

    synth2.start()
    console.log('synth1Pattern is ')
    console.log(synth1Pattern)
    // Setup phrases to loop
    synth1Phrase = new p5.Phrase(
      'synth1Sound',
      (time, value) => {
        if (value > 1) {
          console.log('current value is ' + value)
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
