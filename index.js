var express = require('express'),
	app = new express(),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-Parser'),
	multer = require('multer'),
	session = require('express-session'),
	router_ind = require('./router/ind.js'),
	router_group = require('./router/group.js'),
	router_invite = require('./router/invite.js'),
	router_modify_ind = require('./router/modify_ind.js'),
	router_management = require('./router/management.js'),
	router_management_ind = require('./router/management_ind.js'),
	router_management_group = require('./router/management_group.js'),
	csurf = require('csurf'),
	csrfProtection = csurf({ cookie: true }),
	parseForm = bodyParser.urlencoded({ extended: false });

app.set('views', './view');
app.set('view engine', 'ejs');
app.use('/public',express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({secret: 'HELLO WORLD, I CAN\'T PUBLIC THIS MESSAGE'}));

//首頁路由
app.get('/',function(req,res){
	res.status(404).end();
});

//資料送進路由
app.post('/handle_One',router_ind.upload,router_ind.handle);
app.post('/handle_Group',router_group.upload,router_group.handle);

//確認邀請路由 (對邀請碼資料庫搜尋、一訪問即刪除)
app.get('/invite/:id',router_invite.handle);

//個人資料修改登入
app.get('/modify_ind',router_modify_ind.checkLogin,router_modify_ind.index);
app.get('/i_login',router_modify_ind.login);
app.get('/i_logout',router_modify_ind.logout);
app.post('/i_auth',router_modify_ind.log_auth);
app.post('/modify_data',router_modify_ind.checkLogin,router_modify_ind.modify_data);


//管理員修改資料登入 (未塞 middleware)
//管理員修改(首頁)
app.get('/admin',router_management.checkLogin,router_management.index);
app.get('/admin/login',csrfProtection,router_management.login);
app.get('/admin/logout',router_management.logout);
app.post('/admin/auth',parseForm,csrfProtection,router_management.auth);
//匯出路由器
app.get('/admin/System',router_management.checkLogin,router_management.select);
app.get('/admin/export/:who',router_management.checkLogin,router_management.user_data);

//匯入路由器
app.get('/admin/imports/:who',[router_management.checkLogin,router_management.upload],router_management.imports_front);
app.post('/admin/imports/Process/Only',[router_management.checkLogin,router_management.upload],router_management.imports_Only);
app.post('/admin/imports/Process/Group',[router_management.checkLogin,router_management.upload],router_management.imports_Group);

//管理員修改 (系統)
//帳號使用靜態模式

//管理員修改 (個人)
app.get('/admin/ind',function(req,res){ res.redirect('/admin/ind/0'); });
app.get('/admin/ind/:id',router_management.checkLogin,router_management_ind.index); //page
app.get('/admin/ind/name/:name',router_management.checkLogin,router_management_ind.modify);
app.post('/admin/ind/name/modify/post',router_management.checkLogin,router_management_ind.post_modify);
app.get('/admin/ind/name/responses/:name/request/:number',router_management.checkLogin,router_management_ind.responses);//直接確認修改
//punycode 轉換
app.post('/admin/ind/search/',router_management.checkLogin,router_management_ind.pc2se);
app.get('/admin/ind/punycode/:code',router_management.checkLogin,router_management_ind.url2se);


//管理員修改 (團體)
app.get('/admin/group',function(req,res){ res.redirect('/admin/group/0'); });
app.get('/admin/group/:id',router_management.checkLogin,router_management_group.index); //顯示分頁、項目
app.get('/admin/group/name/:name',router_management.checkLogin,router_management_group.modify); 
app.post('/admin/group/name/modify/post',router_management.checkLogin,router_management_group.post_modify);
app.get('/admin/group/name/responses/:name/',router_management.checkLogin,router_management_group.responses);//直接確認修改
//punycode 轉換
app.post('/admin/group/search/',router_management.checkLogin,router_management_group.pc2se);
app.get('/admin/group/punycode/:code',router_management.checkLogin,router_management_group.url2se);

//建立一般訪問路由，透過渲染把同意資料加上去

app.listen(80);