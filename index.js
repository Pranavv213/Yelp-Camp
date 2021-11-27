
// const intial_db={
//     arr:arr
// }
// module.exports=intial_db;
const express = require('express');
var timeout = require('connect-timeout')

app=express();
app.use(timeout('400s'))
app.set('view engine','ejs')
const engine=require('ejs-mate')
const dotenv = require("dotenv")

dotenv.config()
app.engine('ejs', engine)
const mongoose = require('mongoose');
const Camp=require('./models/schema');
const User=require('./models/schema2');
const Comment=require('./models/schema3');
const session = require("express-session");
const Auth=require('./models/auth')
const passport=require('passport');
const LocalStrategy=require('passport-local')
const mbxGeocoding=require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken="pk.eyJ1IjoicHJhbmF2dm1hcGJveCIsImEiOiJja3Z5ejA1ZzcwZ2lvMm9udDZxbGx1cmU4In0.38TpBzHNKZQAlfgPzYmjLA";
const geocoder=mbxGeocoding({accessToken:mapBoxToken})
const intial_db=require('./models/intial_db');
const arr=intial_db.arr;
// Camp.insertMany(arr).then(()=>{
//     console.log("inserted")
// })
// mongodb+srv://pranav:1234@cluster0.ygsyu.mongodb.net/camp?retryWrites=true&w=majority
// mongodb://localhost:27017/camp
const MONGODB_URL = process.env.MONGODB_URI
mongoose.connect(process.env.MONGODB_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true,   
}).then(()=>{
    console.log("connected to database")
}).catch((err)=>{
    console.log(process.env.MONGODB_URI)
    console.log(process.env.MONGODB_URI)
})

app.use((req,res,next)=>{
    // to give acces from anywhere
    res.setHeader("Access-Control-Allow-Origin",'*');
    res.setHeader("Access-Control-Allow-Headers",'*');
    next()
})


app.use(express.urlencoded({extended:true}))





app.get('/addFakeData',(req,res)=>{
    Camp.insertMany(arr).then((data)=>{
        res.send("added:   "+data)
    }).catch((err)=>{
        res.send("data not added")
    })
})
app.get('/deleteFakeData',(req,res)=>{
    Camp.remove({}).then((data)=>{
        res.send("added:   "+data)
    }).catch((err)=>{
        res.send("data not added")
    })
})
app.get('/db_findAll',(req,res)=>{
    Comment.find({}).then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send(err)
    })
})
app.get('/geoData/:longitude/:latitude',async(req,res)=>{
  
    const longitude = req.params.longitude;
    const latitude = req.params.latitude;
    const data=[longitude,latitude]
  res.send(`<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
  
  <script src='https://api.mapbox.com/mapbox-gl-js/v2.3.1/mapbox-gl.js'></script>
  <link href='https://api.mapbox.com/mapbox-gl-js/v2.3.1/mapbox-gl.css' rel='stylesheet' />
  
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Map</title>
      <style>
      body{background-color:black},
      #map{
          width:100%;
          height:100%;
      }
      </style>
  </head>
  <body>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
    <nav class="navbar sticky-top navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
          <a style="color:white"  class="navbar-brand" href="#">YELPCAMP</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a style="color:white" class="nav-link active" aria-current="page" href="/home">Home</a>
              </li>
              <li class="nav-item">
                <a style="color:white" class="nav-link" href="/add">Add New Camp</a>
              </li>
                </ul>
              </li>
              <form action="/find"class="d-flex">
                <input name="data" class="form-control me-2" type="search" placeholder="Search By City" aria-label="Search">
                <button style="color:white" class="btn btn-outline-success" type="submit">Search</button>
  
              </form>
            </ul>
            
            &nbsp; &nbsp;
            <a type="button" href="/signup" class="btn btn-danger">SignUp</a>
            &nbsp;
            <a type="button" href="/login" class="btn btn-warning">Login</a>
          </div>
        </div>
      </nav>
    
      <div id='map' style='width:100%; height: 400px;'>
      
      </div>
      <script>
  
  mapboxgl.accessToken = 'pk.eyJ1IjoicHJhbmF2dm1hcGJveCIsImEiOiJja3Z5ejA1ZzcwZ2lvMm9udDZxbGx1cmU4In0.38TpBzHNKZQAlfgPzYmjLA';
  
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center:[${longitude},${latitude}],
    zoom:1
  });
  new mapboxgl.Marker().setLngLat([${longitude},${latitude}]).addTo(map)
</script>
    
  
        
  
  </body>
  </html>`)
  
})
app.get('/findLocation/:username',(req,res)=>{
    const latitude=req.query.latitude;
    const longitude=req.query.longitude;
    const username=req.params.username;
    // Camp.find({$or:[{city:data},{growth_from_2000_to_2013:data},{latitude:data},{longitude:data},{population:data},{rank:data},{state:data}]}).then((data)=>{
    //     res.render('home.ejs',{data})
    // }).catch((err)=>{
    //     res.send("hello"+data+"hello")
    // })
    Camp.find({latitude:latitude,longitude:longitude}).then((data)=>{
        if(data.length==0)
        {
            res.send("no data found")
        }
        let arr=[username,data]
        res.render('home_login.ejs',{arr})
    }).catch((err)=>{
        
        res.send("hello"+data+"hello")
    })
    
})
app.get('/find',(req,res)=>{
    const data=req.query.data;
    // Camp.find({$or:[{city:data},{growth_from_2000_to_2013:data},{latitude:data},{longitude:data},{population:data},{rank:data},{state:data}]}).then((data)=>{
    //     res.render('home.ejs',{data})
    // }).catch((err)=>{
    //     res.send("hello"+data+"hello")
    // })
    Camp.find({city:data}).then((data)=>{
        if(data.length==0)
        {
            res.send("no data found")
        }
        res.render('home.ejs',{data})
    }).catch((err)=>{
        
        res.send("hello"+data+"hello")
    })
    
})
app.get('/home',async(req,res)=>{
   const arr =await Camp.find({}).then((data)=>{
        // res.render('home.ejs',{data})
        res.send(data);
    }).catch((err)=>{
        res.render("data not found")
    })
    res.send("ye!!!")
    
})
app.get('/',async(req,res)=>{
    const arr =await Camp.find({}).then((data)=>{
         // res.render('home.ejs',{data})
         res.send(data);
     }).catch((err)=>{
         res.render("data not found")
     })
     res.send("ye!!!")
     
 })
app.post('/signup',(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    User.find({ username: username}).then((data)=>{
        if(data.length!=0)
        {
            res.send("Username already taken")
        }
    })
    User.insertMany([{username:username,password:password}]).then((data)=>{
        console.log(data)
        res.redirect('/login')
    })
    console.log(req.body)
   
    
})
app.get('/signup',(req,res)=>{
    res.render('signup.ejs')
    
})
app.get('/login',(req,res)=>{
    res.render('login.ejs')
    
})
app.post('/login',(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    User.find({username:username,password:password}).then((data)=>{
        if(data.length==0) {
            res.send("sign up first")
        }
        console.log(data)
        //res.send("successfully logged in  "+data)
        res.redirect(`/home_login/${username}`)
    }).catch((err)=>{
        res.send("signup first")
    })
   
   
    
})
app.get('/coordinates',(req,res)=>{
    Camp.find({}).then((data)=>{
        res.render('coordinates.ejs',{data})
    }).catch((err)=>{
        res.render("data not found")
    })
    
   
})
app.post('/review/:city/:username',(req,res)=>{
    const {city, username} = req.params;
    const rating =req.body.rating;
    const comment=req.body.comment;
    Comment.insertMany([{city:city, username:username,
rating:rating,comment:comment}]).then((data)=>{
    console.log(data)
    res.send(data)
}).catch((err)=>{console.log(err)
res.send(err)})
})
app.get('/details/:id/:username',(req,res)=>{
    const id=req.params.id;
    const username=req.params.username;

    Camp.find({_id:req.params.id}).then((data)=>{
        let city=data[0].city;
        Comment.find({city:city}).then((info)=>{

            console.log(info)
            
            let arr=[username,data,info]
        res.render('details.ejs',{arr})
        })
        
    }).catch((err)=>{
        res.send("data not found")
    })
    
})
app.get('/home_login/:username',(req,res)=>{
    
    
    const username = req.params.username;
    Camp.find({}).then((data)=>{
        let arr=[username,data]
        res.render('home_login.ejs',{arr})
    }).catch((err)=>{
        res.render("data not found")
    })
    
})
// app.get('/signup2',(req,res)=>{
//     res.render('signup2.ejs')
// })
// app.get('/dbi',async(req,res)=>{
//     const user=new Auth({email:'blabla@gmail.com',username:'colt'});
//    const registerUser=await Auth.register(user,'hello')   
//    res.send(registerUser)
  
    
// })
// app.get('/login2',(req,res)=>{
//     res.render('login2.ejs')
// })


app.post('/addCampDb',(req,res)=>{
    const city=req.body.city;
    const growth_from_2000_to_2013=req.body.growth_from_2000_to_2013;
    const latitude=req.body.latitude;
    const longitude=req.body.longitude;
    const population=req.body.population;
    const rank=req.body.rank;
    const state=req.body.state;
    Camp.insertMany([{city:city,growth_from_2000_to_2013:growth_from_2000_to_2013,latitude:latitude,longitude:longitude,population:population,rank:rank,state:state}]).then((data)=>{
        res.send("added:   "+data)
    }).catch((err)=>{
        res.send("data not added")
    })
    
})
app.get('/add',(req,res)=>{
    res.render('addCamp.ejs')
    
})
const port=process.env.PORT || 5000
app.listen(port,()=>{
    console.log("listening to port 5000")
})