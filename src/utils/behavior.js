export function trackPageView(url) {
	if (!url) {
			return
	}
	ga('set', 'page', url)
	ga('send', 'pageview')
}

export function behavior(action, label, value) {
  if (value === undefined) {
    window.ga && window.ga('send', 'event', 'category', action, label)
  } else {
    window.ga && window.ga('send', 'event', 'category', action, label, value)
  }
}