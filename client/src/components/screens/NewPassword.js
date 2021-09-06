import React,{useState,useEffect} from "react";
import {useHistory, useParams} from 'react-router-dom'
import M from "materialize-css"


const NewPassword = () => {
    const history = useHistory()
    const [password,setPassword] = useState("")
    const [confirmPassword,setConfirmPassword] = useState("")
    const [passwordIsVisible,setPasswordIsVisible] = useState(false)
    const [confirmPasswordIsVisible,setConfirmPasswordIsVisible] = useState(false)

    const {token} = useParams()
    
    const postUserDetails = () => {
    if(password !== confirmPassword){
        M.toast({html:'passwords do not match',classes:"red"})
        return
    }
    fetch("/new-pasword",{
        method:"post",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            token:token,
            newPassword:password,
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
                <div style={{display:"flex",flexDirection:"row",alignItems:"baseline"}}>
                <input
                type={passwordIsVisible ?"text" :"password"}
                placeholder="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                /> 
                {passwordIsVisible ? <i class="material-icons" onClick={() => {setPasswordIsVisible(false)}}>visibility</i> : <i class="material-icons" onClick={()=>{setPasswordIsVisible(true)}}>visibility_off</i>}
                </div>
                <div style={{display:"flex",flexDirection:"row",alignItems:"baseline"}}>
                <input
                type={confirmPasswordIsVisible ? "text" :"password"}
                placeholder="confirm password"
                value={confirmPassword}
                onChange={(e)=>setConfirmPassword(e.target.value)}
                />
                {confirmPasswordIsVisible ? <i className="material-icons" onClick={() => {setConfirmPasswordIsVisible(false)}}>visibility</i> : <i className="material-icons" onClick={() => {setConfirmPasswordIsVisible(true)}}>visibility_off</i>}
                </div>
                <button className="btn waves-effect waves-light #42a5f5 blue lighten-1"
                onClick={()=>postUserDetails()}>
                update password
                </button>
            </div>
     );
}
 
export default NewPassword;