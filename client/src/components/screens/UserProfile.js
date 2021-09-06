import React,{useState,useEffect,useContext} from 'react'
import { Link ,useParams} from 'react-router-dom'
import {UserContext} from '../../App'
import FollowersPopup from '../FollowersPopup'
import FollowingPopup from '../FollowingPopup'

const Profile = () => {

    const {userId} = useParams()
    const [pics,setPics] = useState([])
    const [userData,setUserData] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const [buttonPopup,setButtonPopup] = useState(false)
    const [buttonPopup2,setButtonPopup2] = useState(false)

    useEffect(() => {
        fetch(`/user/${userId}`,{
            headers:{
                "authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result => {
            console.log(result)
            setUserData(result.user)
            setPics(result.posts)
        })
    }, [])

    const follow = () => {
        fetch("/follow",{
            method:"put",
            headers:{
                "Content-Type":"Application/json",
                "authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followingId:userId
            })
        }).then(res=>res.json())
        .then(result => {
            dispatch({type:"UPDATE", payload:{following:result.following,followers:result.followers}})
            localStorage.setItem("user",JSON.stringify(result))
            setUserData(prevState => {
                return {
                    ...prevState,followers:[
                        ...prevState.followers,result._id
                    ]
                }
            })
        })
    }
    const unfollow = () => {
        fetch("/unfollow",{
            method:"put",
            headers:{
                "Content-Type":"Application/json",
                "authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                unfollowingId:userId
            })
        }).then(res=>res.json())
        .then(result => {
            dispatch({type:"UPDATE", payload:{following:result.following,followers:result.followers}})
            localStorage.setItem("user",JSON.stringify(result))
            setUserData(prevState => {
                const newFollowers = prevState.followers.filter(item =>{
                    return item !== result._id
                })
                return {
                    ...prevState,followers:newFollowers
                }
            })
        })
    }
    return ( 
        <div>
            {userData && 
            <div style={{display:"flex", justifyContent:"space-around",margin:"18px auto",width:"800px",borderBottom:"1px solid grey"}}>
            <div>
                {userData && <img style={{height:"160px", width:"160px", borderRadius:"80px"}}
                    src={userData.pic ? userData.pic : "https://res.cloudinary.com/fran123/image/upload/v1629625831/izenmvoggxjsoaqdjvsj.png"}
                    alt="person"
                />
                }
            </div>
            <div>
                <div><h3>{userData.name}</h3></div>
                <div><h5>{userData.email}</h5></div>
                <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                    <h6>{pics.length} posts</h6>
                    <h6 onClick={() => {setButtonPopup(true)}}>{userData.followers && userData.followers.length} <FollowersPopup userId={userId} trigger={buttonPopup}/> followers</h6>
                    <h6 onClick={() => {setButtonPopup2(true)}}>{userData.following && userData.following.length} <FollowingPopup userId={userId} trigger={buttonPopup2}/> following</h6>
                </div>
                {
                userData.followers && !userData.followers.includes(state._id)?
                <div className="custom-button" onClick={() => {follow()}}>follow</div>
                :
                <div className="custom-button" onClick={()=>{unfollow()}}>unfollow</div>
                }
            </div>
            </div>}
            {pics && <div className="gallery">
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
            
            }
        </div>
     );
}
 
export default Profile;