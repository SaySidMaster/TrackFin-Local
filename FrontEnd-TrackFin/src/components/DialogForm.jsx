import trashIcon from "../assets/icons/trash.svg";
import passwordIcon from "../assets/icons/password.svg";

/**
 * DialogForm — Formulaire modal modulaire
 *
 * Même logique que BlockFilter : chaque champ n'apparaît QUE si sa prop est fournie.
 * Les champs sont définis dans un tableau `fields`, un objet par champ.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * Props du composant :
 *
 *  isOpen      boolean               → affiche ou cache le dialog
 *  onClose     () => void            → appelé au clic sur ✕ ou l'overlay
 *  title       string                → titre en haut à gauche
 *  values      object                → { [key]: valeur }  — état contrôlé par le parent
 *  onChange    (key, value) => void  → appelé à chaque modification de champ
 *  onSubmit    () => void            → appelé au clic sur "Enregistrer"
 *  onDelete    () => void            → si fourni, affiche le bouton poubelle
 *  fields      Field[]               → définition des champs (voir ci-dessous)
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * Définition d'un Field :
 *
 *  key          string     (requis)  → clé dans values / onChange
 *  type         string     (requis)  → "text" | "password" | "email" | "number"
 *                                       "select" | "textarea" | "date" | "month"
 *  label        string               → libellé affiché au-dessus du champ
 *  placeholder  string               → texte indicatif dans le champ
 *  required     boolean              → ajoute * rouge au label + validation HTML
 *  fullWidth    boolean              → le champ occupe les 2 colonnes (défaut: false)
 *  options      { value, label }[]  → (type "select" uniquement) liste des options
 *  rows         number               → (type "textarea" uniquement) nb de lignes (défaut: 4)
 *  min / max    string|number        → (type "number" | "date" | "month") bornes
 *  disabled     boolean              → champ non modifiable
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * Exemple complet — Dialog Nouveau Profil :
 *
 *  const [open, setOpen] = useState(false);
 *  const [form, setForm] = useState({});
 *
 *  <DialogForm
 *    isOpen={open}
 *    onClose={() => setOpen(false)}
 *    title="Nouveau Profil"
 *    values={form}
 *    onChange={(key, val) => setForm(f => ({ ...f, [key]: val }))}
 *    onSubmit={() => { console.log(form); setOpen(false); }}
 *    onDelete={() => console.log("Supprimer")}
 *    fields={[
 *      { key: "name",            type: "text",     label: "Nom et Prénom",     placeholder: "John Doe...",   required: true  },
 *      { key: "username",        type: "text",     label: "Username",          placeholder: "John Doe...",   required: true  },
 *      { key: "post",            type: "select",   label: "Post",              required: true,
 *        options: [{ value: "admin", label: "ADMIN" }, { value: "comptable", label: "Comptable" }] },
 *      { key: "password",        type: "password", label: "Password",          required: true  },
 *      { key: "confirmedPassword", type: "password", label: "Confirmed Password",required: true  },
 *      { key: "note",            type: "textarea", label: "Note",              placeholder: "...", rows: 4 },
 *      { key: "date",            type: "month",    label: "Date" },
 *    ]}
 *  />
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * Autres exemples :
 *
 *  // Nouvelle transaction — champ montant pleine largeur
 *  fields={[
 *    { key: "description", type: "text",   label: "Libellé",   placeholder: "Ex: Vente logiciel", required: true, fullWidth: true },
 *    { key: "amount",      type: "number", label: "Montant",   placeholder: "250000", required: true, min: 0 },
 *    { key: "type",        type: "select", label: "Type",      required: true,
 *      options: [{ value: "revenu", label: "Revenu" }, { value: "depense", label: "Dépense" }] },
 *    { key: "date",        type: "date",   label: "Date",      required: true },
 *    { key: "note",        type: "textarea", label: "Note",    rows: 3, fullWidth: true },
 *  ]}
 */

// ── Styles partagés (même base que BlockFilter) ───────────────────
const inputStyle = {
    width: "100%",
    height: "44px",
    padding: "0 14px",
    border: "1.5px solid #d1d5db",
    borderRadius: "10px",
    fontSize: "14px",
    fontFamily: "inherit",
    color: "#0f172a",
    backgroundColor: "white",
    outline: "none",
    appearance: "none",
    WebkitAppearance: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s",
};

const selectStyle = {
    ...inputStyle,
    paddingRight: "36px",
    cursor: "pointer",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 12px center",
};

const textareaStyle = {
    ...inputStyle,
    height: "auto",
    padding: "12px 14px",
    resize: "vertical",
    lineHeight: "1.5",
};

const labelStyle = {
    display: "block",
    fontSize: "13px",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "8px",
};

// ── Rendu d'un champ individuel ───────────────────────────────────
function Field({ field, value, onChange }) {
    const { key, type, label, placeholder, required, options, rows, min, max, disabled } = field;

    const handleChange = (e) => onChange(key, e.target.value);

    const requiredMark = required
        ? <span style={{ color: "#ef4444", marginLeft: "3px" }}>*</span>
        : null;

    let input;

    switch (type) {

        case "select":
            input = (
                <div style={{ position: "relative" }}>
                    <select
                        value={value ?? ""}
                        onChange={handleChange}
                        required={required}
                        disabled={disabled}
                        style={{ ...selectStyle, color: value ? "#0f172a" : "#9ca3af" }}
                    >
                        <option value="" disabled hidden>
                            {placeholder ?? "Sélectionner..."}
                        </option>
                        {options && options.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            );
            break;

        case "textarea":
            input = (
                <textarea
                    value={value ?? ""}
                    onChange={handleChange}
                    placeholder={placeholder ?? ""}
                    required={required}
                    disabled={disabled}
                    rows={rows ?? 4}
                    style={{ ...textareaStyle, height: `${(rows ?? 4) * 26 + 24}px` }}
                />
            );
            break;

        case "month":
            input = (
                <input
                    type="month"
                    value={value ?? ""}
                    onChange={handleChange}
                    required={required}
                    disabled={disabled}
                    min={min}
                    max={max}
                    style={inputStyle}
                />
            );
            break;

        // ── Nouveau : sélecteur de mois (liste déroulante) ──────────────
        case "month-select": 
            const MONTHS = [
                "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
                "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
            ];
            input = (
                <div style={{ position: "relative" }}>
                    <select
                        value={value ?? ""}
                        onChange={handleChange}
                        required={required}
                        disabled={disabled}
                        style={{ ...selectStyle, color: value ? "#0f172a" : "#9ca3af" }}
                    >
                        <option value="" disabled hidden>
                            {placeholder ?? "Mois..."}
                        </option>
                        {MONTHS.map((m, i) => (
                            <option key={i + 1} value={i + 1}>{m}</option>
                        ))}
                    </select>
                </div>
            );
            break;
        

        default: // text | password | email | number | date
            input = (
                <input
                    type={type}
                    value={value ?? ""}
                    onChange={handleChange}
                    placeholder={placeholder ?? ""}
                    required={required}
                    disabled={disabled}
                    min={min}
                    max={max}
                    style={{ ...inputStyle, cursor: disabled ? "not-allowed" : "text", opacity: disabled ? 0.6 : 1 }}
                />
            );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            {label && (
                <label style={labelStyle}>
                    {label}{requiredMark}
                </label>
            )}
            {input}
        </div>
    );
}

// ── Composant principal ───────────────────────────────────────────
function DialogForm({ isOpen, onClose, title, values = {}, onChange, onSubmit, onDelete, onNewPassword, fields = [] }) {

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) onSubmit();
    };

    return (
        // ── Overlay ──
        <div
            onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
            style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                padding: "20px",
                backdropFilter: "blur(2px)",
                animation: "df-fade 0.15s ease",
            }}
        >
            <style>{`
        @keyframes df-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes df-slide { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .df-input:focus { border-color: #081226 !important; }
        .df-btn-save:hover { background-color: #1e293b !important; }
        .df-btn-delete:hover { background-color: #fee2e2 !important; border-color: #ef4444 !important; }
        .df-close:hover { background-color: #f1f5f9 !important; }
      `}</style>

            {/* ── Boîte du dialog ── */}
            <div style={{
                backgroundColor: "white",
                borderRadius: "20px",
                width: "100%",
                maxWidth: "600px",
                minHeight: "500px",
                maxHeight: "90vh",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                animation: "df-slide 0.2s ease",
                overflow: "hidden",
            }}>

                {/* ── 1. Header ── */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "22px 24px 18px",
                    flexShrink: 0,
                    borderBottom: "1px solid #f1f5f9",
                }}>
                    <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "700", color: "#0f172a" }}>
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="df-close"
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "6px",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            color: "#9ca3af",
                            transition: "background 0.15s",
                        }}
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* ── 2. Body scrollable — grille 2 colonnes ── */}
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
                    <div style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: "24px",
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "20px 16px",
                        alignContent: "start",   /* ✅ évite l'espace entre les lignes */
                    }}>
                        {fields.map((field) => (
                            <div
                                key={field.key}
                                style={{ gridColumn: field.fullWidth ? "1 / -1" : "auto" }}
                            >
                                <Field
                                    field={field}
                                    value={values[field.key]}
                                    onChange={onChange}
                                />
                            </div>
                        ))}
                    </div>

                    {/* ── 3. Footer — boutons ── */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "12px",
                        padding: "18px 24px",
                        flexShrink: 0,
                        borderTop: "1px solid #f1f5f9",
                    }}>

                        {/* Bouton Enregistrer */}
                        <button
                            type="submit"
                            className="df-btn-save"
                            style={{
                                height: "48px",
                                padding: "0 36px",
                                backgroundColor: "#081226",
                                color: "white",
                                border: "none",
                                borderRadius: "30px",
                                fontSize: "15px",
                                fontWeight: "600",
                                fontFamily: "inherit",
                                cursor: "pointer",
                                transition: "background-color 0.15s",
                            }}
                        >
                            Enregistrer
                        </button>

                        {/* Bouton Supprimer — affiché uniquement si onDelete est fourni */}
                        {onDelete && (
                            <button
                                type="button"
                                onClick={onDelete}
                                className="df-btn-delete"
                                title="Supprimer"
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    backgroundColor: "white",
                                    border: "1.5px solid #d1d5db",
                                    borderRadius: "50%",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    transition: "background-color 0.15s, border-color 0.15s",
                                    flexShrink: 0,
                                }}
                            >
                                <img src={trashIcon} alt="Supprimer" style={{ width: "20px", height: "20px", objectFit: "contain" }} />
                            </button>
                        )}

                        {/* Bouton Supprimer — affiché uniquement si onDelete est fourni */}
                        {onNewPassword && (
                            <button
                                type="button"
                                onClick={onNewPassword}
                                className="df-btn-delete"
                                title="Supprimer"
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    backgroundColor: "white",
                                    border: "1.5px solid #d1d5db",
                                    borderRadius: "50%",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    transition: "background-color 0.15s, border-color 0.15s",
                                    flexShrink: 0,
                                }}
                            >
                                <img src={passwordIcon} alt="Supprimer" style={{ width: "20px", height: "20px", objectFit: "contain" }} />
                            </button>
                        )}
                    </div>
                </form>

            </div>
        </div>
    );
}

export default DialogForm;