# TareaApp - Aplicación de Gestión de Tareas

Una aplicación móvil de gestión de tareas construida con React Native y Expo, que permite a los usuarios organizar, programar y recibir notificaciones de sus tareas diarias.

## 🚀 Pasos para Ejecutar la Aplicación

### Prerrequisitos
- **Node.js** (versión 16 o superior)
- **npx** (incluido con Node.js)
- **Expo Go** app en tu dispositivo móvil (para pruebas en dispositivo físico)
- **Android Studio** (para emulador Android) o **Xcode** (para simulador iOS) - opcional

### Instalación y Ejecución

1. **Clonar el repositorio**
   ```bash
   git clone /
   cd TareaApp
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # Si tienes problemas de conflictos entre paquetes 
   npm install --legacy-peer-deps
   ```

3. **Iniciar el servidor de desarrollo**
   ```bash
   npm start
   # o usando npx directamente
   npx expo start
   ```

5. **Ejecutar en dispositivo físico**
   - Escanea el código QR con la app **Expo Go**
   - La aplicación se cargará automáticamente

## 🛠️ Decisiones Técnicas y Tecnologías Utilizadas

### Framework Principal
- **React Native**: Framework para desarrollo móvil multiplataforma
  - *Razón*: Desarrollo simultáneo para iOS y Android con un solo código base
- **Expo**: Plataforma y conjunto de herramientas para React Native
  - *Razón*: Desarrollo rápido, fácil configuración, acceso a APIs nativas sin configuración compleja

### Lenguaje y Tipado
- **TypeScript**: Superset de JavaScript con tipado estático
  - *Razón*: Mejor mantenibilidad, detección temprana de errores, IntelliSense mejorado

### UI y Estilizado
- **Styled Components**: Librería para estilos en React Native
  - *Razón*: Estilos dinámicos, theming, mejor organización de componentes
- **Expo Vector Icons**: Iconografía
  - *Razón*: Amplia variedad de iconos, fácil integración con Expo

### Navegación
- **React Navigation**: Sistema de navegación para React Native
  - *Razón*: Navegación nativa, stack navigation, gestión de estado de navegación

### Gestión de Estado
- **React Context API**: Para estado global de la aplicación
  - *Razón*: Simplicidad, sin dependencias externas, perfecto para aplicaciones medianas

### Almacenamiento Local
- **AsyncStorage**: Almacenamiento persistente local
  - *Razón*: Persistencia de datos offline, API simple, compatible con React Native

### Notificaciones
- **Expo Notifications**: Sistema de notificaciones push y locales
  - *Razón*: Fácil configuración, soporte multiplataforma, integración nativa con Expo

### Gestos y Animaciones
- **React Native Gesture Handler**: Manejo avanzado de gestos
  - *Razón*: Gestos fluidos y nativos, swipe actions en tarjetas de tareas
- **React Native Reanimated**: Animaciones de alto rendimiento
  - *Razón*: Animaciones suaves, ejecutadas en el hilo UI nativo

### Testing
- **Jest**: Framework de testing
- **React Native Testing Library**: Testing de componentes
- **React Test Renderer**: Renderizado de componentes para testing

## 📝 Funcionalidades Principales

### ✅ Gestión de Tareas
- Crear, editar y eliminar tareas
- Programar tareas por días de la semana
- Configurar horarios de inicio y fin
- Marcar tareas como completadas o en progreso

### ✅ Notificaciones
- Notificaciones locales configurables
- Activar/desactivar notificaciones por tarea
- Recordatorios automáticos basados en horarios

### ✅ Interfaz de Usuario
- Diseño intuitivo y responsive
- Animaciones fluidas y gestos nativos
- Swipe actions en tarjetas de tareas
- Modo claro/oscuro (theming)

### ✅ Filtrado y Organización
- Filtrar tareas por estado (todas, completadas, en progreso)
- Filtrar tareas por día de la semana
- Vista detallada de tareas

### ✅ Autenticación
- Sistema de registro e inicio de sesión
- Persistencia de sesión de usuario
- Gestión de usuarios localmente

