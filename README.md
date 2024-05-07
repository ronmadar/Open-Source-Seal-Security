# SEAL SECURITY PROJECT : Open Source Engineer Task


# Create new version of package tough-cookie V2.5.0 ,for fix critical vulnerability CVE-2023-26136, project written in Node.js V20 

Versions of the package tough-cookie before 4.1.3 are vulnerable to Prototype Pollution due to improper handling of Cookies when using CookieJar in rejectPublicSuffixes=false mode. This issue arises from the manner in which the objects are initialized. 

https://nvd.nist.gov/vuln/detail/CVE-2023-26136


Prototype Pollution is a vulnerability affecting JavaScript. Prototype Pollution refers to the ability to inject properties into existing JavaScript language construct prototypes, such as objects. JavaScript allows all Object attributes to be altered, including their magical attributes such as __proto__, constructor and prototype. An attacker manipulates these attributes to overwrite, or pollute, a JavaScript application object prototype of the base object by injecting other values. Properties on the Object.prototype are then inherited by all the JavaScript objects through the prototype chain. When that happens, this leads to either denial of service by triggering JavaScript exceptions, or it tampers with the application source code to force the code path that the attacker injects, thereby leading to remote code execution

There are two main ways in which the pollution of prototypes occurs:
* Unsafe Object recursive merge
* Property definition by path

important not: https://github.com/salesforce/tough-cookie/issues/282
https://security.snyk.io/package/npm/tough-cookie/2.5.0


=> To fix the vulnerability in the MemoryCookieStore class, you need to modify the putCookie method to prevent prototype pollution when cookie.domain is set to __proto__. 

https://github.com/salesforce/tough-cookie/pull/283


1.
a. Change tough_cookie_2.5.0\node_modules\tough-cookie\lib\memstore.js 
   All occurrences of new object creation in `memstore.js` have been changed from {}  `Object.create(Object.prototype)` to `Object.create(null)` 
   so that we are using object instances that do not have a prototype property that can be polluted.

  * Example : console.log(a = Object.create(null)); in object a - No properties(or __ proto __)
  
b. Created a new , /node_modules/tough-cookie/lib/test-unit.js
   use in vanillajs for it found in tests folder file cookie_jar_test.js "Issue #282 - Prototype pollution"
   COMMAND: node test-unit.js 
   
c. Created a new file,/node_modules/tough-cookie/lib/testVerifyVulnerable.js
   verify the vulnerable behavior was fixed.
   COMMAND: node testVerifyVulnerable.js

2. change.diff : https://github.com/ronmadar/Open-Source-Seal-Security/blob/cf768f1932f087c30ebec7fe60c3fca323b4e54b/change.diff

3. 
a. Regular package tough-cookie V 2.5.0 , Command: 
npm install tough-cookie@2.5.0 && node index.js

b. Compress package tough-cookie V 2.5.0 tgz format with changes  Command: 
npm install ./tough-cookie-2.5.0-PATCHED.tgz && node
index.js

c.
- Vulnerability: The vulnerability arises from directly modifying the Object.
  prototype by adding a new property newProperty. 
  This means that every object in the JavaScript environment will inherit this property,
  potentially altering their behavior unintentionally.

- Potential Damage:
* Prototype Pollution: 
  By adding properties directly to Object. prototype, there's a risk of polluting the entire prototype chain. 
  This can lead to unexpected behavior across the application, as any object that traverses the prototype chain may be affected.
* Security Risks: In a web application context, prototype pollution can be exploited by attackers to manipulate objects 
  and properties, potentially leading to security vulnerabilities such as privilege escalation, information leakage.

* Compatibility Issues: Modifying core prototypes like Object.
  prototype can introduce compatibility issues with other libraries or frameworks that rely on standard behavior.
  This can cause errors or unexpected behavior when integrating or updating dependencies.
d. wrote above.


4. A link to your forked GitHub repository of tough-cookie 2.5.0 
   https://github.com/ronmadar/tough-cookie


How to install this project

1. clone this project
