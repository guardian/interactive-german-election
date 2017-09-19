# German election results


### Fetching data 

ideally, go to the box:

```
ssh ubuntu@ec2-34-253-108-92.eu-west-1.compute.amazonaws.com
```

then projects > interactive-german-election > src

```
bash bashcrawl
```

this will copy the current contents of the bundeswahlleiter folder into ```daten```

then 

```
gulp deploy
```

which will run crawl.js as part of its render, and also write out tidy.json to data-out (there are a couple of other options in crawl.js for writing out more files to help with debugging). Nothing uses tidy.json, but it may be helpful to switch to it (see comments in crawl.js) toward the end of the project



### Deploying

```
gulp deploy
```

note: please do not deploy to live before the first results are in. live is in a zero state

or, to deploy the exit poll version:

```
gulp deploy --exitpoll
```

edit exitpoll data and copy here:

```
https://docs.google.com/spreadsheets/d/1HT-9mgDgqcpHzI1ivnmwqvbUk-aZWQok5yW5J3x7Mic/edit#gid=1220662438
```












# Interactive atom template

```
npm install
```

### Running locally
```
npm start
```

Go to <http://localhost:8000>

### Deploying
Fill out `config.json`:
```json
{
    "title": "Title of your interactive",
    "docData": "Any associated external data",
    "path": "year/month/unique-title"
}
```

Then run
```
npm run deploy
```

#### Checking the deploy
You can check the deploy log by running
```
npm run log
```
<b>NOTE:</b> Updates can take up to 30 seconds to show in the logs

#### Embedding into Composer
Run the command below, copy the URL into Composer and click embed.
```
npm run url
```

## Usage guide
We use [SASS](http://sass-lang.com/) for better CSS, [Babel](https://babeljs.io/) for next
generation JavaScript and [Rollup](http://rollupjs.org/) for bundling.

Interactive atoms have three components:
- CSS - `src/css/main.scss`
- HTML - `src/render.js` should generate some HTML (by default returns the contents of `src/templates/main.html`)
- JS - `src/js/main.js`, by default this simply loads `src/js/app.js`

### Loading resources (e.g. assets)
Resources must be loaded with absolute paths, otherwise they won't work when deployed.
Use the template string `<%= path %>` in any CSS, HTML or JS, it will be replaced
with the correct absolute path.

```html
<img src="<%= path %>/assets/image.png" />
```

```css
.test {
    background-image: url('<%= path %>/assets/image.png');
}
```

```js
var url = '<%= path %>/assets/image.png';
```

### Atom size
Interactive atoms are baked into the initial page response so you need to be careful about
how much weight you are adding. While CSS and HTML are unlikely to ever be that large,
you should worry about the size of your JS.

The difference between `src/js/main.js` and `src/js/app.js` is that the former is baked into
the page and the latter is not. <b>Never</b> load large libraries (such as d3) in `src/js/main.js`.
In most cases, the majority of the work should happen in `src/js/app.js` and `src/js/main.js`
should be reserved for simple initialisation.
