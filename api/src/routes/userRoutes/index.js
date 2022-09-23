const { Router } = require("express");
const router = Router();
const { TypeOfUser, User, LoginInfo, UserImage, ContactInfo  } = require("../../db");
const {getAllUsers} = require("./controllers")

router.get("/users", async (req, res) => {
  const name = req.query.name;
  //const {name}=req.params
  const usersTotal = await getAllUsers();
  if (name) {
    let userName = await usersTotal.filter((elem) =>
      elem.name.toLowerCase().includes(name.toLowerCase())
    );
    userName.length ? res.status(200).send(userName) : res.status(404).send("User not found");
  } else {
    res.status(200).send(usersTotal);
  }
});

router.post("/typeofusers", async (req, res) => {
  try {
    const { name } = req.body;
    await TypeOfUser.create({
      name,
    });

    res.status(200).send("Usuario adicionado con exito");
  } catch (error) {
    res.status(404).send("error al crear tipo de usuario");
  }});


router.post("/login", async (req, res) => {
  const {
    mail,
    password,
    name,
    // typeOfUserId,
  } = req.body;

  try {
    let loginCrea = await LoginInfo.create({
      mail,
      password,
    });
    let nUser = await User.findOne({
      where: { name: name },
    });
    console.log();
    loginCrea.setUser(nUser);

    res.status(200).send("Login de usuario adicionado correctamente");
  } catch (error) {
    res.status(400).send("error al crear login de usuario ");
  }
});

////////// rutas agregadas \\\\\\\\\\
//me verifica si mi usuario existe y si la contraseña es la de ese usuario

    // router.post('/logueado', async(req,res)=>{
    //     const {name,password} = req.body

    //     var user = await User.findOne({
    //         where: {name: name }
    //    })

    //    !user && res.send({mensaje:"Este Usuario No Existe", loguear: false}) 
       
    //    if(user) var user2 = await LoginInfo.findOne({
    //     where: {id: user.id }
    //   })

    //     if(user2) user2.password !== password ? 
    //     res.send({mensaje:"Contraseña Incorrecto", loguear: false}):
    //     (res.status(200).send({mensaje: "Logueado Exitosamente",userInfo:[user,user2],loguear: true}))
   
    // })

    ////// super ruta para loguear un usuario y si no tiene una cuenta creada la crea y loguea \\\\\\

    router.post('/LoginOrCreate', async(req,res)=>{
        const {name, mail, password, typUser }=req.body

       const user = await LoginInfo.findOne({
                 where: {mail: mail }
              
        })
        if(user && user.password !== password) return res.send({loguear: false,mensage:"Contraseña incorrecta"})

       if(user){
        let  nUser = await User.findOne({
            where: {id: user.userId }
      }) 
       res.send({loguear:true,mensage:"logueado Correctamente" ,userInfo:[nUser,user]})
    }
    else {
        let userCrea = await User.create({ name }) 
        let  type = await TypeOfUser.findOne({ where: {name: typUser }})
       const nUser2 = await userCrea.setTypeOfUser(type)

        let loginCrea = await LoginInfo.create({mail, password }) 
        let  nUser = await User.findOne({where: {name: name }})
        const user2 = await loginCrea.setUser(nUser)

        const infoUser = await ContactInfo.create({mail})
        await infoUser.setUser(nUser)
        


        res.send({loguear: true,mensage:"logueado Correctamente",userInfo:[nUser2,user2]})
     
        
    }
       
    // try{
    // let userCrea = await User.create({
    //     name,                               
    // }) 
    //   let  type = await TypeOfUser.findOne({
    //       where: {name: typUser }
    //  })
    //  //console.log(userCrea)
    //  userCrea.setTypeOfUser(type)

    //  res.status(200).send('Usuario adicionado correctamente')
    // }catch(error){
    //     res.status(400).send("error al crear usuario ")
    // }
    })

//   if (user2)
//     user2.password !== password
//       ? res.send({ mensaje: "Contraseña Incorrecto" })
//       : res.status(200).send({ mensaje: "Logueado Exitosamente", user, user2 });
// });

//Esta ruta sirve para cargar una imagen de perfil
router.post("/imageUser", async (req, res, next) => {
  const { url, cloudId, userId } = req.body;
  try {
    if (!url) return res.status(404).send("no image to upload");
    let user = await User.findByPk(userId)
    let img = await UserImage.create({
      url,
      cloudId
    });
    user.setUserImage(img)
    res.send("image upload successful");
  } catch (error) {
    next(error);
  }
});
       
//Esta ruta sirve para editar el perfil de cualquier usuario
router.put("/editUser/:id", async (req, res, next) => {
  const { id } = req.params;
  const { name, typUser, city, description, rating, ratingAmount } = req.body;
  try {
    if(name){
      await User.upsert({
        id: id,
        name: name
      });
      return res.send("updated name");
    }
    else if(city){
      await User.upsert({
        id: id,
        city: city
      });
      return res.send("updated city");
    }
    else if(description){
      await User.upsert({
        id: id,
        description: description
      });
      return res.send("updated description");
    }
    if(rating && ratingAmount){
      await User.upsert({
        id: id,
        rating: rating,
        ratingAmount: ratingAmount
      });
      return res.send("updated rating");
    }
  } catch (error) {
    next(error)
  }
});


module.exports = router 
