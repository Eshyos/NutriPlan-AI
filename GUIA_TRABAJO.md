# 📚 Guía: Cerrar y Retomar el Trabajo en Cursor

## ✅ Cerrar Cursor Correctamente

### Opción 1: Cierre Normal (Recomendado)
1. **Guarda todos los archivos:**
   - `Ctrl + S` para guardar el archivo actual
   - O `Ctrl + K, S` para guardar todos los archivos abiertos
   - Verifica que no haya cambios sin guardar (aparecerá un punto en los tabs)

2. **Cierra Cursor normalmente:**
   - `Alt + F4` o haz clic en la X de la ventana
   - O `File → Exit`

3. **Cursor guardará automáticamente:**
   - Archivos abiertos
   - Posición del cursor
   - Configuración del workspace
   - Historial de cambios

---

## 🔄 Retomar el Trabajo Después

### Paso 1: Abrir el Proyecto

**Opción A: Desde Cursor**
1. Abre Cursor
2. `File → Open Folder` (o `Ctrl + K, Ctrl + O`)
3. Navega a: `C:\Users\ocorral\Downloads\nutriplan-calendar`
4. Selecciona la carpeta y haz clic en "Select Folder"

**Opción B: Desde el Explorador de Windows**
1. Navega a: `C:\Users\ocorral\Downloads\nutriplan-calendar`
2. Haz clic derecho en la carpeta
3. Selecciona "Open with Cursor" (si está disponible)
4. O arrastra la carpeta a Cursor

**Opción C: Desde la Terminal**
```powershell
cd C:\Users\ocorral\Downloads\nutriplan-calendar
cursor .
```

---

### Paso 2: Verificar el Estado del Proyecto

Abre una terminal en Cursor (`Ctrl + `` ` o `Terminal → New Terminal`) y ejecuta:

```powershell
# Verificar estado de Git
git status

# Verificar que estás en la rama correcta
git branch

# Ver los últimos commits
git log --oneline -5

# Verificar que el remote está configurado
git remote -v
```

**Estado esperado:**
- `git status` debería mostrar: "working tree clean" o los archivos modificados
- `git branch` debería mostrar: `* main`
- `git remote -v` debería mostrar: `origin https://github.com/Eshyos/NutriPlan-AI.git`

---

### Paso 3: Sincronizar con GitHub (si es necesario)

Si trabajaste desde otra computadora o hay cambios remotos:

```powershell
# Traer cambios del repositorio remoto
git pull origin main

# Si hay conflictos, resuélvelos y luego:
git add .
git commit -m "Merge: Integrar cambios remotos"
git push origin main
```

---

### Paso 4: Verificar Dependencias

Si es la primera vez que abres el proyecto después de un tiempo:

```powershell
# Verificar que node_modules existe
Test-Path "node_modules"

# Si no existe, instalar dependencias
npm install
```

---

## 🎯 Flujo de Trabajo Recomendado

### Al Iniciar una Sesión de Trabajo:

1. **Abrir el proyecto** en Cursor
2. **Abrir terminal** (`Ctrl + `` `)
3. **Verificar estado:**
   ```powershell
   git status
   git pull origin main  # Si hay cambios remotos
   ```
4. **Instalar dependencias** (si es necesario):
   ```powershell
   npm install
   ```
5. **Iniciar servidor de desarrollo** (si vas a trabajar):
   ```powershell
   npm run dev
   ```

### Al Terminar una Sesión de Trabajo:

1. **Guardar todos los archivos** (`Ctrl + K, S`)
2. **Hacer commit de cambios** (si los hay):
   ```powershell
   git status                    # Ver qué cambió
   git add .                     # Agregar cambios
   git commit -m "Descripción"   # Hacer commit
   git push origin main          # Subir a GitHub
   ```
3. **Cerrar Cursor** normalmente

---

## 📝 Comandos Útiles para el Día a Día

### Ver Estado del Proyecto
```powershell
# Estado de Git
git status

# Ver cambios no guardados
git diff

# Ver historial de commits
git log --oneline -10
```

### Trabajar con Git
```powershell
# Agregar todos los cambios
git add .

# Hacer commit
git commit -m "Descripción del cambio"

# Subir cambios a GitHub
git push origin main

# Traer cambios de GitHub
git pull origin main
```

### Desarrollo Local
```powershell
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Preview del build
npm run preview
```

---

## 🔒 Buenas Prácticas

### ✅ Hacer Regularmente:
- **Commits frecuentes:** Haz commit cada vez que completes una funcionalidad
- **Push regular:** Sube tus cambios a GitHub al menos una vez al día
- **Pull antes de trabajar:** Siempre trae los últimos cambios antes de empezar
- **Mensajes descriptivos:** Usa mensajes de commit claros:
  ```
  ✅ Bueno: "feat: Agregar función de exportar menú"
  ✅ Bueno: "fix: Corregir error al cargar platos"
  ❌ Malo: "cambios"
  ❌ Malo: "update"
  ```

### ⚠️ Evitar:
- **No hacer commit de archivos sensibles:** Nunca subas `.env` o `.env.local`
- **No hacer force push:** A menos que sea absolutamente necesario
- **No trabajar directamente en main:** Considera crear branches para features grandes

---

## 🆘 Solución de Problemas Comunes

### "Working tree has modifications"
**Solución:** Tienes cambios sin guardar. Guarda los archivos o haz commit.

### "Your branch is behind 'origin/main'"
**Solución:** Ejecuta `git pull origin main` para traer los cambios.

### "npm: command not found"
**Solución:** Node.js no está instalado o no está en el PATH. Verifica con `node --version`.

### "Cannot find module"
**Solución:** Ejecuta `npm install` para instalar las dependencias.

---

## 📂 Estructura del Proyecto (Recordatorio)

```
nutriplan-calendar/
├── components/          # Componentes React
├── services/           # Servicios (API, Google Sheets)
├── .github/            # Workflows de GitHub Actions
├── App.tsx            # Componente principal
├── vite.config.ts     # Configuración de Vite
├── tsconfig.json      # Configuración de TypeScript
├── package.json       # Dependencias del proyecto
└── .gitignore         # Archivos ignorados por Git
```

---

## 🎉 Resumen Rápido

### Al Abrir Cursor:
1. Abre la carpeta del proyecto
2. Abre terminal: `git status` y `git pull`
3. Si es necesario: `npm install`
4. Para desarrollar: `npm run dev`

### Al Cerrar Cursor:
1. Guarda todo: `Ctrl + K, S`
2. Commit y push si hay cambios
3. Cierra normalmente

---

¡Listo para trabajar! 🚀

