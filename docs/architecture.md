# MISIÓN — Arquitectura de Software

## 1. Visión General de la Arquitectura
El sistema implementa una **Arquitectura Limpia (Clean Architecture)** con separación estricta entre la capa de presentación, lógica de dominio y capa de datos / servicios.

```text
┌─────────────────────────────────────────────────────────┐
│                 CAPA DE PRESENTACIÓN                    │
│      (Vistas: Hoy, Metas, Evolución, Perfil / Modales)   │
└────────────────────────────┬────────────────────────────┘
                             │ Dispara eventos / Escucha estado
                             ▼
┌─────────────────────────────────────────────────────────┐
│                CAPA DE LÓGICA DE NEGOCIO                │
│   (State Notifiers / Controllers / Game Engine)         │
└────────────────────────────┬────────────────────────────┘
                             │ Invoca servicios de dominio
                             ▼
┌─────────────────────────────────────────────────────────┐
│                   SERVICIOS DE DOMINIO                  │
│  • MissionService          • ProgressionService         │
│  • StreakService           • GoalService                │
│  • AchievementService      • RewardService              │
└────────────────────────────┬────────────────────────────┘
                             │ Persiste y consulta
                             ▼
┌─────────────────────────────────────────────────────────┐
│                CAPA DE DATOS & REPOSITORIOS             │
│  • Local Storage (Cache Offline First)                  │
│  • Supabase Client (PostgreSQL + RLS + Auth)            │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Responsabilidades de los Servicios

### 2.1 MissionService
- Carga de misiones activas y catálogo categorizado.
- Completado atómico de misiones: registra `mission_completions` con timestamp.
- Dispara eventos de recompensa hacia `ProgressionService` y `StreakService`.

### 2.2 ProgressionService
- Fuente de verdad: `total_impulso`.
- Cálculo de nivel actual, umbrales de XP, progreso porcentual hacia el siguiente rango.
- Emisión de eventos de "Subida de Nivel" (Level Up).

### 2.3 StreakService
- Validación de actividad diaria.
- Cálculo de racha actual, días cubiertos en la semana y tasa de disciplina.

### 2.4 GoalService
- CRUD de metas y sueños vitales.
- Vinculación de metas con misiones específicas o categorías.
- Recálculo del porcentaje de avance en base a misiones completadas.

### 2.5 AchievementService
- Evaluación determinista tras cada completado de misión, cambio de nivel o actualización de racha.
- Registro de `user_achievements` y otorgamiento de Chispas adicionales.

### 2.6 RewardService
- Catálogo de recompensas e inventario del usuario.
- Deducción segura de Chispas (`balance >= cost`).
