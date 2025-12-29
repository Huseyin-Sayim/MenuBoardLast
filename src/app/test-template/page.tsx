import React from 'react';

const menuData = {
  sideProducts: [
    { id: 1, name: 'SOĞAN HALKASI', price: '34,99', img: 'https://cdn.pixabay.com/photo/2020/10/05/19/55/hamburger-5630646_1280.jpg' },
    { id: 2, name: 'CHEESECAKE', price: '59,99', img: 'https://cdn.pixabay.com/photo/2020/10/05/19/55/hamburger-5630646_1280.jpg' },
    { id: 3, name: 'DONDURMA', price: '25,00', img: 'https://cdn.pixabay.com/photo/2020/10/05/19/55/hamburger-5630646_1280.jpg' },
    { id: 4, name: 'PATATES KIZARTMASI', price: '44,99', img: 'https://cdn.pixabay.com/photo/2016/11/20/09/06/bowl-1842294_1280.jpg' },
  ],
  mainMenus: [
    { id: 5, name: 'BIG KING', subName: 'KLASİK MENÜ', price: '185,00', img: 'https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_1280.jpg' },
    { id: 6, name: 'WHOPPER', subName: 'EFSANE MENÜ', price: '195,00', img: 'https://cdn.pixabay.com/photo/2020/10/05/19/55/hamburger-5630646_1280.jpg' },
    { id: 7, name: 'ZURNA DÜRÜM', subName: 'PREMIUM MENÜ', price: '225,00', img: 'https://cdn.pixabay.com/photo/2020/10/05/19/55/hamburger-5630646_1280.jpg' },
    { id: 8, name: 'ÇİFTTE BURGER', subName: 'DOYURUCU MENÜ', price: '210,00', img: 'https://cdn.pixabay.com/photo/2020/10/05/19/55/hamburger-5630646_1280.jpg' },
    { id: 9, name: 'ÖZEL STEAK', subName: 'BARBEKÜ MENÜ', price: '210,00', img: 'https://cdn.pixabay.com/photo/2020/10/05/19/55/hamburger-5630646_1280.jpg' },
    { id: 10, name: 'TAVUK MENÜ', subName: 'ÇITIR MENÜ', price: '145,00', img: 'https://cdn.pixabay.com/photo/2023/05/29/17/01/hamburger-8026582_1280.jpg' },
  ]
};

const MenuBoard = () => {
  return (
    <div className="bg-black text-white h-screen w-screen overflow-hidden font-sans p-4 flex items-center justify-center">
      <div className="grid grid-cols-12 gap-4 w-full h-full max-h-screen">

        <div className="col-span-3 flex flex-col justify-between bg-zinc-900/40 rounded-3xl p-4 border border-zinc-800">
          <h3 className="text-yellow-500 font-black text-center text-lg italic uppercase border-b border-zinc-800 pb-2">Yan Ürünler</h3>
          {menuData.sideProducts.map(item => (
            <div key={item.id} className="flex flex-col items-center flex-1 justify-center">
              <img src={item.img} className="w-20 h-20 xl:w-28 xl:h-28 object-cover rounded-full border-2 border-yellow-500" />
              <h3 className="text-[10px] xl:text-xs font-bold text-zinc-400 mt-2 uppercase">{item.name}</h3>
              <p className="text-xl xl:text-2xl font-black text-yellow-500 italic leading-none">₺{item.price}</p>
            </div>
          ))}
        </div>

        {/* SAĞ TARAF - ANA MENÜLER (2 Sütun, 3 Satır tam sığacak şekilde) */}
        <div className="col-span-9 grid grid-cols-2 grid-rows-3 gap-4">
          {menuData.mainMenus.map(menu => (
            <div key={menu.id} className="bg-zinc-800/20 border border-zinc-700/30 rounded-[2.5rem] p-4 flex items-center overflow-hidden">
              <div className="w-1/3 h-full">
                <img src={menu.img} className="w-full h-full object-cover rounded-2xl shadow-xl" />
              </div>

              <div className="ml-6 w-2/3">
                <h2 className="text-2xl xl:text-4xl font-black italic tracking-tighter uppercase leading-tight truncate">{menu.name}</h2>
                <p className="text-yellow-500 font-bold text-[10px] xl:text-xs tracking-[0.2em] mb-2">{menu.subName}</p>
                <div className="bg-white text-black px-4 py-1 inline-block font-black text-xl xl:text-3xl rotate-[-2deg] rounded-sm">
                  ₺{menu.price}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default MenuBoard;