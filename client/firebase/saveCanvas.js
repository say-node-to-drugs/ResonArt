const arrayBaser = array => {
  return array.map(element => {
    if (element.length < 1) {
      return [-1]
    }
    return element
  })
}

export const saveCanvasToFirebase = (p, black, red, blue) => {
  const userRef = p.firebase.user(p.firebase.auth.currentUser.uid)
  const userCanvas = userRef.child('canvas')
  console.log('BLACK 1: ', black)

  let revBlack = arrayBaser(black)
  let revRed = arrayBaser(red)
  let revBlue = arrayBaser(blue)

  console.log('BLACK 2: ', revBlack)

  p.saveFrames('canvas', 'png', 1, 1, function(im) {
    userCanvas.push({canvas: {dataURL: im[0], revBlack, revRed, revBlue}})
  })

  //------------------------------------------------------------------
  //THIS FUNCTION BELOW EXISTS ONLY FOR THE CONSOLE LOG, AND CAN EVENTUALLY BE REMOVED.

  p.firebase.user(p.firebase.auth.currentUser.uid).on('value', snapshot => {
    const userObject = snapshot.val()
    console.log('SAVED FILE FOR USER: ', userObject)
  })
}
