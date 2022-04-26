import React, { useState, useEffect } from 'react';
import './Post.css';
import firebase from 'firebase/app';
import { db } from './Firebase';
import Avatar from "@material-ui/core/Avatar";

function Post({postId, user, username, caption, imageURL}) {
    const [comments ,setComments] = useState([]);
    const [newcomment, setNewcomment] = useState('');

    useEffect(() =>{
        let unsubscribe;
        if (postId){
            unsubscribe = db 
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy('timestamp','desc')
            .onSnapshot((snapshot) =>{
                setComments(snapshot.docs.map((doc) => {return doc.data()}));
            });
        }
        return () => {
            unsubscribe();
        };

    }, [postId]);

    console.log(comments);
    const postComments = (event) =>{
            event.preventDefault();
            db.collection("posts").doc(postId).collection("comments").add({
                text: newcomment,
                username: user.displayName,
                timestamp: new Date().getTime(),
            })
            setNewcomment('');
        }

    return (
        <div className="Post">
            <div className="post__header">
                <Avatar className="post__avatar" alt="Deepak" src="/static/images/avatar/1.jpg" />
                <h3>{username}</h3>
            </div>
            
            <img className="post__image" src={imageURL} alt=""/>

            <h4 className="post__text"><strong>{username}</strong> {caption}</h4>
            <div className="post__comments">
               {comments.map((comment) =>{
                   return <p><b>{comment.username}</b>{comment.text}</p>
                })}
            </div>
            <form className="post__commentBox">
                <input
                    className="post__input"
                    type="text"
                    placeholder="Add a comment"
                    value = {newcomment}
                    onChange = {(e) => setNewcomment(e.target.value)}
                />
                <button
                    disabled={!newcomment}
                    className= "post__button"
                    type="submit"
                    onClick={postComments}
                    >Post</button>
            </form>
        </div>

    )
}

export default Post
