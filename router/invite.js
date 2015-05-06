var mongojs = require('mongojs'),
	enc = mongojs('encrypt',['table']),
	o = mongojs('Only',['table']);

exports.handle = function(req,res){
	var request_id = req.param('id');
	//搜尋資料庫
		//如果沒有該code, 就404
		//如果符合，拿出該people的欄位來update num
	enc.table.findOne({link:request_id},function(err,doc){
		if(err || !!doc == false){
			res.render('Finish',{message:"無效的訪問"})
		}else{
			if(doc.invite_num == 1){
				//如果是第一個人，修改他的資料
				o.table.findAndModify({
				    query: { name: doc.request },
				    update: { $set: { 'invite.invite_one_status' : true } },
				    new: true
				}, function(err, doc, lastErrorObject) {
					enc.table.remove({link:request_id});
				    res.render('Finish',{message:"您已經回應這項邀請! 十分謝謝您"});
				});
			}else{
				//如果是第二個，修改他的資料
				o.table.findAndModify({
				    query: { name: doc.request },
				    update: { $set: { 'invite.invite_two_status' : true } },
				    new: true
				}, function(err, doc, lastErrorObject) {
					enc.table.remove({link:request_id});
				    res.render('Finish',{message:"您已經回應這項邀請! 十分謝謝您"});
				});
			}
		}
	});
}