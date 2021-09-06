import React,{useEffect,createContext, useReducer, useContext} from 'react';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';
import './App.css';
import CardPost from './components/CardPost';
import Navbar from './components/Navbar';
import CreatePost from './components/screens/CreatePost';
import Home from './components/screens/Home';
import Login from './components/screens/Login';
import Profile from './components/screens/Profile';
import SignUp from './components/screens/Signup';
import UserProfile from './components/screens/UserProfile'
import Discover from './components/screens/Discover'
import Reset from './components/screens/Reset'
import NewPassword from './components/screens/NewPassword';
import {reducer,initialState} from './reducers/UserReducer'

export const UserContext = createContext()

  const Routing = () => {
  const history = useHistory()
  const {state,dispatch} = useContext(UserContext)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER",payload:user})
    }else{
      if(!history.location.pathname.startsWith('/reset')){
        history.push("/login")
      }
    }
  }, [])
  return (
  <Switch>
    <Route exact path="/"><Home/></Route>
    <Route exact path="/profile"><Profile/></Route>
    <Route path="/signup"><SignUp/></Route>
    <Route path="/login"><Login/></Route>
    <Route path="/create"><CreatePost/></Route>
    <Route path="/post/:id"><CardPost/></Route>
    <Route path="/profile/:userId"><UserProfile/></Route>
    <Route path="/discover"><Discover/></Route>
    <Route exact path="/reset"><Reset/></Route>
    <Route path="/reset/:token"><NewPassword/></Route>
  </Switch>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
      <BrowserRouter>
        <Navbar/>
        <Routing/>
      </BrowserRouter>
    </UserContext.Provider>
  );
}


export default App;
