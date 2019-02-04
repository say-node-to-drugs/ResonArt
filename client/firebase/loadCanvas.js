import preloadBlankCanvas from './preloadBlankCanvas.js'

const fireObjectToArray = (fireObject, color) => {
  return fireObject.map(element => {
    let newArray = []
    for (let key in element) {
      if (element[key] === -1) {
        element[key] = []
      } else {
        if (element[key] === 0) {
          element[key] = [0]
        } else {
          element[key] = [element[key]]
        }
        newArray.push(element[key])
      }
    }
    return newArray
  })
}

export const loadCanvasFromFirebase = p => {
  if (!p.firebase.auth.currentUser) {
    return console.log('You must log in or sign up to save a canvas.')
  } else {
    p.firebase.loaded = []
    let newObjectArray = []

    const userCanvas = p.firebase
      .user(p.firebase.auth.currentUser.uid)
      .child('canvas')

    return userCanvas
      .once('value', async function(snapshot) {
        let snapshotObject = await snapshot.val()
        for (let key in snapshotObject) {
          newObjectArray.push(snapshotObject[key])
        }
        return newObjectArray
      })
      .then(() => {
        for (let i = 0; i < newObjectArray.length; i++) {
          p.firebase.loaded.push(newObjectArray[i].canvasData)
          p.firebase.loaded[i].black = fireObjectToArray(
            p.firebase.loaded[i].black,
            'black'
          )
          p.firebase.loaded[i].red = fireObjectToArray(
            p.firebase.loaded[i].red,
            'red'
          )
          p.firebase.loaded[i].blue = fireObjectToArray(
            p.firebase.loaded[i].blue,
            'blue'
          )
          p.firebase.loaded[i].bass = fireObjectToArray(
            p.firebase.loaded[i].bass,
            'bass'
          )
          p.firebase.loaded[i].clap = fireObjectToArray(
            p.firebase.loaded[i].clap,
            'clap'
          )
          p.firebase.loaded[i].hh = fireObjectToArray(
            p.firebase.loaded[i].hh,
            'hh'
          )
          p.firebase.loaded[i].seq = fireObjectToArray(
            p.firebase.loaded[i].seq,
            'seq'
          )
        }
        console.log('VALUE FROM LOAD COMPONENT: ', p.firebase.loaded)
        return p.firebase.loaded
      })
      .catch(error => {
        console.log(error)
      })
  }
}
