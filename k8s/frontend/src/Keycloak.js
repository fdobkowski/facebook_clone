import Keycloak from "keycloak-js";

const _kc = new Keycloak({
    url: "http://localhost:8080",
    realm: "facebook_clone",
    clientId: "spa_client",
    flow: 'implicit'
})

export default _kc