import { UTM } from '/vendor/akiyatkin/utm/UTM.js'
import { Crumb } from '/vendor/infrajs/controller/Crumb.js'
import { Goal } from '/vendor/akiyatkin/goal/Goal.js'


let last = document.referrer
Crumb.done('change', () => {
	UTM.view(last, location.href)
	last = location.href
})

Goal.done('reach', goal => {
	UTM.goal(goal)
})
