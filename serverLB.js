var express = require("express");
var fileuploader = require("express-fileupload");
var mysql = require("mysql2");
var nodemailer = require("nodemailer");

var app = express();

app.listen(2003, function () {
    console.log("Welcome to the server");
})

app.use(fileuploader());                 //to access the files in req.files
app.use(express.urlencoded(true))        //to access the data in req.body
app.use(express.static("Public"));       // to access the static files in Public folder like css, js, images

//============================================Database Connection=====================================================//


var dbConfig = {
    host: "127.0.0.1",
    user: "root",
    //  password: "Mannsaini@123",
    password: "bathinda786",
    database: "home_service",
    dateStrings: true //to convert the date into string to send value to database
}

var dbConnect = mysql.createConnection(dbConfig);

dbConnect.connect(function (err) {
    if (err == null) {
        console.log("Database Connected");
    }
    else {
        console.log(err);
    }
})

//--------------------------------------------Nodemailer-------------------------------------------------------------//

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'aarushg2218k@gmail.com',
        pass: 'xwffofogoqmukkfv'
    }
});

//===========================Linking Html Pages of Provider to Dashboard===================================//

app.get("/book-service", function (req, resp) {
    resp.sendFile(process.cwd() + "/Public/book-service.html");
})

app.get("/profile-provider", function (req, resp) {
    resp.sendFile(process.cwd() + "/Public/profile-provider.html");
})

app.get("/service-manager", function (req, resp) {
    resp.sendFile(process.cwd() + "/Public/service-manager.html");
})

app.get("/bookings", function (req, resp) {
    resp.sendFile(process.cwd() + "/Public/bookings-provider.html");
})

app.get("/book-service", function (req, resp) {
    resp.sendFile(process.cwd() + "/Public/book-service.html");
})

app.get("/profile-customer", function (req, resp) {
    resp.sendFile(process.cwd() + "/Public/profile-customer.html");
})

app.get("/bookings-customer", function (req, resp) {
    resp.sendFile(process.cwd() + "/Public/customer_requests.html");
})


//========================================Sign Up modal Data=====================================================//



app.get("/signup-data", function (req, resp) {
    // resp.send(req.query.aEmail);
    dbConnect.query("insert into users(email , pwd , type ,dos, status) values(? , ? , ? , current_date() , 1)", [req.query.aEmail, req.query.aPassword, req.query.aMembership], function (err, result) {
        if (err == null) {

            var mailOptions = {
                from: 'aarushg2218k@gmail.com',
                to: req.query.aEmail,
                subject: 'Welcome to No Broker - You have successfully registered.',
                html:  `
                <p>Dear ${req.query.aEmail} ,</p>
                <p>Welcome to No Broker! We're excited to have you on board.</p>
                <p>You have successfully registered with us. Get ready to explore and enjoy all the features we have to offer!</p>
                <p>If you have any questions or need assistance, feel free to reach out to our support team at <a href="mailto:lakshay.bansal198@gmail.com">lakshay.bansal198@gmail.com</a>.</p>
                <p>Thank you for choosing No Broker. We look forward to providing you with a great experience!</p>
                <p>Best regards,<br>No Broker Team<br>Contact : <a href="tel:7696240203">7696240203</a></p>
              `
            };


            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            resp.send("Signup Successful");
        }

        else {

            resp.send("Email already taken");
        }
    })
})



//=============================================Login Data Modal===================================================//

app.get("/login-data", function (req, resp) {

    dbConnect.query("select type ,  status , pwd from users where email=?", [req.query.lEmail], function (err, resultJSON) {

        if (err == null) {

            if (resultJSON.length == 1 && resultJSON[0].pwd != req.query.lPassword) {
                resp.send("Incorrect Password");
            }

            else {

                if (resultJSON.length == 1 && resultJSON[0].status == 1) {
                    resp.send(resultJSON[0].type);
                }

                else if (resultJSON.length == 1 && resultJSON[0].status == 0) {
                    resp.send("Account Blocked");
                }

                else {
                    resp.send("Incorrect Email");
                }
            }

        }

        else {
            resp.send(err);
        }
    })
})


//-------------------------------------Senidng otp for Pwd Change----------------------------------------------------//

app.post("/send-otp", function (req, resp) {

    let otp = req.body.fOtp;

    const fEmail = req.body.fEmail;
    console.log(fEmail);

    dbConnect.query("select * from users where email=?", [fEmail], function (err, res) {
        if(err==null){
            if(res.length==0){
                resp.send("Email not registered.");
            }

            else if(res.length==1 && res[0].status==0){
                resp.send("Account Blocked , Contact Admin!");
            }

            else if(res.length==1){
                var mailOptions = {
                    from: 'aarushg2218k@gmail.com',
                    to:fEmail,
                    subject:'Password Reset OTP for No Broker',
                    html: `
                    <p>Dear ${fEmail},</p>
                    <p>You have requested to reset your password for No Broker.</p>
                    <p>Your one-time password (OTP) is: <strong>${otp}</strong></p>
                    <p>If you didn't initiate this request, please ignore this email. Otherwise, use the provided OTP to reset your password.</p>
                    <p>If you have any questions or need assistance, feel free to reach out to our support team at <a href="mailto:lakshay.bansal198@gmail.com">lakshay.bansal198@gmail.com</a>.</p>
                    <p>Thank you for choosing No Broker. We're here to help you secure your account.</p>
                    <p>Best regards,<br>No Broker Team<br>Contact : <a href="tel:7696240203">7696240203</a></p>
                  `,
                };
            
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                resp.send("OTP has been sent to your Email Address");
            }

        }
    })

})

//-------------------------------------Password Change----------------------------------------------------//

app.post("/change-pwd", function (req, resp) {

    dbConnect.query("update users set pwd=? where email=?", [req.body.fPwd, req.body.fEmail], function (err, res) {
        if (err == null) {
            if (res.affectedRows == 1) {
                resp.send("Password Updated");
            }
            else {
                resp.send("Password Not Updated");
            }
        }
        else {
            console.log(err);
            resp.send(err);
        }
    })

})



//============================================Profile Customer=====================================================//


//----------------------Proile Customer data search button-----------------//

app.get("/profile-customer-search", function (req, resp) {

    dbConnect.query("select * from profile_customer where email = ? ", [req.query.aemail], function (err, res) {

        if (err == null) {
            if (res.length == 1) {
                resp.send(res);
            }
            else {
                resp.send("Profile Not Found");
            }
        }

        else {
            console.log(err);
        }

    })

})


//=====================================Update Password=======================================================//

app.get("/update-pwd", function (req, resp) {

    dbConnect.query("update users set pwd=? where email=? and pwd=?", [req.query.anewPwd, req.query.aEmail, req.query.aoldPwd], function (err, res) {
        if (err == null) {

            if (res.affectedRows == 1) {
                resp.send("Password Updated");
            }

            else {
                resp.send("Wrong email id or old password");
            }
        }
        else {
            console.log(err);
            resp.send(err);
        }
    })

})


//----------------------Proile Customer data save button-------------------//

app.post("/profile-customer-save", function (req, resp) {

    // console.log(req.body);

    var filename = "nopic";

    if (req.files != null) {

        filename = req.files.proofPic.name;
        var path = process.cwd() + "/Public/Id_Proof/" + filename;
        req.files.proofPic.mv(path);
    }


    dbConnect.query("insert into profile_customer values(? , ? , ? , ? , ? , ? )", [req.body.txtEmail, req.body.txtName, req.body.txtContact, req.body.txtAddress, req.body.txtCity, filename], function (err, res) {
        if (err == null) {
            resp.send("Profile Saved");
        }
        else {
            console.log(err);
            resp.send("Profile Already Exists");
        }
    })

})

//----------------------Proile Customer data update button-------------------//

app.post("/profile-customer-update", function (req, resp) {

    var filename = "nopic";

    if (req.files != null) {

        filename = req.files.proofPic.name;
        var path = process.cwd() + "/Public/Id_Proof/" + filename;
        req.files.proofPic.mv(path);

    }

    else {
        filename = req.body.hdn;
    }

    dbConnect.query("update profile_customer set name=? , contact=? , address=? , city=? , proof=? where email=?", [req.body.txtName, req.body.txtContact, req.body.txtAddress, req.body.txtCity, filename, req.body.txtEmail], function (err, res) {

        if (err == null) {
            if (res.affectedRows == 1) {
                resp.send("Profile Updated");
                // console.log(res);
            }
            else {
                resp.send("Invalid Email");
            }
        }

        else {
            console.log(err);
        }

    })

})
//============================================Profile Parnter=====================================================//


//----------------------Proile Partner data search button-----------------//

app.get("/profile-partner-search", function (req, resp) {

    dbConnect.query("select * from profile_partner where email = ? ", [req.query.aemail], function (err, res) {

        if (err == null) {
            if (res.length == 1) {
                resp.send(res);
            }
            else {
                resp.send("Profile Not Found");
            }
        }

        else {
            console.log(err);
        }

    })

})


//----------------------Proile Customer data save button-------------------//

app.post("/profile-partner-save", function (req, resp) {

    // console.log(req.body);

    var filename = "nopic";

    if (req.files != null) {

        filename = req.files.proofPic.name;
        var path = process.cwd() + "/Public/Id_Proof/" + filename;
        req.files.proofPic.mv(path);
    }


    dbConnect.query("insert into profile_partner values(? , ? , ? , ? , ? , ?, ? , ? )", [req.body.txtEmail, req.body.txtName, req.body.txtContact, req.body.txtAddress, req.body.txtCity, req.body.txtFirm, req.body.txtLink, filename], function (err, res) {
        if (err == null) {
            resp.send("Profile Saved");
        }
        else {
            console.log(err);
            resp.send("Profile Already Exists");
        }
    })

})

//----------------------Proile Customer data update button-------------------//

app.post("/profile-partner-update", function (req, resp) {

    var filename = "nopic";

    if (req.files != null) {

        filename = req.files.proofPic.name;
        var path = process.cwd() + "/Public/Id_Proof/" + filename;
        req.files.proofPic.mv(path);

    }

    else {
        filename = req.body.hdn;
    }

    dbConnect.query("update profile_partner set name=? , contact=? , address=? , city=? , firm=? , link=?  , proof=? where email=?", [req.body.txtName, req.body.txtContact, req.body.txtAddress, req.body.txtCity, req.body.txtFirm, req.body.txtLink, filename, req.body.txtEmail], function (err, res) {

        if (err == null) {
            if (res.affectedRows == 1) {
                resp.send("Profile Updated");
                // console.log(res);
            }
            else {
                resp.send("Invalid Email");
            }
        }

        else {
            console.log(err);
        }

    })

})



//========================================Avail Services====================================================//

app.get("/avail-services", function (req, resp) {

    dbConnect.query("insert into services values(? , ? ,? , ? , ? , ? , ?)", [0, req.query.aEmail, req.query.aType, req.query.aCharges, req.query.aFrom, req.query.aTo, req.query.aDesp], function (err, res) {

        if (err == null) {
            if (res.affectedRows == 1) {
                resp.send("Service Availed");
            }
            else {
                resp.send("Service Not Availed");
            }
        }

        else {
            console.log(err);
        }
    })

})


//==================================Service Manager========================================================//

//----------------------Proile Service Manager data fetch record button-----------------//

app.get("/fetch-service-record", function (req, resp) {

    dbConnect.query("select * from services where email = ? ", [req.query.angEmail], function (err, res) {

        if (err == null) {

            resp.send(res);
        }

        else {
            console.log(err);
        }

    })

})

//------------------------Proile Service Manager data delete button----------------------//

app.get("/delete-service-record", function (req, resp) {

    dbConnect.query("delete from services where srno = ? ", [req.query.angSno], function (err, res) {

        if (err == null) {
            if (res.affectedRows == 1) {
                resp.send("Record Deleted");
            }
        }

        else {
            console.log(err);
        }

    })


})


//=================================================Book A Serivce===============================================//

//-------------------------Fetch city available for service---------------------------------------------//
app.get("/fetch-cities", function (req, resp) {

    dbConnect.query("select distinct city from profile_partner", function (err, res) {

        if (err == null) {
            resp.send(res);
        }

        else {
            console.log(err);
        }

    })

})

//------------------------Fetch type of service--------------------------------------------------------//

app.get("/fetch-services", function (req, resp) {

    dbConnect.query("select distinct type from services", function (err, res) {

        if (err == null) {
            resp.send(res);
        }

        else {
            console.log(err);
        }
    })
})

//-------------------Fetch Avail Services-------------------------------------------------------------//

app.get("/fetch-avail-services", function (req, resp) {

    dbConnect.query("select profile_partner.email , profile_partner.name , profile_partner.contact , profile_partner.city , profile_partner.firm , profile_partner.link , services.type , services.charges , services.afrom ,services.ato , services.description from services inner join profile_partner on services.email = profile_partner.email where city=? and type=?", [req.query.angCity, req.query.angType], function (err, res) {

        if (err == null) {
            resp.send(res);
        }

        else {
            console.log(err);
        }
    })

})


//-----------------------------------Booking Details---------------------------------------------------//

app.get("/booking-details", function (req, resp) {

    // console.log(req.query);

    var selRec = JSON.parse(req.query.angselRec);
    var bookRec = JSON.parse(req.query.angBookingRec);
    // console.log(selRec);
    // console.log(bookRec);

    visitDate = new Date(bookRec.cVisitDate);
    vfrom = new Date(bookRec.vfrom);
    vto = new Date(bookRec.vto);


    dbConnect.query("insert into bookings values(? , ? , ? ,? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ?)", [0, selRec.email, selRec.name, selRec.contact, selRec.type, bookRec.cEmail, bookRec.cName, bookRec.cContact, bookRec.cAddress, visitDate, vfrom, vto, bookRec.desp, 0, 0], function (err, res) {
        if (err == null) {
            if (res.affectedRows == 1) {
                resp.send("Booking Done");
            }
            else {
                resp.send("Booking Not Done");
            }
        }
        else {
            console.log(err);
            resp.send(err);
        }
    })

})


//----------------------------------Fetch Requested Record---------------------------------------------//

app.get("/fetch-requests", function (req, resp) {

    dbConnect.query("select * from bookings where pemail = ? && status = 0 && completed = 0", [req.query.angEmail], function (err, res) {

        if (err == null) {
            resp.send(res);
        }

        else {
            console.log(err);
        }

    })

})

//----------------------------------Accept a request----------------------------------------------------//

app.get("/accept-request", function (req, resp) {

    dbConnect.query("update bookings set status = 1 where srno = ?", [req.query.angSno], function (err, res) {

        if (err == null) {
            if (res.affectedRows == 1) {
                resp.send("Request Accepted");
            }
            else {
                resp.send("Request Not Accepted");
            }
        }

        else {
            console.log(err);
        }

    })

})

//----------------------------------Reject a request----------------------------------------------------//

app.get("/reject-request", function (req, resp) {

    dbConnect.query("update bookings set status = -1 where srno = ? ", [req.query.angSno], function (err, res) {

        if (err == null) {
            if (res.affectedRows == 1) {
                resp.send("Request Rejected");
            }
            else {
                resp.send("Request Not Rejected");
            }
        }

        else {
            console.log(err);
        }

    })

})


//----------------------------------Fetch Accepted Record---------------------------------------------//

app.get("/fetch-accepted", function (req, resp) {

    dbConnect.query("select * from bookings where pemail = ? && status = 1 && completed = 0", [req.query.angEmail],
        function (err, res) {

            if (err == null) {
                resp.send(res);
            }

            else {
                console.log(err);
            }

        })

})

//-----------------------------------Complete a request---------------------------------------------------//

app.get("/completed-request", function (req, resp) {

    dbConnect.query("update bookings set completed = 1 where srno = ?", [req.query.angSno], function (err, res) {

        if (err == null) {
            if (res.affectedRows == 1) {
                resp.send("Request Completed");
            }
            else {
                resp.send("Request Not Completed");
            }
        }

        else {
            console.log(err);
        }

    })

})

//----------------------------------Fetch Completed Record---------------------------------------------//

app.get("/fetch-completed", function (req, resp) {

    dbConnect.query("select * from bookings where pemail = ? && completed = 1", [req.query.angEmail], function (err, res) {

        if (err == null) {
            resp.send(res);
        }

        else {
            console.log(err);
        }
    })

})


//---------------------------------Customer Booking Details---------------------------------------------//

app.get("/fetch-pending-requests", function (req, resp) {
    dbConnect.query("select * from bookings where cemail = ? && status = 0 && completed = 0", [req.query.angEmail], function (err, res) {
        if (err == null) {
            resp.send(res);
        }
        else {
            console.log(err);
        }
    })
})

app.get("/fetch-accepted-requests", function (req, resp) {
    dbConnect.query("select * from bookings where cemail = ? && status = 1 && completed = 0", [req.query.angEmail], function (err, res) {
        if (err == null) {
            console.log(res);
            resp.send(res);
        }
        else {
            console.log(err);
        }
    })
})


app.get("/fetch-rejected-requests", function (req, resp) {

    dbConnect.query("select * from bookings where cemail = ? && status = -1 && completed = 0", [req.query.angEmail], function (err, res) {
        if (err == null) {
            resp.send(res);
        }
        else {
            console.log(err);
        }
    })

})


//===================================================Admin Dashboard==================================================//

app.get("/admin-dashboard", function (req, resp) {
    resp.sendFile(process.cwd() + "/Public/dash-admin.html");
})


//=============================================Admin Fetch All Users Record===========================================//

app.get("/fetch-table-record", function (req, resp) {
    dbConnect.query("select * from users", function (err, resJson) {
        if (err == null) {
            resp.send(resJson);
        }

        else {
            console.log(err);
            resp.send(err);
        }
    })
})


//====================================Admin User Resume And Block=====================================================//

app.get("/resume-user", function (req, resp) {
    dbConnect.query("update users set status=1 where email=?", [req.query.angEmail], function (err, res) {

        if (err == null) {
            resp.send("User Resumed");
        }

        else {
            resp.send(err);
            console.log(err);
        }

    })
})


app.get("/block-user", function (req, resp) {

    dbConnect.query("update users set status=0 where email=?", [req.query.angEmail], function (err, res) {
        if (err == null) {
            resp.send("User Blocked");
        }

        else {
            resp.send(err);
            console.log(err);
        }
    })
})


//=========================================Partner Table Record Fetch===============================================//

app.get("/fetch-provider-table-record", function (req, resp) {
    dbConnect.query("select * from profile_partner", function (err, res) {
        if (err = null) {
            resp.send(res);
        }
        else {
            resp.send(res);
        }
    })
})


//========================================Customer Table Record Fetch=======================================//

app.get("/fetch-customer-table-record", function (req, resp) {

    dbConnect.query("select * from profile_customer", function (err, res) {
        if (err == null) {
            resp.send(res);
        }

        else {
            resp.send(err);
            console.log(err);
        }
    })
})


