import preloadBlankCanvas from './preloadBlankCanvas.js'

export const loadCanvasFromFirebase = p => {
  const userRef = p.firebase.user(p.firebase.auth.currentUser.uid)
  const userCanvas = userRef.child('canvas')
  let sortedSnapshot = []

  userCanvas.on('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var childData = childSnapshot.val()
      sortedSnapshot.push(childData.canvas.imageData)
    })
  })

  console.log('ALL IMAGE OBJECTS FROM USER PROFILE: ', sortedSnapshot)
  console.log('FIRST IMAGE OBJECT FROM USER PROFILE: ', sortedSnapshot[0])

  return sortedSnapshot[0]
}
