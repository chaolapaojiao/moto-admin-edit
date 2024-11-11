import './equipt.css'
export default function(Quill) {
	const BlockEmbed = Quill.import('blots/block/embed');
	class CustomElement extends BlockEmbed {
		static create(value) {
			// 创建自定义的 DOM 元素
			const node = document.createElement('div');
			node.classList.add('custom-element'); // 添加自定义类
			node.classList.add('no-select');
			const brand = document.createElement('div');
			const brandTitle = document.createElement('span')
			const brandName = document.createElement('span')
			brand.appendChild(brandTitle)
			brand.appendChild(brandName)
			brandTitle.innerText = '品牌型号:  '
			brandName.innerText = '米其林加强榜'
			
			const params = document.createElement('div');
			const paramsTitle = document.createElement('span')
			const paramsValue = document.createElement('span')
			paramsTitle.innerText = '规格参数:  '
			paramsValue.innerText = '180 190'
			params.appendChild(paramsTitle)
			params.appendChild(paramsValue)
			
			const price = document.createElement('div');
			const priceTitle = document.createElement('span')
			const priceValue = document.createElement('span')
			priceTitle.innerText = '商品价格:  '
			priceValue.innerText = '5500'
			price.appendChild(priceTitle)
			price.appendChild(priceValue)
			
			const img = document.createElement('img')
			img.src = 'data:image/jpeg;base64,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'
			img.style.width = '50px'
			img.style.height = '50px'
			
			node.appendChild(brand)
			node.appendChild(params)
			node.appendChild(price)
			node.appendChild(img)
			// 设置元素的内容
			return node;
		}
	}

	CustomElement.blotName = 'equipt';
	return {
		'formats/equipt': CustomElement,
	}
}