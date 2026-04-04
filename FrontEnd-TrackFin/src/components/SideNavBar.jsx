import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import trackfinLogo from '../assets/trackfin.png'
import logoutIcon from '../assets/icons/logout.svg'
import { useDialog } from "../context/DialogContext";
import { logout } from "../services/AuthServices";

const SideNavBar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true)
  const location = useLocation() // 👈 récupère la route actuelle
  const user = JSON.parse(localStorage.getItem("user"));

  const menuItems = [
    { id: 1, page: '/dashboard', label: 'Tableau de bord', icon: 'dashboard.svg' },
    { id: 2, page: '/transactions', label: 'Transactions', icon: 'transactions.svg' },
    { id: 3, page: '/debts', label: 'Dettes', icon: 'dettes.svg' },
    { id: 4, page: '/budgets', label: 'Budgets', icon: 'budgets.svg' },
    { id: 5, page: '/contacts', label: 'Clients & Fournisseurs', icon: 'contacts.svg' },
    { id: 6, page: '/statistiques', label: 'Statistiques', icon: 'statistiques.svg' },
    { id: 7, page: '/parametres', label: 'Paramètres', icon: 'parametres.svg' },
  ]

  const getIconStyle = (isActive) => ({
    width: '18px',
    height: '18px',
    objectFit: 'contain',
    filter: isActive
      ? 'invert(79%) sepia(50%) saturate(400%) hue-rotate(90deg) brightness(1)'
      : '',
  })

  const getLabelStyle = (isActive) => ({
    color: isActive ? 'white' : 'black',
    fontSize: '14px',
    fontWeight: isActive ? 'bold' : 'normal',
  })

  const { openDialog } = useDialog();

  const handleUserDialog = async (e) => {
    openDialog({
      title: user.name || "Utilisateur",
      fields: [
        { key: "name", type: "text", label: "Nom", required: true },
        { key: "email", type: "email", label: "Email", required: true },
      ],
      onSubmit: (values) => console.log("Nouveau user:", values),
      onNewPassword: handlePasswordDialog, // ajoute la fonction pour le changement de mot de passe
    });
  };

  const handlePasswordDialog = async (e) => {
    openDialog({
      title: "Changer le mot de passe",
      fields: [
        { key: "password", type: "password", label: "Nouveau mot de passe", required: true },
        { key: "confirmedpassword", type: "password", label: "Confirmer le mot de passe", required: true },
      ],
      onSubmit: (values) => console.log("Nouveau mot de passe:", values),
    });
  };

  const handleLogout = async (e) => {
    try {
      const data = await logout();
      if (data.success){
        navigate("/login");
      } else {
        alert("Échec de la déconnexion. Veuillez réessayer.");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <nav className='SideNavBar'>
      <div className='navTop'>
        <div className='logo-container'>
          <img src={trackfinLogo} style={{ width: '40px', height: '40px', objectFit:'contain' }} alt="" />
          <h3 className='AppTitle'>TrackFin</h3>
        </div>

        <div style={{width: '100%', height: '1px', backgroundColor:'#71717170'}}></div>
      
        <div className='menuList' style={{width: '100%' }}>
          {menuItems.map((item) => {
            const iconSrc = new URL(`../assets/icons/${item.icon}`, import.meta.url).href
            const isActive = location.pathname.includes(item.page) // 👈 compare avec la route actuelle

            return (
              <Link
                to={item.page}
                key={item.id}
                className={`menu-item${isActive ? ' menu-item--active' : ''}`}
                style={{ backgroundColor: isActive ? '#081226' : 'transparent' }}
              >
                <img
                  src={iconSrc}
                  alt={item.label}
                  style={getIconStyle(isActive)}
                />
                {isOpen && <span style={getLabelStyle(isActive)}>{item.label}</span>}
              </Link>
            )
          })}
        </div>
      </div>
      <div className='profileButton'>
        <button onClick={handleUserDialog} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'start', border: 'none', background: 'transparent' }}>
          <h3 style={{ margin: '0' }}>{user?.name || "Utilisateur"}</h3>
          <p style={{ margin: '0', textTransform: 'uppercase' }}>{user?.role || "Utilisateur"}</p>
        </button>
        <button onClick={handleLogout} style={{ border: 'none', background: 'transparent' }}>
          <img src={logoutIcon} style={{ width: '25px', height: '25px', objectFit:'contain' }} alt="" />
        </button>
      </div>
    </nav>
  )
}

export default SideNavBar
