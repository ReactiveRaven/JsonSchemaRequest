# JsonSchemaRequest

Allows making requests based on json hyper schema endpoints.

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
