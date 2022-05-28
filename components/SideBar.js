import React, { useState } from 'react'
import styled from 'styled-components'
import Avatar from '@mui/material/Avatar';
import { IconButton, Button } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChatIcon from '@mui/icons-material/Chat';
import SearchIcon from '@mui/icons-material/Search';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { addDoc,collection, query, where } from 'firebase/firestore';
import * as EmailValidator from 'email-validator';
import { useCollection } from 'react-firebase-hooks/firestore';
import { getDomainLocale } from 'next/dist/shared/lib/router/router';
import Chat from './Chat';
const SideBar = () => {

    const [user, loading, error] = useAuthState(auth);
    const userChatRef=query(collection(db,'chats'),where('users','array-contains',user.email))
    const [chatSnapShot]=useCollection(userChatRef)

    const createChat = async () => {
        const input = prompt('Please enter an email address for the user you wish  to chat with')
        console.log(chatAlreadyExists(input))
        if (!input) {
            return null
        }
        if (EmailValidator.validate(input) && !chatAlreadyExists(input)&& input !==user.email) {
            // Need to add the chat into th DB 'chat'Collection
         
            try{
                await addDoc(collection(db,'chats'),{
                    users:[user.email,input]
                })
            }
            catch(error){console.log(error)}
        }



    }



    const chatAlreadyExists=(testuser)=>chatSnapShot?.docs.find(chat=>chat.data().users.find(user=> user===testuser))!==undefined
   

    return ( 
        <Container>

            <Header>
                <UserAvatar src={ user.photoURL} alt=''  onClick={()=>{auth.signOut()}}/>
                <IconContainer>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>

                </IconContainer>

            </Header>
            <Search>
                <SearchIcon />
                <input placeholder='Search in chats' />
            </Search>
            <SideBarButton onClick={createChat}>Start a new chat</SideBarButton>
            {/* //SIDE BAR Container */}
            {chatSnapShot?.docs.map((chat) =><Chat key={chat.id} id={chat.id} user={chat.data().users} />)}
        </Container>
    )
}

export default SideBar


const Container = styled.div`
border-right:1px solid whitesmoke;
flex:0.45;
min-width:300px ;
max-width:350px ;
overflow-y:scroll ;
height:100vh;
::-webkit-scrollbar{
    display:none;
}
`

const Header = styled.div`
display:flex;
position:sticky;
top:0;
background-color:white ;
z-index:1;
justify-content:space-between;
align-items:center;
padding:15px;
height:80px;
border-bottom:1px solid whitesmoke;
`

const UserAvatar = styled(Avatar)`
cursor:pointer;
:hover{
    opacity:0.8;
}
`

const IconContainer = styled.div`

`
const Search = styled.div`
display:flex;
padding:20px;
border-radius:2px;
align-items:center;
>input{

    outline:none;
    border:none;
    flex:1;
}
`
const SideBarButton = styled(Button)`

text-transform:uppercase;
width:100%;
&&&{
    border-top:1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
    color:black;
}
`