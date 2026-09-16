/**
 * GENESYS CLOUD EMAIL TEMPLATE EDITOR
 * Engine: Dynamic Body Parser, Strict Arial 10pt Rich HTML Generator, Dual Grammar Variables, Universal (a) Gender Transformer & Rich Image Copy/Paste Engine
 */

(function () {
    'use strict';

    // Default Pre-loaded Templates
    const DEFAULT_TEMPLATES = [
        {
            id: 'tpl_1',
            name: 'Confirmación de Recepción de Caso',
            category: 'Servicio',
            alertInfographic: 'Infografía_Pasos_Atencion_Cliente.pdf',
            alertExternalCc: '',
            alertNotice: 'Verificar número de contrato activo antes de enviar.',
            body: `Estimado(a) {{Nombre_Cliente}},

Esperamos que se encuentre muy bien.

Le confirmamos que hemos recibido su solicitud registrada bajo el número de ticket #{{Numero_Ticket}} respecto a {{Servicio_Producto}}.

Nuestro equipo se encuentra revisando los detalles proporcionados. Le mantendremos informado(a) sobre cualquier avance dentro de las próximas 24 a 48 horas hábiles.

Si requiere agregar información adicional a su caso, puede responder directamente a este correo electrónico.

Atentamente,
Centro de Atención al Cliente`
        },
        {
            id: 'tpl_2',
            name: 'Envío de Estado de Cuenta / Documentación',
            category: 'Servicio',
            alertInfographic: 'Guia_Lectura_Estado_Cuenta.pdf',
            alertExternalCc: '',
            alertNotice: 'Validar titularidad antes de enviar información bancaria.',
            body: `Estimado(a) {{Nombre_Cliente}},

Por medio del presente correo {{te envío_te enviamos}} {{el_los}} {{estado de cuenta_estados de cuenta}} {{solicitado_solicitados}} para su caso #{{Numero_Ticket}}.

Adjunto a este mensaje encontrará {{el documento_los documentos}} en formato PDF para su revisión y respaldo.

Quedamos a su entera disposición ante cualquier duda o aclaración. Le deseamos un excelente día.

Atentamente,
Mesa de Atención al Cliente`
        },
        {
            id: 'tpl_3',
            name: 'Solicitud de Información Adicional',
            category: 'Soporte',
            alertInfographic: 'Guia_Captura_Requisitos.png',
            alertExternalCc: 'soporte-tecnico@empresa.com',
            alertNotice: 'Requiere adjuntar el formulario de requisitos en PDF.',
            body: `Estimado(a) {{Nombre_Cliente}},

Le saludamos cordialmente del área de soporte técnico.

Para poder dar continuidad a {{la solicitud_las solicitudes}} registrada(s) bajo el caso #{{Numero_Ticket}}, solicitamos amablemente que nos proporcione la siguiente información:

• {{Informacion_Requerida}}
• {{el documento_los documentos}} de respaldo (si aplica)

Una vez contemos con estos datos, procederemos inmediatamente con las gestiones correspondientes.

Quedamos atentos a sus comentarios.

Atentamente,
Soporte Especializado`
        },
        {
            id: 'tpl_4',
            name: 'Notificación de Escalación a Nivel 2',
            category: 'Escalación',
            alertInfographic: '',
            alertExternalCc: 'escalaciones-urgentes@empresa.com',
            alertNotice: 'OBLIGATORIO: Copiar el buzón externo de escalaciones mostrado arriba.',
            body: `Estimado(a) {{Nombre_Cliente}},

Le informamos que su caso #{{Numero_Ticket}} referente a {{Servicio_Producto}} ha sido escalado a nuestro departamento especialista para un análisis más profundo.

El motivo de esta transferencia es: {{Motivo_Escalacion}}.

El tiempo estimado de respuesta para esta etapa es de {{Tiempo_Estimado}}. Le agradecemos su paciencia y le aseguramos que estamos trabajando para resolverlo a la brevedad.

Atentamente,
Área de Escalaciones`
        },
        {
            id: 'tpl_5',
            name: 'Solución y Cierre de Ticket',
            category: 'Servicio',
            alertInfographic: 'Encuesta_Satisfaccion_QR.pdf',
            alertExternalCc: '',
            alertNotice: 'Recordar adjuntar la infografía con el código QR de evaluación.',
            body: `Estimado(a) {{Nombre_Cliente}},

Nos complace informarle que su requerimiento registrado con el número #{{Numero_Ticket}} ha sido resuelto exitosamente.

Resumen de la solución aplicada:
{{Detalle_Solucion}}

Agradecemos su confianza en nuestro servicio. Si tiene alguna inquietud adicional sobre esta misma gestión, puede responder a este mensaje antes de 5 días hábiles.

Le deseamos un excelente día.

Atentamente,
Servicio al Cliente`
        }
    ];

    // State
    let templates = [];
    let currentTemplateId = null;
    let supportSelectedId = null;
    let activeCategory = 'all';
    let searchQuery = '';
    let currentView = 'agent';
    let activeImageTarget = 'agent'; // 'agent' | 'support'
    let currentSelectedImgSrc = '';

    // Grammar State
    let selectedGender = 'hombre';
    let selectedPlural = 'singular';

    // DOM Elements
    const elements = {
        btnModeAgent: document.getElementById('btn-mode-agent'),
        btnModeSupport: document.getElementById('btn-mode-support'),
        viewAgentContainer: document.getElementById('view-agent-container'),
        viewSupportContainer: document.getElementById('view-support-container'),

        // Agent View
        templatesContainer: document.getElementById('templates-container'),
        variablesContainer: document.getElementById('variables-container'),
        emailPreview: document.getElementById('email-preview'),
        currentTemplateName: document.getElementById('current-template-name'),
        currentTemplateCategory: document.getElementById('current-template-category'),
        templateAlertsContainer: document.getElementById('template-alerts-container'),
        searchTemplates: document.getElementById('search-templates'),
        categoryFilters: document.getElementById('category-filters'),

        // Grammar Selectors
        genderSelector: document.getElementById('gender-selector'),
        pluralSelector: document.getElementById('plural-selector'),

        // Agent Buttons & Toolbar
        btnCopyGenesys: document.getElementById('btn-copy-genesys'),
        btnCopyText: document.getElementById('btn-copy-text'),
        btnQuickFillToday: document.getElementById('btn-quick-fill-today'),
        btnClearVariables: document.getElementById('btn-clear-variables'),
        btnThemeToggle: document.getElementById('btn-theme-toggle'),
        agentBtnImage: document.getElementById('agent-btn-image'),

        // Backup Menu
        btnBackupMenu: document.getElementById('btn-backup-menu'),
        backupDropdown: document.getElementById('backup-dropdown'),
        btnExportJson: document.getElementById('btn-export-json'),
        importJsonFile: document.getElementById('import-json-file'),
        btnResetDefaults: document.getElementById('btn-reset-defaults'),

        // Support View
        supportTemplatesList: document.getElementById('support-templates-list'),
        btnSupportNewTpl: document.getElementById('btn-support-new-tpl'),
        btnSupportSaveTpl: document.getElementById('btn-support-save-tpl'),
        btnSupportDeleteTpl: document.getElementById('btn-support-delete-tpl'),
        suppTplId: document.getElementById('supp-tpl-id'),
        suppTplName: document.getElementById('supp-tpl-name'),
        suppTplCategory: document.getElementById('supp-tpl-category'),
        suppTplInfographic: document.getElementById('supp-tpl-infographic'),
        suppTplExternalCc: document.getElementById('supp-tpl-external-cc'),
        suppTplNotice: document.getElementById('supp-tpl-notice'),
        suppTplBody: document.getElementById('supp-tpl-body'),
        suppBtnImage: document.getElementById('supp-btn-image'),

        // Dual Variable Creator Elements (Support Mode)
        dualValSingular: document.getElementById('dual-val-singular'),
        dualValPlural: document.getElementById('dual-val-plural'),
        btnInsertDualVar: document.getElementById('btn-insert-dual-var'),

        // Image Modal Elements
        modalImageDialog: document.getElementById('modal-image-dialog'),
        btnCloseImgModal: document.getElementById('btn-close-img-modal'),
        btnCancelImgModal: document.getElementById('btn-cancel-img-modal'),
        btnConfirmInsertImg: document.getElementById('btn-confirm-insert-img'),
        tabImgFile: document.getElementById('tab-img-file'),
        tabImgUrl: document.getElementById('tab-img-url'),
        tabContentFile: document.getElementById('tab-content-file'),
        tabContentUrl: document.getElementById('tab-content-url'),
        imgDropZone: document.getElementById('img-drop-zone'),
        modalImgInput: document.getElementById('modal-img-input'),
        modalImgUrlInput: document.getElementById('modal-img-url-input'),
        imgModalPreviewBox: document.getElementById('img-modal-preview-box'),
        imgModalPreview: document.getElementById('img-modal-preview'),

        quickTagsContainer: document.getElementById('quick-tags-container'),
        toastContainer: document.getElementById('toast-container')
    };

    function init() {
        loadTemplates();
        setupEventListeners();
        setupFormattingToolbar();
        setupClipboardPasteHandlers();
        setupImageModalHandlers();

        if (templates.length > 0) {
            selectTemplate(templates[0].id);
        }

        const savedTheme = localStorage.getItem('genesys_email_theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    function loadTemplates() {
        const stored = localStorage.getItem('genesys_email_templates');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    templates = parsed;
                } else {
                    templates = [...DEFAULT_TEMPLATES];
                }
            } catch (e) {
                console.error(e);
                templates = [...DEFAULT_TEMPLATES];
            }
        } else {
            templates = [...DEFAULT_TEMPLATES];
            saveTemplates();
        }
        renderAgentTemplatesList();
    }

    function saveTemplates() {
        localStorage.setItem('genesys_email_templates', JSON.stringify(templates));
    }

    function switchView(mode) {
        currentView = mode;
        if (mode === 'agent') {
            elements.btnModeAgent.classList.add('active');
            elements.btnModeSupport.classList.remove('active');
            elements.viewAgentContainer.classList.add('active');
            elements.viewSupportContainer.classList.remove('active');
            renderAgentTemplatesList();
            if (currentTemplateId) selectTemplate(currentTemplateId);
        } else {
            elements.btnModeSupport.classList.add('active');
            elements.btnModeAgent.classList.remove('active');
            elements.viewSupportContainer.classList.add('active');
            elements.viewAgentContainer.classList.remove('active');
            renderSupportWorkspace();
        }
    }

    function renderAgentTemplatesList() {
        elements.templatesContainer.innerHTML = '';

        const filtered = templates.filter(t => {
            const matchesCat = activeCategory === 'all' || t.category === activeCategory;
            const matchesSearch = searchQuery === '' || 
                t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                t.body.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCat && matchesSearch;
        });

        if (filtered.length === 0) {
            elements.templatesContainer.innerHTML = `<div class="empty-state"><p>No se encontraron plantillas.</p></div>`;
            return;
        }

        filtered.forEach(t => {
            const card = document.createElement('div');
            card.className = `template-card ${t.id === currentTemplateId ? 'active' : ''}`;
            const vars = extractManualVariables(t.body);
            const hasAlert = t.alertInfographic || t.alertExternalCc || t.alertNotice;
            const hasImages = t.body.includes('<img') || t.body.includes('data:image');
            
            card.innerHTML = `
                <div class="template-card-header">
                    <span class="template-card-title">${escapeHtml(t.name)}</span>
                    <span class="template-card-badge">${escapeHtml(t.category)}</span>
                </div>
                <div class="template-card-snippet">${escapeHtml(t.body.replace(/<img[^>]*>/gi, '[Imagen]'))}</div>
                ${hasAlert ? `<div class="template-card-has-alert">⚠️ Contiene Avisos Especiales</div>` : ''}
                <div class="template-card-footer">
                    <span>${vars.length} variable(s) manuales</span>
                    ${hasImages ? '<span>🖼️ Con Imágenes</span>' : ''}
                </div>
            `;

            card.addEventListener('click', () => selectTemplate(t.id));
            elements.templatesContainer.appendChild(card);
        });
    }

    function extractManualVariables(text) {
        const regex = /\{\{([^}]+)\}\}/g;
        const matches = new Set();
        let match;
        while ((match = regex.exec(text)) !== null) {
            const varName = match[1].trim();
            const isSalutation = varName.toLowerCase() === 'saludo' || varName.toLowerCase() === 'estimado_a';
            const isDualVariable = varName.includes('_');

            if (!isSalutation && !isDualVariable) {
                matches.add(varName);
            }
        }
        return Array.from(matches);
    }

    function selectTemplate(templateId) {
        const tpl = templates.find(t => t.id === templateId);
        if (!tpl) return;

        currentTemplateId = templateId;
        elements.currentTemplateName.textContent = tpl.name;
        elements.currentTemplateCategory.textContent = tpl.category;

        renderAgentTemplatesList();
        renderSpecialAlertsBanner(tpl);
        generateVariablesForm(tpl);
        updatePreview();
    }

    function renderSpecialAlertsBanner(tpl) {
        const container = elements.templateAlertsContainer;
        container.innerHTML = '';

        const hasInfographic = Boolean(tpl.alertInfographic);
        const hasCc = Boolean(tpl.alertExternalCc);
        const hasNotice = Boolean(tpl.alertNotice);

        if (!hasInfographic && !hasCc && !hasNotice) {
            container.classList.add('hidden');
            return;
        }

        container.classList.remove('hidden');

        if (hasInfographic) {
            const div = document.createElement('div');
            div.className = 'alert-item alert-infographic';
            div.innerHTML = `<span>🖼️ <strong>Infografía requerida:</strong> ${escapeHtml(tpl.alertInfographic)}</span>`;
            container.appendChild(div);
        }

        if (hasCc) {
            const div = document.createElement('div');
            div.className = 'alert-item alert-cc';
            div.innerHTML = `
                <span>📧 <strong>Copiar a CC Externo:</strong> ${escapeHtml(tpl.alertExternalCc)}</span>
                <button class="btn-copy-cc" data-email="${escapeHtml(tpl.alertExternalCc)}">Copiar CC</button>
            `;
            div.querySelector('.btn-copy-cc').addEventListener('click', (e) => {
                const email = e.target.getAttribute('data-email');
                navigator.clipboard.writeText(email);
                showToast(`Buzón CC copiado: ${email}`, 'success');
            });
            container.appendChild(div);
        }

        if (hasNotice) {
            const div = document.createElement('div');
            div.className = 'alert-item alert-notice';
            div.innerHTML = `<span>⚠️ <strong>Aviso Importante:</strong> ${escapeHtml(tpl.alertNotice)}</span>`;
            container.appendChild(div);
        }
    }

    function generateVariablesForm(tpl) {
        const vars = extractManualVariables(tpl.body);
        elements.variablesContainer.innerHTML = '';

        if (vars.length === 0) {
            elements.variablesContainer.innerHTML = `<div class="empty-state"><p>Esta plantilla se gestiona 100% mediante los selectores gramaticales e imágenes de la plantilla.</p></div>`;
            return;
        }

        vars.forEach(varName => {
            const group = document.createElement('div');
            group.className = 'field-group';
            const cleanLabel = varName.replace(/_/g, ' ');

            let defaultValue = '';
            if (varName.toLowerCase() === 'fecha') {
                defaultValue = getTodayFormatted();
            }

            const isLongText = varName.toLowerCase().includes('solucion') || 
                               varName.toLowerCase().includes('detalle') || 
                               varName.toLowerCase().includes('informacion') ||
                               varName.toLowerCase().includes('motivo');

            group.innerHTML = `
                <div class="field-label">
                    <span>${escapeHtml(cleanLabel)}</span>
                    <span class="field-tag-name">{{${escapeHtml(varName)}}}</span>
                </div>
                ${isLongText ? 
                    `<textarea class="field-textarea var-input" data-var="${escapeHtml(varName)}" placeholder="Ingrese ${escapeHtml(cleanLabel)}...">${escapeHtml(defaultValue)}</textarea>` :
                    `<input type="text" class="field-input var-input" data-var="${escapeHtml(varName)}" value="${escapeHtml(defaultValue)}" placeholder="Ingrese ${escapeHtml(cleanLabel)}...">`
                }
            `;
            elements.variablesContainer.appendChild(group);
        });

        const inputs = elements.variablesContainer.querySelectorAll('.var-input');
        inputs.forEach(input => input.addEventListener('input', updatePreview));
    }

    /**
     * DYNAMIC GRAMMAR ENGINE & EXACT (a) SUFFIX TRANSFORMER
     */
    function processGrammarRules(text) {
        let result = text;

        // 1. EXACT (a) SUFFIX TRANSFORMER
        result = result.replace(/\b([A-Za-zÁÉÍÓÚáéíóúñÑ]+?)(o|\(o\))?[\/\(](as?|\/a|\/o)[\)]?/gi, (fullMatch, stem) => {
            const isCapital = fullMatch[0] === fullMatch[0].toUpperCase();
            
            let base = stem;
            if (base.toLowerCase().endsWith('o')) {
                base = base.slice(0, -1);
            }

            const fullLower = fullMatch.toLowerCase();
            const isConsonantNoun = fullLower.includes('señor') || fullLower.includes('titular') || fullLower.includes('doctor');

            let replacement = '';

            if (selectedGender === 'hombre') {
                if (isConsonantNoun) {
                    replacement = stem;
                } else {
                    replacement = base + 'o';
                }
            } else if (selectedGender === 'mujer') {
                replacement = base + 'a';
            } else if (selectedGender === 'empresa') {
                if (isConsonantNoun) {
                    replacement = stem + 'es';
                } else {
                    replacement = base + 'os';
                }
            }

            if (isCapital && replacement.length > 0) {
                replacement = replacement[0].toUpperCase() + replacement.slice(1);
            }
            return replacement;
        });

        // Salutation token fallback
        let salutation = 'Estimado';
        if (selectedGender === 'mujer') salutation = 'Estimada';
        if (selectedGender === 'empresa') salutation = 'Estimados';

        result = result.replace(/\{\{\s*(saludo|estimado_a)\s*\}\}/gi, salutation);

        // 2. DUAL GRAMMAR REPLACEMENT FOR {{Singular_Plural}}
        const isPlural = selectedPlural === 'plural';

        result = result.replace(/\{\{([^}]+)\}\}/g, (match, content) => {
            if (content.includes('_')) {
                const parts = content.split('_');
                if (parts.length >= 2) {
                    const singularVal = parts[0].trim();
                    const pluralVal = parts.slice(1).join('_').trim();
                    return isPlural ? pluralVal : singularVal;
                }
            }
            return match;
        });

        return result;
    }

    // Live Preview Arial 10pt Renderer (Supports Inline HTML Images)
    function updatePreview() {
        const tpl = templates.find(t => t.id === currentTemplateId);
        if (!tpl) return;

        const varInputs = elements.variablesContainer.querySelectorAll('.var-input');
        const values = {};

        varInputs.forEach(input => {
            values[input.getAttribute('data-var')] = input.value;
        });

        let bodyResult = tpl.body;

        Object.keys(values).forEach(key => {
            const val = values[key] !== '' ? values[key] : `{{${key}}}`;
            const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
            bodyResult = bodyResult.replace(regex, val);
        });

        bodyResult = processGrammarRules(bodyResult);

        // Parse paragraphs while preserving <img> tags intact
        const imgMap = [];
        let cleanBody = bodyResult.replace(/<img[^>]*>/gi, (imgTag) => {
            imgMap.push(imgTag);
            return `___IMG_PLACEHOLDER_${imgMap.length - 1}___`;
        });

        const paragraphs = cleanBody.split(/\n\n+/);
        let htmlBody = paragraphs.map(p => {
            let lineBreaks = escapeHtml(p).replace(/\n/g, '<br>');
            imgMap.forEach((imgTag, idx) => {
                const token = `___IMG_PLACEHOLDER_${idx}___`;
                lineBreaks = lineBreaks.replace(token, imgTag);
            });
            return `<p style="font-family: Arial, Helvetica, sans-serif; font-size: 10pt; line-height: 1.45; color: #1e293b; margin-bottom: 12px;">${lineBreaks}</p>`;
        }).join('');

        imgMap.forEach((imgTag, idx) => {
            const token = `___IMG_PLACEHOLDER_${idx}___`;
            htmlBody = htmlBody.replace(token, imgTag);
        });

        elements.emailPreview.innerHTML = `
            <div style="font-family: Arial, Helvetica, sans-serif; font-size: 10pt; line-height: 1.45; color: #1e293b;">
                ${htmlBody}
            </div>
        `;
    }

    // Hero Copy Action for Genesys Cloud (Includes Images & Arial 10pt formatting)
    async function copyForGenesysCloud() {
        const previewElement = elements.emailPreview;
        const htmlContent = previewElement.innerHTML;
        const textContent = previewElement.innerText;

        try {
            const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
            const textBlob = new Blob([textContent], { type: 'text/plain' });

            const clipboardItem = new ClipboardItem({
                'text/html': htmlBlob,
                'text/plain': textBlob
            });

            await navigator.clipboard.write([clipboardItem]);
            showToast('¡Cuerpo e imágenes copiadas en Arial 10pt! Pégalo con Ctrl + V en Genesys Cloud.', 'success');

        } catch (err) {
            fallbackCopyHtml(htmlContent);
        }
    }

    function fallbackCopyHtml(htmlContent) {
        const container = document.createElement('div');
        container.innerHTML = htmlContent;
        container.style.position = 'fixed';
        container.style.opacity = '0';
        document.body.appendChild(container);

        const range = document.createRange();
        range.selectNodeContents(container);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);

        try {
            document.execCommand('copy');
            showToast('¡Cuerpo e imágenes copiadas! Pégalas con Ctrl + V.', 'success');
        } catch (e) {
            showToast('Error al copiar automáticamente.', 'error');
        }

        selection.removeAllRanges();
        document.body.removeChild(container);
    }

    // DIRECT CLIPBOARD PASTE HANDLER FOR IMAGES (Ctrl + V)
    function setupClipboardPasteHandlers() {
        // Agent View Preview Paste Handler
        elements.emailPreview.addEventListener('paste', (e) => {
            const items = (e.clipboardData || e.originalEvent.clipboardData).items;
            for (let item of items) {
                if (item.type.indexOf('image') === 0) {
                    e.preventDefault();
                    const blob = item.getAsFile();
                    const reader = new FileReader();
                    reader.onload = function (event) {
                        const base64Src = event.target.result;
                        insertImageHtmlToPreview(`<img src="${base64Src}" alt="Imagen incrustada" style="max-width: 100%; height: auto; display: block; margin: 12px 0; border-radius: 6px;">`);
                        showToast('Imagen del portapapeles pegada con éxito', 'success');
                    };
                    reader.readAsDataURL(blob);
                    return;
                }
            }
        });

        // Support Mode Textarea Paste Handler
        elements.suppTplBody.addEventListener('paste', (e) => {
            const items = (e.clipboardData || e.originalEvent.clipboardData).items;
            for (let item of items) {
                if (item.type.indexOf('image') === 0) {
                    e.preventDefault();
                    const blob = item.getAsFile();
                    const reader = new FileReader();
                    reader.onload = function (event) {
                        const base64Src = event.target.result;
                        const imgTag = `<img src="${base64Src}" alt="Imagen incrustada" style="max-width: 100%; height: auto; display: block; margin: 12px 0; border-radius: 6px;">`;
                        insertTagToSupportText(imgTag);
                        showToast('Imagen del portapapeles pegada en la plantilla', 'success');
                    };
                    reader.readAsDataURL(blob);
                    return;
                }
            }
        });
    }

    function insertImageHtmlToPreview(imgTag) {
        elements.emailPreview.focus();
        document.execCommand('insertHTML', false, imgTag);
    }

    // IMAGE MODAL HANDLERS
    function setupImageModalHandlers() {
        elements.agentBtnImage.addEventListener('click', () => openImageModal('agent'));
        elements.suppBtnImage.addEventListener('click', () => openImageModal('support'));

        elements.btnCloseImgModal.addEventListener('click', closeImageModal);
        elements.btnCancelImgModal.addEventListener('click', closeImageModal);

        elements.tabImgFile.addEventListener('click', () => {
            elements.tabImgFile.classList.add('active');
            elements.tabImgUrl.classList.remove('active');
            elements.tabContentFile.classList.add('active');
            elements.tabContentUrl.classList.remove('active');
        });

        elements.tabImgUrl.addEventListener('click', () => {
            elements.tabImgUrl.classList.add('active');
            elements.tabImgFile.classList.remove('active');
            elements.tabContentUrl.classList.add('active');
            elements.tabContentFile.classList.remove('active');
        });

        elements.imgDropZone.addEventListener('click', () => elements.modalImgInput.click());

        elements.imgDropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            elements.imgDropZone.style.borderColor = 'var(--primary)';
        });

        elements.imgDropZone.addEventListener('dragleave', () => {
            elements.imgDropZone.style.borderColor = 'var(--border-highlight)';
        });

        elements.imgDropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            elements.imgDropZone.style.borderColor = 'var(--border-highlight)';
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileSelection(e.dataTransfer.files[0]);
            }
        });

        elements.modalImgInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                handleFileSelection(e.target.files[0]);
            }
        });

        elements.modalImgUrlInput.addEventListener('input', (e) => {
            const url = e.target.value.trim();
            if (url) {
                currentSelectedImgSrc = url;
                elements.imgModalPreview.src = url;
                elements.imgModalPreviewBox.classList.remove('hidden');
            } else {
                elements.imgModalPreviewBox.classList.add('hidden');
            }
        });

        elements.btnConfirmInsertImg.addEventListener('click', () => {
            if (!currentSelectedImgSrc) {
                showToast('Selecciona o ingresa una imagen primero', 'error');
                return;
            }

            const imgTag = `<img src="${currentSelectedImgSrc}" alt="Imagen incrustada" style="max-width: 100%; height: auto; display: block; margin: 12px 0; border-radius: 6px;">`;

            if (activeImageTarget === 'support') {
                insertTagToSupportText(imgTag);
            } else {
                insertImageHtmlToPreview(imgTag);
            }

            closeImageModal();
            showToast('Imagen insertada exitosamente', 'success');
        });
    }

    function handleFileSelection(file) {
        if (!file.type.startsWith('image/')) {
            showToast('Por favor selecciona un archivo de imagen válido', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            currentSelectedImgSrc = e.target.result;
            elements.imgModalPreview.src = currentSelectedImgSrc;
            elements.imgModalPreviewBox.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }

    function openImageModal(target) {
        activeImageTarget = target;
        currentSelectedImgSrc = '';
        elements.modalImgInput.value = '';
        elements.modalImgUrlInput.value = '';
        elements.imgModalPreviewBox.classList.add('hidden');
        elements.modalImageDialog.classList.add('active');
    }

    function closeImageModal() {
        elements.modalImageDialog.classList.remove('active');
    }

    // SUPPORT / ADMIN WORKSPACE
    function renderSupportWorkspace() {
        const listContainer = elements.supportTemplatesList;
        listContainer.innerHTML = '';

        if (templates.length === 0) {
            listContainer.innerHTML = `<div class="empty-state"><p>No hay plantillas registradas.</p></div>`;
            return;
        }

        templates.forEach(t => {
            const card = document.createElement('div');
            card.className = `template-card ${t.id === supportSelectedId ? 'active' : ''}`;
            const snippetText = t.body.replace(/<img[^>]*>/gi, '[Imagen]');
            card.innerHTML = `
                <div class="template-card-header">
                    <span class="template-card-title">${escapeHtml(t.name)}</span>
                    <span class="template-card-badge">${escapeHtml(t.category)}</span>
                </div>
                <div class="template-card-snippet">${escapeHtml(snippetText)}</div>
            `;
            card.addEventListener('click', () => selectSupportTemplate(t.id));
            listContainer.appendChild(card);
        });

        if (!supportSelectedId && templates.length > 0) {
            selectSupportTemplate(templates[0].id);
        }
    }

    function selectSupportTemplate(id) {
        supportSelectedId = id;
        const tpl = templates.find(t => t.id === id);
        if (!tpl) return;

        renderSupportWorkspace();

        elements.suppTplId.value = tpl.id;
        elements.suppTplName.value = tpl.name;
        elements.suppTplCategory.value = tpl.category;
        elements.suppTplInfographic.value = tpl.alertInfographic || '';
        elements.suppTplExternalCc.value = tpl.alertExternalCc || '';
        elements.suppTplNotice.value = tpl.alertNotice || '';
        elements.suppTplBody.value = tpl.body;
    }

    function createNewSupportTemplate() {
        const newId = 'tpl_' + Date.now();
        const newTpl = {
            id: newId,
            name: 'Nueva Plantilla Personalizada',
            category: 'Servicio',
            alertInfographic: '',
            alertExternalCc: '',
            alertNotice: '',
            body: 'Estimado(a) {{Nombre_Cliente}},\n\nPor medio del presente correo le mantenemos informado(a) respecto a {{solicitud_solicitudes}}...\n\nAtentamente,\nCentro de Atención'
        };

        templates.unshift(newTpl);
        saveTemplates();
        supportSelectedId = newId;
        renderSupportWorkspace();
        showToast('Nueva plantilla creada en modo Soporte', 'success');
    }

    function saveSupportTemplate() {
        const id = elements.suppTplId.value;
        if (!id) return;

        const index = templates.findIndex(t => t.id === id);
        if (index === -1) return;

        templates[index] = {
            id,
            name: elements.suppTplName.value.trim() || 'Sin Nombre',
            category: elements.suppTplCategory.value,
            alertInfographic: elements.suppTplInfographic.value.trim(),
            alertExternalCc: elements.suppTplExternalCc.value.trim(),
            alertNotice: elements.suppTplNotice.value.trim(),
            body: elements.suppTplBody.value
        };

        saveTemplates();
        renderSupportWorkspace();
        showToast('Cambios de la plantilla guardados exitosamente', 'success');
    }

    function deleteSupportTemplate() {
        const id = elements.suppTplId.value;
        if (!id) return;

        if (confirm('¿Eliminar esta plantilla definitivamente?')) {
            templates = templates.filter(t => t.id !== id);
            saveTemplates();
            supportSelectedId = templates.length > 0 ? templates[0].id : null;
            renderSupportWorkspace();
            showToast('Plantilla eliminada', 'success');
        }
    }

    function setupFormattingToolbar() {
        document.getElementById('format-bold').addEventListener('click', () => applyFormat('bold'));
        document.getElementById('format-italic').addEventListener('click', () => applyFormat('italic'));
        document.getElementById('format-underline').addEventListener('click', () => applyFormat('underline'));
        document.getElementById('format-ul').addEventListener('click', () => applyFormat('insertUnorderedList'));
        document.getElementById('format-ol').addEventListener('click', () => applyFormat('insertOrderedList'));
        document.getElementById('format-clear').addEventListener('click', () => applyFormat('removeFormat'));

        document.getElementById('supp-bold').addEventListener('click', () => insertTextTag('<b>', '</b>'));
        document.getElementById('supp-italic').addEventListener('click', () => insertTextTag('<i>', '</i>'));
        document.getElementById('supp-underline').addEventListener('click', () => insertTextTag('<u>', '</u>'));
        document.getElementById('supp-tag-cliente').addEventListener('click', () => insertTagToSupportText('{{Nombre_Cliente}}'));
        document.getElementById('supp-tag-ticket').addEventListener('click', () => insertTagToSupportText('{{Numero_Ticket}}'));
        document.getElementById('supp-tag-saludo').addEventListener('click', () => insertTagToSupportText('Estimado(a)'));
    }

    function applyFormat(command, value = null) {
        elements.emailPreview.focus();
        document.execCommand(command, false, value);
    }

    function insertTextTag(open, close) {
        const textarea = elements.suppTplBody;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = textarea.value.substring(start, end);
        textarea.value = textarea.value.substring(0, start) + open + selected + close + textarea.value.substring(end);
    }

    function insertTagToSupportText(tag) {
        const textarea = elements.suppTplBody;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        textarea.value = textarea.value.substring(0, start) + tag + textarea.value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + tag.length;
        textarea.focus();
    }

    function setupEventListeners() {
        elements.btnModeAgent.addEventListener('click', () => switchView('agent'));
        elements.btnModeSupport.addEventListener('click', () => switchView('support'));

        // Grammar Gender Selector
        elements.genderSelector.addEventListener('click', (e) => {
            const btn = e.target.closest('.grammar-pill');
            if (btn) {
                elements.genderSelector.querySelectorAll('.grammar-pill').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedGender = btn.getAttribute('data-gender');
                updatePreview();
            }
        });

        // Grammar Plural Selector
        elements.pluralSelector.addEventListener('click', (e) => {
            const btn = e.target.closest('.grammar-pill');
            if (btn) {
                elements.pluralSelector.querySelectorAll('.grammar-pill').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedPlural = btn.getAttribute('data-plural');
                updatePreview();
            }
        });

        // KEYBOARD TAB ACCESSIBILITY & AUTO-SELECTION FOR GRAMMAR PILLS
        document.querySelectorAll('.grammar-pill').forEach(btn => {
            btn.setAttribute('tabindex', '0');

            btn.addEventListener('focus', () => {
                btn.click();
            });

            btn.addEventListener('keydown', (e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    btn.click();
                }
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    const next = btn.nextElementSibling || btn.parentElement.firstElementChild;
                    if (next) next.focus();
                }
                if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prev = btn.previousElementSibling || btn.parentElement.lastElementChild;
                    if (prev) prev.focus();
                }
            });
        });

        // Insert Custom Dual Variable {{Singular_Plural}}
        elements.btnInsertDualVar.addEventListener('click', () => {
            const singular = elements.dualValSingular.value.trim();
            const plural = elements.dualValPlural.value.trim();
            if (!singular || !plural) {
                showToast('Ingresa ambos valores (Singular y Plural)', 'error');
                return;
            }
            insertTagToSupportText(`{{${singular}_${plural}}}`);
            elements.dualValSingular.value = '';
            elements.dualValPlural.value = '';
            showToast(`Variable {{${singular}_${plural}}} insertada`, 'success');
        });

        // Quick Preset Dual Variables
        document.querySelectorAll('.dual-preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const singular = btn.getAttribute('data-singular');
                const plural = btn.getAttribute('data-plural');
                insertTagToSupportText(`{{${singular}_${plural}}}`);
            });
        });

        // Agent Actions
        elements.btnCopyGenesys.addEventListener('click', copyForGenesysCloud);
        elements.btnCopyText.addEventListener('click', () => {
            navigator.clipboard.writeText(elements.emailPreview.innerText);
            showToast('Texto plano copiado', 'success');
        });

        elements.btnQuickFillToday.addEventListener('click', () => {
            const fechaInput = elements.variablesContainer.querySelector('[data-var*="fecha" i]');
            if (fechaInput) fechaInput.value = getTodayFormatted();
            updatePreview();
        });

        elements.btnClearVariables.addEventListener('click', () => {
            const inputs = elements.variablesContainer.querySelectorAll('.var-input');
            inputs.forEach(i => i.value = '');
            updatePreview();
        });

        elements.searchTemplates.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderAgentTemplatesList();
        });

        elements.categoryFilters.addEventListener('click', (e) => {
            if (e.target.classList.contains('pill')) {
                elements.categoryFilters.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
                e.target.classList.add('active');
                activeCategory = e.target.getAttribute('data-category');
                renderAgentTemplatesList();
            }
        });

        // Support Actions
        elements.btnSupportNewTpl.addEventListener('click', createNewSupportTemplate);
        elements.btnSupportSaveTpl.addEventListener('click', saveSupportTemplate);
        elements.btnSupportDeleteTpl.addEventListener('click', deleteSupportTemplate);

        elements.btnThemeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', nextTheme);
            localStorage.setItem('genesys_email_theme', nextTheme);
        });

        elements.btnBackupMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            elements.backupDropdown.parentElement.classList.toggle('active');
        });

        document.addEventListener('click', () => elements.backupDropdown.parentElement.classList.remove('active'));

        elements.btnExportJson.addEventListener('click', exportTemplatesJson);
        elements.importJsonFile.addEventListener('change', importTemplatesJson);
        elements.btnResetDefaults.addEventListener('click', resetToFactoryDefaults);

        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === 'KeyC') {
                e.preventDefault();
                copyForGenesysCloud();
            }
            if ((e.ctrlKey || e.metaKey) && e.code === 'KeyK') {
                e.preventDefault();
                elements.searchTemplates.focus();
            }
        });

        elements.quickTagsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('tag-chip')) {
                const tag = `{{${e.target.getAttribute('data-var')}}}`;
                const activeEl = document.activeElement;
                if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
                    const start = activeEl.selectionStart;
                    const end = activeEl.selectionEnd;
                    activeEl.value = activeEl.value.substring(0, start) + tag + activeEl.value.substring(end);
                    activeEl.dispatchEvent(new Event('input'));
                }
            }
        });
    }

    function exportTemplatesJson() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(templates, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `plantillas_genesys_${getTodayFormatted().replace(/\//g, '-')}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        showToast('Plantillas exportadas a JSON', 'success');
    }

    function importTemplatesJson(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (event) {
            try {
                const imported = JSON.parse(event.target.result);
                if (Array.isArray(imported)) {
                    templates = imported;
                    saveTemplates();
                    renderAgentTemplatesList();
                    if (templates.length > 0) selectTemplate(templates[0].id);
                    showToast(`${imported.length} plantillas importadas`, 'success');
                }
            } catch (err) {
                showToast('Error al importar JSON', 'error');
            }
        };
        reader.readAsText(file);
    }

    function resetToFactoryDefaults() {
        if (confirm('¿Restaurar plantillas de fábrica?')) {
            templates = [...DEFAULT_TEMPLATES];
            saveTemplates();
            renderAgentTemplatesList();
            selectTemplate(templates[0].id);
            showToast('Plantillas restauradas', 'success');
        }
    }

    function getTodayFormatted() {
        const d = new Date();
        return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        let icon = type === 'success' ? '✅' : (type === 'error' ? '⚠️' : 'ℹ️');
        toast.innerHTML = `<span>${icon}</span> <span>${escapeHtml(message)}</span>`;
        elements.toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    document.addEventListener('DOMContentLoaded', init);

})();
