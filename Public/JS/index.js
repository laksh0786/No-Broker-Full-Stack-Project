$(document).ready(function () {

    //====================================================================================================//
    //---Signup Button Click Event---//
    $("#btnSignup").click(function () {
        //  alert($("#txtEmail").css("border-color"));   

        if ($("#txtEmail").css("border-color") == "rgb(255, 0, 0)" || $("#txtPassword").css("border-color") == "rgb(255, 0, 0)") {
            alert("Enter Valid Email or Password");
            return;
        }

        // alert();

        var email = $("#txtEmail").val();
        var password = $("#txtPassword").val();
        var membership = $("#txtType").val();
        // alert(email + " " + password + " " + membership);


        var obj = {
            type: "get",
            url: "/signup-data",
            data: {
                aEmail: email,
                aPassword: password,
                aMembership: membership
            }
        }

        $.ajax(obj).done(function (resp) {
            alert(resp);
            $("#txtMsg").html(resp);
        }).fail(function (err) {
            $("#txtMsg").html(err);
        })

    })
    //======================================================================================================//

    //---Login Button Click Event---//


    $("#btnlogin").click(function () {


        var obj = {
            type: "get",
            url: "/login-data",
            data: {
                lEmail: $("#loginEmail").val(),
                lPassword: $("#loginPassword").val()
            }
        }

        // alert(obj.data.lEmail + " " + obj.data.lPassword);


        //=======================================localStorage Global Object===============================================//

        //localStorage is a gloabl object of browser and is accessible in all pages of browser and using setItem() we can store data in local storage and using getItem() we can retrieve data from local storage

        localStorage.setItem("activeUser", $("#loginEmail").val());

        // var au=localStorage.getItem("activeUser");
        // alert(au);

        //================================================================================================================//

        //Ajax request to server for login 
        $.ajax(obj).done(function (resp) {

            // alert(resp);
            $("#txtloginMsg").html(resp);

            if (resp == "Customer") {
                location.href = "dash-customer.html"
            }

            else if (resp == "Provider") {
                location.href = "dash-provider.html"
            }

        }).fail(function (err) {
            alert(JSON.stringify(err));
        })



    })

    //============================================Validation==========================================================

    $("#loginEmail").blur(function () {
        // alert("User Name is required");
        var emailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        var userEmail = $(this).val();

        if (!(emailformat.test(userEmail))) {
            // alert("Invalid Email");
            $("#chk-email").html("Invalid Email").css("color", "red");
            $("#loginEmail").css("border-color", "red");
        }

        else {
            $("#chk-email").html("").css("color", "");
            $("#loginEmail").css("border-color", "green");
        }
    });


    $("#txtEmail").blur(function () {
        // alert("User Name is required");
        var emailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        var userEmail = $(this).val();

        if (!(emailformat.test(userEmail))) {
            // alert("Invalid Email");
            $("#chk-sign-email").html("Invalid Email Address").css("color", "red");
            $(this).css("border-color", "red");
        }

        else {
            $("#chk-sign-email").html("").css("color", "");
            $("#txtEmail").css("border-color", "green");
        }
    });

    $("#txtPassword").blur(function () {
        // alert("User Name is required");
        var pwdformat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
        var userpwd = $("#txtPassword").val();

        if (!(pwdformat.test(userpwd))) {
            // alert("Invalid Password");
            $("#chk-pwd").html("Password must contain atleast one lower case alphabet and one upper case alphabet , one numeric digit and one special symbol").css("color", "red");
            $("#txtPassword").css("border-color", "red");
        }

        else {
            $("#chk-pwd").html("Strong Password").css("color", "green");
            $("#txtPassword").css("border-color", "green");
        }
    });

    $("#txtPassword").focus(function () {
        $("#chk-pwd").html("").css("color", "");
        $("#txtPassword").css("border-color", "");
    });



    $("#loginEye").click(function () {

        var type = $("#loginPassword").attr("type");

        if (type == "password") {
            $("#loginPassword").attr("type", "text");
            $(this).addClass("fa-eye").removeClass("fa-eye-slash");
        }

        else {
            $("#loginPassword").attr("type", "password");
            $(this).addClass("fa-eye-slash").removeClass("fa-eye");
        }

    });

    $("#adminEye").click(function () {

        var type = $("#adminPassword").attr("type");

        if (type == "password") {
            $("#adminPassword").attr("type", "text");
            $(this).addClass("fa-eye").removeClass("fa-eye-slash");
        }

        else {
            $("#adminPassword").attr("type", "password");
            $(this).addClass("fa-eye-slash").removeClass("fa-eye");
        }

    });


    $("#signEye").click(function () {

        var type = $("#txtPassword").attr("type");

        if (type == "password") {
            $("#txtPassword").attr("type", "text");
            $(this).addClass("fa-eye").removeClass("fa-eye-slash");
        }

        else {
            $("#txtPassword").attr("type", "password");
            $(this).addClass("fa-eye-slash").removeClass("fa-eye");
        }

    });

    //---------------------Admin Login---------------------//

    $("#btnAdmin").click(function () {
        const adminEmail = $("#adminUser").val();
        const adminPwd = $("#adminPassword").val();

        // console.log(adminEmail + " " + adminPwd);
        if (adminEmail == "Admin@123" && adminPwd == "Bansal@786") {
            location.href = "dash-admin.html";
        }
    })

    //-------------------Forget Password---------------------//
    const otp = Math.floor(Math.random() * (9999 - 1000) + 1000);
    $("#btnFrgt").click(function () {

        const email = $("#frgtEmail").val();
        console.log(otp);

        if (email == "") {
            alert("Enter Email Address");
            return;
        }

        let obj = {
            type: "post",
            url: "/send-otp",
            data: {
                fEmail: email,
                fOtp: otp,
            }
        }
        //Ajax request to server for login 
        $.ajax(obj).done(function (resp) {
            // alert(resp);
            if (resp === "Email not registered") {
                alert("Email not registered");
                return;
            }
            else if (resp=="OTP has been sent to your Email Address") {
                $("#frgtDiv").addClass("display_block").removeClass("display_none");
                $("#frgtEmail").attr("disabled", true);
                $("#btnFrgt").addClass("display_none").removeClass("display_block");
                $("#btnVerify").addClass("display_block").removeClass("display_none");
                $("#frgtPwdDiv").addClass("display_block").removeClass("display_none");
                $("#frgtConPwdDiv").addClass("display_block").removeClass("display_none");
                alert(resp);
            }

            else{
                alert(resp);
            }


        }).fail(function (err) {
            alert(JSON.stringify(err));
        })



    })


    //-------------------Verify OTP and Change Password---------------------//
    $("#btnVerify").click(function(){
        const userOtp=$("#frgtOtp").val();
        const userPwd=$("#frgtPwd").val();
        const userConPwd=$("#frgtConPwd").val();

        if(userOtp=="" || userPwd=="" || userConPwd==""){
            alert("All fields are required");
            return;
        }

        else if(otp!=userOtp){
            alert("Invalid OTP");
            return;
        }

        else if(userPwd!=userConPwd){
            alert("Password and Confirm Password must be same");
            return;
        }

        else{
            let obj = {
                type: "post",
                url: "/change-pwd",
                data: {
                    fEmail: $("#frgtEmail").val(),
                    fPwd: userPwd,
                }
            }
            //Ajax request to server for login 
            $.ajax(obj).done(function (resp) {
                alert(resp);
                if(resp=="Password Changed Successfully"){
                    location.href="index.html";
                }
            }).fail(function (err) {
                alert(JSON.stringify(err));
            })
        }
        
    })

})




