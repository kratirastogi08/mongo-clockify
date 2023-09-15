const User = require("../model/user")
const Workspace = require("../model/workspace")
const Role = require("../model/role")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Auth = require("../model/auth")
const { ObjectId } = require('mongodb')
const puppeteer = require('puppeteer')
const fs = require('fs')
const ejs = require('ejs')
const path = require('path')
const signUp = async (req, res, next) => {
  try {
    let { email, phone, firstName, lastName, ...rest } = req.body
    const user = await User.findOne({
      $or: [{
        emailId: email,
      }, {
        phone
      }]
    }).exec()
    if (user) {
      return res.status(409).json({ message: "User already exists" })
    }

    const role = await Role.findOne({ roleName: "Admin" })
    const newUser = await User.create({
      ...rest,
      firstName,
      lastName,
      emailId: email,
      phone,
      roleId: role._id,
    })
    const workspace = await Workspace.create({
      workspaceName: firstName + " " + lastName,
      emailId: email,
      userIds: [newUser._id]
    })
    const data = await User.findOneAndUpdate({ _id: newUser._id }, { workspaceId: [workspace._id] }, { new: true })
    return res.status(201).json({
      message: "SIGNUP successful",
      data
    })
  }
  catch (error) {
    console.log(error)
  }
}
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ emailId: email })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }
    const token = jwt.sign({ userId: user._id, role: user.roleId }, "secret_key")
    await Auth.findOneAndRemove({ userId: user._id }).exec()
    await Auth.create({
      userId: user._id,
      token
    })
    return res.status(200).json({ message: "Login successful", token })
  }
  catch (error) {
    console.log(error)
  }
}
const addUsersToWorkspace = async (req, res, next) => {
  try {
    const { emailIds, workspaceId } = req.body
    console.log(req.body)
    const user = await User.find({ emailId: { $in: emailIds }, workspaceId })
    if (user && user.length) {
      console.log(user)
      return res.status(400).json({ message: "User already exists in the workspace", data: user })
    }
    const data = await User.find({ emailId: { $in: emailIds } })
    const emails = data.map(e => e.emailId)
    const newEmails = emailIds.filter(e => {
      if (!emails.includes(e))
        return e
    })
    if (emails && emails.length) {
      const result = await Promise.all(emails.map(async e => {
        try {
          return await User.updateOne({ emailId: e }, { $push: { workspaceId } })
        }
        catch (error) {
          console.log(error)
          throw error;
        }

      }))
      console.log(result)
    }
    if (newEmails && newEmails.length) {
      const data = newEmails.map(e => {
        return { emailId: e, workspaceId }
      })
      await User.insertMany(data)
    }


    return res.status(201).json({ message: "User added in the workspace", })

  }
  catch (error) {
    console.log(error)
    throw error
  }
}

const members = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const { type, searchTerm } = req.query;
    let obj = {}
    let array = []
    if (type) {
      switch (type) {
        case "active":
          obj["isActive"] = true
          break;
        case "inactive":
          obj["isActive"] = false
          break;
      }
    }
    if (searchTerm) {
      array = [
        {
          "firstName": { $regex: searchTerm, $options: 'i' }
        },
        {
          "lastName": { $regex: searchTerm, $options: 'i' }
        }
      ]
      obj["$or"] = array
    }
    const users = await User.aggregate([
      { $unwind: "$workspaceId" },
      { $match: { workspaceId: { $eq: new ObjectId(workspaceId) }, ...obj } },
      {
        $lookup: {
          from: "Role",
          as: "Role",
          let: { "roleId": "$roleId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$roleId"]
                }
              }
            },
            {
              $project: {
                roleName: 1
              }
            }
          ]
        }
      },

      {
        $project: {
          firstName: 1,
          lastName: 1,
          emailId: 1,
          isActive: 1,
          role: { $ifNull: [{ $arrayElemAt: ["$Role", 0] }, null] },

        }
      }

    ])
    console.log(users)
    return res.status(200).json({ message: "successfull", data: users })
  }
  catch (error) {
    console.log(error)
    throw error
  }
}
const pdf = async (req, res, next) => {
  try {

    const users = await User.find();
    //res.render("users.ejs", { content: {headers:["Email"],users} });

    (async () => {
      // launch a new chrome instance
      const browser = await puppeteer.launch({
        headless: true
      });

      const page = await browser.newPage();
      const filePathName = path.resolve(__dirname, '../views/users.ejs');

      //const html = fs.readFileSync(filePathName, 'utf8')
      const html = await ejs.renderFile(filePathName, { content: { headers: ["Email"], users } });
      await page.setContent(html);
      await page.goto("http://localhost:4000/api/v1/user/pdf" + html);
      await page.setContent(html, {
        waitUntil: 'domcontentloaded'
      });
      const random = Date.now()
      const pdf = await page.pdf({
        format: 'A4',
        path: `${__dirname}/${random}.pdf`
      });
      res.contentType("application/pdf");

      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${random}.pdf`
      );
      res.send(pdf);
    })();
  }
  catch (error) {
    console.log(error)
    throw error
  }
}

module.exports = {
  signUp,
  login,
  addUsersToWorkspace,
  members,
  pdf,
}