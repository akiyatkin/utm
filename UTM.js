
const UTM = {
	view: async (referrer, href) => {
		time = new Date().getTime()
		UTM.val = { time, referrer, href, goals: []}
		return UTM.update(UTM.val)
	},
	goal: (goal, data) => {
		goal = { time: new Date().getTime(), goal, data }
		UTM.val.goals.push(goal)
		return UTM.update(UTM.val)
	}
	get: async () => UTM.read().then(store => {
		const request = store.getAll()
		return new Promise((resolve, reject) => {
			request.onsuccess = event => resolve(event.target.result ? event.target.result.val : def)
			request.onerror = reject
		})	
	}).catch(() => null),

	update: (val) => Ses.edit().then(store => {
		const request = store.put(UTM.val)
		return new Promise((resolve, reject) => {
			request.onsuccess = event => resolve(true)
			request.onerror = reject
		})	
	}).catch(() => null),
	db: () => {
		if (UTM.db.promise) return UTM.db.promise;
		UTM.db.promise = new Promise((resolve, reject) => {
			const request = window.indexedDB.open("UTM", 1) //версия указана
			request.onerror = event => {
				console.log('UTM indexedDB error', event.target.error.message)
				reject()
			}
			request.onsuccess = event => {
				const db = event.target.result
				db.onerror = event => console.log("UTM Database error: " + event.target.errorCode)
				resolve(db)
			}
			request.onupgradeneeded  = event => {
				const db = event.target.result
				if (!db.objectStoreNames.contains('data')) {
					db.createObjectStore('data', { 
						keyPath: ["time"] 
					})
				}
				console.log('UTM indexedDB upgrade')
			}
		})
		return UTM.db.promise
	},
	store: type => UTM.db().then(db => {
		if (!db) return false
		return db.transaction(['data'], type).objectStore('data')
	}),
	read: () => UTM.store("readonly"),
	edit: () => UTM.store("readwrite"),
	logout: () => UTM.edit().then(store => {
		const request = store.clear()
		return new Promise((resolve, reject) => {
			request.onsuccess = event => resolve(true)
			request.onerror = reject
		})
	}).catch(() => null)
	

	
}

export { UTM }
