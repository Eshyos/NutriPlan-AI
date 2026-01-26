# 📚 Guía Paso a Paso: Subir Código a GitHub

## 🎯 Método 1: Usando la Interfaz Web de GitHub (MÁS FÁCIL)

### Paso 1: Crear el Repositorio en GitHub

1. **Abre tu navegador** y ve a: https://github.com
2. **Inicia sesión** con tu cuenta (o créala si no tienes una)
3. **Haz clic en el botón verde "New"** (o el icono "+" en la esquina superior derecha → "New repository")
4. **Completa el formulario:**
   - **Repository name:** `nutriplan-calendar`
   - **Description:** (opcional) "Planificador de menús nutricionales con IA"
   - **Visibilidad:** Elige "Public" o "Private" según prefieras
   - ⚠️ **NO marques** "Add a README file" (ya tienes archivos)
   - ⚠️ **NO marques** "Add .gitignore" (ya lo tienes)
   - ⚠️ **NO marques** "Choose a license"
5. **Haz clic en "Create repository"**

### Paso 2: Subir los Archivos

GitHub te mostrará una página con instrucciones. **IGNORA esas instrucciones** y sigue estos pasos:

1. **En la página de tu nuevo repositorio**, busca el botón **"uploading an existing file"** o ve directamente a:
   `https://github.com/TU-USUARIO/nutriplan-calendar/upload`

2. **Arrastra y suelta TODOS los archivos** de tu carpeta `nutriplan-calendar`:
   - `App.tsx`
   - `index.tsx`
   - `index.html`
   - `package.json`
   - `tsconfig.json`
   - `vite.config.ts`
   - `constants.ts`
   - `types.ts`
   - `metadata.json`
   - `README.md`
   - `DEPLOY.md`
   - `vercel.json`
   - `netlify.toml`
   - `.gitignore`
   - Carpeta `components/` (con `MealCard.tsx`)
   - Carpeta `services/` (con `geminiService.ts` y `sheetService.ts`)
   - Carpeta `.github/workflows/` (con `deploy.yml`)

3. **En la parte inferior**, escribe un mensaje de commit:
   - **Commit message:** `Initial commit - NutriPlan Calendar app`

4. **Haz clic en "Commit changes"** (botón verde)

5. **¡Listo!** Tu código ya está en GitHub 🎉

---

## 🎯 Método 2: Usando GitHub Desktop (RECOMENDADO para el futuro)

### Paso 1: Instalar GitHub Desktop

1. **Descarga GitHub Desktop:**
   - Ve a: https://desktop.github.com/
   - Haz clic en "Download for Windows"
   - Ejecuta el instalador y sigue las instrucciones

2. **Configura tu cuenta:**
   - Abre GitHub Desktop
   - Inicia sesión con tu cuenta de GitHub
   - Configura tu nombre y email si te lo pide

### Paso 2: Publicar el Repositorio

1. **En GitHub Desktop:**
   - Ve a: **File → Add Local Repository**
   - Haz clic en **"Choose..."** y selecciona la carpeta: `C:\Users\ocorral\Downloads\nutriplan-calendar`
   - Haz clic en **"Add repository"**

2. **Si Git no está inicializado:**
   - GitHub Desktop te preguntará si quieres crear un repositorio
   - Haz clic en **"create a repository"**
   - Deja las opciones por defecto
   - Haz clic en **"Create Repository"**

3. **Preparar el commit:**
   - En la parte inferior izquierda, verás todos tus archivos
   - En el campo "Summary" escribe: `Initial commit - NutriPlan Calendar app`
   - Haz clic en **"Commit to main"**

4. **Publicar en GitHub:**
   - Haz clic en el botón **"Publish repository"** (arriba a la derecha)
   - **Nombre del repositorio:** `nutriplan-calendar`
   - **Descripción:** (opcional) "Planificador de menús nutricionales con IA"
   - **Visibilidad:** Elige "Public" o "Private"
   - **NO marques** "Keep this code private" si elegiste Public
   - Haz clic en **"Publish Repository"**

5. **¡Listo!** Tu código está en GitHub 🎉

---

## 🎯 Método 3: Usando Git desde la Terminal (Para usuarios avanzados)

### Paso 1: Instalar Git

1. **Descarga Git:**
   - Ve a: https://git-scm.com/download/win
   - Descarga el instalador
   - Ejecútalo y sigue las instrucciones (deja las opciones por defecto)

2. **Verifica la instalación:**
   - Abre PowerShell o CMD
   - Ejecuta: `git --version`
   - Deberías ver algo como: `git version 2.x.x`

### Paso 2: Configurar Git (solo la primera vez)

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu-email@ejemplo.com"
```

### Paso 3: Inicializar y Subir el Repositorio

1. **Abre PowerShell** en la carpeta del proyecto:
   ```bash
   cd C:\Users\ocorral\Downloads\nutriplan-calendar
   ```

2. **Inicializa Git:**
   ```bash
   git init
   ```

3. **Agrega todos los archivos:**
   ```bash
   git add .
   ```

4. **Crea el primer commit:**
   ```bash
   git commit -m "Initial commit - NutriPlan Calendar app"
   ```

5. **Crea el repositorio en GitHub:**
   - Ve a https://github.com/new
   - Crea un repositorio llamado `nutriplan-calendar`
   - **NO inicialices** con README, .gitignore o license

6. **Conecta tu repositorio local con GitHub:**
   ```bash
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/nutriplan-calendar.git
   ```
   (Reemplaza `TU-USUARIO` con tu nombre de usuario de GitHub)

7. **Sube el código:**
   ```bash
   git push -u origin main
   ```

8. **Si te pide credenciales:**
   - Usuario: Tu nombre de usuario de GitHub
   - Contraseña: Usa un **Personal Access Token** (no tu contraseña normal)
   - Para crear un token: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token

---

## ✅ Verificación

Después de subir el código, verifica que todo esté correcto:

1. **Ve a tu repositorio en GitHub:**
   `https://github.com/TU-USUARIO/nutriplan-calendar`

2. **Verifica que veas:**
   - ✅ Todos los archivos de código
   - ✅ La carpeta `components/`
   - ✅ La carpeta `services/`
   - ✅ Los archivos de configuración (`vercel.json`, `netlify.toml`)
   - ✅ El archivo `.gitignore`
   - ✅ El archivo `DEPLOY.md`

3. **IMPORTANTE:** Verifica que **NO** veas:
   - ❌ Archivo `.env` o `.env.local`
   - ❌ Carpeta `node_modules/`
   - ❌ Carpeta `dist/`

---

## 🚀 Siguiente Paso: Desplegar la Aplicación

Una vez que tu código esté en GitHub, puedes seguir las instrucciones en `DEPLOY.md` para desplegar en Vercel, Netlify u otra plataforma.

---

## 🆘 ¿Necesitas Ayuda?

Si tienes algún problema durante el proceso, avísame y te ayudo a resolverlo paso a paso.

