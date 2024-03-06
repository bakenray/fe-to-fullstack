const fs = require("fs");
const path = require("path");

let dataCache = null;

function loadData() {
  if (!dataCache) {
    const file = path.resolve(__dirname, "../mock/data.json");
    const data = JSON.parse(fs.readFileSync(file, { encoding: "utf-8" }));
    const reports = data.dailyReports;
    dataCache = {};
    // 以时间为key，缓存起来
    reports.forEach((report) => {
      dataCache[report.updatedDate] = report;
    });
  }
  return dataCache;
}

function getCoronavirusKeyIndex() {
  return Object.keys(loadData());
}

function getCoronavirusByDate(date) {
  const dailyDate = loadData()[date] || {};
  if (dailyDate.countries) {
    //按照各国确诊人数排序
    dailyDate.countries.sort((a, b) => {
      return b.confirmed - a.confirmed;
    });
  }
  return dailyDate;
}

module.exports = {
  getCoronavirusByDate,
  getCoronavirusKeyIndex,
};
