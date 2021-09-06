import React,{useState,useContext} from "react";
import {Link, useHistory} from 'react-router-dom'
import {UserContext} from '../../App'
import M from "materialize-css"
import validator from "validator"

const Login = () => {
    const {state, dispatch} = useContext(UserContext)
    const history = useHistory()
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [passwordIsVisible,setPasswordIsVisible] = useState(false)

    const PostData = () => {
        console.log()
        if(validator.isEmail(email)===false){
            M.toast({html:'invalid email',classes:"red"})
            return
        }
        fetch("/signIn",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email:email,
                password:password
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            if(data.error){
                M.toast({html: data.error,classes:"red"})
                return
            }if(data){
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type:"USER", payload: data.user})
                M.toast({html:"Sucesfully signedIn",classes:"green"})
                history.push("/")
            }
        }).catch(err=>
            console.log(err)
        )
    }
    return (
            <div className="card auth-card input-field" style={{margin:"100px auto"}}>
                <h2>Instagram</h2>
                <input
                type="text"
                placeholder="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                />
                <div style={{display:"flex",flexDirection:"row",alignItems:"baseline"}}>
                <input
                type={passwordIsVisible ?"text" :"password"}
                placeholder="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                />
                {passwordIsVisible ? <i class="material-icons" onClick={() => {setPasswordIsVisible(false)}}>visibility</i> : <i class="material-icons" onClick={()=>{setPasswordIsVisible(true)}}>visibility_off</i>}
                </div>
                <button className="btn waves-effect waves-light #42a5f5 blue lighten-1"
                onClick={()=>PostData()}>
                Log In
                </button>
                <div style={{display:"flex",alignItems:"baseline",justifyContent:"center"}}>
                    <h6>Don't have an account</h6>
                    <Link to="/signup" style={{marginLeft:"8px"}}><p style={{color:"blue"}}>Sign Up</p></Link>
                </div>
                <div style={{display:"flex",alignItems:"baseline",justifyContent:"center"}}>
                    <Link to="/reset" style={{marginLeft:"8px"}}><p style={{color:"blue"}}>Forgot password?</p></Link>
                </div>
            </div>
     );
}
 
export default Login;