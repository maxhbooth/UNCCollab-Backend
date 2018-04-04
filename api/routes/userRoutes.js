var db = require('../../database/database');
var Profile = require('../../models/profile');
var randomstring = require('randomstring');
//const await = require('asyncawait/await');
var mailer = require('../../views/js/mailer');
const AttrRepository = require('./helpers/attributeRepository');
const ProfileRepository = require('./helpers/profileRepository');

module.exports = function (app, sessionChecker) {
    // set up the routes themselves

    function extend(dest, src) {
        for(var key in src) {
            dest[key] = src[key];
        }
        return dest;
    }

    app.route('/signup')
        .get(sessionChecker, (req, res) => {
            if (!req.session.profile && !req.cookies.user_sid){

                var attrRepository = new AttrRepository();

                attrRepository.getAll().then(function (models){
                    //console.log(models); tbh this is annoying rn
                    res.render('signup.html', models);
                });

            }else {
                res.redirect('/my-profile');
            }
        })
        .post((req, res) => {
            req.checkBody('username', 'Username must be between 4 and 15 characters.').len(4, 15);
            req.checkBody('email', 'Email must be a valid email.').isEmail();
            req.checkBody('email', 'Email must be from 4 to 50 characters.').len(4, 50);
            req.checkBody('password', 'Password must be between 8 to 50 characters.').len(4, 50);
            req.checkBody('confirmpassword', 'Passwords must match.').equals(req.body.password);

            //what should I validate??
            req.checkBody('first', "Must enter a first name.").notEmpty();
            req.checkBody('last', "Must enter a last name.").notEmpty();

            const errors = req.validationErrors();


            if (!errors) {

                let username = req.body.username;
                let email = req.body.email;
                let password = req.body.password;

                let first = req.body.first;
                let last = req.body.last;
                let degreeName = req.body.degree;
                let departmentName = req.body.department;
                let disciplineName = req.body.discipline;
                let positionName = req.body.position;
                let facilityName = req.body.facility || null;
                let skillName = req.body.skill || null;
                let specialtyName = req.body.specialty || null;


                //create string token
                const hidden_token = randomstring.generate();
               // req.body.hidden_token= (hidden_token);
                //flag if the user is not confirmed
               const confirmed_user = false;

                //email compose
                const html = 'Greetings, <br/> Thank you for registering for CollabSeek' +
                    'Please verify you email by typing i the following hidden token <br/>' +
                    '<b>Token: {hidden_token}:</b>' +
                    '<br/> in the following link ' +
                    '<a href ="http://localhost:8080/verify">http://localhost:8080/verify</a>';

                //send the email
              mailer.sendEmail('marcussw@live.unc.edu', email, 'Please verify your email',html);





                const profileRepository = new ProfileRepository();
                profileRepository.createProfile(first, last, degreeName, departmentName, disciplineName,
                    positionName, facilityName, skillName, specialtyName, username, email, password,hidden_token,false)
                    .then(profile => {
                        if(!profile.errors){
                            console.log(profile.errors);
                        }
                        req.session.profile = profile.dataValues;
                       // res.redirect('/my-profile');
                        res.redirect('/homepage');
                    });

            }
            else {
                console.log(errors);
                var userErrors = [];
                var emailErrors = [];
                var passwordErrors = [];
                for (var i = 0; i < errors.length; i++) {
                    if (errors[i].param === 'username') {
                        userErrors.push(errors[i].msg);
                    }
                    if (errors[i].param === 'email') {
                        emailErrors.push(errors[i].msg);
                    }
                    if (errors[i].param === 'password') {
                        passwordErrors.push(errors[i].msg);
                    }
                }

                var attrRepository = new AttrRepository();

                attrRepository.getAll().then(function (models){
                    //console.log(models); tbh this is annoying rn

                    var errors = {userErrors: userErrors,
                        emailErrors: emailErrors,
                        passwordErrors: passwordErrors,
                        validated: req.body};
                    var data = extend(models, errors);
                    res.render('signup.html',
                        data );
                });
            }
        });

    app.route('/login')
        .get(sessionChecker, (req, res) => {
            res.sendFile('/views/login.html', {root: './'});
        })
        .post((req, res) => {
            var email = req.body.email,
                password = req.body.password;

            Profile.findOne({where: {email: email}}).then(function (profile) {
                if (!profile) {
                    res.redirect('/login');
                } else if (!profile.validPassword(password)) {
                    res.redirect('/login');
                }
                //check to see if profile has been activated return error message  //
                else if(!profile.isConfirmedUser()){
                    JSAlert.alert("Confirm your email address.");
                }
                else {
                    req.session.profile = profile.dataValues;
                    res.redirect('/');
                }
            });
        });
    // ROUTING FOR verify page
    const isNotAuth = (res,req,next) =>{

    };

    // for the verify.html
    app.route('/verify')
        .get(isNotAuth,(req,res) =>{
       res.render('views/verify.html');
    })
        .post(async( req, res, next) =>{
            try {
                const {hidden_token} = req.body;
                // next find account that matches hidden token
                const user = await Profile.findOne({'hidden_token': hidden_token});
                if (!user) {
                    req.flash("No user found");
                    res.redirect('views/verify.html');
                    return;
                }
                user.confirmed_user = true;
                user.hidden_token = "";
                await user.save();




                res.redirect('/login.html');
            }catch(error){
                req.flash("Error:"+error);
            }


        });



    app.get('/logout', (req, res) => {
        if (req.session.profile && req.cookies.user_sid) {
            res.clearCookie('user_sid');
            res.redirect('/');
        } else {
            res.redirect('/login');
        }
    });
};