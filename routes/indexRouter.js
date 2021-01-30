var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.send("Not found").status(404)
});
router.get('/event/:day/:session/:lang?', async (req, res, next)=> {
  //res.render('index', { title: 'Express' });
  let day=await req.knex.select("*").from("t_confDays").where({key:req.params.day})
  if(day.length==0){
   return res.send("Not found").status(404);
  }
  session=await req.knex.select("*").from("t_confSession").where({key:req.params.session, dayid:day[0].id})
  if(session.length==0){
    return res.send("Session not found").status(404);
  }
  var lang="ru";
 // if(req.params.lang=="en")
   // lang="en";
  res.render("player",{session:session[0], lang:lang});
});

router.get('/admin', function(req, res, next) {
  if(!req.session.user)
    res.render('adminLogin', { title: 'admin' });
  else
  res.render('admin', { title: 'admin' });
});
router.post('/admin', function(req, res, next) {
  if(req.body.login="editor" && req.body.password=="bolero123"){
    req.session.user=true;
    res.render('admin', { title: 'admin' });
  }
  else
    res.render('adminLogin', { title: 'admin' });
});


router.post('/day', async (req, res, next)=> {

  if(!req.session.user)
    return res.sendStatus(403)
  console.log(req.body.key);
  await req.knex("t_confDays").insert({key:req.body.key});
  res.json(await req.knex.select("*").from("t_confDays"));
});
router.get('/day', async (req, res, next)=> {
  res.json(await req.knex.select("*").from("t_confDays"));
});
router.post('/session', async (req, res, next)=> {
  if(!req.session.user)
    return res.sendStatus(403)
  await req.knex("t_confSession").insert({key:req.body.key, dayid:req.body.id});
  res.json(await req.knex.select("*").from("t_confSession").where({dayid:req.body.id}).orderBy("key"));
});
router.get('/session/:id', async (req, res, next)=> {
  res.json(await req.knex.select("*").from("t_confSession").where({dayid:req.params.id}).orderBy("key"));
});
router.post('/sessionChange', async (req, res, next)=> {
  if(!req.session.user)
    return res.sendStatus(403)
  var id=req.body.item.id;
  delete req.body.item.id;
  await req.knex("t_confSession").update(req.body.item).where({id:id});
  res.json(await req.knex.select("*").from("t_confSession").where({id:req.body.item.dayid}));
});

router.delete('/session/:id', async (req, res, next)=> {
  if(!req.session.user)
    return res.sendStatus(403)
  await req.knex("t_confSession").where({id:req.params.id}).delete();
  res.json(req.params.id);
});

router.get('/sessionStatus/:id', async (req, res, next)=> {
  var ret=await req.knex.select("*").from("t_confSession").where({id:req.params.id})
  if(ret.length>0)
    return res.json(ret[0]);
  else
    res.send("Session not found").status(404);
});

module.exports = router;
