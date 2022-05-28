import '../styles/globals.css'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import Login from './Login';
import Loading from '../components/Loading';
import { useEffect } from 'react';
import { doc, setDoc, Timestamp, updateDoc } from "firebase/firestore"; 

function MyApp({ Component, pageProps }) {

  const [user, loading, error] = useAuthState(auth);
    
  useEffect(()=>{
    if(user){
      const userRef=doc(db,'users',`${user.uid}`)
      setDoc(userRef,{
        email:user.email,
        lastseen:Timestamp.now(),
        photoURL:user.photoURL

      }, { merge:true })
    }


  },[user])

  console.log(user)
  if (loading) return <Loading/>
  if(!user) return <Login/>



  return <Component {...pageProps} />
}

export default MyApp
