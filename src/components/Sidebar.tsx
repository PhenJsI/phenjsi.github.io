import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Home, Plus, Search, LogIn, LogOut, User, Shield } from 'lucide-react';
import { WikiArticle, User as UserType } from '../types';

interface SidebarProps {
  categorizedData: {
    "Основное": WikiArticle[];
    "Разделы": WikiArticle[];
    "Служебное": WikiArticle[];
  };
  onArticleSelect: (title: string) => void;
  onHomeClick: () => void;
  onCreateNew: () => void;
  onLogin: () => void;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchResults: WikiArticle[];
  isAuthenticated: boolean;
  user: UserType | null;
  canCreate: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  categorizedData,
  onArticleSelect,
  onHomeClick,
  onCreateNew,
  onLogin,
  onLogout,
  searchQuery,
  onSearchChange,
  searchResults,
  isAuthenticated,
  user,
  canCreate
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['Основное', 'Разделы', 'Служебное'])
  );

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const categoryColors = {
    "Основное": "bg-blue-50 text-blue-700 border-blue-200",
    "Разделы": "bg-green-50 text-green-700 border-green-200",
    "Служебное": "bg-purple-50 text-purple-700 border-purple-200"
  };

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 h-screen fixed left-0 top-0 overflow-y-auto">
      {/* Заголовок */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <h1 className="text-lg font-bold text-gray-900">WFRP Википедия</h1>
        
        {/* Статус авторизации */}
        {isAuthenticated && user ? (
          <div className="mt-2 flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1 text-green-700">
              <Shield size={14} />
              <span className="font-medium">{user.username}</span>
            </div>
            <span className="text-gray-500">•</span>
            <span className="text-gray-600">Администратор</span>
          </div>
        ) : (
          <div className="mt-2 flex items-center gap-1 text-sm text-gray-600">
            <User size={14} />
            <span>Гость</span>
          </div>
        )}
      </div>

      {/* Навигация */}
      <div className="p-3 border-b border-gray-200 bg-white space-y-2">
        <button
          onClick={onHomeClick}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        >
          <Home size={16} />
          Главная страница
        </button>
        
        {/* Авторизация */}
        {isAuthenticated ? (
          <>
            {canCreate && (
              <button
                onClick={onCreateNew}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                <Plus size={16} />
                Создать новую тему
              </button>
            )}
            
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-700 hover:bg-red-50 rounded-md transition-colors border border-red-200"
            >
              <LogOut size={16} />
              Выйти из системы
            </button>
          </>
        ) : (
          <button
            onClick={onLogin}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-green-700 hover:bg-green-50 rounded-md transition-colors border border-green-200"
          >
            <LogIn size={16} />
            Войти в систему
          </button>
        )}
      </div>

      {/* Поиск */}
      <div className="p-3 border-b border-gray-200 bg-white">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Поиск по статьям..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Результаты поиска */}
        {searchQuery && (
          <div className="mt-2 max-h-60 overflow-y-auto">
            {searchResults.length > 0 ? (
              <div className="space-y-1">
                {searchResults.map((article, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      onArticleSelect(article.title);
                      onSearchChange('');
                    }}
                    className="w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded border-l-2 border-yellow-400"
                  >
                    <div className="font-medium">{article.title}</div>
                    <div className="text-xs text-gray-500">{article.category}</div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 p-2">Ничего не найдено</div>
            )}
          </div>
        )}
      </div>

      {/* Категории */}
      <div className="p-3">
        <h2 className="text-sm font-semibold text-gray-600 mb-3">Навигация</h2>
        
        {Object.entries(categorizedData).map(([category, articles]) => (
          <div key={category} className="mb-3">
            <button
              onClick={() => toggleCategory(category)}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md border transition-colors ${
                categoryColors[category as keyof typeof categoryColors]
              }`}
            >
              <span className="font-medium">{category}</span>
              <div className="flex items-center gap-1">
                <span className="text-xs">({articles.length})</span>
                {expandedCategories.has(category) ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
              </div>
            </button>

            {expandedCategories.has(category) && (
              <div className="mt-1 ml-2 space-y-1">
                {articles.map((article, index) => (
                  <button
                    key={index}
                    onClick={() => onArticleSelect(article.title)}
                    className="w-full text-left px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded border-l-2 border-transparent hover:border-blue-300 transition-colors"
                  >
                    {article.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
