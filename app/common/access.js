module.exports = function(req, res, next){

    var found = {
        method: false,
        path: false
    };

    for(var i=0; i<req.user.roles.length; i++){
        for(var j=0; j<req.user.roles[i].permissions.length; j++){

            if(!found.method){
                if(req.user.roles[i].permissions[j].method=='*' ||
                    req.user.roles[i].permissions[j].method.indexOf(req.method)!=-1){
                    found.method=true;
                }
            }

            if(!found.path){
                if(req.user.roles[i].permissions[j].path=='*' ||
                    req.path==req.user.roles[i].permissions[j].path){
                    found.path=true;
                }
            }

        }
    }

    if(true/*found.method && found.path*/){
        next();
    }else{
        next({ message: 'unauthorized', status: 400 });
    }
};
