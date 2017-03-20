const authorization = {
  base: (id = 'trusted-client', secret = '') => 'Basic ' + btoa(`${id}:${secret}`),
  bearer: token => 'Bearer ' + `${token}`,
};

const createHeders = token => new Headers({
  'Authorization': token,
  'Accept': '*/*',
  'Content-Type': 'application/x-www-form-urlencoded',
});

const headers = createHeders(authorization.base());

const queryParams = {
  grant_type: 'password',
  username: 'usr',
  password: 'pwd',
};

export function getToken(url = 'http://localhost:9999/oauth/token', options={}) {

  options = {
    method: 'post',
    headers,
    queryParams,
    ...options,
  };

  if(options.queryParams) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + queryParams(options.queryParams);
    delete options.queryParams;
  }

  return fetch(url, options)
    .then(response => response.json());
}

const queryParams = (params = {}) => Object.keys(params)
  .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
  .join('&');
