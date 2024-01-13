// var jsonString = localStorage.getItem("userData");
//     var storedDataArray = JSON.parse(jsonString) || [];
//     console.log(storedDataArray[3].user_id);
function generateCode(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  $("#user_id").val(result);
}

function login() {
  $("#login-button").attr("disabled", "disabled");
  $("#msg").html("Validating ID").css("color", "black");
  $("#login-button").html(
    "<img src='../assets/icon.gif' width='20' height='20'>Please wait..."
  );

  setTimeout(function () {
    var loginID = $("#login_id").val();
    var quality = 60;
    var timeout = 10;
    if (loginID == "") {
      $("#msg").html("Please input your login ID").css("color", "red");
      $("#login-button").removeAttr("disabled");
      $("#login-button").html("Authenticate");
      return;
    }
    var jsonString = localStorage.getItem("userData");
    var storedDataArray = JSON.parse(jsonString) || [];
    var targetRecord = storedDataArray.find(function (record) {
      return record.user_id === loginID;
    });
    if (targetRecord) {
      $("#msg").html("Place your thumb on the scanner").css("color", "black");
      $("#login-button").html(
        "<img src='../assets/icon.gif' width='20' height='20'>Scanning..."
      );

      $("#finger-img").attr("src", "../assets/scanning.gif");
      try {
        console.log(targetRecord.image);
        var res = MatchFinger(quality, timeout, targetRecord.image);
        console.log(res);
        if (res.httpStaus) {
          if (res.data.Status) {
            localStorage.setItem("login_success", targetRecord.name);
            window.open("success.html", "_self");
          } else {
            if (res.data.ErrorCode != "0") {
              $("#login-button").removeAttr("disabled");
              $("#msg").html(res.data.ErrorDescription).css("color", "red");
              $("#login-button").html("Authenticate");
              $("#finger-img").attr("src", "../assets/fingerprint.jpg");
            } else {
              $("#login-button").removeAttr("disabled");
              $("#msg")
                .html("Fingerprint does not match, try again")
                .css("color", "red");
              $("#login-button").html("Authenticate");
              $("#finger-img").attr("src", "../assets/fingerprint.jpg");
            }
          }
        } else {
          $("#login-button").removeAttr("disabled");
          $("#msg").html(res.err).css("color", "red");
          $("#login-button").html("Authenticate");
          $("#finger-img").attr("src", "../assets/fingerprint.jpg");
        }
      } catch (e) {
        $("#login-button").removeAttr("disabled");
        $("#msg").html(e).css("color", "red");
        $("#login-button").html("Authenticate");
        $("#finger-img").attr("src", "../assets/fingerprint.jpg");
      }
    } else {
      $("#login-button").removeAttr("disabled");
      $("#msg")
        .html("Record with " + loginID + " not found.")
        .css("color", "red");
      $("#login-button").html("Authenticate");
      $("#finger-img").attr("src", "../assets/fingerprint.jpg");
    }
  }, 1000);
}
function register() {
  $("#finger-img").attr("src", "../assets/scanning.gif");
  $("#login-button").attr("disabled", "disabled");
  $("#msg").html("Place your thumb on the scanner").css("color", "black");
  $("#login-button").html(
    "<img src='../assets/icon.gif' width='20' height='20'>Scanning..."
  );

  setTimeout(function () {
    var quality = 60;
    var timeout = 10;
    var res = CaptureFinger(quality, timeout);
    if (res.data.ErrorDescription == "Timeout") {
      $("#login-button").removeAttr("disabled");
      $("#msg").html("Timeout, try again").css("color", "red");
      $("#login-button").html("Authenticate");
      $("#finger-img").attr("src", "./fingerprint.jpg");
    } else {
      $("#login-button").removeAttr("disabled");
      $("#msg")
        .html(
          "Registration successful, your login id is " + $("#user_id").val()
        )
        .css("color", "green");
      $("#login-button").html("Authenticate");
      $("#finger-img").attr(
        "src",
        "data:image/bmp;base64," + res.data.BitmapData
      );

      var jsonString = localStorage.getItem("userData");
      var storedDataArray = JSON.parse(jsonString) || [];

      var name = $("#name").val();
      var user_id = $("#user_id").val();
      var imageData = res.data.IsoTemplate;
      var dataToStore = {
        name: name,
        image: imageData,
        user_id: user_id,
      };

      storedDataArray.push(dataToStore);
      var updatedJsonString = JSON.stringify(storedDataArray);
      localStorage.setItem("userData", updatedJsonString);

      $("#name").val("");
      $("#user_id").val("");
      generateCode(5);
    }
  }, 1000);
}
function successLogin() {
  var name = localStorage.getItem("login_success");
  $("#username").html(name);
}
function logout() {
  localStorage.removeItem("login_success");
  window.open("index.html", "_self");
}
