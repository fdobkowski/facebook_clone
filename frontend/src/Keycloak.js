import Keycloak from "keycloak-js";

const _kc = new Keycloak({
    url: "http://localhost:8080/auth",
    realm: "facebook_clone",
    clientId: "spa_client"
})

export default _kc