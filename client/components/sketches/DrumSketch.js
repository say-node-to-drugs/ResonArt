let drums = new p5.Part()

const DrumSketch = p => {
  // Set height and width of canvas

  let width = p.windowWidth / 2 - 30
  let height = p.windowHeight / 6

  let beatLength = 16
  let cellWidth = width / beatLength

  let canvas
  let hh
  let clap
  let bass
  let hPat, cPat, bPat, sPat
  let hPhrase, cPhrase, bPhrase
  let bpmCTRL
  let bpmValue

  p.preload = () => {
    hh = p.loadSound('drumSamples/hh_sample.mp3', () => {})
    clap = p.loadSound('drumSamples/clap_sample.mp3', () => {})
    bass = p.loadSound('drumSamples/bass_sample.mp3', () => {})
  }

  // Setup function
  p.setup = () => {
    p.userStartAudio()

    canvas = p.createCanvas(width, height)
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

    p.draw()
  }

  p.windowResized = () => {
    width = p.windowWidth / 2 - 30
    height = p.windowHeight / 6
    cellWidth = width / beatLength
    p.resizeCanvas(width, height)
    p.draw()
  }

  p.bpmValue = () => {
    p.fill(0)
    p.text('ichi', 100, 100)
  }

  p.canvasPressed = () => {
    let rowClicked = p.floor(3 * p.mouseY / height)
    let indexClicked = p.floor(16 * p.mouseX / width)
    if (rowClicked === 0) {
      hPat[indexClicked] = p.invert(hPat[indexClicked])
    } else if (rowClicked === 1) {
      cPat[indexClicked] = p.invert(cPat[indexClicked])
    } else if (rowClicked === 2) {
      bPat[indexClicked] = p.invert(bPat[indexClicked])
    }

    p.draw()
  }

  p.invert = bitInput => {
    return bitInput ? 0 : 1
  }

  // Draw function
  p.draw = () => {
    p.bpmValue()
    p.background('#284B63')
    p.stroke('white')
    p.strokeWeight(4)
    p.fill('white')
    for (let i = 0; i < beatLength + 1; i++) {
      // startx, starty, endx, endy
      p.line(i * cellWidth, 0, i * cellWidth, height)
    }

    for (let i = 0; i < 4; i++) {
      p.line(0, i * height / 3, width, i * height / 3)
    }

    p.noStroke()

    for (let i = 0; i < beatLength; i++) {
      if (hPat[i] === 1) {
        p.ellipse(i * cellWidth + 0.5 * cellWidth, height / 6, 10, 10, 10)
      }
      if (cPat[i] === 1) {
        p.ellipse(i * cellWidth + 0.5 * cellWidth, height / 2, 10, 10, 10)
      }
      if (bPat[i] === 1) {
        p.ellipse(i * cellWidth + 0.5 * cellWidth, height * 5 / 6, 10, 10, 10)
      }
    }

    if (drums.loadDrums) {
      hPat = drums.phrases[0].sequence
      cPat = drums.phrases[1].sequence
      bPat = drums.phrases[2].sequence
      sPat = drums.phrases[3].sequence
      drums.loadDrums = false
    }
  }

  p.sequence = (time, beatIndex) => {
    setTimeout(() => {
      // syncs up the timing so the beats and the playhead are in sync
      p.draw()
      p.drawPlayhead(beatIndex)
    }, time * 1000)
  }

  p.drawPlayhead = beatIndex => {
    p.stroke('yellow')
    p.fill(255, 0, 0, 150)
    p.rect((beatIndex - 1) * cellWidth, 0, cellWidth, height)
  }
}

export {DrumSketch, drums}
