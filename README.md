
# 🥗 NutriPlan AI - Calendario de Comidas Inteligente

NutriPlan AI es una aplicación avanzada de planificación de comidas que utiliza la **Inteligencia Artificial (Google Gemini 3)** para generar menús semanales equilibrados basados en tu propia base de datos personal almacenada en **Google Sheets**.

![NutriPlan AI](https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=1000)

## ✨ Características Principales

-   🤖 **Generación con IA**: Crea menús de hasta 31 días considerando el equilibrio nutricional y la variedad.
-   📊 **Sincronización con Google Sheets**: Lee tus platos directamente desde pestañas de Excel/Sheets.
-   📅 **Restricciones de Calendario**: Soporta platos exclusivos para Sábados o Domingos.
-   🔄 **Historial Inteligente**: La IA recuerda qué comiste recientemente para no repetir platos.
-   ✏️ **Edición Remota**: Actualiza nombres, categorías y restricciones de fin de semana desde la propia app.

## 🛠️ Configuración Técnica

### 1. Google Sheets
Debes tener una hoja de cálculo con al menos tres pestañas. Para conectar la app, ve a los ajustes (icono ⚙️) e introduce:

1.  **Spreadsheet ID**: Es el código largo que aparece en la URL de tu navegador al abrir el Excel.
    `https://docs.google.com/spreadsheets/d/AQUÍ_ESTA_EL_ID/edit`
2.  **GID de las pestañas**: Es el número que aparece al final de la URL tras `gid=` al pulsar en cada pestaña.

### 2. Google Apps Script
Para permitir que la app guarde datos, publica un Web App en Google Apps Script con el código detallado en el historial de cambios de este proyecto.

## 🚀 Instalación y Uso

1.  Clona este repositorio.
2.  Súbelo a **GitHub Pages** (asegúrate de activar "GitHub Actions" en Settings > Pages).
3.  Configura tus IDs en la app y ¡listo!

---
Desarrollado con ❤️ para una alimentación más organizada y saludable.
