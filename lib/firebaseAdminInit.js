import admin from 'firebase-admin'

import serviceAccount from '../server/serviceAccountKey'

export default function firebaseAdminInit() {
  if (admin.apps.length > 0) {
    return
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
}