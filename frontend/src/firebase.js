import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "dora-ai-e385a.firebaseapp.com",
  projectId: "dora-ai-e385a",
  storageBucket: "dora-ai-e385a.firebasestorage.app",
  messagingSenderId: "238266201314",
  appId: "1:238266201314:web:df2cfd337a048f8234dabb"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()
const githubProvider = new GithubAuthProvider()

export { auth, provider, githubProvider }