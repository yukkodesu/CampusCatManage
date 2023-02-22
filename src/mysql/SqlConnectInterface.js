const mysql = require("mysql");
const moment = require("moment");
import { v4 as uuidv4 } from "uuid";

let connection;

let user_uid = "";

const connectSql = function (errhandler) {
  connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "cat_manage",
    port: "3306",
  });
  connection.connect(errhandler);
};

const connectClose = function () {
  connection.end();
};

const userLogin = async function (username, passwd) {
  const res = await new Promise((resolve, reject) => {
    connection.query(
      {
        sql: `SELECT * FROM userinfo WHERE user_name = "${username}"`,
        timeout: 500,
      },
      (error, results, _) => {
        if (error) reject(error);
        resolve(results);
      }
    );
  });
  if (res.length === 0) return false;
  user_uid = res[0].user_uid;
  return res[0].user_passwd === passwd;
};

const userSignUp = async function (username, passwd) {
  return new Promise((resolve, reject) => {
    connection.query(
      {
        sql: `INSERT INTO userinfo VALUES ("${uuidv4()}", 1,"${username}", 1, "${passwd}", NOW())`,
        timeout: 500,
      },
      (error, results, _) => {
        if (error) reject(error);
        resolve(results);
      }
    );
  });
};

const queryCatInfo = async function () {
  return new Promise((resolve, reject) => {
    connection.query(
      {
        sql: `SELECT * FROM catinfo`,
        timeout: 500,
      },
      (error, results, _) => {
        if (error) reject(error);
        resolve(results);
      }
    );
  });
};
const queryCollege = async function () {
  return new Promise((resolve, reject) => {
    connection.query(
      {
        sql: `SELECT * FROM college`,
        timeout: 500,
      },
      (error, results, _) => {
        if (error) reject(error);
        resolve(results);
      }
    );
  });
};

const queryAppearLog = async function () {
  return new Promise((resolve, reject) => {
    connection.query(
      {
        sql: `SELECT * FROM catinfo,appearlog,userinfo,college WHERE userinfo.user_uid = appearlog.user_uid
        AND catinfo.cat_uid = appearlog.cat_uid AND college.college_id = appearlog.college_id;`,
        timeout: 500,
      },
      (error, results, _) => {
        if (error) reject(error);
        resolve(results);
      }
    );
  });
};

const createCatInfo = async function (
  cat_name,
  cat_variety,
  cat_color,
  cat_temp
) {
  return new Promise((resolve, reject) => {
    connection.query(
      {
        sql: `insert into catinfo values ("${uuidv4()}","${cat_name}","${cat_variety}","${cat_color}","${cat_temp}");`,
        timeout: 500,
      },
      (error, results, _) => {
        if (error) reject(error);
        resolve(results);
      }
    );
  });
};
const updateCatInfo = async function (
  cat_uid,
  cat_name,
  cat_variety,
  cat_color,
  cat_temp
) {
  return new Promise((resolve, reject) => {
    connection.query(
      {
        sql: `update catinfo set  cat_name = "${cat_name}", cat_variety = "${cat_variety}", cat_color = "${cat_color}", cat_temp = "${cat_temp}"
        where cat_uid = "${cat_uid}";`,
        timeout: 500,
      },
      (error, results, _) => {
        if (error) reject(error);
        resolve(results);
      }
    );
  });
};

const updateAppearLog = async function (
  cat_uid,
  college_id,
  appear_location,
  appear_log,
  appear_time
) {
  return new Promise((resolve, reject) => {
    connection.query(
      {
        sql: `update appearlog set
        cat_uid = "${cat_uid}",
        user_uid = "${user_uid}",
        college_id = "${college_id}",
        appear_location = "${appear_location}",
        appear_time = "${moment(appear_time).format("YYYY-MM-DD HH:mm:ss")}"
        where appear_log = "${appear_log}";`,
        timeout: 500,
      },
      (error, results, _) => {
        if (error) reject(error);
        resolve(results);
      }
    );
  });
};

const createAppearLog = async function (
  cat_uid,
  college_id,
  appear_location,
  appear_time
) {
  return new Promise((resolve, reject) => {
    connection.query(
      {
        sql: `insert into appearlog value
        ("${cat_uid}",
        "${user_uid}",
        "${college_id}",
        "${uuidv4()}",
        "${appear_location}",
        "${moment(appear_time).format("YYYY-MM-DD HH:mm:ss")}");`,
        timeout: 500,
      },
      (error, results, _) => {
        if (error) reject(error);
        resolve(results);
      }
    );
  });
};

const queryFeedLog = async function () {
  return new Promise((resolve, reject) => {
    connection.query(
      {
        sql: `SELECT * FROM catinfo,feed_log,userinfo,food WHERE userinfo.user_uid = feed_log.user_uid
        AND catinfo.cat_uid = feed_log.cat_uid 
        AND feed_log.food_uid = food.food_uid;`,
        timeout: 500,
      },
      (error, results, _) => {
        if (error) reject(error);
        resolve(results);
      }
    );
  });
};

const queryFood = async function () {
  return new Promise((resolve, reject) => {
    connection.query(
      {
        sql: `SELECT * FROM food`,
        timeout: 500,
      },
      (error, results, _) => {
        if (error) reject(error);
        resolve(results);
      }
    );
  });
};

const createFeedLog = async function (cat_uid, food_uid, feed_time) {
  return new Promise((resolve, reject) => {
    connection.query(
      {
        sql: `insert into feed_log value
        ("${cat_uid}",
        "${food_uid}",
        "${user_uid}",
        "${uuidv4()}",
        "${moment(feed_time).format("YYYY-MM-DD HH:mm:ss")}");`,
        timeout: 500,
      },
      (error, results, _) => {
        if (error) reject(error);
        resolve(results);
      }
    );
  });
};

const updateFeedLog = async function (cat_uid, food_uid, feed_time, feed_uid) {
  return new Promise((resolve, reject) => {
    connection.query(
      {
        sql: `update feed_log set
        cat_uid = "${cat_uid}",
        feed_time = "${moment(feed_time).format("YYYY-MM-DD HH:mm:ss")}",
        food_uid = "${food_uid}"
        where feed_uid = "${feed_uid}";`,
        timeout: 500,
      },
      (error, results, _) => {
        if (error) reject(error);
        resolve(results);
      }
    );
  });
};

export {
  userLogin,
  userSignUp,
  connectSql,
  queryCatInfo,
  queryAppearLog,
  createCatInfo,
  updateCatInfo,
  queryCollege,
  updateAppearLog,
  createAppearLog,
  queryFeedLog,
  queryFood,
  createFeedLog,
  updateFeedLog,
};
