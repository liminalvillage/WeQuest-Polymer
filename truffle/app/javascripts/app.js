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
      getResources();
    }).catch(function(e) {
    console.log(e);
    setStatus("Error getting resources; see log.");
  });
};


function request() {
  var label = document.getElementById("label").value;
  wequest.request(label,"10","10", {from:account, gas:2100000}).then(function(value) {
    setStatus("Request completed!");

  }).catch(function(e) {
    console.log(e);
    setStatus("Error sending request; see log.");
  });
};


function getResources() {
    var tmp = document.getElementById("output");
    tmp.innerHTML = ""; //reset resources;
    wequest.nresources().then( function (res) {
            console.log(res);


            if (res == 0){
                console.log("No Resource!");
            }

            for (i = 1; i <= res; i++) {
                var resource;
                wequest.toAddress(i).then( function (address ) {
                  resource = WeSource.at(address);
                  Promise.all([resource.label(), resource.nrequests()]).then(values => {
                    //resource.label().then(function (){
                    var label = web3.toAscii(values [0]);
                    console.log("Label: " + label + " Num:" + values[1]);
                    var p = document.createElement("p");
                    p.setAttribute("id",label);
                    p.setAttribute("style","width:"+values[1]+"%;background-color:green;");
                    p.setAttribute("onclick","listOrders(\'"+ address+"\')")
                    p.setAttribute("href","javascript:void(0);");
                    p.innerHTML = label;
                    var tmp = document.getElementById("output");
                    tmp.appendChild(p);
                  });

                });
            }
    });

}

function orderDetails(address, id){
  var resource = WeSource.at(address);
  var tmp = document.getElementById("details");
  tmp.innerHTML= "";
  resource.getRequestInfo( id ).then(
    function (res )
    {
      var p = document.createElement("p");
      //button.setAttribute("onclick","confirm(\'" + address + "\'," + i + ")");
      p.innerHTML = "Status: " +  res[4] + " Loc: " + res[2] + " "  + res[3];
      tmp.appendChild(p);
      var button = document.createElement("button");
      button.setAttribute("href","javascript:void(0);");
      button.setAttribute("onclick","confirm(\'" + address + "\'," + id + ")");
      button.innerHTML = "Confirm";
      tmp.appendChild(button);
      var subscribebutton = document.createElement("button");
      subscribebutton.setAttribute("href","javascript:void(0);");
      subscribebutton.setAttribute("onclick","subscribe(\'" + address + "\')");
      subscribebutton.innerHTML = "Subscribe";
      tmp.appendChild(subscribebutton);
    }
  )
}

function listOrders(address){
  var resource = WeSource.at(address);
  var tmp = document.getElementById("orders");
  tmp.innerHTML= "";
  resource.nrequests().then( function (res ) {
    for (i = 0; i < res; i++) {
    var button = document.createElement("button");
    button.setAttribute("href","javascript:void(0);");
    button.setAttribute("onclick","orderDetails(\'" + address + "\'," + i + ")");
    button.innerHTML = i;
    tmp.appendChild(button);
    }

  })
}

function confirm(address,id){
  var res = WeSource.at(address);
  res.confirm(id, {from:account, gas:2100000});
  orderDetails( address, id );
}


function subscribe( address ){
    var res = WeSource.at(address);
    var event = res.NewRequest();
    event.watch(function(error, result){
    // result will contain various information
    // including the argumets given to the Deposit
    // call.
    if (!error)
        alert(JSON.stringify(result));
    });
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


    request("pizza","10", "1", {from:account, gas:2100000});
    request("pizza","20", "20", {from:account, gas:2100000});
    request("pasta","10", "10", {from:account, gas:2100000});

    refresh();
  });
}
