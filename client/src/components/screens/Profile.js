import React,{useState,useEffect,useContext} from 'react'
import { Link,useHistory } from 'react-router-dom'
import {UserContext} from "../../App"
import Modal from "react-modal"

const Profile = () => {

    const [pics,setPics] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const [modalsOpen,setModalIsOpen] = useState(false)
    const [image,setImage] = useState("")
    const [url,setUrl] = useState("")
    const history = useHistory()

    useEffect(() => {
        fetch('/mypost',{
            headers:{
                "authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result => {
            setPics(result.myPost)
        })
    }, [])

    useEffect(() => {
        if(url){
            fetch("/updateprofilepic",{
                method:"put",
                headers:{
                    "Content-type":"application/json",
                    "authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    newPic:url
                })
            })
            .then(res => res.json())
            .then(result => {
                localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
                dispatch({type:"UPDATEPIC",payload:result.pic})
            })
            .catch(err => {
                console.log(err)
            })
        }
    }, [url])

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

    return ( 
        <div>
        <Modal
        className="popup-main"
        isOpen={modalsOpen}
        ariaHideApp={false}
        >
        <div className="popup-inner">
                <button className="popup-btn" onClick={() => {setModalIsOpen(false)}}>close</button>
                <div className="file-field input-field" style={{marginTop:"90%"}}>
                <div className="btn #42a5f5 blue lighten-1">
                    <span>update profile pic</span>
                    <input 
                    type="file"
                    onChange={(e)=>{setImage(e.target.files[0])}}
                    />
                </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
            </div>
            </div>
            <button className="btn waves-effect waves-light #42a5f5 blue lighten-1" style={{float:"right"}}
            onClick={()=>{postDetails()
                setModalIsOpen(false)}}
            >
                update pic
            </button>
            </div>
        </Modal>
            <div style={{display:"flex", justifyContent:"space-around",margin:"18px auto",width:"800px",borderBottom:"1px solid grey"}}>
            <div>
                <img style={{height:"160px", width:"160px", borderRadius:"80px"}}
                    src={state.pic ? state.pic : "https://res.cloudinary.com/fran123/image/upload/v1629625831/izenmvoggxjsoaqdjvsj.png" }
                    alt="person"
                    onClick={()=>{setModalIsOpen(true)}}
                />
            </div>
            <div>
                <div><h3>{state.name}</h3></div>
                <div><h5>{state.email}</h5></div>
                <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                    <h6>{pics.length} posts</h6>
                    <h6>{state.followers.length} followers</h6>
                    <h6>{state.following.length} following</h6>
                </div>
            </div>
            </div>
            <div className="gallery">
                {
                    pics.map(item=>{
                        return(
                            <div className="item">
                            <Link to={`/post/${item._id}`}><img style={{width:"100%"}} key={item._id} src={item.photo}/></Link>
                            </div>
                        )
                    })
                }
            </div>
        </div>
     );
}
 
export default Profile;