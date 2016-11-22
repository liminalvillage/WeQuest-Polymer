pragma solidity ^0.4.2;

contract mortal {
    /* Define variable owner of the type address*/
    address owner;

    /* this function is executed at initialization and sets the owner of the contract */
    function mortal() { owner = msg.sender; }

    /* Function to recover the funds on the contract */
    function kill() { if (msg.sender == owner) suicide(owner); }
}



contract WeSource is mortal
{
    //enum Status {requested, claimed, completed}

    struct Request {
        address requester;
        uint8 amounts;
        string lat;
        string lon;
        uint status;
    }    
    
    Request[] public requests;
    
    bytes32 public label;
    uint public nrequests; // Current demand of resource 
    
    event NewRequest(bytes32 _label ,string lat,string lon);

    function WeSource(bytes32 _label)
    {
        nrequests = 0;
        label = _label;
    } 
    
    function request(string lat, string lon)
    {

        requests.push(Request (msg.sender, 1 , lat, lon, 0 ));
        nrequests += 1;
        //Notify listeners
        NewRequest(label,lat,lon);
    }
    
    function bookrequest(uint id)
    {
      //Add escrow here!

      //Remove request from the active list
      requests[id] = requests[nrequests]; //Copy last item to position 

      //WARNING: whatif someone sends a tender result for the same item at the same time is replaced?
      delete requests[nrequests]; //delete last item
      nrequests -= 1;
    }

    function confirm(uint id)
    {
        Request order = requests[id];
        order.status = 2; //Status.completed;
        //Transfer agreed amount from requester to supplier
        //remove request from active list

    }
}


contract WeQuest is mortal
{   
    mapping (bytes32 => int256) public toId ;
    mapping (int256 => address) public toAddress;
    
    int256 public nresources;
    
    function WeQuest()
    {
      nresources = 0;
    }
    
    event NewWeSource(bytes32 _label);
    
    // check if resource exists. If so, send order to resource, otherwise it should first create the resource and then send an order to it.
    function request(bytes32 label, string lat, string lon) returns (bool success) 
    {   
        //bytes32 label = sha3(_label);
        int256 id = toId[label];
        if (id > 0x0)
        {
           WeSource res = WeSource(toAddress[id]);
           res.request(lat,lon);
        }
        else
        {
            nresources += 1;
            WeSource newres = new WeSource(label);
            newres.request(lat,lon);
            toAddress[nresources] = newres;
            toId[label] = nresources;
            NewWeSource(label);
        }
        return true;
    }
    
    // function listResources() returns (uint256[10] )
    // {
    //   uint256[10] ret ;
    //   for(uint256 i=0; i < 10; i++)
    //     {
    //         Resource res = Resource(toAddress[int256(i)]);
    //         ret[i]= res.norders;
    //     }   
    //     return ret;
    // }

    
}

