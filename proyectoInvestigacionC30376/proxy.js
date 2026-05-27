// Ejecutar con: node proxy.js
import http from 'http';
import https from 'https';

const PORT = 3000;

http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    let targetUrl;
    try {
        targetUrl = new URL(decodeURIComponent(req.url.slice(1)));
    } catch {
        res.writeHead(400);
        res.end('URL inválida');
        return;
    }

    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
        const body = Buffer.concat(chunks);
        const options = {
            hostname: targetUrl.hostname,
            port: 443,
            path: targetUrl.pathname + targetUrl.search,
            method: req.method,
            headers: { host: targetUrl.hostname }
        };
        if (body.length > 0) {
            options.headers['content-type']   = 'application/json';
            options.headers['content-length'] = body.length;
        }

        const proxyReq = https.request(options, proxyRes => {
            const data = [];
            proxyRes.on('data', chunk => data.push(chunk));
            proxyRes.on('end', () => {
                res.writeHead(proxyRes.statusCode, { 'content-type': 'application/json' });
                res.end(Buffer.concat(data));
            });
        });

        proxyReq.on('error', err => {
            res.writeHead(500);
            res.end(JSON.stringify({ error: err.message }));
        });

        if (body.length > 0) proxyReq.write(body);
        proxyReq.end();
    });

}).listen(PORT, () => {
    console.log(`Proxy CORS corriendo en http://localhost:${PORT}`);
    console.log('Mantén esta terminal abierta mientras usas la app.');
});
