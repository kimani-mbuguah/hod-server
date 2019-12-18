/* eslint-disable key-spacing */

/**
 * Role permissions enum
 */
const Roles = {
  superAdmin: "SuperAdmin",
  admin: "Admin",
  member: "Member",

  // eslint-disable-next-line object-shorthand
  map: () => {
    return [
      { value: Roles.member },
      { value: Roles.admin },
      { value: Roles.superAdmin }
    ]
  },

  isValidRole: role => {
    let valid = false
    Roles.map().forEach(item => {
      if (item.value === role) valid = true
    })
    return valid
  }
}

module.exports = Roles
