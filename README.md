# JSON Command Line Tool

A command-line tool built in [Node.js](http://nodejs.org/) for reformatting
(pretty-printing) JSON.
Useful when working with JSON files, e.g. if consuming or developing JSON RESTful APIs.

There are surely other (and probably better!) tools like this out there in the node.js
ecosystem.
I'm creating this one for myself; partly to meet a need but more to experiment and learn.


## Using the Tool

Installing this tool will give you a `json` command on your command line.
To install, navigate to the source directory and enter:

```
npm install -g
```

Once installed, you can type `json --help` for usage information.

Examples:

```
# Reformat the package.json into a single line.
json -i 0 package.json

# Format a single-line response from an API call to make it readable.
curl http://api.example.com | json
```


## License

Created under the MIT license. See the LICENSE file for full details.
