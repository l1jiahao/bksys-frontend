<template>
  <div>
    <a-row :gutter="24">
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="预约次数" :total="numTotal">
          <a-tooltip :title="$t('dashboard.analysis.introduce')" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
          </div>
          <!-- <template slot="footer"> 今日预约次数 <span>￥ 234.56</span></template> -->
        </chart-card>
      </a-col>

      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="违约次数" :total="numUnfinished | NumberFormat">
          <a-tooltip title="$t('dashboard.analysis.introduce')" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
          </div>
          <!-- <template slot="footer">今日违约次数<span> {{ '1234' | NumberFormat }}</span></template> -->
        </chart-card>
      </a-col>
    </a-row>

    <a-card :loading="loading" :bordered="false" :body-style="{padding: '0'}">
      <div class="salesCard">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
          <div class="extra-wrapper" slot="tabBarExtraContent">
            <div class="extra-item">
              <a>{{ $t('dashboard.analysis.all-day') }}</a>
              <a>{{ $t('dashboard.analysis.all-week') }}</a>
              <a>{{ $t('dashboard.analysis.all-month') }}</a>
              <a>{{ $t('dashboard.analysis.all-year') }}</a>
            </div>
            <a-range-picker :style="{width: '256px'}" />
          </div>
          <a-tab-pane loading="true" tab="预约" key="1">
            <a-row>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list title="预约排名" :list="countSortedList.slice(0,10)"/>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane tab="签到" key="2">
            <a-row>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list title="签到排名" :list="signCountSortedList.slice(0,10)"/>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>
  </div>
</template>

<script>
import {
ChartCard,
MiniArea,
MiniBar,
MiniProgress,
RankList,
Bar,
Trend,
NumberInfo,
MiniSmoothArea
} from '@/components'
import { baseMixin } from '@/store/app-mixin'
import { getAllRecord, getAllClassroomRecord } from '@/api/data_analysis'

export default {
name: 'Analysis',
mixins: [baseMixin],
components: {
    ChartCard,
    MiniArea,
    MiniBar,
    MiniProgress,
    RankList,
    Bar,
    Trend,
    NumberInfo,
    MiniSmoothArea
},
data () {
    return {
    loading: true,
    records: [],
    countSortedList: [],
    signCountSortedList: [],
    pieStyle: {
        stroke: '#fff',
        lineWidth: 1
    }
    }
},
computed: {
    numTotal () {
        return this.records.length
    },
    numUnfinished () {
        return this.records.filter(item => item.status_id === 3).length
    }
},
created () {
    this.doGetAllRecord()
    this.doGetClassroomRecord()
},
methods: {
    doGetAllRecord () {
        getAllRecord().then(res => {
            const data = res.data
            // console.log(res)
            if (data.code === 1) {
                this.records = data.message
                // console.log(this.records)
            } else {
                this.$message.error(data.message)
            }
            // console.log(res)
        }).catch(err => {
            console.log(err)
        })
    },
    doGetClassroomRecord () {
        getAllClassroomRecord().then(res => {
            const data = res.data
            if (data.code === 1) {
                console.log(data.message)
                // 生成 count 排序的列表
                this.countSortedList = data.message.map(item => ({ name: item.classroom, total: item.count }))
                .sort((a, b) => b.total - a.total)

                // 生成 sign_count 排序的列表
                this.signCountSortedList = data.message.map(item => ({ name: item.classroom, total: item.sign_count }))
                .sort((a, b) => b.total - a.total)
                this.loading = false
            } else {
                this.$message.error(data.message)
            }
        }).catch(err => {
            console.log(err)
        })
    }
}
}
</script>

<style lang="less" scoped>
.extra-wrapper {
    line-height: 55px;
    padding-right: 24px;

    .extra-item {
    display: inline-block;
    margin-right: 24px;

    a {
        margin-left: 24px;
    }
    }
}

.antd-pro-pages-dashboard-analysis-twoColLayout {
    position: relative;
    display: flex;
    display: block;
    flex-flow: row wrap;
}

.antd-pro-pages-dashboard-analysis-salesCard {
    height: calc(100% - 24px);
    :deep(.ant-card-head) {
    position: relative;
    }
}

.dashboard-analysis-iconGroup {
    i {
    margin-left: 16px;
    color: rgba(0,0,0,.45);
    cursor: pointer;
    transition: color .32s;
    color: black;
    }
}
.analysis-salesTypeRadio {
    position: absolute;
    right: 54px;
    bottom: 12px;
}
</style>
