import { Avatar } from '@mui/material'
import React from 'react'
import styled from 'styled-components'
import { useCollection } from 'react-firebase-hooks/firestore'
import { query,collection,where} from 'firebase/firestore'
import { db } from '../firebase'
import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase'
import getRecipientEmail from '../utils/getRecipientEmail'
const Chat = ({id,user}) => {

    const router = useRouter()
    const [userLoggedIn] = useAuthState(auth)
    const recipientEmail=getRecipientEmail(user,userLoggedIn)
    const enterChat=()=>{
        router.push(`/chat/${id}`)
    }

    const userChatRef=query(collection(db,'users'),where('email','==',recipientEmail))

    const [recipientSnapShot] = useCollection(userChatRef)
    const recipient = recipientSnapShot?.docs?.[0]?.data()
  return (
    <Container onClick={enterChat}>
        {recipient ? (<UserAvatar  src={recipient?.photoURL} alt=""/>): (<UserAvatar>{recipientEmail[0]}</UserAvatar>)}
        
        <p>{recipientEmail}</p>
    </Container>
  )
}

export default Chat


const Container=styled.div`
display:flex;
align-items:center;
cursor: pointer;
padding:15px;
word-break:break-word;

:hover {
    background-color:#e9eaeb ;
}

`
const UserAvatar=styled(Avatar)`
margin:5px 15px 5px 5px;
`
