import {drums} from '../components/sketches/DrumSketch'

const arrayBaser = array => {
  return array.map(element => {
    if (element.length < 1) {
      return [-1]
    }
    return element
  })
}

export const saveCanvasToFirebase = (p, black, red, blue) => {
  if (!p.firebase.auth.currentUser) {
    return console.log('You must log in or sign up to save a canvas.')
  } else {
    console.log('DRUMS: ', drums.phrases)
    const userRef = p.firebase.user(p.firebase.auth.currentUser.uid)
    const userCanvas = userRef.child('canvas')

    black = arrayBaser(black)
    red = arrayBaser(red)
    blue = arrayBaser(blue)
    let hh = arrayBaser(drums.phrases[0].sequence)
    let clap = arrayBaser(drums.phrases[1].sequence)
    let bass = arrayBaser(drums.phrases[2].sequence)
    let seq = arrayBaser(drums.phrases[3].sequence)

    let saveCanvasFilename = prompt(
      'Please enter the name of your canvas.',
      'My Awesome Canvas!'
    )

    p.saveFrames('canvas', 'png', 1, 1, function(im) {
      userCanvas.push({
        canvasData: {
          filename: saveCanvasFilename,
          dataURL: im[0],
          black,
          red,
          blue,
          hh,
          clap,
          bass,
          seq
        }
      })
    })

    //------------------------------------------------------------------
    //THIS FUNCTION BELOW EXISTS ONLY FOR THE CONSOLE LOG, AND CAN EVENTUALLY BE REMOVED.

    p.firebase.user(p.firebase.auth.currentUser.uid).on('value', snapshot => {
      const userObject = snapshot.val()
      console.log('SAVED FILE FOR USER: ', userObject)
    })
  }
}
