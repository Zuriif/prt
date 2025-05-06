// src/pages/EntiteForm.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchEntite,
  createEntite,
  updateEntite,
} from "../services/entiteService";
import { fetchTypeEntreprises } from "../services/typeEntrepriseService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EntiteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const empty = {
    libelle: "",
    adresse: "",
    codePostal: "",
    region: "",
    telephone: "",
    fax: "",
    email: "",
    source: "",
    effectif: "",
    formeJuridique: "",
    capitalSocial: "",
    dateCreation: "",
    activites: "",
    produits: "",
    presentation: "",
    marqueRepresentee: "",
    typeEntrepriseId: "",
  };

  const [form, setForm] = useState(empty);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    fetchTypeEntreprises().then(r => setTypes(r.data));
    if (isEdit) {
      fetchEntite(id)
        .then(({ data }) => {
          setForm({
            ...data,
            dateCreation: data.dateCreation?.slice(0, 10) || "",
            typeEntrepriseId: data.typeEntreprise?.id || "",
          });
        })
        .catch(() => toast.error("Impossible de charger l'entité"));
    }
  }, [id]);

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = {
      ...form,
      effectif: parseInt(form.effectif || 0, 10),
      ...(form.typeEntrepriseId
        ? { typeEntreprise: { id: Number(form.typeEntrepriseId) } }
        : {}),
    };

    try {
      if (isEdit) {
        await updateEntite(id, payload);
        toast.success("Entité mise à jour");
      } else {
        await createEntite(payload);
        toast.success("Entité créée");
      }
      navigate("/entites");
    } catch {
      toast.error("Erreur d'enregistrement");
    }
  };

  return (
    <div className="container py-4">
      <h1 className="h3 mb-4">
        {isEdit ? "Modifier une entité" : "Créer une entité"}
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          {[
            { label: "Libellé",         prop: "libelle", type: "text" },
            { label: "Adresse",         prop: "adresse", type: "text" },
            { label: "Code Postal",     prop: "codePostal", type: "text" },
            { label: "Région",          prop: "region", type: "text" },
            { label: "Téléphone",       prop: "telephone", type: "text" },
            { label: "Fax",             prop: "fax", type: "text" },
            { label: "Email",           prop: "email", type: "email" },
            { label: "Source",          prop: "source", type: "text" },
            { label: "Effectif",        prop: "effectif", type: "number" },
            { label: "Forme Juridique", prop: "formeJuridique", type: "text" },
            { label: "Capital Social",  prop: "capitalSocial", type: "text" },
            { label: "Date Création",   prop: "dateCreation", type: "date" },
            { label: "Activités",       prop: "activites", type: "text" },
            { label: "Produits",        prop: "produits", type: "text" },
            { label: "Présentation",    prop: "presentation", type: "text" },
            { label: "Marque Repres.",  prop: "marqueRepresentee", type: "text" },
          ].map(({ label, prop, type }) => (
            <div className="col-sm-6" key={prop}>
              <label className="form-label">{label}</label>
              <input
                className="form-control"
                type={type}
                value={form[prop]}
                onChange={e => setForm({ ...form, [prop]: e.target.value })}
              />
            </div>
          ))}

          {/* TypeEntreprise */}
          <div className="col-sm-6">
            <label className="form-label">Type Entreprise</label>
            <select
              className="form-select"
              value={form.typeEntrepriseId}
              onChange={e =>
                setForm({ ...form, typeEntrepriseId: e.target.value })
              }
            >
              <option value="">— Choisir —</option>
              {types.map(t => (
                <option key={t.id} value={t.id}>
                  {t.libelle}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <button type="submit" className="btn btn-primary me-2">
            {isEdit ? "Mettre à jour" : "Créer"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/entites")}
          >
            Annuler
          </button>
        </div>
      </form>

      <ToastContainer position="top-center" />
    </div>
  );
}
