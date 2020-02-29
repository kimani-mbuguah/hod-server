const AfricasTalking = require("africastalking");

const Member = require("mongoose").model("Member");
const Relationship = require("mongoose").model("Relationship");
const SmsGroup = require("mongoose").model("SmsGroup");
const { validations } = require("../../config");

const africasTalking = new AfricasTalking({
	username: "hod-mngt",
	apiKey: "274b7303b3ef866a04e8d792ec8dae4ed25692092f4b1650ab4958f2ec379c32"
});


const sms = africasTalking.SMS;

// POST /member/register
exports.postRegMember = (req, res, next) => {
	const validationResult = validateMemberRegForm(req.body);
	if (!validationResult.success) {
		return res.status(400).json(validationResult.errors);
	}

	const memberData = {
		fullName: req.body.fullName.trim(),
		phoneNumber: req.body.phoneNumber.trim(),
		occupation: req.body.occupation.trim(),
		about: req.body.about.trim(),
		ministry: req.body.ministry.trim(),
		email: req.body.email.trim(),
		city: req.body.city.trim(),
		county: req.body.county.trim()
	};
	const newMember = new Member(memberData);
	newMember
		.save()
		.then(member => {
			return res.status(200).json(member);
		})
		.catch(error => {
			if (error.name === "MongoError" && error.code === 11000) {
				return res.status(409).json({
					email: "Conflicting email found",
					phoneNumber: "Conflicting Phone number found"
				});
			}
			return res.status(400).json({
				error: error
			});
		});
};

exports.postUpdateMemberProfile = (req, res) => {
	Member.findOne({ _id: req.body.id }).then(member => {
		if (member) {
			member
				.updateOne({
					fullName: req.body.fullName,
					phoneNumber: req.body.phoneNumber,
					email: req.body.email,
					occupation: req.body.occupation,
					ministry: req.body.ministry,
					city: req.body.city,
					county: req.body.county,
					about: req.body.about,
					gender: req.body.gender,
					maritalStatus: req.body.maritalStatus,
					parentalStatus: req.body.parentalStatus,
					leadershipPosition: req.body.leadershipPosition,
					profilePic: req.body.profilePic
				})
				.then(() => {
					return res.status(200).json({
						message: "Profile updated successfully"
					});
				})
				.catch(err => {
					return res.status(400).json({
						message: "An error occurred while updating profile"
					});
				});
		}
	});
};

exports.postUpdateMemberProfilePic = (req, res) => {
	console.log(req.body);
	Member.findOne({ _id: req.body.id }).then(member => {
		if (member) {
			member
				.updateOne({
					profilePic: req.body.profilePic
				})
				.then(() => {
					return res.status(200).json({
						message: "Profile Pic updated successfully"
					});
				})
				.catch(err => {
					return res.status(400).json({
						message: "An error occurred while updating profile pic"
					});
				});
		}
	});
};
// GET /member/list
// List members, paginations options
exports.list = function(req, res, next) {
	const pageOptions = {
		page: req.query["page"] || 1,
		limit: req.query["limit"] || 1000,
		sort: req.query["sort"] || "name asc",
		populate: {
			path: "relationships",
			select: "fullName relationship",
			model: "Relationship"
		}
	};

	let filterOptions = {};
	try {
		const filterParam = req.query["filter"];
		if (Array.isArray(filterParam) && filterParam.length > 0) {
			filterParam.forEach(item => {
				filterOptions[item.id] = new RegExp(item.value, "i");
			});
		}
	} catch (err) {
		console.log("Could not parse 'filter' param " + err);
	}

	Member.paginate(filterOptions, pageOptions, (err, result) => {
		if (err) {
			console.log(err);
			return res.status(500).json({
				success: false,
				errors: [JSON.stringify(err)]
			});
		}
		return res.json(result.docs);
	});
};

exports.countMembers = (req, res) => {
	Member.countDocuments({}, function(err, count) {
		console.log("Number of docs: ", count);
		return res.status(200).json({
			count: count
		});
	}).catch(err => {
		return res.status(400).json(err);
	});
};

// GET /member/list/:email
exports.find = (req, res) => {
	Member.findOne({ email: req.params.email })
		.populate({
			path: "relationships successfulReferrals",
			select: "fullName relationship",
			model: "Relationship"
		})
		.then(member => {
			if (!member) {
				return res.status(404).json({
					email: `No such member in the records`
				});
			}

			return res.json({
				member
			});
		});
};

// GET /member/sms
// List members, paginations options
exports.membersms = (req, res, next) => {
	const pageOptions = {
		page: req.query["page"] || 1,
		limit: req.query["limit"] || 1000,
		sort: req.query["sort"] || "name asc"
	};

	let filterOptions = {};
	try {
		const filterParam = req.query["filter"];
		if (Array.isArray(filterParam) && filterParam.length > 0) {
			filterParam.forEach(item => {
				filterOptions[item.id] = new RegExp(item.value, "i");
			});
		}
	} catch (err) {
		console.log("Could not parse 'filter' param " + err);
	}

	Member.paginate(filterOptions, pageOptions, (err, result) => {
		if (err) {
			console.log(err);
			return res.status(500).json({
				success: false,
				errors: [JSON.stringify(err)]
			});
		}

		const users = result.docs;

		smsList = [];
		for (var i = 0; i < users.length; i++) {
			user = users[i];
			smsList.push({
				name: user.fullName,
				value: user.phoneNumber
			});
		}
		return res.json(smsList);
	});
};

// GET /member/listrelationship
exports.listRelationshipMembers = (req, res, next) => {
	const pageOptions = {
		page: req.query["page"] || 1,
		limit: req.query["limit"] || 1000,
		sort: req.query["sort"] || "name asc"
	};

	let filterOptions = {};
	try {
		const filterParam = req.query["filter"];
		if (Array.isArray(filterParam) && filterParam.length > 0) {
			filterParam.forEach(item => {
				filterOptions[item.id] = new RegExp(item.value, "i");
			});
		}
	} catch (err) {
		console.log("Could not parse 'filter' param " + err);
	}

	Member.paginate(filterOptions, pageOptions, (err, result) => {
		if (err) {
			console.log(err);
			return res.status(500).json({
				success: false,
				errors: [JSON.stringify(err)]
			});
		}

		const users = result.docs;

		relationshipList = [];
		for (var i = 0; i < users.length; i++) {
			user = users[i];
			relationshipList.push({
				name: user.fullName,
				value: user._id
			});
		}
		return res.json(relationshipList);
	});
};

exports.addRelationship = (req, res) => {
	const payload = req.body;
	Member.findOne({ _id: payload.member }).then(member => {
		Member.findOne({ _id: payload.relatedTo })
			.then(relatedTo => {
				const newRelationship = new Relationship({
					fullName: relatedTo.fullName,
					relationship: payload.relationship
				});

				newRelationship
					.save()
					.then(relationship => {
						member.relationships.push(relationship);
						member
							.save()
							.then(() => {
								console.log("new relationship added");
								return res.status(200).json({
									message: "Relationship added successfully"
								});
							})
							.catch(error => {
								console.log(error);
								return res.status(400).json(error);
							});
					})
					.catch(error => {
						console.log(error);
						return res.status(400).json(error);
					});
			})
			.catch(err => {
				return res.status(400).json(error);
			});
	});
};

exports.sendSms = (req, res, next) => {
	sms
		.send({
			to: req.body.to,
			from:"HOD-CHURCH",
			message: req.body.message
		})
		.then(function(response) {
			res.status(200).json({
				message: "SMS sent"
			});
		})
		.catch(error => {
			res.status(400).json({
				message: "SMS not sent"
			});
		});
};

exports.multipleSmSRecipients = (req, res) => {
	const smsRecipients = req.body.smsRecipients;
	const message = req.body.message;
	console.log(req.body);
	for (let recipient in smsRecipients) {
		sms
			.send({
				to: smsRecipients[recipient],
				message: message
			})
			.then(response => {
				console.log("sms sent");
			})
			.catch(error => {
				console.log(error);
			});
	}

	res.status(200).json({
		message: "Sending sms"
	});
};

exports.getCustomGroups = (req, res) => {
	SmsGroup.find({})
		.then(groups => {
			return res.status(200).json(groups);
		})
		.catch(err => {
			return res.status(400).json({
				error: err
			});
		});
};

exports.createCustomGroup = async (req, res) => {
	if (!req.body.members || !req.body.name) {
		return res.status(400).json({
			success: false,
			message: "One or more required fields is missing"
		});
	}

	await createMembers(req.body.members)
		.then(groupMembers => {
			const newSmsGroup = new SmsGroup({
				name: req.body.name,
				members: groupMembers
			});

			newSmsGroup
				.save()
				.then(() => {
					return res.status(200).json({
						message: "Group created successfully"
					});
				})
				.catch(err => {
					return res.status(400).json({
						error: err
					});
				});
		})
		.catch(err => {
			return res.status(400).json({
				error: err
			});
		});
};

exports.sendGroupSMS = (req, res) => {
	const group = req.body.group;
	const message = req.body.message;

	Member.find({ ministry: group }).then(members => {
		if (members) {
			for (let member in members) {
				sms
					.send({
						to: members[member].phoneNumber,
						message: message
					})
					.then(response => {
						console.log("sms sent");
					})
					.catch(error => {
						console.log(error);
					});
			}
		}
		res.status(200).json({
			message: "Sending sms"
		});
	});
};

exports.sendCustomGroupSMS = (req, res) => {
	const group = req.body.group;
	const message = req.body.message;

	console.log(req.body);

	SmsGroup.findOne({ name: group }).then(group => {
		const members = group.members;

		for (let i = 0; i < members.length; i++) {
			sms
				.send({
					to: members[i].phoneNumber,
					message: message
				})
				.then(response => {
					console.log("sms sent");
				})
				.catch(error => {
					console.log(error);
				});
		}
	});

	res.status(200).json({
		message: "Sending sms"
	});
};

const validateMemberRegForm = payload => {
	const errors = {};
	let isFormValid = true;
	let message = "";

	if (
		!payload ||
		typeof payload.email !== "string" ||
		!validations.email.regex.value.test(payload.email.trim())
	) {
		isFormValid = false;
		errors.email = validations.email.regex.message;
		errors.isEmailError = true;
	}

	if (
		!payload ||
		typeof payload.fullName !== "string" ||
		payload.fullName.trim().length === 0
	) {
		isFormValid = false;
		errors.fullName = "Member's name is required";
		errors.isFullNameError = true;
	}

	if (
		!payload ||
		typeof payload.phoneNumber !== "string" ||
		payload.phoneNumber.trim().length === 0
	) {
		isFormValid = false;
		errors.phoneNumber = "Phone number is required";
		errors.isPhoneNumberError = true;
	}

	if (
		!payload ||
		typeof payload.occupation !== "string" ||
		payload.occupation.trim().length === 0
	) {
		isFormValid = false;
		errors.occupation = "Occupation is required";
		errors.isOccupationError = true;
	}

	if (
		!payload ||
		typeof payload.ministry !== "string" ||
		payload.ministry.trim().length === 0
	) {
		isFormValid = false;
		errors.ministry = "Ministry is required";
		errors.isMinistryError = true;
	}

	if (
		!payload ||
		typeof payload.city !== "string" ||
		payload.city.trim().length === 0
	) {
		isFormValid = false;
		errors.city = "Town/city of residence is required";
		errors.isCityError = true;
	}

	if (
		!payload ||
		typeof payload.county !== "string" ||
		payload.county.trim().length === 0
	) {
		isFormValid = false;
		errors.county = "County of residence is required";
		errors.isCountyError = true;
	}

	if (
		!payload ||
		typeof payload.about !== "string" ||
		payload.about.trim().length === 0
	) {
		isFormValid = false;
		errors.about = "Member's Bio is required";
		errors.isAboutError = true;
	}

	if (!isFormValid) {
		message = "Check the form for errors.";
	}

	return {
		success: isFormValid,
		message,
		errors
	};
};

const createMembers = async phoneNumbers => {
	return new Promise(async (resolve, reject) => {
		const groupMembers = [];
		for (let i = 0; i < phoneNumbers.length; i++) {
			await Member.findOne({ phoneNumber: phoneNumbers[i] })
				.then(member => {
					groupMembers.push({
						name: member.fullName,
						phoneNumber: member.phoneNumber
					});
				})
				.catch(err => {
					console.log(err);
				});
		}

		if (groupMembers.length > 0) {
			resolve(groupMembers);
		} else {
			reject("no members");
		}
	});
};
