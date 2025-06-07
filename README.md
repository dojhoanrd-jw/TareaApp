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
   git clone <repository-url>
   cd TareaApp
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**
   ```bash
   npm start
   # o usando npx directamente
   npx expo start
   ```

4. **Ejecutar en dispositivo/emulador**
   
   **Para Android:**
   ```bash
   npm run android
   # o
   npx expo start --android
   ```
   
   **Para iOS:**
   ```bash
   npm run ios
   # o
   npx expo start --ios
   ```
   
   **Para Web:**
   ```bash
   npm run web
   # o
   npx expo start --web
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

## 📁 Estructura del Proyecto

```
TareaApp/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── TaskCard/
│   │   ├── TaskModal/
│   │   └── ...
│   ├── screens/            # Pantallas de la aplicación
│   │   ├── Home/
│   │   ├── LoginScreen/
│   │   ├── RegisterScreen/
│   │   └── WelcomeScreen/
│   ├── hooks/              # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useTaskForm.ts
│   │   └── ...
│   ├── services/           # Servicios y lógica de negocio
│   │   ├── NotificationService.ts
│   │   ├── TaskStorageService.ts
│   │   └── validation/
│   ├── context/            # Contextos de React
│   │   ├── AuthContext.tsx
│   │   └── TaskContext.tsx
│   ├── utils/              # Utilidades y helpers
│   │   └── ErrorHandler.ts
│   └── themes/             # Configuración de temas
├── assets/                 # Recursos estáticos
├── package.json
├── app.json               # Configuración de Expo
├── babel.config.js
├── tsconfig.json
└── README.md
```

## 🔧 Scripts Disponibles

- `npm start`: Iniciar servidor de desarrollo de Expo
- `npm run android`: Ejecutar en emulador/dispositivo Android
- `npm run ios`: Ejecutar en simulador/dispositivo iOS
- `npm run web`: Ejecutar versión web

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

## 🚀 Configuración Adicional

### Variables de Entorno
Si necesitas configurar variables de entorno, crea un archivo `.env` en la raíz del proyecto:

```env
# Ejemplo de variables
EXPO_PUBLIC_API_URL=https://tu-api.com
EXPO_PUBLIC_APP_NAME=TareaApp
```

### Notificaciones Push (Opcional)
Para notificaciones push en producción:
1. Configurar credenciales en Expo
2. Configurar Firebase (Android) y APNs (iOS)
3. Actualizar `app.json` con las configuraciones necesarias

## 📱 Compilación para Producción

### Build con EAS (Expo Application Services)
```bash
# Usar EAS CLI con npx
npx eas-cli@latest build:configure

# Build para Android
npx eas-cli@latest build --platform android

# Build para iOS
npx eas-cli@latest build --platform ios
```

## 🧪 Testing

**Nota**: Los scripts de testing necesitan ser configurados en package.json

```bash
# Una vez configurado, ejecutar pruebas con:
npm test

# Para desarrollo, usar npx directamente:
npx jest

# Con coverage:
npx jest --coverage
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 🐛 Solución de Problemas Comunes

### Error: "Unable to resolve module"
```bash
# Limpiar caché usando npx
npx expo start --clear

# Reinstalar node_modules
rm -rf node_modules
npm install
```

### Problemas con Expo CLI
```bash
# Usar la versión más reciente con npx
npx @expo/cli@latest start

# Verificar versión
npx expo --version
```

### Error en iOS Simulator
```bash
# Si usas desarrollo local (no aplica con Expo Go)
cd ios && pod install && cd ..
```

### Error de permisos de notificaciones
- Verificar permisos en configuraciones del dispositivo
- Asegurar que las notificaciones estén habilitadas para la app

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🔗 Enlaces Útiles

- [Documentación de Expo](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Styled Components](https://styled-components.com/)
- [React Navigation](https://reactnavigation.org/)