export default function Card({ children, className = '', onClick, as: Tag = 'div' }) {
  return (
    <Tag
      onClick={onClick}
      className={`rounded-card bg-white shadow-card ${onClick ? 'cursor-pointer transition active:scale-[0.99]' : ''} ${className}`}
    >
      {children}
    </Tag>
  )
}
