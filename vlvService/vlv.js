var http = require("http");

exports.getCourses = function(callback){
  var url="http://www.tu-ilmenau.de/vlv/index.php?id=6"
  
  http.get(url, response).on('error', function(e) {
      console.log("getCourses Error: " + e.message);
  });
  
  function response(res){
    var string="";
    
    parseCourses = function(){
      var courses=[];
        
        //Split up Page in Parts, 1 Course per Part
        var arr=string.split(/<tr valign=top>/).filter(function(el){
          return (el.slice(5,16)=='width="52%"')
        });
        
        //Regex the Parts
        for(var i=0;i<arr.length;i++){
          var part=arr[i];
          var name=part.match(/studiengang=.*(?=">)/)[0].replace(/studiengang=/,"").replace(/\+/g," ");
          var short=part.match(/sgkurz=.*?(?=&amp;)/)[0].replace(/sgkurz=/,"").replace(/\_/," ");
          var type=short.slice(short.length-2,short.length)=="MA"?"master":"bachelor";
          var semesters=part.match(/fs=.*?</g);
          for(var j=0; j<semesters.length; j++){
            var semester=semesters[j].split(">")[1]
            semesters[j]=semester.slice(0,semester.length-1);
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
  var url="http://www.tu-ilmenau.de/vlv/index.php?id=6&funccall=1&vers=text"
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
      var arr=string.split(/<p class="stupla_bold"/);
      for(var i=3; i<arr.length; i++){
        var part=arr[i];
        var name=part.match(/>.*?(?= <a)/)[0].replace(/>/,"");
        var lecturer=part.match(/Lesend.*?(?=<\/p>)/)[0].replace(/Lesende\(r\): /,"");
        
        //split into types
        var typeArray=part.split(/scope="rowgroup"/);
        for(var j=1; j<typeArray.length; j++){
          
          //split into single events
          var eventArray=typeArray[j].split(/<tr valign="top">/);
          for(x in eventArray){
            var eventString=eventArray[x];
            
            var type=eventArray[x].match(/(Ü|\b)[\w \( \)]+(?=(:"|:<\/th>))/)[0];
            
            //Regex Table Cells
            var details=eventArray[x].match(/\b[\w\s\b\.\-,\(\)]+(?=<\/td>)/g);
            if(details && details.length==6){
              type=type.replace(/en/, "").replace(/ne/, "n").replace(/ka/,"kum");
              
              var event={
                name:name,
                lecturer:lecturer,
                type:type,
                day:details[0],
                date:details[1],
                timespan:details[2],
                location:details[3],
                fs:details[4],
                lastChanged:details[5]
              }
              events.push(event);
            }
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
