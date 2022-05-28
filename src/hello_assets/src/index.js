import { hello } from "../../declarations/hello";
import { ConnectWallet } from "@proton/web-sdk";
import { AuthClient } from "@dfinity/auth-client"
const { JsonRpc, Api } = require('eosjs');


let signedIn = false
let client
let principal = ""
let proton_account = ""
let chain = "dfinity"
let btc_price = 0;

const rpc = new JsonRpc("https://protontestnet.greymass.com", { fetch })


async function getBTCPrice() {
  var request = new XMLHttpRequest()

  // Open a new connection, using the GET request on the URL endpoint
  request.open('GET', 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin', true)

  request.onload = function () {
    // Begin accessing JSON data here
    var newdata = JSON.parse(this.response)
    
    newdata.forEach((object) => {
      console.log("object name: " + object.name)
      console.log("object current_price: " + object.current_price)
      console.log("object symbol: " + object.symbol)
      if (object.symbol == 'btc') {
        console.log("btc symbol found: setting btc_price to " + object.current_price)
        btc_price = object.current_price;
      }
    })

  } // end of request.onload

  // Send request
  request.send()

}

// get BTCprice button
document.getElementById("storeBTCpriceBtn").addEventListener("click", async () => {
  await getBTCPrice();
  console.log("After Calling getBTCPrice(), price = " + btc_price)

  document.getElementById('BTCprice').innerHTML = 'Bitcoin price: ' + btc_price // this displays the price up in the template
      
  // store the value
  // Send Transaction
  if (session) {  // if logged in to Proton
    const result = session.transact({
      transaction: {
        actions: [
          {
            // Token contract for btc records
            account: "dfinityclaim",
            // Action name
            name: "storebtc",
            // Action parameters
            data: {
              btcprice: btcPrice
            },
            authorization: [session.auth],
          },
        ],
      },
      broadcast: true,
    });
  } // end if if (session)

});

// register button
document.getElementById("registerBtn").addEventListener("click", async () => {

  // get the chain the user has selected
  chain = document.getElementById("chainSelect").value;

  // register on dfinity
  const reply = await hello.storeuser(proton_account, principal, chain);
  console.log("Return from storeuser: " + reply);
  document.getElementById("registerResult").innerText = reply;

  // register on Proton
  const result = await session.transact({
    transaction: {
      actions: [
        {
          // Proton smart contract for dfinity claim
          account: "dfinityclaim",
          // Action names
          name: "reguser",
          // Action parameters
          data: {
            user: session.auth.actor,
            principal: principal,
            chain: chain
          },
          authorization: [session.auth],
        },
      ],
    },
    broadcast: true,
  });
  document.getElementById("registerResult").innerText = "Registered as account " + session.auth.actor + ", principal " + principal + ", chain " + chain;

});

document.getElementById("dfinityGetBtn").addEventListener("click", async () => {

  const reply = await hello.fetchuser(proton_account);
  console.log("Return from fetchuser: " + reply);
  document.getElementById("dfinityGetResult").innerText = reply;

});


// Proton get user
document.getElementById("protonGetBtn").addEventListener("click", async () => {

  console.log('looking up Proton user record for ' + proton_account);
  // get the user record
  let system_params = {
              json: true,
              code: 'dfinityclaim',   // account containing smart contract
              scope: 'dfinityclaim',  // the subset of the table to query
              table: 'users',         // the name of the table
              lower_bound: proton_account,
              upper_bound: proton_account,
              limit: 1                // limit on number of rows returned
      }

  let user_result = await rpc.get_table_rows(system_params);

  let proton_principal = user_result.rows[0].dfinity_principal;
  let proton_chain = user_result.rows[0].chain;
  let proton_balance = user_result.rows[0].balance;
  let userSummary = "Proton: " + proton_account + " principal: " + proton_principal + " chain: " + proton_chain + " balance: " + proton_balance;

  console.log("Return from proton user read: " + userSummary);
  document.getElementById("protonGetResult").innerText = userSummary;

});

// update balances
async function updateBalances() {

  console.log("Proton account = >" + proton_account + "<")
  let proton_balance_str = "0"
  let ic_balance_str = "0"

  // proton balance
  if (proton_account != "") {
    // get balance
    let user_params = {
      json: true,
      code: 'dfinityclaim',   // account containing smart contract
      scope: 'dfinityclaim',  // the subset of the table to query
      table: 'users',         // the name of the table
      lower_bound: proton_account,
      upper_bound: proton_account,
      limit: 1                // limit on number of rows returned
    }

    let result = await rpc.get_table_rows(user_params);
    let proton_balance = result.rows[0].balance;
    proton_balance_str = proton_balance.toString()
    console.log(proton_balance_str)
  }

  // IC balance
  ic_balance_str = await hello.get_balance(proton_account);

  // update display
  document.getElementById("proton_balance").innerText = proton_balance_str;
  document.getElementById("ic_balance").innerText = ic_balance_str;
  
}

document.getElementById("claimBtn").addEventListener("click", async () => {

  chain = document.getElementById("chainSelect").value;

  // claim on dfinity
  if (chain == "dfinity") {
    const reply = await hello.claim(proton_account);
    console.log("Return from dfinity claim: " + reply);
    document.getElementById("claimResult").innerText = reply;
  }

  // claim on Proton
  if (chain == "proton") {
    // get balance before
    let user_params = {
      json: true,
      code: 'dfinityclaim',   // account containing smart contract
      scope: 'dfinityclaim',  // the subset of the table to query
      table: 'users',         // the name of the table
      lower_bound: proton_account,
      upper_bound: proton_account,
      limit: 1                // limit on number of rows returned
    }

    let before_result = await rpc.get_table_rows(user_params);
    console.log(before_result);
    let before_balance = before_result.rows[0].balance;

    const result = await session.transact({
      transaction: {
        actions: [
          {
            // Proton smart contract for dfinity claim
            account: "dfinityclaim",
            // Action names
            name: "claim",
            // Action parameters
            data: {
              user: session.auth.actor
            },
            authorization: [session.auth],
          },
        ],
      },
      broadcast: true,
    });

    let after_result = await rpc.get_table_rows(user_params);
    let after_balance = after_result.rows[0].balance;

    document.getElementById("claimResult").innerText = "claim successful, Proton balance " + before_balance + " → " + after_balance;
  }
  });

  document.getElementById("mintBtn").addEventListener("click", async () => {

    // get Freeos balance before
    let user_params = {
      json: true,
      code: 'freeostokens',   // account containing smart contract
      scope: proton_account,  // the subset of the table to query
      table: 'accounts',      // the name of the table
      limit: 1                // limit on number of rows returned
    }
  
      let before_result = await rpc.get_table_rows(user_params);
      console.log(before_result);
      let before_balance = before_result.rows[0].balance;
  
      // perform the XPR transfer - AND - mint Freeos
      const result = await session.transact({
        transaction: {
          actions: [
            {
              // Proton smart contract
              account: "eosio.token",
              // Action names
              name: "transfer",
              // Action parameters
              data: {
                from: session.auth.actor,
                to: 'freeosgov',
                quantity: '1.0000 XPR',
                memo: 'freeos mint fee'
              },
              authorization: [session.auth],
            },
            {
              // Proton smart contract
              account: "freeosgov",
              // Action names
              name: "mintfreeos",
              // Action parameters
              data: {
                owner: session.auth.actor,
                quantity: '1.0000 POINT'
              },
              authorization: [session.auth],
            }
          ],
        },
        broadcast: true,
      });
  
      let after_result = await rpc.get_table_rows(user_params);
      let after_balance = after_result.rows[0].balance;
  
      document.getElementById("mintResult").innerText = "mint successful, Freeos balance " + before_balance + " → " + after_balance;

});

document.getElementById("chainSelect").addEventListener("change", async () => {

  chain = document.getElementById("chainSelect").value;
  console.log("chain selected: " + chain);

  // update dfinity
  const reply = await hello.switchuser(proton_account, chain);

  // update Proton
  const result = await session.transact({
    transaction: {
      actions: [
        {
          // Proton smart contract for dfinity claim
          account: "dfinityclaim",
          // Action names
          name: "switchchain",
          // Action parameters
          data: {
            user: session.auth.actor,
            chain: chain
          },
          authorization: [session.auth],
        },
      ],
    },
    broadcast: true,
  });

});

function showFunctionTable() {
  if (principal !== "" && proton_account !== "") {
      document.getElementById("functionTable").style.visibility = 'visible';
    } else {
      document.getElementById("functionTable").style.visibility = 'hidden';
    }
}


document.getElementById("dfinitySignInBtn").addEventListener("click", async () => {

  client = await AuthClient.create()
		const isAuthenticated = await client.isAuthenticated()

		if (isAuthenticated) {
		const identity = client.getIdentity()
		principal = identity.getPrincipal().toString()
		console.log("Auth. already authenticated. principal = " + principal)      
		signedIn = true
		}

  const result = await new Promise((resolve, reject) => {
		client.login({
			identityProvider: "https://identity.ic0.app",
			onSuccess: () => {
			const identity = client.getIdentity()
			const principal = identity.getPrincipal().toString()
			resolve({ identity, principal })
			},
			onError: reject,
		})
		})
		principal = result.principal
    console.log("Auth. signed in. principal = " + principal)
    signedIn = true
    
    document.getElementById("principal_id").innerText = principal;

    showFunctionTable();
    
});

// Constants
const appIdentifier = "dfinityclaim";
let link, session;

async function createLink({ restoreSession }) {
  const result = await ConnectWallet({
    linkOptions: {
      endpoints: ["https://protontestnet.greymass.com"],
      restoreSession,
    },
    transportOptions: {
      requestAccount: "dfinity", // Your proton account
      requestStatus: true,
    },
    selectorOptions: {
      appName: "dfinity",
      appLogo:
        "https://freeos.io/freeos-appLogo.svg?v=3",
      customStyleOptions: {
        modalBackgroundColor: "#F4F7FA",
        logoBackgroundColor: "white",
        isLogoRound: true,
        optionBackgroundColor: "white",
        optionFontColor: "black",
        primaryFontColor: "black",
        secondaryFontColor: "#6B727F",
        linkColor: "#752EEB",
      },
    },
  });
  link = result.link;
  session = result.session;
  proton_account = session.auth.actor;
}

document.getElementById("protonSignInBtn").addEventListener("click", async () => {
  // Create link
  await createLink({ restoreSession: false });
  console.log("User authorization:", session.auth); // { actor: 'fred', permission: 'active }
  document.getElementById("proton_account").innerText = session.auth.actor;

  showFunctionTable();
});

