import Keycloak from "keycloak-js";

const _kc = new Keycloak({
    url: "http://localhost:8080/auth",
    realm: "facebook_clone",
    clientId: "spa_client"
})

const initKeycloak = (onAuthenticatedCallback) => {
    _kc.init({
        onLoad: "login-required",
        redirectUri: "http://localhost:3000/protected",
        checkLoginIframe: false,
        pkceMethod: 'S256',
    })
        .then((authenticated) => {
            if (!authenticated) {
                console.log("user is not authenticated..!");
            }
            onAuthenticatedCallback();
        })
        .catch(error => console.error(error));
};


export default {_kc, initKeycloak}