import Head from 'next/head'
import React from 'react'
import styled from 'styled-components'
import { IconButton,Button } from '@mui/material';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, provider } from '../firebase';



const Login = () => {

    const signIn=()=>{
signInWithPopup(auth,provider).catch(error=>console.log(error))
    }
  return (

    <Container>
        <Head>
            <title>Login</title>
        </Head>
        <LoginContainer>
        <Logo src='http://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png'/>
        <Button variant='outlined' onClick={signIn}>Sign in with Google</Button>
        </LoginContainer>

    </Container>
  )
}

export default Login



const Container=styled.div`
display:grid;
place-items:center ;
height:100vh;
background-color:whitesmoke;
`


const LoginContainer=styled.div`
padding:100px;
display:flex;
flex-direction:column ;
background-color:white ;
border-radius:5px ;
align-items:center;
box-shadow:0px 4px 14px -3px rgba(0,0,0,0.7) ;
`

const Logo=styled.img`
width:200px;
object-fit:contain ;
margin-bottom:50px;
`