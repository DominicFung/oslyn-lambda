
var AWS2 = (function () {
  /* eslint-disable */

  var CryptoJs_ = (function () {
    var window = {};
    var Crypto = undefined;
    /**
     * Crypto-JS v2.5.3
     * http://code.google.com/p/crypto-js/
     * (c) 2009-2012 by Jeff Mott. All rights reserved.
     * http://code.google.com/p/crypto-js/wiki/License
     */
    (typeof Crypto=="undefined"||!Crypto.util)&&function(){var d=window.Crypto={},k=d.util={rotl:function(b,a){return b<<a|b>>>32-a},rotr:function(b,a){return b<<32-a|b>>>a},endian:function(b){if(b.constructor==Number)return k.rotl(b,8)&16711935|k.rotl(b,24)&4278255360;for(var a=0;a<b.length;a++)b[a]=k.endian(b[a]);return b},randomBytes:function(b){for(var a=[];b>0;b--)a.push(Math.floor(Math.random()*256));return a},bytesToWords:function(b){for(var a=[],c=0,e=0;c<b.length;c++,e+=8)a[e>>>5]|=(b[c]&255)<<
      24-e%32;return a},wordsToBytes:function(b){for(var a=[],c=0;c<b.length*32;c+=8)a.push(b[c>>>5]>>>24-c%32&255);return a},bytesToHex:function(b){for(var a=[],c=0;c<b.length;c++)a.push((b[c]>>>4).toString(16)),a.push((b[c]&15).toString(16));return a.join("")},hexToBytes:function(b){for(var a=[],c=0;c<b.length;c+=2)a.push(parseInt(b.substr(c,2),16));return a},bytesToBase64:function(b){if(typeof btoa=="function")return btoa(g.bytesToString(b));for(var a=[],c=0;c<b.length;c+=3)for(var e=b[c]<<16|b[c+1]<<
        8|b[c+2],p=0;p<4;p++)c*8+p*6<=b.length*8?a.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e>>>6*(3-p)&63)):a.push("=");return a.join("")},base64ToBytes:function(b){if(typeof atob=="function")return g.stringToBytes(atob(b));for(var b=b.replace(/[^A-Z0-9+\/]/ig,""),a=[],c=0,e=0;c<b.length;e=++c%4)e!=0&&a.push(("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(b.charAt(c-1))&Math.pow(2,-2*e+8)-1)<<e*2|"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(b.charAt(c))>>>
        6-e*2);return a}},d=d.charenc={};d.UTF8={stringToBytes:function(b){return g.stringToBytes(unescape(encodeURIComponent(b)))},bytesToString:function(b){return decodeURIComponent(escape(g.bytesToString(b)))}};var g=d.Binary={stringToBytes:function(b){for(var a=[],c=0;c<b.length;c++)a.push(b.charCodeAt(c)&255);return a},bytesToString:function(b){for(var a=[],c=0;c<b.length;c++)a.push(String.fromCharCode(b[c]));return a.join("")}}}();
        Crypto = window.Crypto;
        (function(){var d=Crypto,k=d.util,g=d.charenc,b=g.UTF8,a=g.Binary,c=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,
          2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],e=d.SHA256=function(b,c){var f=k.wordsToBytes(e._sha256(b));return c&&c.asBytes?f:c&&c.asString?a.bytesToString(f):k.bytesToHex(f)};e._sha256=function(a){a.constructor==String&&(a=b.stringToBytes(a));var e=k.bytesToWords(a),f=a.length*8,a=[1779033703,3144134277,
            1013904242,2773480762,1359893119,2600822924,528734635,1541459225],d=[],g,m,r,i,n,o,s,t,h,l,j;e[f>>5]|=128<<24-f%32;e[(f+64>>9<<4)+15]=f;for(t=0;t<e.length;t+=16){f=a[0];g=a[1];m=a[2];r=a[3];i=a[4];n=a[5];o=a[6];s=a[7];for(h=0;h<64;h++){h<16?d[h]=e[h+t]:(l=d[h-15],j=d[h-2],d[h]=((l<<25|l>>>7)^(l<<14|l>>>18)^l>>>3)+(d[h-7]>>>0)+((j<<15|j>>>17)^(j<<13|j>>>19)^j>>>10)+(d[h-16]>>>0));j=f&g^f&m^g&m;var u=(f<<30|f>>>2)^(f<<19|f>>>13)^(f<<10|f>>>22);l=(s>>>0)+((i<<26|i>>>6)^(i<<21|i>>>11)^(i<<7|i>>>25))+
              (i&n^~i&o)+c[h]+(d[h]>>>0);j=u+j;s=o;o=n;n=i;i=r+l>>>0;r=m;m=g;g=f;f=l+j>>>0}a[0]+=f;a[1]+=g;a[2]+=m;a[3]+=r;a[4]+=i;a[5]+=n;a[6]+=o;a[7]+=s}return a};e._blocksize=16;e._digestsize=32})();
              (function(){var d=Crypto,k=d.util,g=d.charenc,b=g.UTF8,a=g.Binary;d.HMAC=function(c,e,d,g){e.constructor==String&&(e=b.stringToBytes(e));d.constructor==String&&(d=b.stringToBytes(d));d.length>c._blocksize*4&&(d=c(d,{asBytes:!0}));for(var f=d.slice(0),d=d.slice(0),q=0;q<c._blocksize*4;q++)f[q]^=92,d[q]^=54;c=c(f.concat(c(d.concat(e),{asBytes:!0})),{asBytes:!0});return g&&g.asBytes?c:g&&g.asString?a.bytesToString(c):k.bytesToHex(c)}})();

    return window.Crypto;
  })()

  /**
   * Returns signature for request
   * http://docs.aws.amazon.com/general/latest/gr/signature-v4-examples.html
   * @param {string} key Your secret access key
   * @param {string} dateStamp Date in YYYYMMDD format
   * @param {string} regionName AWS region (e.g. 'us-east-1')
   * @param {string} serviceName AWS service name (e.g. 'ec2', 'iam', 'codecommit', api)
   * @param {string} stringToSign String to sign
   * @returns {string} Signed string
   */
  function calculateSignature_ (key, dateStamp, regionName, serviceName, stringToSign) {
    var HMAC = CryptoJs_.HMAC;
    var SHA256 = CryptoJs_.SHA256;

    var kDate = HMAC(SHA256, dateStamp, 'AWS4' + key, { asBytes: true });
    var kRegion = HMAC(SHA256, regionName, kDate, { asBytes: true });
    var kService = HMAC(SHA256, serviceName, kRegion, { asBytes: true });
    var kSigning = HMAC(SHA256, 'aws4_request', kService, { asBytes: true });

    return HMAC(SHA256, stringToSign, kSigning, { asBytes: false });
  }
  /* exported getCanonicalFullDate_,  getCanonicalShortDate_ */

  /**
   * Extract number values from ISO date string (https://regex101.com/r/5Ysvdf/1)
   */
  var DATE_VALUES_REGEX_ = new RegExp(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);

  /**
   * Return date and time string
   * @param {Date} date Date
   * @returns {string} Date formated to YYYYMMDDTHHmmssZ
   */
  function getCanonicalFullDate_(date) {
    var match = DATE_VALUES_REGEX_.exec(date.toISOString());
    return match[1] + match[2] + match[3] + 'T' + match[4] + match[5] + match[6] + 'Z';
  }

  /**
   * Return date string
   * @param {Date} date Date
   * @returns {string} Date formated to YYYYMMDD
   */
  function getCanonicalShortDate_(date) {
    var match = DATE_VALUES_REGEX_.exec(date.toISOString());
    return match[1] + match[2] + match[3];
  }
  /* exported getCanonicalQueryString_ */

  /**
   * Returns canonical query string
   * @param {object} query Query key-value object
   * @returns {string} Canonical query string
   */
  function getCanonicalQueryString_(query) {
    var key;
    var queryParts = [];

    for (key in query) {
      if (!query.hasOwnProperty(key)) continue;
      queryParts.push([key, query[key]]);
    }

    return queryParts
      .map(function (part) {
        var value = part[1] != null ? part[1] : '';
        return encodeURIComponent(part[0].trim()) + '=' + encodeURIComponent(value);
      })
      .sort(function (a, b) {
        if (a === b) return 0;
        return (a > b) ? 1 : -1;
      })
      .join('&');
  }
  /* global CryptoJs_ */
  /* exported getCanonicalRequestHash_ */

  /**
   * Returns hashed canonical request
   * @param {string} method HTTP method
   * @param {string} path Request path
   * @param {object} headers Request headers
   * @param {string} queryString Request query string
   * @param {string} payloadString Request payload as string
   * @returns {{
       hashedCanonicalRequest: string,
      signedHeaders: string
    }} hashed canonical request and signed headers
  */
  function getCanonicalRequestHash_(method, path, headers, queryString, payloadString) {
    var canonicalHeaders = [];
    var signedHeaders = [];
    Object.keys(headers)
      .map(function (key) { return [key, headers[key]]; })
      .map(function (header) {
        return [header[0].trim().toLowerCase(), header[1].trim().replace(/\s{2,}/g, ' ')];
      })
      .sort(function (a, b) {
        if (a[0] === b[0]) return 0;
        else return (a[0] > b[0]) ? 1 : -1;
      })
      .forEach(function (header) {
        canonicalHeaders.push(header[0] + ':' + header[1] + '\n');
        signedHeaders.push(header[0]);
      });

    var canonicalHeadersStr = canonicalHeaders.join('');
    var signedHeadersStr = signedHeaders.join(';');
    var normalizedPath = path
      .split(/\//g)
      .map(function (part) {
        return encodeURIComponent(part);
      })
      .join('/');

    var canonicalRequest = [
      method,
      normalizedPath,
      queryString,
      canonicalHeadersStr,
      signedHeadersStr,
      CryptoJs_.SHA256(payloadString)
    ].join('\n');

    return {
      hashedCanonicalRequest: CryptoJs_.SHA256(canonicalRequest),
      signedHeaders: signedHeadersStr
    };
  }
  /* global getCanonicalFullDate_, getCanonicalShortDate_, getCanonicalQueryString_,
            calculateSignature_, getCanonicalRequestHash_, UrlFetchApp */

  /* exported request */

  /**
   * AWS hash algorithm name
   */
  var HASH_ALGORITHM_ = 'AWS4-HMAC-SHA256';

  var AWS_SINGLE_ENDPOINT_ = {
    'cloudfront': 'cloudfront.amazonaws.com',
    'health': 'health.us-east-1.amazonaws.com',
    'iam': 'iam.amazonaws.com',
    'importexport': 'importexport.amazonaws.com',
    'shield': 'shield.us-east-1.amazonaws.com',
    'waf': 'waf.amazonaws.com'
  };

  var getCurrentDate_ = function () {
    return new Date();
  };

  /**
   *  Doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-call-api.html
   *  https format: https://{restapi_id}.execute-api.{region}.amazonaws.com/{stage_name}/
   */
  function setAPIGatewayEndpoint(restapi_id, stage_name) {
    AWS_SINGLE_ENDPOINT_["apigateway"] = `https://${restapi_id}.execute-api.`
  }

  /**
   * Authenticates and sends the given parameters for an AWS api request.
   * @param {{
       accessKey: string,
      secretKey: string,
      service: string,
      region: string,
      path: string,
      query: object,
      method: string,
      headers: object,
      payload: (string|object),
    }} params **The AWS service request parameters**
    - `accessKey` - AWS access key
    - `secretKey` - AWS secret key key
    - `service` - the aws service to connect to (e.g. 'ec2', 'iam', 'codecommit')
    - `region` - (optional) the aws region your command will go to. Defaults to 'us-east-1'.
    - `path` - (optional) the path to api function (without query). Defaults to '/'.
    - `query` - (optional) the query string parameters
    - `method` - (optional) the http method (e.g. 'GET', 'POST'). Defaults to GET.
    - `headers` - (optional) the headers to attach to the request. Host and X-Amz-Date are premade
    for you.
    - `payload` - (optional) the payload to send. Defaults to ''.
  * @returns {HTTPResponse} HTTPResponse object
  */
  function request(params) {
    var temp;

    if (params.accessKey == null) {
      throw new Error('Access key undefined');
    } else if (params.secretKey == null) {
      throw new Error('Secret key undefined');
    } else if (params.service == null) {
      throw new Error('Service undefined');
    }

    var accessKey = params.accessKey;
    var secretKey = params.secretKey;
    var service = params.service.toLowerCase();
    var region = params.region ? params.region.toLowerCase() : 'us-east-1';
    var path = params.path || '/';
    var query = params.query || {};
    var method = (params.method || 'GET').toUpperCase();
    var headers = params.headers || {};
    var payload = params.payload || '';

    var host = AWS_SINGLE_ENDPOINT_[service]
      ? AWS_SINGLE_ENDPOINT_[service]
      : service + '.' + region + '.amazonaws.com';

    if (path.substring(0, 1) !== '/') {
      path = '/' + path;
    }

    var payloadString = '';
    if (typeof payload !== 'string') {
      payloadString = JSON.stringify(payload);
    }

    var curDate = getCurrentDate_();
    var dateStringFull = getCanonicalFullDate_(curDate); // 20150830T123600Z
    var dateStringShort = getCanonicalShortDate_(curDate); // 20150830
    var queryString = getCanonicalQueryString_(query);

    headers['Host'] = host;
    headers['X-Amz-Date'] = dateStringFull;

    // Task 1: Create a Canonical Request for Signature
    // http://docs.aws.amazon.com/general/latest/gr/sigv4-create-canonical-request.html

    temp = getCanonicalRequestHash_(method, path, headers, queryString, payloadString);
    var hashedCanonicalRequest = temp.hashedCanonicalRequest;
    var signedHeaders = temp.signedHeaders;

    // Task 2: Create a String to Sign for Signature
    // http://docs.aws.amazon.com/general/latest/gr/sigv4-create-string-to-sign.html

    var credentialScope = dateStringShort + '/' + region + '/' + service + '/aws4_request';

    var stringToSign = [
      HASH_ALGORITHM_,
      dateStringFull,
      credentialScope,
      hashedCanonicalRequest
    ].join('\n');

    // Task 3: Calculate the Signature
    // http://docs.aws.amazon.com/general/latest/gr/sigv4-calculate-signature.html

    var signature = calculateSignature_(secretKey, dateStringShort, region, service, stringToSign);

    // Task 4: Add the Signing Information to the Request
    // http://docs.aws.amazon.com/general/latest/gr/sigv4-add-signature-to-request.html

    headers['Authorization'] = [
      HASH_ALGORITHM_ + ' Credential=' + accessKey + '/' + credentialScope,
      'SignedHeaders=' + signedHeaders,
      'Signature=' + signature
    ].join(', ');

    // Sending request

    delete headers['Host'];  // fetch will add Host header
    var fetchOptions = {
      method: method,
      headers: headers,
      muteHttpExceptions: true,
      payload: payloadString
    };

    var uri = 'https://' + host + path + (queryString ? '?' + queryString : '');

    return UrlFetchApp.fetch(uri, fetchOptions);
  }

  return { request: request, setAPIGatewayEndpoint: setAPIGatewayEndpoint }
})()