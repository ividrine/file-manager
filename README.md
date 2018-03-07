# file-manager

Basically windows file explorer but not as good

## Installation 
run `npm install`

In server.js, change line 9 and 10 to reflect your own path, for example

```
const root = 'C:/Users';
const base_dir = '/ividr';
```
then run `npm start`

## API Routes
### Get
#### /api/files
Returns back a list of objects with a structure similar to
```
{
  name: "afilename",
  isDirectory: false,
  path: "/afilename.txt"
}
```
It will also return the current working directory as a string

If the query parameter `path` isn't specified, it will default to returning the contents of `/ividri`

Example `localhost:3000/api/files?path=/ividr/desktop`

### Post
#### /api/create
expects a string `type` and string `path` in the body of the request, for example
```
{
  type: 'file',
  path: '/ividr/desktop/afilename.txt'
}
```

### Delete

#### /api/delete
expects a list of files `files` as well as a directory `dir` in the body of the request

example
```
{
  files: ['/afilename.txt', '/anotherfile.txt'],
  dir: '/ividri/desktop
}
```
