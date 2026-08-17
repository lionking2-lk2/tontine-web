import { useEffect, useState } from "react";
import { getMe } from "../services/userService";
import { UserContext } from "./userContext";

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getMe();
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