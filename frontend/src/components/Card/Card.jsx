import './Card.css';

/**
 * Cartão branco com borda clara (base dos cards do Figma).
 * - como: tag HTML usada (padrão "div"; use "article" ou "section" quando fizer sentido)
 */
export default function Card({ como: Tag = 'div', className = '', children, ...resto }) {
  return (
    <Tag className={`card ${className}`} {...resto}>
      {children}
    </Tag>
  );
}
