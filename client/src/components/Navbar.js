import React,{useContext} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {UserContext} from '../App'

const Navbar = () => {

    const {state,dispatch} = useContext(UserContext)
    const history = useHistory()
    const Routing = () => {
      if(state){
        return [
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


    return ( 
      <nav>
        <div className="nav-wrapper">
          <Link to={{state}?"/":"/login"} className="brand-logo left">Instagram</Link>
          <ul id="nav-mobile" className="right">
            {Routing()}
          </ul>
        </div>
      </nav>
    );
}
 
export default Navbar;