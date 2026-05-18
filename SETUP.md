# Adopt a Reef — Run with XAMPP (PHP + MySQL)

This project uses a **React frontend** and a **PHP + MySQL backend**. XAMPP provides Apache, PHP, and MySQL (MariaDB).

---

## What you need installed

1. **XAMPP** — [https://www.apachefriends.org/](https://www.apachefriends.org/)
2. **Node.js** (v18+) — only for building the frontend: [https://nodejs.org/](https://nodejs.org/)

---

## Step 1 — Start XAMPP

1. Open the **XAMPP Control Panel**.
2. Click **Start** next to **Apache**.
3. Click **Start** next to **MySQL**.

Both should show a green “Running” status.

---

## Step 2 — Create the database

1. In your browser, open **phpMyAdmin**:  
   `http://localhost/phpmyadmin`
2. Click the **Import** tab.
3. Choose the file:  
   `database/schema.sql`  
   (inside this project folder)
4. Click **Go** at the bottom.

You should see a database named **`adopt_a_reef`** with tables and sample corals / volunteer events.

**Default MySQL login (XAMPP):**

| Setting  | Value   |
|----------|---------|
| Host     | `127.0.0.1` |
| User     | `root`  |
| Password | *(empty)* |
| Database | `adopt_a_reef` |

If your MySQL password is not empty, edit `api/config.php` and set the `pass` value under `db`.

---

## Step 3 — Build the website files

Open a terminal in this project folder and run:

```bash
npm install
npm run build:xampp
```

This creates a **`dist`** folder with everything Apache needs (HTML, JS, CSS, PHP API).

---

## Copy vs move? Whole project vs `dist`?

| Question | Answer |
|----------|--------|
| Copy the whole **Adopt a Reef - Final** folder? | **No.** Only the built **`dist`** folder goes into `htdocs`. |
| Copy or move? | **Copy** (recommended). Keep the original project where it is so you can run `npm run build:xampp` again after changes. |
| What is in `dist`? | The website (`index.html`, JS, CSS, images) **and** the `api/` PHP backend — everything Apache needs. |
| What stays out of `htdocs`? | `src/`, `node_modules/`, `package.json`, etc. Those are for development/build only. |

After copying, your URL is `http://localhost/adopt-a-reef/` — the folder name under `htdocs` must match `base_path` in `api/config.php` (default `/adopt-a-reef`).

---

## Step 4 — Copy files into XAMPP

### Windows

Copy the **contents** of **`dist`** (or the whole `dist` folder renamed to `adopt-a-reef`) to:

```
C:\xampp\htdocs\adopt-a-reef
```

So you have paths like:

```
C:\xampp\htdocs\adopt-a-reef\index.html
C:\xampp\htdocs\adopt-a-reef\api\index.php
C:\xampp\htdocs\adopt-a-reef\figmaAssets\...
```

### Mac

Your XAMPP **DocumentRoot** is (check `httpd.conf` for `DocumentRoot`):

```
/Applications/XAMPP/xamppfiles/htdocs
```

Copy the **contents** of **`dist`** into a new folder named **`adopt-a-reef`**:

```
/Applications/XAMPP/xamppfiles/htdocs/adopt-a-reef/
```

> **Do not** copy the whole project folder or a nested `dist` inside another folder.  
> Wrong: `htdocs/Adopt a Reef - Final/dist/index.html`  
> Right: `htdocs/adopt-a-reef/index.html`

Then open: **`http://localhost/adopt-a-reef/`**

### If you use a different folder name

1. Rename `htdocs/adopt-a-reef` to your folder name (e.g. `htdocs/my-reef`).
2. Edit **`api/config.php`** in that folder — set `base_path` to match (e.g. `'/my-reef'`).
3. Rebuild with the same base:  
   `VITE_APP_BASE=/my-reef/ npm run build:xampp`

---

## Step 5 — Enable Apache rewrite (required)

The site needs **mod_rewrite** for clean URLs and `/api` routes.

1. Open `httpd.conf` in the XAMPP Apache folder.
2. Find and **uncomment** (remove `#`):

   ```
   LoadModule rewrite_module modules/mod_rewrite.so
   ```

3. Find the `<Directory "…/htdocs">` block and set:

   ```
   AllowOverride All
   ```

4. **Restart Apache** in the XAMPP Control Panel.

---

## Step 6 — Open the website

In your browser go to:

```
http://localhost/adopt-a-reef/
```

### First account = admin

The **first user who signs up** becomes the administrator and can open **Admin** to manage corals and volunteer events.

---

## Optional — Develop on your computer (live reload)

You can either use **XAMPP only** (copy `dist` to `htdocs` and edit/rebuild when needed) or run **two terminals** for live reload.

### If `npm run dev:api` says `php: command not found`

XAMPP includes PHP, but it is often **not** on your terminal PATH. Use one of these:

**Mac (XAMPP):**

```bash
/Applications/XAMPP/xamppfiles/bin/php -S 127.0.0.1:8080 -t api
```

**Windows (Command Prompt, from the project folder):**

```bat
C:\xampp\php\php.exe -S 127.0.0.1:8080 -t api
```

Or run `npm run dev:api` again — the project script tries to find XAMPP’s PHP automatically.

### Two-terminal dev setup

**Terminal 1 — PHP API** (command above or `npm run dev:api`)

**Terminal 2 — React dev server**

```bash
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173/adopt-a-reef/`). API calls are proxied to PHP on port 8080.

**Easier alternative:** skip both dev commands, use **Apache + MySQL from XAMPP** and open `http://localhost/adopt-a-reef/` after you copy `dist` to `htdocs`.

---

## Folder overview

| Folder / file      | Purpose                          |
|--------------------|----------------------------------|
| `src/`             | React frontend source code       |
| `api/`             | PHP REST API                     |
| `database/schema.sql` | MySQL tables + sample data   |
| `public/`          | Images, videos, static files     |
| `dist/`            | Built site (after `build:xampp`) |

---

## Troubleshooting

### “Database error” in the browser

- MySQL is running in XAMPP.
- You imported `database/schema.sql`.
- `api/config.php` has the correct username/password.

### Blank page or 404 on refresh

- `mod_rewrite` is enabled.
- `AllowOverride All` is set for `htdocs`.
- `.htaccess` exists in `htdocs/adopt-a-reef/`.

### Login does not stick

- `base_path` in `api/config.php` must match your URL folder (e.g. `/adopt-a-reef`).
- Use the same host always (`localhost`, not mixing `127.0.0.1`).

### API returns 404

- URL should be `http://localhost/adopt-a-reef/api/...` (Apache routes `/api` to PHP).
- Check that the `api` folder was copied into `htdocs/adopt-a-reef/api/`.

### Sign up / login returns 500 (Internal Server Error)

1. Import `database/schema.sql` in phpMyAdmin (database `adopt_a_reef` must exist).
2. Run `npm run deploy:xampp` again so the latest `api/` PHP files are copied to htdocs.
3. Confirm MySQL is running in XAMPP.
4. Check `api/config.php` — default user `root` with empty password matches your XAMPP setup.

---

## Production tips

- Change MySQL `root` to a password and update `api/config.php`.
- Do not expose phpMyAdmin on a public server.
- Use HTTPS in production and set secure session cookies in PHP if needed.
