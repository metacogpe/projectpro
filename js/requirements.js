// 요구사항 관리 페이지 초기화
(function() {
    console.log('요구사항 관리 페이지 초기화');
    
    // 요소 참조
    let requirementTableBody = document.getElementById('requirements-table-body');
    const newRequirementBtn = document.getElementById('new-requirement-btn');
    const requirementModal = document.getElementById('requirement-modal');
    const requirementForm = document.getElementById('requirement-form');
    const projectSelectEl = document.getElementById('project');
    const cancelBtn = document.getElementById('cancel-btn');
    const submitBtn = document.getElementById('submit-btn');
    const editMode = document.getElementById('edit-mode');
    const originalId = document.getElementById('original-id');
    
    console.log('테이블 요소 참조:', requirementTableBody);
    console.log('모달 요소 참조:', requirementModal);
    console.log('폼 요소 참조:', requirementForm);
    
    // 프로젝트 드롭다운 로드
    function loadProjectDropdown() {
        console.log('프로젝트 드롭다운 로드');
        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        
        if (projects.length === 0) {
            console.log('프로젝트가 없어 초기 데이터 설정');
            const initialProjects = [
                { name: '프로젝트 A', dueDate: '2025-12-31', status: '진행 중', description: '웹 애플리케이션 개발' },
                { name: '프로젝트 B', dueDate: '2025-06-30', status: '계획', description: '모바일 앱 런칭' },
                { name: '프로젝트 C', dueDate: '2025-09-15', status: '진행 중', description: '인공지능 분석 시스템 개발' },
                { name: '프로젝트 D', dueDate: '2026-02-28', status: '계획', description: '클라우드 서비스 플랫폼 구축' },
                { name: '프로젝트 E', dueDate: '2025-03-31', status: '완료', description: '사내 그룹웨어 마이그레이션' }
            ];
            localStorage.setItem('projects', JSON.stringify(initialProjects));
            projects = initialProjects;
        }
        
        // 모달 프로젝트 드롭다운
        if (projectSelectEl) {
            projectSelectEl.innerHTML = '';
            projects.forEach(project => {
                const option = document.createElement('option');
                option.value = project.name;
                option.textContent = project.name;
                projectSelectEl.appendChild(option);
            });
        } else {
            console.error('프로젝트 선택 요소를 찾을 수 없습니다');
        }
    }
    
    // 요구사항 데이터 초기화
    function initializeRequirements() {
        console.log('initializeRequirements 함수 실행');
        const requirements = localStorage.getItem('requirements');
        console.log('현재 localStorage의 requirements:', requirements);
        
        if (!requirements) {
            console.log('요구사항 초기 데이터 설정');
            const initialRequirements = [
                { id: 'REQ-001', name: '사용자 로그인 및 인증 시스템', project: '프로젝트 A', priority: '높음', status: '검토 중', description: '사용자 인증 및 권한 관리를 위한 시스템 구현' },
                { id: 'REQ-002', name: '대시보드 데이터 시각화', project: '프로젝트 A', priority: '중간', status: '승인됨', description: '프로젝트 현황을 시각적으로 표현하는 대시보드 구현' },
                { id: 'REQ-003', name: '다크 모드 지원', project: '프로젝트 B', priority: '낮음', status: '신규', description: '사용자 인터페이스에 다크 모드 테마 지원' }
            ];
            localStorage.setItem('requirements', JSON.stringify(initialRequirements));
            console.log('설정된 초기 데이터:', JSON.stringify(initialRequirements));
        }
    }
    
    // 요구사항 테이블 렌더링
    function renderRequirements() {
        console.log('요구사항 테이블 렌더링');
        const requirements = JSON.parse(localStorage.getItem('requirements')) || [];
        console.log('로드된 요구사항 데이터:', requirements);
        console.log('요구사항 데이터 개수:', requirements.length);
        
        // 테이블 요소 재확인
        if (!requirementTableBody) {
            console.error('테이블 본문 요소를 찾을 수 없습니다.');
            requirementTableBody = document.getElementById('requirements-table-body');
            console.log('다시 찾은 테이블 요소 (ID):', requirementTableBody);
            
            if (!requirementTableBody) {
                requirementTableBody = document.querySelector('tbody');
                console.log('다시 찾은 테이블 요소 (querySelector):', requirementTableBody);
            }
            
            if (!requirementTableBody) return;
        }
        
        // 테이블 비우기
        requirementTableBody.innerHTML = '';
        
        if (requirements.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                    요구사항이 없습니다.
                </td>
            `;
            requirementTableBody.appendChild(emptyRow);
            return;
        }
        
        // 요구사항 행 생성
        requirements.forEach((req, index) => {
            const priorityClass = 
                req.priority === '높음' ? 'text-red-600' : 
                req.priority === '중간' ? 'text-yellow-500' : 'text-green-500';
            
            const statusClass = 
                req.status === '승인됨' ? 'status-completed' : 
                req.status === '검토 중' ? 'status-progress' : 'status-planned';
            
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50';
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${req.id}</td>
                <td class="px-6 py-4 text-sm font-medium text-gray-900">${req.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${req.project}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm ${priorityClass} font-medium">${req.priority}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span class="${statusClass}">${req.status}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button class="edit-btn text-blue-600 hover:text-blue-800 mr-3" data-index="${index}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button class="delete-btn text-red-500 hover:text-red-700" data-index="${index}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </td>
            `;
            requirementTableBody.appendChild(row);
        });
        
        // 수정 버튼 이벤트 추가
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                editRequirement(index);
            });
        });
        
        // 삭제 버튼 이벤트 추가
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                deleteRequirement(index);
            });
        });
    }
    
    // 요구사항 수정 함수
    function editRequirement(index) {
        const requirements = JSON.parse(localStorage.getItem('requirements')) || [];
        const req = requirements[index];
        
        if (req) {
            // 모달 설정
            document.getElementById('modal-title').textContent = '요구사항 수정';
            document.getElementById('submit-btn').textContent = '저장';
            editMode.value = 'true';
            originalId.value = req.id;
            
            // 폼 값 설정
            document.getElementById('name').value = req.name;
            document.getElementById('project').value = req.project;
            document.getElementById('priority').value = req.priority;
            document.getElementById('status').value = req.status;
            document.getElementById('description').value = req.description || '';
            
            // 모달 열기
            requirementModal.classList.add('open');
        }
    }
    
    // 요구사항 삭제 함수
    function deleteRequirement(index) {
        const requirements = JSON.parse(localStorage.getItem('requirements')) || [];
        const req = requirements[index];
        
        if (req && confirm(`"${req.name}" 요구사항을 삭제하시겠습니까?`)) {
            requirements.splice(index, 1);
            localStorage.setItem('requirements', JSON.stringify(requirements));
            renderRequirements();
        }
    }
    
    // 새 요구사항 ID 생성 함수
    function generateRequirementId() {
        const requirements = JSON.parse(localStorage.getItem('requirements')) || [];
        let maxId = 0;
        
        requirements.forEach(req => {
            const idNum = parseInt(req.id.split('-')[1]);
            if (idNum > maxId) {
                maxId = idNum;
            }
        });
        
        return `REQ-${String(maxId + 1).padStart(3, '0')}`;
    }
    
    // 이벤트 리스너
    if (newRequirementBtn) {
        newRequirementBtn.addEventListener('click', function() {
            // 모달 초기화
            requirementForm.reset();
            document.getElementById('modal-title').textContent = '요구사항 추가';
            document.getElementById('submit-btn').textContent = '추가';
            editMode.value = 'false';
            
            // 모달 열기
            requirementModal.classList.add('open');
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            requirementModal.classList.remove('open');
        });
    }
    
    if (requirementForm) {
        requirementForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const requirements = JSON.parse(localStorage.getItem('requirements')) || [];
            const isEditMode = editMode.value === 'true';
            
            const requirementData = {
                name: document.getElementById('name').value,
                project: document.getElementById('project').value,
                priority: document.getElementById('priority').value,
                status: document.getElementById('status').value,
                description: document.getElementById('description').value
            };
            
            if (isEditMode) {
                // 수정 모드
                const originalReqId = originalId.value;
                const index = requirements.findIndex(req => req.id === originalReqId);
                
                if (index !== -1) {
                    requirementData.id = originalReqId;
                    requirements[index] = requirementData;
                }
            } else {
                // 추가 모드
                requirementData.id = generateRequirementId();
                requirements.push(requirementData);
            }
            
            localStorage.setItem('requirements', JSON.stringify(requirements));
            
            // 모달 닫기 및 테이블 갱신
            requirementModal.classList.remove('open');
            renderRequirements();
        });
    }
    
    // 초기화
    console.log('초기화 시작');
    
    // localStorage 초기화 (테스트용)
    // localStorage.removeItem('requirements');
    
    // 강제로 초기 데이터 설정
    if (true) {
        console.log('요구사항 초기 데이터 설정 (강제)');
        const initialRequirements = [
            { id: 'REQ-001', name: '사용자 로그인 및 인증 시스템', project: '프로젝트 A', priority: '높음', status: '검토 중', description: '사용자 인증 및 권한 관리를 위한 시스템 구현' },
            { id: 'REQ-002', name: '대시보드 데이터 시각화', project: '프로젝트 A', priority: '중간', status: '승인됨', description: '프로젝트 현황을 시각적으로 표현하는 대시보드 구현' },
            { id: 'REQ-003', name: '다크 모드 지원', project: '프로젝트 B', priority: '낮음', status: '신규', description: '사용자 인터페이스에 다크 모드 테마 지원' }
        ];
        localStorage.setItem('requirements', JSON.stringify(initialRequirements));
        console.log('설정된 초기 데이터:', JSON.stringify(initialRequirements));
    }
    
    console.log('요구사항 데이터:', localStorage.getItem('requirements'));
    
    // 초기화 함수 호출
    initializeRequirements();
    loadProjectDropdown();
    
    // DOM 완전이 로드된 후 테이블 렌더링
    window.addEventListener('DOMContentLoaded', function() {
        console.log('DOM fully loaded');
        renderRequirements();
    });
})();
