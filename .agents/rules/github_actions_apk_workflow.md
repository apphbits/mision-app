# Flujo de Despliegue y Compilación Automática con GitHub Actions

Para este repositorio (`mision-app`), la compilación de la APK de Android se realiza de forma 100% automatizada a través de **GitHub Actions**:

1. **Flujo de cambios:**
   - Realizar modificaciones en `mision-web/` (o código fuente).
   - Sincronizar assets con `npx cap sync`.
   - Realizar `git add .` y `git commit -m "..."`.
   - Ejecutar `git push origin main`.

2. **Acción de GitHub Actions:**
   - El workflow `.github/workflows/build-apk.yml` se dispara automáticamente en cada push a la rama `main` o `master`.
   - Compila la APK de depuración con Gradle en Ubuntu Runner.
   - Publica automáticamente una nueva versión en **GitHub Releases** (`v1.0.0-<build_number>`).
   - El archivo se adjunta como `mision-debug.apk`.

3. **Verificación y descarga local:**
   - Monitorear el estado con `gh run list --limit 1` o `gh run view`.
   - Una vez finalizado, descargar la APK actualizada a la carpeta local `apk/mision.apk`:
     ```powershell
     gh release download <tag> -p "mision-debug.apk" -D apk --clobber ; Move-Item -Force apk/mision-debug.apk apk/mision.apk
     ```
