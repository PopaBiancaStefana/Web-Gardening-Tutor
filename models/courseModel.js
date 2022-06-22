const { CLIENT_FOUND_ROWS, CLIENT_LONG_PASSWORD } = require("mysql/lib/protocol/constants/client");
const db = require("../database");
const userModel = require("../models/userModel");


function toFormalEncoding(string)
{
  string = string.charAt(0).toUpperCase() + string.slice(1); // capitalize
  string = string.replace('_', ' ');
  return string;
}

async function updateProgress(data) {
  //data contains the fields: user_id, course_name and progress(ex:2)

  //get the id of the user
  let user_id = data.user_id;

  //get the id of the course
  let course_id = await getCourseId(toFormalEncoding(data.course_name));

  //set finished
  let nr_check = await getCheckpoints(course_id);

  let finished = false;
  if (data.progress == nr_check) {
    finished = true;

    userModel.incrementFinishedCourses(user_id);
    
  }

  let progress = await verifyProgress(user_id, course_id);
  if (Object.keys(progress).length === 0) {
    db.pool.query(
      "INSERT INTO courses_in_progress(id_user, id_course, progress,finished) values (?,?,?,?)",
      [user_id, course_id, data.progress, finished],
      function (err) {
        if (err) throw err;
        console.log("Progress created");
      }
    );
  } else {
    db.pool.query(
      "UPDATE courses_in_progress SET progress = ?, finished = ? WHERE  id_user = ? and id_course = ?",
      [data.progress, finished, user_id, course_id],
      function (err) {
        if (err) throw err;
        console.log("Progress updated");
      }
    );
  }
}

async function getCourseId(name) {
  return new Promise((resolve, reject) => {
    db.pool.query(
      "SELECT id FROM courses WHERE name = ?",
      [name],
      (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(data[0].id);
      }
    );
  });
}

async function getCheckpoints(id) {
  return new Promise((resolve, reject) => {
    db.pool.query(
      "SELECT checkpoints FROM courses WHERE id = ?",
      [id],
      (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(data[0].checkpoints);
      }
    );
  });
}

async function verifyProgress(user_id, course_id) {
  return new Promise((resolve, reject) => {
    db.pool.query(
      "SELECT id FROM courses_in_progress WHERE id_user = ? AND id_course = ?",
      [user_id, course_id],
      (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(data);
      }
    );
  });
}

async function getCourseProgress(data) {
  //data contains the fields: user_id and course_name

  //get the id of the user
  let user_id = data.user_id;

  //get the id of the course
  let course_id = await getCourseId(data.course_name);

  return new Promise((resolve, reject) => {
    db.pool.query(
      "SELECT progress FROM courses_in_progress WHERE id_user = ? AND id_course = ?",
      [user_id, course_id],
      (err, result) => {
        if (err) {
          console.log(err);
          reject(err);
        }

        let prog;
        if (result[0] == undefined) {
          prog = 0;
        } else {
          prog = result[0].progress;
        }
        resolve(prog);
      }
    );
  });
}

async function getCourseByName(name)
{
  const courses = require("../public/jsons/content.json");

  //verificam daca exis cursul cu numele dat ca parametru
  let course;
  if(name in courses)
  {
    course = courses[name];
  } else
    course.error = "course not found";

  return course;
}

async function getBookmarked(id_user) {

  let data = {};
  let bookmark = await getBookmarkedCourses(id_user);
  Object.assign(data, bookmark);

  return data;
}

async function getBookmarkedCourses(id_user) {

  return new Promise((resolve, reject) => {
    db.pool.query(
      "select name from courses where id in (select id_course from bookmarked_courses where id_user = ? and bookmarked = 1);",
      [id_user],
      (err, result) => {
        if (err) {
          console.log(err);
          reject(err);
          return;
        }

        let data = {};
        let booked = [];
        Object.keys(result).forEach((key) => {
          let row = result[key];
          let course = {};
          course.title = row.name;

          booked.push(course);
        });

        data.booked_courses = booked;
        resolve(data);
      }
    );
  });
}

async function updateBookmark(data) {
  //data contains the fields: user_id, course_name and bookmarked

  //get the id of the course
  let course_id = await getCourseId(data.course_name);


  let booked = await verifyBookmark(data.user_id, course_id);
  if (Object.keys(booked).length === 0) {
    db.pool.query(
      "INSERT INTO bookmarked_courses(id_user, id_course, bookmarked) values (?,?,?)",
      [data.user_id, course_id, data.bookmarked],
      function (err) {
        if (err) throw err;
        console.log("Bookmark created");
      }
    );
  } else {
    db.pool.query(
      "UPDATE bookmarked_courses SET bookmarked = ?  WHERE  id_user = ? and id_course = ?",
      [data.bookmarked, data.user_id, course_id],
      function (err) {
        if (err) throw err;
        console.log("Bookmark updated");
      }
    );
  }

}

async function verifyBookmark(user_id, course_id) {
  return new Promise((resolve, reject) => {
    db.pool.query(
      "SELECT id FROM bookmarked_courses WHERE id_user = ? AND id_course = ?",
      [user_id, course_id],
      (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(data);
      }
    );
  });
}

module.exports = {
   updateProgress,
  getCourseProgress, 
  getCourseByName, 
  getBookmarked, 
  updateBookmark,
};
