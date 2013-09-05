
/*
 * GET home page.
 */

exports.home = function(req, res){
  res.render('home', { title: 'Cookie-Factory' });
};

exports.experiments = function(req, res){
  res.render('experiments', { title: 'Cookie-Factory Experiments' });
};

exports.timetable = function(req, res){
  res.render('timetable', { title: 'Cookie-Factory Timetable' });
};

exports.redirect = function(req, res){
  res.redirect('home')
};