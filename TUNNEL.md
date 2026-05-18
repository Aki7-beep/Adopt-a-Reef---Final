# Share your site with ngrok (Option 1)

Others open a **public link** on their phone or laptop. All sign-ups, adoptions, and donations go into **your** MySQL database on your Mac (same XAMPP setup).

---

## Before you start

1. **XAMPP**: Apache and MySQL are **Running** (green).
2. **Database**: You imported `database/schema.sql` (database `adopt_a_reef`).
3. **Site works locally**: Open `http://localhost/adopt-a-reef/` and confirm the home page loads.
4. If you changed code recently, deploy again:

   ```bash
   npm run deploy:xampp
   ```

---

## Step 1 — Install ngrok

### Mac (Homebrew)

```bash
brew install ngrok/ngrok/ngrok
```

### Mac / Windows (no Homebrew)

1. Go to [https://ngrok.com/download](https://ngrok.com/download)
2. Download and install for your OS.

---

## Step 2 — Create a free ngrok account

1. Sign up at [https://dashboard.ngrok.com/signup](https://dashboard.ngrok.com/signup)
2. Open [Your Authtoken](https://dashboard.ngrok.com/get-started/your-authtoken)
3. Run once (paste your token):

   ```bash
   ngrok config add-authtoken YOUR_TOKEN_HERE
   ```

---

## Step 3 — Start the tunnel

Leave **XAMPP Apache running**, then in Terminal:

```bash
ngrok http 80
```

You will see something like:

```
Forwarding   https://a1b2c3d4.ngrok-free.app -> http://localhost:80
```

**Do not close this terminal** while others are using the site.

---

## Step 4 — Link to share

Your app lives in a subfolder. Share the **full** URL:

```
https://YOUR-NGROK-ID.ngrok-free.app/adopt-a-reef/
```

Example:

```
https://a1b2c3d4.ngrok-free.app/adopt-a-reef/
```

Important:

- Include **`/adopt-a-reef/`** at the end.
- Use **`https://`** (ngrok gives you HTTPS).

### Free ngrok “Visit Site” page

On the free plan, visitors may see a short ngrok warning first. They click **Visit Site** to continue. That is normal.

---

## Step 5 — What others can do

- Browse the site, sign up, log in, adopt corals, donate, volunteer sign-ups.
- All data is stored in **your** `adopt_a_reef` database on your Mac.
- The **first account** created is still the admin.

---

## Quick checklist

| Step | Done? |
|------|--------|
| Apache + MySQL running in XAMPP | ☐ |
| `http://localhost/adopt-a-reef/` works | ☐ |
| `ngrok http 80` running | ☐ |
| Shared link ends with `/adopt-a-reef/` | ☐ |
| Mac stays on and awake | ☐ |

---

## Troubleshooting

### “Site can’t be reached” for others

- Your Mac must stay on; ngrok and XAMPP must keep running.
- Run `ngrok http 80` again (free URLs change each time unless you pay for a fixed domain).
- Send the **new** URL from the ngrok terminal.

### Home page works but sign-up fails

- MySQL must be running in XAMPP.
- Run `npm run deploy:xampp` so the latest `api/` files are in htdocs.

### Images or videos missing

- Run `npm run deploy:xampp` again, then hard refresh (Cmd+Shift+R).

### ngrok: command not found

- Install ngrok (Step 1) or use the full path to the ngrok app.

### Port 80 already in use

If ngrok fails on port 80, find Apache’s port in XAMPP (usually 80). If it were 8080:

```bash
ngrok http 8080
```

---

## Security (short)

- Only share the link with people you trust while testing.
- Do not expose `http://localhost/phpmyadmin` publicly.
- Stop ngrok (Ctrl+C) when you are done.
- For a permanent public site, use real hosting (see `SETUP.md`).

---

## Stop sharing

1. Press **Ctrl+C** in the terminal where `ngrok` is running.
2. The public link stops working immediately.
