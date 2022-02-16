export const tooltipText = (objArr, rankings, year, country) => {
  let surveyData = Object.values(objArr[year]).filter(
    (x) => x.id === country.id
  );
  if (surveyData[0]) {
    let rankedMetrics = [
      "econ",
      "family",
      "trust",
      "health",
      "freedom",
      "generosity",
    ];
    let length = rankings[year]["econ"].length;
    let countryHTML = "<h3>" + surveyData[0].country + "</h3>";
    let t =
      countryHTML + `\nHappiness Rank: ${surveyData[0].hRank} / ${length}\n\n`;
    rankedMetrics.forEach((metric) => {
      let curRank = rankings[year][metric].indexOf(country.id) + 1;
      let upperCaseMetric = metric.charAt(0).toUpperCase() + metric.slice(1);
      t += `${upperCaseMetric} Rank: ${curRank} / ${length}\n\n`;
    });
    return t.trim();
  } else {
    return "<h3>" + country.properties.name + "</h3>";
  }
}