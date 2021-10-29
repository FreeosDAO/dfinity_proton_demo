import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

actor {

    let users = HashMap.HashMap<Text, Text>(16, Text.equal, Text.hash);

    public func greet(name : Text) : async Text {
        return "Hello, " # name # "!";
    };

    public func storeid(proton_account : Text, principal_id : Text) : async Text {
        
        users.put(proton_account, principal_id);

        let numusers = users.size();

        return proton_account # " / " # principal_id # " (" # Nat.toText(numusers) # " users)";
    };

    public func getuser(name : Text) : async Text {

        let p_id = users.get(name);

        switch(p_id) {
            case(?existingEntry) {
                return existingEntry;
            };
            case(null) { 
                return name # " not found";
            };
        };
    };

    
    public func getusers() : async Text {

        let numusers = users.size();

        return Nat.toText(numusers);
    };

    
};
