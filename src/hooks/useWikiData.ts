import { useState, useEffect } from 'react';
import { WikiData, WikiArticle } from '../types';

export const useWikiData = () => {
  const [wikiData, setWikiData] = useState<WikiData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWikiData = async () => {
      try {
        const response = await fetch('/wfrp_wiki_data.json');
        if (!response.ok) {
          throw new Error('Не удалось загрузить данные');
        }
        const data: WikiData = await response.json();
        
        // Загружаем данные из localStorage если есть
        const localData = localStorage.getItem('wfrp-wiki-data');
        if (localData) {
          const parsedLocalData: WikiData = JSON.parse(localData);
          // Объединяем данные, приоритет у локальных
          setWikiData({ ...data, ...parsedLocalData });
        } else {
          setWikiData(data);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
        setLoading(false);
      }
    };

    loadWikiData();
  }, []);

  const addArticle = (key: string, article: WikiArticle) => {
    const newData = { ...wikiData, [key]: article };
    setWikiData(newData);
    
    // Сохраняем только новые статьи в localStorage
    const existingLocal = localStorage.getItem('wfrp-wiki-data');
    const localData = existingLocal ? JSON.parse(existingLocal) : {};
    localData[key] = article;
    localStorage.setItem('wfrp-wiki-data', JSON.stringify(localData));
  };

  const updateArticle = (key: string, article: WikiArticle) => {
    const newData = { ...wikiData, [key]: article };
    setWikiData(newData);
    
    // Обновляем в localStorage
    const existingLocal = localStorage.getItem('wfrp-wiki-data');
    const localData = existingLocal ? JSON.parse(existingLocal) : {};
    localData[key] = article;
    localStorage.setItem('wfrp-wiki-data', JSON.stringify(localData));
  };

  const getArticleByKey = (key: string): WikiArticle | null => {
    return wikiData[key] || null;
  };

  const findArticleKey = (title: string): string | null => {
    const entry = Object.entries(wikiData).find(([key, article]) => 
      article.title === title
    );
    return entry ? entry[0] : null;
  };

  const getCategorizedData = () => {
    const categorized = {
      "Основное": [] as WikiArticle[],
      "Разделы": [] as WikiArticle[],
      "Служебное": [] as WikiArticle[]
    };

    Object.values(wikiData).forEach(article => {
      if (article.category in categorized) {
        categorized[article.category as keyof typeof categorized].push(article);
      }
    });

    return categorized;
  };

  const searchArticles = (query: string): WikiArticle[] => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    return Object.values(wikiData).filter(article =>
      article.title.toLowerCase().includes(lowerQuery) ||
      article.content.toLowerCase().includes(lowerQuery)
    );
  };

  return {
    wikiData,
    loading,
    error,
    addArticle,
    updateArticle,
    getCategorizedData,
    searchArticles,
    getArticleByKey,
    findArticleKey
  };
};
