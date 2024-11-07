export default function(Quill) {
	const BlockEmbed  = Quill.import('blots/block/embed');
	class InputBlot extends BlockEmbed {
		static create(value) {
			const node = super.create(value);
			const input = document.createElement('input');
			input.type = 'text';
			input.placeholder = '输入图片描述';
			input.style =
				'display: inline-block;width:calc(100% - 3px);border: none;height: 50px;background-color: #f7f8f9;transform: tranlateY(90px);padding: 0 10px;outline:none;transform: translateY(-28px);font-size: 16px'
			input.addEventListener('input', (e) => {
				const prevImage = node.previousElementSibling.firstElementChild
				prevImage.setAttribute('image-describe', e.target.value)
				node.setAttribute('data-value', e.target.value)
			});
			node.appendChild(input);
			return node;
		}

		static formats(node) {
			// 从 DOM 属性中获取值作为格式
			return {
				value: node.getAttribute('data-value') || ''
			};
		}
		static value(node) {
			return node.getAttribute('data-value') || '';
		}
		format(name, value) {
			console.log(name, value)
			if (name === 'input') {
				// 更新属性值
				this.domNode.setAttribute('data-value', value);
				// 更新 <input> 的显示值
				this.domNode.firstChild.value = value;
			}
		}
	}

	InputBlot.blotName = 'input';
	InputBlot.tagName = 'div';
	return {
		'formats/input': InputBlot,
	}
}