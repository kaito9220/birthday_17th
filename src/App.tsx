import { useState, useEffect } from 'react';
import { Gift, PartyPopper, CheckCircle2, MessageCircle, Send, ChevronUp } from 'lucide-react';

// --- 設定・カスタマイズ部分 ---
// プレゼント1の4つの選択肢をここで設定します
const GIFT1_OPTIONS = [
  "美術館に行く",
  "映画を観に行く",
  "東京観光に行く",
  "なんかサブスクとか"
];

// LINEで送る際の定型文（入力されたテキストの前後に付けられます）
const createLineMessage = (text: string) => {
  return `【誕生日プレゼント】\n${text}\n\nこれをお願いします！`;
};
// ------------------------------

export default function App() {
  // すべての状態を1つのオブジェクトにまとめ、初期値としてlocalStorageから読み込む
  const [gameState, setGameState] = useState(() => {
    const saved = localStorage.getItem('birthday_gift_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("保存データの読み込みに失敗しました");
      }
    }
    // 初期状態
    return {
      gift1: { status: 'closed', choice: '' }, // status: 'closed' | 'selecting' | 'completed'
      gift2: { status: 'closed', text: '' }    // status: 'closed' | 'inputting' | 'completed'
    };
  });

  const [showCelebration, setShowCelebration] = useState(false);

  // 状態が変化するたびにlocalStorageに保存する
  useEffect(() => {
    localStorage.setItem('birthday_gift_state', JSON.stringify(gameState));
    
    // 両方が完了(completed)になったらお祝いアニメーションを表示
    if (gameState.gift1.status === 'completed' && gameState.gift2.status === 'completed') {
      const timer = setTimeout(() => setShowCelebration(true), 500);
      return () => clearTimeout(timer);
    } else {
      setShowCelebration(false);
    }
  }, [gameState]);

  // --- 状態更新のヘルパー関数 ---
  const updateGift1 = (updates: any) => {
    setGameState((prev: any) => ({ ...prev, gift1: { ...prev.gift1, ...updates } }));
  };
  const updateGift2 = (updates: any) => {
    setGameState((prev: any) => ({ ...prev, gift2: { ...prev.gift2, ...updates } }));
  };

  // LINE送信処理
  const handleLineSend = () => {
    const message = createLineMessage(gameState.gift2.text);
    const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(message)}`;
    
    // LINEアプリ（またはウェブ）を開く
    window.open(lineUrl, '_blank');
    
    // 状態を完了にする
    updateGift2({ status: 'completed' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-red-50 to-yellow-100 flex flex-col items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden">
      
      <div className="max-w-2xl w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 sm:p-10 z-10 my-8">
        
        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400 mb-2 text-center">
          Happy Birthday!
        </h1>
        
        <p className="text-base sm:text-lg text-gray-600 mb-8 text-center">
          {(gameState.gift1.status === 'completed' && gameState.gift2.status === 'completed')
            ? <span className="text-pink-500 font-bold animate-pulse">おめ</span>
            : "何が欲しいのか僕にはわかりません🎁"}
        </p>

        {/* プレゼントのコンテナ（縦並びベース） */}
        <div className="flex flex-col gap-8">
          
          {/* ==================== プレゼント1 ==================== */}
          <div className="w-full bg-pink-50 rounded-2xl border-2 border-pink-200 p-6 transition-all duration-500">
            {gameState.gift1.status === 'closed' ? (
              // 閉まっている状態
              <button
                onClick={() => updateGift1({ status: 'selecting' })}
                className="w-full h-40 flex flex-col items-center justify-center gap-3 bg-white rounded-xl border-2 border-pink-300 hover:bg-pink-100 transition shadow-sm"
              >
                <Gift className="text-pink-400" size={48} />
                <h3 className="text-xl font-bold text-gray-800">1つ目のプレゼント</h3>
                <p className="text-sm text-gray-500">タップして開ける</p>
              </button>
            ) : gameState.gift1.status === 'selecting' ? (
              // 選択中の状態
              <div className="animate-fade-in">
                <div className="flex items-center gap-2 mb-4 justify-center">
                  <Gift className="text-pink-500" size={24} />
                  <h3 className="text-xl font-bold text-gray-800">この中から一つ選んでください</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {GIFT1_OPTIONS.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => updateGift1({ choice: option })}
                      className={`p-3 rounded-xl border-2 text-sm sm:text-base transition-all ${
                        gameState.gift1.choice === option
                          ? 'bg-pink-500 border-pink-500 text-white font-bold shadow-md transform scale-105'
                          : 'bg-white border-pink-200 text-gray-700 hover:border-pink-400'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => updateGift1({ status: 'completed' })}
                  disabled={!gameState.gift1.choice}
                  className={`w-full py-3 rounded-xl font-bold text-white transition-all ${
                    gameState.gift1.choice 
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:shadow-lg transform hover:-translate-y-1' 
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  これに決定！
                </button>
                <button
                  onClick={() => updateGift1({ status: 'closed' })}
                  className="w-full mt-3 py-3 rounded-xl bg-white border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition font-bold flex items-center justify-center gap-2 shadow-sm"
                >
                  <ChevronUp size={20} />
                  箱を閉じる
                </button>
              </div>
            ) : (
              // 完了状態
              <div className="flex flex-col items-center text-center animate-fade-in">
                <CheckCircle2 className="text-pink-500 mb-2" size={40} />
                <h3 className="text-lg font-bold text-gray-800 mb-2">決定したプレゼント</h3>
                <div className="bg-white px-6 py-3 rounded-full border border-pink-200 shadow-sm">
                  <span className="text-pink-600 font-bold">{gameState.gift1.choice}</span>
                </div>
                <p className="text-sm text-gray-500 mt-3">楽しみに待っててね</p>
              </div>
            )}
          </div>

          {/* ==================== プレゼント2 ==================== */}
          <div className="w-full bg-orange-50 rounded-2xl border-2 border-orange-200 p-6 transition-all duration-500">
            {gameState.gift2.status === 'closed' ? (
              // 閉まっている状態
              <button
                onClick={() => updateGift2({ status: 'inputting' })}
                className="w-full h-40 flex flex-col items-center justify-center gap-3 bg-white rounded-xl border-2 border-orange-300 hover:bg-orange-100 transition shadow-sm"
              >
                <Gift className="text-orange-400" size={48} />
                <h3 className="text-xl font-bold text-gray-800">2つ目のプレゼント</h3>
                <p className="text-sm text-gray-500">タップして開ける</p>
              </button>
            ) : gameState.gift2.status === 'inputting' ? (
              // 入力中の状態
              <div className="animate-fade-in">
                <div className="flex items-center gap-2 mb-4 justify-center">
                  <Gift className="text-orange-500" size={24} />
                  <h3 className="text-xl font-bold text-gray-800">欲しいものを書いて送ってください</h3>
                </div>
                <p className="text-sm text-gray-600 text-center mb-4">
                  ほしいものを入力してLINEで送ってくれい
                </p>
                <textarea
                  value={gameState.gift2.text}
                  onChange={(e) => updateGift2({ text: e.target.value })}
                  placeholder="高すぎるものは無理です"
                  className="w-full h-24 p-3 rounded-xl border-2 border-orange-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none resize-none mb-4 text-gray-700"
                />
                <button
                  onClick={handleLineSend}
                  disabled={!gameState.gift2.text.trim()}
                  className={`w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${
                    gameState.gift2.text.trim()
                      ? 'bg-[#06C755] hover:bg-[#05b34c] hover:shadow-lg transform hover:-translate-y-1' 
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  <MessageCircle size={20} />
                  LINEで送信する
                </button>
                <button
                  onClick={() => updateGift2({ status: 'closed' })}
                  className="w-full mt-3 py-3 rounded-xl bg-white border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition font-bold flex items-center justify-center gap-2 shadow-sm"
                >
                  <ChevronUp size={20} />
                  箱を閉じる
                </button>
              </div>
            ) : (
              // 完了状態
              <div className="flex flex-col items-center text-center animate-fade-in">
                <Send className="text-[#06C755] mb-2" size={40} />
                <h3 className="text-lg font-bold text-gray-800 mb-2">送信完了</h3>
                <p className="text-gray-600 text-sm mb-3">以下のメッセージを受け付けました</p>
                <div className="bg-white w-full p-3 rounded-xl border border-orange-200 shadow-sm text-left">
                  <p className="text-gray-700 whitespace-pre-wrap">{gameState.gift2.text}</p>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* コンプリート時の隠しメッセージ */}
        <div className={`mt-8 transition-all duration-1000 overflow-hidden ${showCelebration ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="p-6 bg-gradient-to-r from-pink-100 to-orange-100 rounded-xl border border-pink-200 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
              <PartyPopper className="text-pink-500" />
              お誕生日おめでとう
              <PartyPopper className="text-orange-500" />
            </h2>
            <p className="text-gray-700 mt-2">
              本棚早く移動してください<br/>
              アンガーマネジメント頑張るので頑張ってください
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}