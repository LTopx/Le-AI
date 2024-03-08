// auto-scroll-to-bottom
export function scrollToBottom() {
  const scrollEle = document.querySelector('.auto-scroll-to-bottom')
  requestAnimationFrame(() => scrollEle?.scrollTo(0, scrollEle.scrollHeight))
}
