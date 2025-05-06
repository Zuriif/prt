import { useEffect, useState } from "react";
import client from "../../api/axiosClient";

export default function SearchSecteurs() {
  const [query, setQuery] = useState("");
  const [all,   setAll]   = useState([]);

  useEffect(() => {
    client.get("/api/secteurs")
      .then(res => setAll(res.data))
      .catch(console.error);
  }, []);

  const filtered = all.filter(s =>
    s.nom.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <h5>Rechercher Secteurs</h5>
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Nom..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <ul className="list-group" style={{ maxHeight: "200px", overflowY: "auto" }}>
        {filtered.map(s => (
          <li key={s.id} className="list-group-item py-1">
            {s.nom}
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
