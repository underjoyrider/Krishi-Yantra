const express = require('express');
const http = require('http');
const next = require('next');
const path = require('path');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT, 10) || 3000;
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);

  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    },
    path: '/socket.io',
  });

  // Attach io to global for API routes
  global.__io = io;

  io.on('connection', (socket) => {
    console.log('⚡ Client connected to real-time queue:', socket.id);

    socket.on('join:center', (centerId) => {
      socket.join(`center:${centerId}`);
    });

    socket.on('join:booking', (bookingId) => {
      socket.join(`booking:${bookingId}`);
    });

    socket.on('join:user', (userId) => {
      socket.join(`user:${userId}`);
    });

    socket.on('disconnect', () => {
      // client disconnected
    });
  });

  // NOTE: We intentionally do NOT use express.json()/express.urlencoded()
  // here. This custom server only forwards requests to Next.js's own App
  // Router API routes (src/app/api/**), which parse their own request
  // bodies via `await req.json()`. Adding Express's body-parser globally
  // would drain the request stream before Next.js can read it, causing
  // every POST (like "Confirm Booking") to receive an empty body and fail
  // with "Unexpected end of JSON input". Only add body-parsing middleware
  // here if you add a *new* Express-only route that specifically needs it.

  // Serve the standalone chatbot page without modifying its source file.
  server.get('/krishi_mandi_mitra.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'krishi_mandi_mitra.html'));
  });

  // NOTE: This project also ships a legacy standalone Express REST API
  // (server/routes + server/controllers) from an earlier version of the
  // backend. The real, actively-maintained API used by every screen in
  // the app now lives in src/app/api/** (Next.js route handlers) — that
  // is the version with farmer SMS/notification triggers, slot
  // management endpoints, and real analytics wired in.
  //
  // Previously this legacy Express router was mounted at '/api' *before*
  // Next.js got a chance to handle the request. Since it ends in a
  // catch-all `router.all('*', ...)` that replies with 404, it was
  // silently swallowing every request that Express didn't also happen to
  // implement (e.g. GET/POST /api/staff/slots, GET /api/centers/:id/slots)
  // and, for routes it did implement, running out-of-date duplicate logic
  // instead of the real one (e.g. staff manually updating a booking's
  // status never notified the farmer). That was the source of most of
  // the "vendor portal" bugs. We no longer mount it, so every /api/*
  // request now reaches the real Next.js implementation below.
  //
  // The legacy files are left in place (untouched) in case you want to
  // reference or fully remove them later — they're simply not wired in.

  // Let Next.js handle all page views, API routes, and client-side rendering
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  httpServer.listen(port, (err) => {
    if (err) throw err;
    console.log(`> 🌾 KrishiYantra server running at http://localhost:${port}`);
    console.log(`> 📱 Farmer Portal: http://localhost:${port}/farmer/dashboard`);
    console.log(`> 🏢 Staff Dashboard: http://localhost:${port}/staff/dashboard`);
  });
});
