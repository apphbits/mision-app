# 🌟 MISIÓN — Gamified Goal & Habit Tracker (MVP)

> **"Convierte tus sueños en misiones diarias"**  
> *SUEÑO ➔ META ➔ MISIÓN ➔ CONSTANCIA ➔ DISCIPLINA ➔ RESULTADO*

---

## 📖 Descripción del Proyecto
**MISIÓN** es una plataforma de desarrollo personal gamificada creada para transformar aspiraciones vitales y sueños abstractos en acciones diarias concretas, sostenibles y motivadoras. Basada en el sistema de diseño visual **Mindful Sanctuary** (minimalismo orgánico y serenidad visual) y desarrollada siguiendo la metodología **Spec-Driven Development (SDD)**.

---

## 🗂 Estructura del Repositorio

```text
HABITOS/
├── docs/                        # Documentación Técnica SDD (Fase 1)
│   ├── product-spec.md          # Especificación funcional y alcance del MVP
│   ├── architecture.md          # Arquitectura limpia y flujo de capas
│   ├── database.md              # Diccionario de datos y políticas de seguridad RLS
│   └── gamification.md          # Fórmulas matemáticas de progreso y niveles
│
├── database/                    # Base de Datos Supabase / PostgreSQL (Fase 2)
│   ├── schema.sql               # Esquema DDL con 13 entidades y Row Level Security
│   └── seed.sql                 # Catálogo inicial de 8 categorías de misiones y logros
│
├── app/                         # Arquitectura Móvil Flutter & Dart (Fase 3)
│   ├── pubspec.yaml             # Dependencias del proyecto Flutter
│   └── lib/
│       ├── core/theme/          # Tokens del tema Mindful Sanctuary
│       ├── domain/entities/     # Entidades de dominio (Goal, Mission, Profile)
│       └── services/            # ProgressionService, MissionService, StreakService
│
└── mision-web/                  # Aplicación Web & Simulador Móvil Interactivo (Fases 4-10)
    ├── index.html               # Interfaz de 4 vistas con Simulador de Celular integrado
    ├── css/styles.css           # Tokens de diseño, sombras suaves y marco de hardware
    └── js/
        ├── state.js             # Estado reactivo y persistencia LocalStorage
        ├── gamification.js      # Motor determinista de XP, Niveles y Logros
        ├── audio.js             # Sintetizador de sonidos orgánicos (Web Audio API)
        └── app.js               # Controlador de vistas, modales y confeti
```

---

## 📱 Pantallas Principales

1. **Hoy (Misiones Diarias)**:
   - Bento card hero con racha de 7 días, saldo de Chispas (✨), barra de Impulso (⚡) y nivel de estatus.
   - Filtros por categoría (🧠 Mente, 💪 Cuerpo, 💼 Crecimiento, 💰 Finanzas, 🌱 Bienestar, etc.).
   - Misiones del día interactivas con cálculo instantáneo de recompensas, confeti y retroalimentación sonora.
   - Resumen de metas activas y botón de registro rápido de acciones.

2. **Mis Sueños y Metas**:
   - Árbol de progreso vital y medidor de ritmo semanal de constancia.
   - Cita inspiracional del credo de vida.
   - Creador de metas ("Plantear Nuevo Sueño") con vinculación de misiones y avance porcentual dinámico.

3. **Progreso y Evolución**:
   - Resumen de estatus (Constructor, Nivel 4) y medidor de XP hacia el siguiente rango.
   - Analítica de racha y tasa de disciplina (94%).
   - Galería de logros deterministas (*Primer Paso*, *Chispa Inicial*, *Hábito Forjado*, *Constructor Vital*).
   - Bazar de Chispas para canjear recompensas de bienestar y protectores de racha.

4. **Perfil y Ajustes**:
   - Resumen del usuario, estadísticas globales (total misiones, Impulso total, mejor racha).
   - Panel de estado de arquitectura Supabase y gestión de datos.

---

## 🛠 Simulador de Celular Integrado
La aplicación web cuenta con un simulador de hardware interactivo en pantalla:
- **iPhone 16** (`393 x 852 px`) con Dynamic Island y barra de estado en vivo.
- **iPhone Pro Max** (`430 x 932 px`) para pantallas grandes.
- **Google Pixel** (`412 x 915 px`) con marco redondeado estilo Android.
- **Pantalla Completa** para vista fluida responsiva de escritorio/tablet.

---

## 🚀 Cómo Ejecutar la Aplicación Localmente

1. Iniciar el servidor local en la carpeta `mision-web`:
   ```bash
   python -m http.server 3000 --directory "mision-web"
   ```
2. Abrir en el navegador:
   ```text
   http://localhost:3000
   ```
