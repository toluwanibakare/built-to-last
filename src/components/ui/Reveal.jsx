import { useReveal } from '../../hooks/useReveal'

export function Reveal({ children, delay = 0, as: Tag = 'div', className = '', threshold }) {
  const { ref, visible } = useReveal({ threshold })

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ '--reveal-delay': `${delay}ms` }}
    >
      {children}
    </Tag>
  )
}
