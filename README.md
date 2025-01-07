# Plugin REPL imports
Import and use NPM modules in [Plugin REPL](https://readwithai.substack.com/p/obsidian-plugin-repl)

Plugin REPL is a plugin for the note taking app Obsidian that allows rapid automation of Obsidian from within Obsidian itself. It is also useful for very fast iteration when creating plugins.

This is a "companion repository" if you want to use imported JavaScript library from npm.

# Using
1. Check out this repository into your vault
`git checkout git@github.com:talwrii/plugin-repl-imports.git`
2. Add the npm modules you want to install to `imports.txt`
3. Open a terminal in the checked out repository.
4. Run `npm install`
4. Run `npm run run`
5. Run `module = replRequire("modulename")` in Obsidian with plugin repl. This is like the `require` function in node JavaScript

# A technical explanation
<a name="technical"></a>
You do not need to understand this to use this tool, but if you are interested this is an explanation of how this works.

Obsidian is based on Electron, a tool for creating desktop apps in JavaScript. Electron is based on node js which can import modules with [`require`](https://nodejs.org/api/modules.html#loading-ecmascript-modules-using-require) using the [CommonJS](https://nodejs.org/api/modules.html) module system. This means that some modules (including builtin modules can be accessed with `require`). However, where Obsidian looks for modules is fixed, [cannot be added to](https://github.com/nodejs/node-v0.x-archive/issues/2234) and is readonly.

To get around this plugins are built with the JavaScript "bundler" [esbuild](https://esbuild.github.io/) this embeds a copy of all the code that you import into one big `js` file - similar to the approach that web pages use, but with the exception that some modules are still imported using `require` such as obsidian modules.


This repository uses the same approch.

# Attribution and prior work
This approach is based on how plugins are built for Obsidian, code is directly taken from the MIT-licensed sample plugin repository for Obsidian.
