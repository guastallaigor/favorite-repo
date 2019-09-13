import React from 'react';
import './Login.css';

export default function Login() {
  async function login(e) {
    e.preventDefault();

    window.open('http://localhost:3000/auth/github', '_self');
  }

  return (
    <div className="login-container">
      <form onSubmit={login}>
        <button type="submit">Login with github</button>
      </form>
    </div>
  );
}
