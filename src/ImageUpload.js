import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { firebase } from './Firebase';
import './ImageUpload.css';
import { storage , db} from './Firebase';

function ImageUpload({username}) {
    const [image, setImage] = useState('');
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');
     
    const handleChange = (e) =>{
        if (e.target.files[0]){
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () =>{
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            "state_changed",
            (snapshot) =>{
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes)*100
                );
                setProgress(progress);
            },
        (error) =>{
            console.log(error);
            alert(error.message);
        },
        () =>{
            storage
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then(url =>{
                db.collection("posts").add({
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    caption: caption,
                    imageURL: url,
                    username : username
                });
                 setProgress(0);
                 setCaption("");
                 setImage(null);
            });
        }
            
        );
    };
    return (
        <div className="imageupload">
            <progress className="imageupload__progress" value={progress} max="100" />
            <input type="text" placeholder="Caption Here!" onChange={event => setCaption(event.target.value)} value={caption}/>
            <input type="file" onChange={handleChange} />
            <Button onClick={handleUpload}>Upload</Button>
        </div>
    )
}

export default ImageUpload
