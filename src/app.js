import { colorLegend } from "./utils/colorLegend.js";
import { makeResponsive } from "./utils/responsiveFuncs.js";
import { parse2015, 
         parse2016,
         parse2017,
         parse2018,
         parse2019  } from "./utils/parseFuncs.js";
import { calculateColorLegendColors,
         calculateColorScale,
         calculateColorLegendValues,
         colorRanges } from "./utils/colorFuncs.js";
import { tooltipSizing } from "./utils/tooltipSizing.js";
import { countryNameVariances, metricExplanations } from "./utils/metricNaming.js";
import { tooltipText } from "./utils/tooltipText.js";

async function convertToObject(func, filename, year) {
  const nameVariances = {
    "Congo (Kinshasa)": "Democratic Republic of the Congo",
    "Congo (Brazzaville)": "Congo",
    "Northern Cyprus": "North Cyprus",
    "North Macedonia": "Macedonia",
    "Hong Kong S.A.R., China": "Hong Kong",
    "Somaliland region": "Somaliland",
    "Somaliland Region": "Somaliland",
    "Taiwan Province of China": "Taiwan",
    "Trinidad & Tobago": "Trinidad and Tobago",
  };
  let myObj = new Object();
  let y = await func(filename);
  myObj["year"] = year;
  y.forEach((row) => {
    if (Object.keys(nameVariances).includes(row["country"])) {
      row["country"] = nameVariances[row["country"]];
    }
    myObj[row["country"]] = row;
  });
  return myObj;
}

function calculateRankings(obj) {
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

let y2015 = convertToObject(parse2015, "/data/2015.csv", 2015);
let y2016 = convertToObject(parse2016, "/data/2016.csv", 2016);
let y2017 = convertToObject(parse2017, "/data/2017.csv", 2017);
let y2018 = convertToObject(parse2018, "/data/2018.csv", 2018);
let y2019 = convertToObject(parse2019, "/data/2019.csv", 2019);
let objArr = {};

Promise.all([y2015, y2016, y2017, y2018, y2019]).then((values) => {
  values.forEach((v) => (objArr[v.year] = v));

  let geoDataGlobal = d3
    .json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json")
    .then((mapData) => {
      let geoData = topojson.feature(mapData, mapData.objects.countries)
        .features;
      geoData.forEach((country) => {
        if (
          Object.keys(countryNameVariances).includes(country.properties.name)
        ) {
          country.properties.name =
            countryNameVariances[country.properties.name];
        }
        if (country.properties.name === "Somaliland") {
          country.id = "1000";
        }
        if (country.properties.name === "Kosovo") {
          country.id = "999";
        }
        if (country.properties.name === "North Cyprus") {
          country.id = "998";
        }
      });
      [2015, 2016, 2017, 2018, 2019].forEach((year) => {
        for (let key in objArr[year]) {
          if (key !== "year") {
            let geoResult = geoData.filter((x) => key === x.properties.name);
            if (geoResult.length > 0) {
              objArr[year][key]["id"] = geoResult[0].id;
            }
          }
        }
      });

      const rankings = calculateRankings(objArr);

      const width = window.innerWidth;
      const height = window.innerHeight;
      const svg = d3.select("#svg-content");
      svg.attr("height", height).attr("width", width).call(makeResponsive);

      let curYear = 2015;
      let curMetric = "hRank";
      const getText = document.querySelector("#metric-text");
      getText.innerHTML = metricExplanations[curMetric];

      const projection = d3
        .geoNaturalEarth1()
        .scale(150)
        .translate([width / 2, height / 2]);

      const pathGenerator = d3.geoPath().projection(projection);

      const g = svg.append("g");

      const colorLegendG = svg
        .append("g")
        .attr("transform", `translate(40,410)`);

      let pathSphere = g
        .append("path")
        .attr("class", "sphere")
        .attr("d", pathGenerator({ type: "Sphere" }));

      svg.call(
        d3
          .zoom()
          .scaleExtent([1, 8])
          .translateExtent([
            [width * -0.25, height * -0.25],
            [width * 1.25, height * 1.25],
          ])
          .on("zoom", () => {
            g.attr("transform", d3.event.transform);
          })
      );

      let tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      svg.on("click", function () {
        d3.selectAll(".tooltip-rect").style("opacity", 0);
      });

      g.selectAll("path")
        .data(geoData.reverse())
        .enter()
        .append("path")
        .attr("class", "country")
        .attr("d", (d) => pathGenerator(d))
        .attr("id", (d) => d.id)
        .attr("name", (d) => d.properties.name);

      d3.selectAll(".country")
        .on("mouseover", function (d, i) {
          let svgHeight = svg.attr("height");
          let svgWidth = svg.attr("width");
          let curText = tooltipText(objArr, rankings, curYear, d);
          tooltip.transition().duration(200).style("opacity", 0.8);
          tooltip.html(curText);
          let event = d3.event;

          if (!event.offsetX || !event.offestY) {
            tooltipSizing(
              tooltip,
              event,
              curText.length,
              svgHeight,
              svgWidth,
              "Firefox"
            );
          } else {
            tooltipSizing(
              tooltip,
              event,
              curText.length,
              svgHeight,
              svgWidth,
              "Chrome"
            );
          }
        })
        .on("mouseout", function (d) {
          tooltip
            .transition()
            .duration(500)
            .style("opacity", 0)
            .style("height", "auto");
        });

      let scale = d3
        .scaleLinear()
        .domain([
          1,
          Object.values(objArr[curYear]).length / 2,
          Object.values(objArr[curYear]).length + 1,
        ])
        .range(colorRanges[curMetric]);

      let colorLegendScale = d3.scaleOrdinal();
      let colorLegendVals = calculateColorLegendValues(
        Object.values(objArr[curYear]).length,
        7
      );
      colorLegendScale
        .domain([
          "Best",
          "Good",
          "Better",
          "Average",
          "Worse",
          "Not Good",
          "Worst",
        ])
        .range(calculateColorLegendColors(scale, colorLegendVals));

      colorLegendG.call(colorLegend, {
        colorLegendScale,
        circleRadius: 8,
        spacing: 20,
        textOffset: 12,
        backgroundRectWidth: 100,
      });

      d3.selectAll(".country").attr("fill", (d) =>
        calculateColorScale(objArr, rankings, scale, curYear, curMetric, d)
      );

      const getYear = document.querySelector("#years");
      getYear.addEventListener("change", (event) => {
        curYear = parseInt(event.target.value);
        colorLegendVals = calculateColorLegendValues(
          Object.values(objArr[curYear]).length,
          7
        );

        d3.selectAll(".country");

        d3.selectAll(".country")
          .transition()
          .duration(850)
          .ease(d3.easeCircleOut)
          .attr("fill", (d) =>
            calculateColorScale(objArr, rankings, scale, curYear, curMetric, d)
          );
      });

      const getMetric = document.querySelector("#metrics");
      getMetric.addEventListener("change", (event) => {
        curMetric = event.target.value;
        getText.innerHTML = metricExplanations[curMetric];
        scale = d3
          .scaleLinear()
          .domain([
            1,
            Object.values(objArr[curYear]).length / 2,
            Object.values(objArr[curYear]).length + 1,
          ])
          .range(colorRanges[curMetric]);

        colorLegendScale.range(
          calculateColorLegendColors(scale, colorLegendVals)
        );

        colorLegendG.call(colorLegend, {
          colorLegendScale,
          circleRadius: 8,
          spacing: 20,
          textOffset: 12,
          backgroundRectWidth: 100,
        });

        d3.selectAll(".country")
          .transition()
          .duration(850)
          .ease(d3.easeCircleOut)
          .attr("fill", (d) =>
            calculateColorScale(objArr, rankings, scale, curYear, curMetric, d)
          );
      });
    })
    .catch((e) => console.log(e));
});
