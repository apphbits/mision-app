---
description: Regla estricta de aislamiento de cuentas, repositorios de GitHub y bases de datos por proyecto
globs: ["*"]
always_on: true
---

# REGLA OBLIGATORIA: Aislamiento Estricto de Proyectos y Cuentas

1. **GitHub y Repositorios:**
   - NUNCA usar cuentas de GitHub, tokens o repositorios pertenecientes a otros proyectos (como `iacr360gith` u otros).
   - Para este proyecto específico de Hábitos / MISIÓN, la ÚNICA cuenta autorizada es **`apphbits`** (`https://github.com/apphbits/mision-app`).
   - ANTES de realizar cualquier `git push`, creación de repositorio o cambio de remote, VERIFICAR explícitamente que el destino corresponda a `apphbits`.
   - Si se requiere una acción sobre una cuenta externa o no está 100% claro el destino, PREGUNTAR y confirmar siempre con el usuario antes de proceder.

2. **Bases de Datos y Supabase:**
   - Este proyecto opera ÚNICAMENTE en el proyecto de Supabase configurado en el archivo `.env` (`bxgdaqcnphulhfchfqnf` / `apphbits@gmail.com`).
   - NUNCA ejecutar queries, migraciones o alteraciones de esquema en bases de datos de otros proyectos.
   - Siempre mostrar y confirmar el nombre/ID del proyecto de base de datos antes de migraciones mayores.

3. **Tokens y Credenciales:**
   - No cruzar tokens, API keys o variables entre proyectos del equipo.
