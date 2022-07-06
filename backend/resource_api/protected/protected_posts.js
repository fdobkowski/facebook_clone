const { Router } = require('express')
const router = Router()
const pool = require('../Pool')
const { param } = require('express/lib/request')
const axios = require('axios')
const queries = require('./protected_posts_queries')

const spaClientId = 'spa_client'
const jwt = require('jsonwebtoken')
const realmPemCert = `-----BEGIN CERTIFICATE-----
MIICqzCCAZMCBgGByt4hjjANBgkqhkiG9w0BAQsFADAZMRcwFQYDVQQDDA5mYWNlYm9va19jbG9uZTAeFw0yMjA3MDQyMDE3NDRaFw0zMjA3MDQyMDE5MjRaMBkxFzAVBgNVBAMMDmZhY2Vib29rX2Nsb25lMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAr/rEZx4PnEyU6WppVw2D1PiXjAioJe3tiO1QET2U5mWlKwRSxYKB872PcCz+mbPdz8YZZ6CL/+l5nggyybeJhhTDym2QxodJ8SXTQa9r+pKuD644qt7P7HhYR9Cmkmv6GPyAFvDPrJqstrSDvavRi6G7AdFYAZ/2q7uhyzuSoTopwKafmqhqwV73k2hF9rjLD7z5ApOIORrJQ9kJ4qxkfYK7py7FI2nGo5mrmL5YpbuaaCLdVL3eN0z0/g8cuhji44MtDm5wRH8ISXAEtYxesXRA6byWp+wzd+W3FnH436NMEwKsNAHkM/vFQJKhmA1j3Bk9tfKI8vkTPrgLn6OpxwIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQCLI3d6byiU+rFvOkzLV1dfroO+qOLOvi1otm8bno/Ut+jOwLyUFcr118iTsGwuwqI0Zmy7i24JfMGVYL5XfLSKseFHYPVCvesvG31wLBuzNXIuDNlpbXZrtJeF1+RlX8K7i749pVKMTmU5Me/m937GGYhfuLxM/e7GmOIbfYGfwDKLa2JQSWGGo90QwLWwmWzqx7EU3EoUf7dGoupWJZPJx9HTzJkm9dZetpUUJ1vCfGy+1z1bUZTuSdKkKRueSr0LpaHq0DWYgMn6SDSh8ygGA97E+nbUsdaPOO31nvcdxjFl6q5PcRcaxCMCCVQZStBUC7jI/wWRL2X1507fRYmR
-----END CERTIFICATE-----`

router.get('/', (req, res) => {

    const accessToken = (req.headers.authorization || '').split(' ')[1] || '';
    if (!accessToken) {
        return res.status(401).end();
    }

    const payload = jwt.verify(accessToken, realmPemCert, { algorithms: ['RS256']})

    if (payload.exp < Date.now()) {
        pool.query(queries.get_posts, (err, result) => {
            if (err) throw err
            res.status(200).send(result.rows)
        })
    } else res.status(401).end()

})

module.exports = router