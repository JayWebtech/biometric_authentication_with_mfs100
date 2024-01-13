 
var uri = "https://localhost:8003/mfs100/"; //This Self made Mantra SDK by github.com/VikashAnandJha
function GetMFS100Info() {
    return GetMFS100Client("info");
}

function GetMFS100KeyInfo(key) {
    var MFS100Request = {
        "Key": key,
    };
    var jsondata = JSON.stringify(MFS100Request);
    return PostMFS100Client("keyinfo", jsondata);
}
function CaptureFinger(quality, timeout) {
    var MFS100Request = {
        "Quality": quality,
        "TimeOut": timeout
    };
    var jsondata = JSON.stringify(MFS100Request);
    return PostMFS100Client("capture", jsondata);
}
// Devyang Muti Finger Capture
function CaptureMultiFinger(quality, timeout,nooffinger) {
    var MFS100Request = {
        "Quality": quality,
        "TimeOut": timeout,
        "NoOfFinger": nooffinger
    };
    var jsondata = JSON.stringify(MFS100Request);
    return PostMFS100Client("capturewithdeduplicate", jsondata);
}
//


function VerifyFinger(ProbFMR, GalleryFMR) {
    var MFS100Request = {
        "ProbTemplate": ProbFMR,
        "GalleryTemplate": GalleryFMR,
        "BioType": "FMR" // you can paas here BioType as "ANSI" if you are using ANSI Template
    };
    var jsondata = JSON.stringify(MFS100Request);
    return PostMFS100Client("verify", jsondata);
}
function MatchFinger(quality, timeout, GalleryFMR) {
    var MFS100Request = {
        "Quality": quality,
        "TimeOut": timeout,
        "GalleryTemplate": GalleryFMR,
        "BioType": "FMR" // you can paas here BioType as "ANSI" if you are using ANSI Template
    };
    var jsondata = JSON.stringify(MFS100Request);
    return PostMFS100Client("match", jsondata);
}
function GetPidData(BiometricArray) {
    var req = new MFS100Request(BiometricArray);
    var jsondata = JSON.stringify(req);
    return PostMFS100Client("getpiddata", jsondata);
}

function GetRbdData(BiometricArray) {
    var req = new MFS100Request(BiometricArray);
    var jsondata = JSON.stringify(req);
    return PostMFS100Client("getrbddata", jsondata);
}

function PostMFS100Client(method, jsonData) {
    var res;
    $.support.cors = true;
    var httpStaus = false;
    $.ajax({
        type: "POST",
        async: false,
        crossDomain: true,
        url: uri + method,
        contentType: "application/json; charset=utf-8",
        data: jsonData,
        dataType: "json",
        processData: false,
        success: function (data) {
            httpStaus = true;
            res = { httpStaus: httpStaus, data: data };
        },
        error: function (jqXHR, ajaxOptions, thrownError) {
            res = { httpStaus: httpStaus, err: getHttpError(jqXHR) };
        },
    });
    return res;
}
function GetMFS100Client(method) {
    var res;
    $.support.cors = true;
    var httpStaus = false;
    $.ajax({
        type: "GET",
        async: false,
        crossDomain: true,
        url: uri + method,
        contentType: "application/json; charset=utf-8",
        processData: false,
        success: function (data) {
            httpStaus = true;
            res = { httpStaus: httpStaus, data: data };
        },
        error: function (jqXHR, ajaxOptions, thrownError) {
            res = { httpStaus: httpStaus, err: getHttpError(jqXHR) };
        },
    });
    return res;
}
function getHttpError(jqXHR) {
    var err = "Unhandled Exception";
    if (jqXHR.status === 0) {
        err = 'Service Unavailable';
    } else if (jqXHR.status == 404) {
        err = 'Requested page not found';
    } else if (jqXHR.status == 500) {
        err = 'Internal Server Error';
    } else if (thrownError === 'parsererror') {
        err = 'Requested JSON parse failed';
    } else if (thrownError === 'timeout') {
        err = 'Time out error';
    } else if (thrownError === 'abort') {
        err = 'Ajax request aborted';
    } else {
        err = 'Unhandled Error';
    }
    return err;
}


/////////// Classes

function Biometric(BioType, BiometricData, Pos, Nfiq, Na) {
    this.BioType = BioType;
    this.BiometricData = BiometricData;
    this.Pos = Pos;
    this.Nfiq = Nfiq;
    this.Na = Na;
}

function MFS100Request(BiometricArray) {
    this.Biometrics = BiometricArray;
}