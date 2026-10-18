require('dotenv').config();

const express = require('express');
const pino = require('pino');
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const { handleCommand } = require('./lib/handler');

const app = express();
app.get('/pair', (_req, res) => res.sendFile(require('path').join(__dirname, 'pair.html')));
app.use('/public', express.static(require('path').join(__dirname, 'public')));
app.get('/', (_req, res) => res.status(200).send('MISTER-MD-BOT is running.'));
app.get('/health', (_req, res) => res.json({ ok: true, bot: 'MISTER-MD-BOT' }));
const port = Number(process.env.PORT || 3000);
app.listen(port, '0.0.0.0', () => console.log(`Health server listening on ${port}`));

const OWNER_NUMBER = (process.env.OWNER_NUMBER || '50940217685').replace(/\D/g, '');
const PAIRING_NUMBER = (process.env.PAIRING_NUMBER || '').replace(/\D/g, '');
const logger = pino({ level: 'silent' });

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('sessions');
  let version;
  try {
    ({ version } = await fetchLatestBaileysVersion());
  } catch (_) {
    version = undefined;
  }

  const sock = makeWASocket({
    logger,
    auth: state,
    version,
    printQRInTerminal: false,
    browser: ['MISTER-MD-BOT', 'Chrome', '1.0.0'],
    markOnlineOnConnect: false,
    syncFullHistory: false
  });

  if (PAIRING_NUMBER && !sock.authState.creds.registered) {
    try {
      const code = await sock.requestPairingCode(PAIRING_NUMBER);
      console.log(`WhatsApp pairing code for ${PAIRING_NUMBER}: ${code}`);
      console.log('Enter this code in WhatsApp > Linked devices > Link a device > Link with phone number.');
    } catch (err) {
      console.error('Could not create pairing code:', err.message);
    }
  }

  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr && !PAIRING_NUMBER) {
      console.log('Scan this QR with WhatsApp > Linked devices:');
      qrcode.generate(qr, { small: true });
    }
    if (connection === 'open') console.log('MISTER-MD-BOT connected to WhatsApp.');
    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode;
      const loggedOut = code === DisconnectReason.loggedOut;
      console.log('WhatsApp connection closed.', loggedOut ? 'Session logged out; remove sessions and pair again.' : 'Reconnecting...');
      if (!loggedOut) setTimeout(startBot, 3000);
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    for (const msg of messages) {
      try {
        if (!msg.message || msg.key.fromMe) continue;
        await handleCommand(sock, msg, { OWNER_NUMBER });
      } catch (err) {
        console.error('Message handler error:', err.message);
      }
    }
  });
}

startBot().catch(err => {
  console.error('Fatal startup error:', err);
  process.exitCode = 1;
});
