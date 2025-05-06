import { useEffect, useState } from "react";
import client from "../../api/axiosClient";

export default function SearchEntites() {
  const [query, setQuery] = useState("");
  const [all,   setAll]   = useState([]);

  useEffect(() => {
    client.get("/api/entites")
      .then(res => setAll(res.data))
      .catch(console.error);
  }, []);

  const filtered = all.filter(e =>
    e.libelle.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <h5>Rechercher Entités</h5>
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Libellé..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <ul className="list-group" style={{ maxHeight: "200px", overflowY: "auto" }}>
        {filtered.map(e => (
          <li key={e.id} className="list-group-item py-1">
            {e.libelle}
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
