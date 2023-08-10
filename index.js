var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var compiler = require("compilex");

var app = express();
app.use(bodyParser());

var option = { stats: true };
compiler.init(option);
app.get("/", function (_req, res) {
res.sendfile(__dirname + "/index.html");
});

    app.post("/compilecode", function (req, res) {
        var code= req.body.code;
        var input=req.body.input; 
        var inputRadio = req.body.inputRadio;
        var language = req.body.language; 
        
        if (language === "c" || language ==="cpp") {
        if (inputRadio === "true") {
        var envData = { OS: "windows", cmd: "g++", options: {timeout: 10000 }  };
        compiler.compileCPPWithInput (envData, code, input, function (data){
        if (data.error) {
        res.send(data.error);
        } else {
            res.send(data.output);
        }   
        });
    }
    else
    {
        var envData = { OS: "windows", cmd: "g++", options: {timeout:10000 } };
        compiler.compileCPP(envData, code, function (data) {
            res.send(data);
            });
        }
    }
    if (language === "py") {
        if (inputRadio === "true") {
        var envData = { OS: "windows" };
        compiler.compilePythonWithInput (envData, code, input, function (data) {
        res.send(data);
        });
        } 
        else {
        var envData = {OS: "windows" };
        compiler.compilePython (envData, code, function (data){
            res.send(data);
        });
        }
    }
    if (language === "java") {
        if (inputRadio === "true") {
            var envData = { OS : "windows"}; 
            compiler.compileJavaWithInput( envData , code , input ,  function(data){
            res.send(data);
        });
        } 
        else {
            var envData = { OS : "windows" };
            compiler.compileJava( envData , code , function(data){
                res.send(data);
            });
        }
    }
});
app.post('/download', (req, res) => {
    const code = req.body.code;
    const selectedLanguage = req.body.language;

    const fileName = `code.${selectedLanguage}`;
    fs.writeFileSync(fileName, code);

    res.download(fileName, (err) => {
        if (err) {
            console.error(err);
        }
        fs.unlinkSync(fileName);
    });
});
app.get("/fullStat", function (_req, res) { 
    compiler.fullStat (function (data) {
    res.send(data);
    });
});

app.listen(8080);

compiler.flush(function () {
    console.log("All temporary files flushed !");
});