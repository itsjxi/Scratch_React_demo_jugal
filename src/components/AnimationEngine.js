import { useCallback, useRef } from 'react'
import { useSpriteStore } from '../store/SpriteStore'

export function useAnimationEngine() {
	const { state, dispatch } = useSpriteStore()
	const lastCollisionRef = useRef(0)
	const wait = (ms) => new Promise(r => setTimeout(r, ms))

	const executeAnimation = useCallback(async (spriteId, animation) => {
		const sprite = state.sprites.find(s => s.id === spriteId)
		if (!sprite) return

		switch (animation.type) {
			case 'MOVE_STEPS': {
				const radians = (sprite.rotation * Math.PI) / 180
				const newX = sprite.x + animation.steps * Math.cos(radians)
				const newY = sprite.y + animation.steps * Math.sin(radians)
				dispatch({ type: 'UPDATE_SPRITE', payload: { id: spriteId, updates: { x: newX, y: newY } } })
				break
			}

			case 'TURN_DEGREES': {
				dispatch({
					type: 'UPDATE_SPRITE',
					payload: { id: spriteId, updates: { rotation: sprite.rotation + animation.degrees } }
				})
				break
			}

			case 'GO_TO': {
				dispatch({
					type: 'UPDATE_SPRITE',
					payload: { id: spriteId, updates: { x: animation.x, y: animation.y } }
				})
				break
			}

			case 'SAY': {
				dispatch({
					type: 'UPDATE_SPRITE',
					payload: { id: spriteId, updates: { speechBubble: animation.text } }
				})
				await wait(animation.duration * 1000)
				dispatch({
					type: 'UPDATE_SPRITE',
					payload: { id: spriteId, updates: { speechBubble: null } }
				})
				break
			}

			case 'THINK': {
				dispatch({
					type: 'UPDATE_SPRITE',
					payload: { id: spriteId, updates: { thoughtBubble: animation.text } }
				})
				await wait(animation.duration * 1000)
				dispatch({
					type: 'UPDATE_SPRITE',
					payload: { id: spriteId, updates: { thoughtBubble: null } }
				})
				break
			}

			case 'REPEAT': {
				break
			}
		}
	}, [state.sprites, dispatch])

	const executeRepeat = useCallback(async (spriteId, repeatAnim, repeatIndex) => {
		const sprite = state.sprites.find(s => s.id === spriteId)
		if (!sprite) return

		const list = sprite.animations.slice(0, repeatIndex).filter(a => a.type !== 'REPEAT')
		if (!list.length) return

		for (let t = 0; t < repeatAnim.times; t++) {
			for (const anim of list) {
				await executeAnimation(spriteId, anim)
				await wait(150)
			}
		}
	}, [state.sprites, executeAnimation])

	const checkCollisions = useCallback(() => {
		const now = Date.now()
		if (now - lastCollisionRef.current < 500) return

		// Get fresh sprite data
		const currentSprites = state.sprites
		for (let i = 0; i < currentSprites.length; i++) {
			for (let j = i + 1; j < currentSprites.length; j++) {
				const a = currentSprites[i]
				const b = currentSprites[j]
				const dx = a.x - b.x
				const dy = a.y - b.y
				const dist = Math.sqrt(dx * dx + dy * dy)

				console.log(`Distance between ${a.name} and ${b.name}: ${dist.toFixed(2)}, A animations: ${a.animations.length}, B animations: ${b.animations.length}`)

				if (dist < 60) {
					console.log(`Collision detected! Swapping animations between ${a.name} and ${b.name}`)
					dispatch({
						type: 'SWAP_ANIMATIONS',
						payload: { sprite1Id: a.id, sprite2Id: b.id }
					})
					lastCollisionRef.current = now
					return
				}
			}
		}
	}, [dispatch])

	const runAnimations = useCallback(async () => {
		if (state.isPlaying) return

		dispatch({ type: 'SET_PLAYING', payload: true })

		try {
			const promises = state.sprites.map(async (sprite) => {
				for (let i = 0; i < sprite.animations.length; i++) {
					const anim = sprite.animations[i]

					if (anim.type === 'REPEAT') {
						await executeRepeat(sprite.id, anim, i)
					} else {
						await executeAnimation(sprite.id, anim)
					}

					// Check collisions after each animation step
					setTimeout(() => checkCollisions(), 50)
					await wait(300)
				}
			})

			await Promise.all(promises)
		} finally {
			dispatch({ type: 'SET_PLAYING', payload: false })
		}
	}, [state.isPlaying, state.sprites, dispatch, executeAnimation, executeRepeat, checkCollisions])

	return { runAnimations, checkCollisions }
}