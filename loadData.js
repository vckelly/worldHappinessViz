
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


function calculateRankings(objArr) {
  console.log(objArr);
  let rankings = {};
  let rankedMetrics = ['hRank', 'econ', 'family', 'health', 'trust', 'freedom', 'generosity'];
  [2015, 2016, 2017, 2018, 2019].forEach((year) => {
    rankings[year] = {};
    let curYear = Object.values(objArr[year]);
    curYear.shift();
    rankedMetrics.forEach(metric => {
      let curMetric = [...curYear];
      console.log(curMetric);
      if (metric === 'hRank') {
        curMetric.sort((a, b) => (parseInt(a[metric]) < parseInt(b[metric]) ? -1 : 1));
      }
      else {
        curMetric.sort((a, b) => (parseFloat(a[metric]) > parseFloat(b[metric]) ? -1 : 1));
      }
      curMetric = curMetric.map((key) => key['id']);
      rankings[year][metric] = curMetric;
    });
  });
  return rankings;
}

// function calculateRankings(obj) {
//   let rankings = {};
//   let rankedMetrics = ['hRank', 'econ', 'family', 'health', 'trust', 'freedom', 'generosity'];
//   [2015, 2016, 2017, 2018, 2019].forEach((year) => {
//     rankings[year] = {};
//     let curYear = Object.values(obj[year]);
//     curYear.shift();
//     rankedMetrics.forEach(metric => {
//       let curMetric = [...curYear];
//       //console.log(curMetric);
//       if (metric === 'hRank') {
//         curMetric.sort((a, b) => (parseInt(a[metric]) < parseInt(b[metric]) ? -1 : 1));
//       }
//       else {
//         curMetric.sort((a, b) => (parseFloat(a[metric]) > parseFloat(b[metric]) ? -1 : 1));
//         // console.log('!!!', curMetric);
//       }
//       console.log('@@@', curMetric);
//       const newMetric = curMetric.map(key =>  [key['id']]);//, key['id'] });
//       //console.log('!!!', curMetric);
//       rankings[year][metric] = newMetric;
//       //console.log(curMetric);
//     });
//   });
//   return rankings;
// };

function objWrapper(geoData) {

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
    'Somaliland Region': 'Somaliland',
    'N. Cyprus': 'North Cyprus'
  };
  
  let y2015 = convertToObject(parse2015, "/data/2015.csv", 2015);
  let y2016 = convertToObject(parse2016, "/data/2016.csv", 2016);
  let y2017 = convertToObject(parse2017, "/data/2017.csv", 2017);
  let y2018 = convertToObject(parse2018, "/data/2018.csv", 2018);
  let y2019 = convertToObject(parse2019, "/data/2019.csv", 2019);

  let objArr = {};
  Promise.all([y2015, y2016, y2017, y2018, y2019]).then(values => {
      objArr[v.year] = v;
  }).catch(e => {
    console.error(e.message);
  });

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
  return objArr;
}




export { objWrapper, calculateRankings };