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

async function convertToObject(func, filename) {
  let myObj = new Object();
  let y = await func(filename);
  y.forEach((row) => {
    myObj[row["country"]] = row;
  })
  return myObj;
};

// let y2015 = convertToObject(parse2015, "/data/2015.csv")
let y2016 = convertToObject(parse2016, "/data/2016.csv")
let y2017 = convertToObject(parse2017, "/data/2017.csv")
let y2018 = convertToObject(parse2018, "/data/2018.csv")
let y2019 = convertToObject(parse2019, "/data/2019.csv")

// y2015.then((d) => console.log("2015", d));
y2016.then((d) => console.log("2016", d));
y2017.then((d) => console.log("2017", d));
y2018.then((d) => console.log("2018", d));
y2019.then((d) => console.log("2019", d));

let y2015 = d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json')
  // .defer(convertToObject(parse2015, "/data/2015.csv"), function(row) {
  //   return {
  //     country: row.country,
  //     countryCode: row.countryCode
  //   }
  // })
  // .defer(d3.csv, './country_data.csv', function(row) {
  //   return {
  //     country: row.country,
  //     countryCode: row.countryCode,
  //     population: +row.population,
  //     medianAge: +row.medianAge,
  //     fertilityRate: +row.fertilityRate,
  //     populationDensity: +row.population / +row.landArea
  //   }
  // })
  // .await(function(error, mapData, populationData) {
  .then(function(error, mapData) {
    if (error) throw error;

    var geoData = topojson.feature(mapData, mapData.objects.countries).features;

    debugger

    populationData.forEach(row => {
      var countries = geoData.filter(d => d.id === row.countryCode);
      countries.forEach(country => country.properties = row);
    })});