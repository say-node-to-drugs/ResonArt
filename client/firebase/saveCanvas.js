export const saveCanvasToFirebase = (p, canvasToSave, mycanvas, png) => {
  //-----------------------------------------------------------------
  // THESE FUNCTIONS LOAD ALL USERS AND CURRENT USER
  // THESE ARE HERE FOR REFERENCE

  p.firebase.users().on('value', snapshot => {
    const usersObject = snapshot.val()

    const usersList = Object.keys(usersObject).map(key => ({
      ...usersObject[key],
      uid: key
    }))

    console.log('SAVE CLICK USERS: ', usersList)
  })

  p.firebase.user(p.firebase.auth.currentUser.uid).on('value', snapshot => {
    const userObject = snapshot.val()
    console.log('SAVE CLICK USER: ', userObject)
  })

  //-----------------------------------------------------------------
  //FUNCTIONS BELOW ARE WHAT ARE ACTUALLY NEEDED FOR SAVING TO DATABASE

  const userRef = p.firebase.user(p.firebase.auth.currentUser.uid)
  const userCanvas = userRef.child('canvas')

  p.saveFrames('canvas', 'png', 1, 1, function(im) {
    userCanvas.push({canvas: im[0]})
  })
}
