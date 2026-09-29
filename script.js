        const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/TU_SCRIPT_ID/exec";

        /* SISTEMA DE INACTIVIDAD (Cierre automático de sesión en 30 segundos) */
        let inactivityTimer;

        function resetInactivityTimer() {
            clearTimeout(inactivityTimer);
            const activeUser = localStorage.getItem('innovasoft_user');
            if (activeUser) {
                // Configurar temporizador de 30 segundos (30000 milisegundos)
                inactivityTimer = setTimeout(autoLogout, 30000);
            }
        }

        function autoLogout() {
            const activeUser = localStorage.getItem('innovasoft_user');
            if (activeUser) {
                logout();
                alert('Tu sesión se ha cerrado automáticamente por inactividad (30 segundos sin uso).');
            }
        }

        // Eventos para monitorear la actividad del usuario
        ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'].forEach(evt => {
            window.addEventListener(evt, resetInactivityTimer, true);
        });

        function esCorreoValido(email) {
            const regexEmail = /^[a-zA-Z0-9._%+-]+@(gmail\.com|hotmail\.com|outlook\.com)$/i;
            return regexEmail.test(email.trim());
        }

        function esTarjetaValida(tarjeta) {
            const regexTarjeta = /^\d{16}$/;
            return regexTarjeta.test(tarjeta.trim());
        }

        const searchIndex = [
            { title: "Requerimiento Funcional (Autenticación / OTP)", section: "presentacion", targetId: "req-funcional", category: "Ejemplo de Requerimiento" },
            { title: "Requerimiento No Funcional (Tiempo de Respuesta)", section: "presentacion", targetId: "req-nofuncional", category: "Ejemplo de Requerimiento" },
            { title: "Análisis Ágil de Requerimientos", section: "inicio", targetId: "req-analisis-agil", category: "Características" },
            { title: "Alta Seguridad y Protocolos", section: "inicio", targetId: "req-alta-seguridad", category: "Características" },
            { title: "Soporte Multiplataforma (iOS, Android, Windows)", section: "inicio", targetId: "req-multiplataforma", category: "Características" },
            { title: "Concepto: ¿Qué es un Requerimiento?", section: "presentacion", targetId: "req-concepto", category: "Teoría" },
            { title: "Elementos de un Requerimiento (Entrada, Salida, Proceso)", section: "presentacion", targetId: "req-elementos", category: "Teoría" },
            { title: "Requerimiento Unívoco y Claro", section: "presentacion", targetId: "req-univoco", category: "Características" },
            { title: "Requerimiento Verificable", section: "presentacion", targetId: "req-verificable", category: "Características" },
            { title: "Requerimiento Necesario", section: "presentacion", targetId: "req-necesario", category: "Características" },
            { title: "Tipos de Requerimientos (Funcionales y No Funcionales)", section: "presentacion", targetId: "req-tipos", category: "Teoría" },
            { title: "Cotización: Responsividad Web", section: "encuesta", targetId: "req-responsividad", category: "Cotizador" },
            { title: "Cotización: Accesibilidad Multimedia", section: "encuesta", targetId: "req-accesibilidad", category: "Cotizador" },
            { title: "Cotización: Seguridad Avanzada y Encriptación", section: "encuesta", targetId: "req-seguridad-avanzada", category: "Cotizador" },
            { title: "Paquete Básico ($299 USD)", section: "servicios", targetId: "req-paquete-basico", category: "Servicios" },
            { title: "Paquete Empresarial ($599 USD)", section: "servicios", targetId: "req-paquete-empresarial", category: "Servicios" }
        ];

        function onSearchInput() {
            const query = document.getElementById('searchInput').value.toLowerCase().trim();
            const suggestionsBox = document.getElementById('searchSuggestions');

            if (query.length === 0) {
                suggestionsBox.style.display = 'none';
                return;
            }

            const matches = searchIndex.filter(item => 
                item.title.toLowerCase().includes(query) || 
                item.category.toLowerCase().includes(query)
            );

            if (matches.length === 0) {
                suggestionsBox.innerHTML = '<div class="suggestion-item"><span class="suggestion-section">Sin resultados coincidentes</span></div>';
            } else {
                suggestionsBox.innerHTML = matches.map(item => `
                    <div class="suggestion-item" onclick="selectSuggestion('${item.section}', '${item.targetId}')">
                        <span class="suggestion-title">${item.title}</span>
                        <span class="suggestion-section">${item.category} • Sección: ${item.section.toUpperCase()}</span>
                    </div>
                `).join('');
            }

            suggestionsBox.style.display = 'block';
        }

        function selectSuggestion(sectionId, targetId) {
            document.getElementById('searchSuggestions').style.display = 'none';
            document.getElementById('searchInput').value = '';

            showSection(sectionId);

            if (targetId) {
                const element = document.getElementById(targetId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    element.classList.add('highlight-item');
                    setTimeout(() => element.classList.remove('highlight-item'), 2500);
                }
            }
        }

        /* TOGGLE DROPDOWN MI CUENTA */
        function toggleAccountMenu(e) {
            e.preventDefault();
            e.stopPropagation();
            document.getElementById('accountDropdown').classList.toggle('show');
        }

        /* VISTA INTERACTIVA PARA "REGISTRAR" O "INICIAR SESIÓN" */
        function showAuthMode(mode) {
            document.getElementById('accountDropdown').classList.remove('show');
            showSection('auth');

            const activeUser = JSON.parse(localStorage.getItem('innovasoft_user'));
            if (activeUser) return;

            const loginCard = document.getElementById('loginCard');
            const registerCard = document.getElementById('registerCard');

            if (mode === 'register') {
                loginCard.style.display = 'none';
                registerCard.style.display = 'block';
            } else if (mode === 'login') {
                loginCard.style.display = 'block';
                registerCard.style.display = 'none';
            }
        }

        document.addEventListener('click', function(e) {
            const searchContainer = document.querySelector('.search-container');
            if (searchContainer && !searchContainer.contains(e.target)) {
                document.getElementById('searchSuggestions').style.display = 'none';
            }

            const accountDropdown = document.getElementById('accountDropdown');
            if (accountDropdown && !e.target.closest('#link-auth')) {
                accountDropdown.classList.remove('show');
            }
        });

        function saveToExcelSheet(type, payloadData) {
            console.log(`[Sync Google Sheets] ${type}`, payloadData);
            if(GOOGLE_SHEET_URL && !GOOGLE_SHEET_URL.includes("TU_SCRIPT_ID")) {
                fetch(GOOGLE_SHEET_URL, {
                    method: "POST",
                    mode: "no-cors",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ action: type, timestamp: new Date().toISOString(), ...payloadData })
                }).catch(err => console.error("Error guardando:", err));
            }
        }

        const i18n = {
            es: {
                search_ph: "Buscar...",
                nav_home: "Inicio",
                nav_presentation: "Presentación",
                nav_about: "Nosotros",
                nav_services: "Servicios",
                nav_survey: "Requerimientos",
                nav_login: "Mi Cuenta",
                menu_register: "REGISTRAR",
                menu_login: "INICIAR SESIÓN",
                features_title: "Destacados",
                feat_1_title: "Análisis Ágil",
                feat_1_desc: "Levantamiento funcional y no funcional de requerimientos adaptados a tu negocio.",
                feat_2_title: "Alta Seguridad",
                feat_2_desc: "Arquitectura con protocolos modernos y cumplimiento de normas técnicas de calidad.",
                feat_3_title: "Multiplataforma",
                feat_3_desc: "Soluciones optimizadas para Android, iOS, Windows y Chromebook.",
                about_title: "Sobre INNOVASOFT",
                brand_subtitle: "Tecnología e Innovación",
                mission_title: "Misión",
                mission_desc: "Transformar las ideas complejas de nuestros clientes en requerimientos técnicos claros, eficientes y alcanzables.",
                vision_title: "Visión",
                vision_desc: "Ser la consultora de ingeniería de requisitos de software líder en la región para 2030.",
                values_title: "Valores",
                values_desc: "Innovación, Transparencia, Seguridad, Accesibilidad y Calidad.",
                services_title: "Nuestros Servicios",
                basic_pkg_title: "Paquete Básico",
                basic_pkg_desc: "Documentación de Requerimientos Funcionales básicos y Maquetación Web.",
                basic_pkg_price: "$299 USD",
                corp_pkg_title: "Paquete Empresarial",
                corp_pkg_desc: "Levantamiento completo (Funcionales + No Funcionales) + Pruebas de usabilidad.",
                corp_pkg_price: "$599 USD",
                btn_hire: "Contratar",
                pres_title: "Presentación: Requerimientos de Software",
                footer_legal: "Enlaces Legales",
                footer_legal_notice: "Aviso Legal",
                footer_privacy: "Política de Privacidad",
                footer_terms: "Términos del Servicio",
                footer_contact: "Contacto",
                footer_rights: "© 2026 INNOVASOFT. Todos los derechos reservados.",
                survey_main_title: "Encuesta de Análisis de Requerimientos",
                survey_subtitle: "Indícanos qué características necesitas para generar tu paquete a medida:",
                survey_label_email: "Tu Correo Electrónico:",
                survey_label_select: "Selecciona los requerimientos necesarios:",
                survey_opt_1: "Responsividad (Adaptable a móviles y escritorio) (+$100 USD)",
                survey_opt_2: "Multiplataforma (Windows, Android, iOS, Chromebook) (+$200 USD)",
                survey_opt_3: "Accesibilidad (Texto, Imagen, Audio, Video) (+$80 USD)",
                survey_opt_4: "Seguridad Avanzada y Encriptación (+$150 USD)",
                survey_label_comments: "Detalles adicionales del proyecto:",
                survey_ph_comments: "Describe brevemente la idea de tu software...",
                survey_btn_submit: "Generar Paquete de Requerimientos",
                // Tipos de requerimientos
                types_title: "Tipos de Requerimientos",
                func_title: "Requerimientos Funcionales (El \"Qué\")",
                func_desc: "Definen las acciones, funciones y reglas de negocio que el sistema debe ejecutar al recibir ciertas entradas.",
                focus_label: "Enfoque:",
                func_focus: "Operaciones directas del usuario.",
                example_label: "Ejemplo:",
                func_example: "El sistema debe permitir al usuario iniciar sesión con su correo y contraseña.",
                nonfunc_title: "Requerimientos No Funcionales (El \"Cómo\")",
                nonfunc_desc: "Establecen las restricciones de calidad, rendimiento, seguridad y condiciones operativas del software.",
                nonfunc_focus: "Desempeño y atributos del sistema.",
                nonfunc_example: "La página debe responder a las búsquedas en un tiempo máximo de 2 segundos."
            },
            en: {
                search_ph: "Search...",
                nav_home: "Home",
                nav_presentation: "Presentation",
                nav_about: "About Us",
                nav_services: "Services",
                nav_survey: "Requirements",
                nav_login: "My Account",
                menu_register: "REGISTER",
                menu_login: "LOG IN",
                features_title: "Highlights",
                feat_1_title: "Agile Analysis",
                feat_1_desc: "Functional and non-functional requirements gathering tailored to your business.",
                feat_2_title: "High Security",
                feat_2_desc: "Architecture with modern protocols and compliance with quality technical standards.",
                feat_3_title: "Cross-Platform",
                feat_3_desc: "Optimized solutions for Android, iOS, Windows, and Chromebook.",
                about_title: "About INNOVASOFT",
                brand_subtitle: "Technology & Innovation",
                mission_title: "Mission",
                mission_desc: "Transform our clients' complex ideas into clear, efficient, and achievable technical requirements.",
                vision_title: "Vision",
                vision_desc: "To be the leading software requirements engineering consulting firm in the region by 2030.",
                values_title: "Values",
                values_desc: "Innovation, Transparency, Security, Accessibility, and Quality.",
                services_title: "Our Services",
                basic_pkg_title: "Basic Package",
                basic_pkg_desc: "Basic Functional Requirements Documentation and Web Layout.",
                basic_pkg_price: "$299 USD",
                corp_pkg_title: "Enterprise Package",
                corp_pkg_desc: "Full gathering (Functional + Non-Functional) + Usability testing.",
                corp_pkg_price: "$599 USD",
                btn_hire: "Order Now",
                pres_title: "Presentation: Software Requirements",
                footer_legal: "Legal Links",
                footer_legal_notice: "Legal Notice",
                footer_privacy: "Privacy Policy",
                footer_terms: "Terms of Service",
                footer_contact: "Contact Us",
                footer_rights: "© 2026 INNOVASOFT. All rights reserved.",
                survey_main_title: "Requirements Analysis Survey",
                survey_subtitle: "Tell us what features you need to generate your custom package:",
                survey_label_email: "Your Email Address:",
                survey_label_select: "Select the required features:",
                survey_opt_1: "Web Responsiveness (Mobile and Desktop) (+$100 USD)",
                survey_opt_2: "Cross-Platform (Windows, Android, iOS, Chromebook) (+$200 USD)",
                survey_opt_3: "Accessibility (Text, Image, Audio, Video) (+$80 USD)",
                survey_opt_4: "Advanced Security and Encryption (+$150 USD)",
                survey_label_comments: "Additional project details:",
                survey_ph_comments: "Briefly describe your software idea...",
                survey_btn_submit: "Generate Requirements Package",
                // Requirement types
                types_title: "Types of Requirements",
                func_title: "Functional Requirements (The \"What\")",
                func_desc: "Define the actions, functions, and business rules that the system must execute when receiving specific inputs.",
                focus_label: "Focus:",
                func_focus: "Direct user operations.",
                example_label: "Example:",
                func_example: "The system must allow the user to log in with their email and password.",
                nonfunc_title: "Non-Functional Requirements (The \"How\")",
                nonfunc_desc: "Establish quality, performance, security constraints, and operational conditions for the software.",
                nonfunc_focus: "System performance and attributes.",
                nonfunc_example: "The page must respond to searches in a maximum time of 2 seconds."
            },
            pt: {
                search_ph: "Pesquisar...",
                nav_home: "Início",
                nav_presentation: "Apresentação",
                nav_about: "Sobre Nós",
                nav_services: "Serviços",
                nav_survey: "Requisitos",
                nav_login: "Minha Conta",
                menu_register: "REGISTRAR",
                menu_login: "INICIAR SESSÃO",
                features_title: "Destaques",
                feat_1_title: "Análise Ágil",
                feat_1_desc: "Levantamento funcional e não funcional de requisitos adaptados ao seu negócio.",
                feat_2_title: "Alta Segurança",
                feat_2_desc: "Arquitetura com protocolos modernos e conformidade com normas técnicas de qualidade.",
                feat_3_title: "Multiplataforma",
                feat_3_desc: "Soluções otimizadas para Android, iOS, Windows e Chromebook.",
                about_title: "Sobre a INNOVASOFT",
                brand_subtitle: "Tecnologia e Inovação",
                mission_title: "Missão",
                mission_desc: "Transformar ideias complexas de nossos clientes em requisitos técnicos claros, eficientes e alcançáveis.",
                vision_title: "Visão",
                vision_desc: "Ser a consultoria líder em engenharia de requisitos de software na região até 2030.",
                values_title: "Valores",
                values_desc: "Inovação, Transparência, Segurança, Acessibilidade e Qualidade.",
                services_title: "Nossos Serviços",
                basic_pkg_title: "Pacote Básico",
                basic_pkg_desc: "Documentação de Requisitos Funcionais básicos e Layout Web.",
                basic_pkg_price: "$299 USD",
                corp_pkg_title: "Pacote Empresarial",
                corp_pkg_desc: "Levantamento completo (Funcionais + Não Funcionais) + Testes de usabilidade.",
                corp_pkg_price: "$599 USD",
                btn_hire: "Contratar",
                pres_title: "Apresentação: Requisitos de Software",
                footer_legal: "Links Legais",
                footer_legal_notice: "Aviso Legal",
                footer_privacy: "Política de Privacidade",
                footer_terms: "Termos de Serviço",
                footer_contact: "Contato",
                footer_rights: "© 2026 INNOVASOFT. Todos os direitos reservados.",
                survey_main_title: "Pesquisa de Análise de Requisitos",
                survey_subtitle: "Informe-nos quais recursos você precisa para gerar seu pacote personalizado:",
                survey_label_email: "Seu E-mail:",
                survey_label_select: "Selecione os requisitos necessários:",
                survey_opt_1: "Responsividade Web (Móvel e Desktop) (+$100 USD)",
                survey_opt_2: "Multiplataforma (Windows, Android, iOS, Chromebook) (+$200 USD)",
                survey_opt_3: "Acessibilidade (Texto, Imagem, Áudio, Vídeo) (+$80 USD)",
                survey_opt_4: "Segurança Avançada e Criptografia (+$150 USD)",
                survey_label_comments: "Detalhes adicionais do projeto:",
                survey_ph_comments: "Descreva brevemente a ideia do seu software...",
                survey_btn_submit: "Gerar Pacote de Requisitos",
                // Tipos de requisitos
                types_title: "Tipos de Requisitos",
                func_title: "Requisitos Funcionais (O \"O que\")",
                func_desc: "Definem as ações, funções e regras de negócio que o sistema deve executar ao receber determinadas entradas.",
                focus_label: "Foco:",
                func_focus: "Operações diretas do usuário.",
                example_label: "Exemplo:",
                func_example: "O sistema deve permitir que o usuário faça login com seu e-mail e senha.",
                nonfunc_title: "Requisitos Não Funcionais (O \"Como\")",
                nonfunc_desc: "Estabelecem as restrições de qualidade, desempenho, segurança e condições operacionais do software.",
                nonfunc_focus: "Desempenho e atributos do sistema.",
                nonfunc_example: "A página deve responder às pesquisas em um tempo máximo de 2 segundos."
            },
            zh: {
                search_ph: "搜索...",
                nav_home: "首页",
                nav_presentation: "演示",
                nav_about: "关于我们",
                nav_services: "服务",
                nav_survey: "需求",
                nav_login: "我的账户",
                menu_register: "注册",
                menu_login: "登录",
                features_title: "特点",
                feat_1_title: "敏捷分析",
                feat_1_desc: "收集适应您业务的功能性和非功能性需求。",
                feat_2_title: "高安全性",
                feat_2_desc: "采用现代协议并符合技术质量标准的架构。",
                feat_3_title: "多平台",
                feat_3_desc: "针对 Android、iOS、Windows 和 Chromebook 优化的解决方案。",
                about_title: "关于 INNOVASOFT",
                brand_subtitle: "科技与创新",
                mission_title: "使命",
                mission_desc: "将客户的复杂想法转化为清晰、高效且可实现的技术需求。",
                vision_title: "愿景",
                vision_desc: "到2030年成为该地区领先的软件需求工程咨询公司。",
                values_title: "价值观",
                values_desc: "创新、透明、安全、可访问性和质量。",
                services_title: "我们的服务",
                basic_pkg_title: "基础套餐",
                basic_pkg_desc: "基础功能需求文档和网页布局。",
                basic_pkg_price: "$299 USD",
                corp_pkg_title: "企业套餐",
                corp_pkg_desc: "完整需求收集（功能性 + 非功能性）+ 可用性测试。",
                corp_pkg_price: "$599 USD",
                btn_hire: "购买",
                pres_title: "演示：软件需求",
                footer_legal: "法律链接",
                footer_legal_notice: "法律声明",
                footer_privacy: "隐私政策",
                footer_terms: "服务条款",
                footer_contact: "联系方式",
                footer_rights: "© 2026 INNOVASOFT. 保留所有权利。",
                survey_main_title: "需求分析调查",
                survey_subtitle: "请告诉我们您需要哪些功能来定制您的套餐：",
                survey_label_email: "您的电子邮件：",
                survey_label_select: "选择所需的需求：",
                survey_opt_1: "网页响应式（适应移动端和桌面端）(+$100 USD)",
                survey_opt_2: "多平台（Windows、Android、iOS、Chromebook）(+$200 USD)",
                survey_opt_3: "无障碍功能（文本、图像、音频、视频）(+$80 USD)",
                survey_opt_4: "高级安全性与加密 (+$150 USD)",
                survey_label_comments: "项目的其他详细信息：",
                survey_ph_comments: "简要描述您的软件想法...",
                survey_btn_submit: "生成需求套餐",
                // 需求类型
                types_title: "需求类型",
                func_title: "功能需求（“什么”）",
                func_desc: "定义系统在接收特定输入时必须执行的操作、功能和业务规则。",
                focus_label: "重点：",
                func_focus: "用户直接操作。",
                example_label: "示例：",
                func_example: "系统必须允许用户使用其电子邮件和密码登录。",
                nonfunc_title: "非功能需求（“如何”）",
                nonfunc_desc: "建立软件的质量、性能、安全限制和运行条件。",
                nonfunc_focus: "系统性能和属性。",
                nonfunc_example: "页面必须在最多2秒内响应搜索。"
            }
        };

        function showSection(sectionId) {
            document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
            document.getElementById(sectionId).classList.add('active');

            document.querySelectorAll('.nav-menu-horizontal a').forEach(link => link.classList.remove('active-link'));
            const activeLink = document.getElementById(`link-${sectionId}`);
            if(activeLink) activeLink.classList.add('active-link');

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function toggleMenu() {
            document.getElementById('sidebar').classList.toggle('active');
        }

        function toggleTheme() {
            const body = document.body;
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            body.setAttribute('data-theme', newTheme);
            
            const themeBtnIcon = document.querySelector('.btn-theme i');
            themeBtnIcon.className = newTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        }

        function changeLanguage() {
            const lang = document.getElementById('langSelect').value;
            const texts = i18n[lang];

            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (texts[key]) el.textContent = texts[key];
            });

            document.querySelectorAll('[data-i18n-ph]').forEach(el => {
                const key = el.getAttribute('data-i18n-ph');
                if (texts[key]) el.placeholder = texts[key];
            });
        }

        function checkUserSession() {
            const activeUser = JSON.parse(localStorage.getItem('innovasoft_user'));
            const authFormsView = document.getElementById('authFormsView');
            const userProfileView = document.getElementById('userProfileView');

            if (activeUser) {
                authFormsView.style.display = 'none';
                userProfileView.style.display = 'block';

                document.getElementById('profileName').textContent = activeUser.nombre || 'Usuario Registrado';
                document.getElementById('profileEmail').textContent = activeUser.email;
                document.getElementById('profileReqs').textContent = activeUser.requerimientos || 'Ninguno registrado';
                
                const surveyEmailInput = document.getElementById('surveyEmail');
                if(surveyEmailInput) surveyEmailInput.value = activeUser.email;

                // Iniciar contador de inactividad
                resetInactivityTimer();
            } else {
                authFormsView.style.display = 'block';
                userProfileView.style.display = 'none';
                clearTimeout(inactivityTimer);
            }
        }

        function handleRegister(e) {
            e.preventDefault();
            const name = document.getElementById('regName').value;
            const email = document.getElementById('regEmail').value;

            if (!esCorreoValido(email)) {
                alert('Error de Seguridad: Debes ingresar una dirección válida con @ que termine en @gmail.com, @hotmail.com o @outlook.com');
                return;
            }

            const user = { nombre: name, email: email, requerimientos: '' };
            localStorage.setItem('innovasoft_user', JSON.stringify(user));

            saveToExcelSheet('REGISTRO_USUARIO', user);
            alert(`¡Registro exitoso! Bienvenido ${name}. Ahora puedes realizar tus compras.`);
            checkUserSession();
            showSection('servicios');
        }

        function handleLogin(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            
            if (!esCorreoValido(email)) {
                alert('Error de Acceso: El usuario ingresado debe poseer @ y finalizar obligatoriamente en @gmail.com, @hotmail.com o @outlook.com');
                return;
            }

            const existingUser = JSON.parse(localStorage.getItem('innovasoft_user')) || {};
            const user = { 
                nombre: existingUser.nombre || email.split('@')[0], 
                email: email, 
                requerimientos: existingUser.requerimientos || '' 
            };

            localStorage.setItem('innovasoft_user', JSON.stringify(user));

            saveToExcelSheet('INICIO_SESION', { email: email });
            alert(`Bienvenido de nuevo ${user.nombre}`);
            checkUserSession();
        }

        function logout() {
            localStorage.removeItem('innovasoft_user');
            clearTimeout(inactivityTimer);
            checkUserSession();
            showAuthMode('login');
        }

        function handleSurveySubmit(e) {
            e.preventDefault();
            const email = document.getElementById('surveyEmail').value;
            
            if (!esCorreoValido(email)) {
                alert('Ingresa un correo válido que termine en @gmail.com, @hotmail.com o @outlook.com para enviar la propuesta.');
                return;
            }

            const checkedBoxes = document.querySelectorAll('#reqForm input[type="checkbox"]:checked');
            
            if(checkedBoxes.length === 0) {
                alert('Por favor selecciona al menos un requerimiento.');
                return;
            }

            let basePrice = 200;
            let selectedReqs = [];

            checkedBoxes.forEach(cb => {
                selectedReqs.push(cb.value);
                basePrice += parseInt(cb.getAttribute('data-price') || 0);
            });

            const comments = document.getElementById('comments').value;

            let activeUser = JSON.parse(localStorage.getItem('innovasoft_user'));
            if(activeUser) {
                activeUser.requerimientos = selectedReqs.join(', ');
                localStorage.setItem('innovasoft_user', JSON.stringify(activeUser));
                checkUserSession();
            }

            saveToExcelSheet('ENCUESTA_REQUERIMIENTOS', {
                email: email,
                requerimientos: selectedReqs.join(', '),
                detalles: comments,
                precioCalculado: basePrice
            });

            const container = document.getElementById('customPackageContainer');
            container.innerHTML = `
                <div class="card custom-package-card" style="margin-bottom: 2rem;">
                    <span style="background:var(--primary); color:white; padding:3px 10px; border-radius:12px; font-size:0.8rem; font-weight:bold;">COTIZACIÓN A MEDIDA</span>
                    <h3 style="margin-top:0.5rem;">Paquete Personalizado para ${email}</h3>
                    <p><strong>Incluye:</strong> ${selectedReqs.join(', ')}</p>
                    <p><em>Nota: ${comments || 'Sin comentarios adicionales.'}</em></p>
                    <h4 style="margin: 1rem 0; font-size: 1.5rem; color: var(--primary);">$${basePrice} USD</h4>
                    <button class="btn-cta" onclick="prepareCheckout('Paquete Personalizado (${selectedReqs.length} requisitos)', ${basePrice})">Contratar Mi Paquete a Medida</button>
                </div>
            `;

            alert('¡Paquete de Requerimientos generado con éxito!');
            showSection('servicios');
        }

        let selectedProduct = { title: '', price: 0 };

        function prepareCheckout(title, price) {
            const activeUser = JSON.parse(localStorage.getItem('innovasoft_user'));
            if (!activeUser) {
                alert('Debes registrarte o iniciar sesión para poder comprar.');
                showAuthMode('login');
                return;
            }

            selectedProduct = { title, price };
            document.getElementById('checkoutPackageInfo').innerHTML = `<strong>Servicio seleccionado:</strong> ${title} — <strong>$${price} USD</strong>`;
            showSection('checkout');
        }

        function processPayment(e) {
            e.preventDefault();
            const name = document.getElementById('payName').value;
            const cardNum = document.getElementById('cardNumberInput').value;
            
            if (!esTarjetaValida(cardNum)) {
                alert('Error en el Pago: La tarjeta de crédito debe poseer únicamente números y tener exactamente 16 dígitos requeridos.');
                return;
            }

            document.getElementById('ticketClient').textContent = name;
            document.getElementById('ticketService').textContent = selectedProduct.title || "Servicio INNOVASOFT";
            document.getElementById('ticketPrice').textContent = selectedProduct.price || "0";
            document.getElementById('ticketDate').textContent = new Date().toLocaleString();
            document.getElementById('ticket').style.display = 'block';

            saveToExcelSheet('COMPRA_REALIZADA', {
                cliente: name,
                servicio: selectedProduct.title,
                monto: selectedProduct.price
            });
        }

        window.onload = function() {
            checkUserSession();
        };