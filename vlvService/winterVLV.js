var http = require("http");

exports.getCourses = function(callback){
  var url="http://www.tu-ilmenau.de/vlv/index.php?id=330"
  
  http.get(url, response).on('error', function(e) {
      console.log("getCourses Error: " + e.message);
  });
  
  function response(res){
    var string="";
    
    parseCourses = function(){
      var courses=[];
        
        //Split up Page in Parts, 1 Course per Part
        var arr=string.split(/<tr valign=top>/).filter(function(el){
          return (el.slice(5,16)=='width="40%"')
        });
        
        //Regex the Parts
        for(var i=0;i<arr.length;i++){
          var part=arr[i];
          var name=part.match(/studiengang=(.*?)">/)[1].replace(/\+/g," ");
          var short=part.match(/sgkurz=(.*?)&amp;/)[1].replace(/\_/," ");
          var type=short.slice(-2)=="MA"?"master":"bachelor";
          var semesters=part.match(/fs=.*?</g);
          for(var j=0; j<semesters.length; j++){
            var semester=semesters[j].split(">")[1]
            semesters[j]=semester.slice(0,-1);
          }
          
          //Build Course Object
          var course={
            name:name,
            short:short,
            semesters:semesters,
            type:type,
            //lastUpdated:""
          }
          courses.push(course);
        }
        callback(courses);
    }
    
    //Build page from chunked responses
    res.on("data", function(chunk){
      string+= chunk;
    });
    
    //Parse page string
    res.on("end", parseCourses);
  }
}

exports.getEvents = function(shortName, semester, callback){
  
  //build url with get parameters
  var url="http://www.tu-ilmenau.de/vlv/index.php?id=330&funccall=1&vers=text"
  url+="&sgkurz="+shortName.replace(" ","_");
  url+="&fs="+semester;
  
  http.get(url, response).on('error', function(e) {
      console.log("getEvents Error: " + e.message);
  });
  
  function response(res){
    var string="";
    
    parseEvents = function(){
      var events=[]
      
      //split into lectures
      var arr=string.split(/<table border=1 width="100%" cellspacing=0>/);
      for(var i=1; i<arr.length; i++){
        
        var part=arr[i];
        var name=part.match(/<b>(.*?)<\/b>/)[1];
        var lecturer=part.match(/<td colspan=6>(.*?)<\/td>/)[1];
        console.log("-----", name, lecturer)
        console.log(arr[i]);
        
        //split into single events
        var eventArray=arr[i].split(/<tr valign=top>/);
        for(var x=1; x<eventArray.length; x++){
          var eventString=eventArray[x];
          console.log(eventString);
          
          var type=eventArray[x].match(/"10%">(.*?):/)[1];
          console.log(type);
          
  
          //Regex Table Cells
          var details=eventArray[x].match(/(">|: )(?=([\w \b\.\-,\(\)]+))\2</g);
          if(details && details.length==6){
            type=type.slice(6,-1).replace(/en/, "").replace(/ne/, "n").replace(/ka/,"kum");
            
            var event={
              name:name,
              lecturer:lecturer,
              type:type,
              day:details[0].slice(2,-1),
              date:details[1].slice(2,-1),
              timespan:details[2].slice(2,-1),
              location:details[3].slice(2,-1),
              fs:details[4].slice(2,-1),
              lastChanged:details[5].slice(2,-1)
            }
            events.push(event);
          }
        }
      }
      callback(events);
    }
    
    //Build page from chunked responses
    res.on("data", function(chunk){
      string+= chunk;
    });
    
    //Parse page string
    res.on("end", parseEvents);
  }
}
