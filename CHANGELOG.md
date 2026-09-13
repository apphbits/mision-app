# 📋 Resumen de Cambios — Registro de Desarrollo (Hoy)

## [v1.1.0] - 2026-09-12

### 1. Autenticación & Seguridad OAuth (Google Cloud Console + Supabase)
- **Google Cloud Console**: Configurado el cliente OAuth 2.0 para la cuenta `apphbits@gmail.com` (Client ID: `986758620237-0upmaf8norl18qd2cu5f0kqktfa8mb6v.apps.googleusercontent.com`).
- **Supabase Auth**: Activado el proveedor Google OAuth en el proyecto Supabase `bxgdaqcnphulhfchfqnf` con URI de redirección autorizada `https://bxgdaqcnphulhfchfqnf.supabase.co/auth/v1/callback`.
- **Validación Estricta**: Eliminado el bypass simulado por timeout. El login con Google ahora requiere autenticación real validada por sesión y rechaza accesos fallidos o cancelados.

### 2. Interfaz y Experiencia de Usuario (UI/UX)
- **Modo Oscuro / Claro (Dark Sanctuary & Light Sanctuary)**:
  - Implementado selector de tema en la cabecera (`#btn-toggle-theme`) con persistencia en `localStorage`.
  - Definida paleta cromática refinada en modo oscuro: fondo `#0C120F`, tarjetas `#131D17`, acentos verdes `#22C55E` y textos legibles `#F1F5F9`.
- **Visualización Completa de Misión Diaria**:
  - Eliminado el truncamiento de texto (`truncate`) en el dashboard "Hoy".
  - Se muestra la descripción detallada paso a paso de la micromisión diaria, junto con el badge de tiempo (`⏱️ min`) e icono de categoría.
- **Optimización de Pantallas y Espaciado**:
  - Ajustado el padding inferior y la altura de contenedores para eliminar espacios en blanco innecesarios y reducir el scroll excesivo.

### 3. Pipeline de Compilación y APK Móvil
- **GitHub Actions CI**: Configurado y corregido el workflow `.github/workflows/build-apk.yml` para compilar la aplicación Android con Capacitor y Gradle JDK 17.
- **Repositorio Oficial**: Sincronización y push exclusivos al repositorio `https://github.com/apphbits/mision-app`.
- **APK Generada**: Compilada y descargada automáticamente en la carpeta `APK/mision.apk` (3.8 MB).

## [v1.0.0-MVP] - 2026-09-12

### 1. Fase de Especificación SDD (Spec-Driven Development)
- Creado `docs/product-spec.md` con la visión, catálogo estructurado de 8 categorías y alcance del MVP.
- Creado `docs/architecture.md` definiendo Clean Architecture con separación estricta de capas.
- Creado `docs/database.md` con el diccionario de datos, relaciones de entidades y políticas de seguridad RLS.
- Creado `docs/gamification.md` con las fórmulas matemáticas de Impulso (⚡), Chispas (✨), niveles derivados y logros.

### 2. Base de Datos Supabase / PostgreSQL
- Creado `database/schema.sql` con 13 tablas relacionales, constraints, timestamps, índices y Row Level Security (RLS) en todas las tablas.
- Creado `database/seed.sql` con el catálogo inicial de misiones por categorías (Mente, Cuerpo, Relaciones, Crecimiento, Finanzas, Creatividad, Experiencias, Bienestar), logros deterministas y recompensas de Chispas.

### 3. Arquitectura Móvil Flutter
- Configurado `app/pubspec.yaml` con dependencias modernas (Supabase, Google Fonts, Provider).
- Creado `app/lib/core/theme/mindful_sanctuary_theme.dart` con la paleta cromática oficial de Mindful Sanctuary.
- Creadas las entidades de dominio `Goal`, `Mission`, `Profile` y `Achievement`.
- Creado `ProgressionService` para cálculo de rangos en Dart.
- Creado punto de entrada `app/lib/main.dart`.

### 4. Aplicación Web Interactiva & Diseño Mindful Sanctuary
- Creado `mision-web/index.html` con las 4 pantallas activas (Hoy, Metas, Progreso, Perfil) y modales de creación.
- Creado `mision-web/css/styles.css` con variables CSS de Mindful Sanctuary, animaciones de micro-interacción y soporte responsive.
- Creado `mision-web/js/state.js` con almacenamiento persistente en LocalStorage y reactividad.
- Creado `mision-web/js/gamification.js` con el motor determinista de niveles, experiencia y desbloqueo de medallas.
- Creado `mision-web/js/audio.js` con síntesis sonora orgánica mediante Web Audio API.
- Creado `mision-web/js/app.js` con el sistema de confeti, cálculo en tiempo real, gestión de pestañas y modales.

### 5. Integración del Simulador de Celular
- Integrado marco de hardware realista de smartphone con Dynamic Island, bisel de titanio y barra de estado nativa.
- Creada barra superior con selector de dispositivos: iPhone 16 (`393x852`), iPhone Pro Max (`430x932`), Google Pixel (`412x915`) y conmutador a Pantalla Completa.

### 6. Pruebas y Validación
- Levantado servidor de desarrollo local en el puerto `3000`.
- Verificadas las 4 pantallas, la navegación entre pestañas, el completado de misiones, la creación de nuevas metas y el canje en el bazar de Chispas mediante pruebas automatizadas de navegador.
