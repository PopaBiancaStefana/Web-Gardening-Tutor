const db =require("../database");



 async function updateProgress(data)
 {
   //data contains the fields: user_email, course_name and progress(ex:2) 

   //get the id of the user
   let user_id = await getUserId(data.user_email);

   //get the id of the course
   let course_id = await getEmailId(data.course_name);

   //set finished
   let nr_check = await getCheckpoints(course_id);

  let finished = false;
   if (data.progress == nr_check) {
     finished = true;
   }

   let progress = await verifyProgress(user_id, course_id);
   if (Object.keys(progress).length === 0) {
    
    db.pool.query("INSERT INTO courses_in_progress(id_user, id_course, progress,finished) values (?,?,?,?)",[user_id, course_id, data.progress, finished] , function (err) {
    if (err) throw err;
      console.log("Progress created");
     
    });     
   } else {
     
    db.pool.query("UPDATE courses_in_progress SET progress = ?, finished = ? WHERE  id_user = ? and id_course = ?",[data.progress, finished, user_id, course_id] , function (err) {
    if (err) throw err;
      console.log("Progress updated");
     
    });
   }
}

 async function getUserId(email)
{
    return new Promise((resolve,reject) => 
    {
        db.pool.query("SELECT id FROM registered_users WHERE e_mail = ?", [email], (err, data) => {
            if(err)
            {
                console.log(err);
                reject(err);
            }
            resolve(data[0].id);
        })
    });
}

 async function getEmailId(name)
{
    return new Promise((resolve,reject) => 
    {
        db.pool.query("SELECT id FROM courses WHERE name = ?", [name], (err, data) => {
            if(err)
            {
                console.log(err);
                reject(err);
            }
            resolve(data[0].id);
        })
    });
 }


async function getCheckpoints(id)
{
 return new Promise((resolve,reject) => 
    {
        db.pool.query("SELECT checkpoints FROM courses WHERE id = ?", [id], (err, data) => {
            if(err)
            {
                console.log(err);
                reject(err);
            }
            resolve(data[0].checkpoints);
        })
    }); 
}


async function verifyProgress(user_id, course_id)
{
   return new Promise((resolve,reject) => 
    {
        db.pool.query("SELECT id FROM courses_in_progress WHERE id_user = ? AND id_course = ?", [user_id, course_id], (err, data) => {
            if(err)
            {
                console.log(err);
                reject(err);
            }
            resolve(data);
        })
    }); 
}



async function geCourseProgress(data) {

  //data contains the fields: user_email and course_name 
  
  //get the id of the user
   let user_id = await getUserId(data.user_email);

   //get the id of the course
   let course_id = await getEmailId(data.course_name);

   return new Promise((resolve,reject) => 
    {
      db.pool.query("SELECT progress FROM courses_in_progress WHERE id_user = ? AND id_course = ?" , [user_id, course_id], (err, result) =>{
           if(err)
            {
                console.log(err);
                reject(err);
           }
          resolve(result[0].progress);
      })
     
    }); 
}


module.exports = {updateProgress , geCourseProgress};