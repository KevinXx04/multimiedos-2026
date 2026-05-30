const PROXY = 'http://localhost:3000/';

export default function apiFetch(url, options = {}) {
    if (options.body) {
        options = {
            ...options,
            headers: { 'Content-Type': 'application/json', ...options.headers }
        };
    }
    return fetch(PROXY + encodeURIComponent(url), options);
}
