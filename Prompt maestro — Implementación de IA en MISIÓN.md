# PROMPT MAESTRO — IMPLEMENTACIÓN DE IA EN MISIÓN

## 1. CONTEXTO DEL PROYECTO

Estamos desarrollando **MISIÓN**, una aplicación de desarrollo personal basada en gamificación.

La filosofía del producto es:

**Sueño → Meta → Misión → Constancia → Disciplina → Resultado**

MISIÓN convierte los objetivos personales del usuario en pequeñas acciones concretas que puede realizar en su vida real.

La aplicación ya tiene implementado:

- Frontend en Flutter/Dart.
- Backend existente.
- Supabase conectado.
- PostgreSQL funcionando dentro de Supabase.
- Autenticación.
- Base de datos.
- Tablas y relaciones necesarias.
- Sistema base de usuarios/metas/misiones/progreso.

**NO reconstruyas estos componentes.**

Tu trabajo ahora es incorporar una **capa de inteligencia artificial personalizada** sobre la arquitectura existente.

---

# 2. OBJETIVO DE ESTA IMPLEMENTACIÓN

Queremos que MISIÓN evolucione de una aplicación que simplemente registra metas y misiones a una aplicación que pueda:

1. Entender el objetivo del usuario.
2. Convertir ese objetivo en una ruta de trabajo.
3. Crear o adaptar misiones personalizadas.
4. Analizar el comportamiento del usuario.
5. Adaptar progresivamente las misiones.
6. Detectar dificultades o patrones.
7. Recomendar acciones.
8. Funcionar como un coach personal de desarrollo.
9. Utilizar el historial del usuario para personalizar sus recomendaciones.

La IA NO debe convertirse en el centro de la aplicación.

El centro sigue siendo:

**El usuario → su meta → sus acciones reales.**

La IA es el motor que ayuda a decidir cuál debería ser el siguiente paso.

---

# 3. ARQUITECTURA

La arquitectura existente debe mantenerse.

Conceptualmente:

Flutter
↓
Backend existente
↓
Supabase
↓
PostgreSQL

Ahora incorporaremos:

Flutter
↓
Backend existente / API de IA
↓
AI Service en Python
↓
Modelo de IA
↓
Supabase/PostgreSQL

Python será utilizado específicamente para la lógica relacionada con IA y procesamiento inteligente.

NO crees un segundo sistema de usuarios.

NO crees una segunda base de datos.

NO dupliques Supabase.

NO reemplaces el backend existente.

NO reemplaces PostgreSQL.

El servicio Python debe integrarse con la arquitectura actual.

---

# 4. REGLA PRINCIPAL

Antes de escribir código:

1. Inspecciona el proyecto actual.
2. Identifica la arquitectura existente.
3. Identifica cómo Flutter se comunica actualmente con el backend.
4. Identifica las tablas existentes.
5. Identifica relaciones entre tablas.
6. Identifica autenticación.
7. Identifica cómo se almacenan metas, misiones y completados.
8. Identifica qué servicios ya existen.
9. Identifica las reglas de gamificación existentes.

NO asumas nombres de tablas, campos, endpoints o servicios.

Utiliza los nombres reales del proyecto.

Si encuentras una diferencia entre esta especificación y la implementación actual, NO destruyas lo existente.

Primero documenta la diferencia y propón la solución compatible.

---

# 5. PRINCIPIOS DE LA IA

La IA debe cumplir estas reglas:

### Regla 1 — Acción real

Las recomendaciones deben intentar producir acciones que el usuario pueda realizar en el mundo real.

No queremos que la aplicación se convierta en un chatbot motivacional.

### Regla 2 — Misiones pequeñas

La IA debe preferir acciones concretas, claras y realizables.

Ejemplo malo:

"Mejora tu inglés."

Ejemplo bueno:

"Aprende 5 palabras relacionadas con viajes y crea una frase con cada una."

### Regla 3 — Personalización

No todos los usuarios deben recibir la misma ruta.

La IA debe considerar:

- objetivo;
- contexto;
- nivel;
- disponibilidad;
- historial;
- progreso;
- comportamiento;
- frecuencia de cumplimiento;
- dificultad anterior.

### Regla 4 — No castigar al usuario

Si el usuario falla varias misiones, la IA NO debe asumir que es perezoso o indisciplinado.

Debe analizar si:

- la misión era demasiado difícil;
- requería demasiado tiempo;
- tenía demasiada fricción;
- el horario no era adecuado;
- la misión no estaba alineada con el objetivo.

La respuesta debe ser adaptar el sistema.

### Regla 5 — No modificar gamificación arbitrariamente

La IA NO puede decidir libremente:

- Impulso;
- Chispas;
- recompensas;
- rachas;
- niveles;
- logros.

Estos valores pertenecen a las reglas determinísticas de la aplicación.

La IA puede recomendar acciones.

El sistema decide las recompensas.

---

# 6. PRIMERA FUNCIÓN DE IA

La primera funcionalidad que debemos implementar es:

## DREAM → GOAL → MISSION PLAN

Cuando un usuario introduce un sueño u objetivo, la IA debe transformarlo en una estructura accionable.

Ejemplo:

Usuario:

"Quiero aprender inglés para poder viajar a Estados Unidos dentro de seis meses."

La IA debe identificar:

- objetivo principal;
- resultado deseado;
- horizonte temporal;
- nivel aproximado;
- posibles etapas;
- primeras misiones.

Resultado conceptual:

META:
Aprender inglés para viajar.

RUTA:

1. Fundamentos
2. Vocabulario cotidiano
3. Conversación
4. Comprensión
5. Situaciones de viaje

Primeras misiones:

- Aprender 10 palabras básicas relacionadas con viajes.
- Practicar 5 frases para pedir comida.
- Escuchar 5 minutos de inglés.
- Practicar una presentación personal durante 5 minutos.

---

# 7. SEGUNDA FUNCIÓN — PERSONALIZACIÓN DE MISIONES

La IA debe poder adaptar las misiones existentes.

Ejemplo:

Usuario completa normalmente misiones de 10–15 minutos.

Pero abandona repetidamente misiones de 45 minutos.

La IA puede recomendar:

"Vamos a dividir esta misión en tres sesiones de 15 minutos."

La IA debe preferir:

Misión grande
↓
Misión dividida
↓
Acciones pequeñas

---

# 8. TERCERA FUNCIÓN — ANÁLISIS DEL COMPORTAMIENTO

La IA debe poder analizar el historial del usuario.

Datos potenciales:

- metas;
- misiones;
- misiones completadas;
- misiones omitidas;
- fechas;
- duración estimada;
- dificultad;
- rachas;
- frecuencia;
- categorías;
- progreso.

Debe detectar patrones.

Ejemplo:

"El usuario completa el 80% de sus misiones cuando duran menos de 15 minutos."

Otro ejemplo:

"El usuario tiene mayor cumplimiento durante la mañana."

Otro:

"Las misiones difíciles tienen una tasa de abandono significativamente mayor."

La IA debe convertir estos patrones en recomendaciones.

---

# 9. CUARTA FUNCIÓN — ADAPTACIÓN AUTOMÁTICA

El sistema debe poder recomendar cambios en la estrategia.

Ejemplo:

Usuario:

Meta:
"Crear mi negocio."

Después de varias semanas:

- completa misiones pequeñas;
- abandona tareas grandes;
- tiene buen cumplimiento cuando las tareas son específicas.

La IA podría generar:

"Durante la próxima semana vamos a reducir el tamaño de las misiones y concentrarnos en acciones de 15 minutos."

La IA no debe cambiar arbitrariamente los datos históricos.

Debe crear nuevas recomendaciones/misiones.

---

# 10. QUINTA FUNCIÓN — COACH DE MISIÓN

Posteriormente debe existir un asistente de IA contextual.

El usuario puede decir:

"Estoy desmotivado y llevo tres días sin completar misiones."

La IA debe conocer:

- sus metas;
- sus últimas misiones;
- su progreso;
- su historial reciente.

Y responder de forma contextual.

Ejemplo:

"No necesitas recuperar los tres días. Tu objetivo sigue siendo el mismo. Vamos a empezar nuevamente con una misión pequeña de 10 minutos."

El coach debe priorizar:

- claridad;
- acción;
- empatía;
- brevedad;
- progreso.

No debe convertirse en terapia ni realizar diagnósticos psicológicos.

---

# 11. CONTEXTO QUE PUEDE RECIBIR LA IA

Diseña una estructura de contexto similar a:

```json
{
  "user": {
    "id": "...",
    "name": "...",
    "timezone": "...",
    "preferences": {}
  },

  "goals": [],

  "active_missions": [],

  "recent_completions": [],

  "recent_skips": [],

  "streak": {},

  "progression": {},

  "behavior_summary": {}
}
```

NO envíes innecesariamente toda la base de datos al modelo.

Implementa una capa que prepare un **contexto resumido y relevante**.

El objetivo es reducir:

- coste;
- latencia;
- información innecesaria;
- riesgo de errores.

---

# 12. SALIDA ESTRUCTURADA

No dependas de texto libre del modelo para operaciones internas.

Las respuestas de IA deben utilizar estructuras JSON validadas.

Ejemplo conceptual:

```json
{
  "goal": {
    "title": "Aprender inglés para viajar",
    "description": "...",
    "duration_weeks": 24
  },

  "roadmap": [
    {
      "title": "Fundamentos",
      "order": 1
    }
  ],

  "missions": [
    {
      "title": "Aprender 10 palabras de viaje",
      "description": "...",
      "difficulty": "easy",
      "estimated_minutes": 10
    }
  ]
}
```

Utiliza modelos de validación en Python.

Si la respuesta del modelo no cumple el esquema:

1. No guardarla directamente.
2. Validarla.
3. Intentar corregirla si es posible.
4. Si no puede corregirse, devolver un error controlado.

---

# 13. SEGURIDAD

Las claves de los proveedores de IA NUNCA deben estar dentro de Flutter.

Nunca:

```text
Flutter → API KEY del modelo
```

Debe ser:

```text
Flutter
↓
Backend
↓
Python AI Service
↓
Proveedor de IA
```

Las credenciales deben mantenerse en variables de entorno/secret management.

Nunca guardar API keys en Git.

Nunca exponer secretos al cliente.

Validar siempre la identidad del usuario.

El servicio Python debe comprobar que el usuario autenticado puede acceder a los datos utilizados.

---

# 14. COSTOS

No envíes conversaciones o historiales completos innecesariamente.

Implementa:

- contexto resumido;
- límites de longitud;
- límites de frecuencia;
- reutilización de análisis cuando sea posible;
- separación entre datos históricos y contexto reciente.

La IA debe utilizarse cuando realmente aporta valor.

No llamar al modelo para operaciones que puedan resolverse con código normal.

Por ejemplo:

NO usar IA para:

- calcular una racha;
- sumar Impulso;
- determinar si una misión está completada;
- calcular porcentajes;
- guardar datos;
- verificar permisos.

Eso debe hacerlo el backend mediante lógica determinística.

---

# 15. IA VS LÓGICA TRADICIONAL

Usar código tradicional para:

- autenticación;
- permisos;
- CRUD;
- cálculos;
- recompensas;
- Impulso;
- Chispas;
- niveles;
- rachas;
- fechas;
- estadísticas básicas;
- validaciones.

Usar IA para:

- interpretar objetivos;
- generar rutas;
- personalizar misiones;
- analizar patrones;
- generar recomendaciones;
- adaptar estrategias;
- conversación contextual.

---

# 16. ENDPOINTS

Antes de implementarlos, inspecciona los endpoints actuales.

Después propone endpoints específicos para IA.

Como referencia conceptual:

```text
POST /ai/goal-plan
POST /ai/mission-adaptation
POST /ai/progress-analysis
POST /ai/recommendations
POST /ai/coach
```

NO asumas que estos serán los nombres finales.

Define los contratos primero.

Cada endpoint debe documentar:

- autenticación;
- request;
- response;
- errores;
- validaciones;
- límites;
- datos consultados;
- operaciones permitidas.

---

# 17. BASE DE DATOS

Antes de crear tablas nuevas, inspecciona las existentes.

No dupliques información.

Si realmente se necesitan nuevas entidades, documenta primero la razón.

Posibles conceptos futuros:

```text
ai_conversations
ai_recommendations
ai_analyses
ai_generated_missions
```

Pero NO las crees automáticamente.

Primero determina si pueden utilizarse las tablas existentes.

La base de datos debe permanecer normalizada.

---

# 18. PRIVACIDAD

La IA solo debe recibir los datos necesarios para realizar su función.

No enviar información personal irrelevante.

No almacenar indiscriminadamente todas las conversaciones.

Definir claramente qué información se almacena y por cuánto tiempo.

---

# 19. EXPERIENCIA DEL USUARIO

La IA debe sentirse integrada dentro de MISIÓN.

No queremos una aplicación que tenga:

"Aplicación MISIÓN"

y luego una sección separada:

"ChatGPT".

La IA debe aparecer en momentos donde aporta valor.

Ejemplos:

### Crear meta

"Cuéntame qué quieres conseguir y te ayudaré a convertirlo en una ruta."

### Después de completar varias misiones

"He detectado algo que puede ayudarte..."

### Después de varios fallos

"Podemos hacer esta misión más pequeña."

### Dashboard

"Tu siguiente mejor paso es..."

---

# 20. MVP DE IA

NO implementar todo simultáneamente.

Fase 1:

### IA Goal Planner

- Interpretar sueño.
- Crear meta.
- Crear ruta.
- Crear primeras misiones.
- Validar respuesta.
- Guardar resultados.

Fase 2:

### Mission Personalization

- Analizar historial.
- Adaptar dificultad.
- Dividir misiones.
- Recomendar duración.

Fase 3:

### Progress Analysis

- Analizar comportamiento.
- Detectar patrones.
- Generar recomendaciones.

Fase 4:

### AI Coach

- Conversación contextual.
- Utilizar metas y progreso.
- Recomendar siguiente acción.

---

# 21. PROCESO DE IMPLEMENTACIÓN

NO construyas todas las funciones en una sola operación.

Utiliza este proceso:

## FASE 0 — AUDITORÍA

Inspecciona:

- proyecto Flutter;
- backend;
- Supabase;
- DB;
- tablas;
- servicios;
- autenticación;
- endpoints;
- configuración.

Entrega primero un informe.

NO modifiques código todavía.

---

## FASE 1 — ARQUITECTURA IA

Define:

- ubicación del servicio Python;
- comunicación con backend;
- autenticación;
- proveedor/modelo de IA;
- estructura de contexto;
- contratos;
- errores;
- seguridad;
- variables de entorno.

Entrega documentación.

NO implementar todavía hasta validar la arquitectura.

---

## FASE 2 — AI GOAL PLANNER

Implementar solamente:

```text
Usuario
↓
Sueño
↓
Python
↓
IA
↓
Meta + Ruta + Misiones
↓
Validación
↓
Supabase
↓
Flutter
```

Crear tests.

---

## FASE 3 — PERSONALIZACIÓN

Implementar análisis del historial y adaptación de misiones.

Crear tests.

---

## FASE 4 — ANÁLISIS

Implementar análisis de comportamiento y recomendaciones.

Crear tests.

---

## FASE 5 — COACH

Implementar conversación contextual.

Crear tests.

---

# 22. TESTS OBLIGATORIOS

Crear pruebas para:

- usuario sin metas;
- usuario con una meta;
- usuario con múltiples metas;
- objetivo ambiguo;
- objetivo extremadamente grande;
- objetivo extremadamente pequeño;
- misión duplicada;
- respuesta inválida del modelo;
- timeout;
- error del proveedor;
- usuario no autenticado;
- acceso a datos de otro usuario;
- ausencia de historial;
- historial muy grande;
- zona horaria;
- conexión perdida;
- rate limit;
- modelo no disponible.

También verificar que:

**La IA nunca pueda otorgar Impulso, Chispas o recompensas directamente.**

---

# 23. OBSERVABILIDAD

Implementa logs suficientes para poder saber:

- qué endpoint fue llamado;
- usuario interno/anónimo identificado de forma segura;
- duración;
- éxito/error;
- tipo de operación;
- consumo aproximado;
- errores de validación.

NO registrar secretos.

NO registrar información sensible innecesaria.

---

# 24. CRITERIO DE CALIDAD

Una implementación correcta debe ser:

- modular;
- segura;
- testeable;
- escalable;
- mantenible;
- independiente del proveedor de IA cuando sea posible;
- compatible con la arquitectura actual.

No acoples toda la aplicación directamente a un proveedor específico.

Idealmente:

```text
AIService
   ↓
AIProvider
   ↓
OpenAI / otro proveedor
```

Así podremos cambiar el modelo posteriormente sin reconstruir MISIÓN.

---

# 25. REGLA SOBRE EL MODELO

Antes de seleccionar definitivamente el modelo, analiza:

- calidad;
- coste;
- velocidad;
- capacidad de structured output;
- contexto;
- latencia;
- disponibilidad;
- facilidad de integración con Python.

Propón la mejor opción para el caso de uso.

No asumas que el modelo más grande es automáticamente el mejor.

---

# 26. SDD — SPEC DRIVEN DEVELOPMENT

Todo el trabajo debe seguir:

**Especificación → Arquitectura → Base de datos → Contratos → Implementación → Tests → Revisión**

No programes una funcionalidad importante que no esté definida.

Para cada funcionalidad crear:

```text
Objetivo
Entrada
Proceso
Salida
Reglas
Errores
Seguridad
Persistencia
Acceptance Criteria
Tests
```

---

# 27. MUY IMPORTANTE

No hagas:

"Voy a implementar toda la IA de MISIÓN."

Hazlo incrementalmente.

Primero audita.

Después diseña.

Después implementa una función.

Después prueba.

Después revisa.

Después continúa.

No sobrescribas código existente sin necesidad.

No elimines funcionalidades existentes.

No cambies el esquema de la base de datos sin justificarlo.

No crees un backend paralelo innecesario.

No introduzcas tecnologías que no sean necesarias.

---

# 28. PRIMERA TAREA

Tu primera respuesta después de recibir este prompt NO debe ser código.

Debe contener:

### A. Auditoría de arquitectura actual

Qué existe actualmente.

### B. Arquitectura propuesta para IA

Cómo incorporar Python sin romper el sistema.

### C. Flujo de datos

Flutter → Backend → Python → IA → Supabase.

### D. Tablas existentes relevantes

Qué tablas utilizará la IA.

### E. Tablas nuevas necesarias

Solo si realmente hacen falta.

### F. Endpoints propuestos

Con request/response.

### G. Estructura del AI Service

Carpetas, módulos y responsabilidades.

### H. Modelo/proveedor de IA recomendado

Con justificación.

### I. Variables de entorno necesarias

Sin mostrar secretos.

### J. Plan de implementación por fases

### K. Riesgos técnicos

### L. Preguntas o ambigüedades encontradas

NO escribas código todavía.

Espera a que la arquitectura sea revisada antes de comenzar la implementación.

---

# OBJETIVO FINAL

Queremos que MISIÓN evolucione hacia:

**Una aplicación que no solamente registra lo que el usuario quiere conseguir, sino que aprende de su progreso y le ayuda a descubrir cuál debería ser su siguiente misión.**

La visión final es:

```text
                    🌟 SUEÑO
                       ↓
                     🎯 META
                       ↓
                🤖 IA PLANIFICADORA
                       ↓
                  🗺️ RUTA
                       ↓
                 🎯 MISIONES
                       ↓
                  👤 USUARIO
                       ↓
                  ✅ ACCIONES
                       ↓
                  📊 PROGRESO
                       ↓
                🧠 IA ANALIZA
                       ↓
              🔄 ADAPTA LA RUTA
                       ↓
              🎯 SIGUIENTE MISIÓN
```

La aplicación debe mantener siempre el principio:

> **La IA no vive por el usuario. La IA le ayuda a avanzar.**

El objetivo no es que el usuario pase más tiempo hablando con la IA.

El objetivo es que pase más tiempo **cumpliendo misiones en su vida real**.