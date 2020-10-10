function getZIPFileValueLists (zipFileLists) {
	const newZipFileLists = []
	this.testCaseUploaded = true
	for (let i = 0; i < zipFileLists.length; ++i) {
		newZipFileLists.push({
			inputFile: zipFileLists[i],
			outputFile: i + 1 < zipFileLists.length ? zipFileLists[i + 1] : '-'
		})
		i++
	}
	return newZipFileLists
}

onmessage = function (event) {
	const { spiderFlag, resValue } = event.data
	const nowTags = resValue[0]
	let zipFile = []
	var JSZip = require('jszip')
	var new_zip = new JSZip()
	const exTags = []
	Object.keys(nowTags).forEach(res => {
		const now = nowTags[res]
		exTags.push({
			id: now.tagId,
			value: now.name
		})
	})
	if (!spiderFlag) {
		zipFile = resValue[1]
		new_zip.loadAsync(zipFile).then(file => {
			const promiseQueue = []
			let contentValue = []
			const fileNameLists = []
			Object.keys(file.files).forEach(fileName => {
				fileNameLists.push(fileName)
				promiseQueue.push(new_zip.file(fileName).async('string'))
			})
			Promise.all(promiseQueue).then(res => {
				for (let i = 0; i < res.length; ++i) {
					contentValue.push({
						fileName: fileNameLists[i],
						fileValue: res[i]
					})
				}
				contentValue = getZIPFileValueLists(contentValue)
				postMessage(JSON.stringify({ contentValue, exTags }))
			})
		}).catch(_ => {
			postMessage(JSON.stringify({ exTags, contentValue: null }))
		})
	} else {
		postMessage(JSON.stringify({ exTags }))
	}
}

