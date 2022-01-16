import { ServerResponse } from 'http';
import * as httpProxy from 'http-proxy';
export const Proxy = httpProxy.createProxyServer({
    target: 'http://db:3000',
});

Proxy.on('error', function (err, req, res: ServerResponse) {
    res.writeHead(500, {
        'Content-Type': 'text/plain'
    });
    res.end('Something went wrong. And we are reporting a custom error message.');
});

Proxy.on('proxyReq', (proxyReq, req) => {
    for (let [k, v] of Object.entries(req.headers)) {
        proxyReq.setHeader(k, v);
    }
    const h = proxyReq.getHeaders();
    console.log(new Date(), "proxy request before", req.url, proxyReq.path, h["Accept-Profile"], "|", h["Content-Profile"], req.headers, proxyReq.getHeaders());
    proxyReq.path = req.url.replace(/^\/rows-db/, '');
    proxyReq.protocol = "http";
    console.log(new Date(), "proxy request after", req.url, proxyReq.path);
});
Proxy.on('proxyRes', (proxyRes, req, res) => {
    console.log(new Date(), `proxy response [${req.method}] [${proxyRes.statusCode}] ${req.url}`);
});
