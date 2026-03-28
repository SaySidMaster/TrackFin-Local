import { Outlet, Link } from "react-router-dom";
import SideNavBar from '../components/SideNavBar.jsx'
import DialogForm from "../components/DialogForm.jsx";
import { useState } from "react";
import { DialogContext } from "../context/DialogContext";

function Layout() {

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({});

  const [dialogConfig, setDialogConfig] = useState({
    title: "",
    values: {},
    fields: [],
    onSubmit: null,
    onDelete: null,
  });

  // Fonction générique pour ouvrir le dialog
  const openDialog = ({ title, values = {}, fields = [], onSubmit, onDelete }) => {
    setDialogConfig({
      title,
      values,
      fields,
      onSubmit,
      onDelete,
    });
    setOpen(true);
  };

  return (
    <DialogContext.Provider value={{ openDialog }}>
      <div className="layoutBloc">
        <DialogForm
          isOpen={open}
          onClose={() => setOpen(false)}
          title={dialogConfig.title}
          values={dialogConfig.values}
          onChange={(key, val) =>
            setDialogConfig(cfg => ({
              ...cfg,
              values: { ...cfg.values, [key]: val }
            }))
          }
          onSubmit={() => {
            if (dialogConfig.onSubmit) dialogConfig.onSubmit(dialogConfig.values);
            setOpen(false);
          }}
          onDelete={() => {
            if (dialogConfig.onDelete) dialogConfig.onDelete(dialogConfig.values);
            setOpen(false);
          }}
          fields={dialogConfig.fields}
        />
        <SideNavBar />

        {/* Contenu dynamique */}
        <Outlet />

      </div>
    </DialogContext.Provider>
  );
}

export default Layout;