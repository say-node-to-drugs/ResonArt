import preloadBlankCanvas from './preloadBlankCanvas.js'

const fireObjectToArray = (snapshot, color) => {
  return snapshot.map(element => {
    let newArray = []
    for (let key in element) {
      if (element[key] === -1) {
        element[key] = []
      } else {
        element[key] = [element[key]]
      }
      newArray.push(element[key])
    }
    console.log('NEW ARRAY: ', color, newArray)
    return newArray
  })
}

export const loadCanvasFromFirebase = p => {
  const userRef = p.firebase.user(p.firebase.auth.currentUser.uid)
  const userCanvas = userRef.child('canvas')
  let dataURLSnapshot = []
  let preBlackSnapshot = []
  let preRedSnapshot = []
  let preBlueSnapshot = []
  let blackSnapshot = []
  let redSnapshot = []
  let blueSnapshot = []

  userCanvas.on('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var childData = childSnapshot.val()
      dataURLSnapshot.push(childData.canvas.dataURL.imageData)
      preBlackSnapshot.push(childData.canvas.black)
      preRedSnapshot.push(childData.canvas.red)
      preBlueSnapshot.push(childData.canvas.blue)
    })
  })

  blackSnapshot = fireObjectToArray(preBlackSnapshot, 'black')
  redSnapshot = fireObjectToArray(preRedSnapshot, 'red')
  blueSnapshot = fireObjectToArray(preBlueSnapshot, 'blue')

  blackSnapshot = console.log(
    'ALL IMAGE OBJECTS FROM USER PROFILE: ',
    dataURLSnapshot
  )
  console.log('FIRST IMAGE OBJECT FROM USER PROFILE: ', dataURLSnapshot[0])
  console.log('ALL BLACK OBJECTS FROM USER PROFILE: ', blackSnapshot)
  console.log('FIRST BLACK OBJECT FROM USER PROFILE: ', blackSnapshot[0])

  return [dataURLSnapshot[0], blackSnapshot[0], redSnapshot[0], blueSnapshot[0]]
}

/*
.then(() => {
  blackSnapshot = fireObjectToArray(preBlackSnapshot, 'black')
  redSnapshot = fireObjectToArray(preRedSnapshot, 'red')
  blueSnapshot = fireObjectToArray(preBlueSnapshot, 'blue')
})
.catch(error => {
  console.log(error)
})
*/
