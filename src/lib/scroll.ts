const REQUIRED_BOTTOM_DISTANCE = 100;

export function isNearBottom(el: HTMLElement) {
  const distance = el.scrollHeight - el.scrollTop - el.clientHeight;

  return distance < REQUIRED_BOTTOM_DISTANCE;
}

export function scrollToBottom(
  el: HTMLElement | null,
  forceScroll: boolean = false,
) {
  if (el && (forceScroll || isNearBottom(el))) {
    el.scrollTop = el.scrollHeight;
  }
}
