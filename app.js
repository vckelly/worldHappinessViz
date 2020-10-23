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
  const nameVariances = {
    'Congo (Kinshasa)': 'Democratic Republic of the Congo',
    'Congo (Brazzaville)': 'Congo',
    'Somaliland region': 'Somaliland'
  }
  let myObj = new Object();
  let y = await func(filename);
  myObj['year'] = year;
  y.forEach((row) => {
    if (Object.keys(nameVariances).includes(row['country'])) {
      row['country'] = nameVariances[row['country']];
    }
    myObj[row['country']] = row;
  })
  return myObj;
};

function calculateColorScale(objArr, rankings, scale, curYear, curMetric, country) {
  let surveyData = Object.values(objArr[curYear]).filter(x => x.id === country.id);
  return surveyData[0] ? scale(rankings[curYear][curMetric].indexOf(country.id) + 1) : 'grey';
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
  let rankedMetrics = ['hRank', 'econ', 'family', 'health', 'trust', 'freedom', 'generosity'];
  [2015, 2016, 2017, 2018, 2019].forEach((year) => {
    rankings[year] = {};
    let curYear = Object.values(obj[year]);
    curYear.shift();
    rankedMetrics.forEach(metric => {
      let curMetric = [...curYear];
      if (metric === 'hRank') {
        curMetric.sort((a, b) => (parseInt(a[metric]) < parseInt(b[metric]) ? -1 : 1));
      }
      else{
        curMetric.sort((a, b) => (parseFloat(a[metric]) >= parseFloat(b[metric]) ? -1 : 1));
      }
      curMetric = curMetric.map((key) => key['id']);
      rankings[year][metric] = curMetric;
    });
  });
  return rankings;
}

function tooltipText(objArr, rankings, year, country) {
  let surveyData = Object.values(objArr[year]).filter(x => x.id === country.id);
  if (surveyData[0]){
    let rankedMetrics = ['econ', 'family', 'trust', 'health', 'freedom', 'generosity'];
    let length = rankings[year]['econ'].length;
    let t = `${surveyData[0].country}\nHappiness Rank: ${surveyData[0].hRank} of ${length}\n`;
    rankedMetrics.forEach((metric) => {
      curRank = rankings[year][metric].indexOf(country.id) + 1;
      let upperCaseMetric = metric.charAt(0).toUpperCase() + metric.slice(1);
      t += `${upperCaseMetric} Rank: ${curRank} of ${length}\n`;
    });
    return t.trim();
  }
  else { return country.properties.name }
}

const metricExplanations = {
  'hRank': 'Happiness Rank', 
  'econ': 'GDP per Capita', 
  'family': 'The family metric is the national average of the binary responses (0=no, 1=yes)\n\
            to the Gallup World Poll question, \"If you were in trouble, do you have relatives\n\
            or friends you can count on to help you whenever you need them, or not?\"', 
  'health': 'The health metric is a time series of healthy life expectancy at birth based on \n\
            data from the World Health Organization.', 
  'trust': 'The trust metric represents perceptions of corruption in government (business corruption\n\
            is also used in lieu of government data) based on the answers to the Gallup World Poll questions\n\
            \"Is corruption widespread throughout the government or not?\" and \"Is corruption widespread throughout\n\
            business or not?\"', 
  'freedom': 'The freedom metric represents freedom to make life choices based on the national average of binary responses\n\
              to the Gallup World Poll question \"Are you satisfied or dissatisfied with your freedom to choose what you do with your life?\"', 
  'generosity': 'The generosity metric is the residual of regressing the national average of Gallup World Poll responses to the \n\
                 question \"Have you donated money to a charity in the past month?\" on GDP per capita.' 
}

const countryNameVariances = {
  'Central African Rep.': 'Central African Republic',
  'Dem. Rep. Congo': 'Democratic Republic of the Congo',
  'Bosnia and Herz.': 'Bosnia and Herzegovina',
  'Czechia': 'Czech Republic',
  'Dominican Rep.': 'Dominican Republic',
  'Côte d\'Ivoire': 'Ivory Coast',
  'United States of America': 'United States',
  'S. Sudan': 'South Sudan',
  'Somaliland region': 'Somaliland',
  'Somaliland Region': 'Somaliland'
};

const colorRanges = {
  'hRank': ['#0DFE5A', '#C41010'],
  'econ': ['#143601','white'],
  'family': ['#431259', 'white'],
  'trust': ['#03045E', 'white'],
  'freedom': ['#fa7921', 'white'],
  'generosity': ['#f15152', 'white'],
  'health': ['#9a031e', 'white']
};

let geoDataGlobal = d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json')
  .then(mapData => {
    let geoData = topojson.feature(mapData, mapData.objects.countries).features;
    geoData.forEach(country => {
      if (Object.keys(countryNameVariances).includes(country.properties.name)) {
        country.properties.name = countryNameVariances[country.properties.name];
      };
      if (country.properties.name === 'Somaliland') { country.id = '1000' };
    });
    [2015, 2016, 2017, 2018, 2019].forEach(year => {
      for (let key in objArr[year]) {
        if (key !== 'year') {
          let geoResult = geoData.filter(x => key === x.properties.name);
          if (geoResult.length > 0) {
            objArr[year][key]['id'] = geoResult[0].id;
          }
        }
      };
    });

    const rankings = calculateRankings(objArr);
    console.log(geoData);
    console.log(objArr, geoData.map(d => [d.properties.name, d.id]), rankings);
    
    const width = 960;
    const height = 700;
    const svg = d3.select('svg');
    svg.attr('height', height)
       .attr('width', width);

    const projection = d3.geoNaturalEarth1()
                         .scale(170)
                         .translate([width / 2, height / 2]);

    const pathGenerator = d3.geoPath().projection(projection);

    const g = svg.append('g');

    g.append('path')
       .attr('class', 'sphere')
       .attr('d', pathGenerator({type: 'Sphere'}));

    svg.call(d3.zoom().on('zoom', () => {
      g.attr('transform', d3.event.transform);
    }));

    let curYear = '2015';
    let curMetric  = 'hRank';
    const getText = document.querySelector('#metricSummary');
    getText.innerHTML = metricExplanations[curMetric];    

    g.selectAll('path')
       .data(geoData.reverse())
       .enter()
       .append('path')
         .attr('class', 'country')
         .attr('d', d => pathGenerator(d))
         .attr('id', d => d.id)
         .attr('name', d => d.properties.name)
       .append('title')
         .text(d => tooltipText(objArr, rankings, curYear, d));       

    let scale = d3.scaleLinear()
                  .domain([1, Object.values(objArr[curYear]).length + 1])
                  .range(colorRanges[curMetric]);

    d3.selectAll('.country')
      .attr('fill', d => calculateColorScale(objArr, rankings, scale, curYear, curMetric, d));

    const getYear = document.querySelector('#years');
    getYear.addEventListener('change', (event) => {
      curYear = event.target.value;
      svg.selectAll('path')
         .select('title')
           .text(d => tooltipText(objArr, rankings, curYear, d));
    
      d3.selectAll('.country')
        .transition()
        .duration(750)
        .ease(d3.easeBackIn)
        .attr('fill', d => calculateColorScale(objArr, rankings, scale, curYear, curMetric, d));
    });

    const getMetric = document.querySelector('#metrics');
    getMetric.addEventListener('change', (event) => {
      curMetric = event.target.value;
      getText.innerHTML = metricExplanations[curMetric];
      scale = d3.scaleLinear()
                .domain([1, Object.values(objArr[curYear]).length + 1])
                .range(colorRanges[curMetric]);

      d3.selectAll('.country')
        .transition()
        .duration(1000)
        .ease(d3.easeCubicInOut)
        .attr('fill', d => calculateColorScale(objArr, rankings, scale, curYear, curMetric, d));
    });
}).catch((e) => console.log(e));

