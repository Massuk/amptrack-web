export const faqCategories = [
    {
        id: '28924eab-97cc-465a-ba21-f232bb95843f',
        slug: 'most-asked',
        title: 'Más preguntados',
    },
    {
        id: '395b0d41-b9a8-4cd6-8b5c-f07855e82d62',
        slug: 'general-inquiries',
        title: 'Problemas generales',
    },
    {
        id: 'bea49ee0-26da-46ad-97be-116cd7ab416d',
        slug: 'support',
        title: 'Soporte',
    },
];
export const faqs = [
    // Más preguntados
    {
        id: 'faq-001',
        categoryId: '28924eab-97cc-465a-ba21-f232bb95843f',
        question: '¿Puedo acceder a AmpTrack desde mi celular?',
        answer: 'Sí. AmpTrack es una plataforma responsiva que puede utilizarse tanto desde dispositivos móviles como desde computadoras de escritorio. Esto permite monitorear consumos y realizar análisis desde cualquier lugar.',
    },
    {
        id: 'faq-002',
        categoryId: '28924eab-97cc-465a-ba21-f232bb95843f',
        question: '¿Qué puedo hacer con AmpTrack?',
        answer: 'AmpTrack permite analizar patrones de consumo eléctrico, detectar comportamientos anómalos y generar alertas personalizadas. Además, puedes registrar observaciones y generar reportes históricos de consumos por sistema eléctrico.',
    },
    {
        id: 'faq-003',
        categoryId: '28924eab-97cc-465a-ba21-f232bb95843f',
        question: '¿Qué significa marcar un consumo como observado?',
        answer: 'Cuando un punto de consumo presenta un valor atípico o fuera del patrón habitual, puedes marcarlo como "observado" para su seguimiento. Esto ayuda a identificar posibles pérdidas no técnicas o errores de medición.',
    },
    {
        id: 'faq-004',
        categoryId: '28924eab-97cc-465a-ba21-f232bb95843f',
        question: '¿AmpTrack envía notificaciones automáticas?',
        answer: 'Sí. Cuando se marcan puntos como observados o se detectan comportamientos anómalos, AmpTrack puede enviar notificaciones al usuario o al especialista correspondiente, facilitando la supervisión oportuna.',
    },
    {
        id: 'faq-005',
        categoryId: '28924eab-97cc-465a-ba21-f232bb95843f',
        question: '¿AmpTrack es compatible con otros sistemas?',
        answer: 'AmpTrack puede integrarse con fuentes de datos externas mediante APIs. Está diseñado para trabajar con sistemas regulatorios, fuentes de información eléctrica y módulos analíticos complementarios.',
    },

    // Problemas generales
    {
        id: 'faq-006',
        categoryId: '395b0d41-b9a8-4cd6-8b5c-f07855e82d62',
        question: '¿Qué pasa si no encuentro un código de suministro?',
        answer: 'Verifica que el código esté correctamente escrito. AmpTrack solo acepta coincidencias exactas. Si aún no lo encuentras, puede que no esté registrado en la base de datos o esté mal digitado.',
    },
    {
        id: 'faq-007',
        categoryId: '395b0d41-b9a8-4cd6-8b5c-f07855e82d62',
        question: '¿Cómo selecciono la empresa asociada a un suministro?',
        answer: 'Una vez encontrado el código de suministro, AmpTrack te mostrará las empresas disponibles asociadas a ese código para que selecciones la correcta antes de continuar con el análisis.',
    },
    {
        id: 'faq-008',
        categoryId: '395b0d41-b9a8-4cd6-8b5c-f07855e82d62',
        question: '¿Por qué no puedo marcar como observado un punto de predicción?',
        answer: 'AmpTrack distingue entre consumos reales y valores proyectados. Solo los puntos de consumo real pueden ser marcados como observados para garantizar que el seguimiento se realice sobre datos verificados.',
    },
    {
        id: 'faq-009',
        categoryId: '395b0d41-b9a8-4cd6-8b5c-f07855e82d62',
        question: '¿Puedo exportar los datos o reportes?',
        answer: 'Actualmente, AmpTrack permite consultar el historial desde la interfaz. Pronto se habilitarán funciones para exportar observaciones y reportes en formatos como Excel o PDF.',
    },

    // Soporte
    {
        id: 'faq-010',
        categoryId: 'bea49ee0-26da-46ad-97be-116cd7ab416d',
        question: '¿Qué hago si olvido mis credenciales?',
        answer: 'Puedes restablecer tu contraseña desde la página de inicio de sesión de AmpTrack. Si el problema persiste, contacta al soporte técnico institucional.',
    },
    {
        id: 'faq-011',
        categoryId: 'bea49ee0-26da-46ad-97be-116cd7ab416d',
        question: '¿Quién puede marcar un consumo como comunicado?',
        answer: 'Solo usuarios autorizados pueden cambiar el estado de un consumo a "comunicado". Esta acción registra el nombre del usuario y la fecha del cambio para mantener trazabilidad.',
    },
    {
        id: 'faq-012',
        categoryId: 'bea49ee0-26da-46ad-97be-116cd7ab416d',
        question: '¿AmpTrack requiere conexión a internet?',
        answer: 'Sí. AmpTrack funciona completamente en línea y requiere conexión a internet para consultar datos, guardar observaciones y actualizar el historial.',
    },
    {
        id: 'faq-013',
        categoryId: 'bea49ee0-26da-46ad-97be-116cd7ab416d',
        question: '¿Dónde puedo reportar un problema o sugerencia?',
        answer: 'Puedes comunicarte con el equipo de soporte técnico a través del correo institucional o el módulo de contacto dentro de la plataforma AmpTrack.',
    },
];
