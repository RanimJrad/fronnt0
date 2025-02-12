"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import './components/styles/style.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log("Login successful", data);

        // Stocker le token dans le localStorage
        localStorage.setItem('token', data.token);

        // ✅ Rediriger avec useRouter au lieu de useNavigate
        router.push('/dashbord');
      } else {
        console.error("Login failed", data.error);
        alert("Erreur : " + (data.error || "Identifiants incorrects"));
      }
    } catch (error) {
      console.error("Erreur de connexion", error);
    }
  };

  return (
    <section className="ftco-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-12 col-lg-10">
            <div className="wrap d-md-flex">
              <div className="img" style={{ backgroundImage: 'url(/Logo_maison_du_web.png )' }}></div>
              <div className="login-wrap p-4 p-md-5">
                <h3 className="mb-4">Sign In</h3>
                <form className="signin-form" onSubmit={handleSubmit}>
                  <div className="form-group mb-3">
                    <label className="label" htmlFor="email">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label className="label" htmlFor="password">Password</label>
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
                    <button type="submit" className="form-control btn btn-primary rounded submit px-3">
                      Sign In
                    </button>
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
