const exFormatText = require('@/utils/JudgeServer/poj').exFormatText
const Base64 = require('js-base64').Base64
const CONSTANTS_TEMPLATE = require('@/utils/constants').CONSTANTS_TEMPLATE

onmessage = function (event) {
	const data = JSON.parse(event.data)
	const template = data.codeTemplate ? JSON.parse(Base64.decode(data.codeTemplate)) : {}
	const templateLists = {}
	for (const temp in template) {
		const nowValue = template[temp]
		const nowName = template[temp].key
		let mode = ''
		for (const constemp in CONSTANTS_TEMPLATE) {
			const now = CONSTANTS_TEMPLATE[constemp]
			if (now.name === nowName) {
				mode = now.content_type
			}
		}
		templateLists[nowName] = {
			checked: false,
			code: nowValue.value,
			mode
		}
	}
	this.template = templateLists
	if (data.sourceName.indexOf('@') === 0) {
		data.sourceName = data.sourceName.substring(1)
	}
	data.description = exFormatText(data.description)
	data.output_description = exFormatText(data.output_description)
	data.input_description = exFormatText(data.input_description)
	const problem = {
		description: data.description,
		hint: data.hint,
		_id: data.id,
		io_mode: data.ioMode,
		judgeTypeId: data.judgeTypeId,
		languages: data.language.split(','),
		difficulty: data.level,
		memory_limit: data.memoryLimit,
		output_description: data.outputDescription,
		input_description: data.inputDescription,
		contest_id: data.sourceId || 0,
		source: data.sourceName,
		spj: !!data.spj,
		visible: data.status > -1,
		time_limit: data.timeLimit,
		title: data.title,
		judgeType: data.judgeType,
		spj_language: data.spjLanguage,
		spj_code: data.spjCode
	}
	postMessage(JSON.stringify(problem))
}
