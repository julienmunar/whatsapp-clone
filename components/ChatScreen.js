import React, { useRef, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import styled from 'styled-components'
import { auth } from '../firebase'
import { useRouter } from 'next/router'
import { Avatar } from '@mui/material'
import { IconButton } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import getRecipientEmail from '../utils/getRecipientEmail'
import { useCollection } from 'react-firebase-hooks/firestore'
import { addDoc, collection, setDoc, Timestamp, doc, where, query, onSnapshot, orderBy } from 'firebase/firestore'
import { db } from '../firebase'
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import MicIcon from '@mui/icons-material/Mic';
import Message from './Message'
import TimeAgo from 'timeago-react';

const ChatScreen = ({ chat, messages }) => {
  const [user] = useAuthState(auth)
  const router = useRouter()
  const [input, setInput] = useState("")
  const endOFMessagRef=useRef(null)
  const MessageSnapshotRef = query(collection(db, `chats/${router.query.id}/messages`), orderBy("timestamp", "asc"))

  const [messagesSnapShot] = useCollection(
    MessageSnapshotRef,
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );


  //GET RECIPIENT INFO 
  const userChatRef = query(collection(db, 'users'), where('email', '==', getRecipientEmail(chat.users, user)))
  const [recipientSnapShot] = useCollection(userChatRef)
  const recipient = recipientSnapShot?.docs[0]?.data()
  const RecipientDate = new Date(recipient?.lastSeen?.seconds * 1000)


  //RECIPIENT EMAIL
  const recipientEmail = getRecipientEmail(chat.users, user)

  //SHOW MESSAGES
  const showMessages = () => {
    if (messagesSnapShot) {
      return messagesSnapShot?.docs.map((message) =>
        <Message
          key={message.id}
          user={message.data().user}
          message={{ ...message.data() }} />)
    } else {
      return JSON.parse(messages).map((message) => <Message
        key={message.id}
        user={message.user}
        message={{ ...message }} />)
    }
  }

//SCROLL TO BOTTOM FUNCTION AFTER MESSAGE SENT

  const ScrollToBottom =()=>{
    endOFMessagRef.current.scrollIntoView({
      behavior:"smooth",
      block:"start"
    })
  }

  //SEND MESSAGES
  const sendMessage = async (e) => {
    e.preventDefault()

    //Last Seen ... 
    const userRef = doc(db, `users/${user.uid}`)
    user && setDoc(userRef, { lastSeen: Timestamp.now() }, { merge: true })

    try {
      await addDoc(collection(db, `chats/${router.query.id}/messages`), {
        timestamp: Timestamp.now(),
        message: input,
        user: user.email,
        photoURL: user.photoURL
      })
      setInput("")
      ScrollToBottom()
    }
    catch {

    }

  }



  return (
    <Container>
      <Header>
        {recipient ? (<Avatar src={recipient?.photoURL} />) : (<Avatar src={recipientEmail[0]} />)}

        <HeaderInformation>
          <h3>{getRecipientEmail(chat.users, user)}</h3>
          <p>Last active:{' '}
            {RecipientDate ? (<TimeAgo datetime={RecipientDate} />) : "Unaivailable"}

          </p>
        </HeaderInformation>
        <HeaderIcons>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </HeaderIcons>

      </Header>
      <MessageContainer>
        {showMessages()}
        <EndofMessage ref={endOFMessagRef}/>
      </MessageContainer>
      <InputContainer>
        <InsertEmoticonIcon />
        <Input value={input} onChange={(e) => { setInput(e.target.value) }} />
        <button hidden disabled={!input} onClick={sendMessage}>Send Message</button>
        <MicIcon />
      </InputContainer>

    </Container>
  )
}

export default ChatScreen

const Container = styled.div`


`

const Header = styled.div`
display:flex;
position:sticky;
background-color:white ;
z-index:100 ;
top:0;
border-bottom:1px solid whitesmoke;
align-items:center;
height:80px;
padding:11px;

`

const HeaderInformation = styled.div`

margin-left:15px;
flex:1;
>h3{
  margin-bottom:3px;
}
>p{
  font-size:14px ;
  color:grey;
}

`

const HeaderIcons = styled.div``

const MessageContainer = styled.div`
padding:30px;
background-color:#e5ded8;
min-height:90vh ;
`

const EndofMessage = styled.div``

const InputContainer = styled.form`
display:flex;
align-items:center;
padding:10px;
position:sticky;
bottom:0;
background-color:white ;
z-index:100;
`
const Input = styled.input`
flex:1;
outline:none;
border:none;
background-color:whitesmoke ;
padding:20px;
margin:0 15px;
`