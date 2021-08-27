import React,{useEffect,useState} from "react";
import { Link } from "react-router-dom";

const FollowersPopup = ({trigger,userId}) => {

    const [userFollowers,setUserFollowers] = useState([])

    useEffect(() => {
        fetch(`/followers/${userId}`,{
            headers : {
                "authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(result => {
            setUserFollowers(result.followers)
        })
    }, [])

    return  (trigger)?(
        <div className="popup-main" >
            <div className="popup-inner">
                <button className="popup-btn" onClick={() => {window.location.reload()}}>close</button>
                {userFollowers && <h6 className="popup-title">{userFollowers.length} followers</h6>}
                <div style={{marginTop:"60px",marginLeft:"16px"}}>
                {userFollowers && 
                    userFollowers.map(item=>{
                        return (
                            <div className="popup-list" style={{marginTop:"6px"}} key={item._id}>
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
 
export default FollowersPopup;