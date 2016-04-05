# JS Sandbox

JS Sandbox yet another JavaScript sandbox akin to [jsbin](http://jsbin.com/), [jsfiddle](https://jsfiddle.net/), and [Codepen](http://codepen.io/). Its intended to help developers share small bits of code with each other in order to help each other debug problems. The main philosophical difference of JS Sandbox vs those is more focus on debuggability, reproducibility, and simplicity. JS Sandbox will:

* preserve correct line numbers inside of stacktraces
* not insert or generate any code the author didn't write
* allow easy exporting of the source code as a zip file