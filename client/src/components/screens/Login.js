import React,{useState,useContext} from "react";
import {useHistory} from 'react-router-dom'
import {UserContext} from '../../App'
import M from "materialize-css"

const Login = () => {
    const {state, dispatch} = useContext(UserContext)
    const history = useHistory()
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")

    const PostData = () => {
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
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
                <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                />
                <button className="btn waves-effect waves-light #42a5f5 blue lighten-1"
                onClick={()=>PostData()}>
                Submit
                </button>
            </div>
     );
}
 
export default Login;