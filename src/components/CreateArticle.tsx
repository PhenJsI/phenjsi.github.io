import React, { useState } from 'react';
import { Save, X, Eye, Edit } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { WikiArticle } from '../types';

interface CreateArticleProps {
  onSave: (title: string, article: WikiArticle) => void;
  onCancel: () => void;
}

export const CreateArticle: React.FC<CreateArticleProps> = ({ onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Основное' | 'Разделы' | 'Служебное'>('Разделы');
  const [content, setContent] = useState('');
  const [links, setLinks] = useState('');
  const [isPreview, setIsPreview] = useState(false);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      alert('Пожалуйста, заполните заголовок и содержание');
      return;
    }

    const linksArray = links
      .split(',')
      .map(link => link.trim())
      .filter(link => link.length > 0);

    const newArticle: WikiArticle = {
      title: title.trim(),
      content: content.trim(),
      category,
      links: linksArray
    };

    onSave(title.trim(), newArticle);
  };

  const sampleContent = `# ${title || 'Заголовок статьи'}

## Описание

Введите описание вашей темы здесь.

### Основные характеристики

- **Характеристика 1**: Описание
- **Характеристика 2**: Описание
- **Характеристика 3**: Описание

### Дополнительная информация

Добавьте дополнительную информацию о теме.

> **Примечание**: Вы можете использовать markdown для форматирования текста.

### Связанные темы

- [Ссылка на связанную тему](#)
- [Другая связанная тема](#)

---

**Категория**: ${category}`;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto py-6 px-4">
        {/* Заголовок */}
        <div className="border-b border-gray-200 pb-4 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Создание новой статьи</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPreview(!isPreview)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  isPreview 
                    ? 'bg-gray-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isPreview ? <Edit size={16} /> : <Eye size={16} />}
                {isPreview ? 'Редактировать' : 'Предварительный просмотр'}
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Save size={16} />
                Сохранить
              </button>
              <button
                onClick={onCancel}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                <X size={16} />
                Отмена
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Форма редактирования */}
          <div className={`space-y-6 ${isPreview ? 'hidden lg:block' : ''}`}>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Заголовок статьи *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Введите заголовок статьи"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Категория
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as 'Основное' | 'Разделы' | 'Служебное')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Основное">Основное</option>
                <option value="Разделы">Разделы</option>
                <option value="Служебное">Служебное</option>
              </select>
            </div>

            <div>
              <label htmlFor="links" className="block text-sm font-medium text-gray-700 mb-2">
                Связанные статьи (через запятую)
              </label>
              <input
                type="text"
                id="links"
                value={links}
                onChange={(e) => setLinks(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Статья 1, Статья 2, Статья 3"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Содержание (Markdown) *
                </label>
                <button
                  onClick={() => setContent(sampleContent)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Вставить пример
                </button>
              </div>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={20}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder="Введите содержание статьи в формате Markdown..."
              />
            </div>

            {/* Подсказка по Markdown */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Справка по Markdown:</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <div><code># Заголовок 1</code></div>
                <div><code>## Заголовок 2</code></div>
                <div><code>**жирный текст**</code></div>
                <div><code>*курсив*</code></div>
                <div><code>- Список</code></div>
                <div><code>[ссылка](url)</code></div>
                <div><code>&gt; Цитата</code></div>
              </div>
            </div>
          </div>

          {/* Предварительный просмотр */}
          <div className={`${isPreview ? '' : 'hidden lg:block'}`}>
            <div className="sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Предварительный просмотр</h3>
              <div className="border border-gray-200 rounded-lg p-4 bg-white max-h-[70vh] overflow-y-auto">
                {content ? (
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="text-gray-500 italic">
                    Введите содержание, чтобы увидеть предварительный просмотр
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
