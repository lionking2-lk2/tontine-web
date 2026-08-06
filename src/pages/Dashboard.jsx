import { useEffect, useState } from "react";
import { getGroupes } from "../services/groupeService";


function Dashboard(){

    const [groupes,setGroupes] = useState([]);

    useEffect(()=>{

        getGroupes()
        .then(data=>{
            setGroupes(data);
        })
        .catch(error=>{
            console.log(error);
        });

    },[]);


    return (
        <div>

            <h1>
                Dashboard Tontine
            </h1>


            {
                groupes.map(groupe=>(
                    <div key={groupe.id}>
                        <h3>{groupe.nomGroupe}</h3>
                        <p>{groupe.description}</p>
                    </div>
                ))
            }


        </div>
    );
}


export default Dashboard;
