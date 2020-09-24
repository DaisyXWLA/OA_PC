const fullMenus = [
    // {
    //   title: '公司展示台',
    //   key: 'Home',
    //   icon: 'icon-monitor'
    // },
    {
        title: '项目管理',
        key: 'projectList',
        icon: 'h-icon-task'
    },
    {
        title: '任务管理',
        key: 'task',
        icon: 'icon-paper',
        children: [{
                title: '任务分派',
                key: 'taskAssign'
            },
            {
                title: '我的任务',
                key: 'mytask'
            }
        ]
    },
    {
        title: '办公管理',
        key: 'work',
        icon: 'h-icon-edit',
        children: [{
                title: '加班管理',
                key: 'overtime',
                children: [{
                        title: '加班信息',
                        key: 'overtimeMessage'
                    },
                    {
                        title: '加班审批',
                        key: 'overtimeApprove'
                    }
                ]
            },
            {
                title: '请假管理',
                key: 'leave',
                children: [{
                        title: '请假信息',
                        key: 'leaveMessage'
                    },
                    {
                        title: '请假审批',
                        key: 'leaveApprove'
                    }
                ]
            },
            {
                title: '出差管理',
                key: 'evection',
                children: [{
                        title: '出差信息',
                        key: 'evectionMessage'
                    },
                    {
                        title: '出差审批',
                        key: 'evectionApprove'
                    }
                ]
            },
            {
                title: '调休管理',
                key: 'rest',
                children: [{
                        title: '调休信息',
                        key: 'restMessage'
                    },
                    {
                        title: '调休审批',
                        key: 'restApprove'
                    }
                ]
            },
            {
                title: '招待费报销管理',
                key: 'expense',
                children: [{
                        title: '招待费报销信息',
                        key: 'expenseMessage'
                    },
                    {
                        title: '招待费报销审批',
                        key: 'expenseApprove'
                    }
                ]
            },
            {
                title: '出差费报销管理',
                key: 'travelExpense',
                children: [{
                        title: '出差费报销信息',
                        key: 'travelMessage'
                    },
                    {
                        title: '出差费报销审批',
                        key: 'travelApprove'
                    }
                ]
            },
            {
                title: '用车管理',
                key: 'vehicle',
                children: [{
                        title: '用车信息',
                        key: 'vehicleMessage'
                    },
                    {
                        title: '用车审批',
                        key: 'vehicleApprove'
                    }
                ]
            },
            {
                title: '外出管理',
                key: 'out',
                children: [{
                        title: '外出信息',
                        key: 'outMessage'
                    },
                    {
                        title: '外出审批',
                        key: 'outApprove'
                    }
                ]
            },
            {
                title: '考勤管理',
                key: 'attendance',
                children: [{
                        title: '我的考勤',
                        key: 'myAttendance'
                    },
                    {
                        title: '补录审核',
                        key: 'recording'
                    },
                    // {
                    //   title: '考勤统计',
                    //   key: 'statistics'
                    // },
                    {
                        title: '考勤统计',
                        key: 'attendance'
                    }
                ]
            },
            {
                title: '通知公告',
                key: 'notice'
            },
            {
                title: '工作计划',
                key: 'workplan'
            },
            {
                title: '工作日志',
                key: 'worklog'
            },
            {
                title: '人脸库管理',
                key: 'face'
            }
        ]
    },
    {
        title: '系统设置',
        key: 'SysSetting',
        icon: 'icon-cog',
        children: [{
                title: '用户管理',
                key: 'userManage'
            },
            {
                title: '部门管理',
                key: 'deptManage'
            },
            {
                title: '角色管理',
                key: 'roleManage'
            },
            {
                title: '模块管理',
                key: 'moduleManage'
            },
            {
                title: '按钮管理',
                key: 'btnManage'
            },
            {
                title: '字典管理',
                key: 'dictManage'
            },
            {
                title: '操作日志',
                key: 'operationLog'
            },
            {
                title: '登录日志',
                key: 'loginLog'
            }
        ]
    },
    // {
    //   title: '列表应用',
    //   key: 'tablelist',
    //   icon: 'icon-grid-2',
    //   children: [
    //     {
    //       title: '基础表格',
    //       key: 'TableBasic'
    //     },
    //     {
    //       title: '查询列表',
    //       key: 'TableSearch'
    //     }
    //   ]
    // },
    // {
    //   title: '表单应用',
    //   key: 'form-folder',
    //   icon: 'icon-paper',
    //   children: [
    //     {
    //       title: '基础表单',
    //       key: 'Form'
    //     },
    //     {
    //       title: '表单详情',
    //       key: 'FormDetail'
    //     }
    //   ]
    // },
    // {
    //   title: '模糊匹配',
    //   key: 'AutoComplete-folder',
    //   icon: 'icon-disc',
    //   children: [
    //     {
    //       title: '模糊搜索',
    //       key: 'Autocomplete1'
    //     },
    //     {
    //       title: '场景应用',
    //       key: 'Autocomplete2'
    //     },
    //     {
    //       title: '复杂场景',
    //       key: 'Autocomplete3'
    //     }
    //   ]
    // },
    // {
    //   title: '扩展组件',
    //   key: 'Advance-folder',
    //   icon: 'icon-bar-graph-2',
    //   children: [
    //     {
    //       title: '图表',
    //       key: 'Chart'
    //     },
    //     {
    //       title: '富文本编辑器',
    //       key: 'RicktextEditor'
    //     },
    //     {
    //       title: '代码编辑器',
    //       key: 'CodeEditor'
    //     },
    //     {
    //       title: 'Markdown编辑器',
    //       key: 'MarkdownEditor'
    //     },
    //     {
    //       title: '百度地图',
    //       key: 'BaiduMap'
    //     }
    //   ]
    // },
    // {
    //   title: '系统设置',
    //   key: 'SysSetting',
    //   icon: 'icon-cog',
    //   children: [
    //     {
    //       title: '个人中心',
    //       key: 'AccountBasic'
    //     },
    //     {
    //       title: '安全设置',
    //       key: 'SecuritySetting'
    //     },
    //     {
    //       title: '权限设置',
    //       key: 'Authorization'
    //     },
    //     {
    //       title: '用户管理',
    //       key: 'UserManagement'
    //     }
    //   ]
    // }
];

const getMenus = function(menuIdList = []) {
    return getAuthMenu(fullMenus, menuIdList);
};

let getAuthMenu = (menus, menuIdList) => {
    let configMenu = [];
    for (let menu of menus) {
        let m = Utils.copy(menu);
        if (menuIdList.indexOf(m.key) > -1) {
            configMenu.push(m);
        }
        if (menu.children && menu.children.length) {
            m.children = getAuthMenu(menu.children, menuIdList);
        }
    }
    return configMenu;
};

const getKeys = function(menus) {
    let keys = [];
    for (let menu of menus) {
        keys.push(menu.key);
        if (menu.children && menu.children.length) {
            keys.push(...getKeys(menu.children));
        }
    }
    return keys;
};

let fullMenuKeys = getKeys(fullMenus);

const isAuthPage = function(name) {
    let menus = G.get('SYS_MENUS') || [];
    if (fullMenuKeys.indexOf(name) > -1 && menus.indexOf(name) == -1) {
        return false;
    }
    return true;
};

export { getMenus, fullMenus, fullMenuKeys, isAuthPage };