export default async function convertToObject(func, filename, year) {
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