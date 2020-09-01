function parseYear(filename) {
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
let y2015 = parseYear("2015.csv");
let y2016 = parseYear("2016.csv");
let y2017 = parseYear("2017.csv");
let y2018 = parseYear("2018.csv");
let y2019 = parseYear("2019.csv");
y2015.then((d) => console.log(d));
y2017.then((d) => console.log(d));

// const yearData = d3.dsv(",", "2015.csv", function(d) {
//   return {
//     country: d["Country"],
//     region: d["Region"],
//     hRank: d["Happiness Rank"],
//     hScore: d["Happiness Score"],
//     stdErr: d["Standard Error"],
//     econ: d["Economy (GDP per Capita)"],
//     family: d["Family"],
//     health: d["Health (Life Expectancy)"],
//     freedom: d["Freedom"],
//     trust: d["Trust (Government Corruption)"],
//     generosity: d["Generosity"],
//     dystopia: d["Dystopia Residual"]
//   };
// }).then((data) => {
//   console.log(data);
// });


// const yearData = d3.dsv(",", "2015.csv")
//                    .then(data => {
//                      console.log(d3.csvParse(data))
//                    });
// console.log(yearData);


//console.log(yearData);
//console.log(d3.csvParse(yearData));