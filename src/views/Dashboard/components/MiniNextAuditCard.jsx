import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { MiniStatisticsCard } from "../../../components/Cards"
import { useAuditsStore } from "../../../hooks/useAuditsStore"
import { useAuthStore } from "../../../hooks/useAuthStore"
import { useEffect } from "react"
import { useUsersStore } from "../../../hooks/useUsersStore"
import enums from "../../../helpers/enums"
import Swal from "sweetalert2"

const MiniNextAuditCard = () => {

    const {
        UserType
    } = enums();

    // CUSTOM HOOKS

    const {
        user: authUser,
    } = useAuthStore();

    const { 
        isUserLoading,
        user,
        userAsync,
        usersErrorMessage,
    } = useUsersStore();

    const {
        getNextAuditAsync,
    } = useAuditsStore();

    // HOOKS

    useEffect(() => {       

        if (!!authUser)
        {
            userAsync(authUser.id);
        }
    }, []);

    useEffect(() => {
        //console.log('MiniNextAuditCard.useEffect[user]');

        if (!!user)
        {
//console.log(user);
            if (user.Type == UserType.auditor && user.OwnerID) {
                getNextAuditAsync(user.OwnerID, null, UserType.auditor)
                    .then(data => {
                        if (!!data) {
                            console.log('MiniNextAuditCard.useEffect[]: data', data);
                            //setNextAudit(data);
                        }
                    })
                    .catch(error => {
                        //console.log(err);
                        // Capturar información detallada del error
                        if (error.response) {
                            // El servidor respondió con un código de estado de error
                            console.error('Status:', error.response.status);
                            console.error('Data:', error.response.data);
                            console.error('Headers:', error.response.headers);
                        } else if (error.request) {
                            // La solicitud se hizo pero no hubo respuesta
                            console.error('Request:', error.request);
                        } else {
                            // Algo más causó el error
                            console.error('Error:', error.message);
                        }
                    });
                
            }
        }

    }, [user]);
    
    useEffect(() => {
        if (!!usersErrorMessage) {
            console.log('Loading users', usersErrorMessage, 'error');
        }
    }, [usersErrorMessage]);

    return (
        <MiniStatisticsCard
            title="Next audit"
            count="18"
            percentage={{ text: 'days left', color: 'info' }}
            icon={{ icon: faMagnifyingGlass, bgColor: 'info' }}
        />
    )
}

export default MiniNextAuditCard