document.addEventListener('DOMContentLoaded', async () => {
    let foodDB = {};

    // CSV 한 줄 파서
    const parseCsvLine = (line) => {
        const result = [];
        let currentField = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') inQuotes = !inQuotes;
        else if (char === ',' && !inQuotes) { result.push(currentField.trim()); currentField = ''; }
        else currentField += char;
        }
        result.push(currentField.trim());
        return result;
    };

    // CSV 파싱
    const parseCSV = (csvText) => {
        const lines = csvText.replace(/\r/g, '').trim().split('\n');
        if (lines.length === 0) return;
        const headerLine = lines[0].replace(/^\uFEFF/, '');
        const headers = parseCsvLine(headerLine);
        const nameIndex = headers.indexOf('식품명');
        const calIndex = headers.indexOf('에너지(kcal)');
        const carbIndex = headers.indexOf('탄수화물(g)');
        const proIndex = headers.indexOf('단백질(g)');
        const fatIndex = headers.indexOf('지방(g)');

        for (let i = 1; i < lines.length; i++) {
        if (!lines[i]) continue;
        const values = parseCsvLine(lines[i]);
        const name = (values[nameIndex] || '').trim();
        if (name) {
            foodDB[name] = {
            calories: parseFloat(values[calIndex]) || 0,
            carbs: parseFloat(values[carbIndex]) || 0,
            protein: parseFloat(values[proIndex]) || 0,
            fat: parseFloat(values[fatIndex]) || 0,
            };
        }
        }
    };

    // CSV 로딩
    try {
        const response = await fetch('./foodDB.csv');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const csvText = await response.text();
        parseCSV(csvText);
        console.log('음식 DB 로딩 성공!');
    } catch (error) {
        console.error('foodDB.csv 파일 로딩 실패:', error);
        alert('필수 데이터를 불러오지 못했습니다.');
    }

    // --- 공통 DOM 요소 ---
    const views = {
        login: document.getElementById('login-view'),
        signup: document.getElementById('signup-view'),
        diet: document.getElementById('diet-view'),
        meals: document.getElementById('meals-view'),
        analysis: document.getElementById('analysis-view'),
        profile: document.getElementById('profile-view'),
        social: document.getElementById('social-view'),
    };
    const navbar = document.getElementById('navbar');

    // --- 상태 관리 ---
    let currentUser = null;
    let users;
    try {
        users = JSON.parse(localStorage.getItem('users')) || [];
        if (!Array.isArray(users)) users = [];
    } catch {
        users = [];
        localStorage.removeItem('users');
    }
    let dietLog = [];

    // --- 뷰 전환 ---
    const appViews = new Set(['diet', 'meals', 'analysis', 'profile', 'social']); // ✅ meals 추가
    const showView = (viewName) => {
        Object.values(views).forEach((view) => view && view.classList.add('hidden'));
        if (views[viewName]) views[viewName].classList.remove('hidden');
        navbar.style.display = appViews.has(viewName) ? 'flex' : 'none';

        if (viewName === 'diet') {
        renderDietDashboard();
        renderNutritionSummary();
        } else if (viewName === 'meals') {
        renderAllDietList();
        // 폼의 날짜 기본값
        const dateEl = document.getElementById('meal-date');
        if (dateEl && !dateEl.value) dateEl.value = getTodayStr();
        } else if (viewName === 'analysis') {
        renderAnalysisDashboard();
        } else if (viewName === 'profile') {
        loadProfile();
        }
    };

    // --- 로그인/회원가입/로그아웃 (기존 동일) ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        const user = users.find((u) => u.username === username && u.password === password);
        if (user) {
            if (user.isActive === false) {
                const ok = confirm('비활성화된 계정입니다. 다시 활성화하시겠습니까?');
                if (!ok) return;
                // 재활성화
                user.isActive = true;
                users = users.map(u => u.username === user.username ? user : u);
                localStorage.setItem('users', JSON.stringify(users));
                alert('계정이 다시 활성화되었습니다. 로그인합니다.');
            }
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            initializeApp();
        } else {
            alert('아이디 또는 비밀번호가 잘못되었습니다.');
        }
        });
    }

    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('signup-username').value.trim();
        const password = document.getElementById('signup-password').value;
        if (!username || !password) return alert('아이디와 비밀번호를 입력해주세요.');
        if (users.some((u) => u.username === username)) return alert('이미 존재하는 아이디입니다.');
        const newUser = { username, password, profile: {}, following: [], followers: [], isActive: true };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        alert('회원가입 성공! 로그인해주세요.');
        showView('login');
        signupForm.reset();
        });
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
        currentUser = null;
        localStorage.removeItem('currentUser');
        showView('login');
        });
    }

    // --- 프로필  ---
    const profileForm = document.getElementById('profile-form');
    const loadProfile = () => {
        if (!currentUser) return;
        document.getElementById('profile-username').value = currentUser.username;
        document.getElementById('profile-height').value = currentUser.profile.height || '';
        document.getElementById('profile-weight').value = currentUser.profile.weight || '';
        document.getElementById('profile-disease').value = currentUser.profile.disease || '';
        const followingCountEl = document.getElementById('following-count');
        const followersCountEl = document.getElementById('followers-count');
        if (followingCountEl) followingCountEl.textContent = String((currentUser.following || []).length);
        if (followersCountEl) followersCountEl.textContent = String((currentUser.followers || []).length);
    };

    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!currentUser) return;
        currentUser.profile.height = document.getElementById('profile-height').value;
        currentUser.profile.weight = document.getElementById('profile-weight').value;
        currentUser.profile.disease = document.getElementById('profile-disease').value;
        users = users.map((u) => (u.username === currentUser.username ? currentUser : u));
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        alert('프로필이 업데이트되었습니다.');
        });
    }

    // --- 회원 삭제  ---
    const deleteBtn = document.getElementById('delete-account-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
        if (!currentUser) return;
        if (confirm('정말로 계정을 삭제하시겠습니까? 모든 데이터가 영구적으로 사라집니다.')) {
            users = users.filter((u) => u.username !== currentUser.username);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.removeItem(`dietLog_${currentUser.username}`);
            if (logoutBtn) logoutBtn.click();
        }
        });
    }

    // 계정 비활성화
        const deactivateBtn = document.getElementById('deactivate-account-btn');
        if (deactivateBtn) {
        deactivateBtn.addEventListener('click', () => {
            if (!currentUser) return;
            if (confirm('계정을 비활성화하시겠습니까? 데이터는 유지되며, 다시 로그인하면 계정이 활성화됩니다.')) {
            // 현재 유저 상태 업데이트
            currentUser.isActive = false;
            users = users.map(u => u.username === currentUser.username ? currentUser : u);
            localStorage.setItem('users', JSON.stringify(users));
            alert('계정이 비활성화되었습니다. 로그아웃됩니다.');
            // 강제 로그아웃
            document.getElementById('logout-btn')?.click();
            }
        });
        }

    // --- 유틸: 로컬 기준 날짜 문자열 ---
    const toLocalISODate = (d) => {
        const tz = d.getTimezoneOffset() * 60000;
        return new Date(d.getTime() - tz).toISOString().slice(0, 10);
    };
    const getTodayStr = () => toLocalISODate(new Date());
    const getPast7Days = () => {
        const arr = [];
        for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        arr.push(toLocalISODate(d));
        }
        return arr;
    };

    const defaultGoal = { calories: 2000, carbs: 300, protein: 60, fat: 50 };

    // --- 홈 대시보드 렌더 ---
    function renderTodaySummary() {
  const today = getTodayStr();
  const todayMeals = dietLog.filter(m => m.date === today);
  const sum = todayMeals.reduce((acc, m) => {
    acc.calories += Number(m.calories) || 0;
    acc.carbs    += Number(m.carbs)    || 0;
    acc.protein  += Number(m.protein)  || 0;
    acc.fat      += Number(m.fat)      || 0;
    return acc;
  }, { calories: 0, carbs: 0, protein: 0, fat: 0 });

  // ✅ A) ‘오늘의 섭취량 요약’(progress 바) 섹션만 업데이트
  const progressEl = document.getElementById('today-summary-progress');
  if (progressEl) {
    if (todayMeals.length === 0) {
      progressEl.innerHTML = '<p class="text-muted">오늘 식단을 기록하면 여기에 분석 결과가 표시됩니다.</p>';
    } else {
      const items = [
        { name: '칼로리',  current: sum.calories, goal: defaultGoal.calories, unit: 'kcal', color: 'primary' },
        { name: '탄수화물', current: sum.carbs,    goal: defaultGoal.carbs,    unit: 'g',    color: 'success' },
        { name: '단백질',  current: sum.protein,  goal: defaultGoal.protein,  unit: 'g',    color: 'info' },
        { name: '지방',    current: sum.fat,      goal: defaultGoal.fat,      unit: 'g',    color: 'warning' },
      ];
      progressEl.innerHTML = items.map(item => {
        const percentage = item.goal > 0 ? (item.current / item.goal) * 100 : 0;
        return `
          <div class="mb-3 nutrient-summary">
            <div class="d-flex justify-content-between mb-1">
              <span>${item.name}</span>
              <span class="fw-bold">${item.current.toFixed(1)} / ${item.goal} ${item.unit}</span>
            </div>
            <div class="progress" style="height: 10px;">
              <div class="progress-bar bg-${item.color}" role="progressbar" style="width: ${percentage.toFixed(2)}%;"></div>
            </div>
          </div>`;
      }).join('');
    }
  }

  // ✅ B) ‘오늘의 영양 정보 분석’ 카드의 합계 숫자 갱신
  const tc = document.getElementById('total-calories');
  const tcarb = document.getElementById('total-carbs');
  const tpro = document.getElementById('total-protein');
  const tfat = document.getElementById('total-fat');
  if (tc)   tc.textContent   = sum.calories.toFixed(1);
  if (tcarb) tcarb.textContent = sum.carbs.toFixed(1);
  if (tpro)  tpro.textContent  = sum.protein.toFixed(1);
  if (tfat)  tfat.textContent  = sum.fat.toFixed(1);

  // ✅ C) 오늘의 탄·단·지 막대그래프 갱신
  renderTodayMacroBarChart(sum);
}

    function renderNutritionGoal() {
        const el = document.getElementById('nutrition-goal-display');
        if (!el) return;
        el.innerHTML = `
        <ul class="list-group list-group-flush">
            <li class="list-group-item d-flex justify-content-between"><strong>칼로리:</strong> <span>${defaultGoal.calories} kcal</span></li>
            <li class="list-group-item d-flex justify-content-between"><strong>탄수화물:</strong> <span>${defaultGoal.carbs} g</span></li>
            <li class="list-group-item d-flex justify-content-between"><strong>단백질:</strong> <span>${defaultGoal.protein} g</span></li>
            <li class="list-group-item d-flex justify-content-between"><strong>지방:</strong> <span>${defaultGoal.fat} g</span></li>
        </ul>`;
    }

    function renderNutritionSummary() {
        renderTodaySummary();
    }

    

    function renderTodayDetail() {
        const today = getTodayStr();
        const todayMeals = dietLog.filter(m => m.date === today);
        const ul = document.getElementById('today-detail-list');
        if (!ul) return;
        ul.innerHTML = '';
        if (todayMeals.length === 0) {
        ul.innerHTML = '<li class="list-group-item text-center text-muted p-3">오늘 기록된 식단이 없습니다.</li>';
        return;
        }
        const getMealTypeBadge = (type) => {
        const colors = {
            '아침': 'bg-success-subtle text-success-emphasis',
            '점심': 'bg-warning-subtle text-warning-emphasis',
            '저녁': 'bg-primary-subtle text-primary-emphasis',
            '간식': 'bg-secondary-subtle text-secondary-emphasis'
        };
        return colors[type] || 'bg-light';
        };
        todayMeals.forEach(meal => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `
            <div class="d-flex justify-content-between align-items-start">
            <div>
                <span class="badge ${getMealTypeBadge(meal.type)} me-2">${meal.type}</span>
                <strong class="food-name">${meal.name}</strong>
                <div class="nutrition-breakdown mt-1">
                <span><i class="bi bi-fire nutrient-icon"></i> ${meal.calories.toFixed(0)} kcal</span>
                <span><i class="bi bi-egg-fried nutrient-icon"></i> 탄 ${meal.carbs.toFixed(0)}g</span>
                <span><i class="bi bi-hurricane nutrient-icon"></i> 단 ${meal.protein.toFixed(0)}g</span>
                <span><i class="bi bi-droplet-fill nutrient-icon"></i> 지 ${meal.fat.toFixed(0)}g</span>
                </div>
            </div>
            <span class="text-muted small">${new Date(meal.id).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>`;
        ul.appendChild(li);
        });
    }

    // 주간 표(홈)
    function renderWeeklySummary() {
        const days = getPast7Days();
        const weekly = days.map(date => {
        const meals = dietLog.filter(m => m.date === date);
        return meals.reduce((acc, m) => {
            acc.calories += Number(m.calories)||0;
            acc.carbs += Number(m.carbs)||0;
            acc.protein += Number(m.protein)||0;
            acc.fat += Number(m.fat)||0;
            return acc;
        }, {date,calories:0,carbs:0,protein:0,fat:0});
        });
        const el = document.getElementById('weekly-summary');
        if (el) {
        el.innerHTML = `
            <table class="table table-sm">
            <thead><tr><th>날짜</th><th>칼로리</th><th>탄</th><th>단</th><th>지</th></tr></thead>
            <tbody>
            ${weekly.map(d=>`<tr>
                <td>${d.date}</td>
                <td>${d.calories.toFixed(1)}</td>
                <td>${d.carbs.toFixed(1)}</td>
                <td>${d.protein.toFixed(1)}</td>
                <td>${d.fat.toFixed(1)}</td>
            </tr>`).join('')}
            </tbody>
            </table>`;
        }
    }

    // 식단 탭: 전체 기록 목록 (최근 날짜 순)
    const allDietList = document.getElementById('all-diet-list');

    function renderAllDietList() {
        if (!allDietList) return;
        allDietList.innerHTML = '';
        if (dietLog.length === 0) {
        allDietList.innerHTML = '<li class="list-group-item text-center text-muted p-3">아직 기록된 식단이 없습니다.</li>';
        return;
        }

        // 날짜 내림차순, 같은 날짜는 id(생성시각) 내림차순
        const sorted = [...dietLog].sort((a, b) => {
        if (a.date === b.date) return b.id - a.id;
        return a.date < b.date ? 1 : -1;
        });

        // 날짜 헤더 그룹핑
        let currentDate = null;
        sorted.forEach(meal => {
        if (meal.date !== currentDate) {
            currentDate = meal.date;
            const header = document.createElement('li');
            header.className = 'list-group-item fw-bold bg-light';
            header.textContent = currentDate;
            allDietList.appendChild(header);
        }
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-start';
        li.dataset.id = meal.id;
        li.innerHTML = `
            <div>
            <span class="badge bg-primary me-2">${meal.type}</span>
            <span class="food-info">${meal.name}</span>
            <div class="nutrition-details small text-muted">
                (칼로리: ${meal.calories}kcal, 탄: ${meal.carbs}g, 단: ${meal.protein}g, 지: ${meal.fat}g)
            </div>
            </div>
            <div class="ms-2">
            <button class="btn btn-sm btn-outline-secondary edit-btn">수정</button>
            <button class="btn btn-sm btn-outline-danger delete-btn">삭제</button>
            </div>`;
        allDietList.appendChild(li);
        });
    }

    // ----- 분석 화면 차트 -----
    function getWeeklyTotals() {
        const days = getPast7Days();
        const totals = days.reduce((acc, date) => {
            const meals = dietLog.filter(m => m.date === date);
            meals.forEach(m => {
            acc.calories += Number(m.calories)||0;
            acc.carbs    += Number(m.carbs)||0;
            acc.protein  += Number(m.protein)||0;
            acc.fat      += Number(m.fat)||0;
            });
            return acc;
        }, {calories:0, carbs:0, protein:0, fat:0});
        return totals;
    }
    function getDailyMacrosFor7Days() {
        const days = getPast7Days();
        const perDay = days.map(date => {
        const meals = dietLog.filter(m => m.date === date);
        return meals.reduce((acc, m) => {
            acc.carbs += Number(m.carbs)||0;
            acc.protein += Number(m.protein)||0;
            acc.fat += Number(m.fat)||0;
            return acc;
        }, {date, carbs:0, protein:0, fat:0});
        });
        return { days, perDay };
    }

    function renderTodayMacroBarChart(todaySum) {
        if (!window.Chart) return;
        const ctx = document.getElementById('today-macro-chart');
        if (!ctx) return;
        const data = [Number(todaySum.carbs||0), Number(todaySum.protein||0), Number(todaySum.fat||0)];
        if (window._todayMacroChart) window._todayMacroChart.destroy();
        window._todayMacroChart = new Chart(ctx, {
        type: 'bar',
        data: { labels: ['탄수화물(g)', '단백질(g)', '지방(g)'], datasets: [{ label: '오늘 섭취량', data, backgroundColor: 'rgba(54, 162, 235, 0.5)' }] },
        options: { responsive: true, plugins: { legend: { position: 'top' } } }
        });
    }

    function renderWeeklyMacroRatioPie() {
        if (!window.Chart) return;
        const ctx = document.getElementById('weekly-macro-ratio-chart');
        if (!ctx) return;
        const totals = getWeeklyTotals();
        const values = [totals.carbs, totals.protein, totals.fat];
        if (window._weeklyRatioChart) window._weeklyRatioChart.destroy();
        window._weeklyRatioChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['탄수화물(g)', '단백질(g)', '지방(g)'],
            datasets: [{ data: values, backgroundColor: ['rgba(54,162,235,0.5)','rgba(75,192,192,0.5)','rgba(255,206,86,0.5)'], borderWidth: 1 }]
        },
        options: { responsive: true }
        });
    }

    function renderDailyMacroTrendLine() {
        if (!window.Chart) return;
        const ctx = document.getElementById('daily-macro-trend-chart');
        if (!ctx) return;
        const { days, perDay } = getDailyMacrosFor7Days();
        const carbs = perDay.map(d => d.carbs);
        const protein = perDay.map(d => d.protein);
        const fat = perDay.map(d => d.fat);
        if (window._dailyTrendChart) window._dailyTrendChart.destroy();
        window._dailyTrendChart = new Chart(ctx, {
        type: 'line',
        data: { labels: days, datasets: [{ label: '탄수화물(g)', data: carbs },{ label: '단백질(g)', data: protein },{ label: '지방(g)', data: fat }] },
        options: { responsive: true, plugins: { legend: { position: 'top' } }, tension: 0.3 }
        });
    }

    function renderWeeklyBarInAnalysis() {
        if (!window.Chart) return;
        const ctx = document.getElementById('weekly-nutrition-chart');
        if (!ctx) return;
        const days = getPast7Days();
        const weekly = days.map(date => {
        const meals = dietLog.filter(m => m.date === date);
        return meals.reduce((acc, m) => {
            acc.calories += Number(m.calories)||0;
            acc.carbs += Number(m.carbs)||0;
            acc.protein += Number(m.protein)||0;
            acc.fat += Number(m.fat)||0;
            return acc;
        }, {calories:0,carbs:0,protein:0,fat:0});
        });
        if (window._weeklyChart) window._weeklyChart.destroy();
        window._weeklyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: days,
            datasets: [
            { label: '칼로리', data: weekly.map(d=>d.calories), backgroundColor: 'rgba(255,99,132,0.5)' },
            { label: '탄수화물', data: weekly.map(d=>d.carbs), backgroundColor: 'rgba(54,162,235,0.5)' },
            { label: '단백질', data: weekly.map(d=>d.protein), backgroundColor: 'rgba(75,192,192,0.5)' },
            { label: '지방', data: weekly.map(d=>d.fat), backgroundColor: 'rgba(255,206,86,0.5)' },
            ]
        },
        options: { responsive: true, plugins: { legend: { position: 'top' } } }
        });
    }

    function judgeAdequacy(actual, target, label) {
        const low  = target * 0.9;
        const high = target * 1.1;
        if (actual < low)  return `${label} 섭취가 부족합니다.`;
        if (actual > high) return `${label} 섭취가 과합니다.`;
        return `${label} 섭취가 적절한 수준입니다.`;
        }

        function renderDietAnalysisResult() {
            const box = document.getElementById('diet-analysis-result');
            if (!box) return;

            const totals = getWeeklyTotals();
            const target = {
                calories: (defaultGoal.calories || 0) * 7,
                carbs:    (defaultGoal.carbs    || 0) * 7,
                protein:  (defaultGoal.protein  || 0) * 7,
                fat:      (defaultGoal.fat      || 0) * 7,
            };

            const lines = [
                judgeAdequacy(totals.calories, target.calories, '칼로리'),
                judgeAdequacy(totals.protein,  target.protein,  '단백질'),
                judgeAdequacy(totals.carbs,    target.carbs,    '탄수화물'),
                judgeAdequacy(totals.fat,      target.fat,      '지방'),
            ];

            box.innerHTML = `
                <div class="analysis-block"><i class="bi bi-check-circle-fill"></i><span>${lines[0]}</span></div>
                <div class="analysis-block"><i class="bi bi-check-circle-fill"></i><span>${lines[1]}</span></div>
                <div class="analysis-block"><i class="bi bi-check-circle-fill"></i><span>${lines[2]}</span></div>
                <div class="analysis-block"><i class="bi bi-check-circle-fill"></i><span>${lines[3]}</span></div>
                <small class="text-muted d-block mt-2">
                * 기준: 일반적인 1일 권장치(설정값)를 7일로 환산 (현재 설정: 칼로리 ${defaultGoal.calories}kcal, 탄수화물 ${defaultGoal.carbs}g, 단백질 ${defaultGoal.protein}g, 지방 ${defaultGoal.fat}g / 일)
                </small>
            `;
            }

    // 홈(식단) 대시보드
    function renderDietDashboard() {
        renderTodaySummary();
        renderNutritionGoal();
        renderTodayDetail();
        renderWeeklySummary();
    }

    // 분석 대시보드
    function renderAnalysisDashboard() {
        renderWeeklyMacroRatioPie();
        renderDailyMacroTrendLine();
        renderWeeklyBarInAnalysis();
        renderDietAnalysisResult();
    }

    // 저장 & 화면별 렌더
    const saveAndRender = () => {
        if (currentUser) {
        localStorage.setItem(`dietLog_${currentUser.username}`, JSON.stringify(dietLog));
        }
        if (!views.diet.classList.contains('hidden')) {
        renderDietDashboard();
        renderNutritionSummary();
        }
        if (!views.meals.classList.contains('hidden')) {
        renderAllDietList();
        }
        if (!views.analysis.classList.contains('hidden')) {
        renderAnalysisDashboard();
        }
    };

    // --- 식단 추가 폼 / 자동완성 ---
    const foodNameInput = document.getElementById('food-name');
    const searchResultsContainer = document.getElementById('food-search-results');

    if (foodNameInput && searchResultsContainer) {
        foodNameInput.addEventListener('input', () => {
        const term = foodNameInput.value.trim().toLowerCase();
        searchResultsContainer.innerHTML = '';
        if (!term) return (searchResultsContainer.style.display='none');
        const topMatches = Object.keys(foodDB).filter(n => n.toLowerCase().includes(term)).slice(0, 10);
        if (topMatches.length === 0) return (searchResultsContainer.style.display='none');
        topMatches.forEach(name => {
            const item = document.createElement('div');
            item.className = 'search-result-item list-group-item list-group-item-action';
            item.textContent = name;
            searchResultsContainer.appendChild(item);
        });
        searchResultsContainer.style.display = 'block';
        });
        foodNameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const first = searchResultsContainer.querySelector('.search-result-item');
            if (first && searchResultsContainer.style.display !== 'none') {
            e.preventDefault();
            foodNameInput.value = first.textContent;
            searchResultsContainer.innerHTML = '';
            searchResultsContainer.style.display = 'none';
            }
        }
        });
        foodNameInput.addEventListener('blur', () => setTimeout(()=> searchResultsContainer.style.display='none',150));
        searchResultsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('search-result-item')) {
            foodNameInput.value = e.target.textContent;
            searchResultsContainer.innerHTML = '';
            searchResultsContainer.style.display = 'none';
        }
        });
    }

    const dietForm = document.getElementById('diet-form');
    if (dietForm) {
        const dateEl = document.getElementById('meal-date');
        if (dateEl && !dateEl.value) dateEl.value = getTodayStr();
        dietForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const foodName = (foodNameInput ? foodNameInput.value.trim() : '');
        const typeEl = document.getElementById('meal-type');
        const dateVal = (document.getElementById('meal-date')?.value) || getTodayStr();
        const typeVal = typeEl ? typeEl.value : '기록';
        const foodData = foodDB[foodName];

        if (!foodData) return alert('DB에 있는 음식을 검색하여 목록에서 선택해주세요.');

        const newMeal = { id: Date.now(), date: dateVal, type: typeVal, name: foodName, ...foodData };
        dietLog.push(newMeal);
        saveAndRender();
        dietForm.reset();
        if (dateEl) dateEl.value = getTodayStr();
        });
    }

    // 식단 목록 수정/삭제(식단 탭 리스트에 바인딩)
    const editModalEl = document.getElementById('edit-modal');
    const editModal = editModalEl ? new bootstrap.Modal(editModalEl) : null;

    if (allDietList) {
        allDietList.addEventListener('click', (e) => {
        const item = e.target.closest('.list-group-item');
        if (!item) return;
        const id = Number(item.dataset.id);
        if (e.target.classList.contains('delete-btn')) {
            dietLog = dietLog.filter(m => m.id !== id);
            saveAndRender();
        } else if (e.target.classList.contains('edit-btn') && editModal) {
            const meal = dietLog.find(m => m.id === id);
            if (meal) {
            document.getElementById('edit-id').value = meal.id;
            document.getElementById('edit-meal-type').value = meal.type;
            document.getElementById('edit-food-name').value = meal.name;
            const editDateEl = document.getElementById('edit-meal-date');
            if (editDateEl) editDateEl.value = meal.date;
            editModal.show();
            }
        }
        });
    }

    const saveEditBtn = document.getElementById('save-edit-btn');
    if (saveEditBtn) {
        saveEditBtn.addEventListener('click', () => {
        const id = Number(document.getElementById('edit-id').value);
        const newType = document.getElementById('edit-meal-type').value;
        const newFoodName = document.getElementById('edit-food-name').value.trim();
        const editDateEl = document.getElementById('edit-meal-date');
        const newDate = (editDateEl && editDateEl.value) ? editDateEl.value : getTodayStr();
        const newFoodData = foodDB[newFoodName] || { calories: 0, carbs: 0, protein: 0, fat: 0 };
        dietLog = dietLog.map(m => m.id === id ? { ...m, date: newDate, type: newType, name: newFoodName, ...newFoodData } : m);
        saveAndRender();
        if (editModal) editModal.hide();
        });
    }

    // --- 네비게이션 & 초기화 ---
    const initializeApp = () => {
        try { currentUser = JSON.parse(localStorage.getItem('currentUser')); } catch { currentUser = null; }
        if (currentUser) {
        const welcome = document.getElementById('welcome-message');
        if (welcome) welcome.textContent = `${currentUser.username}님 환영합니다.`;
        try { dietLog = JSON.parse(localStorage.getItem(`dietLog_${currentUser.username}`)) || []; } catch { dietLog = []; }
        showView('diet'); // 기본 진입: 홈
        } else {
        showView('login');
        }
    };

    const navHome = document.getElementById('nav-diet');
    const navMeals = document.getElementById('nav-meals');       // ✅ 새 탭 라우팅
    const navAnalysis = document.getElementById('nav-analysis');
    const navProfile = document.getElementById('nav-profile');
    const navSocial = document.getElementById('nav-social');

    navHome && navHome.addEventListener('click', (e) => { e.preventDefault(); showView('diet'); });
    navMeals && navMeals.addEventListener('click', (e) => { e.preventDefault(); showView('meals'); }); // ✅
    navAnalysis && navAnalysis.addEventListener('click', (e) => { e.preventDefault(); showView('analysis'); });
    navProfile && navProfile.addEventListener('click', (e) => { e.preventDefault(); showView('profile'); });
    navSocial && navSocial.addEventListener('click', (e) => { e.preventDefault(); showView('social'); });

    const toSignup = document.getElementById('show-signup-link');
    const toLogin = document.getElementById('show-login-link');
    toSignup && toSignup.addEventListener('click', (e) => { e.preventDefault(); showView('signup'); });
    toLogin && toLogin.addEventListener('click', (e) => { e.preventDefault(); showView('login'); });

    document.getElementById('go-social-from-profile')?.addEventListener('click', (e)=>{ e.preventDefault(); showView('social'); });
    document.getElementById('go-social-from-profile-2')?.addEventListener('click', (e)=>{ e.preventDefault(); showView('social'); });

    initializeApp();
});
