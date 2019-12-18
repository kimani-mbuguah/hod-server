const Money = require("mongoose").model("Money")
const WeeklyIn = require("mongoose").model("WeeklyIn")
const YearlyIn = require("mongoose").model("YearlyIn")
const WeeklyOut = require("mongoose").model("WeeklyOut")
const YearlyOut = require("mongoose").model("YearlyOut")
const Fund = require("mongoose").model("Fund")

// POST /money/in
exports.postMoneyIn = (req, res) => {
  const validationResult = validateFundsInput(req.body)
  if (!validationResult.success) {
    return res.status(400).json(validationResult.errors)
  }

  const fundsInData = req.body
  const newMoney = new Money({
    amount: Number(fundsInData.amount),
    from: fundsInData.from,
    purpose: fundsInData.purpose,
    type: fundsInData.type
  })

  newMoney.save().then(moneyIn => {
    saveWeeklyIn(fundsInData)
    saveYearlyIn(fundsInData)

    Fund.findOne({ tag: "hod" }).then(fund => {
      if (fund) {
        console.log(fund)
        fund
          .updateOne({
            totalIn: Number(fund.totalIn + Number(fundsInData.amount))
          })
          .then(() => {
            console.log("done")
          })
          .catch(error => {
            console.log(error)
          })
      } else {
        const newFund = new Fund({
          totalIn: Number(fundsInData.amount)
        })

        newFund.save()
      }
    })

    return res.status(200).json({
      message: "Funds in recorded successully"
    })
  })
}

// POST /money/out
exports.postMoneyOut = (req, res) => {
  const validationResult = validateFundsInput(req.body)
  if (!validationResult.success) {
    return res.status(400).json(validationResult.errors)
  }
  const fundsOutData = req.body
  const newMoney = new Money({
    amount: Number(fundsOutData.amount),
    from: fundsOutData.from,
    purpose: fundsOutData.purpose,
    type: fundsOutData.type
  })

  newMoney.save().then(moneyIn => {
    saveWeeklyOut(fundsOutData)
    saveYearlyOut(fundsOutData)

    Fund.findOne({ tag: "hod" }).then(fund => {
      if (fund) {
        console.log(fund)
        fund
          .updateOne({
            totalOut: Number(fund.totalOut + Number(fundsOutData.amount))
          })
          .then(() => {
            console.log("done")
          })
          .catch(error => {
            console.log(error)
          })
      } else {
        const newFund = new Fund({
          totalOut: Number(fundsOutData.amount)
        })

        newFund.save()
      }
    })

    return res.status(200).json({
      message: "Funds out recorded successully"
    })
  })
}

exports.getMoneyList = async (req, res) => {
  await Money.find({}).then(money => {
    if (money) {
      res.status(200).json(money)
    }
  })
}

exports.getMoneyData = async (req, res) => {
  const today = new Date()
  const weekResult = getWeekNumber(today)
  const currentYear = today.getFullYear()
  let success = false

  let weeklyIn, yearlyIn, weeklyOut, yearlyOut, pieData

  await WeeklyIn.find({ weekNumber: weekResult[1] }).then(weeklyin => {
    weeklyIn = weeklyin
    success = true
  })

  await YearlyIn.find({ year: currentYear }).then(yearlyin => {
    yearlyIn = yearlyin
    success = true
  })

  await WeeklyOut.find({ weekNumber: weekResult[1] }).then(weeklyout => {
    weeklyOut = weeklyout
    success = true
  })

  await YearlyOut.find({ year: currentYear }).then(yearlyout => {
    yearlyOut = yearlyout
    success = true
  })

  await Fund.findOne({ tag: "hod" }).then(fund => {
    pieData = fund
    success = true
  })

  if (success) {
    return res.status(200).json({
      weeklyIn: weeklyIn,
      yearlyIn: yearlyIn,
      weeklyOut: weeklyOut,
      yearlyOut: yearlyOut,
      pieData: pieData
    })
  } else {
    return res.status(400).json({
      message: "An error occurred while querying the database"
    })
  }
}

const getWeekNumber = d => {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  let yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  let weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7)
  return [d.getUTCFullYear(), weekNo]
}

const saveWeeklyIn = payload => {
  const weekdays = new Array(7)
  weekdays[0] = "sun"
  weekdays[1] = "mon"
  weekdays[2] = "tue"
  weekdays[3] = "wed"
  weekdays[4] = "thur"
  weekdays[5] = "fri"
  weekdays[6] = "sat"
  const d = new Date()
  const todayName = weekdays[d.getDay()]
  const weekResult = getWeekNumber(d)
  let newWeeklyIn
  WeeklyIn.findOne({ weekNumber: weekResult[1] }).then(weeklyin => {
    if (!weeklyin) {
      if (todayName === "sun") {
        newWeeklyIn = new WeeklyIn({
          sun: Number(payload.amount),
          weekNumber: weekResult[1]
        })
      } else if (todayName === "mon") {
        newWeeklyIn = new WeeklyIn({
          mon: Number(payload.amount),
          weekNumber: weekResult[1]
        })
      } else if (todayName === "tue") {
        newWeeklyIn = new WeeklyIn({
          tue: Number(payload.amount),
          weekNumber: weekResult[1]
        })
      } else if (todayName === "wed") {
        newWeeklyIn = new WeeklyIn({
          wed: Number(payload.amount),
          weekNumber: weekResult[1]
        })
      } else if (todayName === "thur") {
        newWeeklyIn = new WeeklyIn({
          thur: Number(payload.amount),
          weekNumber: weekResult[1]
        })
      } else if (todayName === "fri") {
        newWeeklyIn = new WeeklyIn({
          fri: Number(payload.amount),
          weekNumber: weekResult[1]
        })
      } else if (todayName === "sat") {
        newWeeklyIn = new WeeklyIn({
          sat: Number(payload.amount),
          weekNumber: weekResult[1]
        })
      }

      newWeeklyIn.save().then(() => {
        console.log("saved new weekly in")
      })
    } else {
      if (todayName === "sun") {
        const updatedIn = weeklyin.sun + Number(payload.amount)
        weeklyin.updateOne({ sun: updatedIn }).then(() => {
          console.log("updated weekly in record")
        })
      } else if (todayName === "mon") {
        const updatedIn = weeklyin.mon + Number(payload.amount)
        weeklyin.updateOne({ mon: updatedIn }).then(() => {
          console.log("updated weekly in record")
        })
      } else if (todayName === "tue") {
        const updatedIn = weeklyin.tue + Number(payload.amount)
        weeklyin.updateOne({ tue: updatedIn }).then(() => {
          console.log("updated weekly in record")
        })
      } else if (todayName === "wed") {
        const updatedIn = weeklyin.wed + Number(payload.amount)
        weeklyin.updateOne({ wed: updatedIn }).then(() => {
          console.log("updated weekly in record")
        })
      } else if (todayName === "thur") {
        const updatedIn = weeklyin.thur + Number(payload.amount)
        weeklyin.updateOne({ thur: updatedIn }).then(() => {
          console.log("updated weekly in record")
        })
      } else if (todayName === "fri") {
        const updatedIn = weeklyin.fri + Number(payload.amount)
        weeklyin.updateOne({ fri: updatedIn }).then(() => {
          console.log("updated weekly in record")
        })
      } else if (todayName === "sat") {
        const updatedIn = weeklyin.sat + Number(payload.amount)
        weeklyin.updateOne({ sat: updatedIn }).then(() => {
          console.log("updated weekly in record")
        })
      }
    }
  })
}
const saveYearlyIn = payload => {
  const monthNames = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec"
  ]

  const d = new Date()
  const currentMonth = monthNames[d.getMonth()]

  YearlyIn.findOne({ year: d.getFullYear() }).then(yearlyin => {
    if (yearlyin) {
      if (currentMonth == "jan") {
        yearlyin
          .updateOne({ jan: yearlyin.jan + Number(payload.amount) })
          .then(() => {
            console.log("yearly in updated")
          })
      } else if (currentMonth == "feb") {
        yearlyin
          .updateOne({ feb: yearlyin.feb + Number(payload.amount) })
          .then(() => {
            console.log("yearly in updated")
          })
      } else if (currentMonth == "mar") {
        yearlyin
          .updateOne({ mar: yearlyin.mar + Number(payload.amount) })
          .then(() => {
            console.log("yearly in updated")
          })
      } else if (currentMonth == "apr") {
        yearlyin
          .updateOne({ apr: yearlyin.apr + Number(payload.amount) })
          .then(() => {
            console.log("yearly in updated")
          })
      } else if (currentMonth == "may") {
        yearlyin
          .updateOne({ may: yearlyin.may + Number(payload.amount) })
          .then(() => {
            console.log("yearly in updated")
          })
      } else if (currentMonth == "jun") {
        yearlyin
          .updateOne({ jun: yearlyin.jun + Number(payload.amount) })
          .then(() => {
            console.log("yearly in updated")
          })
      } else if (currentMonth == "jul") {
        yearlyin
          .updateOne({ jul: yearlyin.jul + Number(payload.amount) })
          .then(() => {
            console.log("yearly in updated")
          })
      } else if (currentMonth == "aug") {
        yearlyin
          .updateOne({ aug: yearlyin.aug + Number(payload.amount) })
          .then(() => {
            console.log("yearly in updated")
          })
      } else if (currentMonth == "sep") {
        yearlyin
          .updateOne({ sep: yearlyin.sep + Number(payload.amount) })
          .then(() => {
            console.log("yearly in updated")
          })
      } else if (currentMonth == "oct") {
        yearlyin
          .updateOne({ oct: yearlyin.oct + Number(payload.amount) })
          .then(() => {
            console.log("yearly in updated")
          })
      } else if (currentMonth == "nov") {
        yearlyin
          .updateOne({ nov: yearlyin.nov + Number(payload.amount) })
          .then(() => {
            console.log("yearly in updated")
          })
      } else if (currentMonth == "dec") {
        yearlyin
          .updateOne({ dec: yearlyin.dec + Number(payload.amount) })
          .then(() => {
            console.log("yearly in updated")
          })
      }
    } else {
      let newYearlyIn
      console.log("creating new yearly in")
      if (currentMonth === "jan") {
        newYearlyIn = new YearlyIn({
          jan: Number(payload.amount),
          year: d.getFullYear()
        })
      } else if (currentMonth === "feb") {
        newYearlyIn = new YearlyIn({
          feb: Number(payload.amount),
          year: d.getFullYear()
        })
      } else if (currentMonth === "mar") {
        newYearlyIn = new YearlyIn({
          mar: Number(payload.amount),
          year: d.getFullYear()
        })
      } else if (currentMonth === "apr") {
        newYearlyIn = new YearlyIn({
          apr: Number(payload.amount),
          year: d.getFullYear()
        })
      } else if (currentMonth === "may") {
        newYearlyIn = new YearlyIn({
          may: Number(payload.amount),
          year: d.getFullYear()
        })
      } else if (currentMonth === "jun") {
        newYearlyIn = new YearlyIn({
          jun: Number(payload.amount),
          year: d.getFullYear()
        })
      } else if (currentMonth === "jul") {
        newYearlyIn = new YearlyIn({
          jul: Number(payload.amount),
          year: d.getFullYear()
        })
      } else if (currentMonth === "aug") {
        newYearlyIn = new YearlyIn({
          aug: Number(payload.amount),
          year: d.getFullYear()
        })
      } else if (currentMonth === "sep") {
        newYearlyIn = new YearlyIn({
          sep: Number(payload.amount),
          year: d.getFullYear()
        })
      } else if (currentMonth === "oct") {
        newYearlyIn = new YearlyIn({
          oct: Number(payload.amount),
          year: d.getFullYear()
        })
      } else if (currentMonth === "nov") {
        newYearlyIn = new YearlyIn({
          nov: Number(payload.amount),
          year: d.getFullYear()
        })
      } else if (currentMonth === "dec") {
        newYearlyIn = new YearlyIn({
          dec: Number(payload.amount),
          year: d.getFullYear()
        })
      }

      newYearlyIn
        .save()
        .then(() => {
          console.log("annual record created")
        })
        .catch(error => {
          console.log(error)
        })
    }
  })
}

// Money out

const saveWeeklyOut = payload => {
  const weekdays = new Array(7)
  weekdays[0] = "sun"
  weekdays[1] = "mon"
  weekdays[2] = "tue"
  weekdays[3] = "wed"
  weekdays[4] = "thur"
  weekdays[5] = "fri"
  weekdays[6] = "sat"
  const d = new Date()
  const todayName = weekdays[d.getDay()]
  const weekResult = getWeekNumber(d)
  let newWeeklyOut
  WeeklyOut.findOne({ weekNumber: weekResult[1] }).then(weeklyout => {
    if (!weeklyout) {
      if (todayName === "sun") {
        newWeeklyOut = new WeeklyOut({
          sun: Number(payload.amount),
          weekNumber: weekResult[1]
        })
      } else if (todayName === "mon") {
        newWeeklyOut = new WeeklyOut({
          mon: Number(payload.amount),
          weekNumber: weekResult[1]
        })
      } else if (todayName === "tue") {
        newWeeklyOut = new WeeklyOut({
          tue: Number(payload.amount),
          weekNumber: weekResult[1]
        })
      } else if (todayName === "wed") {
        newWeeklyOut = new WeeklyOut({
          wed: Number(payload.amount),
          weekNumber: weekResult[1]
        })
      } else if (todayName === "thur") {
        newWeeklyOut = new WeeklyOut({
          thur: Number(payload.amount),
          weekNumber: weekResult[1]
        })
      } else if (todayName === "fri") {
        newWeeklyOut = new WeeklyOut({
          fri: Number(payload.amount),
          weekNumber: weekResult[1]
        })
      } else if (todayName === "sat") {
        newWeeklyOut = new WeeklyOut({
          sat: Number(payload.amount),
          weekNumber: weekResult[1]
        })
      }

      newWeeklyOut.save().then(() => {
        console.log("saved new weekly in")
      })
    } else {
      if (todayName === "sun") {
        const updatedIn = weeklyout.sun + Number(payload.amount)
        weeklyout.updateOne({ sun: updatedIn }).then(() => {
          console.log("updated weekly in record")
        })
      } else if (todayName === "mon") {
        const updatedIn = weeklyout.mon + Number(payload.amount)
        weeklyout.updateOne({ mon: updatedIn }).then(() => {
          console.log("updated weekly in record")
        })
      } else if (todayName === "tue") {
        const updatedIn = weeklyout.tue + Number(payload.amount)
        weeklyout.updateOne({ tue: updatedIn }).then(() => {
          console.log("updated weekly in record")
        })
      } else if (todayName === "wed") {
        const updatedIn = weeklyout.wed + Number(payload.amount)
        weeklyout.updateOne({ wed: updatedIn }).then(() => {
          console.log("updated weekly in record")
        })
      } else if (todayName === "thur") {
        const updatedIn = weeklyout.thur + Number(payload.amount)
        weeklyout.updateOne({ thur: updatedIn }).then(() => {
          console.log("updated weekly in record")
        })
      } else if (todayName === "fri") {
        const updatedIn = weeklyout.fri + Number(payload.amount)
        weeklyout.updateOne({ fri: updatedIn }).then(() => {
          console.log("updated weekly in record")
        })
      } else if (todayName === "sat") {
        const updatedIn = weeklyout.sat + Number(payload.amount)
        weeklyout.updateOne({ sat: updatedIn }).then(() => {
          console.log("updated weekly in record")
        })
      }
    }
  })
}

const saveYearlyOut = payload => {
  const monthNames = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec"
  ]

  const d = new Date()
  const currentMonth = monthNames[d.getMonth()]

  YearlyOut.findOne({ year: d.getFullYear() }).then(yearlyout => {
    if (yearlyout) {
      if (currentMonth == "jan") {
        yearlyout
          .updateOne({ jan: yearlyout.jan + Number(payload.amount) })
          .then(() => {
            console.log("yearly in updated")
          })
      } else if (currentMonth == "feb") {
        yearlyout
          .updateOne({ feb: yearlyout.feb + Number(payload.amount) })
          .then(() => {
            console.log("yearly in updated")
          })
      } else if (currentMonth == "mar") {
        yearlyout
          .updateOne({ mar: yearlyout.mar + Number(payload.amount) })
          .then(() => {
            console.log("yearly in updated")
          })
      } else if (currentMonth == "apr") {
        yearlyout
          .updateOne({ apr: yearlyout.apr + Number(payload.amount) })
          .then(() => {
            console.log("yearly in updated")
          })
      } else if (currentMonth == "may") {
        yearlyout
          .updateOne({ may: yearlyout.may + Number(payload.amount) })
          .then(() => {
            console.log("yearly in updated")
          })
      } else if (currentMonth == "jun") {
        yearlyout
          .updateOne({ jun: yearlyout.jun + Number(payload.amount) })
          .then(() => {
            console.log("yearly in updated")
          })
      } else if (currentMonth == "jul") {
        yearlyout
          .updateOne({ jul: yearlyout.jul + Number(payload.amount) })
          .then(() => {
            console.log("yearly in updated")
          })
      } else if (currentMonth == "aug") {
        yearlyout
          .updateOne({ aug: yearlyout.aug + Number(payload.amount) })
          .then(() => {
            console.log("yearly in updated")
          })
      } else if (currentMonth == "sep") {
        yearlyout
          .updateOne({ sep: yearlyout.sep + Number(payload.amount) })
          .then(() => {
            console.log("yearly in updated")
          })
      } else if (currentMonth == "oct") {
        yearlyout
          .updateOne({ oct: yearlyout.oct + Number(payload.amount) })
          .then(() => {
            console.log("yearly in updated")
          })
      } else if (currentMonth == "nov") {
        yearlyout
          .updateOne({ nov: yearlyout.nov + Number(payload.amount) })
          .then(() => {
            console.log("yearly in updated")
          })
      } else if (currentMonth == "dec") {
        yearlyout
          .updateOne({ dec: yearlyout.dec + Number(payload.amount) })
          .then(() => {
            console.log("yearly in updated")
          })
      }
    } else {
      let newYearlyOut
      console.log("creating new yearly out")
      if (currentMonth === "jan") {
        newYearlyOut = new YearlyOut({
          jan: Number(payload.amount),
          year: d.getFullYear()
        })
      } else if (currentMonth === "feb") {
        newYearlyOut = new YearlyOut({
          feb: Number(payload.amount),
          year: d.getFullYear()
        })
      } else if (currentMonth === "mar") {
        newYearlyOut = new YearlyOut({
          mar: Number(payload.amount),
          year: d.getFullYear()
        })
      } else if (currentMonth === "apr") {
        newYearlyOut = new YearlyOut({
          apr: Number(payload.amount),
          year: d.getFullYear()
        })
      } else if (currentMonth === "may") {
        newYearlyOut = new YearlyOut({
          may: Number(payload.amount),
          year: d.getFullYear()
        })
      } else if (currentMonth === "jun") {
        newYearlyOut = new YearlyOut({
          jun: Number(payload.amount),
          year: d.getFullYear()
        })
      } else if (currentMonth === "jul") {
        newYearlyOut = new YearlyOut({
          jul: Number(payload.amount),
          year: d.getFullYear()
        })
      } else if (currentMonth === "aug") {
        newYearlyOut = new YearlyOut({
          aug: Number(payload.amount),
          year: d.getFullYear()
        })
      } else if (currentMonth === "sep") {
        newYearlyOut = new YearlyOut({
          sep: Number(payload.amount),
          year: d.getFullYear()
        })
      } else if (currentMonth === "oct") {
        newYearlyOut = new YearlyOut({
          oct: Number(payload.amount),
          year: d.getFullYear()
        })
      } else if (currentMonth === "nov") {
        newYearlyOut = new YearlyOut({
          nov: Number(payload.amount),
          year: d.getFullYear()
        })
      } else if (currentMonth === "dec") {
        newYearlyOut = new YearlyOut({
          dec: Number(payload.amount),
          year: d.getFullYear()
        })
      }

      newYearlyOut
        .save()
        .then(() => {
          console.log("annual record created")
        })
        .catch(error => {
          console.log(error)
        })
    }
  })
}

const validateFundsInput = payload => {
  const errors = {}
  let isFormValid = true
  let message = ""

  if (
    !payload ||
    typeof payload.amount !== "string" ||
    payload.amount.trim().length < 1
  ) {
    isFormValid = false
    errors.amount = "Amount is required"
    errors.isAmountError = true
  }

  if (
    !payload ||
    typeof payload.from !== "string" ||
    payload.from.trim().length < 1
  ) {
    isFormValid = false
    errors.from = "From is required"
    errors.isFromError = true
  }

  if (
    !payload ||
    typeof payload.purpose !== "string" ||
    payload.purpose.trim().length < 1
  ) {
    isFormValid = false
    errors.purpose = "Purpose is required"
    errors.isPurposeError = true
  }

  if (!isFormValid) {
    message = "Check the form for errors."
  }

  return {
    success: isFormValid,
    message,
    errors
  }
}
