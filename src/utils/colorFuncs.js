export const calculateColorScale = (
  objArr,
  rankings,
  scale,
  curYear,
  curMetric,
  country
) => {
  let surveyData = Object.values(objArr[curYear]).filter(
    (x) => x.id === country.id
  );
  return surveyData[0]
    ? scale(rankings[curYear][curMetric].indexOf(country.id) + 1)
    : "grey";
}

export const calculateColorLegendValues = (lengthOfYear, numDivisions) => {
  let res = [0];
  let interval = lengthOfYear / numDivisions;
  for (let i = 1; i < 8; i++) {
    res.push(Math.floor(i * interval));
  }
  return res;
}

export const calculateColorLegendColors = (scale, colorLegendValues) => {
  return colorLegendValues.map((val) => scale(val));
}

export const colorRanges = {
  hRank: ["#0DFE5A", "white", "#C41010"],
  econ: ["#143601", "white", "#eca400"],
  family: ["#431259", "white", "#dc2f02"],
  trust: ["#03045E", "white", "#2d6a4f"],
  freedom: ["#fa7921", "white", "#0c4767"],
  generosity: ["#f15152", "white", "#1e555c"],
  health: ["#9a031e", "white", "#560bad"],
};