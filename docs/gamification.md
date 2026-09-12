# MISIÓN — Motor de Gamificación y Fórmulas Matemáticas

## 1. Sistema de Impulso (⚡) y Chispas (✨)

| Dificultad | Impulso Ganado (⚡) | Chispas Ganadas (✨) | Duración Típica |
|:---|:---:|:---:|:---|
| **Fácil** | +10 ⚡ | +5 ✨ | 5 a 15 min |
| **Normal** | +25 ⚡ | +10 ✨ | 15 a 30 min |
| **Difícil** | +50 ⚡ | +20 ✨ | 30 a 60 min |
| **Épica** | +100 ⚡ | +50 ✨ | > 60 min o Hito Semanal |

---

## 2. Niveles Derivados de Forma Determinista

El nivel se calcula **exclusivamente a partir del `total_impulso` acumulado**, eliminando cualquier inconsistencia de estado o guardado redundante.

### Tabla de Rango y Umbrales
| Nivel | Rango / Título | Impulso Mínimo | Impulso Siguiente | XP Requerida en Nivel |
|:---|:---|:---:|:---:|:---:|
| **Nv. 1** | Iniciado | 0 | 100 | 100 ⚡ |
| **Nv. 2** | Explorador | 100 | 300 | 200 ⚡ |
| **Nv. 3** | Practicante | 300 | 600 | 300 ⚡ |
| **Nv. 4** | Constructor | 600 | 1,000 | 400 ⚡ |
| **Nv. 5** | Forjador Constante | 1,000 | 1,500 | 500 ⚡ |
| **Nv. 6** | Guardián del Ritmo | 1,500 | 2,200 | 700 ⚡ |
| **Nv. 7** | Maestro de Hábitos | 2,200 | 3,000 | 800 ⚡ |
| **Nv. 8** | Arquitecto Vital | 3,000 | 4,000 | 1,000 ⚡ |
| **Nv. 9** | Filósofo en Acción | 4,000 | 5,500 | 1,500 ⚡ |
| **Nv. 10** | Trascendente | 5,500 | ∞ | — |

### Algoritmo de Cálculo (Pseudocódigo)
```typescript
function calculateProgression(totalImpulso: number) {
  const levels = [
    { level: 1, title: "Iniciado", min: 0, max: 100 },
    { level: 2, title: "Explorador", min: 100, max: 300 },
    { level: 3, title: "Practicante", min: 300, max: 600 },
    { level: 4, title: "Constructor", min: 600, max: 1000 },
    { level: 5, title: "Forjador Constante", min: 1000, max: 1500 },
    { level: 6, title: "Guardián del Ritmo", min: 1500, max: 2200 },
    { level: 7, title: "Maestro de Hábitos", min: 2200, max: 3000 },
    { level: 8, title: "Arquitecto Vital", min: 3000, max: 4000 },
    { level: 9, title: "Filósofo en Acción", min: 4000, max: 5500 },
    { level: 10, title: "Trascendente", min: 5500, max: 999999 }
  ];

  const current = levels.find(l => totalImpulso >= l.min && totalImpulso < l.max) || levels[levels.length - 1];
  const currentXPInLevel = totalImpulso - current.min;
  const xpNeeded = current.max - current.min;
  const percentage = Math.min(100, Math.round((currentXPInLevel / xpNeeded) * 100));

  return {
    level: current.level,
    title: current.title,
    currentXPInLevel,
    xpNeeded,
    percentage,
    totalImpulso
  };
}
```

---

## 3. Sistema de Rachas y Días Consecutivos

- Cada día con al menos **1 misión completada** marca el día como cumplido.
- La racha se incrementa cuando el día completado es consecutivo al anterior.
- Si transcurre más de un día sin actividad, el protector de racha (congelador) puede amortiguar la pérdida.
- La racha histórica y las misiones completadas nunca se borran.

---

## 4. Logros Deterministas

1. `FIRST_MISSION` (1ª Misión completada) ➔ +10 ✨
2. `STREAK_3` (3 días seguidos de racha) ➔ +15 ✨
3. `STREAK_7` (7 días de constancia ininterrumpida) ➔ +30 ✨
4. `STREAK_30` (30 días de disciplina) ➔ +100 ✨
5. `TEN_MISSIONS` (10 misiones completadas en total) ➔ +25 ✨
6. `FIFTY_MISSIONS` (50 misiones completadas) ➔ +75 ✨
7. `LEVEL_4` (Alcanzar el rango de Constructor - Nivel 4) ➔ +50 ✨
8. `LEVEL_5` (Alcanzar Forjador Constante - Nivel 5) ➔ +70 ✨
9. `MULTI_DISCIPLINARY` (Misiones en 4 o más categorías diferentes) ➔ +40 ✨
10. `MASTER_GOAL` (Completar el 100% de una Meta Vital) ➔ +150 ✨
