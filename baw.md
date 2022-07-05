# Facebook clone
> Prosty klon facebook'a zabezpieczony standardem OAuth/OpenID Connect

## Spis treści

- [Wstęp](#wstęp)
- [Technologie](#technologie)
- [Instalacja](#instalacja)
- [Flow aplikacji](#flow-aplikacji)

## Wstęp

Aplikacja dzieli się na 5 części:
- (Authorization Server wg OAuth) Keycloak
- (Resource Sever wg OAuth) Api połączone z bazą danych
- (Client wg OAuth) program pobierający dane z api
- (Client wg OAuth) inny program pobierający dany z api
- (Client wg OAuth) aplikacja reactowa korzystająca z api

## Technologie

##### Api
- axios - v0.27.2
- cors - v2.8.5
- express - v4.18.1
- pg - v8.7.3

##### Baza danych
- PostgreSQL - v14.2

##### Frontend
- ReactJS - v18.1.0
- Formik - v2.2.9
- Keycloak-js - v18.0.1
- React-router-dom - v6.3.0
- uuid - v8.3.2
- react-cookie - v4.1.1

## Instalacja

##### (1) Docker

Należy uruchomić aplikacje `docker desktop`, a następnie wykonać komendy:
- `docker run --name postgres -e POSTGRES_PASSWORD=password -d -p 5432:5432 postgres:14`
- `docker run -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:18.0.0 start-dev`

##### (2) Api
Do uruchomienia api wystarczy komenda `node index.js` w katalogu `/backend/resource_api`

##### (3) Klienty

Do uruchomienia klientów należy wykonać komendy:

Dla aplikacji reactowej (w katalogu `frontend`):
- `yarn start`

Dla aplikacji SSR (w katalogu `ssr`):
- `node index.js`

Dla drugiej aplikacji backendowej (w katalogu `backend/post_manager`):
- `node index.js`

## Flow aplikacji

##### (1) SSR

Konfiguracja keycloaka:

!["kc1"](assets/keycloak(1).png)
!["kc2"](assets/keycloak(2).png)

Konfiguracja parametrów:

```javascript
const authEndpoint = 'http://localhost:8080/realms/facebook_clone/protocol/openid-connect/auth'
const tokenEndpoint = 'http://localhost:8080/realms/facebook_clone/protocol/openid-connect/token'

const apiEndpoint = 'http://localhost:5000/api/protected/users'

const clientId = 'ssr_client'
const clientSecret = 'C25HFakJ8BhBS8uB80Xa64mDOogOiEWI'

const codeChallenge = pkce.code_challenge
const codeVerifier = pkce.code_verifier

const redirectUri = 'http://localhost:4000/protected'

const authRequest = `${authEndpoint}?
response_type=code&
client_id=${clientId}&
state=1234&
redirect_uri=http://localhost:4000/protected&
code_challenge=${codeChallenge}&
code_challenge_method=S256`;
```

`codeChallenge` oraz `codeVerifier` są generowane automatycznie za pomocą biblioteki `pkce-challenge`.

```javascript
 const params = new URLSearchParams()

    params.append('grant_type', 'authorization_code')
    params.append('redirect_uri', redirectUri)
    params.append('client_id', clientId)
    params.append('client_secret', clientSecret)
    params.append('code_verifier', codeVerifier)
    params.append('code', req.query.code)

    axios.post(tokenEndpoint, params).then(response => {
        accessToken = response.data.access_token || ''
        axios.get(apiEndpoint, {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        }).then(response => {
            res.set('Content-Type', 'text/html')
            res.send(html.protected_data(response.data.rows))
        }).catch(error => console.error(error))
    }).catch(error => console.error(error))
```

!["kc3"](assets/keycloak(3).png)


!["kc4"](assets/keycloak(4).png)


!["kc5"](assets/keycloak(5).png)

##### (2) Aplikacja Reactowa

Konfiguracja keycloak'a:

!["kc6"](assets/keycloak(6).png)

Flow aplikacji:

Aplikacja posiada możliwość rejestracji (BasicAuth):

```javascript
const token = Buffer.from(`${id}:${values.email}:${values.number}:${values.password}`, 'utf8').toString('base64')

        await axios.get("http://localhost:5000/api/users", {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(async () => {
            await axios.post("http://localhost:5000/api/profiles", {
                id: id,
                first_name: values.first_name,
                last_name: values.last_name,
                birthday: `${values.year}-${values.month}-${values.day}`,
                gender: values.gender,
                custom_gender: values.custom_gender,
                pronoun: values.pronoun
            }).then((response) => alert(response.data)).catch(error => console.error(error))
        }).catch(error => console.error(error))
```

!["kc7"](assets/keycloak(7).png)
!["kc8"](assets/keycloak(8).png)

Możliwość dodawania postów, które są dodawane przez api do bazy danych

!["kc9"](assets/keycloak(9).png)

Możliwość obejrzenia wszystkich informacji o postach dla "administratora" (nie działa z keycloak'iem)

```javascript
<button onClick={() => keycloak.login()}>Log in</button>
```

!["kc10"](assets/keycloak(10).png)

##### (3) Inna aplikacja backendowa

Konfiguracja keycloak'a:

!["kc11"](assets/keycloak(11).png)

Konfiguracja parametrów:

```javascript
const tokenEndpoint = 'http://localhost:8080/realms/facebook_clone/protocol/openid-connect/token'

const apiProtectedEnpoint = "http://localhost:5000/api/protected/profiles"

const clientId = "post_manager"
const clientSecret = "yRoOU4ZZkaudWFxKetReLWCR13FPndh6"
```
```javascript
const params = new URLSearchParams()

    params.append('client_id', clientId)
    params.append('client_secret', clientSecret)
    params.append('grant_type', 'client_credentials')


    await axios.post(tokenEndpoint, params).then(async response => {

        const accessToken = response.data.access_token || ''

        await axios.post(apiProtectedEnpoint,{login: req.body.login}, {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        }).then(response => {
            res.send(response.data.rows)
        }).catch(error => console.error(error))
    }).catch(error => {
        res.status(401).send(error)
    })
```