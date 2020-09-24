export default [{
    path: '/form',
    name: 'Form',
    component: resolve => require(['components/demo-components/form'], resolve),
    meta: { title: '表单', icon: 'icon-paper' }
},
{
    path: '/form-detail',
    name: 'FormDetail',
    component: resolve => require(['components/demo-components/form-detail'], resolve),
    meta: { title: '表单详情' }
},
{
    path: '/autocomplete1',
    name: 'Autocomplete1',
    component: resolve => require(['components/demo-components/autocomplete1'], resolve),
    meta: { title: '自动补全' }
},
{
    path: '/autocomplete2',
    name: 'Autocomplete2',
    component: resolve => require(['components/demo-components/autocomplete2'], resolve),
    meta: { title: '自动补全2' }
},
{
    path: '/autocomplete3',
    name: 'Autocomplete3',
    component: resolve => require(['components/demo-components/autocomplete3'], resolve),
    meta: { title: '自动补全3' }
},
{
    path: '/icons',
    name: 'Icons',
    component: resolve => require(['components/demo-components/icons'], resolve),
    meta: { title: '图表列表', icon: 'icon-grid' }
},
{
    path: '/form-basic',
    name: 'FormBasic',
    component: resolve => require(['components/demo-components/form/basic'], resolve),
    meta: { title: '基础表单', icon: 'icon-paper' }
},
{
    path: '/form-create',
    name: 'FormCreate',
    component: resolve => require(['components/demo-components/form/create'], resolve),
    meta: { title: '创建表单' }
},
{
    path: '/table-basic',
    name: 'TableBasic',
    component: resolve => require(['components/demo-components/table/basic'], resolve),
    meta: { title: '基础表格' }
},
{
    path: '/table-search',
    name: 'TableSearch',
    component: resolve => require(['components/demo-components/table/search'], resolve),
    meta: { title: '查询表格' }
},
{
    path: '/table-detail',
    name: 'TableDetail',
    component: resolve => require(['components/demo-components/table/detail'], resolve),
    meta: { title: '表格详情' }
},
{
    path: '/account-basic',
    name: 'AccountBasic',
    component: resolve => require(['components/demo-components/account/account'], resolve),
    meta: { title: '个人中心', icon: 'icon-head' }
},
{
    path: '/account-setting/',
    name: 'AccountSetting',
    component: resolve => require(['components/demo-components/account/account-setting'], resolve),
    children: [{
        path: 'security-setting',
        name: 'SecuritySetting',
        component: resolve => require(['components/demo-components/account/modules/security-setting'], resolve),
        meta: { title: '安全设置' }
    },
    {
        path: 'notice-setting',
        name: 'NoticeSetting',
        component: resolve => require(['components/demo-components/account/modules/notice-setting'], resolve),
        meta: { title: '通知设置' }
    }
    ],
    meta: { title: '个人设置' }
},
{
    path: '/info-basic',
    name: 'InfoBasic',
    component: resolve => require(['components/demo-components/info/basic'], resolve),
    meta: { title: '基础信息' }
},
{
    path: '/info-detail',
    name: 'InfoDetail',
    component: resolve => require(['components/demo-components/info/detail'], resolve),
    meta: { title: '信息详情' }
},
{
    path: '/address-picker',
    name: 'AddressPicker',
    component: resolve => require(['components/demo-components/components/address-picker'], resolve),
    meta: { title: '地址选择器' }
},
{
    path: '/chart',
    name: 'Chart',
    component: resolve => require(['components/demo-components/components/chart'], resolve),
    meta: { title: '图表' }
},
{
    path: '/code-editor',
    name: 'CodeEditor',
    component: resolve => require(['components/demo-components/components/code-editor'], resolve),
    meta: { title: '代码编辑器' }
},
{
    path: '/markdown-editor',
    name: 'MarkdownEditor',
    component: resolve => require(['components/demo-components/components/markdown-editor'], resolve),
    meta: { title: 'markdown编辑器' }
},
{
    path: '/ricktext-editor',
    name: 'RicktextEditor',
    component: resolve => require(['components/demo-components/components/richtext-editor'], resolve),
    meta: { title: '富文本编辑器' }
},
{
    path: '/baidu-map',
    name: 'BaiduMap',
    component: resolve => require(['components/demo-components/components/baidu-map'], resolve),
    meta: { title: '百度地图' }
},

{
    path: '/projectList',
    name: 'projectList',
    component: resolve => require(['components/project/project'], resolve),
    meta: { title: '项目管理' }
},
{
    path: '/project_detail',
    name: 'project_detail',
    component: resolve => require(['components/project/components/project_detail'], resolve),
    meta: { title: '项目详情' }
},
{
    path: '/project_teamList',
    name: 'project_teamList',
    component: resolve => require(['components/project/project_teamList'], resolve),
    meta: { title: '团队' }
},
{
    path: '/UserManagement',
    name: 'UserManagement',
    component: resolve => require(['components/user/UserManagement'], resolve),
    meta: { title: '用户管理' }
},
{
    path: '/taskAssign',
    name: 'taskAssign',
    component: resolve => require(['components/task/task_list'], resolve),
    meta: { title: '任务分派' }
},
{
    path: '/task_detail/:useId',
    name: 'task_detail',
    component: resolve => require(['components/task/components/task_detail'], resolve),
    meta: { title: '任务详情' }
},
{
    path: '/mytask',
    name: 'mytask',
    component: resolve => require(['components/task/mytask_list'], resolve),
    meta: { title: '我的任务' }
},
{
    path: '/overtimeMessage',
    name: 'overtimeMessage',
    component: resolve => require(['components/workmanage/overtime/overtime_list'], resolve),
    meta: { title: '加班信息' }
},
{
    path: '/overtimeApprove',
    name: 'overtimeApprove',
    component: resolve => require(['components/workmanage/overtime/approve_list'], resolve),
    meta: { title: '加班审批' }
},
{
    path: '/overtime_detail',
    name: 'overtime_detail',
    component: resolve => require(['components/workmanage/overtime/components/overtime_detail'], resolve),
    meta: { title: '加班信息详情' }
},
{
    path: '/approve_detail',
    name: 'approve_detail',
    component: resolve => require(['components/workmanage/overtime/components/approve_detail'], resolve),
    meta: { title: '加班审批详情' }
},
{
    path: '/leaveMessage',
    name: 'leaveMessage',
    component: resolve => require(['components/workmanage/leave/leave_list'], resolve),
    meta: { title: '请假信息' }
},
{
    path: '/leave_detail',
    name: 'leave_detail',
    component: resolve => require(['components/workmanage/leave/components/leave_detail'], resolve),
    meta: { title: '请假详情' }
},
{
    path: '/leaveApprove',
    name: 'leaveApprove',
    component: resolve => require(['components/workmanage/leave/approve_list'], resolve),
    meta: { title: '请假审批' }
},
{
    path: '/approve_detail',
    name: 'approve_detail',
    component: resolve => require(['components/workmanage/leave/components/approve_detail'], resolve),
    meta: { title: '请假审批详情' }
},
{
    path: '/evectionMessage',
    name: 'evectionMessage',
    component: resolve => require(['components/workmanage/evection/evection_list'], resolve),
    meta: { title: '出差信息' }
},
{
    path: '/evection_detail',
    name: 'evection_detail',
    component: resolve => require(['components/workmanage/evection/components/evection_detail'], resolve),
    meta: { title: '出差详情' }
},
{
    path: '/evectionApprove',
    name: 'evectionApprove',
    component: resolve => require(['components/workmanage/evection/approve_list'], resolve),
    meta: { title: '出差审批' }
},
{
    path: '/restMessage',
    name: 'restMessage',
    component: resolve => require(['components/workmanage/rest/rest_list'], resolve),
    meta: { title: '调休信息' }
},
{
    path: '/rest_detail',
    name: 'rest_detail',
    component: resolve => require(['components/workmanage/rest/components/rest_detail'], resolve),
    meta: { title: '调休详情' }
},
{
    path: '/restApprove',
    name: 'restApprove',
    component: resolve => require(['components/workmanage/rest/approve_list'], resolve),
    meta: { title: '调休审批' }
},
{
    path: '/vehicleMessage',
    name: 'vehicleMessage',
    component: resolve => require(['components/workmanage/vehicle/vehicle_list'], resolve),
    meta: { title: '用车信息' }
},
{
    path: '/vehicle-view',
    name: 'vehicle-view',
    component: resolve => require(['components/workmanage/vehicle/components/vehicle_detail'], resolve),
    meta: { title: '用车详情' }
},
{
    path: '/vehicleApprove',
    name: 'vehicleApprove',
    component: resolve => require(['components/workmanage/vehicle/approve_list'], resolve),
    meta: { title: '用车审批' }
},
{
    path: '/outMessage',
    name: 'outMessage',
    component: resolve => require(['components/workmanage/out/out_list'], resolve),
    meta: { title: '外出信息' }
},
{
    path: '/out_detail',
    name: 'out_detail',
    component: resolve => require(['components/workmanage/out/components/out_detail'], resolve),
    meta: { title: '外出详情' }
},
{
    path: '/outApprove',
    name: 'outApprove',
    component: resolve => require(['components/workmanage/out/approve_list'], resolve),
    meta: { title: '外出审批' }
},
{
    path: '/myAttendance',
    name: 'myAttendance',
    component: resolve => require(['components/workmanage/attendance/myAttendance_list'], resolve),
    meta: { title: '我的考勤' }
},
{
    path: '/recording',
    name: 'recording',
    component: resolve => require(['components/workmanage/attendance/recording_list'], resolve),
    meta: { title: '补录审核' }
},
{
    path: '/recording_detail',
    name: 'recording_detail',
    component: resolve => require(['components/workmanage/attendance/components/recording_detail'], resolve),
    meta: { title: '补录详情' }
},
// {
//   path: '/statistics',
//   name: 'statistics',
//   component: resolve => require(['components/workmanage/attence/recording-List'], resolve),
//   meta: { title: '考勤统计' }
// },
{
    path: '/attendance',
    name: 'attendance',
    component: resolve => require(['components/workmanage/attendance/attendance_list'], resolve),
    meta: { title: '考勤统计' }
},
{
    path: '/notice',
    name: 'notice',
    component: resolve => require(['components/workmanage/notice/notice_list.vue'], resolve),
    meta: { title: '通知公告' }
},
{
    path: '/notice_detail',
    name: 'notice_detail',
    component: resolve => require(['components/workmanage/notice/components/notice_detail'], resolve),
    meta: { title: '通知公告详情' }
},
{
    path: '/expenseMessage',
    name: 'expenseMessage',
    component: resolve => require(['components/workmanage/expense/expense_list'], resolve),
    meta: { title: '招待费报销信息' }
},
{
    path: '/expense_detail',
    name: 'expense_detail',
    component: resolve => require(['components/workmanage/expense/components/expense_detail'], resolve),
    meta: { title: '招待费报销信息详情' }
},
{
    path: '/expenseApprove',
    name: 'expenseApprove',
    component: resolve => require(['components/workmanage/expense/approve_list'], resolve),
    meta: { title: '招待费报销审批' }
},
{
    path: '/approve_detail',
    name: 'approve_detail',
    component: resolve => require(['components/workmanage/expense/components/approve_detail'], resolve),
    meta: { title: '招待费报销审批详情' }
},
{
    path: '/travelMessage',
    name: 'travelMessage',
    component: resolve => require(['components/workmanage/travelExpense/expense_list'], resolve),
    meta: { title: '出差费报销信息' }
},
{
    path: '/expense_detail',
    name: 'expense_detail',
    component: resolve => require(['components/workmanage/travelExpense/components/expense_detail'], resolve),
    meta: { title: '出差费报销信息详情' }
},
{
    path: '/travelApprove',
    name: 'travelApprove',
    component: resolve => require(['components/workmanage/travelExpense/approve_list'], resolve),
    meta: { title: '出差费报销审批' }
},
{
    path: '/approve_detail',
    name: 'approve_detail',
    component: resolve => require(['components/workmanage/travelExpense/components/approve_detail'], resolve),
    meta: { title: '出差费报销审批详情' }
},
{
    path: '/workplan',
    name: 'workplan',
    component: resolve => require(['components/workmanage/workplan/workplan_list'], resolve),
    meta: { title: '工作计划' }
},
{
    path: '/workplan_detail',
    name: 'workplan_detail',
    component: resolve => require(['components/workmanage/workplan/components/workplan_detail'], resolve),
    meta: { title: '工作计划详情' }
},
{
    path: '/worklog',
    name: 'worklog',
    component: resolve => require(['components/workmanage/attendance/worklog_list'], resolve),
    meta: { title: '工作日志' }
},
{
    path: '/worklog_detail',
    name: 'worklog_detail',
    component: resolve => require(['components/workmanage/attendance/components/worklog_detail'], resolve),
    meta: { title: '工作日志详情' }
},
{
    path: '/face',
    name: 'face',
    component: resolve => require(['components/workmanage/face/group_list'], resolve),
    meta: { title: '人脸库管理' }
},
{
    path: '/face_detail',
    name: 'face_detail',
    component: resolve => require(['components/workmanage/face/components/face_detail'], resolve),
    meta: { title: '人脸图' }
},
{
    path: '/userManage',
    name: 'userManage',
    component: resolve => require(['components/syssetting/userManage/user-list'], resolve),
    meta: { title: '用户管理' }
},
{
    path: '/deptManage',
    name: 'deptManage',
    component: resolve => require(['components/syssetting/deptManage/dept-list'], resolve),
    meta: { title: '部门管理' }
},
{
    path: '/roleManage',
    name: 'roleManage',
    component: resolve => require(['components/syssetting/roleManage/role-list'], resolve),
    meta: { title: '角色管理' }
},
{
    path: '/rolemember-list',
    name: 'rolemember-list',
    component: resolve => require(['components/syssetting/roleManage/rolemember-list'], resolve),
    meta: { title: '角色成员' }
},
{
    path: '/moduleManage',
    name: 'moduleManage',
    component: resolve => require(['components/syssetting/moduleManage/module-list'], resolve),
    meta: { title: '模块管理' }
},
{
    path: '/btnManage',
    name: 'btnManage',
    component: resolve => require(['components/syssetting/btnManage/btn-list'], resolve),
    meta: { title: '按钮管理' }
},
{
    path: '/dictManage',
    name: 'dictManage',
    component: resolve => require(['components/syssetting/dictManage/dict-list'], resolve),
    meta: { title: '字典管理' }
},
{
    path: '/operationLog',
    name: 'operationLog',
    component: resolve => require(['components/syssetting/operationLog/operationLog-list'], resolve),
    meta: { title: '操作日志' }
},
{
    path: '/loginLog',
    name: 'loginLog',
    component: resolve => require(['components/syssetting/loginLog/loginlog-list'], resolve),
    meta: { title: '登录日志' }
},
];