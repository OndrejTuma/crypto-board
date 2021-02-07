import firebase from 'firebase'

const firebaseSignOut = () => {
  return firebase.auth().signOut()
}

export default firebaseSignOut