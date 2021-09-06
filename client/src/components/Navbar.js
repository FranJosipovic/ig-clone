import React,{useContext,useRef,useEffect,useState} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {UserContext} from '../App'
import M from 'materialize-css'

const Navbar = () => {

    const searchModal = useRef(null)
    const [search,setSearch] = useState("")
    const [userDetails,setUserDetails] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const history = useHistory()
    useEffect(() => {
      M.Modal.init(searchModal.current)
    }, [])
    const Routing = () => {
      if(state){
        return [
          <li style={{position:"absolute", left:"50%"}}><i className="large material-icons modal-trigger" style={{color:"black"}} data-target="modal1">search</i></li>,
          <li><Link to="/discover">Discover</Link></li>,
          <li><Link to="/profile">Profile</Link></li>,
          <li><Link to="/create">create post</Link></li>,
          <li>
            <button className="btn waves-effect waves-light #42a5f5 red lighten-1"
                onClick={()=>{
                  localStorage.clear()
                  dispatch({type:"CLEAR"})
                  history.push("/login")
                  }}>
                Logout
                </button>
          </li>
        ]
      }
      else{
        return[
          <li><Link to="/login">Login</Link></li>,
          <li><Link to="/signup">Signup</Link></li>
        ]
      }
    }

    const fetchUser = (query) => {
      setSearch(query)
      fetch("/search-user",{
        method:"post",
        headers:{
          "Content-Type":"application/json",
          "authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
          query
        })
      })
      .then(res=>res.json())
      .then(result =>{
        setUserDetails(result.user)
      })
    }


    return ( 
      <nav>
        <div className="nav-wrapper">
          <Link to={{state}?"/":"/login"} className="brand-logo left">Instagram</Link>
          <ul id="nav-mobile" className="right">
            {Routing()}
          </ul>
        </div>

          <div id="modal1" className="modal" ref={searchModal} style={{color:"black"}}>
            <div className="modal-content">
            <input
                type="text"
                placeholder="search"
                value={search}
                onChange={(e)=>fetchUser(e.target.value)}
                />
                <ul className="collection" style={{display:"flex", color:"black",flexDirection:"column"}}>
                  {userDetails.map(item=>{
                    if(search === ''){
                      return null
                    }else{return(
                      <li key={item._id} className="collection-item">{item.name}</li>
                    )}
                  })
                  }
                </ul>
            </div>
            <div className="modal-footer">
              <button href="#!" className="modal-close waves-effect waves-green btn-flat" onClick={()=>{setSearch('')}}>Close</button>
            </div>
          </div>

      </nav>
      
    );
}
 
export default Navbar;