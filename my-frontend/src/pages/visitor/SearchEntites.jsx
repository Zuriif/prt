// src/pages/visitor/SearchEntites.jsx
import { useState, useEffect } from "react";
import client from "../../api/axiosClient";

export default function SearchEntites() {
  const [query, setQuery]     = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancel = false;
    const fetchData = async () => {
      setLoading(true);
      try {
        // si votre back supporte un paramètre de recherche
        const url = query
          ? `/api/entites?search=${encodeURIComponent(query)}`
          : "/api/entites";
        const res = await client.get(url);
        if (!cancel) setResults(res.data);
      } catch (err) {
        console.error("Erreur chargement entités :", err);
        if (!cancel) setResults([]);
      } finally {
        if (!cancel) setLoading(false);
      }
    };

    // debounce 300ms
    const timer = setTimeout(fetchData, 300);
    return () => {
      cancel = true;
      clearTimeout(timer);
    };
  }, [query]);

  return (
    <div>
      <h5>Rechercher Entités</h5>
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Libellé..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />

      {loading ? (
        <p>Chargement…</p>
      ) : (
        <ul
          className="list-group"
          style={{ maxHeight: "200px", overflowY: "auto" }}
        >
          {results.length > 0 ? (
            results.map(e => (
              <li key={e.id} className="list-group-item py-1">
                {e.libelle /* ou le champ exact que renvoie votre API */}
              </li>
            ))
          ) : (
            <li className="list-group-item py-1 text-muted">
              Aucun résultat
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
