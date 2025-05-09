// 대시보드 페이지 초기화
(function() {
    console.log('대시보드 페이지 초기화');
    
    // 통계 데이터 로드 및 표시
    function loadDashboardStats() {
        // 프로젝트 수
        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        const projectCount = projects.length;
        
        // 태스크 수
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const taskCount = tasks.length;
        const completedTaskCount = tasks.filter(task => task.status === '완료').length;
        const inProgressTaskCount = tasks.filter(task => task.status === '진행 중').length;
        const plannedTaskCount = tasks.filter(task => task.status === '예정').length;
        
        // 마일스톤 수
        const milestones = JSON.parse(localStorage.getItem('milestones')) || [];
        const milestoneCount = milestones.length;
        const completedMilestoneCount = milestones.filter(ms => ms.status === '완료').length;
        
        // 산출물 수
        const deliverables = JSON.parse(localStorage.getItem('deliverables')) || [];
        const deliverableCount = deliverables.length;
        
        // 통계 업데이트
        const projectStatsEl = document.getElementById('project-stats');
        if (projectStatsEl) {
            projectStatsEl.textContent = projectCount;
        }
        
        const taskStatsEl = document.getElementById('task-stats');
        if (taskStatsEl) {
            taskStatsEl.textContent = taskCount;
        }
        
        const milestoneStatsEl = document.getElementById('milestone-stats');
        if (milestoneStatsEl) {
            milestoneStatsEl.textContent = milestoneCount;
        }
        
        const deliverableStatsEl = document.getElementById('deliverable-stats');
        if (deliverableStatsEl) {
            deliverableStatsEl.textContent = deliverableCount;
        }
        
        // 태스크 진행 차트
        const taskProgressEl = document.getElementById('task-progress');
        if (taskProgressEl) {
            const completedPercent = taskCount > 0 ? Math.round((completedTaskCount / taskCount) * 100) : 0;
            const inProgressPercent = taskCount > 0 ? Math.round((inProgressTaskCount / taskCount) * 100) : 0;
            const plannedPercent = taskCount > 0 ? Math.round((plannedTaskCount / taskCount) * 100) : 0;
            
            taskProgressEl.innerHTML = `
                <div class="flex flex-col">
                    <div class="flex justify-between items-center mb-1">
                        <span class="text-sm font-medium text-gray-700">태스크 진행 상황</span>
                        <span class="text-sm text-gray-500">${completedTaskCount}/${taskCount}</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                        <div class="bg-green-500 h-2.5 rounded-full" style="width: ${completedPercent}%"></div>
                    </div>
                    <div class="flex justify-between mt-2 text-xs text-gray-500">
                        <span>완료: ${completedTaskCount} (${completedPercent}%)</span>
                        <span>진행 중: ${inProgressTaskCount} (${inProgressPercent}%)</span>
                        <span>예정: ${plannedTaskCount} (${plannedPercent}%)</span>
                    </div>
                </div>
            `;
        }
        
        // 마일스톤 진행 차트
        const milestoneProgressEl = document.getElementById('milestone-progress');
        if (milestoneProgressEl) {
            const completedPercent = milestoneCount > 0 ? Math.round((completedMilestoneCount / milestoneCount) * 100) : 0;
            
            milestoneProgressEl.innerHTML = `
                <div class="flex flex-col">
                    <div class="flex justify-between items-center mb-1">
                        <span class="text-sm font-medium text-gray-700">마일스톤 완료율</span>
                        <span class="text-sm text-gray-500">${completedMilestoneCount}/${milestoneCount}</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                        <div class="bg-blue-500 h-2.5 rounded-full" style="width: ${completedPercent}%"></div>
                    </div>
                    <div class="mt-2 text-xs text-gray-500">
                        <span>완료: ${completedMilestoneCount} (${completedPercent}%)</span>
                    </div>
                </div>
            `;
        }
    }
    
    // 최근 활동 로드 및 표시
    function loadRecentActivities() {
        const recentActivitiesEl = document.getElementById('recent-activities');
        if (!recentActivitiesEl) return;
        
        // 모든 데이터 결합
        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const milestones = JSON.parse(localStorage.getItem('milestones')) || [];
        const deliverables = JSON.parse(localStorage.getItem('deliverables')) || [];
        
        // 샘플 활동 데이터 생성
        const activities = [
            { type: 'project', action: '프로젝트 생성', name: '프로젝트 A', date: new Date('2025-02-15') },
            { type: 'task', action: '태스크 완료', name: '데이터베이스 설계', date: new Date('2025-04-15') },
            { type: 'milestone', action: '마일스톤 달성', name: '초기 설계 완료', date: new Date('2025-03-01') },
            { type: 'deliverable', action: '산출물 제출', name: '설계 문서', date: new Date('2025-03-01') },
            { type: 'task', action: '태스크 진행 중', name: '프론트엔드 개발', date: new Date('2025-02-20') }
        ];
        
        // 날짜 기준 내림차순 정렬
        activities.sort((a, b) => b.date - a.date);
        
        // 최대 5개 활동 표시
        const recentActivities = activities.slice(0, 5);
        
        // 활동 목록 렌더링
        recentActivitiesEl.innerHTML = '';
        
        recentActivities.forEach(activity => {
            const item = document.createElement('div');
            item.className = 'flex items-start py-3 border-b border-gray-100';
            
            // 활동 타입에 따른 아이콘 선택
            let iconClass = '';
            switch (activity.type) {
                case 'project':
                    iconClass = 'bg-indigo-100 text-indigo-600';
                    break;
                case 'task':
                    iconClass = 'bg-green-100 text-green-600';
                    break;
                case 'milestone':
                    iconClass = 'bg-blue-100 text-blue-600';
                    break;
                case 'deliverable':
                    iconClass = 'bg-purple-100 text-purple-600';
                    break;
                default:
                    iconClass = 'bg-gray-100 text-gray-600';
            }
            
            item.innerHTML = `
                <div class="flex-shrink-0 mr-3">
                    <div class="w-8 h-8 rounded-full ${iconClass} flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>
                <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">${activity.action}: ${activity.name}</p>
                    <p class="text-xs text-gray-500">${formatDate(activity.date.toISOString())}</p>
                </div>
            `;
            
            recentActivitiesEl.appendChild(item);
        });
        
        // 더 많은 활동 보기 버튼
        const viewMoreBtn = document.createElement('div');
        viewMoreBtn.className = 'mt-4 text-center';
        viewMoreBtn.innerHTML = `
            <button class="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                더 많은 활동 보기
            </button>
        `;
        recentActivitiesEl.appendChild(viewMoreBtn);
    }
    
    // 다가오는 마일스톤 로드 및 표시
    function loadUpcomingMilestones() {
        const upcomingMilestonesEl = document.getElementById('upcoming-milestones');
        if (!upcomingMilestonesEl) {
            console.log('마일스톤 테이블 요소를 찾을 수 없습니다.');
            return;
        }
        
        const milestones = JSON.parse(localStorage.getItem('milestones')) || [];
        console.log('초기 마일스톤 수:', milestones.length);
        
        // 마일스톤이 없는 경우 초기 데이터 설정
        if (milestones.length === 0) {
            console.log('마일스톤이 없어 초기 데이터 설정');
            const initialMilestones = [
                { project: '프로젝트 A', name: '초기 설계 완료', date: '2025-03-01', status: '완료', description: '시스템 아키텍처 설계' },
                { project: '프로젝트 A', name: '프로토타입 개발', date: '2025-06-01', status: '진행 중', description: 'UI/UX 프로토타입' },
                { project: '프로젝트 B', name: '시장 조사', date: '2025-02-15', status: '예정', description: '사용자 요구 분석' },
                { project: '프로젝트 C', name: '기술 타당성 분석', date: '2025-04-15', status: '완료', description: 'AI 모델 선정 및 타당성 분석' },
                { project: '프로젝트 A', name: '베타 버전 개발', date: '2025-09-15', status: '예정', description: '베타 버전 개발 및 테스트' },
                { project: '프로젝트 C', name: '알고리즘 구현', date: '2025-06-30', status: '진행 중', description: '기계학습 알고리즘 구현' }
            ];
            localStorage.setItem('milestones', JSON.stringify(initialMilestones));
            return loadUpcomingMilestones(); // 데이터 설정 후 재호출
        }
        
        // 완료되지 않은 마일스톤 필터링
        const upcomingMilestones = milestones.filter(ms => ms.status !== '완료');
        
        // 날짜 기준 오름차순 정렬
        upcomingMilestones.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // 최대 3개 마일스톤 표시
        const displayMilestones = upcomingMilestones.slice(0, 3);
        
        console.log('필터링된 마일스톤 수:', displayMilestones.length);
        
        if (displayMilestones.length === 0) {
            upcomingMilestonesEl.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-sm text-gray-500 text-center">다가오는 마일스톤이 없습니다.</td></tr>';
            return;
        }
        
        // 마일스톤 목록 렌더링
        upcomingMilestonesEl.innerHTML = '';
        
        displayMilestones.forEach(milestone => {
            const statusClass = milestone.status === '진행 중' ? 'status-progress' : 'status-planned';
            
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50';
            
            // 날짜 차이 계산
            const today = new Date();
            const milestoneDate = new Date(milestone.date);
            
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-1/4">${milestone.project}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-1/4">${milestone.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-1/4">${formatDate(milestone.date)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm w-1/4">
                    <span class="${statusClass}">${milestone.status}</span>
                </td>
            `;
            
            upcomingMilestonesEl.appendChild(row);
        });
    }
    
    // 모든 대시보드 초기화 실행
    loadDashboardStats();
    loadRecentActivities();
    loadUpcomingMilestones();
})();
