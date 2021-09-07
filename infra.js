import { UTM } from '/vendor/akiyatkin/utm/UTM.js'
import { Form } from '/vendor/akiyatkin/form/Form.js'


UTM.init()

Form.before('submit', async form => {
	const input = document.createElement('INPUT')
	input.type = 'hidden'
	input.name = 'utms'
	const res = await UTM.get()
	input.value = JSON.stringify(res)
	form.append(input)
})