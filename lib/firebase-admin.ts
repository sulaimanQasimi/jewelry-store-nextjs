import { getApps, getApp, initializeApp, cert, type App } from 'firebase-admin/app'
import { getAuth, type DecodedIdToken } from 'firebase-admin/auth'

function getFirebaseAdminApp(): App | null {
  if (getApps().length > 0) return getApp() as App
  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  if (!projectId || !clientEmail || !privateKey) return null
  try {
    return initializeApp({
      credential: cert({ projectId, clientEmail, privateKey })
    })
  } catch {
    return null
  }
}

export async function verifyFirebaseIdToken(idToken: string): Promise<DecodedIdToken | null> {
  const app = getFirebaseAdminApp()
  if (!app) return null
  try {
    const auth = getAuth(app)
    const decoded = await auth.verifyIdToken(idToken)
    return decoded
  } catch {
    return null
  }
}

export function isFirebaseAdminConfigured(): boolean {
  return !!(
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  )
}
