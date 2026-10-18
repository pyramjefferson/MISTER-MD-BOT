# MISTER-MD-BOT

WhatsApp bot built with Node.js and Baileys. Commands are separated from `index.js`.

## Included and working
- `.menu`, `.allmenu`, `.smenu`: menu and 🔥 reaction
- `.owner`: shows owner number `+50940217685` and WhatsApp contact link
- `.alive`, `.ping`, `.uptime`, `.echo`
- `.calc`, `.base64`, `.urldecode`, `.reverse`, `.length`, `.smallcaps`
- `.dado`, `.8ball`, `.joke`, `.truth`, `.dare`
- `.groupinfo`, `.invitelink`, `.tag`, `.tagall`, `.hidetag`, `.add`, `.kick`, `.promote`, `.demote` (group permissions required)
- `/` and `/health` HTTP endpoints for Render health checks

## Important
The menu is a catalogue of commands from the requested design. **It does not mean every listed command is implemented.** Commands needing third-party APIs (AI, video/music downloads, image generation, uploads, etc.) need separate integrations and API keys. Unimplemented commands return a clear message instead of pretending to work.

## Run locally
1. Install Node.js 20 or newer.
2. Copy `.env.example` to `.env`.
3. Keep `OWNER_NUMBER=50940217685`.
4. Run `npm install`, then `npm start`.
5. Scan the QR shown in the terminal with WhatsApp > Linked devices > Link a device.

To use a pairing code instead of QR, set `PAIRING_NUMBER` in `.env` to a WhatsApp number you control, restart, then enter the displayed code in WhatsApp > Linked devices > Link with phone number.

## Deploy on GitHub + Render
1. Upload the project files to your GitHub repository.
2. In Render, create a **Web Service** connected to that repository.
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables:
   - `OWNER_NUMBER` = `50940217685`
   - `BOT_MODE` = `public` or `private`
   - `PREFIX` = `.`
   - `PAIRING_NUMBER` = your own WhatsApp number (optional; digits only)
6. Check the Render logs for the pairing code or QR.

### Session persistence warning
Baileys saves login credentials in `sessions/`. Render's normal filesystem can be ephemeral, so a redeploy/restart may require pairing again unless you configure persistent storage and store the session there. Never commit `sessions/` or `.env` to GitHub.

## Mode
- `BOT_MODE=public`: commands are accepted from anyone.
- `BOT_MODE=private`: commands are accepted only from the owner number.
Set the variable in Render's Environment section and redeploy.

## Security
- Do not publish your session folder, pairing code, or `.env`.
- Only use this bot with a WhatsApp account you own or have permission to operate.


## Pairing page
After deployment, open `https://YOUR-RENDER-SERVICE.onrender.com/pair` for the MISTER-MD-BOT pairing setup page. The page does not expose a pairing code; configure `PAIRING_NUMBER` in Render and read the code in Render Logs. The bot artwork is in `public/mister-md-bot.png`.

## Additional working commands
- `.gpt question` uses the OpenAI API when `OPENAI_API_KEY` is configured.
- `.wiki topic` retrieves a Wikipedia summary.
- `.define word` looks up an English dictionary definition.
- `.fact` returns a built-in fact.
- `.units 10 km mi`, `.units 100 f c`, `.units 5 kg lb` converts supported units.
- `.tinyurl https://example.com` requests a TinyURL link.

For AI, add `OPENAI_API_KEY` in Render's Environment settings. API usage may incur charges. Never commit the key to GitHub. Many commands displayed in the menu still need separate integrations or implementation; the menu is not proof that all listed commands work.


## More integrated commands
- `.translate ht en Bonjou` — translates text through MyMemory (availability and language quality depend on that service).
- `.weather Port-au-Prince` — current weather via Open-Meteo geocoding and forecast APIs.
- `.github username` — public GitHub profile summary.
- `.npmstalk package-name` — package information from the npm registry.
- `.whois example.com` — domain registration data where available through RDAP.

These API-backed commands need internet access on the host. This does not mean every command displayed in the menu is implemented; downloaders, music, sticker conversion, image generation, moderation automations, and many owner tools still need their own implementation or provider APIs.
