# 🚀 Guía Paso a Paso: Desplegar en Vercel

## ✅ Paso 1: Verificar que tu código está en GitHub

1. **Abre tu navegador** y ve a tu repositorio:
   `https://github.com/TU-USUARIO/nutriplan-calendar`

2. **Verifica que veas estos archivos importantes:**
   - ✅ `vercel.json` (configuración para Vercel)
   - ✅ `package.json`
   - ✅ `vite.config.ts`
   - ✅ `.gitignore`

---

## 🌟 Paso 2: Crear cuenta en Vercel

1. **Ve a:** https://vercel.com
2. **Haz clic en "Sign Up"** (arriba a la derecha)
3. **Selecciona "Continue with GitHub"** (recomendado)
4. **Autoriza** a Vercel para acceder a tu cuenta de GitHub
5. **Completa** tu perfil si te lo pide

---

## 📦 Paso 3: Importar tu Proyecto

1. **En el dashboard de Vercel**, haz clic en **"Add New..."** → **"Project"**

2. **En la lista de repositorios**, busca y selecciona **`nutriplan-calendar`**

3. **Vercel detectará automáticamente:**
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

   ✅ **NO necesitas cambiar nada** - Vercel lo detecta automáticamente

---

## 🔐 Paso 4: Configurar Variable de Entorno (MUY IMPORTANTE)

**ANTES de hacer clic en "Deploy"**, debes configurar la variable de entorno:

1. **En la sección "Environment Variables"** (abajo en la página de configuración)

2. **Haz clic en "Add"** o en el campo para agregar variables

3. **Agrega la variable:**
   - **Key:** `GEMINI_API_KEY`
   - **Value:** (Pega aquí tu clave de API de Gemini)
   - **Environments:** Marca las tres opciones:
     - ✅ Production
     - ✅ Preview  
     - ✅ Development

4. **Haz clic en "Save"** o "Add"

5. **Verifica** que la variable aparezca en la lista

---

## 🚀 Paso 5: Desplegar

1. **Haz clic en el botón azul "Deploy"** (abajo a la derecha)

2. **Espera** mientras Vercel:
   - Instala las dependencias
   - Ejecuta el build
   - Despliega la aplicación
   
   ⏱️ Esto toma aproximadamente **1-2 minutos**

3. **Cuando termine**, verás un mensaje de éxito y una URL como:
   `https://nutriplan-calendar.vercel.app`

---

## ✅ Paso 6: Verificar que Funciona

1. **Haz clic en la URL** que te dio Vercel (o ve a tu dashboard → Projects → tu proyecto)

2. **Abre la aplicación** en tu navegador

3. **Prueba la aplicación:**
   - Verifica que cargue correctamente
   - Prueba generar un menú (si es posible)
   - Verifica que no haya errores en la consola del navegador

---

## 🔄 Paso 7: Deploy Automático (Ya está configurado)

**¡Buenas noticias!** Cada vez que hagas cambios y los subas a GitHub:

1. **Haz cambios** en tu código local
2. **Sube los cambios** a GitHub (push)
3. **Vercel detectará automáticamente** el cambio
4. **Creará un nuevo deploy** automáticamente
5. **Tu aplicación se actualizará** sin que hagas nada más

---

## 🎨 Paso 8: Personalizar el Dominio (Opcional)

Si quieres un dominio personalizado:

1. **Ve a tu proyecto** en Vercel
2. **Settings** → **Domains**
3. **Agrega tu dominio** personalizado
4. **Sigue las instrucciones** para configurar DNS

---

## 🆘 Solución de Problemas Comunes

### ❌ Error: "Build failed"
- **Causa:** Falta la variable de entorno `GEMINI_API_KEY`
- **Solución:** Ve a Settings → Environment Variables y agrega `GEMINI_API_KEY`

### ❌ Error: "Module not found"
- **Causa:** Dependencias faltantes
- **Solución:** Verifica que `package.json` tenga todas las dependencias necesarias

### ❌ La aplicación carga pero la API no funciona
- **Causa:** La clave de Gemini no es válida o no tiene créditos
- **Solución:** Verifica tu clave en https://aistudio.google.com/apikey

### ❌ Error 404 en rutas
- **Causa:** Falta el archivo `vercel.json`
- **Solución:** Verifica que `vercel.json` esté en la raíz del repositorio

---

## 📊 Monitoreo y Logs

Para ver los logs de tu aplicación:

1. **Ve a tu proyecto** en Vercel
2. **Haz clic en "Deployments"**
3. **Selecciona un deployment**
4. **Haz clic en "Build Logs"** o "Function Logs"

---

## 🎉 ¡Listo!

Tu aplicación ya está publicada y accesible para todo el mundo. 

**URL de tu aplicación:** `https://nutriplan-calendar.vercel.app` (o la que te haya dado Vercel)

---

## 📝 Resumen de URLs Importantes

- **Dashboard de Vercel:** https://vercel.com/dashboard
- **Tu aplicación:** (La URL que te dio Vercel)
- **Repositorio GitHub:** `https://github.com/TU-USUARIO/nutriplan-calendar`

---

¿Necesitas ayuda con algún paso específico? ¡Avísame!

