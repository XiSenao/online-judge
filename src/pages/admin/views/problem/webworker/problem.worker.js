function getZIPFileValueLists (zipFileLists) {
	let newZipFileLists = []
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
	let { spiderFlag, resValue } = event.data
	let nowTags = resValue[0], zipFile = []
	var JSZip = require("jszip")
	var new_zip = new JSZip()
	let exTags = []
	Object.keys(nowTags).forEach(res => {
		let now = nowTags[res]
		exTags.push({
			id: now.tagId,
			value: now.name
		})
	})
	if (!spiderFlag) {
		zipFile = resValue[1]	
		new_zip.loadAsync(zipFile).then(file => {
			let promiseQueue = [], contentValue = [], fileNameLists = []
			Object.keys(file.files).forEach(fileName => {
				fileNameLists.push(fileName)
				promiseQueue.push(new_zip.file(fileName).async("string"))
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

function postData(url, method, options) {
	// Default options are marked with *
	if (options !== undefined) {
    var {params = {}, data = {}, headers = {}, responseType = {}} = options
  } else {
    params = data = headers = responseType = {}
  }
  return fetch(url, {
    body: JSON.stringify(data), // must match 'Content-Type' header
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, same-origin, *omit
    headers: {
      'user-agent': 'Mozilla/4.0 MDN Example',
      'content-type': 'application/json'
    },
    method: method, // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, cors, *same-origin
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // *client, no-referrer
  })
  .then(response => response.json()) // parses response to JSON
}
// const actions = [
//   {
//     message: 'dome',
//     func: (res, op) => {
//       console.log('begin')
//       console.log(res)
//       console.log(op)
//       let spiderFlag = res, resValue = op
//       let nowTags = resValue[0], zipFile = []
//       console.log(resValue[1])
//       console.log(resValue[0])
//       console.log(this)
//       console.log('SAAD')
//       var JSZip = require("jszip")
//       console.log('SACCC')   
//       console.log(JSZip)
//       var new_zip = new JSZip()
//       let exTags = []
//       Object.keys(nowTags).forEach(res => {
//         let now = nowTags[res]
//         exTags.push({
//           id: now.tagId,
//           value: now.name
//         })
//       })
//       if (!spiderFlag) {
//         zipFile = resValue[1]
//         console.log(zipFile)
//         new_zip.loadAsync(zipFile).then(file => {
//           console.log('GO')
//           let promiseQueue = [], contentValue = [], fileNameLists = []
//           Object.keys(file.files).forEach(fileName => {
//             fileNameLists.push(fileName)
//             promiseQueue.push(new_zip.file(fileName).async("string"))
//           })
//           Promise.all(promiseQueue).then(res => {
//             for (let i = 0; i < res.length; ++i) {
//               contentValue.push({
//                 fileName: fileNameLists[i],
//                 fileValue: res[i]
//               })
//             }
//             return JSON.stringify({ exTags, contentValue })
//           })
//         }).catch(res => {
//           console.log(res)
//           return JSON.stringify({ exTags, contentValue: null })
//         })
//       }
//       return JSON.stringify({ exTags })
//     }
//   }
// ]
// let worker = this.$worker.create(actions)