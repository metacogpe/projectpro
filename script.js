document.addEventListener('DOMContentLoaded', function() {
    // localStorage 초기 데이터 설정
    initializeLocalStorage();
    
    // 사이드바 로드
    loadSidebar();
    
    // 초기 페이지 로드 (URL 해시 기반 또는 기본값)
    const initialPage = window.location.hash ? window.location.hash.substring(1) : 'dashboard-content.html';
    loadPage(initialPage);
    
    // 요소 참조
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const menuToggle = document.getElementById('menu-toggle');
    
    // 사이드바 토글 기능
    function toggleSidebar() {
        sidebar.classList.toggle('-translate-x-full');
        overlay.classList.toggle('hidden');
    }
    
    // 메뉴 토글 이벤트 리스너
    menuToggle.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', toggleSidebar);
    
    // localStorage 초기 데이터 설정 함수
    function initializeLocalStorage() {
        // 프로젝트 초기화
        if (!localStorage.getItem('projects')) {
            const initialProjects = [
                { name: '프로젝트 A', dueDate: '2025-12-31', status: '진행 중', description: '웹 애플리케이션 개발' },
                { name: '프로젝트 B', dueDate: '2025-06-30', status: '계획', description: '모바일 앱 런칭' },
                { name: '프로젝트 C', dueDate: '2025-09-15', status: '진행 중', description: '인공지능 분석 시스템 개발' },
                { name: '프로젝트 D', dueDate: '2026-02-28', status: '계획', description: '클라우드 서비스 플랫폼 구축' },
                { name: '프로젝트 E', dueDate: '2025-03-31', status: '완료', description: '사내 그룹웨어 마이그레이션' }
            ];
            localStorage.setItem('projects', JSON.stringify(initialProjects));
        }
        
        // 마일스톤 초기화
        if (!localStorage.getItem('milestones')) {
            const initialMilestones = [
                { project: '프로젝트 A', name: '초기 설계 완료', date: '2025-03-01', status: '완료', description: '시스템 아키텍처 설계' },
                { project: '프로젝트 A', name: '프로토타입 개발', date: '2025-06-01', status: '진행 중', description: 'UI/UX 프로토타입' },
                { project: '프로젝트 B', name: '시장 조사', date: '2025-02-15', status: '예정', description: '사용자 요구 분석' },
                { project: '프로젝트 C', name: '기술 타당성 분석', date: '2025-04-15', status: '완료', description: 'AI 모델 선정 및 타당성 분석' },
                { project: '프로젝트 A', name: '베타 버전 개발', date: '2025-09-15', status: '예정', description: '베타 버전 개발 및 테스트' },
                { project: '프로젝트 C', name: '알고리즘 구현', date: '2025-06-30', status: '진행 중', description: '기계학습 알고리즘 구현' },
                { project: '프로젝트 D', name: '요구사항 정의', date: '2025-10-01', status: '예정', description: '플랫폼 요구사항 정의 및 분석' },
                { project: '프로젝트 B', name: '디자인 완료', date: '2025-04-30', status: '예정', description: '앱 UI/UX 디자인 완료' },
                { project: '프로젝트 E', name: '시스템 마이그레이션', date: '2025-02-28', status: '완료', description: '기존 시스템에서 새로운 시스템으로 마이그레이션' },
                { project: '프로젝트 E', name: '사용자 교육', date: '2025-03-15', status: '완료', description: '새로운 시스템 사용법 교육' },
                { project: '프로젝트 D', name: '아키텍처 설계', date: '2025-12-01', status: '예정', description: '클라우드 아키텍처 설계 및 검증' }
            ];
            localStorage.setItem('milestones', JSON.stringify(initialMilestones));
        }
        
        // 산출물 초기화
        if (!localStorage.getItem('deliverables')) {
            const initialDeliverables = [
                { project: '프로젝트 A', name: '설계 문서', date: '2025-03-01', status: '완료', description: '시스템 아키텍처 문서' },
                { project: '프로젝트 A', name: '프로토타입 UI', date: '2025-06-01', status: '진행 중', description: '초기 UI 디자인' },
                { project: '프로젝트 B', name: '시장 조사 보고서', date: '2025-02-15', status: '예정', description: '사용자 요구사항 보고서' }
            ];
            localStorage.setItem('deliverables', JSON.stringify(initialDeliverables));
        }
        
        // 태스크 초기화
        if (!localStorage.getItem('tasks')) {
            const initialTasks = [
                { id: 1, name: '데이터베이스 설계', project: '프로젝트 A', dueDate: '2025-04-15', status: '완료', assignee: '홍길동', description: '데이터베이스 스키마 및 ERD 설계' },
                { id: 2, name: '프론트엔드 개발', project: '프로젝트 A', dueDate: '2025-07-20', status: '진행 중', assignee: '김철수', description: 'React 기반 프론트엔드 개발' },
                { id: 3, name: '앱 디자인', project: '프로젝트 B', dueDate: '2025-03-10', status: '예정', assignee: '이영희', description: '모바일 앱 UI/UX 디자인' },
                { id: 4, name: '백엔드 API 개발', project: '프로젝트 A', dueDate: '2025-05-25', status: '진행 중', assignee: '김지원', description: 'REST API 개발 및 문서화' },
                { id: 5, name: '사용자 테스트', project: '프로젝트 A', dueDate: '2025-08-15', status: '예정', assignee: '박수진', description: '실제 사용자를 대상으로 한 앱 테스트 진행' },
                { id: 6, name: '마케팅 전략 수립', project: '프로젝트 B', dueDate: '2025-04-01', status: '완료', assignee: '이민호', description: '모바일 앱 출시를 위한 마케팅 전략 수립' },
                { id: 7, name: '기능 개선', project: '프로젝트 A', dueDate: '2025-09-10', status: '예정', assignee: '김철수', description: '사용자 피드백을 반영한 기능 개선' },
                { id: 8, name: '앱 출시 준비', project: '프로젝트 B', dueDate: '2025-05-30', status: '진행 중', assignee: '박수진', description: '앱 스토어 등록 및 출시 업무 준비' },
                { id: 9, name: '코드 리뷰', project: '프로젝트 A', dueDate: '2025-06-15', status: '예정', assignee: '홍길동', description: '코드 품질 향상을 위한 코드 리뷰 진행' },
                { id: 10, name: '사용자 인터뷰', project: '프로젝트 B', dueDate: '2025-02-20', status: '완료', assignee: '이영희', description: '사용자 요구사항 분석을 위한 인터뷰 진행' },
                { id: 11, name: '성능 최적화', project: '프로젝트 A', dueDate: '2025-07-05', status: '예정', assignee: '김지원', description: '웹 서비스 성능 최적화 작업' },
                { id: 12, name: '빌링 시스템 구현', project: '프로젝트 A', dueDate: '2025-08-01', status: '예정', assignee: '김지원', description: '사용자 청구 및 결제 시스템 구현' }
            ];
            localStorage.setItem('tasks', JSON.stringify(initialTasks));
        }
    }
    
    // 사이드바 로드 함수
    async function loadSidebar() {
        try {
            const response = await fetch('sidebar.html');
            if (!response.ok) throw new Error(`HTTP error ${response.status}`);
            const html = await response.text();
            
            // 사이드바 컨테이너에 HTML 삽입
            const sidebarContainer = document.getElementById('sidebar-container');
            const parser = new DOMParser();
            const sidebarDoc = parser.parseFromString(html, 'text/html');
            const sidebarContent = sidebarDoc.querySelector('.sidebar-container');
            
            if (sidebarContent) {
                sidebarContainer.innerHTML = sidebarContent.innerHTML;
                
                // 사이드바 스타일 추가
                const styles = sidebarDoc.querySelectorAll('head > style');
                styles.forEach(style => {
                    const styleId = 'sidebar-style';
                    const existingStyle = document.getElementById(styleId);
                    if (existingStyle) existingStyle.remove();
                    
                    const newStyle = style.cloneNode(true);
                    newStyle.id = styleId;
                    document.head.appendChild(newStyle);
                });
                
                // 메뉴 아이템 이벤트 리스너 등록
                setupMenuListeners();
                
                // 현재 페이지에 맞는 메뉴 아이템 활성화
                const currentPage = document.getElementById('main-content-container').getAttribute('data-current-page');
                activateMenuItem(currentPage);
            }
        } catch (error) {
            console.error('사이드바 로드 오류:', error);
        }
    }
    
    // 페이지 콘텐츠 로드 함수
    async function loadContent(url) {
        try {
            console.log(`로드 시작: ${url}`);
            const mainContentContainer = document.getElementById('main-content-container');
            mainContentContainer.setAttribute('data-current-page', url);
            
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error ${response.status}`);
            const html = await response.text();
            
            // HTML 파싱
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // body 내용 추출
            const bodyContent = doc.querySelector('body');
            if (bodyContent) {
                // style 태그 추출 및 적용
                const styles = doc.querySelectorAll('head > style');
                styles.forEach(style => {
                    // 중복 방지를 위한 ID 부여
                    const styleId = `content-style-${url.replace(/\./g, '-')}`;
                    // 기존 스타일 제거
                    const existingStyle = document.getElementById(styleId);
                    if (existingStyle) {
                        existingStyle.remove();
                    }
                    // 새 스타일 추가
                    const newStyle = style.cloneNode(true);
                    newStyle.id = styleId;
                    document.head.appendChild(newStyle);
                });
                
                // 내용 삽입
                mainContentContainer.innerHTML = bodyContent.innerHTML;
                
                // 각 페이지별 스크립트 파일 로드
                await loadPageScript(url);
                
                // 메뉴 아이템 활성화
                activateMenuItem(url);
                
                console.log(`페이지 로드 완료: ${url}`);
                return true;
            } else {
                throw new Error('페이지 콘텐츠를 찾을 수 없습니다');
            }
        } catch (error) {
            console.error('페이지 로드 오류:', error);
            showErrorMessage(url);
            return false;
        }
    }
    
    // 페이지별 스크립트 로드 함수
    async function loadPageScript(url) {
        const scriptMapping = {
            'milestones-content.html': 'js/milestones.js',
            'deliverables-content.html': 'js/deliverables.js',
            'projects-content.html': 'js/projects.js',
            'tasks-content.html': 'js/tasks.js',
            'dashboard-content.html': 'js/dashboard.js',
            'requirements-content.html': 'js/requirements.js'
        };
        
        // URL에 해당하는 스크립트 파일이 있으면 로드
        if (scriptMapping[url]) {
            try {
                // 기존 스크립트 태그 제거
                const existingScript = document.getElementById(`script-${url}`);
                if (existingScript) {
                    existingScript.remove();
                }
                
                // 스크립트 태그 생성 및 로드
                const script = document.createElement('script');
                script.id = `script-${url}`;
                script.src = scriptMapping[url];
                script.async = true;
                
                // 스크립트 로드 완료 대기
                const scriptLoaded = new Promise((resolve, reject) => {
                    script.onload = resolve;
                    script.onerror = reject;
                });
                
                // 문서에 스크립트 태그 추가
                document.head.appendChild(script);
                
                // 스크립트 로드 완료 대기
                await scriptLoaded;
                console.log(`스크립트 로드 완료: ${scriptMapping[url]}`);
            } catch (error) {
                console.error('스크립트 로드 오류:', error);
                
                // 스크립트 로드 실패 시 인라인 스크립트 실행
                const scripts = document.querySelectorAll('script:not([src])');
                scripts.forEach(script => {
                    try {
                        eval(script.textContent);
                    } catch (e) {
                        console.error('인라인 스크립트 실행 오류:', e);
                    }
                });
            }
        } else {
            // URL에 해당하는 스크립트 파일이 없으면 인라인 스크립트 실행
            const scripts = document.querySelectorAll('script:not([src])');
            scripts.forEach(script => {
                try {
                    eval(script.textContent);
                } catch (e) {
                    console.error('인라인 스크립트 실행 오류:', e);
                }
            });
        }
    }
    
    // 오류 메시지 표시
    function showErrorMessage(url) {
        const mainContentContainer = document.getElementById('main-content-container');
        mainContentContainer.innerHTML = `
            <div class="flex flex-col items-center justify-center p-8 text-center min-h-[50vh]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h2 class="text-xl font-semibold text-gray-800 mb-2">콘텐츠 로드 오류</h2>
                <p class="text-gray-600 mb-4">${url} 페이지를 로드할 수 없습니다</p>
                <button id="reload-dashboard-btn" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all">
                    대시보드로 돌아가기
                </button>
            </div>
        `;
        
        // 대시보드로 돌아가기 버튼 이벤트
        document.getElementById('reload-dashboard-btn').addEventListener('click', function() {
            loadPage('dashboard-content.html');
        });
    }
    
    // 메뉴 아이템 활성화 함수
    function activateMenuItem(targetUrl) {
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-target') === targetUrl) {
                item.classList.add('active');
            }
        });
    }
    
    // 메뉴 아이템 클릭 이벤트 핸들러
    function handleMenuItemClick(e) {
        e.preventDefault();
        
        // 타겟 페이지 URL 가져오기
        const targetUrl = this.getAttribute('data-target');
        
        // 모바일에서 사이드바 닫기
        if (window.innerWidth < 768) {
            sidebar.classList.add('-translate-x-full');
            overlay.classList.add('hidden');
        }
        
        // 페이지 로드
        loadPage(targetUrl);
    }
    
    // 페이지 로드 및 URL 해시 업데이트 함수
    function loadPage(targetUrl) {
        // URL 해시 업데이트
        window.location.hash = targetUrl;
        
        // 콘텐츠 로드
        loadContent(targetUrl);
    }
    
    // 메뉴 아이템 이벤트 리스너 등록
    function setupMenuListeners() {
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', handleMenuItemClick);
        });
    }
    
    // 해시 변경 이벤트 리스너
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            loadContent(hash);
        }
    });
    
    // 화면 크기 변경 시 사이드바 상태 처리
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768) {
            // 데스크톱 모드에서는 항상 사이드바 표시
            sidebar.classList.remove('-translate-x-full');
            overlay.classList.add('hidden');
        }
    });
    
    // 날짜 포맷팅 함수 - 전역으로 사용 가능하도록 window에 추가
    window.formatDate = function(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('ko-KR', options);
    };
    
    // 페이지 스타일 추가
    const globalStyle = document.createElement('style');
    globalStyle.id = 'global-style';
    globalStyle.textContent = `
        /* 사이드바 스타일 */
        .sidebar {
            transition: transform 0.3s ease-in-out;
            height: auto;
        }
        
        @media (max-width: 768px) {
            .sidebar {
                transform: translateX(-100%);
            }
            .sidebar.open {
                transform: translateX(0);
            }
        }
        
        #sidebar-container {
            max-height: 100%;
            padding-bottom: 2rem;
        }
        
        /* 오버레이 스타일 */
        .overlay {
            transition: opacity 0.3s ease-in-out;
            opacity: 0;
            pointer-events: none;
        }
        
        .overlay.open {
            opacity: 1;
            pointer-events: auto;
        }
        
        /* 모달 스타일 */
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 100;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        }
        
        .modal.open {
            opacity: 1;
            pointer-events: auto;
        }
        
        .modal-content {
            background-color: white;
            padding: 2rem;
            border-radius: 0.5rem;
            width: 90%;
            max-width: 500px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
    `;
    document.head.appendChild(globalStyle);
});
