//Module--express
const express = require('express')
const app = express()

//Module--mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ipl-db');
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("connected to db");
});

// bring in models
let MatchModel = require('./models/match');
let DeliveryModel = require('./models/delivery');

// project directory
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, X-Custom-Header, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, XMODIFY");
    next();
 });
// app.use(express.static(__dirname + '/public'));

function findUniqueYears(req, res) {

    //find all the unique years
    let years = new Set();

    let yearsPromise = new Promise(function (resolve, reject) {
        MatchModel.find({}, {
            '_id': 0,
            'season': 1
        }, function (err, docs) {

            if (err) {
                reject(error);
            } else {
                resolve(docs);
            }
        })
    });

    yearsPromise.then((yearsResult) => {
        console.log("yearsResult" + yearsResult);
        yearsResult.forEach(function (arrayItem) {
            // console.log("Years item: " + arrayItem);
            years.add(arrayItem.season);
        });
        console.log("Years length: " + years.size);
        for (let year of years) console.log(year);

        res.send('All years: ' + Array.from(years));
    });
}


function findUniqueTeamsForAYear(req, res, passedYear) {

    MatchModel.aggregate([{
        $match: {
            season: Number(passedYear)
        }
    }, {
        $group: {
            _id: '$winner',
            count: {
                $sum: 1
            }
        }
    }, {
        $sort: {
            _id: 1
        }
    }], function (err, allTeamsThisYear) {
        if (err) {
            console.log("error: " + err);
        } else {
            console.log("\n\nYear: " + passedYear);
            console.log(allTeamsThisYear);
            allTeamsThisYear.forEach(function (element) {
                console.log("" + element._id + " won " + element.count + " matches");
            });

            console.log("allTeamsThisYear: " + allTeamsThisYear);

            //insert teams who did not play during this season & set count to 0

            //array of teams that did play for this season
            teamsThatPlayedThisYear = [];
            for (let item of allTeamsThisYear) {
                teamsThatPlayedThisYear.push(item._id);
            }
            console.log("teamsThatPlayedThisYear: " + teamsThatPlayedThisYear);
            // res.send("All teams, for the year " + passedYear + ": " + teamsThatPlayedThisYear);
            res.send(  teamsThatPlayedThisYear);
        }
    });
}


async function findUniqueBatsmenForAYearAndATeam(req, res, yearParam, teamParam) {
    // find Match Id from year
    console.log("year: " + yearParam);
    console.log("team: " + teamParam);

    let matchIdPromise = new Promise(function (resolve, reject) {
        MatchModel.aggregate([{
                $match: {
                    season: Number(yearParam)
                }
            },
            {
                $group: {
                    _id: {},
                    min: {
                        "$min": "$id"
                    },
                    max: {
                        "$max": "$id"
                    }
                }
            }
        ], function (err, minAndMaxMatchIDThisYear) {
            if (err) {
                console.log("error: " + err);
                reject(error);
            } else {
                resolve(minAndMaxMatchIDThisYear);
            }
        });
    });

    matchIdPromise.then((minAndMaxMatchIDThisYear) => {
        console.log("minAndMaxMatchIDThisYear: " + minAndMaxMatchIDThisYear);
        console.log(minAndMaxMatchIDThisYear[0].min);
        console.log(minAndMaxMatchIDThisYear[0].max);

        //query the delivery db
        DeliveryModel.aggregate([{
                // match year
                $match: {
                    match_id: {
                        $gte: minAndMaxMatchIDThisYear[0].min,
                        $lte: minAndMaxMatchIDThisYear[0].max
                    },
                    batting_team: teamParam
                }
            },
            // group documents by batting team
            // sum extra runs field for each batting team
            {
                $group: {
                    _id: null,
                    uniqueBatsmen: {
                        $addToSet: "$batsman"
                    },
                    uniqueMatchIds: {
                        $addToSet: "$match_id"
                    }

                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ], function (err, result) {
            console.log(JSON.stringify(result));
            res.send("The batsmen who played for "+teamParam+" in "+yearParam+" : "+result[0].uniqueBatsmen);
            // res.send(result);
        });

    });

}

function findBatsmanStats(req, res, yearParam, teamParam, playerParam){

    console.log("year: " + yearParam);
    console.log("team: " + teamParam);
    console.log("player: " + playerParam);

    let matchIdPromise = new Promise(function (resolve, reject) {
        MatchModel.aggregate([{
                $match: {
                    season: Number(yearParam)
                }
            },
            {
                $group: {
                    _id: {},
                    min: {
                        "$min": "$id"
                    },
                    max: {
                        "$max": "$id"
                    }
                }
            }
        ], function (err, minAndMaxMatchIDThisYear) {
            if (err) {
                console.log("error: " + err);
                reject(error);
            } else {
                resolve(minAndMaxMatchIDThisYear);
            }
        });
    });


    matchIdPromise.then((minAndMaxMatchIDThisYear) => {
        console.log("minAndMaxMatchIDThisYear: " + minAndMaxMatchIDThisYear);
        console.log(minAndMaxMatchIDThisYear[0].min);
        console.log(minAndMaxMatchIDThisYear[0].max);

        //query the delivery db
        DeliveryModel.aggregate([{
                // match year
                $match: {
                    match_id: {
                        $gte: minAndMaxMatchIDThisYear[0].min,
                        $lte: minAndMaxMatchIDThisYear[0].max
                    },
                    batting_team: teamParam, 
                    batsman: playerParam
                }
            },
            // group documents by batting team
            // sum extra runs field for each batting team
            {
                $group: {
                    _id: null,
                    totalBallsFaced: {
                        $sum: 1
                    },
                    totalBatsmanRuns: {
                        $sum: "$batsman_runs"
                    }

                }
            }
        ], function (err, result) {
            //console.log(JSON.stringify(result));
            //res.send(result);
            res.send(playerParam+" who played for "+teamParam+" made "+result[0].totalBatsmanRuns+" runs"+" in "+yearParam);
            // res.send(result);
        });

    });


}

// home route
app.get("/", (req, res) => {
    console.log("home dir!");
    let yearsPromise = new Promise(function (resolve, reject) {
        MatchModel.find({}, {}, function (err, docs) {

            if (err) {
                reject(error);
            } else {
                resolve(docs);
            }
        })
    });

    yearsPromise.then((docs) => {
        console.log(docs);
        res.send('Home');

    });

});

// Get all years
app.get("/years", (req, res) => {

    findUniqueYears(req, res)

});
// Get all year/teams
app.get("/:year/teams", (req, res) => {

    findUniqueTeamsForAYear(req, res, req.params.year)

});
// Get all year/team/players
app.get("/:year/:team/players", (req, res) => {

    findUniqueBatsmenForAYearAndATeam(req, res, req.params.year, req.params.team)
});


// Get specific year
app.get("/:year", (req, res) => {
    res.send('specific year: ' + req.params.year);
});
// Get specific year/team
app.get("/:year/:team", (req, res) => {
    res.send('specific year: ' + req.params.year + ', specific team: ' + req.params.team);
});
// Get specific year/team/player
app.get("/:year/:team/:player", (req, res) => {
    console.log("year/team/player dir!");

    findBatsmanStats(req, res, req.params.year, req.params.team, req.params.player)

});

app.listen(3000, () => console.log('listening on port 3000!'));