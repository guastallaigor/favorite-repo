import React from 'react';
import './Login.css';
import LoginService from '../../services/LoginService';

export default function Login({ history }) {
  async function handleSubmit(e) {
    e.preventDefault();

    const response = await LoginService.login();
    const { _id } = response.data;
    history.push(`/dev/${_id}`);
  }

  async function login(e) {
    e.preventDefault();

    window.open('http://localhost:3000/auth/github', '_blank');
  }

  return (
    <div className="login-container">
      <form onSubmit={login}>
        <button type="submit">Login with github</button>
      </form>
    </div>
  );
}
