import Banner from "../components/Banner";
import CategoryBox from "../components/CategoryBox";
import PaymentMethodBox from "../components/PaymentMethodBox";
import ProfilBox from "../components/ProfilBox";
import CallToAction1 from "../components/CallToAction1";
import addIcon from "../assets/icons/add.svg";
import { useDialog } from "../context/DialogContext";
import { useState, useEffect, useMemo } from "react";
import { getCategories, createCategory, deleteCategory, updateCategory } from "../services/CategoryServices";
import { getPaymentMethods, createPaymentMethod, deletePaymentMethod, updatePaymentMethod } from "../services/PaymentMethodsServices";
import { getUsers, createUser, updateUser, deleteUser, changeOwnPassword, changeUserPassword } from "../services/UserServices";

function Parametres() {

  const [q, setQ] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const inputStyle = {
    height: "40px",
    padding: "0 14px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "13px",
    fontFamily: "inherit",
    color: "#0f172a",
    backgroundColor: "white",
    outline: "none",
    appearance: "none",
    WebkitAppearance: "none",
    cursor: "text",
  };

  const { openDialog } = useDialog();

  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        const [categoriesData, paymentMethodsData, usersData] = await Promise.all([
          getCategories(),
          getPaymentMethods(),
          getUsers(),
        ]);
        setCategories(categoriesData.categories || []);
        setPaymentMethods(paymentMethodsData.payment_methods || []);
        setProfiles(usersData.users || []);
      } catch (err) {
        setError(err.message ?? "Erreur lors du chargement des paramètres");
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, []);

  const handleNewProfilDialog = async () => {
    openDialog({
      title: "Ajouter un profil",
      fields: [
        { key: "name", type: "text", label: "Nom", required: true },
        { key: "email", type: "email", label: "Email", required: true },
        {
          key: "role", type: "select", label: "Rôle", required: true,
          options: [{ value: "admin", label: "Administrateur" }, { value: "accountant", label: "Comptable" }, { value: "cashier", label: "Caissier" }, { value: "user", label: "Utilisateur" }]
        },
        { key: "password", type: "password", label: "Mot de passe", required: true },
        { key: "confirmedPassword", type: "password", label: "Confirmer le mot de passe", required: true },
      ],
      onSubmit: async (values) => {
        if (values.password !== values.confirmedPassword) {
          alert("Les mots de passe ne correspondent pas.");
          return;
        }

        try {
          await createUser({
            name: values.name,
            email: values.email,
            password: values.password,
            password_confirmation: values.confirmedPassword,
            role: values.role,
          });
          await refreshProfiles();
        } catch (error) {
          alert(error.message);
        }
      },
    });
  };

  const handleProfileDetailsDialog = async (profile) => {
    // L'utilisateur connecté est par défaut et ne peut pas être modifiées dans le localstorage
    const isDefaultProfile = profile.email === JSON.parse(localStorage.getItem("user")).email;

    openDialog({
      title: "Détails du profil — " + profile.name,
      initialValues: {
        name: profile.name,
        email: profile.email,
        role: profile.role,
        status: profile.status,
      },
      fields: [
        { key: "name", type: "text", label: "Nom", required: true },
        { key: "email", type: "email", label: "Email", required: true, disabled: isDefaultProfile },
        {
          key: "role", type: "select", label: "Rôle", required: true, disabled: isDefaultProfile,
          options: [{ value: "admin", label: "Administrateur" }, { value: "accountant", label: "Comptable" }, { value: "cashier", label: "Caissier" }, { value: "user", label: "Utilisateur" }]
        },
        {
          key: "status", type: "select", label: "Statut", required: true, disabled: isDefaultProfile,
          options: [{ value: "active", label: "Actif" }, { value: "inactive", label: "Inactif" }]
        },
      ],

      onPasswordChange: isDefaultProfile ? handleChangeOwnPasswordDialog : () => handleChangePasswordDialog(profile),
      // La suppression et la modification sont surppimer si il s'agit du profil par défaut (généralement l'utilisateur connecté)

      onDelete: isDefaultProfile ? null : async () => {
        const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer le profil " + profile.name + " ?");
        if (!confirmed) return;
        try {
          await deleteUser(profile.id);
          await refreshProfiles();
        } catch (error) {
          alert(error.message);
        }
      },
      onSubmit: async (values) => {
        try {
          await updateUser(profile.id, {
            name: values.name,
            email: values.email,
            role: values.role,
          });
          await refreshProfiles();
        } catch (error) {
          alert(error.message);
        }
      },
    });
  };

  const refreshProfiles = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setProfiles(Array.isArray(data) ? data : data?.users || data?.data || []);
    } catch (err) {
      setError(err.message ?? "Erreur lors du chargement des profils");
    } finally {
      setLoading(false);
    }
  };

  const refreshCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data.categories || []);
    } catch (err) {
      setError(err.message ?? "Erreur lors du chargement des catégories");
    } finally {
      setLoading(false);
    }
  };

  const refreshPaymentMethods = async () => {
    try {
      setLoading(true);
      const data = await getPaymentMethods();
      setPaymentMethods(data.payment_methods || []);
    } catch (err) {
      setError(err.message ?? "Erreur lors du chargement des moyens de paiement");
    } finally {
      setLoading(false);
    }
  };

  const handleNewCategoryDialog = async () => {
    openDialog({
      title: "Ajouter une catégorie",
      fields: [
        { key: "name", type: "text", label: "Nom", required: true },
        {
          key: "type", type: "select", label: "Type", required: true,
          options: [{ value: "income", label: "Revenu" }, { value: "expense", label: "Dépense" }]
        },
      ],
      onSubmit: async (values) => {
        try {
          await createCategory(values);
          await refreshCategories();
        } catch (error) {
          alert(error.message);
        }
      },
    });
  };

  const handleCategoryDetailsDialog = async (category) => {
    // Les deux premières catégories (par ordre d'API) sont par défaut et ne peuvent pas être modifiées
    const isDefaultCategory = categories.findIndex(cat => cat.id === category.id) < 2;
    if (isDefaultCategory) {
      alert("Cette catégorie par défaut ne peut pas être modifiée.");
      return;
    }

    openDialog({
      title: "Détails de la catégorie — " + category.name,
      initialValues: {
        name: category.name,
        type: category.type,
      },
      fields: [
        { key: "name", type: "text", label: "Nom", required: true },
        {
          key: "type", type: "select", label: "Type", required: true,
          options: [{ value: "income", label: "Revenu" }, { value: "expense", label: "Dépense" }]
        },
      ],
      onDelete: async () => {
        const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer la catégorie " + category.name + " ?");
        if (!confirmed) return;
        try {
          await deleteCategory(category.id);
          await refreshCategories();
        } catch (error) {
          alert(error.message);
        }
      },
      onSubmit: async (values) => {
        try {
          await updateCategory(category.id, values);
          await refreshCategories();
        } catch (error) {
          alert(error.message);
        }
      },
    });
  };

  const handleNewPaymentMethodDialog = async () => {
    openDialog({
      title: "Ajouter une méthode de paiement",
      fields: [
        { key: "name", type: "text", label: "Nom", required: true },
      ],
      onSubmit: async (values) => {
        try {
          await createPaymentMethod(values);
          await refreshPaymentMethods();
        } catch (error) {
          alert(error.message);
        }
      },
    });
  };

  const handlePaymentMethodDetailsDialog = async (paymentMethod) => {
    // Les deux premiers moyens de paiement (par ordre d'API) sont par défaut et ne peuvent pas être modifiés
    const isDefaultPaymentMethod = paymentMethods.findIndex(method => method.id === paymentMethod.id) < 2;
    if (isDefaultPaymentMethod) {
      alert("Ce moyen de paiement par défaut ne peut pas être modifié.");
      return;
    }

    openDialog({
      title: "Détails de la méthode de paiement — " + paymentMethod.name,
      initialValues: {
        name: paymentMethod.name,
      },
      fields: [
        { key: "name", type: "text", label: "Nom", required: true },
      ],
      onDelete: async () => {
        const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer la méthode de paiement " + paymentMethod.name + " ?");
        if (!confirmed) return;
        try {
          await deletePaymentMethod(paymentMethod.id);
          await refreshPaymentMethods();
        } catch (error) {
          alert(error.message);
        }
      },
      onSubmit: async (values) => {
        try {
          await updatePaymentMethod(paymentMethod.id, values);
          await refreshPaymentMethods();
        } catch (error) {
          alert(error.message);
        }
      },
    });
  };

  const filteredCategories = categories;
  const filteredPaymentMethods = paymentMethods;

  const filteredProfiles = useMemo(() => {
    const list = Array.isArray(profiles) ? profiles : [];
    return list.filter((profile) => {
      if (!q) return true;
      const search = q.toLowerCase();
      return (
        profile.name?.toLowerCase().includes(search) ||
        profile.email?.toLowerCase().includes(search) ||
        profile.role?.toLowerCase().includes(search)
      );
    });
  }, [profiles, q]);

  if (loading) {
    return <div>Chargement des paramètres...</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  // Changer le mot de passe d'un membre (depuis Parametres.jsx — bouton clé)
  const handleChangePasswordDialog = (profile) => {
    openDialog({
      title: "Changer le mot de passe — " + profile.name,
      fields: [
        { key: "password", type: "password", label: "Nouveau mot de passe", required: true },
        { key: "password_confirmation", type: "password", label: "Confirmer mot de passe", required: true },
      ],
      onSubmit: async (values) => {
        if (values.password !== values.password_confirmation) {
          alert("Les mots de passe ne correspondent pas.");
          return;
        }
        try {
          const result = await changeUserPassword(profile.id, values);
          alert(result.message ?? "Mot de passe changé avec succès.");
        } catch (error) {
          alert(error.message);
        }
      },
    });
  };

  // Changer son propre mot de passe (depuis n'importe quelle page)
  const handleChangeOwnPasswordDialog = () => {
    openDialog({
      title: "Changer mon mot de passe",
      fields: [
        { key: "password", type: "password", label: "Nouveau mot de passe", required: true },
        { key: "password_confirmation", type: "password", label: "Confirmer mot de passe", required: true },
      ],
      onSubmit: async (values) => {
        if (values.password !== values.password_confirmation) {
          alert("Les mots de passe ne correspondent pas.");
          return;
        }
        try {
          const result = await changeOwnPassword(values);
          alert(result.message ?? "Mot de passe changé avec succès.");
        } catch (error) {
          alert(error.message);
        }
      },
    });
  };

  return (
    <div className="pageBloc">
      {/* Payment Method bloc */}
      <div style={{
        width: "100%",
        minHeight: "150px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "10px",
        border: "1px solid #0000001a",
        borderRadius: "20px",
      }}>
        <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
          <h3>Moyens de paiement</h3>
          <CallToAction1 title="Ajouter" iconSrc={addIcon} action={handleNewPaymentMethodDialog} />
        </div>
        <div className="ScrollableDiv2" style={{
          width: "100%",
          minHeight: "80px",
          display: "flex",
          flexWrap: "nowrap",
          alignContent: "flex-start",
          gap: "12px",
          overflowX: "scroll",
        }}>
          {filteredPaymentMethods.length > 0 ? filteredPaymentMethods.map((method) => (
            <PaymentMethodBox
              key={method.id}
              libelle={method.name}
              onClick={() => handlePaymentMethodDetailsDialog(method)}
            />
          )) : (
            <div>Aucun moyen de paiement trouvé.</div>
          )}
        </div>
      </div>

      {/* Categories bloc */}
      <div style={{
        width: "100%",
        minHeight: "150px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "10px",
        border: "1px solid #0000001a",
        borderRadius: "20px",
      }}>
        <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
          <h3>Catégories</h3>
          <CallToAction1 title="Ajouter" iconSrc={addIcon} action={handleNewCategoryDialog} />
        </div>
        <div className="ScrollableDiv2" style={{
          width: "100%",
          minHeight: "80px",
          display: "flex",
          flexDirection: "row",
          flexWrap: "nowrap",
          alignItems: "center",
          gap: "12px",
          overflowX: "auto",
          overflowY: "hidden",
          paddingBottom: "10px",
          WebkitOverflowScrolling: "touch",
        }}>
          {filteredCategories.length > 0 ? filteredCategories.map((category) => (
            <CategoryBox
              key={category.id}
              libelle={category.name}
              type={category.type === "income" ? "Revenu" : "Dépense"}
              onClick={() => handleCategoryDetailsDialog(category)}
            />
          )) : (
            <div>Aucune catégorie trouvée.</div>
          )}
        </div>
      </div>

      {/* Contenu de la page Paramètres */}
      <div className="ScrollableDiv" style={{
        height: "90vh",
        display: "flex",
        gap: "12px",
      }}>

        {/* Profils bloc */}
        <div style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          padding: "10px",
          border: "1px solid #0000001a",
          borderRadius: "20px",
        }}>
          <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
            <h3>Profils</h3>
            <form action="">
              <div style={{ position: "relative", flex: 2, minWidth: "200px" }}>
                <input
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Rechercher..."
                  style={{ ...inputStyle, width: "100%", padding: "0px 10px" }}
                />
              </div>
            </form>
            <CallToAction1 title="Ajouter" iconSrc={addIcon} action={handleNewProfilDialog} />
          </div>
          <div className="ScrollableDiv" style={{
            width: "100%",
            height: "100%",
            gap: "12px",
            overflowY: "auto",
          }}>
            {filteredProfiles.map((profile) => (
              <ProfilBox
                key={profile.id}
                id={profile.id}
                name={profile.name}
                post={profile.role}
                email={profile.email}
                status={profile.status}
                onPasswordChange={profile.email === localStorage.getItem("user.email") ? handleChangeOwnPasswordDialog : () => handleChangePasswordDialog(profile)}
                onClick={() => handleProfileDetailsDialog(profile)}
              />
            ))}
          </div>
        </div>



      </div>
    </div>
  );
}

export default Parametres;