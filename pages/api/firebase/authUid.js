import admin from 'firebase-admin'

import firebaseAdminInit from '../../../lib/firebaseAdminInit'

export default async (req, res) => {
  const uid = req.body

  firebaseAdminInit()

  admin
    .auth()
    .verifyIdToken(uid)
    .then((decodedToken) => {
      const uid = decodedToken.uid

      res.status(200).json({ uid })
    })
    .catch(e => {
      res.status(400).json({ error: e.message })
    })
}
