import { makeStyles } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import './App.css';
import { db, auth } from "./Firebase";
import firebase from './Firebase';
import 'firebase/functions';
import Post from './Post';
import Modal from '@material-ui/core/modal';
import { Button , Input } from '@material-ui/core/';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle(){
  const top = 50 ;
  const left = 50;

  return{
    display:'flex',
    flexDirection:'column',
    top : `${top}%`,
    left : `${left}%`,
    transform : `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) =>({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor : theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow : theme.shadows[5],
    padding: theme.spacing(2,4,3),
  },
  image:{
    width: 100,
    alignSelf:'center',
  },
  input:{
    margin: 10,
  }
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open,setOpen] = useState(false);
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const [email,setEmail] = useState('');
  const [user , setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false);

  useEffect(() =>{
    const unsubscribe = auth.onAuthStateChanged((authUser) =>{
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
      }
      else{
        setUser(null);
      }
    })
     return () =>{
       unsubscribe();
     }
  }, [user, username]);

    useEffect(() =>{
      db.collection('posts').orderBy('timestamp' , 'desc').onSnapshot(snapshot =>{
          setPosts(snapshot.docs.map(doc =>{
            return {
              id: doc.id,
              post:doc.data()
            }
          }));
      })
    }, [] );

    const signUp = (event) =>{
      event.preventDefault();
      auth.createUserWithEmailAndPassword( email, password )
      .then((authUser) =>{
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message));

      setOpen(false);
    }

    const signIn = (event) =>{
      event.preventDefault();
      auth
      .signInWithEmailAndPassword(email,password)
      .catch((error) => alert(error.message))

      setOpenSignIn(false);
    }
  return (
    <div className="app">
      {user ? (
        <ImageUpload username={user.displayName}/>
      ):(
        <h3>Need to Login to Upload!! :( </h3>
      )}
        
      <Modal
      open={open}
      onClose={() => setOpen(false)}
    >
      <div style={modalStyle} className={classes.paper}>
        <form className="app__signup">
          <center>
        <img 
          className={classes.image}
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 
          alt={posts.username}
        />
        
        </center>
        <Input
        type="text"
        placeholder="username"
        value = {username}
        onChange = {(e) => setUsername(e.target.value)}
         />

        <Input
          className={classes.input}
          placeholder = "email"
          type = "text"
          value = {email}
          onChange = {(e) => setEmail(e.target.value)}
        />

        <Input
          className={classes.input}
          placeholder = "password"
          type="password"
          value= {password}
          onChange =  {(e) => setPassword(e.target.value)}
        />
        <Button type="submit" onClick={signUp}>
          Sign Up
          </Button>
        </form>
        
      </div>
    </Modal>

    <Modal
      open={openSignIn}
      onClose={() => setOpenSignIn(false)}
    >
      <div style={modalStyle} className={classes.paper}>
        <form className="app__signup">
          <center>
        <img 
          className={classes.image}
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 
          alt={posts.username}
        />
        
        </center>
          <Input
          className={classes.input}
          placeholder = "email"
          type = "text"
          value = {email}
          onChange = {(e) => setEmail(e.target.value)}
        />

        <Input
          className={classes.input}
          placeholder = "password"
          type="password"
          value= {password}
          onChange =  {(e) => setPassword(e.target.value)}
        />
        <Button type="submit" onClick={signIn}>
          Sign In
          </Button>
        </form>
        
      </div>
    </Modal>
      
      <div className="app__header">
        <img className="app__headerimage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt={posts.username}/>
        {user ? (
      <Button onClick={() => {auth.signOut(); console.log(user)}}>Logout</Button>
      ):(
        <div className="app__loginContainer">
          <Button onClick={() =>setOpen(true)}>Sign Up</Button>
          <Button onClick={() =>setOpenSignIn(true)}>Sign In</Button>
        </div>
      )}
        </div>
        <div className="app__posts"> 
        <div className="app__posts__left">
            {
            posts.map(({id,post}) =>{
              return <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageURL={post.imageURL}/>
            })
          }
        </div> 
        <div className="app__posts__right">
        <InstagramEmbed
            url='https://www.instagram.com/p/CNaVqk-nS14'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
        />
          </div>      
      </div>
      
   
      
    </div>
    
  );
}
  

export default App;
