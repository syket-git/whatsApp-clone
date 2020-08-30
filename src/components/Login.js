import React from 'react';
import './Login.css';
import { useForm } from 'react-hook-form';
import { Button } from '@material-ui/core';
import { useAuth } from './useAuth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

const Login = () => {
  const { register, handleSubmit, errors, reset } = useForm();

  const auth = useAuth();

  const onSubmit = (data) => {
    auth.signIn(data.email, data.password);

    reset();
  };
  auth.user?.displayName !== undefined && toast('Signup successful!');
  return (
    <div className="signup login">
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

        <div className="signup__button">
          <Button type="submit"> Login </Button>
        </div>
        <br />
        <p>
          Don't have an account?{' '}
          <Link to="/">
            <span>Singup</span>
          </Link>{' '}
        </p>
      </form>
    </div>
  );
};

export default Login;
