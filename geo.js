let modalScope = null
let speedScope = 350
let globalTarget = null
let prevent = false
let geoBezier
let pageT = false
let toModal = null
let globalModal = null
const setStyle = {
	position: 'absolute',
	transformOrigin: 'left top',
	pointerEvents: 'none',
	opacity: 0,
	top: 0,
	left: 0,
	zIndex: 9999,
}
const resetValue = opacity => {
	let toArr = [...modalScope.children]
	if (opacity) {
		toArr.forEach(ch => (ch.style.opacity = 1))
	} else {
		modalScope.style.animation = null
		modalScope.style.left = 0
		modalScope.style.top = 0
		toArr.forEach(ch => (ch.style.opacity = 0))
	}
}

window.addEventListener('click', e => {
	if (prevent) {
		if (modalScope) {
			if (e.target.classList.contains('blurBg--match')) {
				resetValue(false)
				modalScope.classList.add('hideModal')
				document.querySelector('.hider--match').classList.add('hiding')
				modalScope.style.opacity = 0
				modalScope.classList.remove('open')
				document.querySelector('.blurBg--match').classList.remove('on')
				setTimeout(() => {
					globalTarget.classList.add('matchBorder')
					globalTarget.addEventListener('animationend', () =>
						globalTarget.classList.remove('matchBorder')
					)
				}, speedScope)
				setTimeout(() => {
					resetValue(true)
					prevent = false
					modalScope.classList.remove('hideModal')
					document.querySelector('.hider--match').classList.remove('hiding')
					globalTarget.classList.remove('hideApp')
					modalScope = null
					document.querySelector('.hider--match').remove()
				}, speedScope)
			}
		}
	}
})

class MatchGeometry {
	constructor(conf) {
		geoBezier = conf.bezier
		this.elementTo = null
		this.pageTransition = false
		globalModal = conf.el
		if (conf.elTo) {
			toModal = document.querySelector(`${conf.elTo}`)
			this.elementTo = document.querySelector(`${conf.elTo}`)
		}
		if (!conf.bezier) {
			geoBezier = 'cubic-bezier(0.25, 1, 0.5, 1)'
		}
		if (conf.speed) { 
			speedScope = conf.speed
		}
			
		this.elements = document.querySelectorAll(`${conf.el}`)
		if (this.elements.length) {
			this.elements.forEach(el => {
				el.addEventListener('click', this.matchGeometry)
				el.style.position = 'relative'
				if (!conf.elTo) {
					for (let prop of Object.keys(setStyle)) {
						el.children[0].style[prop.toString()] = setStyle[prop.toString()]
					}
				}
			})
			if (conf.elTo) {
				for (let prop of Object.keys(setStyle)) {
					this.elementTo.style[prop.toString()] = setStyle[prop.toString()]
				}
			}
			if (conf.closeEl) {
				this.closeElement = document.querySelectorAll(`${conf.closeEl}`)
				this.closeElement.forEach(closeEl =>
					closeEl.addEventListener('click', this.closeFullPage)
				)
			}
			this.createBg()
		}
	}

	createBg() {
		const bg = document.createElement('div')
		bg.classList.add('blurBg--match')
		document.body.appendChild(bg)
	}

	styleBg(setStyle) {
		const elem = document.querySelector('.blurBg--match')
		for (let prop of Object.keys(setStyle)) {
			elem.style[prop.toString()] = setStyle[prop.toString()]
		}
	}

	matchGeometry(e) {
		let el = e.target
		if (!e.target.classList.contains(`${globalModal.substring(1)}`)) {
			el = e.target.offsetParent
		}
				if (prevent) {
					return
				}
		if (
			el.getBoundingClientRect().width === document.documentElement.clientWidth &&
			el.getBoundingClientRect().height === document.documentElement.clientHeight
		) {
			pageT = true
		} else {
			pageT = false
		}
		let modal
		const root = document.documentElement
		if (!toModal) {
			modal = el.children[0]
		} else {
			modal = toModal
			modal.remove()
			el.appendChild(modal)
		}
		const hider = document.createElement('div')
		hider.classList.add('hider--match')
		if (!this.elementTo) {
			modal.prepend(hider)
		} else {
			this.elementTo.prepend(hider)
		}
		document.querySelector('.blurBg--match').classList.add('on')
		modalScope = modal
		globalTarget = el
		let offSLeft =
			el.getBoundingClientRect().left -
			window.innerWidth / 2 +
			modal.getBoundingClientRect().width / 2
		let offSTop =
			el.getBoundingClientRect().top -
			window.innerHeight / 2 +
			modal.getBoundingClientRect().height / 2
		if (pageT) {
			offSLeft = el.getBoundingClientRect().left
			offSTop = el.getBoundingClientRect().top
		}
		let scaleX = el.getBoundingClientRect().width / modal.getBoundingClientRect().width
		let scaleY = el.getBoundingClientRect().height / modal.getBoundingClientRect().height
		root.style.setProperty('--offSetLeft', -offSLeft + 'px')
		root.style.setProperty('--offSetTop', -offSTop + 'px')
		root.style.setProperty('--speed', speedScope + 'ms')
		root.style.setProperty('--scaleX', scaleX.toFixed(3))
		root.style.setProperty('--scaleY', scaleY.toFixed(3))
		root.style.setProperty('--bezier', geoBezier)
		root.style.setProperty(
			'--elBackColor',
			window.getComputedStyle(el, null).getPropertyValue('background-color')
		)
		root.style.setProperty(
			'--elBoxShadow',
			window.getComputedStyle(el, null).getPropertyValue('box-shadow')
		)
		root.style.setProperty(
			'--borderRad',
			window.getComputedStyle(el, null).getPropertyValue('border-radius')
		)
		setTimeout(() => {
			el.classList.add('hideApp')
			modal.classList.add('open')
			modal.style.opacity = null
		}, 1)
		setTimeout(() => {
			modal.style.animation = 'none'
			modal.style.left = -offSLeft + 'px'
			modal.style.top = -offSTop + 'px'
			prevent = true
		}, speedScope)
	}

	closeFullPage() {
		if (modalScope && prevent) {
			resetValue(false)
			modalScope.classList.add('hideModal')
			document.querySelector('.hider--match').classList.add('hiding')
			modalScope.style.opacity = 0
			modalScope.classList.remove('open')
			document.querySelector('.blurBg--match').classList.remove('on')
			setTimeout(() => {
				globalTarget.classList.add('matchBorder')
				globalTarget.addEventListener('animationend', () =>
					globalTarget.classList.remove('matchBorder')
				)
			}, speedScope)
			setTimeout(() => {
				resetValue(true)
				prevent = false
				modalScope.classList.remove('hideModal')
				document.querySelector('.hider--match').classList.remove('hiding')
				globalTarget.classList.remove('hideApp')
				modalScope = null
				document.querySelector('.hider--match').remove()
			}, speedScope)
		}
	}
}
