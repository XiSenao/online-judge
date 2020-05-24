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
  data: {
    data: {
      "languages": [
        {
            "spj": {
                "config": {
                    "command": "{exe_path} {in_file_path} {user_out_file_path}",
                    "exe_name": "spj-{spj_version}",
                    "seccomp_rule": "c_cpp"
                },
                "compile": {
                    "exe_name": "spj-{spj_version}",
                    "src_name": "spj-{spj_version}.c",
                    "max_memory": 1073741824,
                    "max_cpu_time": 3000,
                    "max_real_time": 10000,
                    "compile_command": "/usr/bin/gcc -DONLINE_JUDGE -O2 -w -fmax-errors=3 -std=c11 {src_path} -lm -o {exe_path}"
                }
            },
            "name": "C",
            "config": {
                "run": {
                    "env": [
                        "LANG=en_US.UTF-8",
                        "LANGUAGE=en_US:en",
                        "LC_ALL=en_US.UTF-8"
                    ],
                    "command": "{exe_path}",
                    "seccomp_rule": {
                        "File IO": "c_cpp_file_io",
                        "Standard IO": "c_cpp"
                    }
                },
                "compile": {
                    "exe_name": "main",
                    "src_name": "main.c",
                    "max_memory": 268435456,
                    "max_cpu_time": 3000,
                    "max_real_time": 10000,
                    "compile_command": "/usr/bin/gcc -DONLINE_JUDGE -O2 -w -fmax-errors=3 -std=c11 {src_path} -lm -o {exe_path}"
                },
                "template": "//PREPEND BEGIN\n#include <stdio.h>\n//PREPEND END\n\n//TEMPLATE BEGIN\nint add(int a, int b) {\n  // Please fill this blank\n  return ___________;\n}\n//TEMPLATE END\n\n//APPEND BEGIN\nint main() {\n  printf(\"%d\", add(1, 2));\n  return 0;\n}\n//APPEND END"
            },
            "description": "GCC 5.4",
            "content_type": "text/x-csrc"
        },
        {
            "spj": {
                "config": {
                    "command": "{exe_path} {in_file_path} {user_out_file_path}",
                    "exe_name": "spj-{spj_version}",
                    "seccomp_rule": "c_cpp"
                },
                "compile": {
                    "exe_name": "spj-{spj_version}",
                    "src_name": "spj-{spj_version}.cpp",
                    "max_memory": 1073741824,
                    "max_cpu_time": 10000,
                    "max_real_time": 20000,
                    "compile_command": "/usr/bin/g++ -DONLINE_JUDGE -O2 -w -fmax-errors=3 -std=c++14 {src_path} -lm -o {exe_path}"
                }
            },
            "name": "C++",
            "config": {
                "run": {
                    "env": [
                        "LANG=en_US.UTF-8",
                        "LANGUAGE=en_US:en",
                        "LC_ALL=en_US.UTF-8"
                    ],
                    "command": "{exe_path}",
                    "seccomp_rule": {
                        "File IO": "c_cpp_file_io",
                        "Standard IO": "c_cpp"
                    }
                },
                "compile": {
                    "exe_name": "main",
                    "src_name": "main.cpp",
                    "max_memory": 1073741824,
                    "max_cpu_time": 10000,
                    "max_real_time": 20000,
                    "compile_command": "/usr/bin/g++ -DONLINE_JUDGE -O2 -w -fmax-errors=3 -std=c++14 {src_path} -lm -o {exe_path}"
                },
                "template": "//PREPEND BEGIN\n#include <iostream>\n//PREPEND END\n\n//TEMPLATE BEGIN\nint add(int a, int b) {\n  // Please fill this blank\n  return ___________;\n}\n//TEMPLATE END\n\n//APPEND BEGIN\nint main() {\n  std::cout << add(1, 2);\n  return 0;\n}\n//APPEND END"
            },
            "description": "G++ 5.4",
            "content_type": "text/x-c++src"
        },
        {
            "name": "Java",
            "config": {
                "run": {
                    "env": [
                        "LANG=en_US.UTF-8",
                        "LANGUAGE=en_US:en",
                        "LC_ALL=en_US.UTF-8"
                    ],
                    "command": "/usr/bin/java -cp {exe_dir} -XX:MaxRAM={max_memory}k -Djava.security.manager -Dfile.encoding=UTF-8 -Djava.security.policy==/etc/java_policy -Djava.awt.headless=true Main",
                    "seccomp_rule": null,
                    "memory_limit_check_only": 1
                },
                "compile": {
                    "exe_name": "Main",
                    "src_name": "Main.java",
                    "max_memory": -1,
                    "max_cpu_time": 5000,
                    "max_real_time": 10000,
                    "compile_command": "/usr/bin/javac {src_path} -d {exe_dir} -encoding UTF8"
                },
                "template": "//PREPEND BEGIN\n//PREPEND END\n\n//TEMPLATE BEGIN\n//TEMPLATE END\n\n//APPEND BEGIN\n//APPEND END"
            },
            "description": "OpenJDK 1.8",
            "content_type": "text/x-java"
        },
        {
            "name": "Python2",
            "config": {
                "run": {
                    "env": [
                        "LANG=en_US.UTF-8",
                        "LANGUAGE=en_US:en",
                        "LC_ALL=en_US.UTF-8"
                    ],
                    "command": "/usr/bin/python {exe_path}",
                    "seccomp_rule": "general"
                },
                "compile": {
                    "exe_name": "solution.pyc",
                    "src_name": "solution.py",
                    "max_memory": 134217728,
                    "max_cpu_time": 3000,
                    "max_real_time": 10000,
                    "compile_command": "/usr/bin/python -m py_compile {src_path}"
                },
                "template": "//PREPEND BEGIN\n//PREPEND END\n\n//TEMPLATE BEGIN\n//TEMPLATE END\n\n//APPEND BEGIN\n//APPEND END"
            },
            "description": "Python 2.7",
            "content_type": "text/x-python"
        },
        {
            "name": "Python3",
            "config": {
                "run": {
                    "env": [
                        "LANG=en_US.UTF-8",
                        "LANGUAGE=en_US:en",
                        "LC_ALL=en_US.UTF-8"
                    ],
                    "command": "/usr/bin/python3 {exe_path}",
                    "seccomp_rule": "general"
                },
                "compile": {
                    "exe_name": "__pycache__/solution.cpython-35.pyc",
                    "src_name": "solution.py",
                    "max_memory": 134217728,
                    "max_cpu_time": 3000,
                    "max_real_time": 10000,
                    "compile_command": "/usr/bin/python3 -m py_compile {src_path}"
                },
                "template": "//PREPEND BEGIN\n//PREPEND END\n\n//TEMPLATE BEGIN\n//TEMPLATE END\n\n//APPEND BEGIN\n//APPEND END"
            },
            "description": "Python 3.5",
            "content_type": "text/x-python"
        }
      ],
      "spj_languages": [
          {
              "spj": {
                  "config": {
                      "command": "{exe_path} {in_file_path} {user_out_file_path}",
                      "exe_name": "spj-{spj_version}",
                      "seccomp_rule": "c_cpp"
                  },
                  "compile": {
                      "exe_name": "spj-{spj_version}",
                      "src_name": "spj-{spj_version}.c",
                      "max_memory": 1073741824,
                      "max_cpu_time": 3000,
                      "max_real_time": 10000,
                      "compile_command": "/usr/bin/gcc -DONLINE_JUDGE -O2 -w -fmax-errors=3 -std=c11 {src_path} -lm -o {exe_path}"
                  }
              },
              "name": "C",
              "config": {
                  "run": {
                      "env": [
                          "LANG=en_US.UTF-8",
                          "LANGUAGE=en_US:en",
                          "LC_ALL=en_US.UTF-8"
                      ],
                      "command": "{exe_path}",
                      "seccomp_rule": {
                          "File IO": "c_cpp_file_io",
                          "Standard IO": "c_cpp"
                      }
                  },
                  "compile": {
                      "exe_name": "main",
                      "src_name": "main.c",
                      "max_memory": 268435456,
                      "max_cpu_time": 3000,
                      "max_real_time": 10000,
                      "compile_command": "/usr/bin/gcc -DONLINE_JUDGE -O2 -w -fmax-errors=3 -std=c11 {src_path} -lm -o {exe_path}"
                  },
                  "template": "//PREPEND BEGIN\n#include <stdio.h>\n//PREPEND END\n\n//TEMPLATE BEGIN\nint add(int a, int b) {\n  // Please fill this blank\n  return ___________;\n}\n//TEMPLATE END\n\n//APPEND BEGIN\nint main() {\n  printf(\"%d\", add(1, 2));\n  return 0;\n}\n//APPEND END"
              },
              "description": "GCC 5.4",
              "content_type": "text/x-csrc"
          },
          {
              "spj": {
                  "config": {
                      "command": "{exe_path} {in_file_path} {user_out_file_path}",
                      "exe_name": "spj-{spj_version}",
                      "seccomp_rule": "c_cpp"
                  },
                  "compile": {
                      "exe_name": "spj-{spj_version}",
                      "src_name": "spj-{spj_version}.cpp",
                      "max_memory": 1073741824,
                      "max_cpu_time": 10000,
                      "max_real_time": 20000,
                      "compile_command": "/usr/bin/g++ -DONLINE_JUDGE -O2 -w -fmax-errors=3 -std=c++14 {src_path} -lm -o {exe_path}"
                  }
              },
              "name": "C++",
              "config": {
                  "run": {
                      "env": [
                          "LANG=en_US.UTF-8",
                          "LANGUAGE=en_US:en",
                          "LC_ALL=en_US.UTF-8"
                      ],
                      "command": "{exe_path}",
                      "seccomp_rule": {
                          "File IO": "c_cpp_file_io",
                          "Standard IO": "c_cpp"
                      }
                  },
                  "compile": {
                      "exe_name": "main",
                      "src_name": "main.cpp",
                      "max_memory": 1073741824,
                      "max_cpu_time": 10000,
                      "max_real_time": 20000,
                      "compile_command": "/usr/bin/g++ -DONLINE_JUDGE -O2 -w -fmax-errors=3 -std=c++14 {src_path} -lm -o {exe_path}"
                  },
                  "template": "//PREPEND BEGIN\n#include <iostream>\n//PREPEND END\n\n//TEMPLATE BEGIN\nint add(int a, int b) {\n  // Please fill this blank\n  return ___________;\n}\n//TEMPLATE END\n\n//APPEND BEGIN\nint main() {\n  std::cout << add(1, 2);\n  return 0;\n}\n//APPEND END"
              },
              "description": "G++ 5.4",
              "content_type": "text/x-c++src"
          }
      ]
    }
  }
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

export const MYSTICKEY_CHANGE = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJ3ZWIiLCJpc3MiOiJvbmxpbmUtanVkZ2UiLCJleHAiOjE1ODU5ODk2NzUsImlhdCI6MTU4NTk4NjA3NSwianRpIjoiOTI3OGUzYWU4MzlkNDEwZWJhZWY3OTk4NmFiNGNhOTUiLCJ1c2VybmFtZSI6InNhZG1pbiJ9.lmrbt_JCp1o1kXoO1m4Z8R9IpGFYF8rV8UYd4yeqUeE'

export const TIME_TIME_OUT = 6000

export const CONTEST_STATUS = {
  'NOT_START': '1',
  'UNDERWAY': '0',
  'ENDED': '-1'
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
  // '1': {
  //   name: 'Not Started',
  //   color: 'yellow'
  // },
  // '0': {
  //   name: 'Underway',
  //   color: 'green'
  // },
  // '-1': {
  //   name: 'Ended',
  //   color: 'red'
  // }
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
    // 字母+数字+特殊字符
    KEY: 'High', 
    REG: '^.*(?=.{6,16})(?=.*\d)(?=.*[A-Z]{2,})(?=.*[a-z]{2,})(?=.*[!@#$%^&*?\(\)]).*$'
  }, {
    // 字母+数字，字母+特殊字符，数字+特殊字符
    KEY: 'Middle',
    REG: '^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$'
  }, {
    // 纯数字，纯字母，纯特殊字符
    KEY: 'Week',
    REG: '^(?:\d+|[a-zA-Z]+|[!@#$%^&*]+)$'
  }
]

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

export const GOOGLE_ANALYTICS_ID = 'UA-111499601-1'
