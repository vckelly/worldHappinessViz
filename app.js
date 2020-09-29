function parse2015(filename) {
  return d3.dsv(",", filename, function(d) {
    return {
      country: d["Country"],
      region: d["Region"],
      hRank: d["Happiness Rank"],
      hScore: d["Happiness Score"],
      stdErr: d["Standard Error"],
      econ: d["Economy (GDP per Capita)"],
      family: d["Family"],
      health: d["Health (Life Expectancy)"],
      freedom: d["Freedom"],
      trust: d["Trust (Government Corruption)"],
      generosity: d["Generosity"],
      dystopia: d["Dystopia Residual"]
    };
  })
};

function parse2016(filename) {
  return d3.dsv(",", filename, function(d) {
    return {
      country: d["Country"],
      region: d["Region"],
      hRank: d["Happiness Rank"],
      hScore: d["Happiness Score"],
      econ: d["Economy (GDP per Capita)"],
      family: d["Family"],
      health: d["Health (Life Expectancy)"],
      freedom: d["Freedom"],
      trust: d["Trust (Government Corruption)"],
      generosity: d["Generosity"],
      dystopia: d["Dystopia Residual"]
    };
  })
};

function parse2017(filename) {
  return d3.dsv(",", filename, function(d) {
    return {
      country: d["Country"],
      hRank: d["Happiness.Rank"],
      hScore: d["Happiness.Score"],
      econ: d["Economy..GDP.per.Capita."],
      family: d["Family"],
      health: d["Health..Life.Expectancy."],
      freedom: d["Freedom"],
      trust: d["Trust..Government.Corruption."],
      generosity: d["Generosity"],
      dystopia: d["Dystopia.Residual"]
    };
  })
};

function parse2018(filename) {
  return d3.dsv(",", filename, function(d) {
    return {
      country: d["Country or region"],
      hRank: d["Overall rank"],
      hScore: d["Score"],
      econ: d["GDP per capita"],
      family: d["Social support"],
      health: d["Healthy life expectancy"],
      freedom: d["Freedom to make life choices"],
      trust: d["Perceptions of corruption"],
      generosity: d["Generosity"]
    };
  })
};

function parse2019(filename) {
  return d3.dsv(",", filename, function(d) {
    return {
      country: d["Country or region"],
      hRank: d["Overall rank"],
      hScore: d["Score"],
      econ: d["GDP per capita"],
      family: d["Social support"],
      health: d["Healthy life expectancy"],
      freedom: d["Freedom to make life choices"],
      trust: d["Perceptions of corruption"],
      generosity: d["Generosity"]
    };
  })
};

async function convertToObject(func, filename, year) {
  let myObj = new Object();
  myObj["year"] = year;
  let y = await func(filename);
  y.forEach((row) => {
    myObj[row["country"]] = row;
  })
  return myObj;
};

let y2015 = convertToObject(parse2015, "/data/2015.csv", 2015)
let y2016 = convertToObject(parse2016, "/data/2016.csv", 2016)
let y2017 = convertToObject(parse2017, "/data/2017.csv", 2017)
let y2018 = convertToObject(parse2018, "/data/2018.csv", 2018)
let y2019 = convertToObject(parse2019, "/data/2019.csv", 2019)

let objArr = {}
Promise.all([y2015, y2016, y2017, y2018, y2019]).then(values => {
  values.forEach((v) => {
    objArr[v.year] = v;
  })
});

function calculateRankings(obj) {
  let rankings = {};
  let rankedMetrics = ['econ', 'family', 'trust', 'freedom', 'generosity'];
  [2015, 2016, 2017, 2018, 2019].forEach((year) => {
    rankings[year] = {};
    let curYear = Object.values(obj[year]);
    curYear.shift();
    rankedMetrics.forEach(metric => {
      let curMetric = [...curYear];
      curMetric.sort((a, b) => (a[metric] >= b[metric] ? -1 : 1));
      rankings[year][metric] = curMetric;
    });
  });
  return rankings;
}

//Countries with name issues (2015):
/*
  Bosnia and Herz.
  Domincan Republic
  Czech Republic
  Guinea
  India
  Ivory Coast
  Niger
  Sudan
  Somaliland
  Central African Republic
  Congo
*/
let geoDataGlobal = d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json')
  .then(mapData => {
    let geoData = topojson.feature(mapData, mapData.objects.countries).features;
    // console.log(geoData);
    //console.log(Object.values(objArr[2015]));
    [2015, 2016, 2017, 2018, 2019].forEach(year => {
      for (let key in objArr[year]) {
        if (key !== 'year') {
          let geoResult = geoData.filter(x => key.includes(x.properties.name) === true || x.properties.name.includes(key) === true);
          if (geoResult.length > 0) {
            objArr[year][key]["geoData"] = geoResult[0];
            objArr[year][key]["id"] = geoResult[0].id;
          }      
        }
      };
    })
    let rankings = calculateRankings(objArr);

    const width = 960;
    const height = 700;
    let svg = d3.select('svg');
    svg.attr('height', height)
       .attr('width', width);

    const projection = d3.geoNaturalEarth1()
                         .scale(170)
                         .translate([width / 2, height / 2]);
    const pathGenerator = d3.geoPath().projection(projection);

    svg.append('path')
       .attr('class', 'sphere')
       .attr('d', pathGenerator({type: 'Sphere'}));

    svg.selectAll('path')
       .data(geoData)
       .enter()
       .append('path')
         .attr('class', 'country')
         .attr('d', d => pathGenerator(d))
       .append('title')
         .text(d => {
           let surveyData = Object.values(objArr[2015]).filter(x => x.id === d.id);
           if (surveyData[0]) {
             return `${d.properties.name}\nHappiness Rank: ${surveyData[0].hRank}`;
           }
           else {
             return d.properties.name;
           }
          }
        );

    let scale = d3.scaleLinear()
                  .domain([1, d3.max(Object.values(objArr[2015]), d => d.hRank)])
                  .range(['#0DFE5A', '#C41010']);

    d3.selectAll('.country')
        .transition()
        .duration(750)
        .ease(d3.easeBackIn)
        .attr('fill', d => {
          let surveyData = Object.values(objArr[2015]).filter(x => x.id === d.id);
          return surveyData[0] ? scale(surveyData[0].hRank) : 'grey';
        });


  }).catch((e) => console.log(e));


