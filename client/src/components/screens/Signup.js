import React,{useState,useEffect} from "react";
import {useHistory} from 'react-router-dom'
import M from "materialize-css"

const SignUp = () => {  
    const history = useHistory()
    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState(undefined)


    useEffect(()=>{
        if(url){
            postUserDetails()
        }
    },[url])

    const postUserDetails = () => {
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
        M.toast({html:'invalid email',classes:"red"})
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
                <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                />
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
                Submit
                </button>
            </div>
     );
}
 
export default SignUp;