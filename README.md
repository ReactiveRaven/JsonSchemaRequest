# JsonSchemaRequest

Allows making requests based on json hyper schema endpoints. Currently a work in progress.

[![Stability:Experimental](https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square&maxAge=2592000)](https://nodejs.org/api/documentation.html#documentation_stability_index)
[![NPM Version](https://img.shields.io/npm/v/json-schema-request.svg?style=flat-square&maxAge=3600)](https://www.npmjs.com/package/json-schema-request)
[![Travis](https://img.shields.io/travis/ReactiveRaven/JsonSchemaRequest.svg?style=flat-square&maxAge=3600)](https://travis-ci.org/ReactiveRaven/JsonSchemaRequest)
[![Issues](https://img.shields.io/github/issues/reactiveraven/jsonschemarequest.svg?style=flat-square&maxAge=3600)](https://github.com/reactiveraven/JsonSchemaRequest/issues)

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square&maxAge=2592000)](http://commitizen.github.io/cz-cli/)
[![Semantic Release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square&maxAge=2592000)](https://github.com/semantic-release/semantic-release)
[![License](https://img.shields.io/npm/l/json-schema-request.svg?style=flat-square&maxAge=2592000)](http://spdx.org/licenses/MIT)
[![Maintenance](https://img.shields.io/maintenance/yes/2016.svg?maxAge=2592000&style=flat-square&maxAge=2592000)](https://github.com/reactiveraven/JsonSchemaRequest/issues)
[![Downloads](https://img.shields.io/npm/dm/json-schema-request.svg?style=flat-square&maxAge=25200)](https://www.npmjs.com/package/json-schema-request)

**Installation:**

```shell
npm install json-schema-request
```

**Usage:**

example.js
```js
import jsonSchemaRequest from 'json-schema-request';

const myPartialBlogPost = {
    id: 42,
    author: "marvin"
};

jsonSchemaRequest({
    schemaUrl: "http://www.example.com/blog-post.json",
    rel: "self",
    context: myPartialBlogPost
})
    .then(result => console.log);

// {
//     id: 42,
//     author: "marvin",
//     title: "Of diodes and doors",
//     body: "...down the left hand side..."
// }
```

blog-post.json
```json
{
    "id": "http://www.example.com/blog-post.json",
    "type": "object",
    "properties": {
        "id": { "type": "number" },
        "author": { "type": "string" },
        "title": { "type": "string" },
        "body": { "type": "string" }
    },
    "required": [ "title", "author", "id" ],
    "links": [
        {
            "rel": "self",
            "href": "http://www.example.com/api/post/{id}",
            "method": "GET",
            "targetSchema": { "$ref": "#" }
        }
    ]
}
```

The schema for the json object passed to jsonSchemaRequest is available in `schema/inputSchema.json`. The options are documented below as well:

| Option | Required | Description |
|----|----|----|
| schemaUrl | Yes | URL to load the schema from. References inside this schema that point to other files are also loaded, and inlined. |
| rel | Yes | Relationship name for link to request. This is defined in your schema. |
| context | | Context data to insert into urls (eg 'id' in example above) |
| data | | Data to send along with the request (eg the body for 'create' rels) |
| serverRoot | | The URL to prefix on schema IDs if missing. If you prefer to use relative URLs for your `schemaUrl` this sets the server and path those relative URLs are attached to. |
