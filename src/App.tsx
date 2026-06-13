import { useState, useEffect } from 'react';
import { Gift, Heart, Sparkles, PartyPopper, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [gift1Opened, setGift1Opened] = useState(false);
  const [gift2Opened, setGift2Opened] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // 両方のプレゼントが開かれたかチェック
  const bothOpened = gift1Opened && gift2Opened;

  useEffect(() => {
    if (bothOpened) {
      // 両方開いた後、少し遅れてお祝いメッセージを表示
      const timer = setTimeout(() => {
        setShowCelebration(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [bothOpened]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-red-50 to-yellow-100 flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
      
      {/* 装飾用の背景要素 */}
      <div className="absolute top-10 left-10 text-pink-300 opacity-50 animate-bounce">
        <Sparkles size={48} />
      </div>
      <div className="absolute bottom-20 right-10 text-yellow-300 opacity-50 animate-pulse">
        <PartyPopper size={64} />
      </div>

      <div className="max-w-2xl w-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-12 text-center z-10">
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400 mb-4 animate-fade-in-down">
          Happy Birthday!
        </h1>
        
        {!bothOpened ? (
          <p className="text-lg text-gray-600 mb-10">
            プレゼントを2つ用意しました！<br/>どっちから開けてみる？
          </p>
        ) : (
          <p className="text-lg text-pink-500 font-bold mb-10 animate-pulse">
            2つとも開けてくれてありがとう！
          </p>
        )}

        <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch">
          
          {/* プレゼント1のボタン */}
          <div className={`flex-1 transition-all duration-500 transform ${gift1Opened ? 'scale-105' : 'hover:-translate-y-2'}`}>
            <button
              onClick={() => setGift1Opened(true)}
              disabled={gift1Opened}
              className={`w-full h-full p-6 rounded-2xl border-4 flex flex-col items-center justify-center gap-4 transition-all duration-300
                ${gift1Opened 
                  ? 'bg-pink-50 border-pink-200 cursor-default' 
                  : 'bg-white border-pink-400 hover:bg-pink-100 hover:shadow-lg hover:shadow-pink-200 cursor-pointer'}`}
            >
              {gift1Opened ? (
                <>
                  <div className="bg-pink-500 text-white p-4 rounded-full animate-bounce">
                    <Heart size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">1つ目のプレゼント</h3>
                  <p className="text-sm text-gray-600">
                    ずっと欲しがっていたアレです！<br/>毎日の生活で使ってね。
                  </p>
                  <CheckCircle2 className="text-pink-500 mt-2" size={24} />
                </>
              ) : (
                <>
                  <div className="text-pink-400">
                    <Gift size={64} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">プレゼント A</h3>
                  <p className="text-sm text-gray-500">タップして開ける</p>
                </>
              )}
            </button>
          </div>

          {/* プレゼント2のボタン */}
          <div className={`flex-1 transition-all duration-500 transform ${gift2Opened ? 'scale-105' : 'hover:-translate-y-2'}`}>
            <button
              onClick={() => setGift2Opened(true)}
              disabled={gift2Opened}
              className={`w-full h-full p-6 rounded-2xl border-4 flex flex-col items-center justify-center gap-4 transition-all duration-300
                ${gift2Opened 
                  ? 'bg-orange-50 border-orange-200 cursor-default' 
                  : 'bg-white border-orange-400 hover:bg-orange-100 hover:shadow-lg hover:shadow-orange-200 cursor-pointer'}`}
            >
              {gift2Opened ? (
                <>
                  <div className="bg-orange-500 text-white p-4 rounded-full animate-bounce">
                    <Sparkles size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">2つ目のプレゼント</h3>
                  <p className="text-sm text-gray-600">
                    一緒に楽しめるものを選びました。<br/>今度の週末に使おう！
                  </p>
                  <CheckCircle2 className="text-orange-500 mt-2" size={24} />
                </>
              ) : (
                <>
                  <div className="text-orange-400">
                    <Gift size={64} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">プレゼント B</h3>
                  <p className="text-sm text-gray-500">タップして開ける</p>
                </>
              )}
            </button>
          </div>

        </div>

        {/* コンプリート時の隠しメッセージ */}
        <div className={`mt-10 transition-all duration-1000 overflow-hidden ${showCelebration ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="p-6 bg-gradient-to-r from-pink-100 to-orange-100 rounded-xl border border-pink-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
              <PartyPopper className="text-pink-500" />
              お誕生日おめでとう！
              <PartyPopper className="text-orange-500" />
            </h2>
            <p className="text-gray-700">
              素敵な一年になりますように。<br/>これからもずっとよろしくね！
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}