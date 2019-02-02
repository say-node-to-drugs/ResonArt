export const saveCanvasToFirebase = (p, canvasToSave, mycanvas, png) => {
  console.log('SAVE CLICK ACCOUNT: ', p.firebase.auth.currentUser)
  p.saveCanvas(canvasToSave, 'myCanvas', 'png')
}
