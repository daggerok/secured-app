// Fetch API: https://developer.mozilla.org/ru/docs/Web/API/Fetch_API/Using_Fetch#Headers

/** private helpers */

const authorization = {
  base: (id = 'trusted-client', secret = '') => 'Basic ' + btoa(`${id}:${secret}`),
  bearer: token => 'Bearer ' + `${token}`,
};

const createHeders = token => new Headers({
  'Authorization': token,
  'Accept': '*/*',
  'Content-Type': 'application/x-www-form-urlencoded',
});

const toKeyValueString = params => Object.keys(params)
  .map(key => `${key}=${params[ key ]}`)
  .join('&');

const fetchJson = (url, options) => fetch(url, options)
  .then(response => response.json());

/** public api */

export const getTrustedClientToken = (options = {}, url = 'http://localhost:9999/oauth/token') => fetchJson(url, {
  headers: createHeders(authorization.base()),
  method: 'post',
  // mode: 'cors',
  // headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
  body: toKeyValueString({
    grant_type: 'password',
    username: 'usr',
    password: 'pwd',
  }),
  ...options,
});

export const getClientWithSecretToken = (options = {}, url = 'http://localhost:9999/oauth/token') => fetchJson(url, {
  headers: createHeders(authorization.base('client-with-secret', 'client-password')),
  method: 'post',
  // mode: 'cors',
  // headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
  body: toKeyValueString({
    grant_type: 'password',
    username: 'usr',
    password: 'pwd',
  }),
  ...options,
});

export const getData = (options = {}, url) => fetchJson(url, {
  headers: createHeders(authorization.bearer(options[ 'access_token' ])),
  method: 'get',
  // mode: 'cors',
  ...options,
});
