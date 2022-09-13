import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

// firebase init
const firebaseConfig = {
  apiKey: "AIzaSyCTXsyn1E4n5vYkNkTwOVDfXTSByWGfzxA",
  authDomain: "conquesttiles.firebaseapp.com",
  projectId: "conquesttiles",
  storageBucket: "conquesttiles.appspot.com",
  messagingSenderId: "349921176545",
  appId: "1:349921176545:web:6c3db9558780652f6980a0",
  measurementId: "G-C4QLF4V4L2"
}
firebase.initializeApp(firebaseConfig)

// utils
const db = firebase.firestore()
const auth = firebase.auth()

// collection references
const usersCollection = db.collection('users')
const postsCollection = db.collection('posts')
const commentsCollection = db.collection('comments')
const likesCollection = db.collection('likes')
const playerTeamCollection = db.collection('playerTeamCollection')

// export utils/refs
export {
  db,
  auth,
  usersCollection,
  postsCollection,
  commentsCollection,
  likesCollection,
  playerTeamCollection,
}
