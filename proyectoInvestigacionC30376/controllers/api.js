const PROXY = 'http://localhost:3000/';

export default function apiFetch(url, options = {}) {
    return fetch(PROXY + encodeURIComponent(url), options);
}
