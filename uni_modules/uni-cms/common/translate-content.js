const hadeFontMap = {
	1: 32,
	2: 24,
	3: 18,
	4: 16,
	5: 13,
	6: 12
}

export function translateInputContent(list) {
	console.log()
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
	console.log(contentList)
	return contentList
}