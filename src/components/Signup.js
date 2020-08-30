import React, { useState } from 'react';
import './Signup.css';
import { useForm } from 'react-hook-form';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { storage, db } from '../firebase';
import { useAuth } from './useAuth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const { register, handleSubmit, errors, reset } = useForm();
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [openProgress, setOpenProgress] = useState(false);

  const auth = useAuth();

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const onSubmit = (data) => {
    setOpenProgress(true);
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        alert(error.message);
      },
      () => {
        storage
          .ref('images')
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            auth.signUp(data.name, data.email, data.password, url);
            db.collection('rooms').add({
              name: data.name,
              avatar: url,
              email: data.email,
            });
          });
        reset();
        setImage(null);
        setProgress(0);
        setOpenProgress(false);
      }
    );
  };
  auth.user?.displayName !== undefined && toast('Signup successful!');
  return (
    <div className="signup">
      <ToastContainer />
      <img
        src="https://www.messengerpeople.com/wp-content/uploads/2019/01/icon-400-messenger-whatsapp-whatsgreen3x-300x300.png"
        alt=""
      />
      <div
        style={{ textAlign: 'center', margin: '10px 0px' }}
        className="error"
      >
        {auth.user?.err && auth.user.err}
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          name="name"
          type="text"
          placeholder="Name"
          ref={register({ required: true })}
        />
        <br />
        {errors.name && (
          <span className="error">** This field is required **</span>
        )}
        <br />

        <input
          name="email"
          type="email"
          placeholder="Email"
          ref={register({ required: true })}
        />
        <br />
        {errors.email && (
          <span className="error">** This field is required **</span>
        )}
        <br />

        <input
          name="password"
          type="password"
          placeholder="Password"
          ref={register({ required: true })}
        />
        <br />
        {errors.password && (
          <span className="error">** This field is required **</span>
        )}
        <br />

        <label htmlFor="file"> Upload your profile picture</label>
        <input
          name="file"
          onChange={handleChange}
          id="file"
          type="file"
          ref={register({ required: true })}
        />
        <br />
        {errors.password && (
          <span className="error">** This field is required **</span>
        )}
        <br />

        {openProgress && (
          <progress value={progress} style={{ width: '100%' }} max="100" />
        )}

        <div className="signup__button">
          <Button type="submit"> Create account </Button>
        </div>
        <br />
        <p>
          Already have an account?{' '}
          <Link to="/login">
            <span>Login</span>
          </Link>{' '}
        </p>
      </form>
    </div>
  );
};

export default Signup;
