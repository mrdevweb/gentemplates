# Genesys Email Template Editor ✉️⚡

Aplicación web autónoma, **100% portable** y sin dependencias externas, diseñada para la creación, personalización automática y estandarización del cuerpo de correos electrónicos en formato **Arial 10pt**, optimizada para integrarse mediante portapapeles con **Genesys Cloud**.

---

## 🚀 Características Principales

### 1. Formato Estricto Arial 10pt
- Todo el cuerpo del correo se genera y copia con estilos en línea `font-family: Arial, sans-serif; font-size: 10pt; line-height: 1.45;`.
- Al hacer clic en **"COPIAR CUERPO PARA GENESYS CLOUD"** y presionar <kbd>Ctrl</kbd> + <kbd>V</kbd> en el editor de Genesys Cloud, el formato se conserva exactamente en Arial 10pt.

### 2. Motor de Gramática Dinámica y Género
- **Trato / Género**: Botones de un solo clic o navegación con <kbd>Tab</kbd> para adaptar el saludo y desinencias:
  - 👨 **Hombre**: `Estimado`, `informado`, `bienvenido`
  - 👩 **Mujer**: `Estimada`, `informada`, `bienvenida`
  - 🏢 **Empresa**: `Estimados`, `informados`, `bienvenidos`
- **Desinencia Universal `(a)`**: Cualquier palabra escrita con `(a)` (ej. `registrado(a)`, `bienvenido(a)`) cambia dinámicamente según el género.
- **Variables Duales `{{Singular_Plural}}`**: Evalúa automáticamente valores en singular o plural (ej: `{{el_los}}`, `{{documento_documentos}}`, `{{estado de cuenta_estados de cuenta}}`).

### 3. Modo Soporte / Admin
- Pestaña dedicada para crear, editar y formatear plantillas.
- Configuración de **Avisos Especiales**:
  - 🖼️ **Infografías requeridas a adjuntar**.
  - 📧 **Buzones CC externos a copiar**.
  - ⚠️ **Notas de instrucción para el agente**.

### 4. Portabilidad Absoluta
- Funciona abriendo `index.html` en cualquier navegador web sin necesidad de Node.js, Python ni instalación de servidores.

---

## 📁 Estructura del Proyecto

```text
GeneradorPlantillas/
├── index.html       # Estructura principal con Modo Agente y Modo Soporte
├── styles.css       # Estilos UI Glassmorphism y formateo Arial 10pt
├── app.js           # Motor de variables, gramática y copiado dual HTML/Texto
└── README.md        # Documentación del proyecto
```

---

## ⚙️ Uso Rápido

1. Abre `index.html` en cualquier navegador.
2. Selecciona una plantilla del panel izquierdo.
3. Elige el trato de género y singular/plural.
4. Presiona **"COPIAR CUERPO PARA GENESYS CLOUD"** (o <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>C</kbd>).
5. Ve a **Genesys Cloud** y presiona <kbd>Ctrl</kbd> + <kbd>V</kbd>.
