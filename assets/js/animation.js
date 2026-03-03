const ClinicMasterGsap = function () {
	gsap.registerPlugin(ScrollSmoother, ScrollTrigger)

	let smoother

	if (!smoother) {
		smoother = ScrollSmoother.create({
			smooth: 2,
			effects: true,
			normalizeScroll: true,
			smoothTouch: 0.1,
		})
	}
    const smoothAnchors = () => {
        const links = document.querySelectorAll('a[href^="#"]');

        links.forEach(link => {
            link.addEventListener("click", (e) => {
                const href = link.getAttribute("href");
                if (!href || href === "#") return;

                const target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();

                // Важно: если у тебя бургер/модалка закрывается
                // то делаем скролл после закрытия
                setTimeout(() => {
                    smoother.scrollTo(target, true, "top top");
                }, 50);
            });
        });
    };

	const headerSticky = () => {
		try {
			const header = document.querySelector('.site-header')
			const sidebarStickyWrap = document.querySelector('.sidebar-sticky')

			if (!header) return

			let lastScroll = 0
			let animationFrameId
			const headerHeight = header.offsetHeight || 80

			const updateStickyHeader = scrollY => {
				try {
					const shouldFix = scrollY > 100
					header.classList.toggle('is-fixed', shouldFix)

					if (sidebarStickyWrap) {
						sidebarStickyWrap.style.top = shouldFix ? `${headerHeight + 10}px` : '60%'
					}

					lastScroll = scrollY
				} catch (err) {
					console.error('Error updating sticky header:', err)
				}
			}

			const loop = () => {
				try {
					const currentScroll = typeof smoother?.scrollTop === 'function' ? smoother.scrollTop() : window.scrollY || document.documentElement.scrollTop

					updateStickyHeader(currentScroll)
					animationFrameId = requestAnimationFrame(loop)
				} catch (err) {
					console.error('Error in sticky header loop:', err)
				}
			}

			animationFrameId = requestAnimationFrame(loop)

			return () => {
				if (animationFrameId) cancelAnimationFrame(animationFrameId)
			}
		} catch (err) {
			console.error('headerSticky initialization failed:', err)
			return () => {}
		}
	}

	let cleanupSticky = null
	const initStickyPosition = (selector = '.my-sticky', offset = 100) => {
		ScrollTrigger.matchMedia({
			'(min-width: 992px)': () => {
				const elements = document.querySelectorAll(selector)
				const triggers = []
				elements.forEach(el => {
					const parent = el.parentElement
					if (!parent) return

					const spacer = document.createElement('div')
					spacer.style.position = 'relative'
					spacer.style.height = el.classList.contains('sidebar-sticky') ? 0 : `${el.offsetHeight + offset}px`
					parent.insertBefore(spacer, el)
					spacer.appendChild(el)

					Object.assign(el.style, {
						position: 'absolute',
						top: el.classList.contains('space-top-0') ? 0 : `${offset}px`,
						left: 0,
						right: 0,
					})

					const trigger = ScrollTrigger.create({
						trigger: spacer,
						start: 'top top',
						end: () => `+=${parent.offsetHeight - el.offsetHeight - offset}`,
						pin: el,
						pinSpacing: false,
						scroller: '#smooth-wrapper',
						anticipatePin: 1,
					})

					triggers.push({ trigger, spacer, el })
				})

				return () => {
					triggers.forEach(({ trigger, spacer, el }) => {
						trigger.kill()

						const parent = spacer.parentElement
						if (parent) {
							parent.insertBefore(el, spacer)
							parent.removeChild(spacer)
						}

						Object.assign(el.style, {
							position: '',
							top: '',
							left: '',
							right: '',
						})
					})
				}
			},
		})
	}

	const applySticky = () => {
		if (cleanupSticky) cleanupSticky()
		cleanupSticky = initStickyPosition()
	}

	document.querySelectorAll('.sticky-update-btn').forEach(btn => {
		btn.addEventListener('click', () => {
			setTimeout(() => {
				applySticky()
			}, 200)
		})
	})

	const customScroll = () => {
		try {
			const contentItems = document.querySelectorAll('.custom-scroll')
			if (!contentItems.length) return

			contentItems.forEach(item => {
				if (!item) return

				item.addEventListener('wheel', e => e.stopPropagation(), {
					passive: false,
				})

				let startY = 0
				let startX = 0

				item.addEventListener(
					'touchstart',
					e => {
						const touch = e.touches[0]
						if (!touch) return

						startY = touch.clientY
						startX = touch.clientX
					},
					{ passive: true },
				)

				item.addEventListener(
					'touchmove',
					e => {
						try {
							const touch = e.touches[0]
							if (!touch) return

							const deltaY = startY - touch.clientY
							const deltaX = startX - touch.clientX

							item.scrollTop += deltaY
							item.scrollLeft += deltaX

							startY = touch.clientY
							startX = touch.clientX

							e.stopPropagation()
							e.preventDefault()
						} catch (err) {
							console.error('Touchmove error:', err)
						}
					},
					{ passive: false },
				)
			})
		} catch (err) {
			console.error('customScroll initialization failed:', err)
		}
	}

	const handleScrollTop = () => {
		try {
			const scrollBtn = document.getElementById('scrollProgress')
			if (!scrollBtn) return

			const circle = scrollBtn.querySelector('circle')
			if (!circle || !circle.r || !circle.r.baseVal) return

			const radius = circle.r.baseVal.value
			const circumference = 2 * Math.PI * radius

			circle.style.strokeDasharray = `${circumference}`
			circle.style.strokeDashoffset = `${circumference}`

			let ticking = false

			const updateProgress = () => {
				try {
					const scrollTop = window.scrollY || document.documentElement.scrollTop
					const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight

					const scrollPercent = docHeight ? scrollTop / docHeight : 0
					const offset = circumference * (1 - scrollPercent)
					circle.style.strokeDashoffset = offset

					scrollBtn.classList.toggle('active', scrollTop > 200)
				} catch (err) {
					console.error('Error updating scroll progress:', err)
				} finally {
					ticking = false
				}
			}

			const onScroll = () => {
				if (!ticking) {
					ticking = true
					requestAnimationFrame(updateProgress)
				}
			}

			window.addEventListener('scroll', onScroll, { passive: true })
			updateProgress()

			const onClick = () => {
				window.scrollTo({ top: 0, behavior: 'smooth' })
			}
			scrollBtn.addEventListener('click', onClick)

			return () => {
				window.removeEventListener('scroll', onScroll)
				scrollBtn.removeEventListener('click', onClick)
			}
		} catch (err) {
			console.error('handleScrollTop initialization failed:', err)
			return () => {}
		}
	}

	const animateSplitTitle = () => {
		try {
			const titles = document.querySelectorAll('.split-title')
			if (!titles.length) {
				console.warn('No elements found with .split-title')
				return
			}

			titles.forEach(title => {
				if (title.dataset.animated) return

				const words = title.innerText.trim().split(/\s+/)
				if (!words.length) return

				title.innerHTML = words.map(word => `<span class="word">${word}</span>`).join(' ')

				title.dataset.animated = 'true'

				const wordElements = title.querySelectorAll('.word')
				if (!wordElements.length) return

				gsap.to(wordElements, {
					scrollTrigger: {
						trigger: title,
						start: 'top 80%',
						end: 'bottom 20%',
						scrub: true,
					},
					opacity: 1,
					duration: 0.8,
					stagger: 0.2,
				})
			})
		} catch (err) {
			console.error('Error in animateSplitTitle:', err)
		}
	}

	const animateSlider = () => {
		try {
			const el = document.querySelector('.dz-features')
			if (!el) {
				console.warn('Element .dz-features not found')
				return
			}

			if (!el.dataset.animated) {
				el.innerHTML = el.textContent
					.split('')
					.map(char => `<span class="letter">${char}</span>`)
					.join('')
				el.dataset.animated = 'true'
			}

			const letters = el.querySelectorAll('.letter')
			if (letters.length === 0) {
				console.warn('No letters found in .dz-features')
				return
			}

			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: el,
					start: 'top 80%',
					toggleActions: 'play none none none',
				},
				repeat: -1,
				repeatDelay: 0.1,
			})

			tl.to(letters, {
				color: '#141414',
				duration: 0.3,
				stagger: 0.05,
			})

			tl.to(
				letters,
				{
					color: '#3e81ed',
					duration: 0.4,
					stagger: 0.05,
				},
				'<2.6',
			)

			tl.to(
				letters,
				{
					color: '#141414',
					x: 0,
					opacity: 1,
					duration: 0.6,
					ease: 'power2.out',
					stagger: 0.05,
				},
				'<2.2',
			)
		} catch (err) {
			console.error('Error in animateSlider:', err)
		}
	}

	return {
		init() {
			headerSticky()
			applySticky()
			customScroll()
			handleScrollTop()
			animateSplitTitle()
			animateSlider()
            smoothAnchors()
		},
	}
}

window.addEventListener('load', () => {
	ClinicMasterGsap().init()
})

let resizeTimeout
window.addEventListener('resize', () => {
	clearTimeout(resizeTimeout)
	resizeTimeout = setTimeout(() => {
		ScrollTrigger.refresh()
	}, 250)
})
