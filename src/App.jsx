import ProductCard from './components/ProductCard';
import './App.scss';

const products = [
  {
    id: 1,
    image: 'https://avatars.mds.yandex.net/i?id=2b51fc55da95cc65acffd0b8b1cf710d7a9db6e1-4382526-images-thumbs&n=13',
    title: 'Умные часы Premium',
    description: 'Стильные умные часы с AMOLED дисплеем, мониторингом здоровья и водозащитой IP68.',
    price: '12 990',
    badge: { text: 'Новинка', variant: 'default' }
  },
  {
    id: 2,
    image: 'https://yandex-images.clstorage.net/g5p2CT151/5a5e14p_M/JIn4Hyx3eXX7ZCiMicwhlKNUxMElNlgAF1si_g9YXkMHl5xoS-PxJ5p5T6Zjno6fC-5qRiCwzZEj_VGbjT-7oDG0uQodan0sqjUw4dnsLYCrIbHNYUcwEWMyK497EGJ_F5-MheonZPdzlYpfpzN-4k6zJl5E2ICAmkxFT9TvvkSsdUDv6Ff4LXf44eDNqB0sFxFMzaU7VEHb8zunYxnSflYKyK1OQ7wzNxGGYwsDUgpixyoacXhs7Kql2Tc0Zy7EDDXkq4iDdIFDaHWopSyxiDM9tP1VgzQVy8tzSytxNn62YkRFIhM0o-sRXtsXN5bmLid6lp3Q0GBKFeVTvHP6fOj5YC8wD6x501DViOlADZyr7dRdpS-sAQ9Hl2uHZUpOCh7kZaYPVFtf5XY_gxvikp6n4qq9pFAQjlHxG7j_rhjkXaTbLLP8FfPwDdB5TB3Ui_3EGR0_qB2LJ4-fm31KkiJOcNmKL9yn62UeswdTGj7GXwKOfYBYbDYBFXs4V5ZIvGWwmzhnoGV_QH14jaABTFdxKMkNv2ARC0Nzz8OJWoaCYhCpjoPAlyNJhsNvU6Ka_oPSEm2EYBy-LeGTHMceFKgVHJM47yCBhxBBvCFMIYjnZSTxgStQbe8Xg7fjiVpeZg5YPVoDuHPnZV5PnxsmUla3npIZVAgQXvnd-1BXKkxEWXSbFJcQffM4Jaw1XKXsd-0k0b2r6I0rmwdPp0luSsriXE0es-jLK52OI3sHHq4Kg-JanUDo_AKlCcNcAzpEYP1AJ7T7DFF_8Emc1cwt4JN9pPUhU4BBr2ePh1cFnhKu8mzJtmNo18-9dhtnD2rO4usurkHM2GS22V2nBMcO1PztTGPw3wiVB0CxnH3QFWwjFVzl9fPA4S_PV4OTeaqu7j4AVYazQONbbQovbw_Kwu7rIoKF8JiM3p3Jo7Dzprx43SD_uLMsBYu0gQghQDlAd42YdX3fWGFz6-OXp5XA',
    title: 'Беспроводные наушники',
    description: 'Наушники с активным шумоподавлением и кристально чистым звуком. До 30 часов работы.',
    price: '8 490'
  },
  {
    id: 3,
    image: 'https://avatars.mds.yandex.net/get-marketpic/11658607/pic0e27d13844bc5d88752b7a08fe2522be/orig',
    title: 'Камера Polaroid',
    description: 'Ретро-камера для мгновенных снимков. Встроенная вспышка и автоматическая экспозиция.',
    price: '6 390',
    oldPrice: '7 990',
    badge: { text: '-20%', variant: 'sale' }
  }
];

function App() {
  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Каталог товаров</h1>
        <p className="app__subtitle">Лучшие гаджеты для вашей жизни</p>
      </header>

      <main className="app__products">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </main>
    </div>
  );
}

export default App;
