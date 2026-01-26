# 🚀 Guía: Instalar Git en Windows

## 📥 Paso 1: Descargar Git

1. **Abre tu navegador** y ve a: https://git-scm.com/download/win
2. **Descarga el instalador** (se descargará automáticamente la versión más reciente)
3. **Espera** a que termine la descarga

---

## 🔧 Paso 2: Instalar Git

1. **Ejecuta el instalador** que descargaste (Git-x.x.x-64-bit.exe)

2. **Sigue las instrucciones del instalador:**
   - **License Information:** Haz clic en "Next"
   - **Select Components:** Deja las opciones por defecto marcadas, haz clic en "Next"
   - **Choosing the default editor:** Puedes dejar "Nano editor" o elegir otro, haz clic en "Next"
   - **Adjusting your PATH environment:** 
     - ✅ **Selecciona:** "Git from the command line and also from 3rd-party software" (recomendado)
     - Haz clic en "Next"
   - **Choosing HTTPS transport backend:** Deja "Use the OpenSSL library", haz clic en "Next"
   - **Configuring the line ending conversions:**
     - ✅ **Selecciona:** "Checkout Windows-style, commit Unix-style line endings" (recomendado)
     - Haz clic en "Next"
   - **Configuring the terminal emulator:** Deja "Use MinTTY", haz clic en "Next"
   - **Configuring extra options:** Deja las opciones por defecto, haz clic en "Next"
   - **Configuring experimental options:** No marques nada, haz clic en "Install"

3. **Espera** a que termine la instalación (1-2 minutos)

4. **Haz clic en "Finish"**

---

## ✅ Paso 3: Verificar la Instalación

1. **Cierra y vuelve a abrir PowerShell** (o abre una nueva ventana)

2. **Ejecuta este comando:**
   ```powershell
   git --version
   ```

3. **Deberías ver algo como:**
   ```
   git version 2.xx.x
   ```

Si ves la versión, ¡Git está instalado correctamente! ✅

---

## ⚙️ Paso 4: Configurar Git (Solo la primera vez)

Ejecuta estos comandos en PowerShell (reemplaza con tu información):

```powershell
git config --global user.name "Tu Nombre"
git config --global user.email "tu-email@ejemplo.com"
```

**Ejemplo:**
```powershell
git config --global user.name "Eshyos"
git config --global user.email "tu-email@gmail.com"
```

---

## 🎉 ¡Listo!

Ahora puedes usar Git para hacer commits y push a GitHub.

---

## 📚 Comandos Útiles que Usarás

```powershell
# Ver el estado de los archivos
git status

# Agregar archivos al staging
git add .

# Hacer commit
git commit -m "Mensaje descriptivo"

# Subir cambios a GitHub
git push origin main
```

---

¿Necesitas ayuda con algún paso? ¡Avísame!

