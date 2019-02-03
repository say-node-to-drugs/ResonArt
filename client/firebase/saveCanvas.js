export const saveCanvasToFirebase = p => {
  const userRef = p.firebase.user(p.firebase.auth.currentUser.uid)
  const userCanvas = userRef.child('canvas')

  p.saveFrames('canvas', 'png', 1, 1, function(im) {
    userCanvas.push({canvas: im[0]})
  })

  //------------------------------------------------------------------
  //THIS FUNCTION BELOW EXISTS ONLY FOR THE CONSOLE LOG, AND CAN EVENTUALLY BE REMOVED.

  p.firebase.user(p.firebase.auth.currentUser.uid).on('value', snapshot => {
    const userObject = snapshot.val()
    console.log('SAVED FILE FOR USER: ', userObject)
  })
}
