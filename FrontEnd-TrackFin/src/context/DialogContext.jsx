// src/context/DialogContext.jsx
import { createContext, useContext, useState } from "react";
import DialogForm from "../components/DialogForm";

const DialogContext = createContext(null);

export const useDialog = () => useContext(DialogContext);

export function DialogProvider({ children }) {

    const [isOpen, setIsOpen] = useState(false);
    const [config, setConfig] = useState({});
    const [values, setValues] = useState({});

    const openDialog = (dialogConfig) => {
        setConfig(dialogConfig);
        setValues(dialogConfig.initialValues ?? {}); // ← pré-remplit les champs
        setIsOpen(true);
    };

    const closeDialog = () => {
        setIsOpen(false);
        setConfig({});
        setValues({});
    };

    const handleChange = (key, value) => {
        setValues(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = () => {
        if (config.onSubmit) config.onSubmit(values);
        closeDialog();
    };

    const handleDelete = config.onDelete
        ? () => { config.onDelete(); closeDialog(); }
        : undefined;

    return (
        <DialogContext.Provider value={{ openDialog, closeDialog }}>
            {children}
            <DialogForm
                isOpen={isOpen}
                onClose={closeDialog}
                title={config.title}
                subtitle={config.subtitle}
                disabledSubmit={config.disabledSubmit}
                buttonLabel={config.buttonLabel}
                fields={config.fields ?? []}
                values={values}
                onChange={handleChange}
                onSubmit={handleSubmit}
                onDelete={handleDelete}
            />
        </DialogContext.Provider>
    );
}