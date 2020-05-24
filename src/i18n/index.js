import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const languages = [
  {value: 'en-US', label: 'English'},
  {value: 'zh-CN', label: '简体中文'},
  {value: 'zh-TW', label: '繁體中文'}
]

const multiSchoolData = {
  school: [
    "福建工程学院",
    "福州大学",
    "福建师范大学",
    "厦门大学",
    "集美大学"
  ],
  Faculty: [
    [
      "信息科学与工程学院"
    ],
    [
      "数学与计算机科学学院"
    ],
    [
      "数学与计算机科学学院"
    ],
    [
      "信息科学与技术学院"
    ],
    [
      "计算机工程学院"
    ]
  ],
  Major: [
    [
      [
        "计算机科学与技术",
        "软件工程",
        "大数据",
        "软件工程",
        "网络工程",
        "信息管理与信息系统",
        "通信工程",
        "电子信息工程",
        "电气工程及其自动化"
      ]
    ],
    [
      [
        "计算机科学与技术",
        "数学与应用数学",
        "信息与计算科学",
        "网络工程",
        "信息安全"
      ]
    ],
    [
      [
        "计算机科学与技术",
        "数学系"
      ]
    ],
    [
      [
        "计算机科学与技术",
        "通信工程",
        "电子信息工程",
        "智能科学与技术",
        "网络空间安全"
      ]
    ],
    [
      [
        "计算机科学与技术",
        "软件工程",
        "网络工程",
        "智能科学与技术"
      ]
    ]
  ]
}

const multiSchool = []
const messages = {}

for (let i = 0; i < multiSchoolData.school.length; ++i) {
  multiSchool[i] = {
    value: multiSchoolData.school[i],
    label: multiSchoolData.school[i],
  }
  for (let j = 0; j < multiSchoolData.Faculty[i].length; ++j) {
    if (!multiSchool[i].children) {
      multiSchool[i].children = []
    }
    multiSchool[i].children.push({
      value: multiSchoolData.Faculty[i][j],
      label: multiSchoolData.Faculty[i][j],
    })
    for (let k = 0; k < multiSchoolData.Major[i][j].length; ++k) {
      if (!multiSchool[i].children[j].children) {
        multiSchool[i].children[j].children = []
      }
      multiSchool[i].children[j].children.push({
        value: multiSchoolData.Major[i][j][k],
        label: multiSchoolData.Major[i][j][k]
      })
    }
  }
}

// combine admin and oj
for (let lang of languages) {
  let locale = lang.value
  let m = require(`./oj/${locale}`).m
  Object.assign(m, require(`./admin/${locale}`).m)
  messages[locale] = {m: m}
}
console.log(messages)
// load language packages
export default new VueI18n({
  locale: 'en-US',
  messages: messages
})

export {languages, multiSchool}
