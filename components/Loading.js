import React from 'react'
import {Circle} from 'better-react-spinkit'
import { grid } from '@mui/system'
const Loading = () => {
  return (
    <center style={{display:"grid", placeItems:"center", height:"100vh"}}>
        <div>
       
            <img  src='http://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png' style={{marginBottom:10}} height={200}/>
            <Circle size={60} color="#3CBC28"/>
        </div>
    </center>
  )
}

export default Loading