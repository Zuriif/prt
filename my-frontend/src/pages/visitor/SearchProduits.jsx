import { useEffect, useState } from "react";
import client from "../../api/axiosClient";

export default function SearchProduits() {
  const [query, setQuery] = useState("");
  const [all,   setAll]   = useState([]);

  useEffect(() => {
    client.get("/api/produits")
      .then(res => setAll(res.data))
      .catch(console.error);
  }, []);

  const filtered = all.filter(p =>
    p.nom.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <h5>Rechercher Produits</h5>
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Nom..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <ul className="list-group" style={{ maxHeight: "200px", overflowY: "auto" }}>
        {filtered.map(p => (
          <li key={p.id} className="list-group-item py-1">
            {p.nom}
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="list-group-item py-1 text-muted">
            Aucun résultat
          </li>
        )}
      </ul>
    </>
  );
}
