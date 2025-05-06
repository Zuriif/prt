// src/pages/visitor/PublicHome.jsx
import { Link }              from "react-router-dom";
import { useEffect, useState } from "react";
import client                from "../../api/axiosClient";
import SearchEntites         from "./SearchEntites";
import SearchProduits        from "./SearchProduits";
import SearchSecteurs        from "./SearchSecteurs";

export default function PublicHome() {
  const [mediaList, setMediaList] = useState([]);

  useEffect(() => {
    client
      .get("/api/media")
      .then((res) => setMediaList(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">MaPlateforme</Link>
          <div className="d-flex">
            <Link className="btn btn-outline-primary me-2" to="/login">
              Connexion
            </Link>
            <Link className="btn btn-primary" to="/register">
              Inscription
            </Link>
          </div>
        </div>
      </nav>

      {/* Jumbotron */}
      <header className="py-5 bg-light mb-4">
        <div className="container text-center">
          <h1 className="display-5">Actualités & Événements</h1>
          <p className="lead">
            Bienvenue sur notre plateforme ! Retrouvez ici les dernières informations publiques.
          </p>
        </div>
      </header>

      <div className="container">
        {/* Médias */}
        <section className="mb-5">
          <h2 className="h4 mb-3">Médias</h2>
          <div className="row g-3">
            {mediaList.map((m) => (
              <div key={m.id} className="col-6 col-sm-4 col-md-3">
                <div className="card h-100">
                  <img
                    src={`http://localhost:8080/api/media/download/${m.id}`}
                    className="card-img-top"
                    alt={m.nomFichier}
                    style={{ objectFit: "cover", height: "150px" }}
                  />
                  <div className="card-body p-2">
                    <small className="text-truncate d-block">
                      {m.nomFichier}
                    </small>
                  </div>
                </div>
              </div>
            ))}
            {mediaList.length === 0 && (
              <p className="text-muted">Aucun média public pour le moment.</p>
            )}
          </div>
        </section>

        {/* Search widgets */}
        <section className="row gy-4">
          <div className="col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <SearchEntites />
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <SearchProduits />
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <SearchSecteurs />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
