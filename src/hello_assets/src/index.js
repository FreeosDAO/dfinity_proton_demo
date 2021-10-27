import { hello } from "../../declarations/hello";
import { ConnectWallet } from "@proton/web-sdk";
import { AuthClient } from "@dfinity/auth-client"


let signedIn = false
let client
let principal = ""
let proton_account = ""


document.getElementById("storeUserDfinityBtn").addEventListener("click", async () => {

  // dummy variables - for testing
  // let proton_account1 = "arnoldlayne";
  // let name_value = nameToUint64(proton_account);
  // let principal_id1 = "jni4i-spimh-lkiau-m2ke6-pg7db-qi3ql-cop5r-nc4sh-z7p5e-gu5md-lqe";

  const reply = await hello.storeid(proton_account, principal);
  console.log("Return from storeid: " + reply);
  document.getElementById("storeDfinityResult").innerText = reply;

});

document.getElementById("storeUserProtonBtn").addEventListener("click", async () => {

  // Send Transaction to Proton
		
  const result = await session.transact({
    transaction: {
      actions: [
        {
          // Token contract for btc records
          account: "cronacle",
          // Action name
          name: "storeid",
          // Action parameters
          data: {
            user: session.auth.actor,
            principal: principal
          },
          authorization: [session.auth],
        },
      ],
    },
    broadcast: true,
  });
  document.getElementById("storeProtonResult").innerText = "Stored " + session.auth.actor + " / " + principal;

});


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
});

// Constants
const appIdentifier = "cronacle";
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
});

document.getElementById("storeBTCpriceBtn").addEventListener("click", async () => {
  var request = new XMLHttpRequest() // inserted the CoinGecko stuff from prior
		let btc_value = "";

		// Open a new connection, using the GET request on the URL endpoint
		request.open('GET', 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin', true)

		request.onload = function () {
		// Begin accessing JSON data here
		var newdata = JSON.parse(this.response)
		console.log(newdata)

		newdata.forEach((object) => {
			console.log(object.name)
			console.log(object.current_price)
			// `vm.a` is now reactive
			document.getElementById('BTCprice').innerHTML = object.current_price + ' is the price of Bitcoin' // this displays the price up in the template.  There might be a more Vue way to do this, but I don't know how.
			btc_value = object.current_price;
		})

		// store the value
		// Send Transaction
		const result = session.transact({
			transaction: {
				actions: [
					{
						// Token contract for btc records
						account: "cronacle",
						// Action name
						name: "storebtc",
						// Action parameters
						data: {
							btcprice: btc_value
						},
						authorization: [session.auth],
					},
				],
			},
			broadcast: true,
		});
		// console.log("Transaction ID", result.processed.id);
    }
    
    // document.getElementById("BTCprice").innerText = 'The price of Bitcoin is ' + btc_value;

		// Send request
		request.send()
});