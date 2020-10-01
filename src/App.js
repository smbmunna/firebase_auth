import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase-config';

firebase.initializeApp(firebaseConfig);

function App() {
  const provider = new firebase.auth.GoogleAuthProvider();
  const [newUser, setNewUser]= useState(false);
  const [user,setUser]=useState({
    isSignedIn:false,
    name:'',
    email:'',
    password: '',
    photo:'',
    error:'',
    success:''
  });
  const handleSignIn=()=>{
    firebase.auth().signInWithPopup(provider)
    .then(res =>{
      const {displayName, photoURL, email}=res.user;
      console.log(displayName, photoURL, email);
      const signedInUser= {
        isSignedIn:true,
        name:displayName,
        email:email,
        photo:photoURL
      };
      setUser(signedInUser);
    })
    .catch(err=>{
      console.log(err);
      console.log(err.message);
    });
  }

  const handleSignOut= ()=>{
    firebase.auth().signOut()
    .then(res =>{
      const signedOutUser= {
        isSignedIn:false,
        name:'',
        email:'',
        photo:''
      }
      setUser(signedOutUser);
    })
    .catch(err =>{
      console.log(err.message);
    })
  }

  const handleSubmit= (e)=>{
    //debugger;
    if(newUser && user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res=>{
        const newUserInfo= {...user};
        newUserInfo['success']='User Created Successfully';
        newUserInfo['error']='';
        setUser(newUserInfo);
      })
      .catch(error =>{        
        const newUserInfo= {...user};
        newUserInfo['error']=error.message;
        newUserInfo['success']='';
        setUser(newUserInfo);
      });
    }e.preventDefault();
  }
  if(!newUser && user.email && user.password){
    //debugger; 
    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then(res =>{
      //debugger;
      const newUserInfo= {...user};
      newUserInfo['success']='User Logged in Successfully';
      newUserInfo['error']='';
      setUser(newUserInfo);
    })
    .catch(function(error) {
      const newUserInfo= {...user};
      newUserInfo['error']=error.message;
      newUserInfo['success']='';
      setUser(newUserInfo);
      
    });
  }

  const handleChange= (event)=>{
    let isFieldValid=true;
    if(event.target.name==='email'){
      isFieldValid= /\S+@\S+\.\S+/.test(event.target.value);      
    }if(event.target.name==='password'){
      const isPasswordValid= event.target.value.length> 6;
      const passwordHasNumber= /\d{1}/.test(event.target.value);
      isFieldValid= isPasswordValid && passwordHasNumber;
    }
    if(isFieldValid){
      const newUser= {...user};
      newUser[event.target.name]= event.target.value;
      setUser(newUser);      
    }
  }

  return (
    <div className="App">
        {
          user.isSignedIn ?
          <button onClick={handleSignOut}>Sign Out</button>
          :
          <button onClick={handleSignIn}>Sign in </button>
        }
        {
        user.isSignedIn && 
          <div>
             <h3>Welcome back {user.name}</h3>
             <img src={user.photo} alt=''></img>
          </div>
        }
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
        <p>Password: {user.password}</p>

        <form onSubmit={handleSubmit}>
          <input type="checkbox" name="newUser" onChange={()=>setNewUser(!newUser)}/>
          <label htmlFor="newUser">Sign Up for New User</label> <br/>
          {newUser && <input type="text" name="name" placeholder="Enter your name" onBlur={handleChange} />}
          <br/>
          <input type="text" name="email" id="" onBlur={handleChange} placeholder="Enter your email" required/>
          <br/>
          <input type="password" name="password" id="" onBlur={handleChange} placeholder="Enter your password" required />
          <br/>
          <input type="submit" value="Submit"/>
          <br/>
          <p style={{color:'red'}}>{user.error}</p>
          <p style={{color:'green'}}>{user.success}</p>
        </form>
    </div>
  );
}

export default App;
