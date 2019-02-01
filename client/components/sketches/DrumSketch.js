let drums = new p5.Part()

const DrumSketch = p => {
  // Set height and width of canvas

  let canvasWidth = p.windowWidth / 2
  let canvasHeight = p.windowHeight / 6

  let beatLength = 16
  let cellWidth = canvasWidth / beatLength

  let canvas
  let hh
  let clap
  let bass
  let hPat, cPat, bPat, sPat
  let hPhrase, cPhrase, bPhrase
  let bpmCTRL

  p.preload = () => {
    hh = p.loadSound('drumSamples/hh_sample.mp3', () => {})
    clap = p.loadSound('drumSamples/clap_sample.mp3', () => {})
    bass = p.loadSound('drumSamples/bass_sample.mp3', () => {})
  }

  // Setup function
  p.setup = () => {
    p.userStartAudio()

    canvas = p.createCanvas(p.windowWidth / 2, p.windowHeight / 6)
    canvas.parent('drumMachine')
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
    bpmCTRL.input(() => {
      drums.setBPM(bpmCTRL.value())
    })
    drums.setBPM('80')
    bpmCTRL.parent('bpmCTRL')
    bpmCTRL.class('bpmCTRL')

    p.drawMatrix()
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth / 2, p.windowHeight / 6)
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
    let rowClicked = p.floor(3 * p.mouseY / (p.windowHeight / 6))
    let indexClicked = p.floor(16 * p.mouseX / (p.windowWidth / 2))
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
    p.background('blue')
    p.stroke('white')
    p.strokeWeight(4)
    p.fill('white')
    for (let i = 0; i < beatLength + 1; i++) {
      // startx, starty, endx, endy
      p.line(
        i * (p.windowWidth / 32),
        0,
        i * (p.windowWidth / 32),
        p.windowHeight / 6
      )
    }

    for (let i = 0; i < 4; i++) {
      p.line(
        0,
        i * (p.windowHeight / 6) / 3,
        p.windowWidth / 2,
        i * (p.windowHeight / 6) / 3
      )
    }

    p.noStroke()

    for (let i = 0; i < beatLength; i++) {
      if (hPat[i] === 1) {
        p.ellipse(
          i * (p.windowWidth / 32) + 0.5 * (p.windowWidth / 32),
          p.windowHeight / 6 / 6,
          10,
          10,
          10
        )
      }
      if (cPat[i] === 1) {
        p.ellipse(
          i * (p.windowWidth / 32) + 0.5 * (p.windowWidth / 32),
          p.windowHeight / 6 / 2,
          10,
          10,
          10
        )
      }
      if (bPat[i] === 1) {
        p.ellipse(
          i * (p.windowWidth / 32) + 0.5 * (p.windowWidth / 32),
          p.windowHeight / 6 * 5 / 6,
          10,
          10,
          10
        )
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
    p.stroke('yellow')
    p.fill(255, 0, 0, 150)
    p.rect(
      (beatIndex - 1) * (p.windowWidth / 32),
      0,
      p.windowWidth / 32,
      p.windowHeight / 6
    )
  }
}

export {DrumSketch, drums}
