import React,{useState,useEffect,useContext} from 'react'
import {Link} from 'react-router-dom'
import {UserContext} from "../../App"
import M from "materialize-css"


const Home = () => {

    const [data,setData] = useState([])
    const {state,dispatch} = useContext(UserContext)
    useEffect(() => {
        fetch("/followingposts",{
            headers:{
                "authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result => {
            setData(result.post)
        })
    }, [])

    const likePost = (id) => {
        fetch("/like",{
            method:"put",
            headers:{
                "Content-Type":"Application/json",
                "authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            const newData = data.map(item=>{
                if(item._id === result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        })
    }
    const unlikePost = (id) => {
        fetch("/unlike",{
            method:"put",
            headers:{
                "Content-Type":"Application/json",
                "authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            const newData = data.map(item=>{
                if(item._id === result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        })
    }

    const makeComment = (text,postId) => {
        fetch("/commentPost",{
            method:"put",
            headers:{
                "Content-Type":"Application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:postId,
                text:text
            })
        })
        .then(res=>res.json())
        .then(result => {
            console.log(result)
            const newData = data.map(item=>{
                if(item._id === result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
    })
    }

    const unComment = (text,postId) => {
        fetch("/uncommentPost",{
            method:"put",
            headers:{
                "Content-Type":"Application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:postId,
                text:text
            })
        })
        .then(res=>res.json())
        .then(result => {
            const newData = data.map(item=>{
                if(item._id === result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
    })
    }

    const deletePost = (postId) => {
        fetch(`/deletepost/${postId}`,{
            method:"delete",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(result=>{
            const newData = data.filter(item => {
                return result._id !== item._id
            })
            setData(newData)
            M.toast({html:"Post sucesfully deleted",classes:"green"})
        })
    }

    return ( 
        <div className="home">
        {data && data.map(item => {
                    return(
                    <div className="card home-card" key={item._id}>
                        <h5><Link to={item.postedBy._id === state._id ? "/profile" : `/profile/${item.postedBy._id}`}>{item.postedBy.name}</Link> {item.postedBy._id === state._id && <i className="material-icons" style={{float:"right"}} onClick={()=>{deletePost(item._id)}}>delete</i>}</h5>
                        <div className="card-image">
                            <img src={item.photo && item.photo}
                            alt="homeimage"   
                            />
                        </div>
                        <div className="card-content">
                        <i className="material-icons"
                        style={item.likes && item.likes.includes(state._id)?{color:"red"}:{color:"black"}}
                        onClick={item.likes && item.likes.includes(state._id)?()=>{unlikePost(item._id)}:()=>{likePost(item._id)}}
                        >favorite</i>
                            <h6>{item.likes && item.likes.length} likes</h6>
                            <h6>{item.title}</h6>
                            <p>{item.body}</p>
                            <p>comments:</p>
                            <div className="scrollbar-hidden" style={{maxHeight:"200px",overflowY:"scroll",background:"#c7d9cc"}}>
                            {
                               item.comments && item.comments.map(record => {
                                    return(
                                        <h6 key={record._id}><span style={{fontWeight:"500"}}>{record.postedBy.name}</span> {record.text} <i className="material-icons" style={{fontSize:"15px"}} onClick={()=>{unComment(record.text,item._id)}}>delete</i></h6>
                                    )
                                })
                            }
                            </div>
                            <form onSubmit={(e) => {
                                e.preventDefault()
                                makeComment(e.target[0].value,item._id)
                            }
                            }>
                            <input
                                type="text"
                                placeholder="comment"
                            />
                            </form>
                        </div>
                    </div>)
                })            
        }</div>
     );
}
export default Home;