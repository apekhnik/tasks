import type { CSSProperties } from 'react'

export type IconName =
  | 'dice' | 'check-square' | 'folder' | 'bar-chart' | 'settings'
  | 'plus' | 'check' | 'x' | 'skip' | 'pencil' | 'trash'
  | 'chevron-right' | 'chevron-down' | 'search' | 'clock' | 'ban'
  | 'sparkles' | 'flame' | 'arrow-up' | 'info' | 'alert'
  | 'list-filter' | 'calendar' | 'sliders' | 'drop' | 'menu'
  | 'leaf' | 'home' | 'briefcase' | 'heart' | 'shopping'
  | 'user' | 'book' | 'minus' | 'refresh' | 'more' | 'target' | 'wand'

interface IconProps {
  name: IconName
  size?: number
  className?: string
  style?: CSSProperties
}

export function Icon({ name, size = 16, className = '', style }: IconProps) {
  const s = { width: size, height: size, ...style }
  const common = {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className, style: s,
  }
  switch (name) {
    case 'dice':
      return <svg {...common}><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="0.9" fill="currentColor"/><circle cx="16" cy="8" r="0.9" fill="currentColor"/><circle cx="12" cy="12" r="0.9" fill="currentColor"/><circle cx="8" cy="16" r="0.9" fill="currentColor"/><circle cx="16" cy="16" r="0.9" fill="currentColor"/></svg>
    case 'check-square':
      return <svg {...common}><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
    case 'folder':
      return <svg {...common}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
    case 'bar-chart':
      return <svg {...common}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
    case 'settings':
      return <svg {...common}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
    case 'plus':
      return <svg {...common}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
    case 'check':
      return <svg {...common} strokeWidth={2.2}><polyline points="20 6 9 17 4 12"/></svg>
    case 'x':
      return <svg {...common}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    case 'skip':
      return <svg {...common}><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>
    case 'pencil':
      return <svg {...common}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>
    case 'trash':
      return <svg {...common}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
    case 'chevron-right':
      return <svg {...common}><polyline points="9 18 15 12 9 6"/></svg>
    case 'chevron-down':
      return <svg {...common}><polyline points="6 9 12 15 18 9"/></svg>
    case 'search':
      return <svg {...common}><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    case 'clock':
      return <svg {...common}><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 16 14"/></svg>
    case 'ban':
      return <svg {...common}><circle cx="12" cy="12" r="9"/><line x1="5.6" y1="5.6" x2="18.4" y2="18.4"/></svg>
    case 'sparkles':
      return <svg {...common}><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></svg>
    case 'flame':
      return <svg {...common}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 17h.5a2.5 2.5 0 1 0 0-5h-.5"/><path d="M14.5 5.5a4 4 0 1 1-5 6 3 3 0 0 0-1 5 7 7 0 0 0 6-12.5z"/></svg>
    case 'arrow-up':
      return <svg {...common}><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
    case 'info':
      return <svg {...common}><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="8.01"/><polyline points="11 12 12 12 12 16 13 16"/></svg>
    case 'alert':
      return <svg {...common}><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
    case 'list-filter':
      return <svg {...common}><path d="M3 6h18"/><path d="M7 12h10"/><path d="M10 18h4"/></svg>
    case 'calendar':
      return <svg {...common}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
    case 'sliders':
      return <svg {...common}><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>
    case 'drop':
      return <svg {...common}><circle cx="12" cy="12" r="2.5" fill="currentColor"/></svg>
    case 'menu':
      return <svg {...common}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
    case 'leaf':
      return <svg {...common}><path d="M11 20A7 7 0 0 1 4 13c0-4 3-9 9-11 0 6-1 9 0 12 1 2 4 4 7 4 0-3-2-7-9-9"/></svg>
    case 'home':
      return <svg {...common}><path d="M3 11l9-8 9 8v9a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2z"/></svg>
    case 'briefcase':
      return <svg {...common}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
    case 'heart':
      return <svg {...common}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
    case 'shopping':
      return <svg {...common}><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/><path d="M2 4h2.5l3 12h11l3-8H6"/></svg>
    case 'user':
      return <svg {...common}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>
    case 'book':
      return <svg {...common}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
    case 'minus':
      return <svg {...common}><line x1="5" y1="12" x2="19" y2="12"/></svg>
    case 'refresh':
      return <svg {...common}><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
    case 'more':
      return <svg {...common}><circle cx="5" cy="12" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="19" cy="12" r="1.2" fill="currentColor"/></svg>
    case 'target':
      return <svg {...common}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>
    case 'wand':
      return <svg {...common}><path d="M15 4V2"/><path d="M15 10V8"/><path d="M12 7h-2"/><path d="M20 7h-2"/><path d="m18 4-1.5 1.5"/><path d="m12 4 1.5 1.5"/><path d="M3 21l9-9"/></svg>
    default:
      return <svg {...common} />
  }
}
