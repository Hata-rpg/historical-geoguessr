const achievementMaster = {
    // --- カテゴリ: ストーリーモード ---
    'first_step': {
        name: '初めての調査完了',
        description: 'ストーリーモードで初めてゲームを最後までプレイする。',
        icon: 'fa-solid fa-shoe-prints',
        category: 'ストーリーモード',
        type: 'final',
        condition: (data, stats) => data.gameMode === 'story' && stats.gamesCompleted >= 1
    },
    'ten_games': {
        name: '十回の調査',
        description: 'ストーリーモードを10回完了する。',
        icon: 'fa-solid fa-map-marked-alt',
        category: 'ストーリーモード',
        type: 'final',
        condition: (data, stats) => data.gameMode === 'story' && stats.gamesCompleted >= 10
    },
    'twenty_five_games': {
        name: 'ベテラン調査員',
        description: 'ストーリーモードを25回完了する。',
        icon: 'fa-solid fa-landmark-flag',
        category: 'ストーリーモード',
        type: 'final',
        condition: (data, stats) => data.gameMode === 'story' && stats.gamesCompleted >= 25
    },
    'fifty_games': {
        name: '歴史の生き証人',
        description: 'ストーリーモードを50回完了する。',
        icon: 'fa-solid fa-monument',
        category: 'ストーリーモード',
        type: 'final',
        condition: (data, stats) => data.gameMode === 'story' && stats.gamesCompleted >= 50
    },
    'all_stories_played': {
        name: '物語の探求者',
        description: '全ての物語を少なくとも1回はプレイする。',
        icon: 'fa-solid fa-book-open-reader',
        category: 'ストーリーモード',
        type: 'final',
        condition: (data, stats) => {
            const allStoryTitles = stories.map(s => s.title);
            return data.gameMode === 'story' && allStoryTitles.every(title => stats.playedStoryTitles.includes(title));
        }
    },
    'no_compass': {
        name: '直感の勝利',
        description: 'コンパスを使わずに、合計15,000点以上でクリアする。',
        icon: 'fa-solid fa-magnet',
        category: 'ストーリーモード',
        type: 'final',
        condition: (data, stats) => data.gameMode === 'story' && !data.useCompass && data.totalScore >= 15000
    },
    'high_score_16k': {
        name: '卓越した探求者',
        description: 'ストーリーモードで合計16,000点以上を獲得する。',
        icon: 'fa-solid fa-shield-halved',
        category: 'ストーリーモード',
        type: 'final',
        condition: (data, stats) => data.gameMode === 'story' && data.totalScore >= 16000
    },
    'high_score_17k': {
        name: '伝説の探求者',
        description: 'ストーリーモードで合計17,000点以上を獲得する。',
        icon: 'fa-solid fa-trophy',
        category: 'ストーリーモード',
        type: 'final',
        condition: (data, stats) => data.gameMode === 'story' && data.totalScore >= 17000
    },
     'perfect_story': {
        name: '完璧な調査',
        description: '1回のストーリーモードで、全3章のスコアが5800点以上になる。',
        icon: 'fa-solid fa-gem',
        category: 'ストーリーモード',
        type: 'final',
        condition: (data, stats) => data.gameMode === 'story' && data.chapterResults.length === 3 && data.chapterResults.every(r => r.score >= 5800)
    },
    'perfect_chapter': {
        name: '完璧な推測',
        description: 'いずれかの章で、5,900点以上のスコアを獲得する。',
        icon: 'fa-solid fa-star',
        category: 'ストーリーモード',
        type: 'chapter',
        condition: (data, stats) => data.gameMode === 'story' && data.chapterScore >= 5900
    },
    'speed_demon': {
        name: '電光石火',
        description: 'いずれかの章を、残り時間55秒以上かつ5,500点以上でクリアする。',
        icon: 'fa-solid fa-bolt',
        category: 'ストーリーモード',
        type: 'chapter',
        condition: (data, stats) => data.gameMode === 'story' && data.time >= 55 && data.chapterScore >= 5500
    },
    'sniper': {
        name: 'スナイパー',
        description: 'いずれかの章で、正解との距離0.1km未満を達成する。',
        icon: 'fa-solid fa-crosshairs',
        category: 'ストーリーモード',
        type: 'chapter',
        condition: (data, stats) => data.gameMode === 'story' && data.distance < 0.1
    },
    'lost': {
        name: '迷子',
        description: 'いずれかの章で、正解との距離が10,000km以上離れる。',
        icon: 'fa-solid fa-compass',
        category: 'ストーリーモード',
        type: 'chapter',
        condition: (data, stats) => data.gameMode === 'story' && data.distance >= 10000
    },
    'time_is_up': {
        name: '時間切れ',
        description: 'いずれかの章で時間切れ（残り時間0秒）で回答する。',
        icon: 'fa-solid fa-hourglass-end',
        category: 'ストーリーモード',
        type: 'chapter',
        condition: (data, stats) => data.gameMode === 'story' && data.time <= 0
    },
    'minus_score': {
        name: '地図は苦手？',
        description: 'ストーリーモードで合計スコアがマイナスになる。',
        icon: 'fa-solid fa-map-pin',
        category: 'ストーリーモード',
        type: 'final',
        condition: (data, stats) => data.gameMode === 'story' && data.totalScore < 0
    },

    // --- カテゴリ: タイムアタック ---
    'time_attack_first': {
        name: '時への挑戦',
        description: 'タイムアタックモードを初めてプレイする。',
        icon: 'fa-solid fa-hourglass-start',
        category: 'タイムアタック',
        type: 'final',
        condition: (data, stats) => data.gameMode === 'timeAttack'
    },
    'time_attack_5q': {
        name: 'タイムスプリンター',
        description: '1回のタイムアタックで3問以上回答し、合計10,000点以上でクリアする。',
        icon: 'fa-solid fa-flag-checkered',
        category: 'タイムアタック',
        type: 'final',
        condition: (data, stats) => data.gameMode === 'timeAttack' && data.chapterResults.length >= 3 && data.totalScore >= 10000
    },
    'time_attack_10q': {
        name: 'タイムアタッカー',
        description: '1回のタイムアタックで5問以上回答し、合計20,000点以上でクリアする。',
        icon: 'fa-solid fa-stopwatch',
        category: 'タイムアタック',
        type: 'final',
        condition: (data, stats) => data.gameMode === 'timeAttack' && data.chapterResults.length >= 5 && data.totalScore >= 20000
    },
    'time_attack_15q': {
        name: 'クロノマスター',
        description: '1回のタイムアタックで10問以上回答し、合計40,000点以上でクリアする。',
        icon: 'fa-solid fa-user-clock',
        category: 'タイムアタック',
        type: 'final',
        condition: (data, stats) => data.gameMode === 'timeAttack' && data.chapterResults.length >= 10 && data.totalScore >= 40000
    },
    'time_attack_20q': {
        name: 'タイムエンペラー',
        description: '1回のタイムアタックで15問以上回答し、合計60,000点以上でクリアする。',
        icon: 'fa-solid fa-rocket',
        category: 'タイムアタック',
        type: 'final',
        condition: (data, stats) => data.gameMode === 'timeAttack' && data.chapterResults.length >= 15 && data.totalScore >= 60000
    },
    'time_attack_score_25k': {
        name: '時の探求者',
        description: 'タイムアタックで合計25,000点以上を獲得する。',
        icon: 'fa-solid fa-star-half-stroke',
        category: 'タイムアタック',
        type: 'final',
        condition: (data, stats) => data.gameMode === 'timeAttack' && data.totalScore >= 25000
    },
    'time_attack_score_40k': {
        name: '時の支配者',
        description: 'タイムアタックで合計40,000点以上を獲得する。',
        icon: 'fa-solid fa-crown',
        category: 'タイムアタック',
        type: 'final',
        condition: (data, stats) => data.gameMode === 'timeAttack' && data.totalScore >= 40000
    },
    'time_attack_score_55k': {
        name: '時の超越者',
        description: 'タイムアタックで合計55,000点以上を獲得する。',
        icon: 'fa-solid fa-gem',
        category: 'タイムアタック',
        type: 'final',
        condition: (data, stats) => data.gameMode === 'timeAttack' && data.totalScore >= 55000
    },
    'time_attack_score_70k': {
        name: '時間旅行者',
        description: 'タイムアタックで合計70,000点以上を獲得する。',
        icon: 'fa-solid fa-meteor',
        category: 'タイムアタック',
        type: 'final',
        condition: (data, stats) => data.gameMode === 'timeAttack' && data.totalScore >= 70000
    },
    'time_attack_no_compass': {
        name: '第六感',
        description: 'コンパスを使わずにタイムアタックをプレイし、合計30,000点以上でクリアする。',
        icon: 'fa-solid fa-eye-slash',
        category: 'タイムアタック',
        type: 'final',
        condition: (data, stats) => data.gameMode === 'timeAttack' && !data.useCompass && data.totalScore >= 30000
    },
    'time_attack_perfect_chapter': {
        name: '精密な時針',
        description: 'タイムアタック中に、3問連続で4,800点以上を獲得する。',
        icon: 'fa-solid fa-bullseye',
        category: 'タイムアタック',
        type: 'final',
        condition: (data, stats) => {
            if (data.gameMode !== 'timeAttack' || !data.chapterResults || data.chapterResults.length < 3) {
                return false;
            }
            for (let i = 0; i <= data.chapterResults.length - 3; i++) {
                if (data.chapterResults[i].score >= 4800 &&
                    data.chapterResults[i + 1].score >= 4800 &&
                    data.chapterResults[i + 2].score >= 4800) {
                    return true;
                }
            }
            return false;
        }
    },
    'time_attack_sniper': {
        name: '刹那の見切り',
        description: 'タイムアタック中に、距離0.1km未満を達成する。',
        icon: 'fa-solid fa-location-crosshairs',
        category: 'タイムアタック',
        type: 'chapter',
        condition: (data, stats) => data.gameMode === 'timeAttack' && data.distance < 0.1
    },
     'time_attack_close_call': {
        name: 'ニアピン',
        description: 'タイムアタック中に、距離0.5km未満を達成する。',
        icon: 'fa-solid fa-map-marker-alt',
        category: 'タイムアタック',
        type: 'chapter',
        condition: (data, stats) => data.gameMode === 'timeAttack' && data.distance < 0.5
    },
    'time_attack_lost': {
        name: '時空の迷子',
        description: 'タイムアタック中に、距離10,000km以上を達成する。',
        icon: 'fa-solid fa-globe',
        category: 'タイムアタック',
        type: 'chapter',
        condition: (data, stats) => data.gameMode === 'timeAttack' && data.distance >= 10000
    },
    'time_attack_minus_score': {
        name: 'タイムパラドックス',
        description: 'タイムアタックで合計スコアがマイナスになる。',
        icon: 'fa-solid fa-bomb',
        category: 'タイムアタック',
        type: 'final',
        condition: (data, stats) => data.gameMode === 'timeAttack' && data.totalScore < 0
    },
    
    // --- カテゴリ: 伝説の系譜 (変更なし) ---
    'legend_ancient_mysteries': {
        name: '叡智の残響',
        description: '５つの物語で15,000点以上を獲得する。',
        icon: 'fa-solid fa-landmark',
        category: '伝説の系譜',
        type: 'final',
        themeKey: 'ancient_mysteries',
        requiredTitles: ['アンコール王朝の謎', 'マヤ暦の最終予言', 'アトランティスの遺産', 'ハンムラビ法典の秘密', '失われた図書館の叡智'],
        condition: (data, stats) => {
            const themeStats = stats.themeScores?.['ancient_mysteries'];
            if (!themeStats) return false;
            return achievementMaster['legend_ancient_mysteries'].requiredTitles.every(title => themeStats.clearedTitles.includes(title));
        }
    },
    'legend_art_knowledge': {
        name: '創造の系譜',
        description: '５つの物語で15,000点以上を獲得する。',
        icon: 'fa-solid fa-palette',
        category: '伝説の系譜',
        type: 'final',
        themeKey: 'art_knowledge',
        requiredTitles: ['ダ・ヴィンチの失われた設計図', 'モーツァルトの未完のレクイエム', '錬金術師の遺産', 'オペラ座の怪人の遺産', '世紀の演奏会'],
        condition: (data, stats) => {
            const themeStats = stats.themeScores?.['art_knowledge'];
            if (!themeStats) return false;
            return achievementMaster['legend_art_knowledge'].requiredTitles.every(title => themeStats.clearedTitles.includes(title));
        }
    },
    'legend_japanese_chronicles': {
        name: '日出づる国の年代記',
        description: '５つの物語で15,000点以上を獲得する。',
        icon: 'fa-solid fa-torii-gate',
        category: '伝説の系譜',
        type: 'final',
        themeKey: 'japanese_chronicles',
        requiredTitles: ['失われた将軍の密書', '古代の巫女の神託', '坂本龍馬の密約', '三種の神器の秘密', 'サムライの魂を追って'],
        condition: (data, stats) => {
            const themeStats = stats.themeScores?.['japanese_chronicles'];
            if (!themeStats) return false;
            return achievementMaster['legend_japanese_chronicles'].requiredTitles.every(title => themeStats.clearedTitles.includes(title));
        }
    },
    'legend_seven_seas': {
        name: '七つの海の伝説',
        description: '５つの物語で15,000点以上を獲得する。',
        icon: 'fa-solid fa-anchor',
        category: '伝説の系譜',
        type: 'final',
        themeKey: 'seven_seas',
        requiredTitles: ['海賊王の呪われた財宝', 'キャプテン・クック最後の航海', 'バウンティ号の反乱', '大航海時代の十字架', 'オランダ東インド会社の幽霊船'],
        condition: (data, stats) => {
            const themeStats = stats.themeScores?.['seven_seas'];
            if (!themeStats) return false;
            return achievementMaster['legend_seven_seas'].requiredTitles.every(title => themeStats.clearedTitles.includes(title));
        }
    },
    'legend_shadows_of_history': {
        name: '歴史の影で',
        description: '５つの物語で15,000点以上を獲得する。',
        icon: 'fa-solid fa-user-secret',
        category: '伝説の系譜',
        type: 'final',
        themeKey: 'shadows_of_history',
        requiredTitles: ['テンプル騎士団の聖杯', '冷戦のゴースト', 'ジャンヌ・ダルクの聖旗', 'マルタ騎士団の攻防', 'カタリ派の異端文書'],
        condition: (data, stats) => {
            const themeStats = stats.themeScores?.['shadows_of_history'];
            if (!themeStats) return false;
            return achievementMaster['legend_shadows_of_history'].requiredTitles.every(title => themeStats.clearedTitles.includes(title));
        }
    },
    'legend_epic_of_illusions': {
        name: '幻想の叙事詩',
        description: '５つの物語で15,000点以上を獲得する。',
        icon: 'fa-solid fa-dragon',
        category: '伝説の系譜',
        type: 'final',
        themeKey: 'epic_of_illusions',
        requiredTitles: ['吸血鬼の追憶', 'クトゥルフの呼び声', 'ファラオの心臓', 'ムー大陸の残響', 'アビシニアン・ゴールドの伝説'],
        condition: (data, stats) => {
            const themeStats = stats.themeScores?.['epic_of_illusions'];
            if (!themeStats) return false;
            return achievementMaster['legend_epic_of_illusions'].requiredTitles.every(title => themeStats.clearedTitles.includes(title));
        }
    },
    'achieve_complete': {
        name: '実績マスター',
        description: 'この実績を除く、すべての実績を解除する。',
        icon: 'fa-solid fa-meteor',
        category: '伝説の系譜',
        type: 'final',
        condition: (data, stats) => {
            const totalAchievements = Object.keys(achievementMaster).length;
            // この実績自体と、まだ解除されていない実績が1つだけ（つまりこの実績自身）の場合
            return stats.unlockedAchievements.length >= totalAchievements - 1;
        }
    }
};

