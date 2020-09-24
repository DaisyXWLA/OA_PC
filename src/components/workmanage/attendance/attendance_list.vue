<style lang='less'>
    #print{
        width: 100%;
        margin-top: 20px;
        text-align: center;
        border-collapse: collapse;
        tr{
            width: 100%;
            th{
                border:1px solid #ccc;
                font-size: 16px;
                line-height: 40px;
            }
            td{
                border:1px solid #ccc;
                line-height: 30px;
            }
        }
    }
</style>
<template>
  <div class="table-basic-vue frame-page">
    <Row :space="9">
      <Cell>
        <div class="h-panel">
          <div class="h-panel-bar">
            <span>
              姓名：
              <input type="text" v-model="myAttList.userName"/>&nbsp;&nbsp;
            </span>
            <span>
              部门：
              <input type="text" v-model="myAttList.department"/>&nbsp;&nbsp;
            </span>
            <span>
              考勤日期：
              <DateRangePicker v-model="time" :format="format" placeholder="开始 - 结束"></DateRangePicker>&nbsp;&nbsp;
            </span>
            <Button color="green" :circle="true" icon="h-icon-search" @click="search">搜索</Button>
            <Button color="yellow" :circle="true" icon="h-icon-refresh" @click="reset">重置</Button>
          </div>
        </div>
      </Cell>
      <Cell>
        <div class="h-panel">
          <div class="h-panel-body">
            <div>
              <Button color="blue" @click="exportExcel('print')" :disabled='dis' v-has="'attendanceexport'">导出excel</Button>
              <Button color="blue" v-print="'#print'" :disabled='dis' v-has="'attendanceprint'">在线打印</Button>
            </div>
            <div ref="tab" :loading="isLoading">
              <table id="print">
                  <thead>
                      <tr>
                          <th :colspan="date.length+15">郑州海友科伟电子员工考勤表</th>
                      </tr>
                      <tr>
                        <td :colspan="date.length-14" style="border-right:none;text-align:right;">代号：</td>
                        <td style="border-right:none;border-left:none;">出勤</td>
                        <td style="border-right:none;border-left:none;">出差</td>
                        <td style="border-right:none;border-left:none;">迟到</td>
                        <td style="border-right:none;border-left:none;">旷工</td>
                        <td style="border-right:none;border-left:none;">事假</td>
                        <td style="border-right:none;border-left:none;">病假</td>
                        <td style="border-right:none;border-left:none;">伤假</td>
                        <td style="border-right:none;border-left:none;">年假</td>
                        <td style="border-right:none;border-left:none;">婚假</td>
                        <td style="border-right:none;border-left:none;">丧假</td>
                        <td style="border-right:none;border-left:none;">其他</td>
                        <td style="border-right:none;border-left:none;">加班</td>
                        <td style="border-right:none;border-left:none;">早退</td>
                        <td colspan="16" style="border-left:none;"></td>
                      </tr>
                      <tr>
                        <td :colspan="date.length-14" style="border-right:none;"></td>
                        <td style="border-right:none;border-left:none;">√</td>
                        <td style="border-right:none;border-left:none;">○</td>
                        <td style="border-right:none;border-left:none;">×</td>
                        <td style="border-right:none;border-left:none;">K</td>
                        <td style="border-right:none;border-left:none;">S</td>
                        <td style="border-right:none;border-left:none;">B</td>
                        <td style="border-right:none;border-left:none;">△</td>
                        <td style="border-right:none;border-left:none;">T</td>
                        <td style="border-right:none;border-left:none;">H</td>
                        <td style="border-right:none;border-left:none;">*</td>
                        <td style="border-right:none;border-left:none;">☆</td>
                        <td style="border-right:none;border-left:none;">◇</td>
                        <td style="border-right:none;border-left:none;">Z</td>
                        <td colspan="16" style="border-left:none;"></td>
                      </tr>
                  </thead>
                  <tbody v-font="12">
                      <tr>
                          <td rowspan="2">序号</td>
                          <td rowspan="2">姓名</td>
                          <td :colspan="date.length">日期</td>
                          <td colspan="13">合计</td>
                      </tr>
                      <tr>
                          <td style="padding:0 5px;width:34px;" v-for="(item,i) in date" :key="i">{{item}}</td>
                          <td>旷</td>
                          <td>事</td>
                          <td>病</td>
                          <td>伤</td>
                          <td>年</td>
                          <td>丧</td>
                          <td>婚</td>
                          <td>迟到</td>
                          <td>早退</td>
                          <td>加班</td>
                          <td>出勤</td>
                          <td>出差</td>
                          <td>其他</td>
                      </tr>
                      <tr v-for="(item,i) in datas" :key="i">
                          <td>{{i+1}}</td>
                          <td>{{item.name}}</td>
                          <td v-for="(time,i) in item.attTime" :key="i">{{time}}</td>
                          <td>{{item.total[0].miner}}</td>
                          <td>{{item.total[0].matterLeave}}</td>
                          <td>{{item.total[0].diseaseLeave}}</td>
                          <td>{{item.total[0].woundLeave}}</td>
                          <td>{{item.total[0].yearLeave}}</td>
                          <td>{{item.total[0].loseLeave}}</td>
                          <td>{{item.total[0].marryLeave}}</td>
                          <td>{{item.total[0].beLate}}</td>
                          <td>{{item.total[0].leaveEarly}}</td>
                          <td>{{item.total[0].work}}</td>
                          <td>{{item.total[0].outWork}}</td>
                          <td>{{item.total[0].travel}}</td>
                          <td>{{item.total[0].other}}</td>
                      </tr>
                      <tr>
                          <td :colspan="date.length-24" style="text-align:left;padding-left:5px;">备注：</td>
                          <td colspan="13" style="text-align:left;padding-left:5px;">迟到详情：</td>
                          <td colspan="13" style="text-align:left;padding-left:5px;">请假详情：</td>
                          <td colspan="13" style="text-align:left;padding-left:5px;">旷工详情：</td>
                      </tr>
                      <tr>
                          <td colspan="10" style="border-right:none;text-align:left;padding-left:5px;">考勤人员（签字）：</td>
                          <td :colspan="date.length+5" style="border-left:none;text-align:left;">日期：</td>
                      </tr>
                  </tbody>
              </table>
              <Pagination
                v-if="pagination.total>0"
                align="right"
                v-model="pagination"
                @change="changePage"
              />
            </div>
          </div>
        </div>
      </Cell>
    </Row>
  </div>
</template>
<script>
import myAttModel from 'model/att/attModel';
// import manba from 'manba';
export default {
  data() {
    return {
      //查询时间
      time:{
        start:'',
        end: ''
      },
      myAttList:myAttModel.parse({}),
      date:[],//考勤表日期
      datas:[],//所有人员考勤数据
      isLoading:false,
      //按钮状态
      dis:true,
      //分页
      pagination: {
        page: 1,
        size: 10,
        total: 100
      },
      format: '',
      // 导出excel
      idTmr:'',
      tableToExcel:(function() {
            var uri = 'data:application/vnd.ms-excel;base64,',
                template = '<html><head><meta charset="UTF-8"></head><body><table  border="1">{table}</table></body></html>',
                base64 = function(s) {
                    return window.btoa(unescape(encodeURIComponent(s)))
                },
                format = function(s, c) {
                    return s.replace(/{(\w+)}/g, function(m, p) {
                        return c[p];
                    })
                }
            return function(table, name) {
                if(!table.nodeType)
                    table = document.getElementById(table)
                var ctx = {
                    worksheet: name || 'Worksheet',
                    table: table.innerHTML
                }
                window.location.href = uri + base64(format(template, ctx))
            }
        })(),

    }
  },
  mounted(){
    this.getData();
  },
  methods: {
    //获取全部数据
    getData(){
      this.isLoading=true;
      this.myAttList.page = this.pagination.page;
      this.myAttList.size = this.pagination.size;
      this.myAttList.total = this.pagination.total;
      this.$refs.tab.style.display='none';
      // this.$Loading();
      R.ProjecetMyAtt.attStatistic(myAttModel.dispose(this.myAttList)).then(resp=>{
        // console.log(resp)
        this.$refs.tab.style.display='none';
        if(resp.ok){
          this.ok=resp.ok;
          this.$refs.tab.style.display='block';
          this.dis=false;
          // this.$Loading.close();
          this.date=resp.body.date;
          this.datas=resp.body.userData;
          this.userName=resp.body.userName;
          this.pagination.page=resp.page;
          this.pagination.size=resp.size;
          this.pagination.total=resp.total;
          this.isLoading=false;
        }else{
          setTimeout(()=>{
            this.$Loading.close();
          },1000)
          this.$Message('暂无数据');
        }
      });
    },
    //根据筛选条件查询
    search() {
      this.myAttList.page = this.pagination.page;
      this.myAttList.size = this.pagination.size;
      this.myAttList.startAttrTime=this.time.start;
      this.myAttList.endAttrTime=this.time.end;
      this.getData();
    },
    //重置筛选条件
    reset() {
      this.myAttList.userName=null;
      this.myAttList.department=null;
      this.time=null;
    },
    changePage() {
      this.getData();
      this.myAttList.page = this.pagination.page;
      this.myAttList.size = this.pagination.size;
    },
    //导出excel兼容主流浏览器
    getExplorer() {
      var explorer = window.navigator.userAgent;
      //ie  
      if(explorer.indexOf("MSIE") >= 0) {
        return 'ie';
      }
      //firefox  
      else if(explorer.indexOf("Firefox") >= 0) {
          return 'Firefox';
      }
      //Chrome  
      else if(explorer.indexOf("Chrome") >= 0) {
          return 'Chrome';
      }
      //Opera  
      else if(explorer.indexOf("Opera") >= 0) {
          return 'Opera';
      }
      //Safari  
      else if(explorer.indexOf("Safari") >= 0) {
          return 'Safari';
      }
    },
    exportExcel(tableid) {
      if(this.getExplorer() == 'ie') {
        var curTbl = document.getElementById(tableid);
        var oXL = new ActiveXObject("Excel.Application");
        var oWB = oXL.Workbooks.Add();
        var xlsheet = oWB.Worksheets(1);
        var sel = document.body.createTextRange();
        sel.moveToElementText(curTbl);
        sel.select();
        sel.execCommand("Copy");
        xlsheet.Paste();
        oXL.Visible = true;
        try {
            var fname = oXL.Application.GetSaveAsFilename("Excel.xls",
        "Excel Spreadsheets (*.xls), *.xls");
        } catch(e) {
            print("Nested catch caught " + e);
        } finally {
            oWB.SaveAs(fname);
            oWB.Close(savechanges = false);
            oXL.Quit();
            oXL = null;
            this.idTmr = window.setInterval("this.Cleanup();", 1);
        }
 
      } else {
        this.tableToExcel(tableid)
      }
    },
    Cleanup() {
      window.clearInterval(this.idTmr);
      CollectGarbage();
    },
  },
}
</script>