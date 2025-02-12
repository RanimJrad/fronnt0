"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "../components/styles/style.css";

const Register: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [departement, setDepartement] = useState<string>("");
  const [nom, setNom] = useState<string>("");
  const [prenom, setPrenom] = useState<string>("");
  const [numTel, setNumTel] = useState<string>("");
  const [poste, setPoste] = useState<string>("");
  const [adresse, setAdresse] = useState<string>("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          departement,
          nom,
          prenom,
          numTel,
          poste,
          adresse,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Registration successful", data);

        // Stocker le token dans le localStorage
        localStorage.setItem("token", data.token);

        // Rediriger avec useRouter au lieu de useNavigate
        router.push("/login");
      } else {
        console.error("Registration failed", data.error);
        alert("Erreur : " + (data.error || "Erreur lors de l'inscription"));
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
              <div
                className="img"
                style={{
                  backgroundImage: "url(/signup.webp)",
                  backgroundSize: "contain", // Image plus petite et proportionnelle
                  backgroundPosition: "bottom 20px center", // L'image est centrée horizontalement et décalée de 20px du bas
                  backgroundRepeat: "no-repeat", // Empêche l'image de se répéter
                  height: "550px", // Ajustez la hauteur en fonction de vos préférences
                }}
              ></div>
              <div className="login-wrap p-4 p-md-5">
                <h3 className="mb-4">Sign Up</h3>
                <form className="signin-form" onSubmit={handleSubmit}>
                  <div className="form-group mb-3">
                    <label className="label" htmlFor="email">
                      Email
                    </label>
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
                  <div className="form-group mb-3">
                    <label className="label" htmlFor="departement">
                      Departement
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Departement"
                      required
                      value={departement}
                      onChange={(e) => setDepartement(e.target.value)}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label className="label" htmlFor="nom">
                      Nom
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nom"
                      required
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label className="label" htmlFor="prenom">
                      Prenom
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Prenom"
                      required
                      value={prenom}
                      onChange={(e) => setPrenom(e.target.value)}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label className="label" htmlFor="numTel">
                      Numéro de téléphone
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Numéro de téléphone"
                      required
                      value={numTel}
                      onChange={(e) => setNumTel(e.target.value)}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label className="label" htmlFor="poste">
                      Poste
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Poste"
                      required
                      value={poste}
                      onChange={(e) => setPoste(e.target.value)}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label className="label" htmlFor="adresse">
                      Adresse
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Adresse"
                      required
                      value={adresse}
                      onChange={(e) => setAdresse(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <button
                      type="submit"
                      className="form-control btn btn-primary rounded submit px-3"
                    >
                      Sign Up
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

export default Register;
