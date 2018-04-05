/*!
*
* The MIT License (MIT)
*
* Copyright (C) 2018 Jimmy Dahlqvist
*
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy,
* modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software
* is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
* LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
* IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


exports.handler = function (event, context, callback) {
    console.log("Input: ", JSON.stringify(event));

    // Get the entire CloudFront Request.
    // https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-event-structure.html#lambda-event-structure-request
    var request = event.Records[0].cf.request;

    var viewerPath = getViewerPath(request)
    var countryPath = getCountryPath(request)

    // Fetch the uri from the request
    var uri = request.uri

    // Rewrite the url to switch urls ending with / to /index.html
    uri = '/' + viewerPath + '/' + countryPath + uri

    // Replace the uri in the request
    request.uri = uri

    console.log("Output: ", JSON.stringify(request));
    // Return to CloudFront
    return callback(null, request)
};

function getCountryPath(cfRequest) {
    // Get the country code
    var country = cfRequest.headers['cloudfront-viewer-country'][0].value

    // Limited support
    if (country != 'SE') {
        return 'default'
    } else {
        return country
    }
}

function getViewerPath(cfRequest) {
    // read cloudfront-is-*-viewer from headers
    var isDesktop = cfRequest.headers['cloudfront-is-desktop-viewer'][0].value == 'true'
    var isMobile = cfRequest.headers['cloudfront-is-mobile-viewer'][0].value == 'true'
    var isSmartTv = cfRequest.headers['cloudfront-is-smarttv-viewer'][0].value == 'true'
    var isTablet = cfRequest.headers['cloudfront-is-tablet-viewer'][0].value == 'true'

    if (isMobile) {
        return 'mobile'
    } else if (isTablet) {
        return 'tablet'
    } else if (isDesktop) {
        return 'desktop'
    } else if (isSmartTv) {
        return 'tv'
    } else {
        return 'default'
    }
}