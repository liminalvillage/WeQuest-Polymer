var accounts;
var account;
var profeth;

function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
};

function refresh() {
    wequest.nresources().then( function (value) {
      var element = document.getElementById("nresources");
      element.innerHTML = value.valueOf();
    }).catch(function(e) {
    console.log(e);
    setStatus("Error getting resources; see log.");
  });
};


function request() {

  var label = document.getElementById("label").value;
  wequest.request(label,10,10, {from:account, gas:1000000}).then(function(value) {
    setStatus("Request completed!");
    refresh();
  }).catch(function(e) {
    console.log(e);
    setStatus("Error sending request; see log.");
  });
};


function GetResource() {


    wequest.nresources().then( function (res) {

            console.log(res);

            if (res == 0){
                console.log("No Resource!");
            }
            var labels = [];
            var nrequests = [];
            nrequests.lenght = res;

            for (i = 1; i <= res; i++) {
                var resource;
                wequest.toAddress(i).then( function (address) {
                  resource = WeSource.at(address);
                  resource.label().then(function (res){
                    var label = web3.toAscii(res);
                    console.log("Label: " + label);
                    var p = document.createElement("p");
                    p.setAttribute("id",label);
                    //p.setAttribute("width",)
                    p.innerHTML = label;
                    var tmp = document.getElementById("output");
                    tmp.appendChild(p);
                  });
                  resource.nrequests().then(function (res){ console.log("Requests: " + res)});
                });
            }
    });

}

function Request(label, lat, lon) {
    var res = wequest.request(label, lat, lon, {from:account, gas:1000000});
    console.log("Request complete! - " + res);
}


window.onload = function() {
  web3.eth.getAccounts(function(err, accs) {
    if (err != null) {
      alert("There was an error fetching your accounts.");
      return;
    }

    if (accs.length == 0) {
      alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
      return;
    }

    accounts = accs;
    account = accounts[0];

    wequest = WeQuest.deployed();

    Request("pizza",10, 1, {from:account, gas:1000000});
    Request("pizza",20, 20, {from:account, gas:1000000});
    Request("pasta",10, 10, {from:account, gas:1000000});

    GetResource();

    //wequest.toAddress(1).then( function (f) {
  //    resource = WeSource.at(f);
    //  resource.label().then(console.log);
      //resource.nresources().then(console.log);
    //});

    refresh();
  });
}
