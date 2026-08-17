import { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../services/userService";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getMe();

console.log("USER REÇU PAR CONTEXT :", response.data);

setUser(response.data);
            } catch (error) {
                console.error("Erreur récupération profil :", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);