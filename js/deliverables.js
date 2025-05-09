// 산출물 페이지 초기화
(function() {
    console.log('산출물 페이지 초기화');
    
    // 요소 참조
    const projectFilterEl = document.getElementById('project-filter');
    const timelineEl = document.getElementById('deliverable-timeline');
    const newDeliverableBtn = document.getElementById('new-deliverable-btn');
    const modalEl = document.getElementById('deliverable-modal');
    const formEl = document.getElementById('deliverable-form');
    const projectSelectEl = document.getElementById('project');
    const cancelBtn = document.getElementById('cancel-btn');
    
    // 프로젝트 드롭다운 로드
    function loadProjectDropdowns() {
        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        
        // 필터 드롭다운
        projectFilterEl.innerHTML = '<option value="all">모든 프로젝트</option>';
        projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.name;
            option.textContent = project.name;
            projectFilterEl.appendChild(option);
        });
        
        // 모달 드롭다운
        projectSelectEl.innerHTML = '';
        projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.name;
            option.textContent = project.name;
            projectSelectEl.appendChild(option);
        });
    }
    
    // 타임라인 렌더링
    function renderTimeline(projectFilter = 'all') {
        const deliverables = JSON.parse(localStorage.getItem('deliverables')) || [];
        
        // 날짜 기준 정렬
        deliverables.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // 필터링
        const filteredDeliverables = projectFilter === 'all' 
            ? deliverables 
            : deliverables.filter(d => d.project === projectFilter);
        
        // 타임라인 렌더링
        timelineEl.innerHTML = '';
        
        if (filteredDeliverables.length === 0) {
            timelineEl.innerHTML = '<div class="text-gray-500 py-4">해당 프로젝트에 산출물이 없습니다.</div>';
            return;
        }
        
        filteredDeliverables.forEach((deliverable, index) => {
            const statusClass = deliverable.status === '완료' 
                ? 'status-completed' 
                : deliverable.status === '진행 중' 
                    ? 'status-progress' 
                    : 'status-planned';
            
            const item = document.createElement('div');
            item.className = 'deliverable-item bg-white p-4 rounded-md shadow-md hover:translate-y-[-2px] transition-all mb-5';
            item.innerHTML = `
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="font-semibold text-gray-900 text-base">${deliverable.name}</h3>
                        <p class="text-sm text-gray-600">${deliverable.project} · ${formatDate(deliverable.date)}</p>
                        <p class="text-sm ${statusClass} font-medium mt-1">${deliverable.status}</p>
                        <p class="text-sm text-gray-600 mt-3">${deliverable.description || ''}</p>
                    </div>
                    <button class="delete-btn text-red-500 hover:text-red-700" data-index="${index}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            `;
            timelineEl.appendChild(item);
        });
        
        // 삭제 버튼 이벤트 추가
        document.querySelectorAll('.delete-btn').forEach((btn, idx) => {
            btn.addEventListener('click', function() {
                const deliverables = JSON.parse(localStorage.getItem('deliverables')) || [];
                const index = parseInt(this.dataset.index);
                const deliverable = filteredDeliverables[index];
                
                if (confirm(`"${deliverable.name}" 산출물을 삭제하시겠습니까?`)) {
                    // 원래 배열에서 해당 산출물 찾기
                    const originalIndex = deliverables.findIndex(d => 
                        d.project === deliverable.project && 
                        d.name === deliverable.name && 
                        d.date === deliverable.date
                    );
                    
                    if (originalIndex > -1) {
                        deliverables.splice(originalIndex, 1);
                        localStorage.setItem('deliverables', JSON.stringify(deliverables));
                        renderTimeline(projectFilterEl.value);
                    }
                }
            });
        });
    }
    
    // 이벤트 리스너
    if (newDeliverableBtn) {
        newDeliverableBtn.addEventListener('click', function() {
            formEl.reset();
            modalEl.classList.add('open');
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            modalEl.classList.remove('open');
        });
    }
    
    if (projectFilterEl) {
        projectFilterEl.addEventListener('change', function() {
            renderTimeline(this.value);
        });
    }
    
    if (formEl) {
        formEl.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newDeliverable = {
                project: projectSelectEl.value,
                name: document.getElementById('name').value,
                date: document.getElementById('date').value,
                status: document.getElementById('status').value,
                description: document.getElementById('description').value
            };
            
            const deliverables = JSON.parse(localStorage.getItem('deliverables')) || [];
            deliverables.push(newDeliverable);
            localStorage.setItem('deliverables', JSON.stringify(deliverables));
            
            modalEl.classList.remove('open');
            renderTimeline(projectFilterEl.value);
        });
    }
    
    // 초기화 실행
    loadProjectDropdowns();
    renderTimeline();
})();
