import firebase from 'firebase'

import firebaseConfig from '../consts/firebaseConfig'

export default function firebaseInit() {
  if (firebase.apps.length > 0) {
    return
  }

  firebase.initializeApp(firebaseConfig)
}