const User = require("mongoose").model("User")

// GET /admin/list
// List admin, paginations options
exports.list = function(req, res, next) {
  const pageOptions = {
    page: req.query["page"] || 1,
    limit: req.query["limit"] || 1000,
    sort: req.query["sort"] || "name asc"
  }

  let filterOptions = {}
  try {
    const filterParam = req.query["filter"]
    if (Array.isArray(filterParam) && filterParam.length > 0) {
      filterParam.forEach(item => {
        filterOptions[item.id] = new RegExp(item.value, "i")
      })
    }
  } catch (err) {
    console.log("Could not parse 'filter' param " + err)
  }

  User.paginate(filterOptions, pageOptions, (err, result) => {
    if (err) {
      console.log(err)
      return res.status(500).json({
        success: false,
        errors: [JSON.stringify(err)]
      })
    }
    return res.json(result.docs)
  })
}

// GET /admin/list/:email
exports.find = (req, res) => {
  User.findOne({ email: req.params.email }).then(user => {
    if (!user) {
      return res.status(404).json({
        message: `No such admin in the records`
      })
    }

    return res.json({
      user
    })
  })
}

exports.postUpdateAuth = (req, res) => {
  User.findOne({ _id: req.body.id }).then(user => {
    if (user) {
      user
        .updateOne({ role: req.body.role, active: req.body.active })
        .then(() => {
          return res.status(200).json({
            message: "Updated successfully"
          })
        })
    }
  })
}
