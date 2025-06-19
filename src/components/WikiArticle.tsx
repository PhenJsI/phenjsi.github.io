import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { Edit, Clock, User } from 'lucide-react';
import { WikiArticle as WikiArticleType } from '../types';

interface WikiArticleProps {
  article: WikiArticleType;
  articleKey: string;
  onLinkClick: (title: string) => void;
  onEdit?: (articleKey: string) => void;
  canEdit?: boolean;
}

export const WikiArticle: React.FC<WikiArticleProps> = ({ 
  article, 
  articleKey, 
  onLinkClick, 
  onEdit, 
  canEdit = false 
}) => {
  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    
    // Если это внутренняя ссылка (начинается с #)
    if (href.startsWith('#')) {
      const targetId = href.substring(1);
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    
    // Если это ссылка на другую статью
    onLinkClick(href);
  };

  const processContent = (content: string) => {
    let processedContent = content;
    
    // Добавляем IDs к заголовкам для внутренних ссылок
    processedContent = processedContent.replace(
      /^(#{1,6})\s+(.+)$/gm,
      (match, hashes, title) => {
        const id = title.toLowerCase()
          .replace(/[^\u0400-\u04ff\w\s-]/gi, '') // Оставляем кириллицу, латиницу, цифры, пробелы и тире
          .replace(/\s+/g, '-');
        return `${hashes} ${title} {#${id}}`;
      }
    );

    return processedContent;
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto py-6 px-4">
        {/* Заголовок статьи с кнопкой редактирования */}
        <div className="flex items-start justify-between mb-6 border-b border-gray-200 pb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{article.title}</h1>
            
            {/* Информация о последнем изменении */}
            {(article.lastModified || article.modifiedBy) && (
              <div className="flex items-center gap-4 text-sm text-gray-600">
                {article.lastModified && (
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>Изменено: {new Date(article.lastModified).toLocaleString('ru-RU')}</span>
                  </div>
                )}
                {article.modifiedBy && (
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    <span>Автор: {article.modifiedBy}</span>
                  </div>
                )}
              </div>
            )}
            
            {/* Категория */}
            <div className="mt-2">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                article.category === 'Основное' ? 'bg-blue-100 text-blue-700' :
                article.category === 'Разделы' ? 'bg-green-100 text-green-700' :
                'bg-purple-100 text-purple-700'
              }`}>
                {article.category}
              </span>
            </div>
          </div>
          
          {/* Кнопка редактирования */}
          {canEdit && onEdit && (
            <button
              onClick={() => onEdit(articleKey)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Edit size={16} />
              Редактировать
            </button>
          )}
        </div>

        <article className="prose prose-lg max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
            components={{
              a: ({ node, href, children, ...props }) => {
                const linkText = typeof children === 'string' ? children : 
                  Array.isArray(children) ? children.join('') : '';
                
                return (
                  <a
                    href={href}
                    onClick={(e) => handleLinkClick(e, href || '')}
                    className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
                    {...props}
                  >
                    {children}
                  </a>
                );
              },
              h1: ({ children, ...props }) => (
                <h1 className="text-3xl font-bold border-b-4 border-gray-200 pb-2 mb-4" {...props}>
                  {children}
                </h1>
              ),
              h2: ({ children, ...props }) => (
                <h2 className="text-2xl font-semibold border-b-2 border-gray-100 pb-1 mb-3 mt-6" {...props}>
                  {children}
                </h2>
              ),
              h3: ({ children, ...props }) => (
                <h3 className="text-xl font-semibold mb-2 mt-4" {...props}>
                  {children}
                </h3>
              ),
              h4: ({ children, ...props }) => (
                <h4 className="text-lg font-medium mb-2 mt-3" {...props}>
                  {children}
                </h4>
              ),
              blockquote: ({ children, ...props }) => (
                <blockquote className="border-l-4 border-blue-200 pl-4 my-4 text-gray-700 italic" {...props}>
                  {children}
                </blockquote>
              ),
              table: ({ children, ...props }) => (
                <div className="overflow-x-auto my-4">
                  <table className="min-w-full border-collapse border border-gray-300" {...props}>
                    {children}
                  </table>
                </div>
              ),
              th: ({ children, ...props }) => (
                <th className="border border-gray-300 px-4 py-2 bg-gray-50 font-semibold text-left" {...props}>
                  {children}
                </th>
              ),
              td: ({ children, ...props }) => (
                <td className="border border-gray-300 px-4 py-2" {...props}>
                  {children}
                </td>
              ),
              ul: ({ children, ...props }) => (
                <ul className="list-disc list-inside my-4 space-y-1" {...props}>
                  {children}
                </ul>
              ),
              ol: ({ children, ...props }) => (
                <ol className="list-decimal list-inside my-4 space-y-1" {...props}>
                  {children}
                </ol>
              ),
              li: ({ children, ...props }) => (
                <li className="mb-1" {...props}>
                  {children}
                </li>
              ),
              strong: ({ children, ...props }) => (
                <strong className="font-bold text-gray-900" {...props}>
                  {children}
                </strong>
              ),
              em: ({ children, ...props }) => (
                <em className="italic text-gray-800" {...props}>
                  {children}
                </em>
              ),
              code: ({ children, ...props }: any) => {
                const inline = 'inline' in props && props.inline;
                if (inline) {
                  return (
                    <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono" {...props}>
                      {children}
                    </code>
                  );
                }
                return (
                  <code className="block bg-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto" {...props}>
                    {children}
                  </code>
                );
              },
              hr: ({ ...props }) => (
                <hr className="my-8 border-t-2 border-gray-200" {...props} />
              ),
              p: ({ children, ...props }) => (
                <p className="mb-4 leading-relaxed text-gray-800" {...props}>
                  {children}
                </p>
              )
            }}
          >
            {processContent(article.content)}
          </ReactMarkdown>
        </article>
        
        {/* Связанные ссылки */}
        {article.links && article.links.length > 0 && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">Связанные статьи</h3>
            <div className="flex flex-wrap gap-2">
              {article.links.map((link, index) => (
                <button
                  key={index}
                  onClick={() => onLinkClick(link)}
                  className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
                >
                  {link}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
