import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

const Reveal = ({ children, className = '', delay = 0 }) => {
  const elementRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const delayClass = {
    0: 'delay-0',
    60: 'delay-[60ms]',
    80: 'delay-[80ms]',
    120: 'delay-[120ms]',
    160: 'delay-[160ms]',
    180: 'delay-[180ms]',
    240: 'delay-[240ms]',
    300: 'delay-[300ms]',
    360: 'delay-[360ms]',
    420: 'delay-[420ms]'
  }[Math.round(delay * 1000)] || 'delay-0'

  useEffect(() => {
    const element = elementRef.current
    if (!element) return undefined

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      setIsVisible(true)
      return undefined
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        observer.unobserve(entry.target)
      }
    }, { threshold: 0.15 })

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={elementRef}
      className={`h-full transition-[opacity,transform] duration-[550ms] ease-[cubic-bezier(.22,1,.36,1)] ${delayClass} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-[22px] opacity-0'}${className ? ` ${className}` : ''}`}
    >
      {children}
    </div>
  )
}

Reveal.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  delay: PropTypes.number
}

export default Reveal
