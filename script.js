(function() {
    const style = document.createElement('style');
    style.innerHTML = `
        .leaflet-zoom-anim .leaflet-zoom-animated {
            transition: transform 0.15s cubic-bezier(0,0,0.25,1) !important;
        }
    `;
    document.head.appendChild(style);
})();

// --- 音声関連 ---
const sounds = {
    bgm: {
        oped: new Audio('bgm_oped.mp3'),
        q: [new Audio('bgm_q1.mp3'), new Audio('bgm_q2.mp3'), new Audio('bgm_q3.mp3')],
        t1: new Audio('bgm_t1.mp3')
    },
    se: {
        b1: new Audio('se_b1.mp3'), // hover
        b2: new Audio('se_b2.mp3'), // answer > 5000
        b3: new Audio('se_b3.mp3'), // answer < 5000
        b4: new Audio('se_b4.mp3'), // click
        p1: new Audio('se_p1.mp3'), // pin
        h1: new Audio('se_h1.mp3'), // hint
        t1: new Audio('se_t1.mp3'),  // timer
        achieve: new Audio('se_achieve.mp3') // 実績解除音
    }
};

sounds.bgm.oped.loop = true;
sounds.bgm.q.forEach(bgm => bgm.loop = true);
sounds.bgm.t1.loop = true;
sounds.se.t1.loop = true;

let activeBGM = null;
let bgmVolume = 0.3;
let seVolume = 0.8;

function updateVolumeIcon() {
    const volumeIcon = document.getElementById('volume-icon');
    if (bgmVolume > 0 || seVolume > 0) {
        volumeIcon.classList.remove('fa-volume-xmark');
        volumeIcon.classList.add('fa-volume-high');
    } else {
        volumeIcon.classList.remove('fa-volume-high');
        volumeIcon.classList.add('fa-volume-xmark');
    }
}

function setBGMVolume(value) {
    bgmVolume = parseFloat(value);
    Object.values(sounds.bgm).flat().forEach(sound => sound.volume = bgmVolume);
    localStorage.setItem('historicalGeoGuesserBGMVolume', bgmVolume);
    updateVolumeIcon();
}

function setSEVolume(value) {
    seVolume = parseFloat(value);
    Object.values(sounds.se).forEach(sound => sound.volume = seVolume);
    localStorage.setItem('historicalGeoGuesserSEVolume', seVolume);
    updateVolumeIcon();
}

function playSE(sound) {
    sound.currentTime = 0;
    sound.play();
}

function playBGM(sound) {
    stopBGM();
    sound.currentTime = 0;
    sound.play();
    activeBGM = sound;
}

function stopBGM() {
    if (activeBGM) {
        activeBGM.pause();
        activeBGM.currentTime = 0;
    }
    activeBGM = null;
}


// --- DOM要素 ---
const preStartScreen = document.getElementById('pre-start-screen');
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');
const achievementsScreen = document.getElementById('achievements-screen');
const storyLogScreen = document.getElementById('story-log-screen');

const startButton = document.getElementById('start-button');
const timeAttackStartButton = document.getElementById('time-attack-start-button');
const restartButton = document.getElementById('restart-button');
const achievementsButton = document.getElementById('achievements-button');
const volumeButton = document.getElementById('volume-button');
const backToStartButton = document.getElementById('back-to-start-button');
const storyLogButton = document.getElementById('story-log-button');
const backToStartFromStoryButton = document.getElementById('back-to-start-from-story-button');

const storyTitle = document.getElementById('story-title');
const chapterDisplay = document.getElementById('chapter-display');
const timerDisplay = document.getElementById('timer');
const narrativeBox = document.getElementById('narrative-box');
const locationTitle = document.getElementById('location-title');
const hint1 = document.getElementById('hint-1');
const hint2 = document.getElementById('hint-2');
const hint3 = document.getElementById('hint-3');
const hintImage = document.getElementById('hint-image');

const instructionText = document.getElementById('instruction-text');
const submitAnswerButton = document.getElementById('submit-answer-button');
const nextChapterButton = document.getElementById('next-chapter-button');

const totalScoreDisplay = document.getElementById('total-score');
const resultsSummary = document.getElementById('results-summary');
const resultTitle = document.getElementById('result-title');

const compass = document.getElementById('compass');
const compassNeedle = document.getElementById('compass-needle');
const compassToggle = document.getElementById('compass-toggle');

const achievementsList = document.getElementById('achievements-list');
const notificationContainer = document.getElementById('notification-container');

const resetAchievementsButton = document.getElementById('reset-achievements-button');
const resetConfirmationModal = document.getElementById('reset-confirmation-modal');
const confirmResetButton = document.getElementById('confirm-reset-button');
const cancelResetButton = document.getElementById('cancel-reset-button');

const volumeControlModal = document.getElementById('volume-control-modal');
const closeVolumeModalButton = document.getElementById('close-volume-modal-button');
const bgmVolumeSlider = document.getElementById('bgm-volume-slider');
const seVolumeSlider = document.getElementById('se-volume-slider');

const storyModeUI = document.getElementById('story-mode-ui');
const timeAttackModeUI = document.getElementById('time-attack-mode-ui');
const timeAttackScoreDisplay = document.getElementById('time-attack-score');

const shareChapterButtonsContainer = document.getElementById('share-chapter-buttons');
const shareFinalButtonsContainer = document.getElementById('share-final-buttons');
const loadingOverlay = document.getElementById('loading-overlay');

// --- 調査員の記録関連のDOM要素 ---
const storyListContainer = document.getElementById('story-list-container');
const storyContentContainer = document.getElementById('story-content-container');

// --- ゲーム状態変数 ---
let map;
let playerMarker = null;
let answerMarker = null;
let lineToAnswer = null;

const GAME_VERSION = "1.0"; // NGワードフィルター導入バージョン
const profanityList = [
    '事故','死亡','骨折','重傷','殺害','傷害','暴力','被害者','放送事故',
            'ポルノ','アダルト','セックス','バイブレーター','マスターベーション','オナニー','スケベ','羞恥','セクロス','ちんこ',
            'エッチ','SEX','風俗','童貞','ペニス','巨乳','ロリ','触手','羞恥','ノーブラ','手ブラ',
            'ローアングル','禁断','Tバック','グラビア','美尻','お尻','セクシー','無修正',
            '大麻','麻薬',
            '基地外','糞','死ね','殺す',
            'shit','piss','fuck','cunt','cocksucker','motherfucker','tits',
    // ここに不適切と判断する単語を追加できます
];

let gameMode = 'story'; // 'story' or 'timeAttack'
let currentStory;
let currentChapterIndex = 0;
let currentQuestion;
let allChapters = [];
let chapterResults = [];
let totalScore = 0;

let timerId;
let startTime;
let remainingTime = 60;

let timeAttackTimerId;
let timeAttackStartTime;
let timeAttackRemainingTime = 120;

let answered = false;
let isTimerSEPlaying = false;

let useCompass = true;
let compassWobbleInterval = null;
let isZooming = false; // マップズーム中のフラグを追加

// --- WASD移動用の変数 ---
const player = {
    velocity: { x: 0, y: 0 },
    speed: 12, // 基本速度
    acceleration: 0.15, // 加速度 (0-1の値、1に近いほど速く反応) - 少し機敏に
    friction: 0.92, // 摩擦 (1に近いほど滑る) - 少し滑りにくく
};
const keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    shift: false
};

// --- 実績関連 ---
let gameStats = {};

// --- タイトル画面エフェクト管理 ---
let titleScreenMouseMoveListener = null;
let particleAnimationId = null;
let particleResizeListener = null;


function loadGameData() {
    const data = localStorage.getItem('historicalGeoGuesserStats');
    if (data) {
        gameStats = JSON.parse(data);
        if (!gameStats.themeScores) {
            gameStats.themeScores = {};
        }
    } else {
        gameStats = {
            gamesCompleted: 0,
            highScore: 0,
            playedStoryTitles: [],
            unlockedAchievements: [],
            themeScores: {}
        };
    }
}

function saveGameData() {
    localStorage.setItem('historicalGeoGuesserStats', JSON.stringify(gameStats));
}

function resetGameData() {
    playSE(sounds.se.b4);
    gameStats = {
        gamesCompleted: 0,
        highScore: 0,
        playedStoryTitles: [],
        unlockedAchievements: [],
        themeScores: {}
    };
    saveGameData();
    renderAchievements();
    resetConfirmationModal.classList.add('hidden');
}

function showNotification(achievementId) {
    const achievement = achievementMaster[achievementId];
    if (!achievement) return;

    playSE(sounds.se.achieve);
    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.innerHTML = `
        <i class="${achievement.icon}"></i>
        <div>
            <div class="font-bold">実績解除</div>
            <div>${achievement.name}</div>
        </div>
    `;
    notificationContainer.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

// 汎用的なトーストメッセージを表示する関数を追加
function showToastMessage(title, message, iconClass = 'fa-solid fa-info-circle') {
    playSE(sounds.se.b3); // 汎用的な効果音
    const toast = document.createElement('div');
    toast.className = 'achievement-toast'; // スタイルを再利用
    toast.style.backgroundColor = '#4a2c2a'; // 色を調整して区別
    toast.innerHTML = `
        <i class="${iconClass}" style="color: #f5eeda;"></i>
        <div>
            <div class="font-bold">${title}</div>
            <div>${message}</div>
        </div>
    `;
    notificationContainer.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000); // 3秒で消える
}

function unlockAchievement(achievementId) {
    if (!gameStats.unlockedAchievements.includes(achievementId)) {
        gameStats.unlockedAchievements.push(achievementId);
        saveGameData();
        showNotification(achievementId);
    }
}

function checkAndUnlockAchievements(checkType, data) {
    for (const id in achievementMaster) {
        const achievement = achievementMaster[id];
        if (achievement.type === checkType && !gameStats.unlockedAchievements.includes(id)) {
            if (achievement.condition(data, gameStats)) {
                unlockAchievement(id);
            }
        }
    }
}

// --- マップ初期化 ---
function initMap() {
    map = L.map('map', {
        center: [35.6895, 139.6917],
        zoom: 2,
        worldCopyJump: false,
        maxBounds: [[-90, -180], [90, 180]],
        maxBoundsViscosity: 1.0, // 境界を固くします
        keyboard: false, // デフォルトのキーボード操作を無効化
        scrollWheelZoom: true, // マウスポインタの位置でズーム
        zoomDelta: 1.5, // ズームの変化量を大きくして、よりポインタに寄るように感じさせる
        zoomSnap: 0.1 // ズームレベルを細かくして滑らかに
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: 2,
        noWrap: true,
        bounds: [[-90, -180], [90, 180]] // タイルの読み込み範囲も制限
    }).addTo(map);

    map.on('click', placeMarker);
    
    // ズームアニメーション中に移動を一時停止して滑らかさを向上させる
    map.on('zoomstart', () => { isZooming = true; });
    map.on('zoomend', () => { isZooming = false; });

    // WASD移動のセットアップ
    setupWASDControls();
}

// --- WASD移動の制御 ---
function setupWASDControls() {
    // 既にリスナーが登録されていたら重複しないようにする
    if (window.wasdInitialized) return;
    window.wasdInitialized = true;

    window.addEventListener('keydown', (e) => {
        // 入力フィールドやテキストエリアにフォーカスがある場合は移動させない
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        switch (e.key.toLowerCase()) {
            case 'w': keys.w = true; break;
            case 'a': keys.a = true; break;
            case 's': keys.s = true; break;
            case 'd': keys.d = true; break;
            case 'shift': keys.shift = true; break;
        }
    });

    window.addEventListener('keyup', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        switch (e.key.toLowerCase()) {
            case 'w': keys.w = false; break;
            case 'a': keys.a = false; break;
            case 's': keys.s = false; break;
            case 'd': keys.d = false; break;
            case 'shift': keys.shift = false; break;
        }
    });

    function gameLoop() {
        // ゲーム画面が表示されている時だけ処理
        if (map && !gameScreen.classList.contains('hidden')) {
            let targetVec = { x: 0, y: 0 };

            if (keys.w) targetVec.y = -1;
            if (keys.s) targetVec.y = 1;
            if (keys.a) targetVec.x = -1;
            if (keys.d) targetVec.x = 1;
            
            // 正規化して斜め移動が速くならないようにする
            const length = Math.sqrt(targetVec.x * targetVec.x + targetVec.y * targetVec.y);
            if (length > 0) {
                targetVec.x /= length;
                targetVec.y /= length;
            }

            const currentSpeed = keys.shift ? player.speed * 2.0 : player.speed;
            
            // 目標速度
            const targetVelocityX = targetVec.x * currentSpeed;
            const targetVelocityY = targetVec.y * currentSpeed;

            // 加速/減速処理 (Lerp: 線形補間)
            player.velocity.x += (targetVelocityX - player.velocity.x) * player.acceleration;
            player.velocity.y += (targetVelocityY - player.velocity.y) * player.acceleration;

            // 慣性（キーが押されていないときに摩擦を適用）
            if (targetVec.x === 0 && targetVec.y === 0) {
                player.velocity.x *= player.friction;
                player.velocity.y *= player.friction;
            }

            // 非常に遅い速度は0にする
            if (Math.abs(player.velocity.x) < 0.01) player.velocity.x = 0;
            if (Math.abs(player.velocity.y) < 0.01) player.velocity.y = 0;

            // マップを移動
            // ズーム中でなく、かつ速度がある場合のみパン操作を行う
            if (!isZooming && (player.velocity.x !== 0 || player.velocity.y !== 0)) {
                let panVector = L.point(player.velocity.x, player.velocity.y);
                const currentPixelBounds = map.getPixelBounds();
                const maxBounds = map.options.maxBounds;

                if (maxBounds) {
                    // 現在のズームレベルでmaxBoundsのピクセル座標を取得
                    const worldPixelBounds = L.bounds(
                        map.project(maxBounds.getNorthWest()),
                        map.project(maxBounds.getSouthEast())
                    );

                    const nextPixelBounds = L.bounds(
                        currentPixelBounds.min.add(panVector),
                        currentPixelBounds.max.add(panVector)
                    );

                    // 境界を越える場合は移動ベクトルを調整
                    if (nextPixelBounds.min.x < worldPixelBounds.min.x) {
                        panVector.x = worldPixelBounds.min.x - currentPixelBounds.min.x;
                        player.velocity.x = 0; // 壁に当たったら速度を0にする
                    }
                    if (nextPixelBounds.max.x > worldPixelBounds.max.x) {
                        panVector.x = worldPixelBounds.max.x - currentPixelBounds.max.x;
                        player.velocity.x = 0; // 壁に当たったら速度を0にする
                    }
                    if (nextPixelBounds.min.y < worldPixelBounds.min.y) {
                        panVector.y = worldPixelBounds.min.y - currentPixelBounds.min.y;
                        player.velocity.y = 0; // 壁に当たったら速度を0にする
                    }
                    if (nextPixelBounds.max.y > worldPixelBounds.max.y) {
                        panVector.y = worldPixelBounds.max.y - currentPixelBounds.max.y;
                        player.velocity.y = 0; // 壁に当たったら速度を0にする
                    }
                }
                
                // 調整されたベクトルでパンする
                if (panVector.x !== 0 || panVector.y !== 0) {
                   map.panBy(panVector, { animate: false });
                }
            }
        }
        
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
}

// --- ゲームフロー関数 ---
function startGame(mode) {
    gameMode = mode;
    playSE(sounds.se.b4);
    document.body.classList.remove('vignette-active');
    startScreen.classList.add('hidden');
    resultScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    cleanUpTitleScreenEffects();

    if (!map) initMap();
    
    const mapElement = document.getElementById('map');
    
    useCompass = compassToggle.checked;
    chapterResults = [];
    totalScore = 0;

    if (gameMode === 'story') {
        mapElement.classList.remove('time-attack-map');
        storyModeUI.classList.remove('hidden');
        timeAttackModeUI.classList.add('hidden');
        timeAttackScoreDisplay.classList.add('hidden');
        currentChapterIndex = 0;
        currentStory = stories[Math.floor(Math.random() * stories.length)];
        storyTitle.textContent = currentStory.title;
        startStoryChapter();
    } else { // timeAttack
        mapElement.classList.add('time-attack-map');
        storyModeUI.classList.add('hidden');
        timeAttackModeUI.classList.remove('hidden');
        timeAttackScoreDisplay.classList.remove('hidden');
        timeAttackScoreDisplay.textContent = 'スコア: 0';
        timeAttackRemainingTime = 120;
        timeAttackStartTime = performance.now();
        timeAttackTimerId = requestAnimationFrame(updateTimeAttackTimer);
        playBGM(sounds.bgm.t1);
        startNextQuestion();
    }
}

function startStoryChapter() {
    resetQuestionUI();
    if(useCompass) compass.classList.remove('hidden');

    const chapter = currentStory.chapters[currentChapterIndex];
    currentQuestion = chapter;
    playBGM(sounds.bgm.q[currentChapterIndex]);

    chapterDisplay.textContent = `第${currentChapterIndex + 1}章 / 全3章`;
    narrativeBox.textContent = chapter.narrative;
    hintImage.src = chapter.image;
    hintImage.classList.remove('hidden');
    [hint1, hint2, hint3].forEach((h, i) => h.textContent = chapter.hints[i]);
    
    startTime = performance.now();
    answered = false;
    isTimerSEPlaying = false;
    timerId = requestAnimationFrame(updateTimer);
}

function startNextQuestion() {
    resetQuestionUI();
    if(useCompass) compass.classList.remove('hidden');
    
    currentQuestion = allChapters[Math.floor(Math.random() * allChapters.length)];
    
    narrativeBox.textContent = currentQuestion.narrative;
    hintImage.src = currentQuestion.image;
    hintImage.classList.remove('hidden');
    [hint1, hint2, hint3].forEach((h, i) => h.textContent = currentQuestion.hints[i]);

    setTimeout(() => hint1.classList.remove('opacity-0'), 100);
    setTimeout(() => hint2.classList.remove('opacity-0'), 200);
    setTimeout(() => hint3.classList.remove('opacity-0'), 300);
    setTimeout(() => locationTitle.textContent = currentQuestion.title, 500);

    answered = false;
}

function updateTimer(timestamp) {
    if (answered) return;
    const elapsedTime = (timestamp - startTime) / 1000;
    remainingTime = Math.max(0, 60 - elapsedTime);
    timerDisplay.textContent = remainingTime.toFixed(2);

    if (remainingTime <= 50 && hint1.classList.contains('opacity-0')) { hint1.classList.remove('opacity-0'); playSE(sounds.se.h1); }
    if (remainingTime <= 40 && hint2.classList.contains('opacity-0')) { hint2.classList.remove('opacity-0'); playSE(sounds.se.h1); }
    if (remainingTime <= 30 && hint3.classList.contains('opacity-0')) { hint3.classList.remove('opacity-0'); playSE(sounds.se.h1); locationTitle.textContent = currentQuestion.title; }
    if (remainingTime <= 10 && !isTimerSEPlaying) { playSE(sounds.se.t1); isTimerSEPlaying = true; timerDisplay.classList.add('text-red-600'); }

    if (remainingTime <= 0) submitAnswer();
    else timerId = requestAnimationFrame(updateTimer);
}

function updateTimeAttackTimer(timestamp) {
    const elapsedTime = (timestamp - timeAttackStartTime) / 1000;
    timeAttackRemainingTime = Math.max(0, 120 - elapsedTime);
    timerDisplay.textContent = timeAttackRemainingTime.toFixed(2);
    
    if (timeAttackRemainingTime <= 10 && !isTimerSEPlaying) { playSE(sounds.se.t1); isTimerSEPlaying = true; timerDisplay.classList.add('text-red-600'); }

    if (timeAttackRemainingTime <= 0) {
        if (isTimerSEPlaying) { sounds.se.t1.pause(); sounds.se.t1.currentTime = 0; isTimerSEPlaying = false; }
        showResults();
    } else {
        timeAttackTimerId = requestAnimationFrame(updateTimeAttackTimer);
    }
}

function placeMarker(e) {
    if (answered) return;
    playSE(sounds.se.p1);

    const lng = L.Util.wrapNum(e.latlng.lng, [-180, 180], true);
    const lat = e.latlng.lat;

    if (playerMarker) playerMarker.setLatLng([lat, lng]);
    else playerMarker = L.marker([lat, lng]).addTo(map);

    if(useCompass) {
        if (compassWobbleInterval) clearInterval(compassWobbleInterval);
        const answerCoords = currentQuestion.answer;
        const distance = calculateDistance(lat, lng, answerCoords[0], answerCoords[1]);
        const bearing = calculateBearing(lat, lng, answerCoords[0], answerCoords[1]);
        let wobble;
        if (distance >= 1000) {
            wobble = 270;
        } else if (distance >= 500) {
            wobble = 180;
        } else if (distance >= 100) {
            wobble = 90;
        } else {
            wobble = 45;
        }
        compassWobbleInterval = setInterval(() => {
            const randomAngle = bearing + (Math.random() - 0.5) * wobble;
            compassNeedle.style.transform = `rotate(${randomAngle}deg)`;
        }, 100);
    }
}

function submitAnswer() {
    if (answered) return;
    answered = true;

    if (gameMode === 'story') {
        cancelAnimationFrame(timerId);
        if (isTimerSEPlaying) { sounds.se.t1.pause(); sounds.se.t1.currentTime = 0; isTimerSEPlaying = false; }
    }
    if (compassWobbleInterval) clearInterval(compassWobbleInterval);
    
    const answerCoords = currentQuestion.answer;
    
    hint1.classList.remove('opacity-0');
    hint2.classList.remove('opacity-0');
    hint3.classList.remove('opacity-0');
    locationTitle.textContent = currentQuestion.title;
    hintImage.classList.remove('hidden');

    answerMarker = L.marker(answerCoords, { icon: L.icon({ iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png`, shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41] }) }).addTo(map);
    
    let distance = 20000; // ペナルティ距離
    if (playerMarker) {
        const playerCoords = playerMarker.getLatLng();
        distance = calculateDistance(playerCoords.lat, playerCoords.lng, answerCoords[0], answerCoords[1]);
        lineToAnswer = L.polyline([playerCoords, answerCoords], { color: 'red', weight: 3, opacity: 0.7, dashArray: '5, 10' }).addTo(map);
        map.fitBounds(L.latLngBounds(playerCoords, answerCoords), { padding: [50, 50] });
        if (useCompass) {
            const bearing = calculateBearing(playerCoords.lat, playerCoords.lng, answerCoords[0], answerCoords[1]);
            compassNeedle.style.transform = `rotate(${bearing}deg)`;
        }
    } else {
        map.setView(answerCoords, 4);
    }

    const timeForBonus = gameMode === 'story' ? remainingTime : 60; // TAモードでは時間ボーナスは固定（満点）
    const { distanceScore, timeBonus, chapterScore } = calculateScore(distance, timeForBonus);
    totalScore += chapterScore;
    
    if (chapterScore >= 5000) playSE(sounds.se.b2); else playSE(sounds.se.b3);

    chapterResults.push({ title: currentQuestion.title, score: chapterScore, distance: distance, remainingTime: remainingTime });
    
    const scoreColorClass = chapterScore < 0 ? 'text-red-600' : '';
    instructionText.innerHTML = `正解との距離: <span class="font-bold">${distance.toFixed(0)} km</span><br>スコア: <span class="font-bold ${scoreColorClass}">${chapterScore.toLocaleString()}</span>点`;
    
    submitAnswerButton.disabled = true;

    if (gameMode === 'story') {
        shareChapterButtonsContainer.classList.remove('hidden');
        nextChapterButton.classList.remove('hidden');
        if (currentChapterIndex === currentStory.chapters.length - 1) nextChapterButton.textContent = "結果を見る";
        checkAndUnlockAchievements('chapter', { gameMode: 'story', distance: distance, time: remainingTime, chapterScore: chapterScore });
    } else {
        timeAttackScoreDisplay.textContent = `スコア: ${totalScore.toLocaleString()}`;
        checkAndUnlockAchievements('chapter', { gameMode: 'timeAttack', distance: distance, chapterScore: chapterScore });
        setTimeout(() => {
             if (timeAttackRemainingTime > 0) startNextQuestion();
        }, 1000);
    }
}

function nextChapter() {
    playSE(sounds.se.b4);
    currentChapterIndex++;
    if (currentChapterIndex < currentStory.chapters.length) startStoryChapter();
    else showResults();
}

function showResults() {
    cancelAnimationFrame(timeAttackTimerId);
    document.body.classList.add('vignette-active');
    gameScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    stopBGM();
    playBGM(sounds.bgm.oped);

    const resultStoryTitle = document.getElementById('result-story-title');

    totalScoreDisplay.textContent = totalScore.toLocaleString();
    if (totalScore < 0) totalScoreDisplay.classList.add('text-red-600');
    else totalScoreDisplay.classList.remove('text-red-600');

    resultsSummary.innerHTML = '';
    
    if (gameMode === 'story') {
        resultTitle.textContent = "調査完了";
        resultStoryTitle.textContent = `— ${currentStory.title} —`;
        resultStoryTitle.classList.remove('hidden');
        chapterResults.forEach((result, index) => {
            const scoreColorClass = result.score < 0 ? 'text-red-600' : '';
            const resultElement = document.createElement('div');
            resultElement.className = 'flex justify-between items-center text-xl p-2 bg-[#fdfaf2] rounded';
            resultElement.innerHTML = `<span>第${index + 1}章: ${result.title}</span><span class="font-bold ${scoreColorClass}">${result.score.toLocaleString()}点 (${result.distance.toFixed(0)}km)</span>`;
            resultsSummary.appendChild(resultElement);
        });
        
        // ゲーム統計を更新
        gameStats.gamesCompleted++;
        if (totalScore > gameStats.highScore) gameStats.highScore = totalScore;
        if (!gameStats.playedStoryTitles.includes(currentStory.title)) {
            gameStats.playedStoryTitles.push(currentStory.title);
        }

        // 「伝説の系譜」の実績のために、クリアした物語を記録
        if (totalScore >= 15000) {
            for (const id in achievementMaster) {
                const achievement = achievementMaster[id];
                if (achievement.category === '伝説の系譜' && achievement.requiredTitles.includes(currentStory.title)) {
                    const themeKey = achievement.themeKey;
                    if (!gameStats.themeScores[themeKey]) {
                        gameStats.themeScores[themeKey] = { clearedTitles: [] };
                    }
                    if (!gameStats.themeScores[themeKey].clearedTitles.includes(currentStory.title)) {
                        gameStats.themeScores[themeKey].clearedTitles.push(currentStory.title);
                    }
                    break; 
                }
            }
        }

        saveGameData();
        checkAndUnlockAchievements('final', { gameMode: 'story', totalScore: totalScore, useCompass: useCompass, chapterResults: chapterResults });

    } else { // timeAttack
         resultTitle.textContent = "タイムアップ！";
         resultStoryTitle.textContent = '';
         resultStoryTitle.classList.add('hidden');
         const answeredCount = chapterResults.length;
         const summaryElement = document.createElement('div');
         summaryElement.className = 'text-xl p-2 bg-[#fdfaf2] rounded';
         summaryElement.innerHTML = `<p>回答数: <span class="font-bold">${answeredCount}問</span></p>`;
         resultsSummary.appendChild(summaryElement);
         
         checkAndUnlockAchievements('final', { gameMode: 'timeAttack', totalScore: totalScore, chapterResults: chapterResults, useCompass: useCompass });
    }
}

function restartGame() {
    playSE(sounds.se.b4);
    document.body.classList.add('vignette-active');
    resultScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    setupTitleScreenEffects();
}

function resetQuestionUI() {
    if(playerMarker) { map.removeLayer(playerMarker); playerMarker = null; }
    if(answerMarker) { map.removeLayer(answerMarker); answerMarker = null; }
    if(lineToAnswer) { map.removeLayer(lineToAnswer); lineToAnswer = null; }

    if (compassWobbleInterval) clearInterval(compassWobbleInterval);
    compass.classList.add('hidden');
    compassNeedle.style.transform = 'rotate(0deg)';

    timerDisplay.classList.remove('text-red-600');
    locationTitle.textContent = "";
    hint1.classList.add('opacity-0');
    hint2.classList.add('opacity-0');
    hint3.classList.add('opacity-0');
    hintImage.classList.add('hidden');
    instructionText.textContent = "物語の舞台となった場所を地図上で特定してください。";
    submitAnswerButton.disabled = false;
    nextChapterButton.classList.add('hidden');
    shareChapterButtonsContainer.classList.add('hidden');
    nextChapterButton.textContent = "次の章へ";
    map.setView([35.6895, 139.6917], 2);
}

// --- 計算関数 ---
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; const toRad = (v) => v * Math.PI / 180;
    const dLat = toRad(lat2 - lat1), dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function calculateBearing(lat1, lon1, lat2, lon2) {
    const toRad = (v) => v * Math.PI / 180, toDeg = (v) => v * 180 / Math.PI;
    const y = Math.sin(toRad(lon2 - lon1)) * Math.cos(toRad(lat2));
    const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) - Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(toRad(lon2 - lon1));
    return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

function calculateScore(distance, time) {
    let distanceScore;
    const NEUTRAL_DISTANCE = 1000; // この距離(km)で距離点が0点になる
    const MAX_PENALTY_DISTANCE = 5000; // この距離(km)でマイナス点が最大(-2000点)になる

    if (distance <= NEUTRAL_DISTANCE) {
        distanceScore = 5000 * (1 - Math.pow(distance / NEUTRAL_DISTANCE, 0.7));
    } else {
        const penaltyProgress = Math.min(1, (distance - NEUTRAL_DISTANCE) / (MAX_PENALTY_DISTANCE - NEUTRAL_DISTANCE));
        distanceScore = -2000 * penaltyProgress;
    }

    distanceScore = Math.round(distanceScore);
    const timeBonus = (gameMode === 'story') ? Math.round((Math.max(0, time) / 60) * 1000) : 0;
    const chapterScore = distanceScore + timeBonus;

    return { distanceScore, timeBonus, chapterScore };
}

// --- SNS共有 ---
async function shareResult(type) {
    playSE(sounds.se.b4);
    loadingOverlay.classList.remove('hidden');

    const elementToCapture = type === 'chapter' ? gameScreen : resultScreen;
    const shareButtonContainers = elementToCapture.querySelectorAll('#share-chapter-buttons, #share-final-buttons, #score-submission-ui');
    shareButtonContainers.forEach(container => container.style.visibility = 'hidden');

    // --- スクリーンショット用のスタイル調整（垂直中央揃えのため） ---
    const elementsToStyle = [];
    if (type === 'chapter') { // ゲーム画面のキャプチャ時のみ
        const narrativeBoxContainer = elementToCapture.querySelector('#narrative-box')?.parentElement;
        const hints = elementToCapture.querySelectorAll('#hint-1, #hint-2, #hint-3');
        const locationTitleEl = elementToCapture.querySelector('#location-title');

        if (narrativeBoxContainer) elementsToStyle.push(narrativeBoxContainer);
        hints.forEach(h => elementsToStyle.push(h));
        if (locationTitleEl) elementsToStyle.push(locationTitleEl);
        
        elementsToStyle.forEach(el => {
            el.style.display = 'flex';
            el.style.alignItems = 'center';
            if (el.id === 'location-title') {
                el.style.justifyContent = 'center';
            }
        });
    }

    // --- 共有用テキストを作成 ---
    const hashtag = 'ヒストリカル・ゲッサー';
    let text = '';
    if (type === 'chapter' && gameMode === 'story') {
        const lastResult = chapterResults[chapterResults.length - 1];
        text = `【ヒストリカル・ゲッサー】\n「${lastResult.title}」で ${lastResult.score.toLocaleString()}点 獲得！\n正解との距離は ${lastResult.distance.toFixed(0)}km でした！\n#${hashtag}`;
    } else if (type === 'final' && gameMode === 'story') {
         text = `【ヒストリカル・ゲッサー】\nストーリーモード「${currentStory.title}」をクリア！\n合計スコアは ${totalScore.toLocaleString()}点 でした！\n#${hashtag}`;
    } else if (type === 'final' && gameMode === 'timeAttack') {
        text = `【ヒストリカル・ゲッサー】\nタイムアタックに挑戦！\nスコアは ${totalScore.toLocaleString()}点 でした！\n#${hashtag}`;
    }

    // --- スクリーンショット用のフィルター適用 ---
    const mapTiles = elementToCapture.querySelectorAll('.leaflet-tile');

    try {
        // スクリーンショットを撮る直前にタイルにフィルターを適用
        const mapFilter = gameMode === 'timeAttack' ? 'grayscale(1)' : 'sepia(0.7)';
        mapTiles.forEach(tile => {
            if (tile.style) tile.style.filter = mapFilter;
        });

        const canvas = await html2canvas(elementToCapture, { 
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#f5eeda'
        });
        
        // 1. スクリーンショットを保存
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'hist-geo-result.png';
        link.click();
        
        // 2. テキストをコピー
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);

        // 3. 完了通知を表示
        const toast = document.createElement('div');
        toast.className = 'achievement-toast';
        toast.style.backgroundColor = '#4a2c2a';
        toast.innerHTML = `
            <i class="fa-solid fa-check-double" style="color: #f5eeda;"></i>
            <div>
                <div class="font-bold">共有準備完了</div>
                <div>スクリーンショットを保存し、テキストをコピーしました。</div>
            </div>
        `;
        notificationContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 5000);


    } catch (error) {
        console.error('共有コンテンツの生成に失敗しました:', error);
        alert('画像の生成またはテキストのコピーに失敗しました。');
    } finally {
        // 撮影後、必ずフィルターを元に戻す
        mapTiles.forEach(tile => {
            if (tile.style) tile.style.filter = '';
        });

        // スタイルを元に戻す
        elementsToStyle.forEach(el => {
            el.style.display = '';
            el.style.alignItems = '';
            el.style.justifyContent = '';
        });

        loadingOverlay.classList.add('hidden');
        shareButtonContainers.forEach(container => container.style.visibility = 'visible');
    }
}

// --- 画面遷移と実績表示 ---
function renderAchievements() {
    achievementsList.innerHTML = '';
    const unlockedCount = gameStats.unlockedAchievements.length;
    const totalAchievements = Object.keys(achievementMaster).length;
    const progressPercentage = totalAchievements > 0 ? (unlockedCount / totalAchievements) * 100 : 0;
    document.getElementById('achievement-progress').textContent = `達成率: ${progressPercentage.toFixed(1)}%`;

    const achievementsByCategory = {};
    Object.keys(achievementMaster).forEach(id => {
        const achievement = achievementMaster[id];
        const category = achievement.category || 'その他';
        if (!achievementsByCategory[category]) achievementsByCategory[category] = [];
        achievementsByCategory[category].push({ id, ...achievement });
    });

    const categoryOrder = ['ストーリーモード', 'タイムアタック', '伝説の系譜', 'その他'];
    categoryOrder.forEach(category => {
        if (achievementsByCategory[category]) {
            const header = document.createElement('h2');
            header.className = 'col-span-full text-2xl font-bold border-b-2 border-dashed border-[#a4886d] pb-2 mb-2 text-left';
            header.textContent = category;
            achievementsList.appendChild(header);

            achievementsByCategory[category].forEach(achievement => {
                const isUnlocked = gameStats.unlockedAchievements.includes(achievement.id);
                const achievementEl = document.createElement('div');
                achievementEl.className = `p-4 rounded-lg flex items-start gap-4 transition-all duration-300 ${isUnlocked ? 'bg-yellow-100 border-2 border-yellow-400' : 'bg-gray-200 opacity-70'}`;
                
                let descriptionHTML;
                if (achievement.category === '伝説の系譜' && achievement.requiredTitles) {
                    const clearedTitles = gameStats.themeScores?.[achievement.themeKey]?.clearedTitles || [];
                    const storyListHTML = achievement.requiredTitles.map(title => {
                        const isCleared = clearedTitles.includes(title);
                        return `<li class="text-xs ${isCleared ? 'line-through text-green-700 font-bold' : 'text-gray-500'}">${title}</li>`;
                    }).join('');
                    
                    descriptionHTML = `
                        <p class="text-sm ${isUnlocked ? 'text-gray-800' : 'text-gray-600'}">${achievement.description}</p>
                        <ul class="list-disc list-inside mt-2 space-y-1">
                            ${storyListHTML}
                        </ul>
                    `;
                } else {
                    descriptionHTML = `<p class="text-sm">${isUnlocked ? achievement.description : '？？？'}</p>`;
                }
                
                achievementEl.innerHTML = `
                    <i class="${achievement.icon} text-4xl ${isUnlocked ? 'text-yellow-500' : 'text-gray-500'} mt-1 flex-shrink-0"></i>
                    <div class="text-left flex-grow">
                        <h3 class="font-bold text-lg">${achievement.name}</h3>
                        ${descriptionHTML}
                    </div>
                `;
                achievementsList.appendChild(achievementEl);
            });
        }
    });
}

function showAchievementsScreen() {
    playSE(sounds.se.b4);
    document.body.classList.add('vignette-active');
    startScreen.classList.add('hidden');
    cleanUpTitleScreenEffects();
    renderAchievements();
    achievementsScreen.classList.remove('hidden');
}

function hideAchievementsScreen() {
    playSE(sounds.se.b4);
    document.body.classList.add('vignette-active');
    achievementsScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    setupTitleScreenEffects();
}

// --- 調査員の記録関連の関数 ---
function renderStoryLog() {
    storyListContainer.innerHTML = ''; // リストを初期化
    const unlockedCount = gameStats.unlockedAchievements.length;

    investigatorStories.forEach(story => {
        const isUnlocked = unlockedCount >= story.requiredAchievements;
        const storyElement = document.createElement('div');
        storyElement.className = `p-3 rounded-lg cursor-pointer transition-colors text-left ${isUnlocked ? 'hover:bg-[#e9e2d0]' : 'opacity-50 cursor-not-allowed'}`;
        
        if (isUnlocked) {
            storyElement.innerHTML = `<h3 class="font-bold">${story.title}</h3>`;
            // クリックしたら内容を表示するイベントを追加
            storyElement.addEventListener('click', () => {
                // 選択状態のスタイルを管理
                document.querySelectorAll('#story-list-container > div').forEach(el => el.classList.remove('bg-yellow-200', 'border-yellow-400', 'border-2'));
                storyElement.classList.add('bg-yellow-200', 'border-yellow-400', 'border-2');
                storyContentContainer.innerHTML = story.content;
                playSE(sounds.se.b4);
            });
        } else {
            storyElement.innerHTML = `
                <h3 class="font-bold text-gray-500">ロック済み</h3>
                <p class="text-sm text-gray-400">（実績があと${story.requiredAchievements - unlockedCount}個必要）</p>
            `;
        }
        storyListContainer.appendChild(storyElement);
    });
}

function showStoryLogScreen() {
    playSE(sounds.se.b4);
    document.body.classList.add('vignette-active');
    startScreen.classList.add('hidden');
    cleanUpTitleScreenEffects();
    renderStoryLog(); // 画面表示の前にリストを生成
    storyContentContainer.innerHTML = '<p class="text-gray-500">左のリストから記録を選択してください。</p>'; // 初期状態に戻す
    storyLogScreen.classList.remove('hidden');
}

function hideStoryLogScreen() {
    playSE(sounds.se.b4);
    document.body.classList.add('vignette-active');
    storyLogScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    setupTitleScreenEffects();
}

function escapeHTML(str) {
    const p = document.createElement("p");
    p.textContent = str;
    return p.innerHTML;
}

// --- タイトル画面エフェクト ---
function cleanUpTitleScreenEffects() {
    if (titleScreenMouseMoveListener) {
        document.getElementById('start-screen').removeEventListener('mousemove', titleScreenMouseMoveListener);
        titleScreenMouseMoveListener = null;
    }
    if (particleAnimationId) {
        cancelAnimationFrame(particleAnimationId);
        particleAnimationId = null;
    }
    if (particleResizeListener) {
        window.removeEventListener('resize', particleResizeListener);
        particleResizeListener = null;
    }
}

function setupTitleScreenEffects() {
    cleanUpTitleScreenEffects(); 

    const layers = document.querySelectorAll('.bg-layer');
    const startScreenElement = document.getElementById('start-screen');

    const onMouseMove = (e) => {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const moveX = (clientX - centerX) / centerX;
        const moveY = (clientY - centerY) / centerY;

        layers.forEach(layer => {
            const depth = layer.getAttribute('data-depth');
            const x = -(moveX * depth * 50);
            const y = -(moveY * depth * 50);
            layer.style.transform = `translate(${x}px, ${y}px)`;
        });
    };
    startScreenElement.addEventListener('mousemove', onMouseMove);
    titleScreenMouseMoveListener = onMouseMove;

    // --- パーティクルエフェクト ---
    const particleCanvas = document.getElementById('particle-canvas');
    if (!particleCanvas) return;

    const pCtx = particleCanvas.getContext('2d');
    let particles = [];

    class Particle {
        constructor() {
            this.x = Math.random() * particleCanvas.width;
            this.y = Math.random() * particleCanvas.height;
            this.size = Math.random() * 1.5 + 0.5;
            this.speedX = Math.random() * 0.6 - 0.3;
            this.speedY = Math.random() * 0.6 - 0.3;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > particleCanvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > particleCanvas.height) this.speedY *= -1;
        }
        draw() {
            pCtx.beginPath();
            pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            pCtx.fillStyle = `rgba(255, 235, 159, ${this.opacity})`;
            pCtx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const numberOfParticles = (particleCanvas.width * particleCanvas.height) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
            particles.push(new Particle());
        }
    }

    function resizeCanvas() {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
        initParticles();
    }
    particleResizeListener = resizeCanvas;
    window.addEventListener('resize', particleResizeListener);
    resizeCanvas();

    function animate() {
        pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        for (const particle of particles) {
            particle.update();
            particle.draw();
        }
        particleAnimationId = requestAnimationFrame(animate);
    }
    
    animate();
}


// --- イベントリスナー ---
preStartScreen.addEventListener('click', () => {
    sessionStorage.setItem('gameLaunchedInSession', 'true');
    preStartScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    playBGM(sounds.bgm.oped);
    setupTitleScreenEffects();
}, { once: true });

startButton.addEventListener('click', () => startGame('story'));
timeAttackStartButton.addEventListener('click', () => startGame('timeAttack'));
submitAnswerButton.addEventListener('click', submitAnswer);
nextChapterButton.addEventListener('click', nextChapter);
restartButton.addEventListener('click', restartGame);
achievementsButton.addEventListener('click', showAchievementsScreen);
backToStartButton.addEventListener('click', hideAchievementsScreen);

// storyLogButton.addEventListener('click', showStoryLogScreen); // 元の処理をコメントアウト
storyLogButton.addEventListener('click', () => {
    showToastMessage('未実装', 'この機能は現在準備中です。', 'fa-solid fa-gears');
});
backToStartFromStoryButton.addEventListener('click', hideStoryLogScreen);

shareChapterButtonsContainer.addEventListener('click', (e) => {
    if (e.target.closest('button')) {
        shareResult('chapter');
    }
});

shareFinalButtonsContainer.addEventListener('click', (e) => {
    if (e.target.closest('button')) {
        shareResult('final');
    }
});

volumeButton.addEventListener('click', () => {
    volumeControlModal.classList.remove('hidden');
});
closeVolumeModalButton.addEventListener('click', () => {
    volumeControlModal.classList.add('hidden');
});
bgmVolumeSlider.addEventListener('input', (e) => setBGMVolume(e.target.value));
seVolumeSlider.addEventListener('input', (e) => setSEVolume(e.target.value));

resetAchievementsButton.addEventListener('click', () => {
    resetConfirmationModal.classList.remove('hidden');
});
confirmResetButton.addEventListener('click', resetGameData);
cancelResetButton.addEventListener('click', () => {
    resetConfirmationModal.classList.add('hidden');
});

document.querySelectorAll('.game-button').forEach(button => {
    button.addEventListener('mouseenter', () => playSE(sounds.se.b1));
});

// --- 初期化処理 ---
function initGame() {
    document.body.classList.add('vignette-active');
    // 全ての章をフラットな配列にまとめる
    stories.forEach(story => {
        story.chapters.forEach(chapter => {
            allChapters.push({
                ...chapter,
                storyTitle: story.title
            });
        });
    });
    
    if (sessionStorage.getItem('gameLaunchedInSession')) {
        preStartScreen.classList.add('hidden');
        startScreen.classList.remove('hidden');
        // playBGM(sounds.bgm.oped); // BGM再生をユーザーの初回クリック時に限定するため削除
        setupTitleScreenEffects(); // タイトル画面エフェクトを初期化
    }
}

function loadVolumeSettings() {
    const savedBGM = localStorage.getItem('historicalGeoGuesserBGMVolume');
    const savedSE = localStorage.getItem('historicalGeoGuesserSEVolume');

    if (savedBGM !== null) {
        bgmVolume = parseFloat(savedBGM);
    }
    if (savedSE !== null) {
        seVolume = parseFloat(savedSE);
    }
    
    bgmVolumeSlider.value = bgmVolume;
    seVolumeSlider.value = seVolume;

    setBGMVolume(bgmVolume);
    setSEVolume(seVolume);
}

loadGameData();
loadVolumeSettings();
initGame();

