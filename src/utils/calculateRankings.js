export const calculateRankings = (obj) => {
  let rankings = {};
  let rankedMetrics = [
    "hRank",
    "econ",
    "family",
    "health",
    "trust",
    "freedom",
    "generosity",
  ];
  [2015, 2016, 2017, 2018, 2019].forEach((year) => {
    rankings[year] = {};
    if (obj[year]) {
      let curYear = Object.values(obj[year]);
      curYear.shift();
      rankedMetrics.forEach((metric) => {
        let curMetric = [...curYear];
        if (metric !== "hRank") {
          curMetric.sort((a, b) =>
            parseFloat(a[metric]) > parseFloat(b[metric]) ? -1 : 1
          );
        }
        curMetric = curMetric.map((key) => key["id"]);
        rankings[year][metric] = curMetric;
      });
    }
  });
  return rankings;
}