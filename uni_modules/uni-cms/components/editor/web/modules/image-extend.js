import image from '../formats/image'
import './image-uploading.css'

export default function(Quill) {
	// const Delta = Quill.import('delta')

	class ImageExtend {
		constructor(quill, config) {
			this.quill = quill
			this.config = config

			// 通过监听内容变化判断是否上传图片
			quill.on(Quill.events.TEXT_CHANGE, (delta) => {
				const imageElements = quill.container.querySelectorAll('img[data-local]:not(.uploading)')

				imageElements.forEach(element => {
					if (element.classList.contains('uploaded')) {
						element.removeAttribute('data-local')
						element.classList.remove('uploaded')
						if (!element.id) {
							const date = 'moto' + Date.parse(new Date())
							element.setAttribute('id', date)
							const inputText = element.getAttribute('image-describe')
							setTimeout(() => {
								this.createInput(element, date, inputText)
							}, 500)
						}
						if (element.classList.length <= 0) {
							element.removeAttribute('class')
						}
					} else {
						this.uploader(element)
					}
				})
			})

			// 插入粘贴的文件图片
			quill.root.addEventListener('paste', (e) => {
				const files = Array.from(e.clipboardData.files || []);

				if (files.length > 0) {
					e.preventDefault();
					setTimeout(() => {
						this.insertFileImage(files[0])
					}, 0)
				}
			}, false)

			// 插入粘贴的网络图片
			quill.clipboard.addMatcher('IMG', function(node, delta) {
				if (!delta.ops[0].attributes) {
					delta.ops[0].attributes = {}
				}

				delta.ops[0].attributes['data-local'] = node.src

				delta.ops[0].attributes = Object.keys(delta.ops[0].attributes).reduce((attributes, key) => {
					if (['data-local', 'alt'].includes(key)) {
						attributes[key] = delta.ops[0].attributes[key]
					}

					return attributes
				}, {})
				return delta
			});
		}

		createInput(element, date, inputText) {
			const inputNode = document.createElement('div')
			const input = document.createElement('input')
			input.type = 'text';
			input.placeholder = '输入图片描述';
			input.classList.add('image-desc-input')
			if (inputText) {
				input.value = inputText
			}
			inputNode.appendChild(input)
			inputNode.style.position = 'absolute'
			inputNode.setAttribute('id', date)
			const parent = this.quill.root.parentNode
			setTimeout(() => {
				const elementRect = element.getBoundingClientRect()
				const containerRect = parent.getBoundingClientRect()
				inputNode.style.left = `${elementRect.left - containerRect.left - 1 + parent.scrollLeft}px`
				inputNode.style.top =
					`${elementRect.top - containerRect.top + elementRect.height + parent.scrollTop + 25}px`
				inputNode.style.width = `${elementRect.width - 15}px`
				// 渲染到element上
				parent.appendChild(inputNode)
			}, 100)
			uni.$on('textChange', () => {
				setTimeout(() => {
					const elementRect = element.getBoundingClientRect()
					const containerRect = parent.getBoundingClientRect()
					inputNode.style.left =
						`${elementRect.left - containerRect.left - 1 + parent.scrollLeft}px`
					inputNode.style.top =
						`${elementRect.top - containerRect.top + elementRect.height + parent.scrollTop + 25}px`
					inputNode.style.width = `${elementRect.width - 15}px`
				}, 100)
			})
			input.addEventListener('input', (e) => {
				element.setAttribute('image-describe', e.target.value)
			});
			
		}
		async uploader(element) {
			// 标记元素正在上传
			element.classList.add('uploading')
			// 检查是否配置了上传方法
			if (typeof this.config.uploadHandler !== 'function') {
				console.warn('没有配置图片上传方法，移除图片：' + element.src)
				Quill.find(element).deleteAt(0)
				return
			}

			const imageFile = await this.convertImageFile(element.src)

			// 构建上传元素
			const uploadNode = this.getUploadNode(element.src)
			// 获取位置
			const parent = this.quill.root.parentNode

			setTimeout(() => {

				const elementRect = element.getBoundingClientRect()
				const containerRect = parent.getBoundingClientRect()

				uploadNode.style.left = `${elementRect.left - containerRect.left - 1 + parent.scrollLeft}px`
				uploadNode.style.top = `${elementRect.top - containerRect.top + parent.scrollTop}px`
				uploadNode.style.width = `${elementRect.width}px`
				uploadNode.style.height = `${elementRect.height}px`

				// 渲染到element上
				parent.appendChild(uploadNode)
			}, 100)

			// 上传图片 展示进度
			Promise.resolve({
				then: (resolve, reject) => {
					try {
						const handler = this.config.uploadHandler(imageFile, element)
						resolve(handler)
					} catch (e) {
						reject(e)
					}
				}
			}).then((url) => {
				const customData = (element.getAttribute('data-custom') || '').split('&').filter(item =>
					item).reduce((res, item) => {
					const [key, value] = item.split('=')
					res[key] = value
					return res
				}, {})
				const date = 'moto' + Date.parse(new Date())
				element.setAttribute('id', date)
				customData.source = url

				element.src = url
				element.removeAttribute('data-local')
				element.classList.remove('uploading')
				element.setAttribute('data-custom', Object.keys(customData).map(key =>
					`${key}=${customData[key]}`).join('&'))
				this.createInput(element, date)
				parent.removeChild(uploadNode)
			}).catch((e) => {
				parent.removeChild(uploadNode)
				console.error(e)
			})
		}

		async convertImageFile(imageUrl) {
			const result = {
				blob: imageUrl,
				ext: 'jpg',
				size: 0,
			}

			return result
		}

		getBlobImageMimeType(blob, imageUrl) {
			if (blob.type) {
				return blob.type
			}
			if (imageUrl.match(/data:(image\/\w+);base64/)) {
				return imageUrl.match(/data:(image\/\w+);base64/)[1].toLowerCase()
			}
			return 'image/jpeg'
		}

		getUploadNode(imageUrl) {
			const div = document.createElement('div')
			const img = document.createElement('img')

			img.src = imageUrl
			img.setAttribute('οndragstart', 'return false')
			div.appendChild(img)

			div.classList.add('image-uploading')

			return div
		}

		file2blob(file) {
			let url
			if (window.createObjectURL !== undefined) {
				url = window.createObjectURL(file);
			} else if (window.URL !== undefined) {
				url = window.URL.createObjectURL(file);
			} else if (window.webkitURL !== undefined) {
				url = window.webkitURL.createObjectURL(file);
			}
			return url
		}

		insertFileImage(file) {
			const range = this.quill.getSelection(true)
			const url = this.file2blob(file)
			uni.$emit('parstImage', url)
		}
	}

	return {
		'modules/ImageExtend': ImageExtend
	}
}