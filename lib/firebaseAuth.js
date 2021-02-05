import firebase from 'firebase'

const firebaseAuth = (email, password) => {
  return firebase.auth().signInWithEmailAndPassword(email, password)
}

export default firebaseAuth