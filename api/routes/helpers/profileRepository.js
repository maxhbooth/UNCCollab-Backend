/* ORM layer to connect backend to the database using sequelize
 * Has all functions needed connect profiles with attributes in attribute repository
 * Created/edited by MB, AC, MW, MSW
 * Includes models: profile, profile_specialty, profile_degree, profile_department, profile_facility, profile_skill
 */

const async = require('asyncawait/async');
const await = require('asyncawait/await');
//asyncawait walkthrough at https://www.npmjs.com/package/asyncawait
const Sequelize = require('sequelize');

const profile = require('../../../models/profile');
const profile_degree = require('../../../models/profile_degree');
const profile_department = require('../../../models/profile_department');
const profile_facility = require('../../../models/profile_facility');
const profile_skill = require('../../../models/profile_skill');
const profile_specialty = require('../../../models/profile_specialty');

const AttrRepository = require('./attributeRepository');

var profileRepository = function profileRepository(){

    this.attrRepository = new AttrRepository();

    this.profileSpecialty = profile_specialty;
    this.profileDegree = profile_degree;
    this.profileDepartment = profile_department;
    this.profileFacility = profile_facility;
    this.profileSkill = profile_skill;
    this.profile = profile;

    //create many-to-many relation between profile and skill.
    this.profile.belongsToMany(
        this.attrRepository.specialty, {through: {
                model: this.profileSpecialty,
                unique: true
            },
            foreignKey: 'profile_id',
            constraints: false});

    this.attrRepository.specialty.belongsToMany(
        this.profile, {through: {
                model: this.profileSpecialty,
                unique: true
            },
            foreignKey: 'specialty_id',
            constraints: false});

    this.profile.belongsToMany(
        this.attrRepository.skill, {through: {
                model: this.profileSkill,
                unique: true
            },
            foreignKey: 'profile_id',
            constraints: false});

    this.attrRepository.skill.belongsToMany(
        this.profile, {through: {
                model: this.profileSkill,
                unique: true
            },
            foreignKey: 'skill_id',
        constraints: false});

    this.profile.belongsToMany(
        this.attrRepository.department, {through: {
                model: this.profileDepartment,
                unique: true
            },
            foreignKey: 'profile_id',
            constraints: false});

    this.attrRepository.department.belongsToMany(
        this.profile, {through: {
                model: this.profileDepartment,
                unique: true
            },
            foreignKey: 'department_id',
            constraints: false});

    this.profile.belongsToMany(
        this.attrRepository.facility, {through: {
                model: this.profileFacility,
                unique: true
            },
            foreignKey: 'profile_id',
            constraints: false});

    this.attrRepository.facility.belongsToMany(
        this.profile, {through: {
                model: this.profileFacility,
                unique: true
            },
            foreignKey: 'facility_id',
            constraints: false});
};


// =====================================================================================================================
// ADD ATTRIBUTE TO PROFILE
// =====================================================================================================================
profileRepository.prototype.addProfileDegree = async(function (profileId, degreeName, disciplineName) {
        let degreeId = await(this.attrRepository.getDegreeId(degreeName));
        let disciplineId = await(this.attrRepository.getDisciplineId(disciplineName));
    if(degreeId!=null && disciplineId!= null) {
                this.profileDegree.findOrCreate({
                    where: {
                        profile_id: profileId,
                        degree_id: degreeId,
                        discipline_id: disciplineId
                    },
                    defaults: {
                        profile_id: profileId,
                        degree_id: degreeId,
                        discipline_id: disciplineId
                    }
                    })
                    .catch(error => {
                        console.log(error);
                    });
        }
    return 0;
});

profileRepository.prototype.addProfileDepartment = async(function (profileId, departmentName) {
    let departmentId = await(this.attrRepository.getDepartmentId(departmentName));
    if(departmentId != null){
        this.profileDepartment.findOrCreate({
            where: {
                profile_id: profileId,
                department_id: departmentId
            },
            default: {
                profile_id: profileId,
                department_id: departmentId
            }
        })
            .catch(error => {
                //db errors
                console.log(error);
            });
    }
    return 0;
});

profileRepository.prototype.addProfileFacility = async(function (profileId, facilityName) {
    let facilityId = await(this.attrRepository.getFacilityId(facilityName));

    if(facilityId !=null){
        this.profileFacility.findOrCreate({
            where: {
                profile_id: profileId,
                facility_id: facilityId
            },
            default: {
                profile_id: profileId,
                facility_id: facilityId
            }
        })
            .catch(error => {
            //db errors
            console.log(error);
    });
    }

    return 0;
});

profileRepository.prototype.addProfileFacilityById = async(function (profileId, facilityId) {
    if(facilityId !=null){
        this.profileFacility.findOrCreate({
            where: {
                profile_id: profileId,
                facility_id: facilityId
            },
            default: {
                profile_id: profileId,
                facility_id: facilityId
            }
        })
            .catch(error => {
            //db errors
            console.log(error);
    });
    }

    return 0;
});

profileRepository.prototype.addProfileSpecialty = async(function (profileId, specialtyName) {
    let specialty = await(this.attrRepository.specialty.findOne({where: {name: specialtyName}}));
        if(specialty != null && specialty.id !=null) {
            this.profileSpecialty.findOrCreate({
                where: {
                    profile_id: profileId,
                    specialty_id: specialty.id
                },
                default: {
                    profile_id: profileId,
                    specialty_id: specialty.id
                }
            }).catch(error => {
                console.log(error);
            });
        }
    return 0;
});

profileRepository.prototype.addProfileSpecialtyById = async(function (profileId, specialtyId) {
    let specialty = await(this.attrRepository.specialty.findOne({where: {id: specialtyId}}));
    var wait;
    if(specialty.id !=null) {
        wait = await(this.profileSpecialty.findOrCreate({
            where: {
                profile_id: profileId,
                specialty_id: specialty.id
            },
            default: {
                profile_id: profileId,
                specialty_id: specialty.id
            }
        }).catch(error => {
            console.log(error);
    }));
    }
    return wait;
});

profileRepository.prototype.addProfileSkill = async(function (profileId, skillName) {
    let skillId = await(this.attrRepository.getSkillId(skillName));

    if(skillId != null){
        this.profileSkill.findOrCreate({
            where: {
                profile_id: profileId,
                skill_id: skillId
            },
            default: {
                profile_id: profileId,
                skill_id: skillId
            }
        })
            .catch(error => {
                //db errors
                console.log(error);
            });
    }

    return 0;
});

profileRepository.prototype.addProfileSkillById = async(function (profileId, skillId) {
    if(skillId != null){
        this.profileSkill.findOrCreate({
            where: {
                profile_id: profileId,
                skill_id: skillId
            },
            default: {
                profile_id: profileId,
                skill_id: skillId
            }
        })
            .catch(error => {
            //db errors
            console.log(error);
    });
    }

    return 0;
});

profileRepository.prototype.addAdmin = async(function(profileEmail){
   this.profile.update(
        {admin: true},
        {where: {email: profileEmail}}
   ).catch(error => {
        console.log(error);});
});

profileRepository.prototype.removeAdmin = async(function(profileEmail){
    this.profile.update(
        {admin: false},
        {where: {email: profileEmail}}
    ).catch(error => {
        console.log(error);});
});

// =====================================================================================================================
// UPDATE ATTRIBUTE OF PROFILE
// =====================================================================================================================
profileRepository.prototype.updatePosition = async(function(profileID, positionName){
    let positionId = await(this.attrRepository.getPositionId(positionName));
    this.profile.update(
        {position: positionId},
        {where: {id: profileID}}
    ).catch(error => {
        console.log(error);});
});

profileRepository.prototype.updateName = async(function(profileID, firstName, lastName){
    this.profile.update(
        {first_name: firstName, last_name: lastName},
        {where: {id: profileID}}
    ).catch(error => {console.log(error);});
});

profileRepository.prototype.updateIntro = async(function(profileID, intro){
    this.profile.update(
        {intro: intro},
        {where: {id: profileID}}
    ).catch(error => {console.log(error);});
});

profileRepository.prototype.updatePronouns = async(function(profileID, pronouns){
    this.profile.update(
        {pronouns: pronouns},
        {where: {id: profileID}}
    ).catch(error => {console.log(error);});
});

profileRepository.prototype.updateInfo = async(function(profileID, positionName, firstName, lastName, pronouns,
                                                        website, phone, availability, departments){
    let positionId = await(this.attrRepository.getPositionId(positionName));
    this.profile.update(
        {position: positionId, first_name: firstName, last_name: lastName, pronouns: pronouns,
        website: website, phone_number: phone, availability: availability},
        {where: {id: profileID}}
    ).catch(error => {console.log(error);});

    let departments_now = await(this.attrRepository.department.findAll({
        include: [{
            model: this.profile,
            where: {id: profileID},
            through: {}
        }]
    }));
    if(departments_now != null) {
        for (var i = 0; i < departments_now.length; i++) {
            this.removeProfileDepartment(profileID, departments_now[i].name);
        }
    }

    if(Array.isArray(departments)){
        for(i = 0; i < departments.length; i++){
            this.addProfileDepartment(profileID, departments[i]);
        }
    }else{
        this.addProfileDepartment(profileID, departments);
    }
});

profileRepository.prototype.addImage = async(function(profileId, imagePath){

    this.profile.update(
        {imagepath : imagePath},
        {where : {id : profileId}}
    );

    return 0;
});

// =====================================================================================================================
// REMOVE ATTRIBUTE FROM PROFILE
// =====================================================================================================================
profileRepository.prototype.removeProfileDegree = async(function (profileId, degreeName, disciplineName) {
    let degreeId = await(this.attrRepository.getDegreeId(degreeName));
    let disciplineId = await(this.attrRepository.getDisciplineId(disciplineName));
    if(degreeId!=null && disciplineId!= null) {
        this.profileDegree.destroy({
            where: {
                profile_id: profileId,
                degree_id: degreeId,
                discipline_id: disciplineId
            }
        })
            .catch(error => {
            console.log(error);
    });
    }
    return 0;
});

profileRepository.prototype.removeProfileDepartment = async(function (profileID, departmentName){
    let departmentID = await(this.attrRepository.getDepartmentId(departmentName));
    if(departmentID != null){
        this.profileDepartment.destroy({
            where: {
                profile_id: profileID,
                department_id: departmentID
            }
        })
            .catch(error => {
            console.log(error);
    });
    }
    return 0;
});

profileRepository.prototype.removeProfileFacility = async(function (profileID, facilityName){
    let facilityID = await(this.attrRepository.getFacilityId(facilityName));
    if(facilityID != null){
        this.profileFacility.destroy({
            where: {
                profile_id: profileID,
                facility_id: facilityID
            }
        })
            .catch(error => {
            console.log(error);
    });
    }
    return 0;
});

profileRepository.prototype.removeProfileFacilityById = async(function (profileID, facilityID){
    if(facilityID != null){
        this.profileFacility.destroy({
            where: {
                profile_id: profileID,
                facility_id: facilityID
            }
        })
            .catch(error => {
            console.log(error);
    });
    }
    return 0;
});

profileRepository.prototype.removeProfileSkill = async(function (profileID, skillName){
    let skillID = await(this.attrRepository.getSkillId(skillName));
    if(skillID != null){
        this.profileSkill.destroy({
            where: {
                profile_id: profileID,
                skill_id: skillID
            }
        })
            .catch(error => {
            console.log(error);
    });
    }
    return 0;
});

profileRepository.prototype.removeProfileSkillById = async(function (profileID, skillID){
    if(skillID != null){
        this.profileSkill.destroy({
            where: {
                profile_id: profileID,
                skill_id: skillID
            }
        })
            .catch(error => {
            console.log(error);
    });
    }
    return 0;
});

profileRepository.prototype.removeProfileSpecialty = async(function (profileID, specialtyName){
    let specialty = await(this.attrRepository.specialty.findOne({where: {name: specialtyName}}));
    if(specialty.id != null){
        this.profileSpecialty.destroy({
            where: {
                profile_id: profileID,
                specialty_id: specialty.id
            }
        })
            .catch(error => {
            console.log(error);
    });
    }
    return 0;
});

profileRepository.prototype.removeProfileSpecialtyById = async(function(profileID, specialtyID) {
    let specialty = await(this.attrRepository.specialty.findOne({where: {id: specialtyID}}));
    if(specialty.id != null){
        this.profileSpecialty.destroy({
            where: {
                profile_id: profileID,
                specialty_id: specialty.id
            }
        })
            .catch(error => {
            console.log(error);
    });
    }
    return 0;
});


//not using right now.
// =====================================================================================================================
// METHODS FOR ENTIRE PROFILE
// =====================================================================================================================
profileRepository.prototype.createProfile = async(function
    (first, last, degreeName, departmentName, disciplineName,
     positionName, facilityName, skillName, specialtyName, email, password, hidden_token,
     confirmed_user, password_token, intro, pronouns, website, phone, availability) {

    let positionId = await(this.attrRepository.getPositionId(positionName));

    let profile = await(this.profile.create({
        first_name: first,
        last_name: last,
        position: positionId,
        email: email,
        password: password,
        hidden_token: hidden_token,
        confirmed_user: confirmed_user,
        password_token: password_token,
        intro: intro,
        pronouns: pronouns,
        website: website,
        phone_number: phone,
        availability: availability,
        admin: false
    }, {
        returning: true,
        plain: true}).catch(errors => {
            errors.errors.forEach(function(error){//only actually catches first error
            throw new Error(error.message);
        });
    }));

    let profileId = profile.id;
    var i;
    if(Array.isArray(degreeName) && Array.isArray(disciplineName)){
        var min = Math.min(degreeName.length, disciplineName.length);
        for(i = 0; i < min; i++){
            this.addProfileDegree(profileId, degreeName[i], disciplineName[i]);
        }
    }else if(Array.isArray(degreeName) && !Array.isArray(disciplineName)){
        this.addProfileDegree(profileId, degreeName[0], disciplineName);
    }else if(!Array.isArray(degreeName) && Array.isArray(disciplineName)){
        this.addProfileDegree(profileId, degreeName, disciplineName[0]);
    }else{
        this.addProfileDegree(profileId, degreeName, disciplineName);
    }
    if(Array.isArray(departmentName)){
        for(i = 0; i < departmentName.length; i++){
            this.addProfileDepartment(profileId, departmentName[i]);
        }
    }else{
        this.addProfileDepartment(profileId, departmentName);
    }
    if(Array.isArray(facilityName)){
        for(i = 0; i < facilityName.length; i++){
            this.addProfileFacility(profileId, facilityName[i]);
        }
    }else{
        this.addProfileFacility(profileId, facilityName);
    }
    if(Array.isArray(specialtyName)){
        for(i = 0; i < specialtyName.length; i++){
            this.addProfileSpecialty(profileId, specialtyName[i]);
        }
    }else {
        this.addProfileSpecialty(profileId, specialtyName);
    }
    if(Array.isArray(skillName)){
        for(i = 0; i < skillName.length; i++){
            this.addProfileSkill(profileId, skillName[i]);
        }
    }else{
        this.addProfileSkill(profileId, skillName);
    }
    return profile;
});

profileRepository.prototype.getProfileInformation = async(function (profileId){

    let profile = await(this.profile.findAll({where: {id:profileId}}));
    if(profile==null){
        return null;
    }
    var profiles = [];
    for(var j = 0; j < profile.length; j++){
        let ID = profile[j].id;
        let positionId = profile[j].position;

        let position = await(this.attrRepository.position.findOne({where:{id:positionId}}));
        var position_name;
        if(position){
            position_name = position.name;
        }
        else{
            position_name = null;
        }
        let degrees_set = await(this.attrRepository.degree_discipline.findAll({
            where: {profile_id: ID}
        }));

        var disciplines = [];
        var degrees = [];
        for(var i = 0; i < degrees_set.length; i++){
            let disc = await(this.attrRepository.getDisciplineName(degrees_set[i].dataValues.discipline_id));
            let deg = await(this.attrRepository.getDegreeName(degrees_set[i].dataValues.degree_id));
            disciplines[i] = disc;
            degrees[i] = deg;
        }

        let skills = await(this.attrRepository.skill.findAll({
            include: [{
                model: this.profile,
                where: {id: ID},
                through: {}
            }]
        }));
        let departments = await(this.attrRepository.department.findAll({
            include: [{
                model: this.profile,
                where: {id: ID},
                through: {}
            }]
        }));

        let specialties = await(this.attrRepository.specialty.findAll({
            include: [{
                model: this.profile,
                where: {id: ID},
                through: {}
            }]
        }));

        let facilities = await(this.attrRepository.facility.findAll({
            include: [{
                model: this.profile,
                where: {id: ID},
                through: {}
            }]
        }));

        let skill_parents = await(this.attrRepository.skill.findAll({where: {parent_id: 0}}));
        let facility_parents = await(this.attrRepository.facility.findAll({where: {parent_id: 0}}));

        profiles[j] = {id: ID,  first: profile[j].first_name, last: profile[j].last_name, email: profile[j].email, position: position_name,
            imagePath: profile[j].imagepath, skills: skills, departments: departments, degrees: degrees, specialties: specialties, disciplines: disciplines,
            hidden_token: profile[j].hidden_token, confirmed_user: profile[j].confirmed_user, intro: profile[j].intro,
            facilities: facilities, pronouns: profile[j].pronouns, website: profile[j].website, phone: profile[j].phone_number,
            availability: profile[j].availability, skill_parents: skill_parents, facility_parents: facility_parents, admin: profile[j].admin};
        if(profile.length === 1){
            return {id: ID, first: profile[j].first_name, last: profile[j].last_name, email: profile[j].email, position: position_name,
                imagePath: profile[j].imagepath, skills: skills, departments: departments, degrees: degrees, specialties: specialties, disciplines: disciplines,
                hidden_token: profile[j].hidden_token, confirmed_user: profile[j].confirmed_user, intro: profile[j].intro,
                facilities: facilities, pronouns: profile[j].pronouns, website: profile[j].website, phone: profile[j].phone_number,
                availability: profile[j].availability, skill_parents: skill_parents, facility_parents: facility_parents, admin: profile[j].admin};
        }
    }
   return profiles;
});

profileRepository.prototype.deleteProfile = async(function(profileID){
    let profile = await(this.profile.findOne({where: {id: profileID}}));
    if(profile != null){
        this.profile.destroy({
            where: {id: profileID}
        })
            .catch(error => {
            console.log(error);
    });
    }
    return 0;

});


profileRepository.prototype.getSpecialtiesIDs = async(function(profileID){
    let specialties = await(this.attrRepository.specialty.findAll({
        include: [{
            model: this.profile,
            where: {id: profileID},
            through: {}
        }]
    }));
    var specialties_return = [];
    for(var i = 0; i < specialties.length; i++){
        specialties_return.push(specialties[i].dataValues.id);
    }
    return specialties_return;
});

profileRepository.prototype.getSkillsIDs = async(function(profileID){
    let skills = await(this.attrRepository.skill.findAll({
        include: [{
            model: this.profile,
            where: {id: profileID},
            through: {}
        }]
    }));
    var skills_return = [];
    for(var i = 0; i < skills.length; i++){
        skills_return.push(skills[i].dataValues.id);
    }
    return skills_return;
});

profileRepository.prototype.getFacilitiesIDs = async(function(profileID){
    let facilities = await(this.attrRepository.facility.findAll({
        include: [{
            model: this.profile,
            where: {id: profileID},
            through: {}
        }]
    }));
    var facilities_return = [];
    for(var i = 0; i < facilities.length; i++){
        facilities_return.push(facilities[i].dataValues.id);
    }
    return facilities_return;
});

profileRepository.prototype.getUserConfirmed = async(function(profileID){
    let profile = await(this.profile.findAll({where: {id:profileID}}));
    if(profile==null){
        return null;
    }
    else{
        return profile[0].confirmed_user;
    }

});

// =====================================================================================================================
// GET PROFILE IDS WITH CERTAIN ATTRIBUTE
// =====================================================================================================================
profileRepository.prototype.getProfileIDByPosition = async(function(positionName){
    let position_id = await(this.attrRepository.getPositionId(positionName));

    if(position_id != null){
        let profiles = await(this.profile.findAll({
            where: {position: position_id}
        }));
        var profile_ids = [];
        if(profiles != null){
            for(var i = 0; i < profiles.length; i++){
                profile_ids.push(profiles[i].dataValues.id);
            }
            return profile_ids;
        }
    }
    return null;
});

profileRepository.prototype.getProfileIDByDepartment = async(function(departmentName){
    let deptID = await(this.attrRepository.getDepartmentId(departmentName));

    if(deptID != null){
        let profiles = await(this.profileDepartment.findAll({
            where: {department_id: deptID}
        }));
        var profile_ids = [];
        if(profiles != null){
            for(var i = 0; i < profiles.length; i++){
                profile_ids.push(profiles[i].dataValues.profile_id);
            }
            console.log(profile_ids);
            return profile_ids;
        }
    }
    return null;
});

profileRepository.prototype.getProfileIDBySpecialty = async(function(specialtyName){
    let specialtyID = await(this.attrRepository.getSpecialtyId(specialtyName));

    if(specialtyID!=null){
        let profiles = await(this.profileSpecialty.findAll({
            where: {specialty_id: specialtyID}
        }));
        var profile_ids = [];
        if(profiles != null) {
            for (var i = 0; i < profiles.length; i++) {
                profile_ids.push(profiles[i].dataValues.profile_id);
            }
            console.log(profile_ids);
            return profile_ids;
        }
    }
    return null;
});

profileRepository.prototype.getProfileIDBySkill = async(function(skillName){
    let skillID = await(this.attrRepository.getSkillId(skillName));

    if(skillID!=null){
        let profiles = await(this.profileSkill.findAll({
            where: {skill_id: skillID}
        }));
        var profile_ids = [];
        if(profiles != null) {
            for (var i = 0; i < profiles.length; i++) {
                profile_ids.push(profiles[i].dataValues.profile_id);
            }
            console.log(profile_ids);
            return profile_ids;
        }
    }
    return null;
});

profileRepository.prototype.getProfileIDByFacility = async(function(facilityName){
    let facilityID = await(this.attrRepository.getFacilityId(facilityName));

    if(facilityID!=null){
        let profiles = await(this.profileFacility.findAll({
            where: {facility_id: facilityID}
        }));
        var profile_ids = [];
        if(profiles != null) {
            for (var i = 0; i < profiles.length; i++) {
                profile_ids.push(profiles[i].dataValues.profile_id);
            }
            console.log(profile_ids);
            return profile_ids;
        }
    }
    return null;
});

profileRepository.prototype.getProfileIDByDiscipline = async(function(disciplineName){
    let disciplineID = await(this.attrRepository.getDisciplineId(disciplineName));

    if(disciplineID!=null){
        let profiles = await(this.attrRepository.degree_discipline.findAll({
            where: {discipline_id: disciplineID}
        }));
        var profile_ids = [];
        if(profiles != null) {
            for (var i = 0; i < profiles.length; i++) {
                profile_ids.push(profiles[i].dataValues.profile_id);
            }
            console.log(profile_ids);
            return profile_ids;
        }
    }
    return null;
});

profileRepository.prototype.getProfileIDByFirstName = async(function(firstName){
    let profiles = await(this.profile.findAll({
        attributes: ['id'],
        where: Sequelize.where(Sequelize.fn('lower', Sequelize.col('profile.first_name')), Sequelize.fn('lower', firstName))
    }));
    var profile_ids = [];
    if(profiles != null) {
        for (var i = 0; i < profiles.length; i++) {
            profile_ids.push(profiles[i].dataValues.id);
        }
        return profile_ids;
    }
    return null;
});

profileRepository.prototype.getProfileIDByLastName = async(function(lastName){
    let profiles = await(this.profile.findAll({
        attributes: ['id'],
        where: Sequelize.where(Sequelize.fn('lower', Sequelize.col('profile.last_name')), Sequelize.fn('lower', lastName))
    }));
    var profile_ids = [];
    if(profiles != null) {
        for (var i = 0; i < profiles.length; i++) {
            profile_ids.push(profiles[i].dataValues.id);
        }
        return profile_ids;    }
    return null;
});

profileRepository.prototype.getProfileIDByFirstLastName = async(function(name){
    console.log("NAME: " + name);
    let profiles = await(this.profile.findAll({
        where: Sequelize.where(Sequelize.fn('concat', Sequelize.fn('lower', Sequelize.col('first_name')), ' ', Sequelize.fn('lower', Sequelize.col('last_name'))),
            {like: '%' + name + '%'})
        }));
    var profile_ids = [];
    if(profiles != null) {
        for (var i = 0; i < profiles.length; i++) {
            profile_ids.push(profiles[i].dataValues.id);
        }
        return profile_ids;
    }
    return null;
});

profileRepository.prototype.getAllUsers = async(function(){
    let profiles = await(this.profile.findAll());
    var profile_ids = [];
    if(profiles != null) {
        for (var i = 0; i < profiles.length; i++) {
            profile_ids.push({id: profiles[i].dataValues.id, first_name: profiles[i].dataValues.first_name, last_name: profiles[i].dataValues.last_name,
            email: profiles[i].dataValues.email, confirmed: profiles[i].dataValues.confirmed_user, admin: profiles[i].dataValues.admin});
        }
        profile_ids.sort(function(a,b) {return (a.last_name > b.last_name) ? 1 : ((b.last_name > a.last_name) ? -1 : 0);} );
        return profile_ids;
    }
    return null;
});

profileRepository.prototype.getAdmins = async(function(){
    let profiles = await(this.profile.findAll({
        where: {admin: true}
    }));
    var profile_ids = [];
    if(profiles != null) {
        for (var i = 0; i < profiles.length; i++) {
            profile_ids.push({id: profiles[i].dataValues.id, first_name: profiles[i].dataValues.first_name, last_name: profiles[i].dataValues.last_name,
                email: profiles[i].dataValues.email});
        }
        return profile_ids;
    }
    return null;
});

module.exports = profileRepository;