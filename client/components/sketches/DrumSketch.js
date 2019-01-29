const DrumSketch = p => {
  // Set height and width of canvas

  let canvasWidth = p.windowWidth / 1.25
  let canvasHeight = p.windowHeight / 3

  let beatLength = 16
  let cellWidth = canvasWidth / beatLength

  let canvas
  let hh
  let clap
  let bass
  let hPat, cPat, bPat, sPat
  let hPhrase, cPhrase, bPhrase
  let drums
  let bpmCTRL
  let myDiv

  // make library globally available
  window.p5 = p5

  p.preload = () => {
    hh = p.loadSound('drumSamples/hh_sample.mp3', () => {})
    clap = p.loadSound('drumSamples/clap_sample.mp3', () => {})
    bass = p.loadSound('drumSamples/bass_sample.mp3', () => {})
  }

  // Setup function
  p.setup = () => {
    p.userStartAudio()

    canvas = p.createCanvas(canvasWidth, canvasHeight)
    canvas.mousePressed(p.canvasPressed)

    hPat = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    cPat = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    bPat = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    sPat = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]

    hPhrase = new p5.Phrase(
      'hh',
      time => {
        hh.play(time)
      },
      hPat
    )
    cPhrase = new p5.Phrase(
      'clap',
      time => {
        clap.play(time)
      },
      cPat
    )
    bPhrase = new p5.Phrase(
      'bass',
      time => {
        bass.play(time)
      },
      bPat
    )

    drums = new p5.Part()

    drums.addPhrase(hPhrase)
    drums.addPhrase(cPhrase)
    drums.addPhrase(bPhrase)
    drums.addPhrase('seq', p.sequence, sPat)

    bpmCTRL = p.createSlider(30, 200, 80, 1)
    bpmCTRL.position(10, 70)
    bpmCTRL.input(() => {
      drums.setBPM(bpmCTRL.value())
    })
    drums.setBPM('80')

    p.drawMatrix()
  }

  p.keyPressed = () => {
    if (p.key === ' ') {
      if (hh.isLoaded() && clap.isLoaded() && bass.isLoaded()) {
        if (!drums.isPlaying) {
          drums.metro.metroTicks = 0 // restarts playhead at beginning [0]
          drums.loop()
        } else {
          drums.stop()
        }
      }
    }
  }

  p.canvasPressed = () => {
    let rowClicked = p.floor(3 * p.mouseY / canvasHeight)
    let indexClicked = p.floor(16 * p.mouseX / canvasWidth)
    if (rowClicked === 0) {
      hPat[indexClicked] = p.invert(hPat[indexClicked])
    } else if (rowClicked === 1) {
      cPat[indexClicked] = p.invert(cPat[indexClicked])
    } else if (rowClicked === 2) {
      bPat[indexClicked] = p.invert(bPat[indexClicked])
    }

    p.drawMatrix()
  }

  p.invert = bitInput => {
    return bitInput ? 0 : 1
  }

  // Draw function
  p.drawMatrix = () => {
    p.background('white')
    p.stroke('black')
    p.strokeWeight(4)
    p.fill('black')
    for (let i = 0; i < beatLength + 1; i++) {
      // startx, starty, endx, endy
      p.line(i * cellWidth, 0, i * cellWidth, canvasHeight)
    }

    for (let i = 0; i < 4; i++) {
      p.line(0, i * canvasHeight / 3, canvasWidth, i * canvasHeight / 3)
    }

    p.noStroke()

    for (let i = 0; i < beatLength; i++) {
      if (hPat[i] === 1) {
        p.ellipse(i * cellWidth + 0.5 * cellWidth, canvasHeight / 6, 10)
      }
      if (cPat[i] === 1) {
        p.ellipse(i * cellWidth + 0.5 * cellWidth, canvasHeight / 2, 10)
      }
      if (bPat[i] === 1) {
        p.ellipse(i * cellWidth + 0.5 * cellWidth, canvasHeight * 5 / 6, 10)
      }
    }
  }

  p.sequence = (time, beatIndex) => {
    setTimeout(() => {
      // syncs up the timing so the beats and the playhead are in sync
      p.drawMatrix()
      p.drawPlayhead(beatIndex)
    }, time * 1000)
  }

  p.drawPlayhead = beatIndex => {
    p.stroke('blue')
    p.fill(255, 0, 0, 20)
    p.rect((beatIndex - 1) * cellWidth, 0, cellWidth, canvasHeight)
  }
}

export default DrumSketch
