import * as fs from "fs";
import { promisify } from 'util'
import { spawnSync } from 'child_process'
import builtins from "builtin-modules";
import process from "process";


const banner =
`/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/
`;


const read = promisify(fs.readFile)
const write = promisify(fs.writeFile)

async function getPackages() {
    const data = (await read('imports.txt')).toString()
    let packages = data.split(/\r\n|\r|\n/);
    packages = packages.filter((x) => Boolean(x))
    return packages
}

async function buildImports(packages) {
    const code = packages.map((p) => `packages['${p}'] = require('${p}')`).join("\n")

    const output = `export var packages = {}; ${code}`
    await write("imports.js", output)
}

async function installImports(packages) {
    packages.map((p) => {
        console.log(`Installing ${p}...`)
        let proc = spawnSync("npm", ["install", p])
        if (proc.status != 0) {
            console.error(proc.stderr.toString())
            throw new Error(`npm install failed for ${p}`)
        }
    })}

import esbuild from "esbuild";
const context = await esbuild.context({
	banner: {
		js: banner,
	},
	entryPoints: ["imports.js"],
	bundle: true,
	external: [
		"obsidian",
		"electron",
		"@codemirror/autocomplete",
		"@codemirror/collab",
		"@codemirror/commands",
		"@codemirror/language",
		"@codemirror/lint",
		"@codemirror/search",
		"@codemirror/state",
		"@codemirror/view",
		"@lezer/common",
		"@lezer/highlight",
		"@lezer/lr",
		...builtins],
	format: "cjs",
	target: "es2018",
	logLevel: "info",
	sourcemap: "inline",
	treeShaking: true,
	outfile: "imports_bundled.js",
	minify: false,
});

const packages = await getPackages()
await buildImports(packages)
console.log("Installing packages...")
await installImports(packages)
console.log("Building imports_bundled.js")
await context.rebuild();
console.log("Finished")
process.exit(0)
