# 🚀 Guía de Despliegue - NutriPlan Calendar

Esta guía te ayudará a publicar tu aplicación en diferentes plataformas de hosting.

## ⚠️ Importante: Variables de Entorno

Tu aplicación requiere la variable de entorno `GEMINI_API_KEY` para funcionar. **NUNCA** subas esta clave a un repositorio público. Configúrala en la plataforma de hosting que elijas.

---

## 🌟 Opción 1: Vercel (RECOMENDADO)

**Ventajas:**
- ✅ Gratis para proyectos personales
- ✅ Deploy automático desde GitHub
- ✅ Configuración de variables de entorno muy fácil
- ✅ SSL automático
- ✅ CDN global (muy rápido)
- ✅ Dominio personalizado gratis

### Pasos:

1. **Sube tu código a GitHub** (si aún no lo has hecho):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/tu-usuario/nutriplan-calendar.git
   git push -u origin main
   ```

2. **Ve a [vercel.com](https://vercel.com)** y crea una cuenta (puedes usar GitHub)

3. **Importa tu proyecto:**
   - Click en "Add New Project"
   - Selecciona tu repositorio de GitHub
   - Vercel detectará automáticamente que es un proyecto Vite

4. **Configura la variable de entorno:**
   - En la sección "Environment Variables"
   - Agrega: `GEMINI_API_KEY` con tu clave de Gemini
   - Selecciona todos los ambientes (Production, Preview, Development)

5. **Deploy:**
   - Click en "Deploy"
   - En menos de 2 minutos tu app estará online
   - Obtendrás una URL como: `https://nutriplan-calendar.vercel.app`

**Archivo de configuración:** Ya está creado (`vercel.json`)

---

## 🌐 Opción 2: Netlify

**Ventajas:**
- ✅ Gratis para proyectos personales
- ✅ Deploy automático desde GitHub
- ✅ Muy fácil de usar
- ✅ SSL automático

### Pasos:

1. **Sube tu código a GitHub** (igual que en Vercel)

2. **Ve a [netlify.com](https://netlify.com)** y crea una cuenta

3. **Importa tu proyecto:**
   - Click en "Add new site" → "Import an existing project"
   - Conecta con GitHub y selecciona tu repositorio

4. **Configuración de build:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Netlify detectará automáticamente el archivo `netlify.toml`

5. **Configura la variable de entorno:**
   - Ve a "Site settings" → "Environment variables"
   - Agrega: `GEMINI_API_KEY` con tu clave

6. **Deploy:**
   - Click en "Deploy site"
   - Tu app estará en: `https://random-name.netlify.app`

**Archivo de configuración:** Ya está creado (`netlify.toml`)

---

## ☁️ Opción 3: Cloudflare Pages

**Ventajas:**
- ✅ Completamente gratis (sin límites)
- ✅ Muy rápido (CDN de Cloudflare)
- ✅ Deploy automático desde GitHub

### Pasos:

1. **Sube tu código a GitHub**

2. **Ve a [dash.cloudflare.com](https://dash.cloudflare.com)** → Pages

3. **Crea un nuevo proyecto:**
   - Conecta con GitHub
   - Selecciona tu repositorio

4. **Configuración:**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/` (dejar vacío)

5. **Variables de entorno:**
   - En "Settings" → "Environment variables"
   - Agrega: `GEMINI_API_KEY`

6. **Deploy:**
   - Cloudflare hará el deploy automáticamente
   - URL: `https://tu-proyecto.pages.dev`

---

## 📦 Opción 4: GitHub Pages (Gratis pero más limitado)

**Ventajas:**
- ✅ Completamente gratis
- ✅ Integrado con GitHub

**Desventajas:**
- ⚠️ No soporta variables de entorno directamente
- ⚠️ Necesitarás usar GitHub Secrets y Actions

### Pasos:

1. **Configura GitHub Secrets:**
   - Ve a tu repositorio → Settings → Secrets and variables → Actions
   - Agrega: `GEMINI_API_KEY` como secret

2. **El workflow ya está configurado** (`.github/workflows/deploy.yml`)

3. **Habilita GitHub Pages:**
   - Settings → Pages
   - Source: "GitHub Actions"

4. **Push a main:**
   ```bash
   git push origin main
   ```
   - El workflow se ejecutará automáticamente
   - Tu app estará en: `https://tu-usuario.github.io/nutriplan-calendar`

---

## 🔒 Seguridad: Variables de Entorno

**IMPORTANTE:** Nunca expongas tu `GEMINI_API_KEY` en el código. Las variables de entorno se inyectan en tiempo de build, pero:

1. ✅ **Correcto:** Configurar en la plataforma de hosting
2. ❌ **Incorrecto:** Hardcodear en el código
3. ❌ **Incorrecto:** Subir un archivo `.env` al repositorio

### Archivo `.gitignore`

Asegúrate de tener esto en tu `.gitignore`:
```
.env
.env.local
.env.*.local
node_modules
dist
```

---

## 📝 Resumen de Comandos Útiles

```bash
# Build local para probar
npm run build

# Preview del build local
npm run preview

# Verificar que el build funciona
npm run build && npm run preview
```

---

## 🎯 Recomendación Final

**Para empezar rápido:** Usa **Vercel** - es la opción más sencilla y tiene excelente documentación en español.

**Para máximo rendimiento:** Usa **Cloudflare Pages** - es gratis sin límites y extremadamente rápido.

**Para integración con GitHub:** Usa **GitHub Pages** con Actions (ya configurado).

---

## 🆘 ¿Problemas?

- **Error de build:** Verifica que `GEMINI_API_KEY` esté configurada en la plataforma
- **404 en rutas:** Verifica que el archivo de configuración (`vercel.json` o `netlify.toml`) esté presente
- **API no funciona:** Verifica que la clave de Gemini sea válida y tenga créditos

---

¡Buena suerte con tu despliegue! 🚀

