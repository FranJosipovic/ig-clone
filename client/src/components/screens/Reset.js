import React,{useState,useEffect} from "react";
import {useHistory} from 'react-router-dom'
import M from "materialize-css"
import validator from "validator";

const Reset = () => {  
    const history = useHistory()
    const [email,setEmail] = useState("")

    const postUserDetails = () => {
    if(validator.isEmail(email)===false){
        M.toast({html:'invalid email',classes:"red"})
        return
    }
    fetch("/password-reset",{
        method:"post",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            email:email
        })
    }).then(res=>res.json())
    .then(data=>{
        if(data.error){
            M.toast({html: data.error,classes:"red"})
        }else{
            M.toast({html: data.message,classes:"green"})
            history.push("/login")
        }
    }).catch(err=>
        console.log(err)
    )}
    return ( 
            <div  className="card auth-card input-field" style={{margin:"100px auto"}}>
                <h2>Instagram</h2>
                <input
                type="text"
                placeholder="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                />
                <button className="btn waves-effect waves-light #42a5f5 blue lighten-1"
                onClick={()=>postUserDetails()}>
                Reset password
                </button>
            </div>
     );
}
 
export default Reset;