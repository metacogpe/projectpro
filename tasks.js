// 태스크 페이지 초기화
(function() {
    console.log('태스크 페이지 초기화');
    
    // 요소 참조
    const projectFilterEl = document.getElementById('project-filter');
    const tasksTableBody = document.getElementById('tasks-table-body');
    const newTaskBtn = document.getElementById('new-task-btn');
    const taskModal = document.getElementById('task-modal');
    const taskForm = document.getElementById('task-form');
    const projectSelectEl = document.getElementById('project');
    const cancelBtn = document.getElementById('cancel-btn');
    const modalTitle = document.getElementById('modal-title');
    const submitBtn = document.getElementById('submit-btn');
    const editMode = document.getElementById('edit-mode');
    const originalId = document.getElementById('original-id');
    
    // 프로젝트 드롭다운 로드
    function loadProjectDropdowns() {
        console.log('프로젝트 드롭다운 로드 시작');
        let projects = JSON.parse(localStorage.getItem('projects')) || [];
        
        // 프로젝트가 없는 경우 초기 데이터 설정
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
        
        console.log('프로젝트 수:', projects.length);
        
        // 필터 드롭다운
        if (projectFilterEl) {
            projectFilterEl.innerHTML = '<option value="all">모든 프로젝트</option>';
            projects.forEach(project => {
                const option = document.createElement('option');
                option.value = project.name;
                option.textContent = project.name;
                projectFilterEl.appendChild(option);
            });
        } else {
            console.error('프로젝트 필터 요소를 찾을 수 없습니다');
        }
        
        // 모달 드롭다운
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
    
    // 태스크 테이블 렌더링
    function renderTasks(projectFilter = 'all') {
        console.log('태스크 렌더링, 필터:', projectFilter);
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        
        console.log('localStorage에서 가져온 태스크 수:', tasks.length);
        
        // 태스크가 없는 경우 초기 데이터 설정
        if (tasks.length === 0) {
            console.log('태스크가 없어 초기 데이터 설정');
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
            return renderTasks(projectFilter); // 데이터 설정 후 재호출
        }
        
        // 날짜 기준 정렬
        tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        
        // 필터링
        const filteredTasks = projectFilter === 'all' 
            ? tasks 
            : tasks.filter(task => task.project === projectFilter);
        
        console.log('필터링된 태스크 수:', filteredTasks.length);
        
        // 테이블 비우기
        tasksTableBody.innerHTML = '';
        
        // 필터링된 태스크가 없을 경우
        if (filteredTasks.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                    ${projectFilter === 'all' ? '태스크가 없습니다.' : `'${projectFilter}' 프로젝트에 태스크가 없습니다.`}
                </td>
            `;
            tasksTableBody.appendChild(emptyRow);
            return;
        }
        
        // 태스크 행 생성
        filteredTasks.forEach(task => {
            const statusClass = 
                task.status === '완료' ? 'status-completed' : 
                task.status === '진행 중' ? 'status-progress' : 'status-planned';
            
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50 transition-all';
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${task.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${task.project}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDate(task.dueDate)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span class="${statusClass}">${task.status}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${task.assignee}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button class="edit-btn text-blue-600 hover:text-blue-800 mr-3" data-id="${task.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button class="delete-btn text-red-500 hover:text-red-700" data-id="${task.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </td>
            `;
            tasksTableBody.appendChild(row);
        });
        
        // 수정 버튼 이벤트 추가
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const taskId = parseInt(this.dataset.id);
                editTask(taskId);
            });
        });
        
        // 삭제 버튼 이벤트 추가
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const taskId = parseInt(this.dataset.id);
                deleteTask(taskId);
            });
        });
    }
    
    // 태스크 수정 함수
    function editTask(taskId) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const task = tasks.find(t => t.id === taskId);
        
        if (task) {
            // 모달 설정
            modalTitle.textContent = '태스크 수정';
            submitBtn.textContent = '저장';
            editMode.value = 'true';
            originalId.value = taskId;
            
            // 폼 값 설정
            document.getElementById('project').value = task.project;
            document.getElementById('name').value = task.name;
            document.getElementById('dueDate').value = task.dueDate;
            document.getElementById('status').value = task.status;
            document.getElementById('assignee').value = task.assignee;
            document.getElementById('description').value = task.description || '';
            
            // 모달 열기
            taskModal.classList.add('open');
        }
    }
    
    // 태스크 삭제 함수
    function deleteTask(taskId) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const task = tasks.find(t => t.id === taskId);
        
        if (task && confirm(`"${task.name}" 태스크를 삭제하시겠습니까?`)) {
            const updatedTasks = tasks.filter(t => t.id !== taskId);
            localStorage.setItem('tasks', JSON.stringify(updatedTasks));
            
            // 테이블 갱신
            renderTasks(projectFilterEl.value);
        }
    }
    
    // 새 태스크 ID 생성 함수
    function generateTaskId() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        return tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
    }
    
    // 이벤트 리스너
    if (newTaskBtn) {
        newTaskBtn.addEventListener('click', function() {
            // 모달 초기화
            taskForm.reset();
            modalTitle.textContent = '태스크 추가';
            submitBtn.textContent = '추가';
            editMode.value = 'false';
            
            // 모달 열기
            taskModal.classList.add('open');
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            taskModal.classList.remove('open');
        });
    }
    
    if (projectFilterEl) {
        projectFilterEl.addEventListener('change', function() {
            renderTasks(this.value);
        });
    }
    
    if (taskForm) {
        taskForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const isEditMode = editMode.value === 'true';
            
            const taskData = {
                name: document.getElementById('name').value,
                project: document.getElementById('project').value,
                dueDate: document.getElementById('dueDate').value,
                status: document.getElementById('status').value,
                assignee: document.getElementById('assignee').value,
                description: document.getElementById('description').value
            };
            
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            
            if (isEditMode) {
                // 수정 모드
                const taskId = parseInt(originalId.value);
                const index = tasks.findIndex(t => t.id === taskId);
                
                if (index !== -1) {
                    taskData.id = taskId;
                    tasks[index] = taskData;
                }
            } else {
                // 추가 모드
                taskData.id = generateTaskId();
                tasks.push(taskData);
            }
            
            localStorage.setItem('tasks', JSON.stringify(tasks));
            
            // 모달 닫기 및 테이블 갱신
            taskModal.classList.remove('open');
            renderTasks(projectFilterEl.value);
        });
    }
    
    // 초기화 실행
    console.log('태스크 페이지 초기화 완료');
    
    // localStorage 새로고침 (테스트용)
    // localStorage.removeItem('tasks');
    // localStorage.removeItem('projects');
    
    // 초기화 실행
    loadProjectDropdowns();
    renderTasks();
})();
