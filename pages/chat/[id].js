import React from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import Head from 'next/head'
import SideBar from '../../components/SideBar'
import ChatScreen from '../../components/ChatScreen'
import { doc, getDocs, getDoc, query, collection, orderBy, Timestamp } from "firebase/firestore";
import { auth, db } from '../../firebase'
import { async } from '@firebase/util'
import { useAuthState } from 'react-firebase-hooks/auth'
import getRecipientEmail from '../../utils/getRecipientEmail'














const Chat = ({ messages, chat }) => {

  const [user] = useAuthState(auth)


  const router = useRouter()



  return (
    <Container>

      <Head>
        <title>Chat with {getRecipientEmail(chat.users, user)}</title>
      </Head>
      <SideBar />
      <ChatContainer>
        <ChatScreen chat={chat} messages={messages} />
      </ChatContainer>
    </Container>
  )
}

export default Chat








//Server SIDE FETCH

export async function getServerSideProps(context) {

  //Retrieve Messages
  const MessageRef = query(collection(db, `chats/${context.query.id}/messages`))
  // const Messages = await getDocs(MessageRef).then((result)=>result.docs.map((doc)=>({id:doc.id, ...doc.data()})).map((message)=>({...message,timestamp:Timestamp.now()})))

  const Messages = await (await getDocs(MessageRef)).docs.map((data) => ({ id: data.id, ...data.data() })).map((message) => ({ ...message, timestamp: Timestamp.now() }))


  //Retrieves Chats 
  const chatRes = doc(db, `chats/${context.query.id}`)
  const chat = await getDoc(chatRes).then((result) => result.data())

  return {
    props: {
      chat: chat,
      messages: JSON.stringify(Messages),

    }

  }
}





const Container = styled.div`
display:flex;
`
const ChatContainer = styled.div`
flex:1;
overflow:scroll;
height:100vh;
::-webkit-scrollbar{
  display:none;
}
`

