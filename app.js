const Koa = require('koa');
const KoaStaticCache = require('koa-static-cache');
const KoaRouter = require('koa-router');
const nunjucks = require('nunjucks');
//nodejs操纵数据库
const mysql2 = require('mysql2');
//对post请求过来的数据进行封装
const koaBody = require('koa-body');
//解析文件名
const parsePath = require('parse-filepath');
//解析cookie
const cookieParse = require('cookie-parse');

// 创建数据库连接
const connection = mysql2.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'kkb'
});

const app = new Koa();


//设置cookie密钥并且在设置cookie的时候带上密钥
const key='lth'
app.keys=[key];


// 设置静态文件资源代理
app.use(KoaStaticCache('./public', {
    prefix: '/public',
    gzip: true,
    dynamic: true
}));

// 动态资源处理 koa-router
const router = new KoaRouter();

// 配置模板引擎
nunjucks.configure('./templates', {
    watch: true,
    noCache: true
});

// 首页
router.get('/:id(\\d*)', async ctx => {
    // 1、获取当前页面所需要的动态数据：
    // 商品分类数据:categories
    // 商品列表数据:items
    let categories = [];
    // 2、获取当前页面动态路由的数据
    // 对象中的key就是动态路由:后面的名称
    // 127.0.0.1/1 其中1通过ctx.params.id获取
    let categoryId = ctx.params.id;
    // 3、 获取当前页面query的数据
    // ctx.request.query 存储了url中?后面的内容
    //  127.0.0.1/1?page=1 其中1通过ctx.request.query.page获取
    let page = ctx.request.query.page;
    //如果不存在指定分页则显示第一页
    if (!page) {
        page = 1;
    }
    // 每页显示的商品数据条数
    // 这里为一页两条数据
    let prepage = 2;
    // 偏移量--用以数据库查询
    // 即第三页的偏移量为4
    let offset = (page - 1) * prepage;
    // 查询所有商品数据的总条数
    let sqlCount = 'SELECT count(id) as count FROM `items`';
    // 解析总共查询到多少商品
    let [
        [{
            count
        }]
    ] = await query(sqlCount);
    //pages是总共有几页
    //依据数据库中的商品总数得出总页面数
    let pages = Math.ceil((count / prepage));
    let sql = 'SELECT * FROM `items` limit ' + prepage + ' offset ' + offset;
    //如果127.0.1.1/1?page=1则增加查询条件
    if (categoryId) {
        //如果存在类目id即/1或/2或/3则增加where语句
        sql = 'SELECT * FROM `items` where `category_id`=? limit '+ prepage + ' offset ' + offset;
    }
    //首页即127.0.1.1默认是查询出数据库中所有的商品数据并渲染
    [categories] = await query('SELECT * FROM `categories`');
    // console.log([categories], '1111');
    /**[categories]
     * [ [ TextRow { name: '手机', id: 1 },
        TextRow { name: '笔记本', id: 2 },
        TextRow { name: '电视机', id: 3 } ] ]
    */
    [items] = await query(sql, [categoryId]);

    // 2、通过后端模板引擎对数据和模板文件进行渲染，得到最终返回给前端的页面
    ctx.body = nunjucks.render('index.html', {
        categories,
        items,
        pages,
        page
    });
});


// 通过get方式访问并返回一个添加新商品的页面
// 通过点击添加商品按钮跳转过来的添加商品页面
//<option value="{{category.id}}">{{category.name}}</option>
//<option value="">请选择一个类别</option>

//在option中的value有两种可能一种是''(空字符),一种是1,2...(商品id)
router.get('/addItem', verify,async ctx => {
    [categories] = await query('SELECT * FROM `categories`');

    ctx.body = nunjucks.render('addItem.html', {
        categories,
        uid:ctx.state.uid
    });

    // 因为在这里是访问不到vertify里面的变量的
    // 但是我们就是想要拿到uid并在页面显示用户登录的id

    //方法一：
    // let id = ctx.cookies.get('id');
    // console.log(id,'idid');

    //方法二：在共享池中(ctx.state.uid)获取
});


//暗号数据库
//提供一个get方式接口localhost:8888/register访问注册页面（form表单）
//注册页面
router.get('/register',async ctx=>{
    [categories] = await query('SELECT * FROM `categories`');

    ctx.body = nunjucks.render('register.html', {
        categories
    });
})


//上传图片页面
//暗号上传
router.get('/upload',async ctx=>{
    [categories] = await query('SELECT * FROM `categories`');

    ctx.body = nunjucks.render('upload.html', {
        categories
    });
})

router.post('/upload', koaBody({
    multipart:true,
    formidable:{
        uploadDir:'./public/attachments',
        keepExtensions:true
    }
}),async ctx => {
    let {
        categoryId,
        name,
        price
    } = ctx.request.body;
    // console.log(ctx.request.files.filename,'1111');
    let {base:filename}=parsePath(ctx.request.files.filename.path)
    // console.log(filename,'filename');
    let {size}=ctx.request.files.filename
    // console.log(size,'size');
    let {type}=ctx.request.files.filename
    // console.log(type,'type');
    // console.log(rs,'rsrsrsrsrs');
    if(size>0){
        let [rs] = await query(
            "INSERT INTO `attachments` (`filename`, `type`, `size`) VALUES (?, ?, ?)",
            [filename, type, size]
        );
        let [categories] = await query('SELECT * FROM `categories`');
        return ctx.body = nunjucks.render('message.html', {
            categories,
            message:'<p>上传成功</p><hr/></a> <a href="/">回到首页</a></p>'
        });
    }else{
        return ctx.body = nunjucks.render('message.html', {
            categories,
            message:'<p>上传失败</p> | <a href="/">回到首页</a></p>'
        });
    }
})


// post提交过来的数据进行处理
// 相当于拦截这个页面的post请求
router.post('/addItem', koaBody({
        //设置koa-body能够解析enctype="multipart/form-data"的格式数据
        multipart:true,
        //设置上传的二进制文件的处理
        formidable:{
            //上传的二进制文件存储在文件的位置
            //上传后的文件名称是随机命名的
            //上传后文件名称尽量不要使用上传之前的原始文件的名称
            //因为会有覆盖的问题：c盘：1.jpg d盘: 1.jpg
            uploadDir:'./public/attachments',
            //保持文件原来的拓展名
            keepExtensions:true
        }
}), async ctx => {


    /**
     * 数据 { categoryId: '1',
        name: '荣耀20 PRO',  
        price: '229900',
        cover: '62cf191f88e41447.jpg' }
    */

    //改成了enctype="multipart/form-data"后在提交时报错
    //报错代码为：Error: Column 'category_id' cannot be null
    let {
        categoryId,
        name,
        price
    } = ctx.request.body;

    //在koa-body中设置{multipart:true}除了cover获取不到其他数据都没问题了
    // console.log(cover,'cover在ctx.request.files里面');
    // console.log(ctx.request.files,'我们想要的cover在这里');
    

    
    //数据库存储的是文件上传以后在服务器的名字
    //即在path中需要通过解析才能拿到
    // path:'public\\attachments\\upload_3cbbc47b15e1f555d8a0a1f9479dcc34.jpg',
    // 可以使用第三方库帮忙解析其中的对象中的base属性就是我们想要的
    // console.log(parsePath('public\\attachments\\upload_3cbbc47b15e1f555d8a0a1f9479dcc34.jpg'));
    // 结果为upload_9ed2c3d065aee76b553efe616e36dd8c.jpg 
    let {base:cover}=parsePath(ctx.request.files.cover.path)
    
    
    // 对数据进行合法性验证
    // 验证通过，存储到数据库
    // 解构获取结果中的第一个数组数据

    //预查询
    let [rs] = await query(
        "INSERT INTO `items` (`category_id`, `name`, `price`, `cover`) VALUES (?, ?, ?, ?)",
        [categoryId, name, price, cover]
    );
    
    let [categories] = await query('SELECT * FROM `categories`');
    ctx.body = nunjucks.render('message.html', {
        categories,
        message:'<p>添加成功</p><p><hr/></a><a href="/addItem">继续添加商品</a> | <a href="/">回到首页</a></p>'
    });
});


//暗号上传
//注册逻辑
router.post('/register',koaBody(),async ctx => {
    let {
        username,
        password,
        repeatPassword
    } = ctx.request.body;

    let [categories] = await query('SELECT * FROM `categories`');
    //处理一下数据校验
    if(!username){
        return ctx.body = nunjucks.render('message.html', {
            categories,
            message:'<p>用户名不能为空</p><p><hr/></a><a href="/register">重新注册</a> | <a href="/">回到首页</a></p>'
        });
    }

    //检测用户名是否已经被注册
    let [user] = await query(
        'SELECT * FROM `users` where `username`=?',
        [username]
    );
    if(user.length){
        // console.log(user);
        return ctx.body = nunjucks.render('message.html', {
            categories,
            message:'<p>用户名已经被注册</p><p><hr/></a><a href="/register">重新注册</a> | <a href="/">回到首页</a></p>'
        });
    }

    //注册成功的时候
    if(password===repeatPassword){
        //预查询
        let [result] = await query(
            "INSERT INTO `users` (`username`, `password`) VALUES (?, ?)",
            [username,password]
        ); 
        
        return ctx.body = nunjucks.render('message.html', {
            categories,
            message:'<p>注册成功</p><p><hr/></a><a href="/register">现在前去登录</a> | <a href="/">回到首页</a>| <a href="/register">还回到注册页</a></p>'
        });
    }


})



// 登录页面 
router.get('/login', async ctx => {
    [categories] = await query('SELECT * FROM `categories`');

    ctx.body = nunjucks.render('login.html', {
        categories
    });
})

//登录处理逻辑
// 登录逻辑
router.post('/login', koaBody(), async ctx => {
    [categories] = await query('SELECT * FROM `categories`');

    let {username, password} = ctx.request.body;

    let [[user]] = await query(
        'SELECT * FROM `users` where `username`=? AND `password`=? limit 1',
        [username, password]
    );

    if (!user) {
        return ctx.body = nunjucks.render('message.html', {
            categories,
            message: '<p>用户名或者密码错误</p><p><hr/></a><a href="/login">重新登录</a> | <a href="/">回到首页</a></p>'
        });
    }




    // 自己直接来设置cookie信息
    // ctx.set('Set-Cookie', 'id='+user.id); 
    // ctx.set('Set-Cookie', 'user='+user.username); 
    // ctx.set('Set-Cookie', 'user='+user.username); 
    
    // 利用koa框架提供的设置cookie的方法
    // 通过 signed 设置cookie签名，签名：证书
    // ctx.cookies.set('id', 1, { signed: true });
    
    //这里使用koa框架给我们提供的设置cookie信息的方法
    //并且设置cookie签名证书
    ctx.cookies.set('id',1,{signed:true})

    

    ctx.body = nunjucks.render('message.html', {
        categories,
        //这样子是无法在其他请求中携带的
        //于是乎cookie就可以用上了
        //浏览器记得就行
        //响应首部Set-Cookie是被用来由服务器端向客户端发送cookie
        message: `<p>登录成功欢迎回来${user.username}你的id是${user.id}</p><hr/><a href="/addItem">登录后可以前往添加商品</a> | <a href="/">回到首页</a> |<a href="/login">回到登录页</a>`
    });
})



































app.use(router.routes());


app.listen(8888);

//封装一个异步操纵数据库的方法
function query(sql, prePared) {
    return new Promise((resolve, reject) => {
        connection.query(
            sql,
            prePared, 
            function (err, results, fields) {
                if (err) {
                    reject(err);
                } else {
                    resolve([results, fields]);
                }
            }
        )
    });
}


//封装一个中间件专门验证用户是否已经登录
async function verify(ctx, next) {
    // let cookies=ctx.get('Cookie')
    // console.log('cookies',cookies); //cookies id=1

    //利用第三方库解析cookie    cnpm i cookie-parse
    // let cookies = cookieParse.parse(ctx.get('Cookie'));
    // console.log('cookies',cookies); //cookies { id: '1' }
    

    //利用koa框架设置cookie后不需要用第三方库来解析cookie了
    // let id = ctx.cookies.get('id');
    // console.log('id',id); //1

    //想要共享出id给各处用
    //根据uid从数据中获取具体的用户信息，
    //存储在 ctx.state.user = {} 以供后续中间件去使用
    // ctx.state.uid = ctx.cookies.get('id');
    //还可以根据uid从数据库中获取具体的用户信息,存储在ctx.state.user



    //现在来说客户端的cookie还是可以被随意篡改的
    //于是我们需要用一种cookie密钥方法
    ctx.state.uid = ctx.cookies.get('id',{
        signed:true
    });

    if(ctx.state.uid){ //if(cookies.id){  和   if(id){
        await next()
    }else{
        //如果想要访问/addItem却检测到没有带cookie
        //重定向到login页面
        ctx.set('Location', '/login');
        ctx.status = 302; //301
        ctx.body = '';
        
        
        // [categories] = await query('SELECT * FROM `categories`');
        // ctx.body = nunjucks.render('message.html', {
        //     categories,
        //     //这样子是无法在其他请求中携带的
        //     //于是乎cookie就可以用上了
        //     //浏览器记得就行
        //     //响应首部Set-Cookie是被用来由服务器端向客户端发送cookie
        //     message: `<p>登陆后才可以添加商品</p><hr/><a href="/login">前往登录</a> | <a href="/">回到首页</a>`
        // });
    }

}