import firebase from 'firebase'

const firebaseGetCurrentUser = () => {
  return firebase.auth().currentUser
}

export default firebaseGetCurrentUser