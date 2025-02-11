"use client"; 

import React, { useState } from 'react';
import './components/styles/style.css';
import { useNavigate } from 'react-router-dom';


const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign-in logic
    console.log("Logging in with", username, password);
    
    // Créer une instance de useNavigate
    const navigate = useNavigate();
  
    // Redirection vers la page Home après la soumission
    navigate('/home111');
  };

  return (
    <section className="ftco-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-12 col-lg-10">
            <div className="wrap d-md-flex">
            <div
                className="img"
                style={{
                  backgroundImage: 'url(/Logo_maison_du_web.png )', // Chemin relatif à partir du dossier public
                  
                }}
              ></div>
              <div className="login-wrap p-4 p-md-5">
                <div className="d-flex">
                  <div className="w-100">
                    <h3 className="mb-4">Sign In</h3>
                  </div>
                </div>
                <form className="signin-form" onSubmit={handleSubmit}>
                  <div className="form-group mb-3">
                    <label className="label" htmlFor="name">
                      Username
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Username"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label className="label" htmlFor="password">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <button
                      type="submit"
                      className="form-control btn btn-primary rounded submit px-3"
                    >
                      Sign In
                    </button>
                  </div>
                  <div className="form-group d-md-flex">
                    
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
