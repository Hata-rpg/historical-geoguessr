const novelScenes = [
    {
        id: 'prologue',
        title: "プロローグ：歴史の漂流者",
        script: [
            { type: 'background', image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2070&auto=format&fit=crop' },
            { type: 'narration', text: '財団法人「ヒストリカル・ジオゲッサー協会」、通称HGG。俺たち歴史調査員の仕事は、歴史の影に埋もれた「真実」が眠る場所を特定することだ。' },
            { type: 'narration', text: 'その日、協会のオフィスは、いつものように静かな時間が流れていた。俺が次の調査資料に目を通していると、上司が不意にドアを開けた。' },
            { type: 'sprite', character: 'boss', image: 'https://placehold.co/600x900/333333/ffffff?text=Boss', position: 'left', effect: 'fadeIn' },
            { type: 'dialogue', character: '上司', text: 'キャスター、ちょっといいか。' },
            { type: 'narration', text: '上司の後ろには、見慣れない少女が不安そうな顔で立っていた。' },
            { type: 'sprite', character: 'annie', image: 'girl.png', position: 'right', effect: 'fadeIn' },
            { type: 'dialogue', character: '上司', text: '今日からこいつがお前の助手だ。名前はアニー。それ以外の記憶がない。しばらくここで預かることになった。' },
            { type: 'dialogue', character: 'キャスター', text: '…また、ですか。埠頭に？' },
            { type: 'dialogue', character: '上司', text: 'ああ。小舟でな。こいつも「歴史の漂流者（ロスト・ヒストリカル）」で間違いないだろう。…正体は不明だがな。' },
            { type: 'dialogue', character: 'アニー', text: '……。' },
            { type: 'dialogue', character: 'キャスター', text: '（記憶がない、か…。俺の仕事は、彼女の失われた記憶の航路を、最後まで見届けること。ただ、それだけだ）' },
            { type: 'end' }
        ]
    },
    {
        id: 'chapter1',
        title: "第1章：静かな助手",
        script: [
            { type: 'background', image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=2070&auto=format&fit=crop' },
            { type: 'sprite', character: 'annie', image: 'girl.png', position: 'center', effect: 'fadeIn' },
            { type: 'narration', text: 'アニーが助手になって数週間。彼女は宿舎の一室で暮らしながら、黙々と仕事を手伝ってくれた。' },
            { type: 'dialogue', character: 'キャスター', text: 'ここでの生活は慣れたかい？' },
            { type: 'dialogue', character: 'アニー', text: 'はい、なんとか。…でも、時々、自分が誰なのか分からなくなって、不安になります。' },
            { type: 'dialogue', character: 'キャスター', text: '焦る必要はない。記憶は、ふとした瞬間に戻るものだ。' },
            { type: 'dialogue', character: 'アニー', text: 'だと、いいんですけど…。' },
            { type: 'narration', text: '彼女は窓の外、遠い埠頭のほうを見つめていた。その瞳には、俺には計り知れない、深い海の記憶が揺れているように見えた。' },
            { type: 'end' }
        ]
    },
    {
        id: 'chapter2',
        title: "第2章：嵐の夢",
        script: [
            { type: 'background', image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=2070&auto=format&fit=crop' },
            { type: 'narration', text: 'ある夜、宿舎からアニーのうめき声が聞こえ、様子を見に行った。' },
            { type: 'sprite', character: 'annie_nightmare', image: 'girl.png', position: 'center', effect: 'shake' },
            { type: 'dialogue', character: 'アニー', text: 'やめて…！ 嵐が…！ メアリ…！' },
            { type: 'narration', text: '彼女はひどく魘されていた。まるで、荒れ狂う船の上にいるかのように、体を固くしている。' },
            { type: 'dialogue', character: 'キャスター', text: '（メアリ…？ 人の名前か。彼女の過去に関係があるのかもしれないな）' },
            { type: 'narration', text: '俺は彼女を起こさないように、静かに部屋を後にした。彼女の記憶の嵐は、俺の想像以上に激しいものなのかもしれない。' },
            { type: 'end' }
        ]
    },
    {
        id: 'chapter3',
        title: "第3章：魔術と記憶",
        script: [
            { type: 'background', image: 'https://images.unsplash.com/photo-1618256228784-65946914b433?q=80&w=1974&auto=format&fit=crop' },
            { type: 'sprite', character: 'annie', image: 'girl.png', position: 'right', effect: 'fadeIn' },
            { type: 'sprite', character: 'caster', image: 'https://placehold.co/600x900/000000/ffffff?text=Caster', position: 'left', effect: 'fadeIn' },
            { type: 'dialogue', character: 'キャスター', text: 'アニー。君の記憶を取り戻すために、力を貸してほしい。' },
            { type: 'dialogue', character: 'アニー', text: '力…？' },
            { type: 'dialogue', character: 'キャスター', text: '実は…少しだけ魔術が使えるんだ。君の魂に直接触れて、記憶を呼び覚ます手伝いができる。' },
            { type: 'narration', text: '俺はアニーの額にそっと手を触れ、魔力を注ぎ込んだ。彼女の閉ざされた記憶の扉が、ゆっくりと開いていく。' },
            { type: 'narration', text: '…見えた。絞首台、群衆の罵声、そして、最後まで誇り高く空を見上げる一人の男の姿が。' },
            { type: 'dialogue', character: 'アニー', text: 'あ…ジャック…！' },
            { type: 'narration', text: '彼女の口から、恋人だった男の名がこぼれる。ジョン・ラカム。彼女がアン・ボニーであった頃の、最後の記憶だ。' },
            { type: 'end' }
        ]
    },
    {
        id: 'epilogue',
        title: "エピローグ：俺の選んだ航路",
        script: [
            { type: 'background', image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2070&auto=format&fit=crop' },
            { type: 'narration', text: '全ての記憶を取り戻した彼女…アン・ボニーを、俺たちは元の時代に帰した。歴史は守られ、任務は完了したはずだった。' },
            { type: 'narration', text: '…数日後。俺のオフィスに、見慣れた姿があった。' },
            { type: 'sprite', character: 'annie', image: 'girl.png', position: 'center', effect: 'fadeIn' },
            { type: 'dialogue', character: 'アニー', text: 'よぉ、キャスター。私を置いて次の調査に行くなんて、ひどいじゃないか。' },
            { type: 'narration', text: '歴史上の役割を終えた彼女は、その後の人生を自分で選ぶ「自由」を得たのだ。そして、彼女が選んだ新しい航路は、俺と共に歩む道だった。' },
            { type: 'dialogue', character: 'キャスター', text: '（やれやれ、手のかかる助手だ…）' },
            { type: 'dialogue', character: 'キャスター', text: '…行くか。俺たちの調査は、まだ始まったばかりだからな。' },
            { type: 'end' }
        ]
    }
];
