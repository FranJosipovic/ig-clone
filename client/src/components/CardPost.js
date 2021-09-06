import React,{useState,useEffect,useContext} from "react";
import { useParams ,useHistory,Link} from "react-router-dom";
import { UserContext } from "../App";
import M from "materialize-css"

const CardPost = () => {
    const [post, setPost] = useState("")
    const {state,dispatch} = useContext(UserContext)
    const { id } = useParams()
    const history = useHistory()

    useEffect(() => {
        fetch(`/mypost/${id}`,{
            headers:{
                "authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result => {
            setPost(result.singlePost)
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
           setPost(result)
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
           setPost(result)
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
           setPost(result)
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
           setPost(result)
    })
    }

    const deletePost = () => {
        fetch(`/deletepost/${id}`,{
            method:"delete",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(result=>{
            history.push("/profile")
            M.toast({html:"Post sucesfully deleted",classes:"green"})
        })
    }

    return (  
        <div className="home">
        {post && <div className="card home-card" key={post._id}>
        <h5><Link to={post.postedBy._id === state._id ? "/profile" : `/profile/${post.postedBy._id}`}>{post.postedBy.name}</Link> {post.postedBy._id === state._id && <i className="material-icons" style={{float:"right"}} onClick={()=>{deletePost(post._id)}}>delete</i>}</h5>
                        <div className="card-image">
                            <img src={post.photo}
                            alt="homeimage"   
                            />
                        </div>
                        <div className="card-content">
                        <i className="material-icons"
                        style={post.likes.includes(state._id)?{color:"red"}:{color:"black"}}
                        onClick={post.likes.includes(state._id)?()=>{unlikePost(post._id)}:()=>{likePost(post._id)}}
                        >favorite</i>
                            <h6>{post.likes.length} likes</h6>
                            <h6>{post.title}</h6>
                            <p>{post.body}</p>
                            <p>comments:</p>
                            <div className="scrollbar-hidden" style={{maxHeight:"200px",overflowY:"scroll",background:"#c7d9cc"}}>
                            {
                                post.comments.map(record => {
                                    return(
                                        <h6><span style={{fontWeight:"500"}}>{record.postedBy.name}</span> {record.text} <i className="material-icons" style={{fontSize:"15px"}} onClick={()=>{unComment(record.text,post._id)}}>delete</i></h6>
                                    )
                                })
                            }
                            </div>
                            <form onSubmit={(e) => {
                                e.preventDefault()
                                makeComment(e.target[0].value,post._id)
                            }
                            }>
                            <input
                                type="text"
                                placeholder="comment"
                            />
                            </form>
                        </div>
                    </div>}
        </div>
     );
}
 
export default CardPost;