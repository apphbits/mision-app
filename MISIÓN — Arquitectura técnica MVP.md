# MISIÓN — Arquitectura técnica del MVP

## 1. Stack tecnológico

### Aplicación móvil
- **Flutter**
- **Dart**
- Una única base de código para Android y posteriormente iOS.
- Interfaz moderna, profesional y con elementos de gamificación.

### Backend
- **Supabase**

Supabase será nuestro **Backend as a Service (BaaS)** para el MVP.

Utilizaremos Supabase para:
- Autenticación de usuarios.
- API de acceso a datos.
- Seguridad y Row Level Security (RLS).
- Gestión de archivos mediante Storage cuando sea necesario.
- Funciones server-side cuando sean necesarias.
- Realtime cuando sea necesario.

### Base de datos
- **PostgreSQL proporcionado y administrado por Supabase.**

No se creará una instancia independiente de PostgreSQL.

La relación será:

**Supabase → proporciona nuestra base de datos PostgreSQL.**

### Notificaciones
- Firebase Cloud Messaging (FCM), integrado posteriormente según las necesidades del MVP.

### Inteligencia artificial
- **NO utilizar IA en el MVP.**
- La arquitectura deberá permitir incorporar IA posteriormente sin tener que reconstruir la aplicación.

### Pagos
- **NO implementar pagos en el primer MVP funcional.**

---

# 2. Arquitectura general

```text
┌─────────────────────────────┐
│       📱 MISIÓN APP         │
│       Flutter + Dart        │
└──────────────┬──────────────┘
               │
               │ API / SDK
               ▼
┌─────────────────────────────┐
│       🟢 SUPABASE           │
│                             │
│  • Auth                     │
│  • API                      │
│  • Seguridad / RLS          │
│  • Storage                  │
│  • Server Functions         │
│  • Realtime                 │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│      🐘 PostgreSQL          │
│      Base de datos          │
└─────────────────────────────┘
```

## Importante

Para el MVP:

**Supabase es nuestro backend.**

**PostgreSQL es nuestra base de datos dentro de Supabase.**

No crear:

- Python
- FastAPI
- servidor backend independiente
- VPS para backend
- PostgreSQL externo
- API propia innecesaria

Estas tecnologías podrán evaluarse en una versión futura si las necesidades de IA, procesamiento o escalabilidad lo justifican.

---

# 3. Principio de arquitectura

La aplicación debe estar preparada para crecer, pero el MVP debe mantenerse sencillo.

No se deben introducir tecnologías o servicios únicamente porque podrían ser útiles en el futuro.

Regla:

> **Construir solamente lo necesario para el MVP, dejando puntos de extensión claros para futuras versiones.**

---

# 4. Estructura lógica

La aplicación deberá separar como mínimo:

```text
Presentation
    ↓
Business Logic
    ↓
Data / Services
    ↓
Supabase
    ↓
PostgreSQL
```

La lógica de gamificación NO debe estar mezclada directamente con widgets de Flutter.

Por ejemplo:

```text
MissionService
ProgressionService
StreakService
AchievementService
RewardService
GoalService
```

Cada servicio deberá tener responsabilidades claras.

---

# 5. Base de datos inicial

La base de datos PostgreSQL de Supabase tendrá inicialmente entidades como:

```text
profiles
goals
missions
mission_completions
achievements
user_achievements
rewards
user_rewards
streaks
notifications
```

La estructura exacta de tablas, relaciones, índices, restricciones y políticas RLS deberá definirse en el documento específico de base de datos antes de implementar.

---

# 6. Historial de misiones

No utilizar únicamente:

```text
mission.completed = true
```

Las misiones deberán registrar su historial mediante:

```text
mission_completions
```

Esto permitirá posteriormente:

- estadísticas
- análisis de progreso
- evolución del usuario
- futuras funciones de IA
- detección de patrones
- historial de actividad

---

# 7. Seguridad

Todo dato privado del usuario deberá estar protegido mediante **Supabase Row Level Security (RLS)**.

Un usuario solamente podrá consultar o modificar sus propios datos.

Las recompensas, progreso y operaciones sensibles no deben depender exclusivamente de valores enviados por el cliente.

No almacenar claves secretas dentro de la aplicación Flutter.

---

# 8. Futuras extensiones

La arquitectura deberá permitir añadir posteriormente:

```text
                ┌── IA / Coach
                │
MISIÓN ─ Supabase ├── Misiones personalizadas
                │
                ├── Análisis avanzado
                │
                ├── Comunidad
                │
                └── Retos / temporadas
```

En una versión futura podría incorporarse:

**Python + FastAPI**

solamente si existe una necesidad real, por ejemplo para:

- procesamiento avanzado de IA
- agentes
- generación personalizada de misiones
- análisis complejo
- procesos que no convenga ejecutar directamente en Supabase

Pero **esto NO forma parte del MVP.**

---

# 9. Regla para la IA de código

La IA de código deberá respetar esta arquitectura.

Antes de implementar cualquier componente deberá comprobar:

1. ¿Forma parte del MVP?
2. ¿Está definido en la especificación?
3. ¿Puede implementarse utilizando Flutter + Supabase?
4. ¿Realmente necesitamos una tecnología adicional?

Si una tecnología adicional no es necesaria, **no debe introducirse**.

La IA de código no debe crear Python, FastAPI, servidores externos o bases de datos independientes sin una decisión explícita dentro de la especificación.