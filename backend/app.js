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
  password: "root"
});

con.connect(function (err) {
  if (err) console.log(err);
  console.log("connected");
});

sql = "use DMH";
con.query(sql, function (err, res) {
  if (err) console.log(err);
  console.log(res);
});

/*
app.get("/alcoholDataAllDist", function(req, res) {
  sql =
    "select DistrictId,(count(old_alcohal_female)+count(old_alcohal_male)+count(new_alcohal_female)+count(new_alcohal_male)) as AlcoholCases from Clinical_Data group by DistrictId;";

  con.query(sql, function(err, response) {
    if (err) console.log(err);
    res.json(response);
  });
});

app.get("/suicideDataAllDist", function(req, res) {
    sql =
    "select DistrictId,(count(old_male_suicidecases)+count(old_female_suicidecases)+count(new_female_suicidecases)+count(new_male_suicidecases)) as SuicideCases from Clinical_Data group by DistrictId;"
  
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
  sql = "select m.DistrictId,d.District,\
        (sum(old_alcohal_male)+sum(old_alcohal_female)+sum(new_alcohal_female)+sum(new_alcohal_male)) as AlcoholCases\
        from Clinical_Data m,Districts d\
        where m.DistrictId=d.DistrictId and ReportingDate >='" + fromDate + "' and ReportingDate <='" + toDate + "' \
        group by m.DistrictId \
        Order By AlcoholCases"

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
  sql = "select m.DistrictId,d.District,\
        (sum(old_male_suicidecases)+sum(old_female_suicidecases)+sum(new_female_suicidecases)+sum(new_male_suicidecases)) as SuicideCases\
        from Clinical_Data m,Districts d\
        where m.DistrictId=d.DistrictId and ReportingDate >='" + fromDate + "' and ReportingDate <='" + toDate + "' \
        group by d.DistrictId \
        Order By SuicideCases"

  console.log(sql)

  con.query(sql, function (err, response) {
    if (err) console.log(err);
    res.json(response);
  });
})

app.post("/getAlcoholDataPerDist", function (req, res) {
  districtId = req.body.districtId;
  console.log(req.body)
  sql = `select d.District,m.ReportingMonthyear,
        (sum(old_alcohal_male)+sum(old_alcohal_female)+sum(new_alcohal_female)+sum(new_alcohal_male)) as \`Alcohol Cases\`
        from Clinical_Data m,Districts d where m.DistrictId=? and m.DistrictId=d.DistrictId\
        group by ReportingMonthyear`
  console.log(sql)
  con.query(sql, [districtId], function (err, response) {
    if (err) console.log(err);
    console.log(response);
    res.json(response);
  });
})

app.post("/getSuicideDataPerDist", function (req, res) {
  districtId = req.body.districtId;

  sql = `select d.District,m.ReportingMonthyear,
        (sum(old_male_suicidecases)+sum(old_female_suicidecases)+sum(new_male_suicidecases)+sum(new_male_suicidecases)) as \`Suicide Cases\` 
        from Clinical_Data m,Districts d 
        where m.DistrictId=? and m.DistrictId=d.DistrictId 
        group by ReportingMonthyear`

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

  sql = "select m.Month,m.DistrictId, d.District,d.Population,\
    (sum(old_alcohal_male)+sum(old_alcohal_female)+sum(new_alcohal_female)+sum(new_alcohal_male)) as `Alcohol Cases`\
    from (SELECT CASE \
    WHEN MONTH(ReportingMonthyear)=1 THEN 1 \
    WHEN MONTH(ReportingMonthyear)=2 THEN 2 \
    WHEN MONTH(ReportingMonthyear)=3  THEN 3 \
    WHEN MONTH(ReportingMonthyear)=4 THEN 4 \
    WHEN MONTH(ReportingMonthyear)=5 THEN 5 \
    WHEN MONTH(ReportingMonthyear)=6  THEN 6 \
    WHEN MONTH(ReportingMonthyear)=7 THEN 7 \
    WHEN MONTH(ReportingMonthyear)=8 THEN 8 \
    WHEN MONTH(ReportingMonthyear)=9  THEN 9 \
    WHEN MONTH(ReportingMonthyear)=10 THEN 10 \
    WHEN MONTH(ReportingMonthyear)=11 THEN 11 \
    WHEN MONTH(ReportingMonthyear)=12  THEN 12 \
    END as Month,DistrictId,new_alcohal_male,old_alcohal_male,new_alcohal_female,old_alcohal_female \
    from Clinical_Data \
    where year(ReportingMonthyear)=?) m, Districts d \
    where m.DistrictId = d.DistrictId \
    group by m.Month,m.DistrictId,d.Population \
    order by Month,`Alcohol Cases`";

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
  sql = "select m.Month,d.DistrictId,d.District,d.Population,\
        (sum(old_male_suicidecases)+sum(new_male_suicidecases)+sum(old_female_suicidecases)+sum(new_female_suicidecases)) as `Suicide Cases`\
        from (SELECT CASE WHEN MONTH(ReportingMonthyear)=1 THEN 1 \
        WHEN MONTH(ReportingMonthyear)=2 THEN 2 \
        WHEN MONTH(ReportingMonthyear)=3  THEN 3 \
        WHEN MONTH(ReportingMonthyear)=4 THEN 4 \
        WHEN MONTH(ReportingMonthyear)=5 THEN 5 \
        WHEN MONTH(ReportingMonthyear)=6  THEN 6 \
        WHEN MONTH(ReportingMonthyear)=7 THEN 7 \
        WHEN MONTH(ReportingMonthyear)=8 THEN 8 \
        WHEN MONTH(ReportingMonthyear)=9  THEN 9 \
        WHEN MONTH(ReportingMonthyear)=10 THEN 10 \
        WHEN MONTH(ReportingMonthyear)=11 THEN 11 \
        WHEN MONTH(ReportingMonthyear)=12  THEN 12 \
        END as Month,DistrictId,old_male_suicidecases,new_male_suicidecases,old_female_suicidecases,new_female_suicidecases \
        from Clinical_Data \
        where year(ReportingMonthyear)=? ) m, Districts d \
        where m.DistrictId = d.DistrictId \
        group by m.Month,d.DistrictId,d.Population \
        order by m.Month,`Suicide Cases`";


  con.query(sql, [year], function (err, response) {
    if (err) console.log(err);
    console.log(response);
    var responseGrouped = jsonGroupBy(response, ['Month']);
    res.json(responseGrouped);
  });
})

app.post("/getAlcoholDataAllDistQuart", (req, res) => {
  var year = req.body.year;
  sql = "select q.Quarter,q.DistrictId,d.District,d.Population,\
        (sum(old_alcohal_male)+sum(old_alcohal_female)+sum(new_alcohal_female)+sum(new_alcohal_male)) as `Alcohol Cases` \
         from (SELECT CASE \
              WHEN MONTH(ReportingMonthYear)>=1 and MONTH(ReportingMonthYear)<=3 THEN 1 \
              WHEN MONTH(ReportingMonthYear)>=4 and MONTH(ReportingMonthYear)<=6 THEN 2 \
              WHEN MONTH(ReportingMonthYear)>=7 and MONTH(ReportingMonthYear)<=9 THEN 3 \
              WHEN MONTH(ReportingMonthYear)>=10 and MONTH(ReportingMonthYear)<=12 THEN 4 \
              END as Quarter,DistrictId,new_alcohal_male,old_alcohal_male,new_alcohal_female,\
              old_alcohal_female \
              from Clinical_Data \
              where year(ReportingMonthyear)=?) q , Districts d\
              where q.DistrictId = d.DistrictId \
              group by q.Quarter,q.DistrictId,d.Population\
              order by q.Quarter,`Alcohol Cases`";

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
  sql = "select q.Quarter,d.DistrictId,d.District,d.Population,\
        (sum(old_male_suicidecases)+sum(new_male_suicidecases)+sum(old_female_suicidecases)+sum(new_female_suicidecases)) as `Suicide Cases`\
        from (SELECT CASE WHEN MONTH(ReportingMonthYear)>=1 and MONTH(ReportingMonthYear)<=3 THEN 1  \
        WHEN MONTH(ReportingMonthYear)>=4 and MONTH(ReportingMonthYear)<=6 THEN 2 \
        WHEN MONTH(ReportingMonthYear)>=7 and MONTH(ReportingMonthYear)<=9 THEN 3 \
        WHEN MONTH(ReportingMonthYear)>=10 and MONTH(ReportingMonthYear)<=12 THEN 4 \
        END as Quarter,DistrictId,old_male_suicidecases,new_male_suicidecases,old_female_suicidecases,new_female_suicidecases\
        from Clinical_Data where year(ReportingMonthyear)=?) q,Districts d \
        where q.DistrictId = d.DistrictId  \
        group by q.Quarter,d.DistrictId,d.Population \
        order by q.Quarter,`Suicide Cases`";

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
  sql = "select m.DistrictId, d.District,d.Population,\
        (sum(old_alcohal_male)+sum(new_alcohal_male)+sum(old_alcohal_female)+sum(new_alcohal_female)) as `Alcohol Cases` \
        from Clinical_Data m,Districts d\
        where year(ReportingMonthyear)=? and m.DistrictId = d.DistrictId\
        group by m.DistrictId,d.Population \
        order by `Alcohol Cases`  "

  con.query(sql, [year], function (err, response) {
    console.log(sql)
    if (err) console.log(err);
    console.log(response);
    res.json(response);
  });
})

app.post("/getSuicideDataAllDistAnnually", (req, res) => {
  var year = req.body.year;
  sql = "select d.DistrictId,d.District,d.Population,\
        (sum(old_male_suicidecases)+sum(old_female_suicidecases)+sum(new_male_suicidecases)+sum(new_male_suicidecases)) as `Suicide Cases` \
        from Clinical_Data m, Districts d \
        where year(ReportingMonthyear)=? and m.DistrictId=d.DistrictId\
        group by m.DistrictId,d.Population \
        order by `Suicide Cases`";
  con.query(sql, [year], function (err, response) {
    if (err) console.log(err);
    console.log(response);
    res.json(response);
  });
})

/* *****************************************************************************************************************************
 * Entire state data for years, month quarter 
 *
 * ****************************************************************************************************************************/

const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', "Sep", 'Oct', 'Nov', 'Dec'];

app.get("/getStateAlcoholDataMonthly", (req, res) => {

  sql = `select Year,Month, 
          (sum(old_alcohal_male)+sum(new_alcohal_male)+sum(old_alcohal_female)+sum(new_alcohal_female)) as \`Alcohol Cases\` 
          from (SELECT CASE 
          WHEN MONTH(ReportingMonthyear)=1 THEN 1 
          WHEN MONTH(ReportingMonthyear)=2 THEN 2 
          WHEN MONTH(ReportingMonthyear)=3  THEN 3 
          WHEN MONTH(ReportingMonthyear)=4 THEN 4 
          WHEN MONTH(ReportingMonthyear)=5 THEN 5 
          WHEN MONTH(ReportingMonthyear)=6  THEN 6 
          WHEN MONTH(ReportingMonthyear)=7 THEN 7  
          WHEN MONTH(ReportingMonthyear)=8 THEN 8 
          WHEN MONTH(ReportingMonthyear)=9  THEN 9 
          WHEN MONTH(ReportingMonthyear)=10 THEN 10 
          WHEN MONTH(ReportingMonthyear)=11 THEN 11 
          WHEN MONTH(ReportingMonthYear)=12  THEN 12 
          END as Month,year(ReportingMonthyear) as Year,old_alcohal_male,new_alcohal_male,new_alcohal_female,old_alcohal_female 
          from Clinical_Data) m 
          group by Year,Month
          order by Year,Month`

  con.query(sql, function (err, response) {
    if (err) console.log(err);
    console.log(response);
    var responseGrouped = jsonGroupBy(response, ['Year']);
    /* for( d1 in responseGrouped){
       d1.forEach(element => {
         
       });( (d2) =>{
           d2['Month'] = month[d2['month']-1]; 
       })
     }*/
    res.json(responseGrouped);
  });
})

app.get("/getStateAlcoholDataYearly", (req, res) => {

  sql = `select m.Year,
          (sum(old_alcohal_male)+sum(old_alcohal_female)+sum(new_alcohal_female)+sum(new_alcohal_male)) as \`Alcohol Cases\`
          from (SELECT year(ReportingMonthyear) as Year,old_alcohal_male,new_alcohal_male,new_alcohal_female,old_alcohal_female
          from Clinical_Data) m
          group by m.Year
          order by m.Year`

  con.query(sql, function (err, response) {
    if (err) console.log(err);
    console.log(response);
    res.json(response);
  });
})

app.get("/getStateAlcoholDataQuart", (req, res) => {

  sql = `select q.Year,q.Quarter,
        (sum(old_alcohal_male)+sum(old_alcohal_female)+sum(new_alcohal_female)+sum(new_alcohal_male)) as \`Alcohol Cases\`
        from (SELECT CASE 
        WHEN MONTH(ReportingMonthyear)>=1 and MONTH(ReportingMonthyear)<=3 THEN 1 
        WHEN MONTH(ReportingMonthyear)>=4 and MONTH(ReportingMonthyear)<=6 THEN 2 
        WHEN MONTH(ReportingMonthyear)>=7 and MONTH(ReportingMonthyear)<=9 THEN 3 
        WHEN MONTH(ReportingMonthyear)>=10 and MONTH(ReportingMonthyear)<=12 THEN 4 
        END as Quarter,year(ReportingMonthyear) as Year,new_alcohal_male,old_alcohal_male,new_alcohal_female,
        old_alcohal_female 
        from Clinical_Data) q 
        group by q.Year,q.Quarter 
        order by q.Year,q.Quarter`;

  con.query(sql, function (err, response) {
    if (err) console.log(err);
    console.log(response);
    //var responseGrouped = jsonGroupBy(response, ['Quarter']);
    var responseGrouped = jsonGroupBy(response, ['Year']);
    res.json(responseGrouped);
  });
})

app.get("/getStateSuicideDataMonthly", (req, res) => {


  console.log(req.body);
  sql = `select m.Year,m.Month, 
          (sum(old_male_suicidecases)+sum(new_male_suicidecases)+sum(old_female_suicidecases)+sum(new_female_suicidecases)) as \`Suicide Cases\` 
          from (SELECT CASE 
          WHEN MONTH(ReportingMonthyear)=1 THEN 1 
          WHEN MONTH(ReportingMonthyear)=2 THEN 2 
          WHEN MONTH(ReportingMonthyear)=3  THEN 3 
          WHEN MONTH(ReportingMonthyear)=4 THEN 4 
          WHEN MONTH(ReportingMonthyear)=5 THEN 5 
          WHEN MONTH(ReportingMonthyear)=6  THEN 6 
          WHEN MONTH(ReportingMonthyear)=7 THEN 7  
          WHEN MONTH(ReportingMonthyear)=8 THEN 8 
          WHEN MONTH(ReportingMonthyear)=9  THEN 9
          WHEN MONTH(ReportingMonthyear)=10 THEN 10 
          WHEN MONTH(ReportingMonthyear)=11 THEN 11 
          WHEN MONTH(ReportingMonthYear)=12  THEN 12 
          END as Month,year(ReportingMonthyear) as Year,old_male_suicidecases,new_male_suicidecases,new_female_suicidecases,old_female_suicidecases 
          from Clinical_Data) m 
          group by m.Year,m.Month 
          order by m.Year,m.Month`

  con.query(sql, function (err, response) {
    if (err) console.log(err);
    console.log(response);
    var responseGrouped = jsonGroupBy(response, ['Year']);
    res.json(responseGrouped);
  });

})

app.get("/getStateSuicideDataYearly", (req, res) => {

  sql = `select m.Year, 
          (sum(old_male_suicidecases)+sum(old_female_suicidecases)+sum(new_female_suicidecases)+sum(new_male_suicidecases)) as \`SuicideCases\` 
          from (SELECT year(ReportingMonthyear) as Year,old_male_suicidecases,new_male_suicidecases,new_female_suicidecases,old_female_suicidecases 
          from Clinical_Data) m  
          group by m.Year 
          order by m.Year`

  con.query(sql, function (err, response) {
    if (err) console.log(err);
    console.log(response);
    res.json(response);
  });
})

app.get("/getStateSuicideDataQuart", (req, res) => {
  var year = req.body.year;
  sql = `select q.Year,q.Quarter,
        (sum(old_male_suicidecases)+sum(old_female_suicidecases)+sum(new_female_suicidecases)+sum(new_male_suicidecases)) as \`Suicide Cases\` 
        from (SELECT CASE 
        WHEN MONTH(ReportingMonthyear)>=1 and MONTH(ReportingMonthyear)<=3 THEN 1 
        WHEN MONTH(ReportingMonthyear)>=4 and MONTH(ReportingMonthyear)<=6 THEN 2 
        WHEN MONTH(ReportingMonthyear)>=7 and MONTH(ReportingMonthyear)<=9 THEN 3 
        WHEN MONTH(ReportingMonthyear)>=10 and MONTH(ReportingMonthyear)<=12 THEN 4 
        END as Quarter,year(ReportingMonthyear) as Year,new_male_suicidecases,old_male_suicidecases,new_female_suicidecases,old_female_suicidecases 
        from Clinical_Data) q 
        group by q.Year,q.Quarter 
        order by q.Year,q.Quarter`;

  con.query(sql, function (err, response) {
    if (err) console.log(err);
    console.log(response);
    //var responseGrouped = jsonGroupBy(response, ['Quarter']);
    var responseGrouped = jsonGroupBy(response, ['Year']);
    res.json(responseGrouped);
  });
})

/* ********************************************************************************************************************************
 *  
 *  Per District data Monthly Quarterly  and Year Wise
 * 
 * *******************************************************************************************************************************/

app.post("/getPerDistAlcoholDataMonthly", (req, res) => {
  districtId = req.body.districtId;
  sql = "select Year,Month, \
          (sum(old_alcohal_male)+sum(new_alcohal_male)+sum(old_alcohal_female)+sum(new_alcohal_female)) as `Alcohol Cases`\
          from (SELECT CASE \
          WHEN MONTH(ReportingMonthyear)=1 THEN 1 \
          WHEN MONTH(ReportingMonthyear)=2 THEN 2 \
          WHEN MONTH(ReportingMonthyear)=3  THEN 3 \
          WHEN MONTH(ReportingMonthyear)=4 THEN 4 \
          WHEN MONTH(ReportingMonthyear)=5 THEN 5 \
          WHEN MONTH(ReportingMonthyear)=6  THEN 6 \
          WHEN MONTH(ReportingMonthyear)=7 THEN 7  \
          WHEN MONTH(ReportingMonthyear)=8 THEN 8 \
          WHEN MONTH(ReportingMonthyear)=9  THEN 9 \
          WHEN MONTH(ReportingMonthyear)=10 THEN 10 \
          WHEN MONTH(ReportingMonthyear)=11 THEN 11 \
          WHEN MONTH(ReportingMonthYear)=12  THEN 12 \
          END as Month,year(ReportingMonthyear) as Year,old_alcohal_male,new_alcohal_male,new_alcohal_female,old_alcohal_female \
          from Clinical_Data \
          where districtId=?) m \
          group by Year,Month \
          order by Year,Month"

  con.query(sql, [districtId], function (err, response) {
    if (err) console.log(err);
    console.log(response);
    var responseGrouped = jsonGroupBy(response, ['Year']);
    /* for( d1 in responseGrouped){
       d1.forEach(element => {
         
       });( (d2) =>{
           d2['Month'] = month[d2['month']-1]; 
       })
     }*/
    res.json(responseGrouped);
  });

})

app.post("/getPerDistAlcoholDataYearly", (req, res) => {
  districtId = req.body.districtId;
  sql = "select m.Year, \
          (sum(old_alcohal_male)+sum(old_alcohal_female)+sum(new_alcohal_female)+sum(new_alcohal_male)) as AlcoholCases \
          from (SELECT year(ReportingMonthyear) as Year,old_alcohal_male,new_alcohal_male,new_alcohal_female,old_alcohal_female \
          from Clinical_Data \
          where districtId = ?) m  \
          group by m.Year \
          order by m.Year"

  con.query(sql, [districtId], function (err, response) {
    if (err) console.log(err);
    console.log(response);
    res.json(response);
  });
})

app.post("/getPerDistAlcoholDataQuart", (req, res) => {
  districtId = req.body.districtId;
  sql = "select q.Year,q.Quarter,\
        (sum(old_alcohal_male)+sum(old_alcohal_female)+sum(new_alcohal_female)+sum(new_alcohal_male)) as AlcoholCases \
        from (SELECT CASE \
        WHEN MONTH(ReportingMonthyear)>=1 and MONTH(ReportingMonthyear)<=4 THEN 1 \
        WHEN MONTH(ReportingMonthyear)>=5 and MONTH(ReportingMonthyear)<=8 THEN 2 \
        WHEN MONTH(ReportingMonthyear)>=9 and MONTH(ReportingMonthyear)<=12 THEN 3 \
        END as Quarter,year(ReportingMonthyear) as Year,new_alcohal_male,old_alcohal_male,new_alcohal_female,\
        old_alcohal_female \
        from Clinical_Data \
        where districtId = ?) q \
        group by q.Year,q.Quarter \
        order by q.Year,q.Quarter";

  con.query(sql, [districtId], function (err, response) {
    if (err) console.log(err);
    console.log(response);
    //var responseGrouped = jsonGroupBy(response, ['Quarter']);
    var responseGrouped = jsonGroupBy(response, ['Year']);
    res.json(responseGrouped);
  });
})

app.post("/getPerDistSuicideDataMonthly", (req, res) => {

  districtId = req.body.districtId;
  console.log(req.body);
  sql = "select m.Year,m.Month, \
          (sum(old_male_suicidecases)+sum(new_male_suicidecases)+sum(old_female_suicidecases)+sum(new_female_suicidecases)) as SuicideCases \
          from (SELECT CASE \
          WHEN MONTH(ReportingMonthyear)=1 THEN 1 \
          WHEN MONTH(ReportingMonthyear)=2 THEN 2 \
          WHEN MONTH(ReportingMonthyear)=3  THEN 3 \
          WHEN MONTH(ReportingMonthyear)=4 THEN 4 \
          WHEN MONTH(ReportingMonthyear)=5 THEN 5 \
          WHEN MONTH(ReportingMonthyear)=6  THEN 6 \
          WHEN MONTH(ReportingMonthyear)=7 THEN 7  \
          WHEN MONTH(ReportingMonthyear)=8 THEN 8 \
          WHEN MONTH(ReportingMonthyear)=9  THEN 9 \
          WHEN MONTH(ReportingMonthyear)=10 THEN 10 \
          WHEN MONTH(ReportingMonthyear)=11 THEN 11 \
          WHEN MONTH(ReportingMonthYear)=12  THEN 12 \
          END as Month,year(ReportingMonthyear) as Year,old_male_suicidecases,new_male_suicidecases,new_female_suicidecases,old_female_suicidecases \
          from Clinical_Data \
          where districtId = ?) m \
          group by m.Year,m.Month \
          order by m.Year,m.Month"

  con.query(sql, [districtId], function (err, response) {
    if (err) console.log(err);
    console.log(response);
    var responseGrouped = jsonGroupBy(response, ['Year']);
    res.json(responseGrouped);
  });

})

app.post("/getPerDistSuicideDataYearly", (req, res) => {
  districtId = req.body.districtId;
  sql = "select m.Year, \
          (sum(old_male_suicidecases)+sum(old_female_suicidecases)+sum(new_female_suicidecases)+sum(new_male_suicidecases)) as SuicideCases \
          from (SELECT year(ReportingMonthyear) as Year,old_male_suicidecases,new_male_suicidecases,new_female_suicidecases,old_female_suicidecases \
          from Clinical_Data \
          where districtId = ?) m  \
          group by m.Year \
          order by m.Year"

  con.query(sql, [districtId], function (err, response) {
    if (err) console.log(err);
    console.log(response);
    res.json(response);
  });
})

app.post("/getPerDistSuicideDataQuart", (req, res) => {
  districtId = req.body.districtId;
  sql = "select q.Year,q.Quarter,\
        (sum(old_male_suicidecases)+sum(old_female_suicidecases)+sum(new_female_suicidecases)+sum(new_male_suicidecases)) as SuicideCases \
        from (SELECT CASE \
        WHEN MONTH(ReportingMonthyear)>=1 and MONTH(ReportingMonthyear)<=4 THEN 1 \
        WHEN MONTH(ReportingMonthyear)>=5 and MONTH(ReportingMonthyear)<=8 THEN 2 \
        WHEN MONTH(ReportingMonthyear)>=9 and MONTH(ReportingMonthyear)<=12 THEN 3 \
        END as Quarter,year(ReportingMonthyear) as Year,new_male_suicidecases,old_male_suicidecases,new_female_suicidecases,old_female_suicidecases \
        from Clinical_Data \
        where districtId = ?) q \
        group by q.Year,q.Quarter \
        order by q.Year,q.Quarter";

  con.query(sql, [districtId], function (err, response) {
    if (err) console.log(err);
    console.log(response);
    //var responseGrouped = jsonGroupBy(response, ['Quarter']);
    var responseGrouped = jsonGroupBy(response, ['Year']);
    res.json(responseGrouped);
  });
})

/* ********************************************************************************************************************************
 *  
 *  Get Normalised data
 * 
 * *******************************************************************************************************************************/

app.post("/getNormalisedData", (req, res) => {
  data = req.body.data;
  targetColumn = req.body.targetColumn;
  wrtColumn = req.body.wrtColumn; // with respect to  eg : Population etc...
  console.log(targetColumn);
  console.log(wrtColumn);
  data.forEach((d) => {
    console.log((d[targetColumn] / d[wrtColumn]) * 100);
    d[targetColumn] = d[targetColumn] / d[wrtColumn] * 100;
  })
  console.log("Data normalised ");
  console.log(data);
  res.json(data);
});

/*********************************************************************************************************************************
 *  Map APIs
 * 
 *********************************************************************************************************************************/

app.post("/getAlcoholMonthlyperDistrictforMap", (req, res) => {
  var year = req.body.year;
  var district = req.body.district;
  sql = "select d.District as Districtid ,\
  MONTH(c.ReportingMonthyear) as month ,\
  sum(c.new_alcohal_male)+sum(c.new_alcohal_female)+sum(c.old_alcohal_male)+sum(c.old_alcohal_female) as total_alcohol_cases \
  from Clinical_Data c , Districts d  \
  where d.DistrictId = c.Districtid and d.District=? and YEAR(c.ReportingMonthyear)=?\
  group by c.ReportingMonthyear";
  con.query(sql, [district, year], function (err, response) {
    if (err) console.log(err);
    console.log(response);
    res.json(response);
  });
})

app.post("/getAlcoholQuarterlyperDistrictforMap", (req, res) => {
  var year = req.body.year;
  var district = req.body.district;
  sql = "select Quarter,District,\
  (sum(old_alcohal_male)+sum(old_alcohal_female)+sum(new_alcohal_female)+sum(new_alcohal_male)) as AlcoholCases \
   from (SELECT CASE \
        WHEN MONTH(ReportingMonthYear)>=1 and MONTH(ReportingMonthYear)<=4 THEN 1 \
        WHEN MONTH(ReportingMonthYear)>=5 and MONTH(ReportingMonthYear)<=8 THEN 2 \
        WHEN MONTH(ReportingMonthYear)>=9 and MONTH(ReportingMonthYear)<=12 THEN 3 \
        END as Quarter,c.DistrictId,c.new_alcohal_male,c.old_alcohal_male,c.new_alcohal_female,\
        c.old_alcohal_female , d.District \
        from Clinical_Data c , Districts d \
  where d.DistrictId = c.Districtid and d.District=? and year(c.ReportingMonthyear)=? ) q \
        group by Quarter";
  con.query(sql, [district, year], function (err, response) {
    if (err) console.log(err);
    console.log(response);
    res.json(response);
  });
})

app.post("/getAlcoholYearlyperDistrictforMap", (req, res) => {
  var year = req.body.year;
  var district = req.body.district;
  sql = "select d.District as Districtid ,YEAR(c.ReportingMonthyear) ,sum(c.new_alcohal_male)+sum(c.new_alcohal_female)+sum(c.old_alcohal_male)+sum(c.old_alcohal_female) as total_alcohol_cases \
  from Clinical_Data c , Districts d  where d.DistrictId = c.Districtid and d.District=? and YEAR(c.ReportingMonthyear)=? \
  group by YEAR(c.ReportingMonthyear)";
  con.query(sql, [district, year], function (err, response) {
    if (err) console.log(err);
    console.log(response);
    res.json(response);
  });
})

app.post("/getAlcoholYearlyDistrictforMap", (req, res) => {
  var year = req.body.year;
  sql = "select d.District as Districtid ,year(c.ReportingMonthyear) ,sum(c.new_alcohal_male)+sum(c.new_alcohal_female)+sum(c.old_alcohal_male)+sum(c.old_alcohal_female) \
  as total_alcohol_cases\
  from Clinical_Data c , Districts d  where d.DistrictId = c.Districtid and year(c.ReportingMonthyear)=?\
  group by year(c.ReportingMonthyear) ,d.District order by total_alcohol_cases";
  con.query(sql, [year], function (err, response) {
    if (err) console.log(err);
    console.log(response);
    res.json(response);
  });
})

/*********************************************************************************************************************************
 *  Get Districts and Id
 * 
 *********************************************************************************************************************************/

app.get("/getDistrictData", (req, res) => {
  sql = `select d.DistrictId,d.District 
        from Districts d where  DistrictId != 46`;
  con.query(sql, function (err, response) {
    if (err) console.log(err);
    console.log(response);
    res.json(response);
  })
});

module.exports = app;
