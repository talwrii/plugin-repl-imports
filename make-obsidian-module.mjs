import esbuild from "esbuild";
import builtins from "builtin-modules";
import * as fs from "fs";
import { promisify } from 'util'
import { spawnSync } from 'child_process'


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
    const imports = packages.map((p) => `import * as ${p} from '${p}'`).join("\n")
    const exports = packages.map((p) => `export const ${p} = ${p}`).join("\n")

    const output = `${imports}\n${exports}`
    await write("imports.ts", output)
}

async function installImports(packages) {
    packages.map((p) => {
        let status = spawnSync("npm", ["install", p])
        if (status != 0) {
            new Error(`npm install failed for ${p}`)
        }
    })}

const context = await esbuild.context({
	banner: {
		js: banner,
	},
	entryPoints: ["imports.ts"],
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
	outfile: "imports.js",
	minify: false,
});

const packages = await getPackages()
await buildImports(packages)
await installImports(packages)
await context.rebuild();