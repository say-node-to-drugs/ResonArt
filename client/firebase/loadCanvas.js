import preloadBlankCanvas from './preloadBlankCanvas.js'

const fireObjectToArray = (fireObject, color) => {
  return fireObject.map(element => {
    let newArray = []
    for (let key in element) {
      if (element[key] === -1) {
        element[key] = []
      } else {
        element[key] = [element[key]]
      }
      newArray.push(element[key])
    }
    return newArray
  })
}

export const loadCanvasFromFirebase = p => {
  if (!p.firebase.auth.currentUser) {
    return console.log('You must log in or sign up to save a canvas.')
  } else {
    let newObjectArray = []
    let filteredArray = []

    const userCanvas = p.firebase
      .user(p.firebase.auth.currentUser.uid)
      .child('canvas')

    userCanvas
      .once('value', snapshot => {
        for (let key in snapshot.val()) {
          newObjectArray.push(snapshot.val()[key])
        }
      })
      .then(() => {
        for (let i = 0; i < newObjectArray.length; i++) {
          filteredArray.push(newObjectArray[i].canvasData)
          console.log(filteredArray)
          filteredArray[i].black = fireObjectToArray(
            filteredArray[i].black,
            'black'
          )
          filteredArray[i].red = fireObjectToArray(filteredArray[i].red, 'red')
          filteredArray[i].blue = fireObjectToArray(
            filteredArray[i].blue,
            'blue'
          )
        }
        console.log('FILTERED: ', filteredArray)
        return [
          filteredArray[0].dataURL.imageData,
          filteredArray[0].black,
          filteredArray[0].red,
          filteredArray[0].blue
        ]
      })
      .catch(error => {
        console.log(error)
      })

    console.log('LOADED FILE FOR USER 2: ', filteredArray[0])
  }
}
