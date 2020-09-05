import variables from '@/styles/themes/variables'
import variablesWhite from '@/styles/themes/variables-white'

export const JUDGE_STATUS = {
  'CompileError': {
    name: 'Compile Error',
    short: 'CE',
    color: 'yellow',
    type: 'warning',
    isResult: true
  },
  'WrongAnswer': {
    name: 'Wrong Answer',
    short: 'WA',
    color: 'red',
    type: 'error',
    isResult: true
  },
  'Accepted': {
    name: 'Accepted',
    short: 'AC',
    color: 'green',
    type: 'success',
    isResult: true
  },
  'TimeLimitExceeded': {
    name: 'Time Limit Exceeded',
    short: 'TLE',
    color: 'red',
    type: 'error',
    isResult: true
  },
  'OutputLimitExceeded': {
    name: 'Output Limit Exceeded',
    short: 'OLE',
    color: 'red',
    type: 'error',
    isResult: true
  },
  'MemoryLimitExceeded': {
    name: 'Memory Limit Exceeded',
    short: 'MLE',
    color: 'red',
    type: 'error',
    isResult: true
  },
  'RuntimeError': {
    name: 'Runtime Error',
    short: 'RE',
    color: 'red',
    type: 'error',
    isResult: true
  },
  'SystemError': {
    name: 'System Error',
    short: 'SE',
    color: 'red',
    type: 'error',
    isResult: true
  },
  'PresentationError': {
    name: 'Presentation Error',
    short: 'PE',
    color: 'red',
    type: 'error',
    isResult: true
  },
  'Pending': {
    name: 'Pending',
    color: 'yellow',
    short: 'Pend',
    type: 'warning',
    isResult: false
  },
  'Judging': {
    name: 'Judging',
    color: 'blue',
    type: 'info',
    isResult: false
  },
  'PartialAccepted': {
    name: 'Partial Accepted',
    short: 'PAC',
    color: 'blue',
    type: 'info',
    isResult: true
  },
  'Submitting': {
    name: 'Submitting',
    color: 'yellow',
    type: 'warning',
    isResult: false
  }
}
export const LANGUAGES = {
  languages: [
    {
      name: 'C',
      config: {
        template: '//PREPEND BEGIN\n#include <stdio.h>\n//PREPEND END\n\n//TEMPLATE BEGIN\nint add(int a, int b) {\n  // Please fill this blank\n  return ___________;\n}\n//TEMPLATE END\n\n//APPEND BEGIN\nint main() {\n  printf("%d", add(1, 2));\n  return 0;\n}\n//APPEND END',
        compile_command: `/usr/bin/gcc -DONLINE_JUDGE -O2 -w -fmax-errors=3 -std=c11 {src_path} -lm -o {exe_path}`
      },
      description: 'GCC 5.4',
      content_type: 'text/x-csrc'
    },
    {
      name: 'C++',
      config: {
        template: '//PREPEND BEGIN\n#include <iostream>\n//PREPEND END\n\n//TEMPLATE BEGIN\nint add(int a, int b) {\n  // Please fill this blank\n  return ___________;\n}\n//TEMPLATE END\n\n//APPEND BEGIN\nint main() {\n  std::cout << add(1, 2);\n  return 0;\n}\n//APPEND END',
        compile_command: `/usr/bin/g++ -DONLINE_JUDGE -O2 -w -fmax-errors=3 -std=c++14 {src_path} -lm -o {exe_path}`
      },
      description: 'G++ 5.4',
      content_type: 'text/x-c++src'
    },
    {
      name: 'Java',
      config: {
        template: '//PREPEND BEGIN\n//PREPEND END\n\n//TEMPLATE BEGIN\n//TEMPLATE END\n\n//APPEND BEGIN\n//APPEND END',
        compile_command: `/usr/bin/javac {src_path} -d {exe_dir} -encoding UTF8`
      },
      description: 'OpenJDK 1.8',
      content_type: 'text/x-java'
    },
    {
      name: 'Python2',
      config: {
        template: '//PREPEND BEGIN\n//PREPEND END\n\n//TEMPLATE BEGIN\n//TEMPLATE END\n\n//APPEND BEGIN\n//APPEND END',
        compile_command: `/usr/bin/python -m py_compile {src_path}`
      },
      description: 'Python 2.7',
      content_type: 'text/x-python'
    },
    {
      name: 'Python3',
      config: {
        template: '//PREPEND BEGIN\n//PREPEND END\n\n//TEMPLATE BEGIN\n//TEMPLATE END\n\n//APPEND BEGIN\n//APPEND END',
        compile_command: `/usr/bin/python3 -m py_compile {src_path}`
      },
      description: 'Python 3.5',
      content_type: 'text/x-python'
    }
  ],
  spj_languages: [
    {
      name: 'C',
      config: {
        template: '//PREPEND BEGIN\n#include <stdio.h>\n//PREPEND END\n\n//TEMPLATE BEGIN\nint add(int a, int b) {\n  // Please fill this blank\n  return ___________;\n}\n//TEMPLATE END\n\n//APPEND BEGIN\nint main() {\n  printf("%d", add(1, 2));\n  return 0;\n}\n//APPEND END'
      },
      description: 'GCC 5.4',
      content_type: 'text/x-csrc'
    },
    {
      name: 'C++',
      config: {
        template: '//PREPEND BEGIN\n#include <iostream>\n//PREPEND END\n\n//TEMPLATE BEGIN\nint add(int a, int b) {\n  // Please fill this blank\n  return ___________;\n}\n//TEMPLATE END\n\n//APPEND BEGIN\nint main() {\n  std::cout << add(1, 2);\n  return 0;\n}\n//APPEND END'
      },
      description: 'G++ 5.4',
      content_type: 'text/x-c++src'
    }
  ]
}
export const CONSTANTS_TEMPLATE = [
  {
    name: 'Java',
    template: '//PREPEND BEGIN\n//PREPEND END\n\n//TEMPLATE BEGIN\n//TEMPLATE END\n\n//APPEND BEGIN\n//APPEND END',
    content_type: 'text/x-java'
  },
  {
    name: 'Python2',
    template: '//PREPEND BEGIN\n//PREPEND END\n\n//TEMPLATE BEGIN\n//TEMPLATE END\n\n//APPEND BEGIN\n//APPEND END',
    content_type: 'text/x-python'
  },
  {
    name: 'Python3',
    template: '//PREPEND BEGIN\n//PREPEND END\n\n//TEMPLATE BEGIN\n//TEMPLATE END\n\n//APPEND BEGIN\n//APPEND END',
    content_type: 'text/x-python'
  },
  {
    name: 'C',
    template: '//PREPEND BEGIN\n#include <stdio.h>\n//PREPEND END\n\n//TEMPLATE BEGIN\nint add(int a, int b) {\n  // Please fill this blank\n  return ___________;\n}\n//TEMPLATE END\n\n//APPEND BEGIN\nint main() {\n  printf(\"%d\", add(1, 2));\n  return 0;\n}\n//APPEND END',
    content_type: 'text/x-csrc'
  },
  {
    name: 'C++',
    template: '//PREPEND BEGIN\n#include <iostream>\n//PREPEND END\n\n//TEMPLATE BEGIN\nint add(int a, int b) {\n  // Please fill this blank\n  return ___________;\n}\n//TEMPLATE END\n\n//APPEND BEGIN\nint main() {\n  std::cout << add(1, 2);\n  return 0;\n}\n//APPEND END',
    content_type: 'text/x-c++src'
  }
]
export const CONSTANTS_SPJ_TEMPLATE = {
  name: 'SPJ',
  template:
`#include <stdio.h>
#define AC 0
#define WA 1
#define ERROR -1

int spj(FILE *input, FILE *user_output);

void close_file(FILE *f){
    if(f != NULL){
        fclose(f);
    }
}

int main(int argc, char *args[]){
    FILE *input = NULL, *user_output = NULL;
    int result;
    if(argc != 3){
        printf("Usage: spj x.in x.out");
        return ERROR;
    }
    input = fopen(args[1], "r");
    user_output = fopen(args[2], "r");
    if(input == NULL || user_output == NULL){
        printf("Failed to open output file");
        close_file(input);
        close_file(user_output);
        return ERROR;
    }

    result = spj(input, user_output);
    printf("result: %d", result);

    close_file(input);
    close_file(user_output);
    return result;
}

int spj(FILE *input, FILE *user_output){
    /*
      parameter: 
        - input，标程输入的文件指针
        - user_output，用户输出文件的指针
      return: 
        - 如果用户答案正确，返回AC
        - 如果用户答案错误返回WA
        - 如果主动捕获到自己的错误，如内存分配失败，返回ERROR
      请用户完成此函数.
      demo:
      int a, b;
      while(fscanf(f, "%d %d", &a, &b) != EOF){
          if(a -b != 3){
              return WA;
          }
      }
      return AC;
    */
}`,
  content_type: 'text/x-csrc'
}

export const DEFAULT_AVATAR = '/static/image/defaultAvatar.png'

export const TIME_TIME_OUT = 6000

export const THEME_KEY = '__theme__'

export const THEMES = {
  white: 'white',
  dark: 'dark'
}

export const THEME_MAP = {
  [THEMES.dark]: {
    title: '深色',
    file: variables
  },
  [THEMES.white]: {
    title: '浅色',
    file: variablesWhite
  }
}

export const CONTEST_STATUS = {
  'NOT_START': '1',
  'UNDERWAY': '0',
  'ENDED': '-1'
}

export const JUDGE_SERVER = {
  'POJ': 'POJ',
  'QDOJ': 'QDJudgeServer'
}

export const CONTEST_QUERY_VALUE = {
  'EX_NOT_START': '未开始',
  'EX_UNDERWAY': '进行中',
  'EX_ENDED': '已结束',
  'PUBLIC': '公开',
  'PROOF': '认证',
  'KEY': '密码',
  'WARM_UP': '练习',
  'INTEGRAL': '积分',
  'ACM_ICPC': 'ACM/ICPC'

}

export const CONTEST_STATUS_REVERSE = {
  '未开始': {
    name: 'Not Started',
    color: 'yellow'
  },
  '进行中': {
    name: 'Underway',
    color: 'green'
  },
  '已结束': {
    name: 'Ended',
    color: 'red'
  },
  '1': {
    name: 'Normal',
    color: 'green'
  },
  '0': {
    name: 'Ended',
    color: 'red'
  },
  '-1': {
    name: 'Not Started',
    color: 'yellow'
  }
}

export const RULE_TYPE = {
  ACM: 'ACM',
  OI: 'OI'
}

export const CONTEST_TYPE = {
  CPUBLIC: '公开',
  CPRIVATE: '密码',
  PUBLIC: 'Public',
  PRIVATE: 'Password Protected'
}

export const USER_TYPE = {
  REGULAR_USER: 'Regular User',
  ADMIN: 'Admin',
  SUPER_ADMIN: 'Super Admin'
}

export const ADMIN_TYPE = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin'
}

export const PROBLEM_PERMISSION = {
  NONE: 'None',
  OWN: 'Own',
  ALL: 'All'
}

export const USER_NORMAL_INFO = {
  SUPERADMIN: {
    avatar: '/static/image/superadmin.png',
    username: 'Welcome',
    admin_type: 'SuperAdmin'
  },
  ADMIN: {
    avatar: '/static/image/admin.png',
    username: 'Welcome',
    admin_type: 'Admin'
  },
  ANONYMOUS: {
    avatar: '/static/image/defaultAvatar.png',
    username: 'Who?',
    admin_type: 'Anonymous'
  }
}

export const PAWSTRENGTH = [
  {
    // 数字, 大写字母, 小写字母, 特殊字符四选三组成的密码强度, 且长度在8到30个数之间
    KEY: 'High',
    COLOR: '#42b983',
    REG: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{8,20}$/
  }, {
    // 字母 + 数字, 字母 + 特殊字符, 数字 + 特殊字符
    KEY: 'Middle',
    COLOR: '#dbd766',
    REG: /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]{7,20}$/
  }, {
    // 纯数字, 纯字母, 纯特殊字符
    KEY: 'Week',
    COLOR: '#d97e7e',
    REG: /^(\d{6,30}|[a-zA-Z]{6,30}|[!@#$%^&*]{6,30})$/
  }
]

export const URL_REG = '^((https|http|ftp)://)?' +// (https或http或ftp):// 可有可无
   '(([\\w_!~*\'()\\.&=+$%-]+: )?[\\w_!~*\'()\\.&=+$%-]+@)?' + // ftp的user@ 可有可无
   '(([0-9]{1,3}\\.){3}[0-9]{1,3}' + // IP形式的URL- 3位数字.3位数字.3位数字.3位数字
   '|' + // 允许IP和DOMAIN（域名）
   '(localhost)|' + // 匹配localhost
   '([\\w_!~*\'()-]+\\.)*' + // 域名- 至少一个[英文或数字_!~*\'()-]加上.
   '\\w+\\.' + // 一级域名 -英文或数字 加上.
   '[a-zA-Z]{1,6})' + // 顶级域名- 1-6位英文
   '(:[0-9]{1,5})?' + // 端口- :80 ,1-5位数字
   '((/?)|' + // url无参数结尾 - 斜杆或这没有
   '(/[\\w_!~*\'()\\.;?:@&=+$,%#-]+)+/?)$' // 请求参数结尾- 英文或数字和[]内的各种字符

export const STORAGE_KEY = {
  AUTHED: 'authed',
  PROBLEM_CODE: 'problemCode',
  languages: 'languages',
  TOKEN: 'token'
}

export function buildProblemCodeKey (problemID, contestID = null) {
  if (contestID) {
    return `${STORAGE_KEY.PROBLEM_CODE}_${contestID}_${problemID}`
  }
  return `${STORAGE_KEY.PROBLEM_CODE}_NaN_${problemID}`
}

export const GOOGLE_ANALYTICS_ID = 'UA-170628607-1'
