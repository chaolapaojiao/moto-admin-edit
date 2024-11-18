const hadeFontMap = {
	1: 32,
	2: 24,
	3: 18,
	4: 16,
	5: 13,
	6: 12
}

export function translateInputContent(contextList) {
	console.log(contextList)
	let htmlContent = ''
	const contextListGroup = []
	for (let index = 0; index <= contextList[contextList.length - 1].itemIndex; index++) {
		const arr = contextList.filter(item => item.itemIndex === index)
		contextListGroup.push(arr)
	}
	contextListGroup.forEach((item, index) => {
		let htmlItem = '<p>'
		if (item.length > 1) {
			item.forEach(section => {
				if (section.contextClass === 1) {
					htmlItem +=
						`<span style="${section.format.style}">${section.context}</span>`
				} else {
					htmlItem += `<p><img class="uploaded" image-describe="${section.format.imageDescribe}" src="${section.context}"></img><p>`
				}
			})
		} else {
			const data = item[0]
			if (data.contextClass === 1) {
				if (data.format.head) {
					htmlItem +=
						`<${data.format.head}>${data.context}</${data.format.head}>`
				} else {
					htmlItem +=
						`<p style="${data.format.style}" >${data.context}</p>`
				}
			} else if (data.contextClass === 2) {
				if (data.format.imageDescribe) {
					htmlContent +=
						`<p><img class="uploaded" image-describe="${data.format.imageDescribe}" src="${data.context}"></img>`
				} else {
					htmlContent +=
						`<p class="uploaded"><img class="uploaded" src="${data.context}"></img><p><p>`
				}
			}
		}
		htmlItem += '</p>'
		htmlContent += htmlItem
	})
	return htmlContent + '<p><span>\n<span></p>'
}
export function translateOutputContent(list) {
	let contentList = []
	let itemIndex = 0
	list.forEach((item, index) => {
		const prevItem = list[index - 1]
		const nextItem = list[index + 1]
		if (typeof item.insert !== 'object') {
			let styleStr = ''
			let head = ''
			let fontSizeNumber = 17
			for (let key in item.attributes) {
				const value = item.attributes[key]
				if (key === 'fontSize') {
					styleStr += `font-size: ${value};`
					fontSizeNumber = value.slice(0, 2)
				} else if (key === 'bold') {
					styleStr += `font-weight: bold;`
				} else if (key === 'italic') {
					styleStr += `font-style:italic;`
				} else if (key === 'strike') {
					styleStr += `text-decoration: line-through;`
				} else if (key === 'underline') {
					styleStr += `text-decoration: underline;`
				} else if (key === 'letterSpacing') {
					styleStr += `letter-spacing: ${value};`
				} else if (key === 'background') {
					styleStr += `background-color: ${value};`
				} else if (key === 'color') {
					styleStr += `color: ${value};`
				}
			}
			if (index <= list.length - 2) {
				if (nextItem.insert === '\n') {
					if (nextItem.attributes?.header) {
						const headNumber = nextItem.attributes?.header
						head = 'h' + nextItem.attributes.header
						fontSizeNumber = hadeFontMap[nextItem.attributes?.header]
					}
					if (nextItem.attributes?.align) {
						styleStr += `textAlign: ${nextItem.attributes.align}`
					}
					if (nextItem.attributes?.list) {
						styleStr += 'marign-bottom: 20px;'
					}
					if (nextItem.attributes?.marginLeft) {
						styleStr += `margin-left: ${nextItem.attributes.marginLeft};`
					}
					if (nextItem.attributes?.marginRight) {
						styleStr += `margin-right: ${nextItem.attributes.marginRight};`
					}
					if (nextItem.attributes?.textIndent) {
						styleStr += `text-indent: ${nextItem.attributes.textIndent};`
					}
					if (nextItem.attributes?.lineHeight) {
						styleStr += `line-height: ${nextItem.attributes.lineHeight * fontSizeNumber} + 'px';`
					}
				}
			}
			if (item.insert.startsWith('\n')) {
				itemIndex++
			}
			const formatStr = JSON.stringify({
				style: styleStr,
				head: head,
			})
			contentList.push({
				format: formatStr,
				itemIndex: itemIndex,
				contextClass: 1,
				context: item.insert,
			})
		} else {
			if (item.insert.image) {
				itemIndex++
				const formatStr = JSON.stringify({
					imageDescribe: item.attributes['image-describe'],
				})
				contentList.push({
					format: formatStr,
					itemIndex: itemIndex,
					contextClass: 2,
					context: item.insert.image,
				})
			}
		}
	})
	contentList = contentList.filter(item => item.context !== '\n')
	return contentList
}