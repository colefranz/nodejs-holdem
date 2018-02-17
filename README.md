If you are using nvm you can set up your npm environment using `nvm use`, otherwise I used version
8.9.3.

I did the project without using any libraries. So just run `node index.js` and you're free. If you
want to run the unit tests you will want to `yarn install` first to get mocha and then use `yarn test`.

Downfalls:
* Hand and cards ended up being pretty much the same thing so they could have been joined.
* Definitely would want to pull all of the `detector`s out into separate classes that all extend
from a common interface
