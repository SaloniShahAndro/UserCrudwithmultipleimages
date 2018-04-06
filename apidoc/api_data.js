define({ "api": [
  {
    "type": "Post",
    "url": "/dashboard/:page",
    "title": "ApiLogin",
    "name": "ApiLogin",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>User's Email Id</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "password",
            "description": "<p>User's Password(min 5 digit)</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/controllers/user.controller.js",
    "groupTitle": "User"
  },
  {
    "type": "Post",
    "url": "/api/register",
    "title": "ApiRegister",
    "name": "ApiRegister",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "firstname",
            "description": "<p>User's First name</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "lastname",
            "description": "<p>User's Last name</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>User's Email Id</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "password",
            "description": "<p>User's Password(min 5 digit)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "description",
            "description": "<p>User's Description</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "gender",
            "description": "<p>User's gender (male or female)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "status",
            "description": "<p>User's status either active or inactive</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "profilepicture",
            "description": "<p>User's profile picture(this can be multiple)</p>"
          },
          {
            "group": "Parameter",
            "type": "date",
            "optional": true,
            "field": "date",
            "description": "<p>User's date of birth</p>"
          },
          {
            "group": "Parameter",
            "type": "decimal",
            "optional": true,
            "field": "latitude",
            "description": "<p>User's Location latitude</p>"
          },
          {
            "group": "Parameter",
            "type": "decimal",
            "optional": true,
            "field": "longitude",
            "description": "<p>User's Location Longitude</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "address",
            "description": "<p>User's address</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/controllers/user.controller.js",
    "groupTitle": "User"
  },
  {
    "type": "Post",
    "url": "/api/useredit/:id",
    "title": "ApiUserEdit",
    "name": "ApiUserEdit",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "firstname",
            "description": "<p>User's First name</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "lastname",
            "description": "<p>User's Last name</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "description",
            "description": "<p>User's Description</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "gender",
            "description": "<p>User's gender (male or female)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "status",
            "description": "<p>User's status either active or inactive</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "profilepicture",
            "description": "<p>User's profile picture(this can be multiple)</p>"
          },
          {
            "group": "Parameter",
            "type": "date",
            "optional": true,
            "field": "date",
            "description": "<p>User's date of birth</p>"
          },
          {
            "group": "Parameter",
            "type": "decimal",
            "optional": true,
            "field": "latitude",
            "description": "<p>User's Location latitude</p>"
          },
          {
            "group": "Parameter",
            "type": "decimal",
            "optional": true,
            "field": "longitude",
            "description": "<p>User's Location Longitude</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "address",
            "description": "<p>User's address</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/controllers/user.controller.js",
    "groupTitle": "User"
  },
  {
    "type": "Post",
    "url": "/checkemailexist",
    "title": "Check Email Exist",
    "name": "Check_Email_Exist",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>User's Email Id</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/controllers/user.controller.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/user/delete/:id",
    "title": "Delete User",
    "name": "Delete_User",
    "group": "User",
    "version": "0.0.0",
    "filename": "server/controllers/user.controller.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/useredit/:id",
    "title": "Edit User",
    "name": "Edit_User",
    "group": "User",
    "version": "0.0.0",
    "filename": "server/controllers/user.controller.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/login",
    "title": "Login",
    "name": "Login",
    "group": "User",
    "version": "0.0.0",
    "filename": "server/controllers/user.controller.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/register",
    "title": "Register",
    "name": "Register",
    "group": "User",
    "version": "0.0.0",
    "filename": "server/controllers/user.controller.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/removeimage/:id",
    "title": "Remove Image",
    "name": "Remove_Image",
    "group": "User",
    "version": "0.0.0",
    "filename": "server/controllers/user.controller.js",
    "groupTitle": "User"
  }
] });
