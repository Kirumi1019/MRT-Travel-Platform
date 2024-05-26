import React from 'react';
import metroLogoPic from '@/../public/Taipei_Metro_Logo.png'
import Image from "next/image";

function MainPage() {
  // 創建一個 Date 物件,並設置時區為 Asia/Taipei (UTC+8)
  const taipeiTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Taipei' });

  return (
    <main className="flex flex-row h-screen w-full overflow-hidden">
      <div className="flex-1 w-full overflow-y-scroll overflow-x-scroll p-4">
        <header className="bg-gradient-to-r from-green-100 to-blue-100 text-gray-800 p-4 mb-4 flex items-center justify-between rounded-lg">
          <div className="flex items-center space-x-4">
            <Image src={metroLogoPic} alt="Metro Route Picture" width={80} />
            <h1 className="text-2xl font-bold">雙北捷運旅遊通</h1>
          </div>
        </header>
        {/* 添加其他內容在這裡 */}
        <div className="mb-4">
          <div className="flex gap-4">
            <div className="flex-1 p-4 bg-white shadow rounded-lg">
              <h3 className="text-lg font-semibold">當前時間 (UTC+8)</h3>
              <p>{taipeiTime}</p>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <div className="flex gap-4">
            <div className="flex-1 p-4 bg-white shadow rounded-lg">
              <h3 className="text-lg font-semibold">公告</h3>
              <p>1. 全線正常通行</p>
              <p></p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default MainPage;