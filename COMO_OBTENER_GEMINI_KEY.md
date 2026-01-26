# 🔑 Cómo Obtener tu Clave de API de Gemini

## 📋 Paso a Paso para Obtener tu GEMINI_API_KEY

### Paso 1: Acceder a Google AI Studio

1. **Abre tu navegador** y ve a:
   **https://aistudio.google.com/apikey**

2. **Inicia sesión** con tu cuenta de Google
   - Si no tienes cuenta, créala en https://accounts.google.com/signup

---

### Paso 2: Crear una Nueva API Key

1. **En la página de Google AI Studio**, verás un botón que dice:
   - **"Get API key"** o **"Create API key"** o **"Obtener clave de API"**

2. **Haz clic en ese botón**

3. **Selecciona o crea un proyecto de Google Cloud:**
   - Si ya tienes proyectos, selecciona uno
   - Si no tienes proyectos, se creará uno automáticamente llamado "Quickstart" o similar
   - Haz clic en **"Create API key in new project"** o **"Create API key"**

---

### Paso 3: Copiar tu Clave

1. **Aparecerá un cuadro de diálogo** con tu clave de API
   - La clave se verá algo así: `AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567`

2. **⚠️ IMPORTANTE:** 
   - **Copia la clave inmediatamente** - es la única vez que la verás completa
   - Si la pierdes, tendrás que crear una nueva

3. **Haz clic en "Done"** o "Cerrar"

---

### Paso 4: Ver tus Claves Existentes (si ya tienes una)

Si ya creaste una clave antes:

1. **Ve a:** https://aistudio.google.com/apikey
2. **Verás una lista** de tus claves de API
3. **Haz clic en el icono de "ojo"** 👁️ para mostrar la clave
4. **Copia la clave**

---

## 🔒 Seguridad: Protege tu Clave

### ⚠️ NUNCA hagas esto:
- ❌ Subir la clave a GitHub (público)
- ❌ Compartirla en foros o chats públicos
- ❌ Incluirla en código que compartas
- ❌ Hardcodearla en archivos `.ts` o `.tsx`

### ✅ SÍ puedes hacer esto:
- ✅ Usarla en variables de entorno (`.env.local` localmente)
- ✅ Configurarla en plataformas de hosting (Vercel, Netlify, etc.)
- ✅ Guardarla en un gestor de contraseñas

---

## 📝 Cómo Usar tu Clave

### Para Desarrollo Local:

1. **Crea un archivo `.env.local`** en la raíz de tu proyecto:
   ```
   GEMINI_API_KEY=tu-clave-aqui
   ```

2. **Asegúrate** de que `.env.local` esté en tu `.gitignore` (ya lo está)

### Para Producción (Vercel/Netlify):

1. **Configura la variable de entorno** en la plataforma:
   - **Nombre:** `GEMINI_API_KEY`
   - **Valor:** (Pega tu clave aquí)

---

## 🆘 Problemas Comunes

### ❌ "API key not valid"
- **Causa:** La clave está mal copiada o tiene espacios
- **Solución:** Copia la clave de nuevo, asegúrate de no tener espacios al inicio o final

### ❌ "Quota exceeded" o "Billing required"
- **Causa:** Has excedido el límite gratuito o necesitas habilitar facturación
- **Solución:** 
  - Ve a https://console.cloud.google.com/
  - Habilita la facturación (tiene crédito gratuito)
  - O espera a que se reinicie el límite mensual

### ❌ "Permission denied"
- **Causa:** La API de Gemini no está habilitada en tu proyecto
- **Solución:**
  1. Ve a https://console.cloud.google.com/
  2. Selecciona tu proyecto
  3. Ve a "APIs & Services" → "Library"
  4. Busca "Generative Language API"
  5. Haz clic en "Enable"

---

## 💰 Límites y Costos

### Plan Gratuito:
- ✅ **60 solicitudes por minuto**
- ✅ **1,500 solicitudes por día**
- ✅ **Suficiente para desarrollo y uso personal**

### Si necesitas más:
- Puedes habilitar facturación en Google Cloud Console
- Los primeros $300 son créditos gratuitos
- Después, el precio es muy económico

---

## 🔄 Si Necesitas Crear una Nueva Clave

Si perdiste tu clave o necesitas crear una nueva:

1. **Ve a:** https://aistudio.google.com/apikey
2. **Haz clic en "Create API key"**
3. **Sigue los pasos** anteriores

**⚠️ Importante:** Si creas una nueva clave, actualiza la variable de entorno en Vercel/Netlify con la nueva clave.

---

## ✅ Verificación Rápida

Para verificar que tu clave funciona:

1. **Copia tu clave**
2. **Configúrala** en `.env.local` localmente
3. **Ejecuta:** `npm run dev`
4. **Prueba** generar un menú en tu aplicación
5. **Si funciona**, la clave es correcta ✅

---

## 📚 Recursos Adicionales

- **Documentación oficial:** https://ai.google.dev/docs
- **Precios:** https://ai.google.dev/pricing
- **Límites:** https://ai.google.dev/gemini-api/docs/quota

---

¿Necesitas ayuda con algún paso específico? ¡Avísame!

