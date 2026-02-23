const WebSocket = require('ws');

const port = Number(process.env.PORT || 8080);
const wss = new WebSocket.Server({ port });

const rooms = new Map();
let waitingAutoPlayer = null;

const ensureRoom = (roomId) => {
    if (!rooms.has(roomId)) {
        rooms.set(roomId, {
            clients: new Set(),
            stateFen: null
        });
    }
    return rooms.get(roomId);
};

const broadcast = (room, payload, except = null) => {
    const text = JSON.stringify(payload);
    room.clients.forEach((client) => {
        if (client === except) return;
        if (client.readyState !== WebSocket.OPEN) return;
        client.send(text);
    });
};

const pickColor = (room) => {
    const taken = new Set();
    room.clients.forEach((client) => {
        if (client.playerColor) taken.add(client.playerColor);
    });
    if (!taken.has('w')) return 'w';
    if (!taken.has('b')) return 'b';
    return null;
};

const cleanupRoom = (roomId) => {
    const room = rooms.get(roomId);
    if (!room) return;
    if (room.clients.size === 0) {
        rooms.delete(roomId);
    }
};

const leaveCurrentRoom = (ws) => {
    if (!ws.roomId) return;
    const room = rooms.get(ws.roomId);
    if (room) {
        room.clients.delete(ws);
        cleanupRoom(ws.roomId);
    }
    ws.roomId = null;
    ws.playerColor = null;
};

const joinRoom = (ws, roomId, forcedColor = null) => {
    leaveCurrentRoom(ws);
    const room = ensureRoom(roomId);
    ws.roomId = roomId;
    ws.playerColor = forcedColor || pickColor(room);
    room.clients.add(ws);
    ws.send(JSON.stringify({
        type: 'joined',
        room: roomId,
        color: ws.playerColor,
        fen: room.stateFen
    }));
    if (room.stateFen) {
        broadcast(room, {
            type: 'state',
            room: roomId,
            fen: room.stateFen
        }, ws);
    }
};

wss.on('connection', (ws) => {
    ws.roomId = null;
    ws.playerColor = null;

    ws.on('message', (raw) => {
        let payload;
        try {
            payload = JSON.parse(raw.toString());
        } catch {
            return;
        }

        if (!payload || typeof payload !== 'object') return;

        if (payload.type === 'join' && typeof payload.room === 'string') {
            const roomId = payload.room.trim();
            if (!roomId) return;
            if (waitingAutoPlayer === ws) waitingAutoPlayer = null;
            joinRoom(ws, roomId);
            return;
        }

        if (payload.type === 'join-auto') {
            if (waitingAutoPlayer === ws) return;
            if (waitingAutoPlayer && waitingAutoPlayer.readyState === WebSocket.OPEN) {
                const partner = waitingAutoPlayer;
                waitingAutoPlayer = null;
                const autoRoomId = `auto-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
                joinRoom(partner, autoRoomId, 'w');
                joinRoom(ws, autoRoomId, 'b');
            } else {
                waitingAutoPlayer = ws;
                ws.send(JSON.stringify({ type: 'waiting' }));
            }
            return;
        }

        if (!ws.roomId) return;
        const room = rooms.get(ws.roomId);
        if (!room) return;

        if (payload.type === 'state-request') {
            if (!room.stateFen) return;
            ws.send(JSON.stringify({
                type: 'state',
                room: ws.roomId,
                fen: room.stateFen
            }));
            return;
        }

        if (payload.type === 'move') {
            if (typeof payload.fen === 'string' && payload.fen) {
                room.stateFen = payload.fen;
            }
            broadcast(room, {
                type: 'move',
                room: ws.roomId,
                from: payload.from,
                to: payload.to,
                promotion: payload.promotion,
                fen: room.stateFen
            }, ws);
            return;
        }

        if (payload.type === 'reset') {
            if (typeof payload.fen === 'string' && payload.fen) {
                room.stateFen = payload.fen;
            } else {
                room.stateFen = null;
            }
            broadcast(room, {
                type: 'reset',
                room: ws.roomId,
                fen: room.stateFen
            }, ws);
        }
    });

    ws.on('close', () => {
        if (waitingAutoPlayer === ws) waitingAutoPlayer = null;
        leaveCurrentRoom(ws);
    });
});

console.log(`Chess WebSocket server running on ws://localhost:${port}`);
