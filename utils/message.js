import {
	ElMessage
} from 'element-plus'
const message = {
	success: (text) => {
		ElMessage({
			message: text,
			type: 'success',
			offset: 200
		})
	},
	warning: (text) => {
		ElMessage({
			message: text,
			type: 'warning',
			offset: 200
		})
	},
	fail: (text) => {
		ElMessage({
			message: textk,
			type: 'fail',
			offset: 200
		})
	},
}
export default message