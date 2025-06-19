import React, { useState } from 'react';
import { useWikiData } from './hooks/useWikiData';
import { useAuth } from './hooks/useAuth';
import { Sidebar } from './components/Sidebar';
import { WikiArticle } from './components/WikiArticle';
import { CreateArticle } from './components/CreateArticle';
import { EditArticle } from './components/EditArticle';
import { LoginForm } from './components/LoginForm';
import { HomePage } from './components/HomePage';
import { WikiArticle as WikiArticleType } from './types';

type ViewMode = 'home' | 'article' | 'create' | 'edit' | 'login';

function App() {
  const {
    wikiData,
    loading,
    error,
    addArticle,
    updateArticle,
    getCategorizedData,
    searchArticles,
    getArticleByKey,
    findArticleKey
  } = useWikiData();

  const {
    login,
    logout,
    isAuthenticated,
    user,
    canEdit,
    canCreate
  } = useAuth();

  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [currentArticle, setCurrentArticle] = useState<WikiArticleType | null>(null);
  const [currentArticleKey, setCurrentArticleKey] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const categorizedData = getCategorizedData();
  const searchResults = searchArticles(searchQuery);

  // Обработчики событий
  const handleArticleSelect = (title: string) => {
    const article = wikiData[title];
    const articleKey = findArticleKey(title);
    if (article && articleKey) {
      setCurrentArticle(article);
      setCurrentArticleKey(articleKey);
      setCurrentView('article');
      setSearchQuery('');
    }
  };

  const handleHomeClick = () => {
    setCurrentView('home');
    setCurrentArticle(null);
    setCurrentArticleKey('');
    setSearchQuery('');
  };

  const handleCreateNew = () => {
    if (!canCreate()) {
      alert('Для создания статей необходимо авторизоваться как администратор');
      return;
    }
    setCurrentView('create');
    setCurrentArticle(null);
    setCurrentArticleKey('');
    setSearchQuery('');
  };

  const handleEditArticle = (articleKey: string) => {
    if (!canEdit()) {
      alert('Для редактирования статей необходимо авторизоваться как администратор');
      return;
    }
    const article = getArticleByKey(articleKey);
    if (article) {
      setCurrentArticle(article);
      setCurrentArticleKey(articleKey);
      setCurrentView('edit');
    }
  };

  const handleSaveArticle = (title: string, article: WikiArticleType) => {
    addArticle(title, article);
    setCurrentArticle(article);
    setCurrentArticleKey(title);
    setCurrentView('article');
    alert('Статья успешно создана!');
  };

  const handleUpdateArticle = (key: string, article: WikiArticleType) => {
    updateArticle(key, article);
    setCurrentArticle(article);
    setCurrentView('article');
    alert('Статья успешно обновлена!');
  };

  const handleCancelCreate = () => {
    setCurrentView('home');
  };

  const handleCancelEdit = () => {
    setCurrentView('article');
  };

  // Обработчики авторизации
  const handleLoginClick = () => {
    setCurrentView('login');
  };

  const handleLogin = (username: string, password: string): boolean => {
    const success = login(username, password);
    if (success) {
      setCurrentView('home');
    }
    return success;
  };

  const handleLogout = () => {
    logout();
    setCurrentView('home');
    setCurrentArticle(null);
    setCurrentArticleKey('');
    alert('Вы вышли из системы');
  };

  const handleCancelLogin = () => {
    setCurrentView('home');
  };

  const handleLinkClick = (linkTitle: string) => {
    // Попытка найти статью по ссылке
    const article = wikiData[linkTitle];
    if (article) {
      handleArticleSelect(linkTitle);
    } else {
      // Ищем статьи, которые содержат этот текст в заголовке
      const foundArticles = Object.entries(wikiData).filter(([key, article]) =>
        article.title.toLowerCase().includes(linkTitle.toLowerCase()) ||
        key.toLowerCase().includes(linkTitle.toLowerCase())
      );
      
      if (foundArticles.length > 0) {
        handleArticleSelect(foundArticles[0][1].title);
      } else {
        alert(`Статья "${linkTitle}" не найдена. Вы можете создать её!`);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка данных википедии...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Ошибка загрузки</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Боковая панель */}
      <Sidebar
        categorizedData={categorizedData}
        onArticleSelect={handleArticleSelect}
        onHomeClick={handleHomeClick}
        onCreateNew={handleCreateNew}
        onLogin={handleLoginClick}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchResults={searchResults}
        isAuthenticated={isAuthenticated}
        user={user}
        canCreate={canCreate()}
      />

      {/* Основной контент */}
      <div className="flex-1 ml-64">
        {currentView === 'home' && (
          <HomePage
            categorizedData={categorizedData}
            onArticleSelect={handleArticleSelect}
          />
        )}

        {currentView === 'article' && currentArticle && (
          <WikiArticle
            article={currentArticle}
            articleKey={currentArticleKey}
            onLinkClick={handleLinkClick}
            onEdit={handleEditArticle}
            canEdit={canEdit()}
          />
        )}

        {currentView === 'create' && (
          <CreateArticle
            onSave={handleSaveArticle}
            onCancel={handleCancelCreate}
          />
        )}

        {currentView === 'edit' && currentArticle && (
          <EditArticle
            articleKey={currentArticleKey}
            article={currentArticle}
            onSave={handleUpdateArticle}
            onCancel={handleCancelEdit}
            username={user?.username || 'Unknown'}
          />
        )}

        {currentView === 'login' && (
          <LoginForm
            onLogin={handleLogin}
            onCancel={handleCancelLogin}
          />
        )}
      </div>
    </div>
  );
}

export default App;
