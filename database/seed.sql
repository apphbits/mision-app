-- ====================================================================
-- MISIÓN — SEED DATA: CATÁLOGO INICIAL (8 CATEGORÍAS, LOGROS Y RECOMPENSAS)
-- ====================================================================

-- 1. Catálogo de Misiones por las 8 Categorías Oficiales
INSERT INTO public.missions (title, description, category, difficulty, duration_minutes, impulso_reward, chispas_reward, is_system_template) VALUES
-- Mente
('Meditación de Claridad Matutina', 'Dedica 10 minutos a observar tu respiración sin juzgar tus pensamientos.', 'Mente', 'Fácil', 10, 10, 5, true),
('Lectura Profunda de 20 Páginas', 'Lee sin distracciones digitales para alimentar tu pensamiento crítico.', 'Mente', 'Normal', 25, 25, 10, true),
('Journaling de Gratitud y Enfoque', 'Escribe 3 aprendizajes del día y tus 3 prioridades de mañana.', 'Mente', 'Fácil', 10, 10, 5, true),

-- Cuerpo
('Caminata Consciente de 20 Minutos', 'Sal a caminar al aire libre a ritmo constante activando tu energía.', 'Cuerpo', 'Normal', 20, 25, 10, true),
('Sesión de Movilidad y Estiramiento', 'Rutina de 15 minutos para liberar tensión en columna, caderas y cuello.', 'Cuerpo', 'Fácil', 15, 10, 5, true),
('Entrenamiento de Fuerza o Calistenia', 'Completa tu rutina de fuerza muscular para potenciar tu vitalidad.', 'Cuerpo', 'Difícil', 45, 50, 20, true),

-- Relaciones
('Mensaje de Aprecio Genuino', 'Envía un mensaje sincero de gratitud a un amigo, familiar o colega.', 'Relaciones', 'Fácil', 5, 10, 5, true),
('Conversación sin Pantallas', 'Comparte 30 minutos de charla presente con alguien importante para ti.', 'Relaciones', 'Normal', 30, 25, 10, true),

-- Crecimiento
('Estudio de Idioma / Vocabulario', 'Practica 20 minutos de lecciones y repaso de nuevo vocabulario.', 'Crecimiento', 'Normal', 20, 25, 10, true),
('Revisión de Avance Semanal', 'Analiza qué funcionó en tu semana y ajusta tus siguientes pasos.', 'Crecimiento', 'Normal', 25, 25, 10, true),
('Bloque de Trabajo Profundo (Deep Work)', '60 minutos de concentración pura en tu proyecto más importante.', 'Crecimiento', 'Difícil', 60, 50, 20, true),

-- Finanzas
('Registro y Auditoría de Gastos', 'Anota todos los egresos del día y categorízalos conscientemente.', 'Finanzas', 'Fácil', 10, 10, 5, true),
('Revisión del Presupuesto Mensual', 'Evalúa tus metas de ahorro e inversión para el mes en curso.', 'Finanzas', 'Normal', 25, 25, 10, true),

-- Creatividad
('Escritura Libre o Boceto Creativo', 'Dedica 15 minutos a plasmar ideas sin filtros ni autocrítica.', 'Creatividad', 'Fácil', 15, 10, 5, true),
('Exploración de Nuevas Ideas de Proyecto', 'Investiga y conceptualiza una solución innovadora a un problema real.', 'Creatividad', 'Normal', 30, 25, 10, true),

-- Experiencias
('Paseo por una Ruta Desconocida', 'Camina por un sendero o parque nuevo observando detalles que no conocías.', 'Experiencias', 'Normal', 30, 25, 10, true),
('Probar una Nueva Receta Saludable', 'Cocina un platillo nutritivo usando ingredientes frescos y coloridos.', 'Experiencias', 'Normal', 40, 25, 10, true),

-- Bienestar
('Desconexión Digital Nocturna', 'Apaga pantallas 45 minutos antes de dormir y prepárate para un descanso profundo.', 'Bienestar', 'Fácil', 15, 10, 5, true),
('Hidratación Óptima (2 Litros)', 'Cumple con el consumo diario de agua para mantener tu mente y cuerpo alerta.', 'Bienestar', 'Fácil', 5, 10, 5, true),
('Baño de Contraste o Ducha Fría', 'Estimula tu sistema nervioso con 60 segundos de agua fría al final de tu ducha.', 'Bienestar', 'Fácil', 5, 10, 5, true)
ON CONFLICT DO NOTHING;

-- 2. Catálogo de Logros Deterministas
INSERT INTO public.achievements (code, title, description, category, icon, condition_type, condition_value, reward_chispas) VALUES
('FIRST_MISSION', 'Primer Paso', 'Completa tu primera misión diaria en la aplicación.', 'Inicio', 'military_tech', 'completed_missions', 1, 10),
('STREAK_3', 'Chispa Inicial', 'Mantén una racha constante durante 3 días seguidos.', 'Racha', 'local_fire_department', 'streak_days', 3, 15),
('STREAK_7', 'Hábito Forjado', 'Alcanza 7 días ininterrumpidos de constancia y presencia.', 'Racha', 'local_fire_department', 'streak_days', 7, 30),
('STREAK_30', 'Maestro del Ritmo', 'Consigue 30 días de disciplina y transformación real.', 'Racha', 'workspace_premium', 'streak_days', 30, 100),
('TEN_MISSIONS', 'Compromiso Sólido', 'Completa 10 misiones a lo largo de tu viaje vital.', 'Progreso', 'verified', 'completed_missions', 10, 25),
('FIFTY_MISSIONS', 'Inquebrantable', 'Supera la marca de 50 misiones cumplidas.', 'Progreso', 'shield', 'completed_missions', 50, 75),
('LEVEL_4', 'Constructor Vital', 'Alcanza el Nivel 4 en la evolución de tu perfil.', 'Nivel', 'emoji_events', 'level', 4, 50),
('LEVEL_5', 'Forjador Constante', 'Alcanza el prestigioso Nivel 5.', 'Nivel', 'auto_awesome', 'level', 5, 70),
('FIRST_GOAL_CREATED', 'Visionario', 'Define tu primer sueño o meta en el árbol de progreso.', 'Metas', 'flag', 'goals_created', 1, 15)
ON CONFLICT (code) DO NOTHING;

-- 3. Catálogo de Recompensas Canjeables con Chispas
INSERT INTO public.rewards (title, description, cost_chispas, icon_name, reward_type) VALUES
('Protector de Racha (1 Congelador)', 'Protege tu racha durante 24 horas si un día tienes una emergencia.', 60, 'ac_unit', 'streak_freeze'),
('Sesión de Masaje o Tarde Libre', 'Premio personal por disciplina: regálate 2 horas de desconexión absoluta.', 120, 'spa', 'real_life_reward'),
('Café de Especialidad / Libro Nuevo', 'Canjea tu constancia comprándote ese libro de crecimiento que anhelas.', 150, 'menu_book', 'real_life_reward'),
('Insignia de Aura Dorada en Perfil', 'Destaca tu avatar con un marco luminoso de constancia superior.', 200, 'stars', 'cosmetic')
ON CONFLICT DO NOTHING;
