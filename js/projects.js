// 프로젝트 페이지 초기화
(function() {
    console.log('프로젝트 페이지 초기화');
    
    // 요소 참조
    const projectsTableBody = document.getElementById('projects-table-body');
    const newProjectBtn = document.getElementById('new-project-btn');
    const modalEl = document.getElementById('project-modal');
    const formEl = document.getElementById('project-form');
    const cancelBtn = document.getElementById('cancel-btn');
    const modalTitle = document.getElementById('modal-title');
    const submitBtn = document.getElementById('submit-btn');
    const editMode = document.getElementById('edit-mode');
    const originalName = document.getElementById('original-name');
    
    // 프로젝트 테이블 렌더링
    function renderProjects() {
        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        
        projectsTableBody.innerHTML = '';
        
        projects.forEach(project => {
            const statusClass = 
                project.status === '완료' ? 'status-completed' : 
                project.status === '진행 중' ? 'status-progress' : 'status-planned';
            
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50';
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${project.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDate(project.dueDate)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span class="${statusClass}">${project.status}</span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">${project.description || ''}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button class="edit-btn text-blue-600 hover:text-blue-800 mr-3" data-project="${project.name}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button class="delete-btn text-red-500 hover:text-red-700" data-project="${project.name}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </td>
            `;
            projectsTableBody.appendChild(row);
        });
        
        // 수정 버튼 이벤트 추가
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const projectName = this.dataset.project;
                editProject(projectName);
            });
        });
        
        // 삭제 버튼 이벤트 추가
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const projectName = this.dataset.project;
                deleteProject(projectName);
            });
        });
    }
    
    // 프로젝트 수정 함수
    function editProject(projectName) {
        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        const project = projects.find(p => p.name === projectName);
        
        if (project) {
            // 모달 설정
            modalTitle.textContent = '프로젝트 수정';
            submitBtn.textContent = '저장';
            editMode.value = 'true';
            originalName.value = projectName;
            
            // 폼 값 설정
            document.getElementById('name').value = project.name;
            document.getElementById('dueDate').value = project.dueDate;
            document.getElementById('status').value = project.status;
            document.getElementById('description').value = project.description || '';
            
            // 모달 열기
            modalEl.classList.add('open');
        }
    }
    
    // 프로젝트 삭제 함수
    function deleteProject(projectName) {
        if (confirm(`"${projectName}" 프로젝트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
            const projects = JSON.parse(localStorage.getItem('projects')) || [];
            const updatedProjects = projects.filter(p => p.name !== projectName);
            localStorage.setItem('projects', JSON.stringify(updatedProjects));
            
            // 연결된 마일스톤 및 산출물 삭제
            deleteRelatedItems(projectName);
            
            // 테이블 갱신
            renderProjects();
        }
    }
    
    // 연결된 마일스톤 및 산출물 삭제
    function deleteRelatedItems(projectName) {
        // 마일스톤 삭제
        const milestones = JSON.parse(localStorage.getItem('milestones')) || [];
        const updatedMilestones = milestones.filter(m => m.project !== projectName);
        localStorage.setItem('milestones', JSON.stringify(updatedMilestones));
        
        // 산출물 삭제
        const deliverables = JSON.parse(localStorage.getItem('deliverables')) || [];
        const updatedDeliverables = deliverables.filter(d => d.project !== projectName);
        localStorage.setItem('deliverables', JSON.stringify(updatedDeliverables));
        
        // 태스크 삭제
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const updatedTasks = tasks.filter(t => t.project !== projectName);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }
    
    // 이벤트 리스너
    if (newProjectBtn) {
        newProjectBtn.addEventListener('click', function() {
            // 모달 초기화
            formEl.reset();
            modalTitle.textContent = '프로젝트 추가';
            submitBtn.textContent = '추가';
            editMode.value = 'false';
            
            // 모달 열기
            modalEl.classList.add('open');
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            modalEl.classList.remove('open');
        });
    }
    
    if (formEl) {
        formEl.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const isEditMode = editMode.value === 'true';
            
            const projectData = {
                name: document.getElementById('name').value,
                dueDate: document.getElementById('dueDate').value,
                status: document.getElementById('status').value,
                description: document.getElementById('description').value
            };
            
            const projects = JSON.parse(localStorage.getItem('projects')) || [];
            
            if (isEditMode) {
                // 수정 모드
                const oldName = originalName.value;
                const index = projects.findIndex(p => p.name === oldName);
                
                if (index !== -1) {
                    projects[index] = projectData;
                    
                    // 프로젝트 이름이 변경된 경우 관련 마일스톤 및 산출물 업데이트
                    if (oldName !== projectData.name) {
                        updateRelatedItems(oldName, projectData.name);
                    }
                }
            } else {
                // 추가 모드
                // 중복 이름 체크
                if (projects.some(p => p.name === projectData.name)) {
                    alert('이미 존재하는 프로젝트 이름입니다. 다른 이름을 입력해주세요.');
                    return;
                }
                
                projects.push(projectData);
            }
            
            localStorage.setItem('projects', JSON.stringify(projects));
            
            // 모달 닫기 및 테이블 갱신
            modalEl.classList.remove('open');
            renderProjects();
        });
    }
    
    // 관련 마일스톤 및 산출물 업데이트
    function updateRelatedItems(oldName, newName) {
        // 마일스톤 업데이트
        const milestones = JSON.parse(localStorage.getItem('milestones')) || [];
        milestones.forEach(m => {
            if (m.project === oldName) {
                m.project = newName;
            }
        });
        localStorage.setItem('milestones', JSON.stringify(milestones));
        
        // 산출물 업데이트
        const deliverables = JSON.parse(localStorage.getItem('deliverables')) || [];
        deliverables.forEach(d => {
            if (d.project === oldName) {
                d.project = newName;
            }
        });
        localStorage.setItem('deliverables', JSON.stringify(deliverables));
        
        // 태스크 업데이트
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(t => {
            if (t.project === oldName) {
                t.project = newName;
            }
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    // 초기화 실행
    renderProjects();
})();
