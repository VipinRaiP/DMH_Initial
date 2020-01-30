/* Main file */

const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const jsonGroupBy = require("json-groupby");

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

//app.use(express.static("public"));
/*
app.get("/", function(req, res) {
  res.render("home");
});


app.get("/alcoholAllDist", function(req, res) {
  //res.sendFile(__dirname+"/public/index.html");
  res.render("barchartAllDistricts", {
    title: "Total Alcohol Cases",
    data: "getAlcoholDataAllDist",
    parameter: "AlcoholCases",
    threshold: 5000,
    imgSrc : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRruzSFhkQXWevwdH3iQljGteX9oCHROhyhmZu0Hb07MCh45OUP&s"
  });
});

app.get("/suicideAllDist", function(req, res) {
    //res.sendFile(__dirname+"/public/index.html");
    res.render("barchartAllDistricts", {
      title: "Total Suicide Cases",
      data: "getSuicideDataAllDist",
      parameter: "SuicideCases",
      threshold: 700,
      imgSrc : "https://www.apa.org/images/2019-07-cover-suicide_tcm7-258230_w1024_n.jpg"
    });
  });

app.post("/perDist",function(req,res){
  console.log("received")  
  console.log(req.body.districtId);
  console.log(req.body.parameter);
  sendParameters = resolveParameter(req.body.districtId,req.body.parameter);
  res.render("scatterPlotPerDist",sendParameters)
})

/* Resolve parameters */
/*
function resolveParameter(districtId,parameter){
  if(parameter=="alcoholCases"){
    return {
      yLabel : "Alcohol Cases",
      data : "getAlcoholDataPerDist",
      threshold : 30,
      columnName : "AlcoholCases",
      districtId: districtId
    }
  }
  if(parameter=="suicideCases"){
    return {
      yLabel : "Suicide Cases",
      data : "getSuicideDataPerDist",
      threshold : 6,
      columnName : "SuicideCases",
      districtId: districtId
    }
  }
}
*/

/* API to query the data from MySQL DB */

/* Connect to the database */

app.get("/", function (req, res, next) {
  res.json({
    message: "Working I am fine"
  });
})


var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password"
});

con.connect(function (err) {
  if (err) console.log(err);
  console.log("connected");
});

sql = "use Clinical_data";
con.query(sql, function (err, res) {
  if (err) console.log(err);
  console.log(res);
});

/*
app.get("/alcoholDataAllDist", function(req, res) {
  sql =
    "select DistrictId,(count(old_alcohal_female)+count(old_alcohal_male)+count(new_alcohal_female)+count(new_alcohal_male)) as AlcoholCases from mytable group by DistrictId;";

  con.query(sql, function(err, response) {
    if (err) console.log(err);
    res.json(response);
  });
});

app.get("/suicideDataAllDist", function(req, res) {
    sql =
    "select DistrictId,(count(old_male_suicidecases)+count(old_female_suicidecases)+count(new_female_suicidecases)+count(new_male_suicidecases)) as SuicideCases from mytable group by DistrictId;"
  
    con.query(sql, function(err, response) {
      if (err) console.log(err);
      res.json(response);
    });
  });
*/

app.post("/getAlcoholDataAllDist", function (req, res) {
  console.log(req.body);
  fromDate = req.body.fromDate;
  toDate = req.body.toDate;
  console.log(fromDate);
  sql = "select m.DistrictId,d.District,(sum(old_alcohal_male)+sum(old_alcohal_female)+sum(new_alcohal_female)+sum(new_alcohal_male)) as AlcoholCases from mytable m,Districts d where m.DistrictId=d.DistrictId and ReportingDate >='" + fromDate + "' and ReportingDate <='" + toDate + "' group by m.DistrictId Order By AlcoholCases"

  console.log(sql)

  con.query(sql, function (err, response) {
    if (err) console.log(err);
    console.log(response);
    res.json(response);
  });
})

app.post("/getSuicideDataAllDist", function (req, res) {
  console.log(req.body);
  fromDate = req.body.fromDate;
  toDate = req.body.toDate;
  console.log("no");
  sql = "select m.DistrictId,d.District,(sum(old_male_suicidecases)+sum(old_female_suicidecases)+sum(new_female_suicidecases)+sum(new_male_suicidecases)) as SuicideCases from mytable m,Districts d where m.DistrictId=d.DistrictId and ReportingDate >='" + fromDate + "' and ReportingDate <='" + toDate + "' group by d.DistrictId Order By SuicideCases"

  console.log(sql)

  con.query(sql, function (err, response) {
    if (err) console.log(err);
    res.json(response);
  });
})

app.post("/getAlcoholDataPerDist", function (req, res) {
  districtId = req.body.districtId;
  console.log(req.body)
  sql = "select ReportingMonthyear,(sum(old_alcohal_male)+sum(old_alcohal_female)+sum(new_alcohal_female)+sum(new_alcohal_male)) as AlcoholCases from mytable where DistrictId=? group by ReportingMonthyear"
  console.log(sql)
  con.query(sql, [districtId], function (err, response) {
    if (err) console.log(err);
    console.log(response);
    res.json(response);
  });
})

app.post("/getSuicideDataPerDist", function (req, res) {
  districtId = req.body.districtId;

  sql = "select ReportingMonthyear,(sum(old_male_suicidecases)+sum(old_female_suicidecases)+sum(new_male_suicidecases)+sum(new_male_suicidecases)) as SuicideCases from mytable where DistrictId=? group by ReportingMonthyear"

  con.query(sql, [districtId], function (err, response) {
    if (err) console.log(err);
    console.log(response);
    res.json(response);
  });
})

/* Server init */
/*
app.listen(3000, function() {
  console.log("server started on port 3000");
});


*/
/* **************************************************************************************************************** 
 *
 * API to query data about all districts (Monthly, Annually, Quarterly)
 *
 * 
 *  
 * ****************************************************************************************************************/

app.post("/getAlcoholDataAllDistMonthly", (req, res) => {
  var year = req.body.year;

  sql = "select Month,DistrictId,\
    (sum(old_alcohal_male)+sum(old_alcohal_female)+sum(new_alcohal_female)+sum(new_alcohal_male)) as AlcoholCases\
    from (SELECT CASE \
    WHEN MONTH(ReportingMonthYear)=1 THEN 1 \
    WHEN MONTH(ReportingMonthYear)=2 THEN 2 \
    WHEN MONTH(ReportingMonthYear)=3  THEN 3 \
    WHEN MONTH(ReportingMonthYear)=4 THEN 4 \
    WHEN MONTH(ReportingMonthYear)=5 THEN 5 \
    WHEN MONTH(ReportingMonthYear)=6  THEN 6 \
    WHEN MONTH(ReportingMonthYear)=7 THEN 7 \
    WHEN MONTH(ReportingMonthYear)=8 THEN 8 \
    WHEN MONTH(ReportingMonthYear)=9  THEN 9 \
    WHEN MONTH(ReportingMonthYear)=10 THEN 10 \
    WHEN MONTH(ReportingMonthYear)=11 THEN 11 \
    WHEN MONTH(ReportingMonthYear)=12  THEN 12 \
    END as Month,DistrictId,new_alcohal_male,old_alcohal_male,new_alcohal_female,old_alcohal_female \
    from mytable \
    where year(ReportingMonthyear)=?) q \
    group by Month,DistrictId \
    order by AlcoholCases";

  con.query(sql, [year], function (err, response) {
    if (err) console.log(err);
    console.log(response);
    if (response != null) {
      var responseGrouped = jsonGroupBy(response, ['Month']);
      res.json(responseGrouped);
    }
    else
      res.json(response);
  });
})

app.post("/getSuicideDataAllDistMonthly", (req, res) => {
  var year = req.body.year;
  console.log(year);
  sql = "select Month,DistrictId,(sum(old_male_suicidecases)+sum(new_male_suicidecases)+sum(old_female_suicidecases)+sum(new_female_suicidecases)) as SuicideCases from (SELECT CASE \
    WHEN MONTH(ReportingMonthYear)=1 THEN 1 \
    WHEN MONTH(ReportingMonthYear)=2 THEN 2 \
    WHEN MONTH(ReportingMonthYear)=3  THEN 3 \
    WHEN MONTH(ReportingMonthYear)=4 THEN 4 \
    WHEN MONTH(ReportingMonthYear)=5 THEN 5 \
    WHEN MONTH(ReportingMonthYear)=6  THEN 6 \
    WHEN MONTH(ReportingMonthYear)=7 THEN 7 \
    WHEN MONTH(ReportingMonthYear)=8 THEN 8 \
    WHEN MONTH(ReportingMonthYear)=9  THEN 9 \
    WHEN MONTH(ReportingMonthYear)=10 THEN 10 \
    WHEN MONTH(ReportingMonthYear)=11 THEN 11 \
    WHEN MONTH(ReportingMonthYear)=12  THEN 12 \
    END as Month,DistrictId,old_male_suicidecases,new_male_suicidecases,old_female_suicidecases,new_female_suicidecases from mytable where year(ReportingMonthyear)=?) q group by Quarter,DistrictId order by SuicideCases";

  con.query(sql, [year], function (err, response) {
    if (err) console.log(err);
    console.log(response);
    var responseGrouped = jsonGroupBy(response, ['Month']);
    res.json(responseGrouped);
  });
})

app.post("/getAlcoholDataAllDistQuart", (req, res) => {
  var year = req.body.year;
  sql = "select Quarter,DistrictId,\
        (sum(old_alcohal_male)+sum(old_alcohal_female)+sum(new_alcohal_female)+sum(new_alcohal_male)) as AlcoholCases \
         from (SELECT CASE \
              WHEN MONTH(ReportingMonthYear)>=1 and MONTH(ReportingMonthYear)<=4 THEN 1 \
              WHEN MONTH(ReportingMonthYear)>=5 and MONTH(ReportingMonthYear)<=8 THEN 2 \
              WHEN MONTH(ReportingMonthYear)>=9 and MONTH(ReportingMonthYear)<=12 THEN 3 \
              END as Quarter,DistrictId,new_alcohal_male,old_alcohal_male,new_alcohal_female,\
              old_alcohal_female \
              from mytable \
              where year(ReportingMonthyear)=?) q \
              group by Quarter,DistrictId\
              order by AlcoholCases";

  con.query(sql, [year], function (err, response) {
    if (err) console.log(err);
    console.log(response);
    var responseGrouped = jsonGroupBy(response, ['Quarter']);
    res.json(responseGrouped);
  });
})

app.post("/getSuicideDataAllDistQuart", (req, res) => {
  var year = req.body.year;
  console.log(year);
  sql = "select Quarter,DistrictId,\
        (sum(old_male_suicidecases)+sum(new_male_suicidecases)+sum(old_female_suicidecases)+sum(new_female_suicidecases)) as SuicideCases\
        from (SELECT CASE \
              WHEN MONTH(ReportingMonthYear)>=1 and MONTH(ReportingMonthYear)<=4 THEN 1 \
              WHEN MONTH(ReportingMonthYear)>=5 and MONTH(ReportingMonthYear)<=8 THEN 2 \
              WHEN MONTH(ReportingMonthYear)>=9 and MONTH(ReportingMonthYear)<=12 THEN 3 \
              END as Quarter,DistrictId,old_male_suicidecases,new_male_suicidecases,old_female_suicidecases,new_female_suicidecases\
              from mytable \
              where year(ReportingMonthyear)=?) q \
              group by Quarter,DistrictId \
              order by SuicideCases";

  con.query(sql, [year], function (err, response) {
    if (err) console.log(err);
    console.log(response);
    var responseGrouped = jsonGroupBy(response, ['Quarter']);
    res.json(responseGrouped);
  });
})

app.post("/getAlcoholDataAllDistAnnually", (req, res) => {
  var year = req.body.year;
  console.log(year)
  sql = "select DistrictId,\
        (sum(old_alcohal_male)+sum(new_alcohal_male)+sum(old_alcohal_female)+sum(new_alcohal_female)) as AlcoholCases\
        from mytable \
        where year(ReportingMonthyear)=? \
        group by DistrictId \
        order by AlcoholCases";

  con.query(sql, [year], function (err, response) {
    console.log(sql)
    if (err) console.log(err);
    console.log(response);
    res.json(response);
  });
})

app.post("/getSuicideDataAllDistAnnually", (req, res) => {
  var year = req.body.year;
  sql = "select DistrictId,\
        (sum(old_male_suicidecases)+sum(old_female_suicidecases)+sum(new_male_suicidecases)+sum(new_male_suicidecases)) as SuicideCases \
        from mytable \
        where year(ReportingMonthyear)=? \
        group by DistrictId order by SuicideCases";
  con.query(sql, [year], function (err, response) {
    if (err) console.log(err);
    console.log(response);
    res.json(response);
  });
})

module.exports = app;
