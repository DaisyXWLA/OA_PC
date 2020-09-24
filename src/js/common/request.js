import Ajax from './ajax';

const Request = {
  User: {
    info() {
      return Ajax.get('/account/info');
    }
  },
  Dict: {
    get() {
      return Ajax.get('/dict');
    }
  },
  Home: {
    getMessageList() {
      return Ajax.get('/home/messages');
    }
  },
  Login: {
    login(param) {
      return Ajax.post('/oauth/token', param);
    },
    logout(param) {
      return Ajax.post('/logout', param);
    },
    getInfo(param) {
      return Ajax.get('/api/login/getInfo', param);
    }
  },
  Management: {
    users(params) {
      return Ajax.get('/api/management/users', params);
    },
    roles(params) {
      return Ajax.get('/api/management/roles', params);
    }
  },
  Time: {
    findWorkTime(params) {
      return Ajax.postJson('/api/taskInfo/findWorkTime', params);
    }
  },
  ProjectTask: {
    taskList(params) {
      return Ajax.postJson('/api/taskInfo/findIndex', params);
    },
    findAll(params) {
      return Ajax.postJson('/api/taskInfo/findAll', params);
    },
    findMyInfo(params) {
      return Ajax.postJson('/api/taskInfo/findMyInfo', params);
    },
    taskAdd(params) {
      return Ajax.postJson('/api/taskInfo/save', params);
    },
    taskDel(params) {
      return Ajax.postJson('/api/taskInfo/delete', params);
    },
    mytasklist(params) {
      return Ajax.postJson('/api/taskInfo/start', params);
    },
    projectNameList(params) {
      return Ajax.postJson('/api/projectManage/findAllName', params);
    },
    task(params) {
      return Ajax.postJson('/api/taskInfo/findOne', params);
    },
    taskUpdate(params) {
      return Ajax.postJson('/api/taskInfo/update', params);
    },
    taskPList(params) {
      return Ajax.postJson('/api/taskInfo/findTask', params);
    },
    projectNameAndIdList(params) {
      return Ajax.postJson('/api/projectManage/findAllNameAndId', params);
    },
    findPullDown(params) {
      return Ajax.postJson('/api/taskInfo/findPullDown', params);
    },
    findOneImg(params) {
      return Ajax.postJson('/api/taskInfo/findOneImg', params);
    },
    getTime(params) {
      return Ajax.postJson('/api/taskInfo/getTime', params);
    }
  },
  Maintask: {
    myList(params) {
      return Ajax.postJson('/api/taskInfo/findAll', params);
    },
    myAdd(params) {
      return Ajax.postJson('/api/taskInfo/save', params);
    },
    myDel(params) {
      return Ajax.postJson('/api/taskInfo/delete', params);
    },
    mytasklist(params) {
      return Ajax.postJson('/api/taskInfo/start', params);
    },
    myamend(params) {
      return Ajax.postJson('/api/taskInfo/update', params);
    },
    mystop(params) {
      return Ajax.postJson('/api/taskInfo/stop', params);
    },
    myid(params) {
      return Ajax.postJson('/api/taskInfo/findOne', params);
    },
    myfinish(params) {
      return Ajax.postJson('/api/taskInfo/over', params);
    },
    hour(params) {
      return Ajax.postJson('/api/taskInfo/workHour', params);
    },
    showHour(params) {
      return Ajax.postJson('/api/taskInfo/residueWorkHours', params);
    },
    findHistory(params) {
      return Ajax.postJson('/api/taskInfo/findHistory', params);
    }
  },
  index: {
    projectlist(params) {
      return Ajax.postJson('/api/projectManage/countForIndex', params);
    },
    taskcount(params) {
      return Ajax.postJson('/api/taskInfo/count', params);
    }
  },
  Rms: {
    List(params) {
      return Ajax.postJson('/api/rms/user/findUserList', params);
    },
    AList(params) {
      return Ajax.postJson('/api/rms/user/findList', params);
    },
    ListT(params) {
      return Ajax.postJson('/api/rms/user/findUserListT', params);
    }
  },
  Projectmanage: {
    projectmanageList(params) {
      return Ajax.postJson('/api/projectManage/findAll', params);
    },
    projectmanageUpdate(params) {
      return Ajax.postJson('/api/projectManage/update', params);
    },
    projectmanageAdd(params) {
      return Ajax.postJson('/api/projectManage/save', params);
    },
    projectmanageDel(params) {
      return Ajax.postJson('/api/projectManage/delete', params);
    },
    findMemberAll(params) {
      return Ajax.postJson('/api/projectManage/findMemberAll', params);
    },
    MemberDel(params) {
      return Ajax.postJson('/api/projectManage/batchDeleteMember', params);
    },
    projectFindOne(params) {
      return Ajax.postJson('/api/projectManage/findOne', params);
    },
    addMember(params) {
      return Ajax.postJson('/api/projectManage/addMember', params);
    },
    memberFindOne(params) {
      return Ajax.postJson('/api/projectManage/memberFindOne', params);
    },
    updateMember(params) {
      return Ajax.postJson('/api/projectManage/updateMember', params);
    },
    findOneImg(params) {
      return Ajax.postJson('/api/projectManage/findOneImg', params);
    }
  },
  Upload: {
    Upload(params) {
      return Ajax.postJsonT('/api/docInfo/uploadFile', params);
    },
    delete(params) {
      return Ajax.get('/api/docInfo/delete', params);
    }
  },
  Projecevection: {
    evectionList(params) {
      return Ajax.postJson('/api/travel/findAll', params);
    },
    evectionAdd(params) {
      return Ajax.postJson('/api/travel/save', params);
    },
    evectionDel(params) {
      return Ajax.postJson('/api/travel/delete', params);
    }
  },
  ProjectInform: {
    informList(params) {
      return Ajax.postJson('/api/announcement/findAll', params);
    },
    informAdd(params) {
      return Ajax.postJson('/api/announcement/save', params);
    },
    informDel(params) {
      return Ajax.postJson('/api/announcement/delete', params);
    },
    informUpdate(params) {
      return Ajax.postJson('/api/announcement/update', params);
    },
    informFindOne(params) {
      return Ajax.postJson('/api/announcement/findOne', params);
    },
    informReaderSave(params) {
      return Ajax.postJson('/api/announcement/readerSave', params);
    },
    findAllReaderList(params) {
      return Ajax.postJson('/api/announcement/findAllReader', params);
    }
  },
  Worklog: {
    worklogList(params) {
      return Ajax.postJson('/api/workLog/findAll', params);
    },
    worklogAdd(params) {
      return Ajax.postJson('/api/workLog/save', params);
    },
    worklogDel(params) {
      return Ajax.postJson('/api/workLog/delete', params);
    },
    worklogUpdate(params) {
      return Ajax.postJson('/api/workLog/update', params);
    },
    worklogFindOne(params) {
      return Ajax.postJson('/api/workLog/findOne', params);
    },
    worklogReaderSave(params) {
      return Ajax.postJson('/api/workLog/readerSave', params);
    },
    worklogReader(params) {
      return Ajax.postJson('/api/workLog/findOneReader', params);
    },
    worklogReaderContent(params) {
      return Ajax.postJson('/api/workLog/findOneReaderContent', params);
    }
  },
  ProjecetMyAtt: {
    myAttList(params) {
      return Ajax.postJson('/api/att/findAll', params);
    },
    attDel(params) {
      return Ajax.postJson('/api/att/delete', params);
    },
    attFindOne(params) {
      return Ajax.postJson('/api/att/findOne', params);
    },
    attSave(params) {
      return Ajax.postJson('/api/att/save', params);
    },
    approveList(params) {
      return Ajax.postJson('/api/attAudit/findAll', params);
    },
    approvePass(params) {
      return Ajax.postJson('/api/attAudit/passAudit', params);
    },
    approveRefuse(params) {
      return Ajax.postJson('/api/attAudit/refuseAudit', params);
    },
    approveView(params) {
      return Ajax.postJson('/api/attAudit/lookDetails', params);
    },
    // 考勤统计
    attStatistic(params) {
      return Ajax.postJson('/api/attTable/findAll', params);
    }
  },
  ProjectPlan: {
    planList(params) {
      return Ajax.postJson('/api/plan/findAll', params);
    },
    planAdd(params) {
      return Ajax.postJson('/api/plan/save', params);
    },
    planDel(params) {
      return Ajax.postJson('/api/plan/delete', params);
    },
    planUpdate(params) {
      return Ajax.postJson('/api/plan/update', params);
    },
    planFindOne(params) {
      return Ajax.postJson('/api/plan/findOne', params);
    },
    planReaderSave(params) {
      return Ajax.postJson('/api/plan/readerSave', params);
    },
    planReader(params) {
      return Ajax.postJson('/api/plan/findOneReader', params);
    },
    planReaderContent(params) {
      return Ajax.postJson('/api/plan/findOneReaderContent', params);
    }
  },
  ProjectFace: {
    faceAdd(params) {
      return Ajax.postJson('/api/face/add', params);
    },
    faceUpdate(params) {
      return Ajax.postJson('/api/face/update', params);
    },
    faceDelete(params) {
      return Ajax.postJson('/api/face/delete', params);
    },
    faceFindUser(params) {
      return Ajax.postJson('/api/face/findUser', params);
    },
    faceGetList(params) {
      return Ajax.postJson('/api/face/faceGetList', params);
    },
    faceGetUsers(params) {
      return Ajax.postJson('/api/face/getUsers', params);
    },
    faceGroupAdd(params) {
      return Ajax.postJson('/api/face/groupAdd', params);
    },
    faceGroupDelete(params) {
      return Ajax.postJson('/api/face/groupDelete', params);
    },
    faceDeleteUser(params) {
      return Ajax.postJson('/api/face/deleteUser', params);
    },
    faceGroupGetList(params) {
      return Ajax.postJson('/api/face/groupGetlist', params);
    }
  },
  ProjectLeave: {
    leaveList(params) {
      return Ajax.postJson('/api/leave/findAll', params);
    },
    leaveAdd(params) {
      return Ajax.postJson('/api/leaveFlowable/start', params);
    },
    leaveDel(params) {
      return Ajax.postJson('/api/leave/delete', params);
    },
    leaveUpdate(params) {
      return Ajax.postJson('/api/leave/update', params);
    },
    leaveFindOne(params) {
      return Ajax.postJson('/api/leave/findOne', params);
    },
    leaveAgree(params) {
      return Ajax.postJson('/api/leaveFlowable/success', params);
    },
    leaveRefuse(params) {
      return Ajax.postJson('/api/leaveFlowable/fail', params);
    },
    leaveApproveList(params) {
      return Ajax.postJson('/api/leave/findAll', params);
    },
    leaveApproveFindOne(params) {
      return Ajax.postJson('/api/leave/findOne', params);
    }
  },
  ProjectOverTime: {
    overtimeList(params) {
      return Ajax.postJson('/api/overtime/findAll', params);
    },
    overtimeAdd(params) {
      return Ajax.postJson('/api/overtime/save', params);
    },
    overtimeDel(params) {
      return Ajax.postJson('/api/overtime/delete', params);
    },
    overtimeUpdate(params) {
      return Ajax.postJson('/api/overtime/update', params);
    },
    overtimeFindOne(params) {
      return Ajax.postJson('/api/overtime/findOne', params);
    },
    overtimeAgree(params) {
      return Ajax.postJson('/api/overtime/success', params);
    },
    overtimeRefuse(params) {
      return Ajax.postJson('/api/overtime/fail', params);
    },
    overtimeApproveList(params) {
      return Ajax.postJson('/api/overtime/findAll', params);
    },
    overtimeApproveFindOne(params) {
      return Ajax.postJson('/api/overtime/findOne', params);
    },
    projectNameList(params) {
      return Ajax.postJson('/api/projectManage/findAllName', params);
    }
  },
  userManage: {
    userAdd(params) {
      return Ajax.postJson('/api/rms/user/save', params);
    },
    userUpdate(params) {
      return Ajax.postJson('/api/rms/user/update', params);
    },
    userFindOne(params) {
      return Ajax.postJson('/api/rms/user/findOne', params);
    },
    userFindAllDepartment(params) {
      return Ajax.postJson('/api/rms/user/findAllDepartment', params);
    },
    userFindAllRole(params) {
      return Ajax.postJson('/api/rms/user/findAllRole', params);
    },
    userDelete(params) {
      return Ajax.postJson('/api/rms/user/delete', params);
    },
    userFindAll(params) {
      return Ajax.postJson('/api/rms/user/findAll', params);
    },
    userResetPassword(params) {
      return Ajax.postJson('/api/rms/user/resetPassword', params);
    }
  },
  deptManage: {
    departmentAdd(params) {
      return Ajax.postJson('/api/rms/department/save', params);
    },
    departmentUpdate(params) {
      return Ajax.postJson('/api/rms/department/update', params);
    },
    departmentFindOne(params) {
      return Ajax.postJson('/api/rms/department/findOne', params);
    },
    departmentFindAll(params) {
      return Ajax.postJson('/api/rms/department/findAll', params);
    },
    departmentDelete(params) {
      return Ajax.postJson('/api/rms/department/delete', params);
    },
    departmentFindAllDepartment(params) {
      return Ajax.postJson('/api/rms/department/findAllDepartment', params);
    }
  },
  roleManage: {
    roleAdd(params) {
      return Ajax.postJson('/api/rms/role/save', params);
    },
    roleAddUser(params) {
      return Ajax.postJson('/api/rms/role/saveRoleUser', params);
    },
    roleUpdate(params) {
      return Ajax.postJson('/api/rms/role/update', params);
    },
    roleFindOne(params) {
      return Ajax.postJson('/api/rms/role/findOne', params);
    },
    roleFindAll(params) {
      return Ajax.postJson('/api/rms/role/findAll', params);
    },
    roleFindAllUser(params) {
      return Ajax.postJson('/api/rms/role/findAllUser', params);
    },
    roleFindMembers(params) {
      return Ajax.postJson('/api/rms/role/findRoleMembers', params);
    },
    roleDelete(params) {
      return Ajax.postJson('/api/rms/role/delete', params);
    },
    roleMemberDelete(params) {
      return Ajax.postJson('/api/rms/role/deleteRoleMembers', params);
    },
    modelTree(params) {
      return Ajax.postJson('/api/rms/role/findModelTree', params);
    },
    ModelBotten(params) {
      return Ajax.post('/api/rms/role/findModelBotten', params);
    },
    saveroleModelBotten(params) {
      return Ajax.post('/api/rms/role/saveroleModelBotten', params);
    },
    findUserById(params) {
      return Ajax.post('/api/rms/role/findUserById', params);
    }
  },
  moduleManage: {
    moduleAdd(params) {
      return Ajax.postJson('/api/rms/model/save', params);
    },
    moduleUpdate(params) {
      return Ajax.postJson('/api/rms/model/update', params);
    },
    moduleFindAll(params) {
      return Ajax.postJson('/api/rms/model/findAll', params);
    },
    moduleFindAllAction(params) {
      return Ajax.postJson('/api/rms/model/findAllAction', params);
    },
    moduleFindAllModule(params) {
      return Ajax.postJson('/api/rms/model/findAllModel', params);
    },
    moduleFindOne(params) {
      return Ajax.postJson('/api/rms/model/findOne', params);
    },
    moduleDelete(params) {
      return Ajax.postJson('/api/rms/model/delete', params);
    }
  },
  buttonManage: {
    buttonAdd(params) {
      return Ajax.postJson('/api/rms/action/save', params);
    },
    buttonAddGroup(params) {
      return Ajax.postJson('/api/rms/action/saveGroup', params);
    },
    buttonUpdate(params) {
      return Ajax.postJson('/api/rms/action/update', params);
    },
    buttonUpdateGroup(params) {
      return Ajax.postJson('/api/rms/action/updateGroup', params);
    },
    buttonFindAll(params) {
      return Ajax.postJson('/api/rms/action/findAll', params);
    },
    buttonFindAllGroup(params) {
      return Ajax.postJson('/api/rms/action/findAllGroup', params);
    },
    buttonFindGroupOne(params) {
      return Ajax.postJson('/api/rms/action/findGropOne', params);
    },
    buttonFindOne(params) {
      return Ajax.postJson('/api/rms/action/findOne', params);
    },
    buttonDelete(params) {
      return Ajax.postJson('/api/rms/action/delete', params);
    }
  },
  dictManage: {
    findDictAll(params) {
      return Ajax.postJson('/api/rms/dict/findDictAll', params);
    },
    dictAdd(params) {
      return Ajax.postJson('/api/rms/dict/saveDict', params);
    },
    dictAddValue(params) {
      return Ajax.postJson('/api/rms/dict/saveDictValue', params);
    },
    dictUpdate(params) {
      return Ajax.postJson('/api/rms/dict/updateDict', params);
    },
    dictUpdateValue(params) {
      return Ajax.postJson('/api/rms/dict/updateDictValue', params);
    },
    dictFindAll(params) {
      return Ajax.postJson('/api/rms/dict/findAll', params);
    },
    dictFindAllDep(params) {
      return Ajax.postJson('/api/rms/dict/findAllDict', params);
    },
    dictFindOne(params) {
      return Ajax.postJson('/api/rms/dict/findDictOne', params);
    },
    dictFindValueOne(params) {
      return Ajax.postJson('/api/rms/dict/findDictValueOne', params);
    },
    dictDelete(params) {
      return Ajax.postJson('/api/rms/dict/delete', params);
    }
  },
  operLogManage: {
    operLogFindAll(params) {
      return Ajax.postJson('/api/rms/log/findAll', params);
    },
    operLogDelete(params) {
      return Ajax.postJson('/api/rms/log/delete', params);
    }
  },
  showTaskInfo: {
    showTaskInfo(params) {
      return Ajax.postJson('/api/taskInfo/showTaskInfo', params);
    }
  },
  announcement: {
    announcement(params) {
      return Ajax.postJson('/api/announcement/findAll', params);
    }
  },
  Upload: {
    Upload(params) {
      return Ajax.postJsonT('/api/docInfo/uploadFile', params);
    },
    delete(params) {
      return Ajax.get('/api/docInfo/delete', params);
    }
  }
};
export default Request;
