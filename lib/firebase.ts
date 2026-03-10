'use client'

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, type Auth, type UserCredential } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === 'undefined') return null
  if (getApps().length > 0) return getApps()[0] as FirebaseApp
  const hasConfig = firebaseConfig.apiKey && firebaseConfig.projectId
  if (!hasConfig) return null
  return initializeApp(firebaseConfig)
}

export function getFirebaseAuth(): Auth | null {
  const app = getFirebaseApp()
  if (!app) return null
  return getAuth(app)
}

export async function signInWithGoogle(): Promise<string | null> {
  const auth = getFirebaseAuth()
  if (!auth) {
    throw new Error('Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* env variables.')
  }
  const provider = new GoogleAuthProvider()
  const result: UserCredential = await signInWithPopup(auth, provider)
  const idToken = await result.user.getIdToken()
  return idToken
}

export function isFirebaseConfigured(): boolean {
  return !!(typeof window !== 'undefined' && process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)
}
