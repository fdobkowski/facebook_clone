import { useKeycloak } from "@react-keycloak/web";

const PrivateRoute = ({children}) => {
    const { keycloak } = useKeycloak();
    return children
};

export default PrivateRoute;