import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from "firebase/firestore"
import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBkUHWaRh0fZ1qQ0xRbDYg3GyH5VKa5BeU",
    authDomain: "whatsapp-clone-d8d29.firebaseapp.com",
    projectId: "whatsapp-clone-d8d29",
    storageBucket: "whatsapp-clone-d8d29.appspot.com",
    messagingSenderId: "94606838171",
    appId: "1:94606838171:web:30ce285fa820a5f40bb93e"
  };



  const firebaseApp = initializeApp(firebaseConfig);
  const auth=getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);
  const provider = new GoogleAuthProvider();

  export {db,auth,provider};
