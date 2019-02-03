export const loadCanvasFromFirebase = (p, canvasToLoad) => {
  p.firebase.user(p.firebase.auth.currentUser.uid).on('value', snapshot => {
    const userObject = snapshot.val()
    console.log('SAVE CLICK USER: ', userObject)
  })

  const userRef = p.firebase.user(p.firebase.auth.currentUser.uid)
  const userCanvas = userRef.child('canvas')
}
