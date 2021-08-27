import React,{useEffect,useState} from "react";
import { Link } from "react-router-dom";

const FollowingPopup = ({trigger,userId}) => {

    const [userFollowing,setUserFollowing] = useState([])

    useEffect(() => {
        fetch(`/followers/${userId}`,{
            headers : {
                "authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(result => {
            setUserFollowing(result.following)
        })
    }, [])

    return  (trigger)?(
        <div className="popup-main" >
            <div className="popup-inner">
                <button className="popup-btn" onClick={() => {window.location.reload()}}>close</button>
                {userFollowing && <h6 className="popup-title">{userFollowing.length} following</h6>}
                <div style={{marginTop:"60px",marginLeft:"16px"}}>
                {userFollowing && 
                    userFollowing.map(item=>{
                        return (
                            <div style={{marginTop:"6px"}} key={item._id_}>
                                <Link to={`/profile/${item._id}`}><h6>{item.name}</h6></Link>
                            </div>
                        )
                    })
                }
                </div>
            </div>
        </div>)
        :
        ""
        ;
}
 
export default FollowingPopup;