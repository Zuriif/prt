// src/pages/EntitesList.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchEntites, deleteEntite } from "../services/entiteService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EntitesList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState(new Set());

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await fetchEntites();
      setList(res.data);
    } catch {
      toast.error("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }

  // Filtre & pagination
  const filtered = list.filter(e =>
    e.libelle.toLowerCase().includes(search.toLowerCase())
  );
  const totalItems = filtered.length;
  const pageCount = Math.ceil(totalItems / pageSize);
  const startIdx = (page - 1) * pageSize;
  const paged = filtered.slice(startIdx, startIdx + pageSize);

  // Sélection
  const isAll = paged.length > 0 && paged.every(e => selectedIds.has(e.id));
  const toggleAll = () => {
    const s = new Set(selectedIds);
    if (isAll) paged.forEach(e => s.delete(e.id));
    else     paged.forEach(e => s.add(e.id));
    setSelectedIds(s);
  };
  const toggleOne = id => {
    const s = new Set(selectedIds);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelectedIds(s);
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    if (!selectedIds.size) return;
    if (!window.confirm("Supprimer les entités sélectionnées ?")) return;
    try {
      await Promise.all([...selectedIds].map(id => deleteEntite(id)));
      toast.success("Entités supprimées");
      setSelectedIds(new Set());
      load();
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <div className="container py-4">
      {/* Toolbar */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3">Manage Entités</h1>
        <div>
          <button
            className="btn btn-danger me-2"
            disabled={!selectedIds.size}
            onClick={handleBulkDelete}
          >
            Delete
          </button>
          <Link to="/entites/create" className="btn btn-success">
            + Add New Entity
          </Link>
        </div>
      </div>

      {/* Recherche */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search entités..."
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Tableau */}
      {loading ? (
        <div>Chargement…</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead>
              <tr>
                <th scope="col">
                  <input type="checkbox" checked={isAll} onChange={toggleAll} />
                </th>
                <th scope="col">ID</th>
                <th scope="col">Libellé</th>
                <th scope="col">Adresse</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map(e => (
                <tr key={e.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(e.id)}
                      onChange={() => toggleOne(e.id)}
                    />
                  </td>
                  <td>{e.id}</td>
                  <td>{e.libelle}</td>
                  <td>{e.adresse}</td>
                  <td>
                    <Link
                      to={`/entites/${e.id}/edit`}
                      className="btn btn-sm btn-primary me-2"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={async () => {
                        if (window.confirm("Supprimer cette entité ?")) {
                          await deleteEntite(e.id);
                          load();
                        }
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center">
        <small className="text-muted">
          Showing {startIdx + 1} to {startIdx + paged.length} of {totalItems}
        </small>
        <nav>
          <ul className="pagination mb-0">
            <li className={`page-item ${page === 1 && "disabled"}`}>
              <button className="page-link" onClick={() => setPage(p => p - 1)}>
                Previous
              </button>
            </li>
            {[...Array(pageCount)].map((_, i) => (
              <li
                key={i}
                className={`page-item ${page === i + 1 && "active"}`}
              >
                <button className="page-link" onClick={() => setPage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${page === pageCount && "disabled"}`}>
              <button className="page-link" onClick={() => setPage(p => p + 1)}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <ToastContainer position="top-center" />
    </div>
  );
}
