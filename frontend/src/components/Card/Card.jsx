import './Card.css';

export default function Card({ como: Tag = 'div', className = '', children, ...resto }) {
  return (
    <Tag className={`card ${className}`} {...resto}>
      {children}
    </Tag>
  );
}
