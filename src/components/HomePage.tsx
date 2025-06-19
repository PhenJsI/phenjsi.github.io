import React from 'react';
import { Book, Users, Globe, Zap, Map, Sword } from 'lucide-react';
import { WikiArticle } from '../types';

interface HomePageProps {
  categorizedData: {
    "Основное": WikiArticle[];
    "Разделы": WikiArticle[];
    "Служебное": WikiArticle[];
  };
  onArticleSelect: (title: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ categorizedData, onArticleSelect }) => {
  const getSectionIcon = (title: string) => {
    if (title.includes('Космология') || title.includes('Мироздания')) return <Globe className="text-purple-600" size={24} />;
    if (title.includes('Божества') || title.includes('Силы')) return <Zap className="text-yellow-600" size={24} />;
    if (title.includes('Расы')) return <Users className="text-green-600" size={24} />;
    if (title.includes('География') || title.includes('Локации')) return <Map className="text-blue-600" size={24} />;
    if (title.includes('Конфликты') || title.includes('Атмосфера')) return <Sword className="text-red-600" size={24} />;
    return <Book className="text-gray-600" size={24} />;
  };

  const featuredArticles = [
    ...categorizedData["Основное"].filter(article => 
      article.title.includes('Космология') || 
      article.title.includes('Божества') || 
      article.title.includes('Фундаментальные')
    ),
    ...categorizedData["Разделы"].filter(article => 
      article.title.includes('Творцы') || 
      article.title.includes('Расы') || 
      article.title.includes('География')
    )
  ].slice(0, 6);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Добро пожаловать в Википедию Мира WFRP
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Интерактивная энциклопедия мира <strong>Warhammer Fantasy Roleplay (WFRP)</strong>, 
            содержащая подробную информацию о космологии, божествах, расах, механиках и локациях.
          </p>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {Object.entries(categorizedData).map(([category, articles]) => (
            <div key={category} className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">{category}</h3>
              <p className="text-3xl font-bold text-blue-700">{articles.length}</p>
              <p className="text-sm text-blue-600">статей</p>
            </div>
          ))}
        </div>

        {/* Основные разделы */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-gray-200 pb-2">
            Основные разделы
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categorizedData["Разделы"].map((article, index) => (
              <div
                key={index}
                onClick={() => onArticleSelect(article.title)}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {getSectionIcon(article.title)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                      {article.content.replace(/[#*\-]/g, '').substring(0, 120)}...
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Рекомендуемые статьи */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-gray-200 pb-2">
            Рекомендуемые статьи
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredArticles.map((article, index) => (
              <div
                key={index}
                onClick={() => onArticleSelect(article.title)}
                className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 mb-3">
                  {getSectionIcon(article.title)}
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {article.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {article.content.replace(/[#*\-]/g, '').substring(0, 150)}...
                </p>
                {article.links && article.links.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {article.links.slice(0, 3).map((link, linkIndex) => (
                      <span
                        key={linkIndex}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                      >
                        {link}
                      </span>
                    ))}
                    {article.links.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{article.links.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Последние статьи */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-gray-200 pb-2">
            Все статьи по категориям
          </h2>
          
          {Object.entries(categorizedData).map(([category, articles]) => (
            <div key={category} className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full ${
                  category === 'Основное' ? 'bg-blue-500' :
                  category === 'Разделы' ? 'bg-green-500' : 'bg-purple-500'
                }`}></span>
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {articles.map((article, index) => (
                  <button
                    key={index}
                    onClick={() => onArticleSelect(article.title)}
                    className="text-left p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:shadow-md transition-all"
                  >
                    <h4 className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                      {article.title}
                    </h4>
                    {article.links && article.links.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Связано с: {article.links.slice(0, 2).join(', ')}
                        {article.links.length > 2 && '...'}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Информация */}
        <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">О данной википедии</h3>
          <p className="text-gray-700 mb-3">
            Эта интерактивная энциклопедия создана для изучения и расширения знаний о мире WFRP. 
            Вы можете не только читать существующие статьи, но и создавать новые, 
            добавляя собственную информацию о мире.
          </p>
          <p className="text-sm text-gray-600">
            <strong>Навигация:</strong> Используйте боковое меню для быстрого перемещения между категориями, 
            поиск для нахождения конкретных статей, или создавайте новые темы с помощью соответствующей кнопки.
          </p>
        </div>
      </div>
    </div>
  );
};
