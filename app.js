import { colorLegend } from '/colorLegend.js';

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
    'Northern Cyprus': 'North Cyprus',
    'North Macedonia': 'Macedonia',
    'Hong Kong S.A.R., China': 'Hong Kong',
    'Somaliland region': 'Somaliland',
    'Somaliland Region': 'Somaliland',
    'Taiwan Province of China': 'Taiwan',
    'Trinidad & Tobago': 'Trinidad and Tobago'
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

function calculateRankings(obj) {
  let rankings = {};
  let rankedMetrics = ['hRank', 'econ', 'family', 'health', 'trust', 'freedom', 'generosity'];
  [2015, 2016, 2017, 2018, 2019].forEach((year) => {
    rankings[year] = {};
    if (obj[year]) {
      let curYear = Object.values(obj[year]);
      curYear.shift();
      rankedMetrics.forEach(metric => {
        let curMetric = [...curYear];
        if (metric !== 'hRank') {
          curMetric.sort((a, b) => (parseFloat(a[metric]) > parseFloat(b[metric]) ? -1 : 1));
        }
          curMetric.forEach((country) => {if (!country['id']) {console.log("COUNTRY", country)}});
          curMetric = curMetric.map((key) => key['id']);
          rankings[year][metric] = curMetric;
      });
    };
  });
  return rankings;
}

function tooltipText(objArr, rankings, year, country) {
  let surveyData = Object.values(objArr[year]).filter(x => x.id === country.id);
  if (surveyData[0]){
    let rankedMetrics = ['econ', 'family', 'trust', 'health', 'freedom', 'generosity'];
    let length = rankings[year]['econ'].length;
    let countryHTML = '<h3>' + surveyData[0].country + '</h3>';
    let t = countryHTML + `\nHappiness Rank: ${surveyData[0].hRank} / ${length}\n\n`;
    rankedMetrics.forEach((metric) => {
      let curRank = rankings[year][metric].indexOf(country.id) + 1;
      let upperCaseMetric = metric.charAt(0).toUpperCase() + metric.slice(1);
      t += `${upperCaseMetric} Rank: ${curRank} / ${length}\n\n`;
    });
    return t.trim();
  }
  else { return '<h3>' + country.properties.name + '</h3>'}
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
  'Palestine': 'Palestinian Territories',
  'Trinidad & Tobago': 'Trinidad and Tobago',
  'Taiwan Province of China': 'Taiwan',
  'eSwatini': 'Swaziland',
  'Somaliland Region': 'Somaliland',
  'N. Cyprus': 'North Cyprus'
};

const metricExplanations = {
  'hRank': 'The <b>Happiness Rank</b> represents an average of indviduals own assessments\n\
            of their subjective well-being, as indicated by their survey responses in the Gallup World Poll.', 
  'econ': 'The <b>Economic metric</b> represents the GDP (per capita)  of each country', 
  'family': 'The <b>Family metric</b> is the national average of the binary responses (0=no, 1=yes)\n\
            to the Gallup World Poll question, \"If you were in trouble, do you have relatives\n\
            or friends you can count on to help you whenever you need them, or not?\"', 
  'health': 'The <b>Health metric</b> is a time series of healthy life expectancy at birth based on \n\
            data from the World Health Organization', 
  'trust': 'The <b>Trust metric</b> represents perceptions of corruption in government (business corruption\n\
            is also used in lieu of government data) based on the answers to the Gallup World Poll questions\n\
            \"Is corruption widespread throughout the government or not?\" and \"Is corruption widespread throughout\n\
            business or not?\"', 
  'freedom': 'The <b>Freedom metric</b> represents freedom to make life choices based on the national average of binary responses\n\
              to the Gallup World Poll question \"Are you satisfied or dissatisfied with your freedom to choose what you do with your life?\"', 
  'generosity': 'The <b>Generosity metric</b> is the residual of regressing the national average of Gallup World Poll responses to the \n\
                 question \"Have you donated money to a charity in the past month?\" on GDP per capita' 
}


function tooltipSizing(tooltip, event, curTextLen, height, width, browser) {
  if (browser === 'Chrome') {
    if (curTextLen < 40){
      tooltip.style('height', '20px')

      if (window.screen.width < 450) 
      {
        tooltip.style('top', parseInt((event.offsetY)-(height*1.6)) + 'px')
              .style('left', parseInt((event.offsetX)-(width*.13)) + 'px')
      }
      else if (window.screen.width < 768) 
      {
        tooltip.style('top', parseInt((event.offsetY)-(height*1.45)) + 'px')
              .style('left', parseInt((event.offsetX)-(width*.15)) + 'px')
      }
      else if (window.screen.width < 1024)
      {
        tooltip.style('top', parseInt((event.offsetY)-(height*1.4)) + 'px')
              .style('left', parseInt((event.offsetX)-(width*.2)) + 'px')
      }
      else {
        tooltip.style('top', parseInt((event.offsetY)-(height*1.45)) + 'px')
              .style('left', parseInt((event.offsetX)-(width*.19)) + 'px');
      }
    }
    else {
      if (window.screen.width < 450) 
      {
        tooltip.style('top', parseInt((event.offsetY)-(height*1.6)) + 'px')
              .style('left', parseInt((event.offsetX)-(width*.13)) + 'px')
      }
      else if (window.screen.width < 768) 
      {
        tooltip.style('top', parseInt((event.offsetY)-(height*1.45)) + 'px')
              .style('left', parseInt((event.offsetX)-(width*.15)) + 'px')
      }
      else if (window.screen.width < 1024)
      {
        tooltip.style('top', parseInt((event.offsetY)-(height*1.45)) + 'px')
              .style('left', parseInt((event.offsetX)-(width*.2)) + 'px')
      }
      else {
        tooltip.style('top', parseInt((event.offsetY)-(height*1.45)) + 'px')
              .style('left', parseInt((event.offsetX)-(width*.19)) + 'px');

      }
    }
  }
  else {
    if (curTextLen < 40){
      tooltip.style('height', '20px')

      if (window.screen.width < 450) 
      {
        tooltip.style('top', parseInt((event.clientY)-(height*1.3)) + 'px')
              .style('left', parseInt((event.clientX)-(width*.13)) + 'px')
      }
      else if (window.screen.width < 768) 
      {
        tooltip.style('top', parseInt((event.clientY)-(height*1.3)) + 'px')
              .style('left', parseInt((event.clientX)-(width*.1)) + 'px')
      }
      else if (window.screen.width < 1024)
      {
        tooltip.style('top', parseInt((event.clientY)-(height*1.4)) + 'px')
              .style('left', parseInt((event.clientX)-(width*.2)) + 'px')
      }
      else {
        tooltip.style('top', parseInt((event.clientY)-(height*1.2)) + 'px')
              .style('left', parseInt((event.clientX)-(width*.19)) + 'px');
      }
    }
    else {
      if (window.screen.width < 450) 
      {
        tooltip.style('top', parseInt((event.clientY)-(height*3)) + 'px')
              .style('left', parseInt((event.clientX)-(width*.25)) + 'px')
      }
      else if (window.screen.width < 768) 
      {
        tooltip.style('top', parseInt((event.clientY)-(height*1.4)) + 'px')
              .style('left', parseInt((event.clientX)-(width*.2)) + 'px');
      }
      else if (window.screen.width < 1024)
      {
        tooltip.style('top', parseInt((event.clientY)-(height*1.7)) + 'px')
              .style('left', parseInt((event.clientX)-(width*.25)) + 'px');
      }
      else {
        tooltip.style('top', parseInt((event.clientY)-(height*1.3)) + 'px')
              .style('left', parseInt((event.clientX)-(width*.25)) + 'px');

      }
    }
  }
}

function calculateColorScale(objArr, rankings, scale, curYear, curMetric, country) {
  let surveyData = Object.values(objArr[curYear]).filter(x => x.id === country.id);
  return surveyData[0] ? scale(rankings[curYear][curMetric].indexOf(country.id) + 1) : 'grey';
};

function calculateColorLegendValues(lengthOfYear, numDivisions) {
  let res = [0];
  let interval = lengthOfYear / numDivisions;
  for (let i = 1; i < 8; i++) {
    res.push(Math.floor(i * interval));
  }
  return res;
};

function calculateColorLegendColors(scale, colorLegendValues) {
  return colorLegendValues.map(val => scale(val))
};

const colorRanges = {
  'hRank': ['#0DFE5A', 'white', '#C41010'],
  'econ': ['#143601', 'white', '#eca400'],
  'family': ['#431259', 'white', '#dc2f02'],
  'trust': ['#03045E', 'white', '#2d6a4f'],
  'freedom': ['#fa7921', 'white', '#0c4767'],
  'generosity': ['#f15152', 'white', '#1e555c'],
  'health': ['#9a031e', 'white', '#560bad']
};

function makeResponsive(svg) {
  const container = d3.select(svg.node().parentNode),
      width = parseInt(svg.style('width'), 10),
      height = parseInt(svg.style('height'), 10),
      aspect = width / height;
 
  svg.attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMinYMid')
      .call(resize);

  d3.select(window).on(
      'resize.' + container.attr('id'), 
      resize
  );

  function resize() {
    const w = parseInt(container.style('width'));
    svg.attr('width', w);
    svg.attr('height', Math.round(w / aspect));
  }
}

let y2015 = convertToObject(parse2015, "/data/2015.csv", 2015)
let y2016 = convertToObject(parse2016, "/data/2016.csv", 2016)
let y2017 = convertToObject(parse2017, "/data/2017.csv", 2017)
let y2018 = convertToObject(parse2018, "/data/2018.csv", 2018)
let y2019 = convertToObject(parse2019, "/data/2019.csv", 2019)
let objArr = {}

Promise.all([y2015, y2016, y2017, y2018, y2019]).then(values => {
  values.forEach((v) => objArr[v.year] = v );

  let geoDataGlobal = d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json')
  .then(mapData => {
    let geoData = topojson.feature(mapData, mapData.objects.countries).features;
    geoData.forEach(country => {
      if (Object.keys(countryNameVariances).includes(country.properties.name)) {
        country.properties.name = countryNameVariances[country.properties.name];
      };
      if (country.properties.name === 'Somaliland') { country.id = '1000' };
      if (country.properties.name === 'Kosovo') { country.id = '999' };
      if (country.properties.name === 'North Cyprus') { country.id = '998' };
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
    
    const width = 940;
    const height = 640;
    const svg = d3.select('#svg-content');
    svg.attr('height', height)
       .attr('width', width)
       .call(makeResponsive);

    
    let curYear = 2015;
    let curMetric  = 'hRank';
    const getText = document.querySelector('#metric-text');
    getText.innerHTML = metricExplanations[curMetric];    

    const projection = d3.geoNaturalEarth1()
                         .scale(130)
                         .translate([width / 2, height / 2]);

    const pathGenerator = d3.geoPath().projection(projection);

    const g = svg.append('g');

    const colorLegendG = svg.append('g')
                            .attr('transform', `translate(40,410)`);
    
    let pathSphere = g.append('path')
       .attr('class', 'sphere')
       .attr('d', pathGenerator({type: 'Sphere'}));

    svg.call(d3.zoom()
               .scaleExtent([1, 8])
               .translateExtent([[width*-.25, height*-.25], [width*1.25, height*1.25]])
               .on('zoom', () => {g.attr('transform', d3.event.transform);}));

    let tooltip = d3.select('body').append('div')   
                    .attr('class', 'tooltip')               
                    .style('opacity', 0);
    
    svg.on('click', function() {
      d3.selectAll('.tooltip-rect').style('opacity', 0)
    });

    g.selectAll('path')
      .data(geoData.reverse())
      .enter()
      .append('path')
        .attr('class', 'country')
        .attr('d', d => pathGenerator(d))
        .attr('id', d => d.id)
        .attr('name', d => d.properties.name)

    d3.selectAll('.country')
      .on('mouseover', function (d, i) {  
        let svgHeight = svg.attr('height');
        let svgWidth = svg.attr('width');
        let curText = tooltipText(objArr, rankings, curYear, d);
        tooltip.transition().duration(200).style('opacity', .8);  
        tooltip.html(curText);
        let event = d3.event;

        if (!event.offsetX || !event.offestY) {
          tooltipSizing(tooltip, event, curText.length, svgHeight, svgWidth, 'Firefox')
        }
        else {
          tooltipSizing(tooltip, event, curText.length, svgHeight, svgWidth, 'Chrome')
        }
        
      })
      .on('mouseout', function(d) {
        tooltip.transition()
               .duration(500)
               .style('opacity', 0)    
               .style('height', 'auto')             
      });

    let scale = d3.scaleLinear()
                  .domain([1, Object.values(objArr[curYear]).length / 2, Object.values(objArr[curYear]).length + 1])
                  .range(colorRanges[curMetric]);

    let colorLegendScale = d3.scaleOrdinal();
    let colorLegendVals = calculateColorLegendValues(Object.values(objArr[curYear]).length, 7);
    colorLegendScale
      .domain(['Best', 'Good', 'Better', 'Average', 'Worse', 'Not Good', 'Worst'])
      .range(calculateColorLegendColors(scale, colorLegendVals));

    colorLegendG.call(colorLegend, {
      colorLegendScale,
      circleRadius: 8,
      spacing: 20,
      textOffset: 12,
      backgroundRectWidth: 100
    });

    d3.selectAll('.country')
      .attr('fill', d => calculateColorScale(objArr, rankings, scale, curYear, curMetric, d));
    
    const getYear = document.querySelector('#years');
    getYear.addEventListener('change', (event) => {
      curYear = parseInt(event.target.value);
      colorLegendVals = calculateColorLegendValues(Object.values(objArr[curYear]).length, 7);

      d3.selectAll('.country')
    
      d3.selectAll('.country')
        .transition()
        .duration(850)
        .ease(d3.easeCircleOut)
        .attr('fill', d => calculateColorScale(objArr, rankings, scale, curYear, curMetric, d));
    });

    const getMetric = document.querySelector('#metrics');
    getMetric.addEventListener('change', (event) => {
      curMetric = event.target.value;
      getText.innerHTML = metricExplanations[curMetric];
      scale = d3.scaleLinear()
                .domain([1, Object.values(objArr[curYear]).length / 2, Object.values(objArr[curYear]).length + 1])
                .range(colorRanges[curMetric]);

      colorLegendScale.range(calculateColorLegendColors(scale, colorLegendVals));

      colorLegendG.call(colorLegend, {
        colorLegendScale,
        circleRadius: 8,
        spacing: 20,
        textOffset: 12,
        backgroundRectWidth: 100
      });

      d3.selectAll('.country')
        .transition()
        .duration(850)
        .ease(d3.easeCircleOut)
        .attr('fill', d => calculateColorScale(objArr, rankings, scale, curYear, curMetric, d));
    });
  }).catch((e) => console.log(e))
});
