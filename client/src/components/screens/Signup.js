import React,{useState,useEffect} from "react";
import {useHistory} from 'react-router-dom'
import M from "materialize-css"
import validator from "validator";

const SignUp = () => {  
    const history = useHistory()
    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [confirmPassword,setConfirmPassword] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState(undefined)
    const [passwordIsVisible,setPasswordIsVisible] = useState(false)
    const [confirmPasswordIsVisible,setConfirmPasswordIsVisible] = useState(false)

    useEffect(()=>{
        if(url){
            postUserDetails()
        }
    },[url])
    const postUserDetails = () => {
    if(validator.isEmail(email)===false){
        M.toast({html:'invalid email',classes:"red"})
        return
    }
    if(password !== confirmPassword){
        M.toast({html:'passwords do not match',classes:"red"})
        return
    }
    fetch("/signUp",{
        method:"post",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            name:name,
            email:email,
            password:password,
            pic:url
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
            

    const postDetails = () => {
        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","insta-clone")
        data.append("cloud_name","fran123")
        fetch("https://api.cloudinary.com/v1_1/fran123/image/upload",{
            method : 'POST',
            body:data
        }).then(res=>res.json())
        .then(data=>{
            setUrl(data.url)
        })
        .catch(err=>console.log(err))
    }

    const postUser = () => {
        if(image){
            postDetails()
        }else{
            postUserDetails()
        }
    }

    return ( 
            <div  className="card auth-card input-field" style={{margin:"100px auto"}}>
                <h2>Instagram</h2>
                <input
                    type="text"
                    placeholder="name"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                />
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
                <div style={{display:"flex",flexDirection:"row",alignItems:"baseline"}}>
                <input
                type={confirmPasswordIsVisible ? "text" :"password"}
                placeholder="confirm password"
                value={confirmPassword}
                onChange={(e)=>setConfirmPassword(e.target.value)}
                />
                {confirmPasswordIsVisible ? <i className="material-icons" onClick={() => {setConfirmPasswordIsVisible(false)}}>visibility</i> : <i className="material-icons" onClick={() => {setConfirmPasswordIsVisible(true)}}>visibility_off</i>}
                </div>
                <div className="file-field input-field">
                <div className="btn #42a5f5 blue lighten-1">
                    <span>upload image</span>
                    <input 
                    type="file"
                    onChange={e=>{setImage(e.target.files[0])}}
                    />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
                </div>
                <button className="btn waves-effect waves-light #42a5f5 blue lighten-1"
                onClick={()=>postUser()}>
                Sign Up
                </button>
            </div>
     );
}
 
export default SignUp;