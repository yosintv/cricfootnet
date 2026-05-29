# 🚀 Deploying CricFoot to Cloudflare Pages

This guide walks you through deploying your CricFoot TV Guide to **Cloudflare Pages** (100% FREE).

## ✅ What's Already Done

I've converted your Python FastAPI backend to **Cloudflare Pages Functions** (JavaScript):

```
/app/
├── functions/                    ← NEW: Cloudflare Pages Functions (JS)
│   ├── _shared/
│   │   └── utils.js              ← Shared utilities
│   └── api/
│       ├── index.js              → GET /api/
│       ├── channels.js           → GET /api/channels
│       ├── countries.js          → GET /api/countries
│       ├── leagues.js            → GET /api/leagues
│       ├── sitemap.xml.js        → GET /api/sitemap.xml
│       ├── schedule/[date].js    → GET /api/schedule/:date
│       ├── channel/[name].js     → GET /api/channel/:name
│       ├── channel/[name]/today.js → GET /api/channel/:name/today
│       ├── match/[match_id].js   → GET /api/match/:id
│       └── league/[slug].js      → GET /api/league/:slug
├── frontend/
│   ├── .env.production           ← NEW: Production env (empty BACKEND_URL)
│   ├── public/
│   │   ├── _redirects            ← NEW: SPA routing
│   │   └── _headers              ← NEW: CORS + security headers
│   └── ...
└── wrangler.toml                 ← NEW: Cloudflare config
```

## 📋 Deployment Steps

### Option A: Deploy via GitHub (Recommended)

#### 1. Push Your Code to GitHub
- In Emergent, click the **"Save to GitHub"** button (top right of chat)
- This creates/updates your GitHub repository

#### 2. Sign up for Cloudflare (if you haven't)
- Go to https://dash.cloudflare.com/sign-up
- Create a free account

#### 3. Connect Your GitHub Repo to Cloudflare Pages
1. Go to **Cloudflare Dashboard → Workers & Pages**
2. Click **"Create application"** → **"Pages"** tab
3. Click **"Connect to Git"**
4. Authorize Cloudflare to access your GitHub
5. Select your **cricfoot** repository

#### 4. Configure Build Settings
On the setup page, enter these EXACT values:

| Setting | Value |
|---------|-------|
| **Framework preset** | `Create React App` |
| **Build command** | `cd frontend && yarn install && yarn build` |
| **Build output directory** | `frontend/build` |
| **Root directory** | `/` (leave blank or set to root) |

#### 5. Add Environment Variable (Optional)
Add this environment variable if needed:
- `NODE_VERSION` = `20`

#### 6. Deploy!
- Click **"Save and Deploy"**
- Wait 2-3 minutes for build
- Your site will be live at: `https://cricfoot.pages.dev`

---

### Option B: Deploy via Wrangler CLI (Local)

#### 1. Install Wrangler
```bash
npm install -g wrangler
```

#### 2. Login to Cloudflare
```bash
wrangler login
```

#### 3. Build Your Frontend Locally
```bash
cd frontend
yarn install
yarn build
cd ..
```

#### 4. Deploy
```bash
wrangler pages deploy frontend/build --project-name=cricfoot
```

---

## 🎯 After Deployment

### Custom Domain (Free!)
1. Go to your Pages project → **Custom domains**
2. Add your domain (e.g., `cricfoot.com`)
3. Cloudflare auto-configures DNS

### Test Your APIs
After deployment, test these URLs:
- `https://YOUR-SITE.pages.dev/api/channels`
- `https://YOUR-SITE.pages.dev/api/leagues`
- `https://YOUR-SITE.pages.dev/api/schedule/7days`
- `https://YOUR-SITE.pages.dev/api/sitemap.xml`

### Submit Sitemap to Google
1. Go to https://search.google.com/search-console
2. Add your property: `https://YOUR-SITE.pages.dev`
3. Submit sitemap: `https://YOUR-SITE.pages.dev/api/sitemap.xml`

---

## 💰 Cost

- **Cloudflare Pages**: FREE (unlimited bandwidth, 500 builds/month)
- **Functions**: FREE (100,000 requests/day)
- **Custom Domain**: FREE (just bring your own domain)

## ⚡ Why Cloudflare Pages is Perfect for Your App

1. **Same platform as your data source** (`livesoccertv.pages.dev` is also on Cloudflare)
   → Internal network = super fast data fetching!
2. **Global edge network** - 200+ cities worldwide
3. **Auto-caching** - Functions use Cloudflare cache for 1-hour TTL
4. **DDoS protection** - Free, automatic
5. **HTTPS/SSL** - Free, automatic

## 🐛 Troubleshooting

### Build Fails?
- Check Node version: Should be 18+ (set `NODE_VERSION=20`)
- Make sure `frontend/yarn.lock` is committed

### API Routes Return 404?
- Check that `/functions/api/` folder is at the repo root
- Verify each file has `export async function onRequestGet`

### Frontend Loads But API Doesn't Work?
- Open browser DevTools → Network tab
- Check if `/api/channels` is being called correctly
- Verify `_redirects` file is in `frontend/public/`

### Channel Pages Show Blank?
- This means React Router is being intercepted by server
- The `_redirects` file should handle this automatically

---

## 📞 Need Help?

If deployment fails, check the build logs in Cloudflare Dashboard → Your Project → Deployments → Click the failed deployment

Common issues are usually fixed by:
1. Setting `NODE_VERSION=20` in environment variables
2. Making sure the build command is exactly: `cd frontend && yarn install && yarn build`
3. Checking that `_redirects` file exists in `frontend/public/`
