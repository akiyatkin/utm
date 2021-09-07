const UTM = {	
	init: async () => {
		const referrer = document.referrer
		if (!referrer) return
		const ref = new URL(referrer)
		if (ref.host == location.host) return
		const time = Math.round(new Date().getTime() / 1000)
		const href = location.href
		return UTM.update({ time, referrer, href })
	},
	get: async () => UTM.read().then(store => {
		const request = store.getAll()
		return new Promise((resolve, reject) => {
			request.onsuccess = event => resolve(request.result)
			request.onerror = reject
		})
	}).catch(() => null),
	update: (val) => UTM.edit().then(store => {
		const request = store.put(val)
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
				const db = request.result
				db.onerror = event => console.log("UTM Database error: " + event.target.errorCode)
				resolve(db)
			}
			request.onupgradeneeded  = event => {
				const db = request.result
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
