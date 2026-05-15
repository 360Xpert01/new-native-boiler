/** Back navigation chevron — points toward the leading edge in the current layout. */
export function backChevronIcon(isRTL: boolean): 'chevron-left' | 'chevron-right' {
  return isRTL ? 'chevron-right' : 'chevron-left';
}

/** List row / forward navigation chevron — points toward the trailing edge. */
export function forwardChevronIcon(isRTL: boolean): 'chevron-left' | 'chevron-right' {
  return isRTL ? 'chevron-left' : 'chevron-right';
}
