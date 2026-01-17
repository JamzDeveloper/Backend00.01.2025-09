console.log('Inicio de la aplicacion');

require('dotenv').config();

const path = require('path');
const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const OpenAI = require('openai');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {ObjectId} = require('mongodb');
const {getMessagesCollection, getUsersCollection} = require('./db');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 8080;
const OPENAI_MODEL = process.env.openAIModel || 'gpt-5';
const SYSTEM_PROMPT = process.env.SYSTEM_PROMPT || 'Eres un asistente para estudiantes de backend. Responde en español de forma clara y breve.';
const HISTORY_LIMIT = Number.parseInt(process.env.HISTORY_LIMIT || '50', 10);
const CONTEXT_LIMIT = Number.parseInt(process.env.CONTEXT_LIMIT || '20', 10);
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '2h';
const SALT_ROUNDS = Number.parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
const USERNAME_MIN = 3;
const USERNAME_MAX = 20;
const PASSWORD_MIN = 6;

const openai = process.env.openAIKey ? new OpenAI({apiKey: process.env.openAIKey}) : null;

function normalizeUsername(value){
    return String(value || '').trim();
}

function normalizePassword(value){
    return String(value || '').trim();
}

function validateCredentials(username, password){
    const safeUsername = normalizeUsername(username);
    const safePassword = normalizePassword(password);

    if (!safeUsername || !safePassword){
        return {ok: false, message: 'Usuario y contraseña son requeridos'};
    }
    if (safeUsername.length < USERNAME_MIN || safeUsername.length > USERNAME_MAX){
        return {ok: false, message: `El usuario debe tener entre ${USERNAME_MIN} y ${USERNAME_MAX} caracteres`};
    }
    if (safePassword.length < PASSWORD_MIN){
        return {ok: false, message: `La contraseña debe tener al menos ${PASSWORD_MIN} caracteres`};
    }
    return{
        ok: true,
        username: safeUsername,
        password: safePassword,
        usernameKey: safeUsername.toLowerCase()
    };
}

function buildUserResponse(user){
    return {id: user._id.toString(), username: user.username};
}

function createToken(user){
    if (!JWT_SECRET){
        throw new Error('JWT_SECRET no configurado');
    }
    return jwt.sign(
        {sub: user._id.toString(), username: user.username},
        JWT_SECRET,
        {expiresIn: JWT_EXPIRES_IN}
    );
}

function getUserObjectId(userId){
    try{
        return new ObjectId(userId);
    } catch (error){
        return null;
    }
}

app.use(express.json());

app.post('/api/auth/register', async (req, res) => {
    try{
        const validation = validateCredentials(req.body?.username, req.body?.password);
        if (!validation.ok){
            return res.status(400).json({error: validation.message});
        }

        const users = await getUsersCollection();
        const existing = await users.findOne({usernameKey: validation.usernameKey});
        if (existing){
            return res.status(409).json({error: 'El usuario ya existe'});
        }

        const passwordHash = await bcrypt.hash(validation.password, SALT_ROUNDS);
        const newUser = {
            username: validation.username,
            usernameKey: validation.usernameKey,
            passwordHash,
            createdAt: new Date()
        };
        const result = await users.insertOne(newUser);
        const savedUser = {...newUser, _id: result.insertedId};

        const token = createToken(savedUser);
        return res.status(201).json({token, user: buildUserResponse(savedUser)});
    } catch (error){
        console.error('Error registrando usuario', error);
        return res.status(500).json({error: 'No se pudo registrar el usuario'});
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const validation = validateCredentials(req.body?.username, req.body?.password);
        if (!validation.ok){
            return res.status(400).json({error: validation.message});
        }

        const users = await getUsersCollection();
        const user = await users.findOne({usernameKey: validation.usernameKey});
        if (!user){
            return res.status(401).json({error: 'Credenciales invalidas'});
        }

        const isValid = await bcrypt.compare(validation.password, user.passwordHash || '');
        if (!isValid){
            return res.status(401).json({error: 'Credenciales invalidas'});
        }

        const token = createToken(user);
        return res.json({token, user: buildUserResponse(user)});
    } catch (error){
        console.error('Error en login', error);
        return res.status(500).json({error: 'No se pudo iniciar sesion'});
    }
});

app.get('/health', (req, res) => {
    res.json({ok: true, timestamp: new Date().toISOString()});
});

app.use(express.static(path.join(__dirname, '..', 'public')));

function mapMessage(doc){
    return{
        id: doc._id.toString(),
        role: doc.role,
        content: doc.content,
        author: doc.author,
        createdAt: doc.createdAt ? doc.createdAt.toISOString() : null,
        updatedAt: doc.updatedAt ? doc.updatedAt.toISOString() : null,
        edited: Boolean(doc.edited)
    };
}

async function loadHistory(userId, limit){
    const collection = await getMessagesCollection();
    const docs = await collection.find({userId})
        .sort({createdAt: -1})
        .limit(limit)
        .toArray();
    return docs.reverse().map(mapMessage);
}

async function buildContext(userId, limit, options){
    const collection = await getMessagesCollection();
    const query = {userId};
    if (options?.beforeDate){
        query.createdAt = {$lte: options.beforeDate};
    }
    const docs = await collection.find(query)
        .sort({createdAt: -1})
        .limit(limit)
        .toArray();
    const ordered = docs.reverse();
    const filtered = options?.excludeReplyTo
        ? ordered.filter((doc) => doc.role !== 'assistant' || doc.replyTo?.toString() !== options.excludeReplyTo.toString())
        : ordered;
    return filtered.map((doc) => ({role: doc.role, content: doc.content}));
}

io.use((socket, next) => {
    if (!JWT_SECRET){
        return next(new Error('AUTH_CONFIG'));
    }

    const token = socket.handshake.auth?.token;
    if (!token){
        return next(new Error('AUTH_REQUIRED'));
    }

    try{
        const payload = jwt.verify(token, JWT_SECRET);
        socket.user = {id: payload.sub, username: payload.username};
        return next();
    } catch (error){
        return next(new Error('AUTH_INVALID'));
    }
});

io.on('connection', async (socket) => {
    console.log(`Nuevo usuario conectado: ${socket.id}`);
    const userId = socket.user?.id;
    const userObjectId = getUserObjectId(userId);
    if (!userObjectId){
        socket.disconnect(true);
        return;
    }
    const userRoom = `user:${userId}`;
    socket.join(userRoom);

    try{
        const history = await loadHistory(userObjectId, HISTORY_LIMIT);
        socket.emit('history', history);
    } catch (error){
        console.error('No se pudo cargar el historial', error);
    }

    socket.on('sendMessage', async (payload, callback) => {
        try{
            const content = typeof payload === 'string' ? payload : payload?.content;
            const user = socket.user;
            const author = user?.username || 'Usuario';
            if (!content || !content.trim()){
                if (callback){
                    callback({error: 'Mensaje vacio'});
                }
                return;
            }
            if (!userObjectId){
                if (callback){
                    callback({error: 'Usuario no autenticado'});
                }
                return;
            }

            const now = new Date();
            const userMessage = {
                role: 'user',
                content: content.trim(),
                author,
                userId: userObjectId,
                createdAt: now,
                updatedAt: now,
                edited: false
            };

            const collection = await getMessagesCollection();
            const result = await collection.insertOne(userMessage);
            const savedUserMessage = {...userMessage, _id: result.insertedId};

            io.to(userRoom).emit('messageCreated', mapMessage(savedUserMessage));

            if (callback){
                callback();
            }

            if (!openai){
                return;
            }

            io.to(userRoom).emit('assistantTyping', {isTyping: true});
            try{
                const contextMessages = await buildContext(userObjectId, CONTEXT_LIMIT);
                const response = await openai.chat.completions.create({
                    model: OPENAI_MODEL,
                    messages: [
                        {role: 'system', content: SYSTEM_PROMPT},
                        ...contextMessages
                    ]
                });

                const assistantText = response.choices?.[0]?.message?.content?.trim();
                if (assistantText){
                    const assistantMessage = {
                        role: 'assistant',
                        content: assistantText,
                        author: 'ChatGPT',
                        userId: userObjectId,
                        replyTo: savedUserMessage._id,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        edited: false
                    };
                    const assistantResult = await collection.insertOne(assistantMessage);
                    io.to(userRoom).emit('messageCreated', mapMessage({...assistantMessage, _id: assistantResult.insertedId}));
                }
            } catch (error){
                console.error('Error generando respuesta', error);
            } finally{
                io.to(userRoom).emit('assistantTyping', {isTyping: false});
            }
        } catch (error){
            console.error('Error enviando mensaje', error);
            if (callback){
                callback({error: 'No se pudo procesar el mensaje'});
            }
        }
    });

    socket.on('editMessage', async (payload, callback) => {
        try{
            const messageId = payload?.id;
            const content = payload?.content;
            if (!messageId || !content || !content.trim()){
                if (callback){
                    callback({error: 'Datos incompletos'});
                }
                return;
            }

            const collection = await getMessagesCollection();
            const objectId = new ObjectId(messageId);
            const existing = await collection.findOne({_id: objectId});

            if (!existing){
                if (callback){
                    callback({error: 'Mensaje no encontrado'});
                }
                return;
            }

            if (existing.role !== 'user'){
                if (callback){
                    callback({error: 'Solo se pueden editar mensajes de usuario'});
                }
                return;
            }

            const ownerId = existing.userId?.toString();
            const currentUserId = socket.user?.id;
            const baseDate = existing.createdAt instanceof Date ? existing.createdAt : null;
            if (!ownerId){
                if (callback){
                    callback({error: 'Mensaje sin propietario'});
                }
                return;
            }
            if (!currentUserId || ownerId !== currentUserId){
                if (callback){
                    callback({error: 'No es el usuario correspondiente al mensaje'});
                }
                return;
            }

            const now = new Date();
            await collection.updateOne(
                {_id: objectId},
                {$set: {
                    content: content.trim(),
                    updatedAt: now,
                    edited: true
                }}
            );

            io.to(userRoom).emit('messageUpdated', {
                id: messageId,
                content: content.trim(),
                edited: true,
                updatedAt: now.toISOString()
            });

            if (callback){
                callback();
            }

            if (!openai){
                return;
            }

            io.to(userRoom).emit('assistantTyping', {isTyping: true});
            try{
                const contextMessages = await buildContext(
                    userObjectId,
                    CONTEXT_LIMIT,
                    {excludeReplyTo: objectId, beforeDate: baseDate || undefined}
                );
                const response = await openai.chat.completions.create({
                    model: OPENAI_MODEL,
                    messages: [
                        {role: 'system', content: SYSTEM_PROMPT},
                        ...contextMessages
                    ]
                });

                const assistantText = response.choices?.[0]?.message?.content?.trim();
                if (assistantText){
                    const assistantMessage = await collection.findOne({
                        userId: userObjectId,
                        role: 'assistant',
                        replyTo: objectId
                    });

                    if (assistantMessage){
                        const updatedAt = new Date();
                        await collection.updateOne(
                            {_id: assistantMessage._id},
                            {$set: {content: assistantText, updatedAt, edited: true}}
                        );
                        io.to(userRoom).emit('messageUpdated', {
                            id: assistantMessage._id.toString(),
                            content: assistantText,
                            edited: true,
                            updatedAt: updatedAt.toISOString()
                        });
                    } else{
                        const newAssistantMessage = {
                            role: 'assistant',
                            content: assistantText,
                            author: 'ChatGPT',
                            userId: userObjectId,
                            replyTo: objectId,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            edited: false
                        };
                        const assistantResult = await collection.insertOne(newAssistantMessage);
                        io.to(userRoom).emit('messageCreated', mapMessage({...newAssistantMessage, _id: assistantResult.insertedId}));
                    }
                }
            } catch (error){
                console.error('Error regenerando respuesta', error);
            } finally{
                io.to(userRoom).emit('assistantTyping', {isTyping: false});
            }
        } catch (error){
            console.error('Error editando mensaje', error);
            if (callback){
                callback({error: 'No se pudo editar el mensaje'});
            }
        }
    });

    socket.on('deleteMessage', async (payload, callback) => {
        try{
            const messageId = payload?.id;
            if (!messageId){
                if (callback){
                    callback({error: 'Datos incompletos'});
                }
                return;
            }

            let objectId;
            try{
                objectId = new ObjectId(messageId);
            } catch (error){
                if (callback){
                    callback({error: 'Id de mensaje invalido'});
                }
                return;
            }

            const collection = await getMessagesCollection();
            const existing = await collection.findOne({_id: objectId});

            if (!existing){
                if (callback){
                    callback({error: 'Mensaje no encontrado'});
                }
                return;
            }

            if (existing.role !== 'user'){
                if (callback){
                    callback({error: 'Solo se pueden eliminar mensajes de usuario'});
                }
                return;
            }

            const ownerId = existing.userId?.toString();
            const currentUserId = socket.user?.id;
            if (!ownerId || !currentUserId || ownerId !== currentUserId){
                if (callback){
                    callback({error: 'No es el usuario correspondiente al mensaje'});
                }
                return;
            }

            const assistantDocs = await collection.find({
                userId: userObjectId,
                role: 'assistant',
                replyTo: objectId
            }).project({_id: 1}).toArray();

            await collection.deleteOne({_id: objectId});
            if (assistantDocs.length){
                await collection.deleteMany({
                    userId: userObjectId,
                    role: 'assistant',
                    replyTo: objectId
                });
            }

            const deletedIds = [
                messageId,
                ...assistantDocs.map((doc) => doc._id.toString())
            ];

            io.to(userRoom).emit('messageDeleted', {ids: deletedIds});

            if (callback){
                callback();
            }
        } catch (error){
            console.error('Error eliminando mensaje', error);
            if (callback){
                callback({error: 'No se pudo eliminar el mensaje'});
            }
        }
    });

    socket.on('clearHistory', async (callback) => {
        try{
            const collection = await getMessagesCollection();
            await collection.deleteMany({userId: userObjectId});
            io.to(userRoom).emit('historyCleared');
            if (callback){
                callback();
            }
        } catch (error){
            console.error('Error borrando historial', error);
            if (callback){
                callback({error: 'No se pudo borrar el historial'});
            }
        }
    });

    socket.on('disconnect', () => {
        console.log(`Usuario desconectado: ${socket.id}`);
    });
});

server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
